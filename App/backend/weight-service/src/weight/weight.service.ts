import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateWeightDto } from './dto/create-weight.dto';
import { UpdateWeightDto } from './dto/update-weight.dto';
import { PrismaService } from 'src/prisma.service';
import { LoggingService } from 'src/weight/common/services/logging.service';
import { predictWeeksToGoal } from 'src/weight/utils/weight.predictions';
import axios from 'axios';
import { checkWeightGoalFeasibility } from './utils/weight.safety';
import { Prisma } from '@prisma/client';

@Injectable()
export class WeightService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: LoggingService,
  ) {
    this.logger.setContext('WeightService');
  }

  async create(userId: number, createWeightDto: CreateWeightDto) {
    try {
       console.log(createWeightDto)
       // Validate userId
      if (isNaN(userId)) {
        throw new BadRequestException(`Invalid user ID: ${userId}`);
      }

      // Fetch user data via Axios
      const userData = await axios.get(`http://api-users:3000/users/${userId}`);
      if (!userData?.data) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      const userHeight = userData.data.height;
      if (!userHeight || userHeight <= 0) {
        throw new BadRequestException(
          `Invalid height value for user ID ${userId}`,
        );
      }
     

      // Calculate BMI and projected BMI
      createWeightDto.bmi = this.calculateBMI(
        createWeightDto.weight,
        userHeight,
      );
      createWeightDto.projectedBmi = this.calculateBMI(
        createWeightDto.weightGoal,
        userHeight,
      );

      

      // Parse blood pressure
      if (createWeightDto.bloodPressure) {
        const bloodPressureInt = parseFloat(createWeightDto.bloodPressure);
        if (isNaN(bloodPressureInt)) {
          throw new BadRequestException(
            `Invalid blood pressure value: ${createWeightDto.bloodPressure}`,
          );
        }
      }

      // Predict weeks to reach the weight goal
      const weeks = predictWeeksToGoal({
        currentWeight: createWeightDto.weight,
        gender: userData.data.gender,
        bloodPressure: parseFloat(createWeightDto.bloodPressure || '0'),
        activityLevel: createWeightDto.active,
        targetWeight: createWeightDto.weightGoal,
        height: userHeight,
        birthday: userData.data.birthday,
        chestSize: createWeightDto.chest,
        heartRate: createWeightDto.heartRate,
        hip: createWeightDto.hip,
        thigh: createWeightDto.thigh,
        waist: createWeightDto.waist,
      });

      if (typeof weeks !== 'number' || weeks < 0) {
        throw new BadRequestException(
          `Invalid value returned from weeks prediction: ${weeks}`,
        );
      }
      createWeightDto.weeksToReachGoal = weeks;

      // Create the weight entry
      const weight = await this.prisma.weight.create({
        data: {
          ...createWeightDto,
          userId: userId.toString(),
        },
      });

      return weight;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.logger.error(`Axios error: ${error.message}`, error.stack);
      } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
        this.logger.error(`Prisma error: ${error.message}`, error.stack);
        if (error.code === 'P2002') {
          throw new BadRequestException('Duplicate entry');
        }
      } else {
        this.logger.error(
          `Error creating weight: ${error.message}`,
          error.stack,
        );
      }

      throw new InternalServerErrorException('Error creating weight entry');
    }
  }

  async findMostRecent(userId: number) {
    try {
      // Validate userId
      if (isNaN(userId)) {
        throw new BadRequestException(`Invalid user ID: ${userId}`);
      }
  
      const weight = await this.prisma.weight.findFirst({
        where: { userId: userId.toString() },
        orderBy: { createdAt: 'desc' },
      });
  
      if (!weight) {
        throw new NotFoundException(`No weight found for user #${userId}`);
      }
  
      return weight;
    } catch (error) {
      this.logger.error(
        `Error fetching most recent weight for user #${userId}: ${error.message}`,
        error.stack,
      );
  
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P1001') {
          // Handle database connection error
          throw new InternalServerErrorException(
            'Database connection error. Please try again later.',
          );
        }
      }
  
      if (error instanceof Prisma.PrismaClientUnknownRequestError) {
        // Handle unknown Prisma errors
        throw new InternalServerErrorException(
          'An unknown database error occurred.',
        );
      }
  
      // Handle other unexpected errors
      throw new InternalServerErrorException(
        'Error fetching most recent weight',
      );
    }
  }
  
  async findAllByUserId(userId: number) {
    try {
      // Validate userId
      if (isNaN(userId)) {
        throw new BadRequestException(`Invalid user ID: ${userId}`);
      }

      const weights = await this.prisma.weight.findMany({
        where: { userId: userId.toString() },
        orderBy: { createdAt: 'desc' },
      });

      if (!weights || weights.length === 0) {
        throw new NotFoundException(`No weights found for user #${userId}`);
      }

      // Format dates
      const formattedWeights = weights.map((weight) => {
        const date = new Date(weight.createdAt);
        return {
          ...weight,
          date: date.toLocaleDateString('fr-FR').replace(/\//g, '-'),
        };
      });

      return formattedWeights;
    } catch (error) {
      this.logger.error(
        `Error fetching weights for user #${userId}: ${error.message}`,
        error.stack,
      );

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P1001') {
          // Handle database connection error
          throw new InternalServerErrorException(
            'Database connection error. Please try again later.',
          );
        }
      }

      if (error instanceof Prisma.PrismaClientUnknownRequestError) {
        // Handle unknown Prisma errors
        throw new InternalServerErrorException(
          'An unknown database error occurred.',
        );
      }

      // Handle other unexpected errors
      throw new InternalServerErrorException('Error fetching weights');
    }
  }

  async findAll() {
    try {
      const weights = await this.prisma.weight.findMany();

      if (!weights || weights.length === 0) {
        throw new NotFoundException('No weights found');
      }

      return weights;
    } catch (error) {
      this.logger.error(
        `Error fetching all weights: ${error.message}`,
        error.stack,
      );

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P1001') {
          // Handle database connection error
          throw new InternalServerErrorException(
            'Database connection error. Please try again later.',
          );
        }
      }

      if (error instanceof Prisma.PrismaClientUnknownRequestError) {
        // Handle unknown Prisma errors
        throw new InternalServerErrorException(
          'An unknown database error occurred.',
        );
      }

      // Handle other unexpected errors
      throw new InternalServerErrorException('Error fetching all weights');
    }
  }

  async findOne(id: string) {
    try {
      // Validate the input type
      const parsedId = parseInt(id, 10);
      if (isNaN(parsedId)) {
        throw new BadRequestException(`Invalid ID format: ${id}`);
      }

      // Fetch the weight from the database
      const weight = await this.prisma.weight.findUnique({
        where: { id: parsedId },
      });

      // Check if the weight exists
      if (!weight) {
        throw new NotFoundException(`Weight #${id} not found`);
      }

      this.logger.log(`Successfully fetched weight #${id}`);
      return weight;
    } catch (error) {
      // Log detailed error information
      this.logger.error(
        `Error fetching weight #${id}: ${error.message}`,
        error.stack,
      );

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        // Re-throw known exceptions
        throw error;
      }

      // Handle database-related errors
      if (error.code === 'P2025') {
        // Prisma-specific error for record not found
        throw new NotFoundException(`Weight #${id} not found`);
      }

      if (error.code === 'P1001') {
        // Example: Database connection error
        throw new InternalServerErrorException(
          'Database connection error. Please try again later.',
        );
      }

      // Fallback for any other errors
      throw new InternalServerErrorException(
        'An unexpected error occurred while fetching the weight.',
      );
    }
  }

  async update(id: number, updateWeightDto: UpdateWeightDto) {
    try {
      // Validate the input
      if (isNaN(id)) {
        throw new BadRequestException(`Invalid ID format: ${id}`);
      }

      // Check if the weight exists
      const existingWeight = await this.prisma.weight.findUnique({
        where: { id },
      });

      if (!existingWeight) {
        throw new NotFoundException(`Weight #${id} not found`);
      }

      // Update the weight
      const updatedWeight = await this.prisma.weight.update({
        where: { id },
        data: updateWeightDto,
      });

      this.logger.log(`Successfully updated weight #${id}`);
      return updatedWeight;
    } catch (error) {
      this.logger.error(
        `Error updating weight #${id}: ${error.message}`,
        error.stack,
      );

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        // Re-throw known exceptions
        throw error;
      }

      if (error.code === 'P2025') {
        // Handle Prisma record not found error
        throw new NotFoundException(`Weight #${id} not found`);
      }

      if (error.code === 'P1001') {
        // Handle database connection error
        throw new InternalServerErrorException(
          'Database connection error. Please try again later.',
        );
      }

      // Handle unexpected errors
      throw new InternalServerErrorException(
        'An unexpected error occurred while updating the weight.',
      );
    }
  }

  async remove(id: number) {
    try {
      // Validate the input
      if (isNaN(id)) {
        throw new BadRequestException(`Invalid ID format: ${id}`);
      }

      // Check if the weight exists
      const existingWeight = await this.prisma.weight.findUnique({
        where: { id },
      });

      if (!existingWeight) {
        throw new NotFoundException(`Weight #${id} not found`);
      }

      // Delete the weight
      await this.prisma.weight.delete({
        where: { id },
      });

      this.logger.log(`Successfully removed weight #${id}`);
      return { message: `Weight #${id} successfully removed` };
    } catch (error) {
      this.logger.error(
        `Error removing weight #${id}: ${error.message}`,
        error.stack,
      );

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        // Re-throw known exceptions
        throw error;
      }

      if (error.code === 'P2025') {
        // Handle Prisma record not found error
        throw new NotFoundException(`Weight #${id} not found`);
      }

      if (error.code === 'P1001') {
        // Handle database connection error
        throw new InternalServerErrorException(
          'Database connection error. Please try again later.',
        );
      }

      // Handle unexpected errors
      throw new InternalServerErrorException(
        'An unexpected error occurred while removing the weight.',
      );
    }
  }

  // Function to calculate BMI
  calculateBMI(weight: number | string, height: number | string): number {
    if (typeof weight === 'string') {
      weight = parseFloat(weight);
    }

    if (typeof height === 'string') {
      height = parseFloat(height);
    }

    if (height <= 0) {
      throw new Error('Height must be greater than zero.');
    }

    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);

    return parseFloat(bmi.toFixed(2)); // Round to two decimal places
  }
}

import {
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
      // Fetch user data
      const userData = await axios.get(`http://api-users:3000/users/${userId}`);

      console.log(userData.data)
  
      if (!userData || !userData.data) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
  
      const userHeight = userData.data.height;
  
      if (!userHeight || userHeight <= 0) {
        throw new Error(`Invalid height value for user ID ${userId}`);
      }
  
      // Calculate BMI
      createWeightDto.bmi = this.calculateBMI(createWeightDto.weight, userHeight);
  
      // Calculate projected BMI for the weight goal
      createWeightDto.projectedBmi = this.calculateBMI(
        createWeightDto.weightGoal,
        userHeight,
      );
  
      // Parse blood pressure if provided
      let bloodPressureInt: number | undefined;
      if (createWeightDto.bloodPressure) {
        bloodPressureInt = parseFloat(createWeightDto.bloodPressure);
        if (isNaN(bloodPressureInt)) {
          throw new Error(`Invalid blood pressure value: ${createWeightDto.bloodPressure}`);
        }
      }
  
      // Predict weeks to reach the weight goal
      const weeks = predictWeeksToGoal({
        currentWeight: createWeightDto.weight,
        gender: userData.data.gender,
        bloodPressure: bloodPressureInt,
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
  
      if (typeof weeks === 'number') {
        createWeightDto.weeksToReachGoal = weeks;
      } else {
        throw new Error(`Invalid value returned from weeks prediction: ${weeks}`);
      }
  
      // Create the weight entry in the database
      const weight = await this.prisma.weight.create({
        data: {
          ...createWeightDto,
          userId: userId.toString(), // Ensure userId is a string if required by the schema
        },
      });
  
      // Return the created weight entry
      return weight;
    } catch (error) {
      // Log and rethrow error
      if (axios.isAxiosError(error)) {
        this.logger.error(`Axios error: ${error.message}`, error.stack);
      } else {
        this.logger.error(`Error creating weight entry: ${error.message}`, error.stack);
      }
      throw new InternalServerErrorException('Error creating weight entry');
    }
  }
  
  
 
async findMostRecent(userId: number) {
    try {
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
      throw new InternalServerErrorException('Error fetching most recent weight');
    }
  }
  // Method to fetch weights for a specific user
  async findAllByUserId(userid: number) {
    try {
      const weights = await this.prisma.weight.findMany({
        where: { userId: userid.toString() },
        orderBy: { createdAt: 'desc' },
      });

      if (!weights || weights.length === 0) {
        throw new NotFoundException(`No weights found for user #${userid}`);
      }

      // Format the date to 'dd-mm-yyyy'
      const formattedWeights = weights.map((weight) => {
        const date = new Date(weight.createdAt);
        const formattedDate = date
          .toLocaleDateString('fr-FR') // Formats to 'dd/mm/yyyy'
          .replace(/\//g, '-'); // Replace slashes with hyphens for 'dd-mm-yyyy'

        return {
          ...weight,
          date: formattedDate,
        };
      });
      return formattedWeights;
    } catch (error) {
      this.logger.error(
        `Error fetching weights for user #${userid}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Error fetching weights');
    }
  }

  // Method to fetch all weights (for administrative purposes)
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
      throw new InternalServerErrorException('Error fetching all weights');
    }
  }

  async findOne(id: string) {
    try {
      const weight = await this.prisma.weight.findUnique({
        where: { id: parseInt(id) }, // Ensure the type matches your Prisma schema
      });

      if (!weight) {
        throw new NotFoundException(`Weight #${id} not found`);
      }

      return weight;
    } catch (error) {
      this.logger.error(
        `Error fetching weight #${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Error fetching weight');
    }
  }

  async update(id: number, updateWeightDto: UpdateWeightDto) {
    try {
      const existingWeight = await this.prisma.weight.findUnique({
        where: { id: id }, // Ensure the type matches your Prisma schema
      });

      if (!existingWeight) {
        throw new NotFoundException(`Weight #${id} not found`);
      }

      const updatedWeight = await this.prisma.weight.update({
        where: { id: parseInt(id.toString()) }, // Ensure the type matches your Prisma schema
        data: updateWeightDto,
      });

      return updatedWeight;
    } catch (error) {
      this.logger.error(
        `Error updating weight #${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Error updating weight');
    }
  }

  async remove(id: number) {
    try {
      const existingWeight = await this.prisma.weight.findUnique({
        where: { id: id }, // Ensure the type matches your Prisma schema
      });

      if (!existingWeight) {
        throw new NotFoundException(`Weight #${id} not found`);
      }

      await this.prisma.weight.delete({
        where: { id: id }, // Ensure the type matches your Prisma schema
      });
      return { message: `Weight #${id} successfully removed` };
    } catch (error) {
      this.logger.error(
        `Error removing weight #${id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Error removing weight');
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

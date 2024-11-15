import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateWeightDto } from './dto/create-weight.dto';
import { UpdateWeightDto } from './dto/update-weight.dto';
import { PrismaService } from 'src/prisma.service';
import { LoggingService } from 'src/weight/common/services/logging.service';
import axios from 'axios';

@Injectable()
export class WeightService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: LoggingService,
  ) {
    this.logger.setContext('WeightService');
  }

  // Updated create method
  async create(createWeightDto: CreateWeightDto) {
    try {
      // Make an Axios request to get the height
      const response = await axios.get(
        `http://api-users:3000/users/${createWeightDto.userId}`,
      );

      const height = response.data.height;
      console.log(height);

      if (!height || height <= 0) {
        throw new Error('Invalid height value received from the API.');
      }

      // Calculate BMI
      const bmi = this.calculateBMI(createWeightDto.weight, height);

      await axios.post(`http://api-users:3000/users/bmi`, {
        id: createWeightDto.userId,
        bmi,
      });

      // Create weight entry with the calculated BMI
      const weight = await this.prisma.weight.create({
        data: {
          ...createWeightDto,
        },
      });

      return weight;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.logger.error(`Axios error: ${error.message}`, error.stack);
      } else {
        this.logger.error(
          `Error creating weight: ${error.message}`,
          error.stack,
        );
      }
      throw new InternalServerErrorException('Error creating weight');
    }
  }

  // Method to fetch weights for a specific user
  async findAllByUserId(userid: number) {
    try {
      const weights = await this.prisma.weight.findMany({
        where: { userId: userid.toString() },
        orderBy: { date: 'desc' },
      });

      if (!weights || weights.length === 0) {
        throw new NotFoundException(`No weights found for user #${userid}`);
      }

      // Format the date to 'dd-mm-yyyy'
      const formattedWeights = weights.map((weight) => {
        const date = new Date(weight.date);
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
        where: { id: id }, // Ensure the type matches your Prisma schema
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

  async update(id: string, updateWeightDto: UpdateWeightDto) {
    try {
      const existingWeight = await this.prisma.weight.findUnique({
        where: { id: id }, // Ensure the type matches your Prisma schema
      });

      if (!existingWeight) {
        throw new NotFoundException(`Weight #${id} not found`);
      }

      const updatedWeight = await this.prisma.weight.update({
        where: { id: id.toString() }, // Ensure the type matches your Prisma schema
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

  async remove(id: string) {
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
  calculateBMI(weight: number, height: number): number {
    if (height <= 0) {
      throw new Error('Height must be greater than zero.');
    }

    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);

    return parseFloat(bmi.toFixed(2)); // Round to two decimal places
  }
}

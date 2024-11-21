import {
  ConflictException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcryptjs';
import { LoggingService } from 'src/common/services/logging.service';
import * as jwt from 'jsonwebtoken';
import axios from 'axios';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: LoggingService,
  ) {
    this.logger.setContext('UsersController');
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.prisma.users.create({
        data: {
          ...createUserDto,

          isVerified: false,
        },
      });

      // Omit the password from the returned result
      const { ...result } = user;
      this.logger.log(`User created successfully: ${result.email}`);
      return result;
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        'An error occurred while creating the user',
      );
    }
  }

  findAll() {
    // console.log('findall clicked');
    return this.prisma.users.findMany();
  }

  async findOne(userId: number) {
    const user = await this.prisma.users.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new NotFoundException(
        `User with ID ${userId} not found or does not exist`,
      );
    }
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    return user;
  }

  async update(userId: number, updateUserDto: UpdateUserDto) {
    console.log('update clicked' + updateUserDto.height)
    
    try {

       // Fetch the existing user data
    const existingUser = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }

      if (updateUserDto.height !== undefined) {
        updateUserDto.height = parseInt(updateUserDto.height.toString());
      } else if (existingUser.height !== null && existingUser.height !== undefined) {
        updateUserDto.height = existingUser.height;
      } else {
        updateUserDto.height = undefined; // Or set a default value if appropriate
      }

      if (updateUserDto.currentWeight) {
        updateUserDto.currentWeight = parseFloat(
          updateUserDto.currentWeight.toString(),
        );
        //get bmi from weight service
        const response = await axios.get(
          `http://weight-service:3003/weight/bmi/${updateUserDto.currentWeight}/${updateUserDto.height}`,
        );

        updateUserDto.currentBmi = response.data;
      }

      if (updateUserDto.weightGoal) {
        updateUserDto.weightGoal = parseFloat(
          updateUserDto.weightGoal.toString(),
        );

        //get bmi from weight service
        const responseGoalBmi = await axios.get(
          `http://weight-service:3003/weight/bmi/${updateUserDto.weightGoal}/${updateUserDto.height}`,
        );

        updateUserDto.projectedBmi = responseGoalBmi.data;
      }

      if (updateUserDto.currentActive) {
        updateUserDto.currentActive = parseInt(
          updateUserDto.currentActive.toString(),
        );
      }

      if (updateUserDto.birthday) {
        updateUserDto.birthday = new Date(updateUserDto.birthday);
      }

      console.log('user' + updateUserDto.firstname);

      updateUserDto.profileCompleted = true;

      const updatedUser = await this.prisma.users.update({
        where: {
          id: userId,
        },
        data: updateUserDto,
      });

      console.log(updatedUser);
      const { password, ...result } = updatedUser;
      return result;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async bmiUpdate(userId: number, bmi: number, weeks: number) {
    try {
      const updateBmi = await this.prisma.users.update({
        where: {
          id: userId,
        },
        data: {
          currentBmi: bmi,
          currentWeeksToReachGoal: weeks,
        },
      });

      return updateBmi;
    } catch (error) {
      console.error('Error updating BMI:', error.message);
      throw new Error(`Failed to update BMI: ${error.message}`);
    }
  }

  async remove(userId: number) {
    try {
      await this.prisma.users.delete({
        where: {
          id: userId,
        },
      });
      return { message: `User with ID ${userId} has been deleted` };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async updateUserVerificationStatus(userId: number) {
    try {
      await this.prisma.users.update({
        where: {
          id: userId,
        },
        data: {
          isVerified: true,
        },
      });
    } catch (error) {
      throw new Error('Failed to update user verification status');
    }
  }

  async updatePassword(userId: number, newPassword: string) {
    await this.prisma.users.update({
      where: { id: userId },
      data: { password: newPassword },
    });
  }
}

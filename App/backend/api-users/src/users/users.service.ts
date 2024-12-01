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
import axios from 'axios';
import { ne, th } from '@faker-js/faker/.';

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
        },
      });

      await this.prisma.preferences.create({
        data: {
          userId: user.id, // Link to the newly created user
          tcComplied: true, // Default value (adjust as needed)
          tcCompliedDate: new Date(), // Default or placeholder date
          isVerified: false, // Set isVerified in preferences
          profileCompleted: false, // Default value
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

  async findAll() {
    try {
      const users = await this.prisma.users.findMany();
      return users;
    } catch (error) {
      console.error('Error finding all users:', error);
      throw new Error('Could not fetch users'); // Optional: re-throwing or returning an error response
    }
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
      } else if (
        existingUser.height !== null &&
        existingUser.height !== undefined
      ) {
        updateUserDto.height = existingUser.height;
      } else {
        updateUserDto.height = undefined; // Or set a default value if appropriate
      }

     
      if (updateUserDto.birthday) {
        updateUserDto.birthday = new Date(updateUserDto.birthday);
      }

      console.log('user' + updateUserDto );

      //updateUserDto.profileCompleted = true;

      await this.prisma.preferences.update({
        where: {
          userId: userId,
        },
        data: {
          profileCompleted: true,
        },
      });

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

 
  async remove(userId: number) {
    try {

     const preferencesUserID =  await this.prisma.preferences.findFirst({
        where: {
          userId: userId,
        },
      })

      if (!preferencesUserID) {
        throw new NotFoundException(`Preferences for user with ID ${userId} not found`);
      }

      await this.prisma.preferences.delete({
        where: {
          id: preferencesUserID.id,
        },
      });

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

  async updatePassword(userId: number, newPassword: string) {
    await this.prisma.users.update({
      where: { id: userId },
      data: { password: newPassword },
    });
  }
}

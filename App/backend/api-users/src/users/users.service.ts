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
import { UserEntity } from './entities/user.entity';
import { cp } from 'fs';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: LoggingService,
  ) {
    this.logger.setContext('UsersController');
  }

  async create(createUserDto: CreateUserDto) {
    console.log('create clicked');
    try {
      // Hash the password before creating the user
      const saltOrRounds = 10;
      const passwordToHash = createUserDto.password;
      const hashedPassword = await bcrypt.hash(passwordToHash, saltOrRounds);
  
      // Create the user with the hashed password
      const user = await this.prisma.users.create({
        data: {
          ...createUserDto,
          password: hashedPassword,
        },
      });
  
      // Omit the password from the returned result
      const { password, ...result } = user;
      this.logger.log(`User created successfully: ${result.email}`);
      return result;
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`, error.stack);
      throw new InternalServerErrorException('An error occurred while creating the user');
    }
  }
  

  findAll() {
    console.log('findall clicked');
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
    try {
      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }
      const updatedUser = await this.prisma.users.update({
        where: {
          id: userId,
        },
        data: updateUserDto,
      });
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
}

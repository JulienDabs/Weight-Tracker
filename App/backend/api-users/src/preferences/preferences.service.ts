import { Injectable } from '@nestjs/common';
import { CreatePreferencesDTO } from './dto/create-preference.dto';
import { UpdatePreferenceDto } from './dto/update-preference.dto';
import { PrismaService } from 'src/prisma.service';
import { LoggingService } from 'src/common/services/logging.service';

@Injectable()
export class PreferencesService {

  constructor(
    private prisma: PrismaService,
    private readonly logger: LoggingService,
  ) {
    this.logger.setContext('UsersController');
  }

  create(createPreferenceDto: CreatePreferencesDTO) {
    return 'This action adds a new preference';
  }

  findAll() {
    return `This action returns all preferences`;
  }

 async findOne(userId: number) {
    try {
      const userPref = await this.prisma.preferences.findUnique({
        where: {
          userId: userId,
        },
      });
      if (!userPref) {
        throw new Error(`User with ID ${userId} not found`);
      }
      return userPref;
    } catch (error) {
      this.logger.error(`Error finding user: ${error.message}`);
      throw error;
    }
  }

  update(id: number, updatePreferenceDto: UpdatePreferenceDto) {
    return `This action updates a #${id} preference`;
  }

  remove(id: number) {
    return `This action removes a #${id} preference`;
  }

  async termAndConditionsAccepted(userId: number ) {
    try {
      await this.prisma.preferences.update({
        where: {
          id: userId,
        },
        data: {
          tcComplied: true,
        },
      });
    } catch (error) {
      throw new Error('Failed to update user verification status');
    }
  }

  async updateUserVerificationStatus(userId: number) {
    try {
      await this.prisma.preferences.update({
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
}

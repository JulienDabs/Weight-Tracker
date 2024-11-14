import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateWeightDto } from './dto/create-weight.dto';
import { UpdateWeightDto } from './dto/update-weight.dto';
import { PrismaService } from 'src/prisma.service';
import { LoggingService } from 'src/weight/common/services/logging.service';


@Injectable()
export class WeightService {

  constructor(
    private prisma: PrismaService,
    private readonly logger: LoggingService,
  ) {
    this.logger.setContext('UsersController');
  }

  async create(createWeightDto: CreateWeightDto) {
    try {
      const weight = await this.prisma.weight.create({
        data: {
          ...createWeightDto,
        },
      });
      return weight;
    } catch (error) {
      this.logger.error(`Error creating weight: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error creating weight');
    }
  }

  findAll() {
    return `This action returns all weight`;
  }

  findOne(id: number) {
    return `This action returns a #${id} weight`;
  }

  update(id: number, updateWeightDto: UpdateWeightDto) {
    return `This action updates a #${id} weight`;
  }

  remove(id: number) {
    return `This action removes a #${id} weight`;
  }
}

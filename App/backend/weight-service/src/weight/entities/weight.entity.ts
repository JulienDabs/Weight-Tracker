import { Weight } from '@prisma/client'

export class WeightEntity implements Weight {
    id: string;
    date: Date;
    weight: number;
    userId: string;
  }

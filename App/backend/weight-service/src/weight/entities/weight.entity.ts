import { Weight } from '@prisma/client';

export class WeightEntity implements Weight {
  id: string;
  date: Date;
  weight: number;
  userId: string;
  bloodPressure: string | null; // Optional, can be null
  heartRate: number | null;     // Optional, can be null
  waist: number | null;         // Optional, can be null
  hip: number | null;           // Optional, can be null
  chest: number | null;         // Optional, can be null
  thigh: number | null;         // Optional, can be null
}

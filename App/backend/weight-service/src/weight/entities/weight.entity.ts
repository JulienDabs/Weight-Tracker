import { Weight } from '@prisma/client';

export class WeightEntity implements Weight {
  createdAt: Date;
  weightGoal: number | null;
  projectedBmi: number | null;
  id: number;
  weight: number | null;
  userId: string | null;
  bmi: number | null;
  weeksToReachGoal: number | null;
  active: number | null;
  bloodPressure: string | null; // Optional, can be null
  heartRate: number | null; // Optional, can be null
  waist: number | null; // Optional, can be null
  hip: number | null; // Optional, can be null
  chest: number | null; // Optional, can be null
  thigh: number | null; // Optional, can be null
}

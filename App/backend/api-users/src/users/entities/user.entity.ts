import { $Enums, Users } from '@prisma/client';

export class UserEntity implements Users{
    birthday: Date;
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    currentWeight: number;
    height: number;
    currentActive: number;
    bloodPressure: string | null;
    weightGoal: number;
    isVerified: boolean;
    token: string;
    gender: $Enums.Gender;
    currentBmi: number ;
    currentWeeksToReachGoal: number;
}

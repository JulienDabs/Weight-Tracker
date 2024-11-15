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
    active: number;
    bloodPressure: string | null;
    weightGoal: number;
    isVerified: boolean;
    token: string;
    gender: $Enums.Gender;
    bmi: number ;
}

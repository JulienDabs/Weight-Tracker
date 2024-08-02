import { Users } from '@prisma/client';

export class UserEntity implements Users{
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
}

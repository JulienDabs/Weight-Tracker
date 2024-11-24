import { Users } from '../../users/entities/user.entity'; // This should match the representation of your Users model

export class Preferences {
  id: number; // Primary key

  userId: number; // Foreign key referencing Users.id

  user?: Users; // Relation to Users (optional when fetched directly from Prisma)

  tcComplied: boolean; // Terms and Conditions compliance

  tcCompliedDate: Date; // Date of compliance

  isVerified: boolean; // Verification status

  profileCompleted: boolean; // Indicates if the profile is complete
}

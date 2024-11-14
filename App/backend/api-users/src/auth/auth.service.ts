import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersService) private usersService: UsersService,
    @Inject(JwtService) private jwtService: JwtService,
    
  ) {}

  async signUp(registerDto: RegisterDto) {
    // Validate email format
    if (
      !registerDto.email.match(/^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/i)
    ) {
      throw new InternalServerErrorException(
        'An error occurred while creating the user',
      );
    }

    // Check if the email already exists
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    console.log(hashedPassword)

    // Generate a verification token
    const token = this.generateVerificationToken(registerDto.email);


    // Create a user DTO with the hashed password and token
    const userDto: CreateUserDto = {
      email: registerDto.email,
      password: hashedPassword,
      firstname: registerDto.firstname,
      lastname: registerDto.lastname,
      currentWeight: registerDto.currentWeight,
      height: registerDto.height,
      active: registerDto.active,
      bloodPressure: registerDto.bloodPressure,
      weightGoal: registerDto.weightGoal,
      token: token, // Add the generated token here
    };

    // Create the user
    const createdUser = await this.usersService.create(userDto);

  
    // Send verification email
    await axios.post(
      'http://mailing-service:3001/mailing/send-verification-email',
      {
        email: createdUser.email,
        token,
      },
    );

    return createdUser;
  }

  private generateVerificationToken(email: string): string {
    const secretKey = process.env.JWT_SECRET_KEY; // Ensure this is set in your .env file
    if (!secretKey) {
      throw new Error('JWT Key not found');
    }
  
    // Include the email in the token's payload
    return jwt.sign({ email }, secretKey, { expiresIn: '1h' });
  }

  async signIn(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException({ message: 'Email does not exist' });
    }

    const ismatch = await bcrypt.compare(password, user.password);
    if (!ismatch) {
      throw new UnauthorizedException({ message: 'Invalid Password' });
    }
    const secretKey = process.env.JWT_SECRET_KEY;
    const payload = { id: user.id, email: user.email };

    return {
      tokenAccess: await this.jwtService.signAsync(payload, {secret: secretKey}), 
    };

   
  }

  async verifyEmailToken(email: string, token: string): Promise<string> {
    // Fetch the user by email
    const user = await this.usersService.findByEmail(email);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const secretKey = process.env.JWT_SECRET_KEY;
    
    if (!secretKey) {
      throw new Error('JWT_SECRET_KEY is not set. Please configure it in your environment variables.');
    }
    // Check if the token matches
    try {
      // Decode and verify the token using the secret key
    const decodedToken = jwt.verify(token, secretKey);

    // Check if the decodedToken is an object and contains the expected 'id' field
    if (typeof decodedToken !== 'object' || !decodedToken.email) {
      throw new BadRequestException('Invalid token format');
    }

    // Verify that the user ID in the token matches the user's email or ID
    if (decodedToken.email !== user.email) {
      throw new BadRequestException('Invalid token');
    }

         // Update the user's verification status
      await this.usersService.updateUserVerificationStatus(user.id);
      return 'Email verification successful';
    } catch (error) {
      throw new BadRequestException('Invalid or expired token');
    }
  }

}

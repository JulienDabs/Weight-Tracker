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
import { Response } from 'express';

// Extend the Request interface to include cookies
interface RequestWithCookies extends Request {
  cookies: { [key: string]: string };
}

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

    // Generate a verification token
    const token = this.generateVerificationToken(registerDto.email);

    // Create a user DTO with the hashed password and token
    const userDto: CreateUserDto = {
      email: registerDto.email,
      password: hashedPassword,
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

  async signIn(email: string, password: string, res: any) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException({ message: 'Invalid password' });
    }

    const secretKey = process.env.JWT_SECRET_KEY;
    const payload = { id: user.id, email: user.email };

    // Generate the token
    const token = await this.jwtService.signAsync(payload, {
      secret: secretKey,
    });

    // Set the token as an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true, // Cannot be accessed by JavaScript
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
      sameSite: 'strict', // Prevent CSRF attacks
      maxAge: 3600000, // 1 hour in milliseconds
    });

    res
      .status(200)
      .json({
        message: 'Login successful',
        user: { id: user.id, email: user.email },
      });
  }

  async verifyEmailToken(email: string, token: string): Promise<string> {
    // Fetch the user by email
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const secretKey = process.env.JWT_SECRET_KEY;

    if (!secretKey) {
      throw new Error(
        'JWT_SECRET_KEY is not set. Please configure it in your environment variables.',
      );
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

  async forgotPassword(email: string) {
    // Validate email format
    if (!email.match(/^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/i)) {
      throw new BadRequestException('Invalid email format');
    }

    // Check if user exists
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate reset token
    const token = this.generateVerificationToken(email);

    // Send reset email
    await axios.post(
      'http://mailing-service:3001/mailing/send-reset-password-email',
      {
        email: user.email,
        token,
      },
    );
  }

  async resetPassword(token: string, newPassword: string) {
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
      throw new Error('JWT Key not found');
    }

    try {
      const decodedToken = jwt.verify(token, secretKey);
      if (typeof decodedToken !== 'object' || !decodedToken.email) {
        throw new BadRequestException('Invalid token format');
      }
      const email = decodedToken.email;
      // Find user
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update user's password
      await this.usersService.updatePassword(user.id, hashedPassword);
    } catch (error) {
      throw new BadRequestException('Invalid or expired token');
    }
  }

  async verifySession(req: Request, res: Response) {
    try {
      const cookies = (req as any).cookies; // Correct type assertion
      const token = cookies['token'];
      if (!token) {
        return res.status(401).json({ isAuthenticated: false });
      }
  
      const secretKey = process.env.JWT_SECRET_KEY;
      if (!secretKey) {
        throw new Error('JWT secret key is not defined');
      }
  
      // Correct usage of jwt.verify
      const decoded = jwt.verify(token, secretKey);
  
      return res.status(200).json({
        isAuthenticated: true,
        user: decoded,
      });
    } catch (error) {
      return res.status(401).json({ isAuthenticated: false });
    }
  }
  
}

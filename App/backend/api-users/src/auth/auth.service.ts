import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersService) private usersService: UsersService,
    @Inject(JwtService) private jwtService: JwtService,
  ) {}

  async signUp(registerDto: RegisterDto) {
    if (
      !registerDto.email.match(/^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/i) //email validation
    ) {
      throw new InternalServerErrorException(
        'An error occurred while creating the user',
      );
    }

    const user = await this.usersService.findByEmail(registerDto.email);
    if (user) {
      throw new UnauthorizedException('Email already Exist');
    }

    console.log('user not found');

    const hashedPassword = await bcrypt.hash(registerDto.password, 10); //hashing password
    console.log(hashedPassword + registerDto.password);

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
    };

    return this.usersService.create(userDto);
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

    const payload = { id: user.id, email: user.email };
    return {
      tokenAccess: await this.jwtService.signAsync(payload),
    };
  }
}

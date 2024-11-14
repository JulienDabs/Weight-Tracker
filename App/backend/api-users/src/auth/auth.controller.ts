import {
  Body,
  Controller,
  Post,
  ValidationPipe,
  UsePipes,
  Query,
  BadRequestException,
  NotFoundException,
  Get,
} from '@nestjs/common';
import { ApiForbiddenResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
@ApiTags('Authentification')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiResponse({ status: 201, description: 'Registered Succefully' })
  @ApiForbiddenResponse({ description: 'Invalid Email or Invalid Password' })
  create(@Body() registerDto: RegisterDto) {
    return this.authService.signUp(registerDto);
  }

  @Post('login')
  @ApiResponse({ status: 201, description: 'User authentified succefully' })
  @ApiForbiddenResponse({ description: 'Invalid Password' })
  signIn(@Body() loginDto: LoginDto) {
    return this.authService.signIn(loginDto.email, loginDto.password);
  }

  @Get('verify-email')
  async verifyEmail(
    @Query('email') email: string,
    @Query('token') token: string,
  ) {
    if (!email || !token) {
      throw new BadRequestException('Email and token are required');
    }
   

    try {
      const result = await this.authService.verifyEmailToken(email, token);
      return { message: result };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException('Invalid or expired token');
    }
  }
}

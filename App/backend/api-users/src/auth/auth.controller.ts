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
  Res,
  Req,
} from '@nestjs/common';
import { ApiForbiddenResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RenewPasswordDto } from './dto/RenewPassword.dto';
import { Response } from 'express';

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
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res() res: Response
  ) {
    return this.authService.signIn(email, password, res);
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

  @Post('forgot-password')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiResponse({ status: 200, description: 'Password reset email sent' })
  @ApiForbiddenResponse({ description: 'Invalid Email' })
  async forgotPassword(@Body() forgotPasswordDto: RenewPasswordDto) {
    await this.authService.forgotPassword(forgotPasswordDto.email);
    return { message: 'Password reset email sent' };
  }

  @Post('reset-password')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  @ApiForbiddenResponse({ description: 'Invalid token or email' })
  async resetPassword(@Body() resetPasswordDto: RenewPasswordDto) {
    await this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.password,
    );
    return { message: 'Password reset successful' };
  }

  @Get('verify-session')
  @ApiResponse({ status: 200, description: 'token ok' })
  @ApiForbiddenResponse({ description: 'token not valid' })
  async verifySession(@Req() req: Request, @Res() res: Response) {
    // Call the AuthService to handle the session verification
    return this.authService.verifySession(req, res);
  }
}

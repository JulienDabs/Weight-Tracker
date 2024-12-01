import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiForbiddenResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { RegisterDto } from 'src/dto/register.dto';

@Controller('gateway/auth')
@ApiTags('Authentification')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiForbiddenResponse({ description: 'Invalid Email or invalid Password' })
  create(@Body() registerDto: RegisterDto) {
    return this.authService.signUp(registerDto);
  }

  @Get('verify-session')
  @ApiResponse({ status: 200, description: 'token ok' })
  @ApiForbiddenResponse({ description: 'token not valid' })
  async verifySession(@Req() req: Request, @Res() res: Response) {
    // Call the AuthService to handle the session verification
    return this.authService.verifySession(req, res);
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiForbiddenResponse({ description: 'Invalid Email or invalid Password' })
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res() res: Response, // Explicitly use Express's Response type
  ) {
    return this.authService.signIn(email, password, res);
  }

  @Post('logout')
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async logout(@Body() body: { userId: number }, @Res() res: Response) {
    try {
      const { userId } = body;

      // Ensure userId is provided
      if (!userId || isNaN(userId)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Invalid user ID',
        });
      }

      const result = await this.authService.logOut(userId);
      return res.status(HttpStatus.OK).json({
        message: 'Logout successful',
        data: result,
      });
    } catch (error) {
      return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message || 'An unexpected error occurred',
      });
    }
  }
}

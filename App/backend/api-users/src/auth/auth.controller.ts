import { Body, Controller, Post } from '@nestjs/common';
import { ApiForbiddenResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { loadEnvFile } from 'process';

@Controller('auth')
@ApiTags('Authentification')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @ApiResponse({status:201, description:'Registered Succefully'})
    @ApiForbiddenResponse({description: 'Invalid Email or Invalid Password'})
    create(@Body() registerDto: RegisterDto) {
        return this.authService.signUp(registerDto);
    }

    @Post('login')
    @ApiResponse({status: 201, description: 'User authentified succefully'})
    @ApiForbiddenResponse({description: 'Invalid Password'})
    signIn(@Body() loginDto: LoginDto){
        return this.authService.signIn(loginDto.email, loginDto.password)
    }
}

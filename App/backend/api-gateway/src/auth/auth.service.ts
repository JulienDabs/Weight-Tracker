import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosHeaders, AxiosRequestConfig, AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { RegisterDto } from 'src/dto/register.dto';
import { handleHttpError } from 'src/utils/errorHandler';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {

    private readonly authServiceUrl: String;
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.authServiceUrl = this.configService.get<string>('URL_AUTH');

        if(!this.authServiceUrl) {
            this.logger.error("URL_auth not found in the environment variables.");
            throw new Error("URL_auth not found in the environment variables.");
        }


    }

    
    async signUp(registerDto: RegisterDto) {
        
        try {
            const url = `${this.authServiceUrl}/register`;
            const response = await firstValueFrom(this.httpService.post(url, registerDto));
            return response.data;
        } catch (error) {
            handleHttpError(error, 'register');
        }
    }

    async signIn(email: string, password: string, res: Response): Promise<void> {
        try {
          const request = { email, password };
          const url = `${this.authServiceUrl}/login`;
      
          // Make the request to the backend authentication service
          const response = await firstValueFrom(this.httpService.post(url, request));
      
          // Check if the response contains a 'Set-Cookie' header
          if (response && response.headers['set-cookie']) {
            res.setHeader('Set-Cookie', response.headers['set-cookie']);
          }
      
          // Send the response data to the client
          res.status(response.status).json(response.data);
      
        } catch (error) {
          handleHttpError(error, 'signin');
      
          // Send error response only if headers have not already been sent
          if (!res.headersSent) {
            res.status(500).json({ message: 'Internal server error' });
          }
        }
      }
      
      
      

    async logOut(userId: number) {
        try {
            const url = `${this.authServiceUrl}/auth/logout/${userId}`;
            const response = await firstValueFrom(this.httpService.post(url));
            return response.data;
        } catch (error) {
            handleHttpError(error, 'logout');
        }
    }

    async verifySession(req: Request, res: Response) {
        try {

            
            // Extract token from cookies or headers
            const cookies = (req as any).cookies; // Correct type assertion for cookies
            const token = cookies['token'];
    
            
    
            if (!token) {
                // If no token is found, respond with not authenticated
                return res.status(401).json({ isAuthenticated: false, message: 'Token not found in request' });
            }
    
            const secretKey = process.env.JWT_SECRET_KEY;
            if (!secretKey) {
                throw new Error('JWT secret key is not defined');
            }
    
            // Verify the token
            const decoded = jwt.verify(token, secretKey);
    
            return res.status(200).json({
                isAuthenticated: true,
                user: decoded,
            });
        } catch (error) {
            console.error('Error in verifySession:', error);
            return res.status(401).json({ isAuthenticated: false, message: 'Invalid or expired token' });
        }
    }
    
     


}

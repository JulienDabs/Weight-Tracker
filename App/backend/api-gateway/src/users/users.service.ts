import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, map, of, throwError } from 'rxjs';
import { handleHttpError } from 'src/utils/errorHandler';

@Injectable()
export class UsersService {

  private readonly usersServiceUrl: String;
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.usersServiceUrl = this.configService.get<string>('URL_USERS');

    if (!this.usersServiceUrl) {
      throw new Error('URL_USERS is not defined in the environment.');
    } 
  }
  

  create(createUserDto: CreateUserDto) {
    try {
      const url = `${this.usersServiceUrl}/create`;
      return this.httpService.post(url, createUserDto).pipe(
        map((response) => response.data),
      );
    } catch (error) {
      handleHttpError(error, 'createUser');
    }
  }

  findAll() {
    const url = `${this.usersServiceUrl}`;
  
    return this.httpService.get(url).pipe(
      map(response => response.data), // Extract the data part of the response
      catchError((error) => {
        handleHttpError(error, 'findAllUsers');
        return throwError(() => new Error('Failed to fetch users'));
      })
    );
  }

  findOne(id: number) {
    try {
      const url = `${this.usersServiceUrl}/${id}`;
      return this.httpService.get(url).pipe(
        map((response) => response.data),
      );
    } catch (error) {
      handleHttpError(error, 'findOneUser');
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    try {
      console.log('updateUserDto', updateUserDto);
      const url = `${this.usersServiceUrl}/${id}`;
      return this.httpService.patch(url, updateUserDto).pipe(
        map((response) => response.data),
      );
    } catch (error) {
      handleHttpError(error, 'updateUser');
    }
  }

  remove(id: number) {
    try {
      const url = `${this.usersServiceUrl}/${id}`;
      return this.httpService.delete(url).pipe(
        map((response) => response.data),
      );
    } catch (error) {
      handleHttpError(error, 'removeUser');
    }
  }

  
}

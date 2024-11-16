import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class RenewPasswordDto {
    @IsEmail()
    email:string

    @IsString()
    token:string

    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @MaxLength(32, { message: 'Password must not exceed 32 characters' })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
      message:
        'Password is too weak. It should contain at least one uppercase letter, one lowercase letter, and one number or special character',
    })
    password: string;
}
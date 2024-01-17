import { IsNotEmpty, IsString } from 'class-validator';

export class SigninDTO {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

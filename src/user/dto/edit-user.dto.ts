import { IsOptional, IsString, Length } from 'class-validator';

export class EditUserDTO {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @Length(8, 50)
  password?: string;
}

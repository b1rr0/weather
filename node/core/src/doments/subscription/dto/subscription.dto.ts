import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { SubscribeType } from './subscribe.type';
export class CreateSubscriptionDto {
  @ApiProperty({
    description: 'Email address',
    type: String,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'City for weather updates',
    type: String,
  })
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    description: 'Frequency of updates',
    enum: SubscribeType,
  })
  @IsEnum(SubscribeType)
  @IsNotEmpty()
  frequency: SubscribeType;
}

import {
  IsUUID,
  IsString,
  IsNumber,
  IsNotEmpty,
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  Matches,
} from 'class-validator';
import { DayOfWeek } from 'shared/enums/dayOfWeek.js';

export class CreatePromotionDto {
  @IsNotEmpty()
  @IsUUID('4')
  productId: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber({})
  promotionalPrice: number;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  daysOfWeek: DayOfWeek[];

  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  startTime: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  endTime: string;
}

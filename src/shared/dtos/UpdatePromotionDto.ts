import {
  IsUUID,
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  Matches,
} from 'class-validator';
import { DayOfWeek } from 'shared/enums/dayOfWeek.js';

export class UpdatePromotionDto {
  @IsOptional()
  @IsUUID('4')
  productId?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber({})
  promotionalPrice?: number;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  daysOfWeek?: DayOfWeek[];

  @IsOptional()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  startTime?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  endTime?: string;

  @IsOptional()
  @IsBoolean()
  visibility?: boolean;
}

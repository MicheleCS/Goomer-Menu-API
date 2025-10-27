import {
  IsEnum,
  IsNumber,
  IsString,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { ProductCategory } from '../../shared/enums/productsCategory.js';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;
  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  @IsEnum(ProductCategory)
  category?: ProductCategory;

  @IsOptional()
  @IsBoolean()
  visibility?: boolean;
}

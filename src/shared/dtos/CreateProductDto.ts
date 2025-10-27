import { IsNumber, IsString, IsBoolean, IsNotEmpty } from 'class-validator';
import { ProductCategory } from '../../shared/enums/productsCategory.js';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  category: ProductCategory;

  @IsBoolean()
  @IsNotEmpty()
  visibility: boolean;
}

import { ProductCategory } from "../../enums/productsCategory";

export interface IProduct {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
  visibility: boolean;
  sortOrder?: number | null; 
}
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductCategory } from '../../enums/productsCategory';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name!: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false })
  price!: number;

  @Column({
    type: 'enum',
    enum: ProductCategory,
    nullable: false,
  })
  category!: ProductCategory;

  @Column({ type: 'boolean', default: true })
  visibility!: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt!: Date;
}

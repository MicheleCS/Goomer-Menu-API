import { ProductCategory } from '../../enums/productsCategory.js';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name!: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false })
  price!: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  category!: string;

  @Column({ type: 'boolean', default: true })
  visibility!: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt!: Date;
}

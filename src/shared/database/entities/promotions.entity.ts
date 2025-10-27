import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './products.entity.js';
import { DayOfWeek } from 'shared/enums/dayOfWeek.js';

@Entity('promotions')
export class Promotion {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'product_id', type: 'uuid', nullable: false })
  productId!: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product!: Product;

  @Column({ type: 'varchar', length: 255, nullable: false })
  description!: string;

  @Column({
    name: 'promotional_price',
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  promotionalPrice!: number;

  @Column({
    name: 'days_of_week',
    type: 'jsonb',
    nullable: false,
    transformer: {
      from: (value: string | DayOfWeek[]) =>
        typeof value === 'string' ? JSON.parse(value) : value,
      to: (value: DayOfWeek[]) => value,
    },
  })
  daysOfWeek!: DayOfWeek[];

  @Column({ name: 'start_time', type: 'time', nullable: false })
  startTime!: string;

  @Column({ name: 'end_time', type: 'time', nullable: false })
  endTime!: string;
}

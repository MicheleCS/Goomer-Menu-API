import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { DayOfWeek } from "../../enums/dayOfWeek";
import { Product } from "./products.entity";

@Entity("promotions")
export class Promotion {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "uuid", nullable: false })
    productId!: string;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'productId' })
    product!: Product;

    @Column({ type: "varchar", length: 255, nullable: false })
    description!: string;

    @Column({ type: "numeric", precision: 10, scale: 2, nullable: false })
    promotionalPrice!: number;

    @Column({
        type: "jsonb",
        nullable: false,
        transformer: {
            from: (value: string | DayOfWeek[]) => typeof value === 'string' ? JSON.parse(value) : value,
            to: (value: DayOfWeek[]) => value,
        }
    })
    daysOfWeek!: DayOfWeek[];

    @Column({ type: "time", nullable: false })
    startTime!: string;

    @Column({ type: "time", nullable: false })
    endTime!: string;

    @Column({ type: "boolean", default: true })
    visibility!: boolean;
}
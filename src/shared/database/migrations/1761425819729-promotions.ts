import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class Promotions1761425819729 implements MigrationInterface {

public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.createTable(
            new Table({
                name: "promotions",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        default: "uuid_generate_v4()",
                    },
                    {
                        name: "productId",
                        type: "uuid",
                        isNullable: false,
                    },
                    {
                        name: "description",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                    },
                    {
                        name: "promotionalPrice",
                        type: "numeric",
                        precision: 10,
                        scale: 2,
                        isNullable: false,
                    },
                    {
                        name: "daysOfWeek",
                        type: "jsonb",
                        isNullable: false,
                    },
                    {
                        name: "startTime",
                        type: "time",
                        isNullable: false,
                    },
                    {
                        name: "endTime",
                        type: "time",
                        isNullable: false,
                    },
                    {
                        name: "visibility",
                        type: "boolean",
                        isNullable: false,
                        default: "true",
                    },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "promotions",
            new TableForeignKey({
                columnNames: ["productId"],
                referencedColumnNames: ["id"],
                referencedTableName: "products",
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("promotions");
    }
}

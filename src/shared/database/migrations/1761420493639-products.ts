import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Products1761420493639 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "products",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                    },
                    {
                        name: "price",
                        type: "numeric",
                        precision: 10,
                        scale: 2,
                        isNullable: false,
                    },
                    {
                        name: "category",
                        type: "enum",
                        enum: ['valor1', 'valor2', 'etc...'],
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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "products"`);
    }

}

import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateKeywordsTable1234567890123 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create keywords table
        await queryRunner.createTable(
            new Table({
                name: "keywords",
                columns: [
                    {
                        name: "id",
                        type: "varchar",
                        isPrimary: true,
                    },
                    {
                        name: "lessonId",
                        type: "varchar",
                    },
                    {
                        name: "englishText",
                        type: "varchar",
                    },
                    {
                        name: "japaneseText",
                        type: "varchar",
                    },
                    {
                        name: "englishAudioUrl",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "japaneseAudioUrl",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "order",
                        type: "int",
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updatedAt",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                    },
                ],
            }),
            true
        );

        // Add foreign key
        await queryRunner.createForeignKey(
            "keywords",
            new TableForeignKey({
                columnNames: ["lessonId"],
                referencedColumnNames: ["id"],
                referencedTableName: "lessons",
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            })
        );

        // Add index on lessonId for better query performance
        await queryRunner.createIndex("keywords", {
            name: "IDX_KEYWORDS_LESSON_ID",
            columnNames: ["lessonId"],
        } as any);

        // Update lessons table to include KEYWORDS in lessonType enum
        await queryRunner.query(`
            ALTER TYPE lessons_lessontype_enum ADD VALUE IF NOT EXISTS 'KEYWORDS'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key
        const table = await queryRunner.getTable("keywords");
        const foreignKey = table!.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("lessonId") !== -1
        );
        if (foreignKey) {
            await queryRunner.dropForeignKey("keywords", foreignKey);
        }

        // Drop index
        await queryRunner.dropIndex("keywords", "IDX_KEYWORDS_LESSON_ID");

        // Drop keywords table
        await queryRunner.dropTable("keywords");

        // Revert lessonType enum
        await queryRunner.query(`
            ALTER TABLE lessons 
            MODIFY COLUMN lessonType ENUM('VIDEO', 'PDF') 
            DEFAULT 'VIDEO'
        `);
    }
}
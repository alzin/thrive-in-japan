// backend/src/infrastructure/database/migrations/1751500000000-AddLessonType.ts
import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLessonType1751500000000 implements MigrationInterface {
    name = 'AddLessonType1751500000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add lesson type enum
        await queryRunner.query(`CREATE TYPE "public"."lessons_lessontype_enum" AS ENUM('VIDEO', 'PDF')`);
        
        // Add lessonType column with default value
        await queryRunner.query(`ALTER TABLE "lessons" ADD "lessonType" "public"."lessons_lessontype_enum" NOT NULL DEFAULT 'VIDEO'`);
        
        // Rename videoUrl to contentUrl
        await queryRunner.query(`ALTER TABLE "lessons" RENAME COLUMN "videoUrl" TO "contentUrl"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lessons" RENAME COLUMN "contentUrl" TO "videoUrl"`);
        await queryRunner.query(`ALTER TABLE "lessons" DROP COLUMN "lessonType"`);
        await queryRunner.query(`DROP TYPE "public"."lessons_lessontype_enum"`);
    }
}
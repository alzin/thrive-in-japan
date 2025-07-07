import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1751837579045 implements MigrationInterface {
    name = 'Migrations1751837579045'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "enrollments" DROP CONSTRAINT "FK_enrollments_userId"`);
        await queryRunner.query(`ALTER TABLE "enrollments" DROP CONSTRAINT "FK_enrollments_courseId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_KEYWORDS_LESSON_ID"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_enrollment_user_course"`);
        await queryRunner.query(`CREATE TABLE "refresh_tokens" ("id" character varying NOT NULL, "userId" character varying NOT NULL, "token" text NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "lastUsedAt" TIMESTAMP, "ipAddress" character varying, "userAgent" text, CONSTRAINT "UQ_4542dd2f38a61354a040ba9fd57" UNIQUE ("token"), CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "keywords" ALTER COLUMN "createdAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "keywords" ALTER COLUMN "updatedAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_610102b60fea1455310ccd299de" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "enrollments" ADD CONSTRAINT "FK_de33d443c8ae36800c37c58c929" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "enrollments" ADD CONSTRAINT "FK_60dd0ae4e21002e63a5fdefeec8" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "enrollments" DROP CONSTRAINT "FK_60dd0ae4e21002e63a5fdefeec8"`);
        await queryRunner.query(`ALTER TABLE "enrollments" DROP CONSTRAINT "FK_de33d443c8ae36800c37c58c929"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_610102b60fea1455310ccd299de"`);
        await queryRunner.query(`ALTER TABLE "keywords" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "keywords" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`DROP TABLE "refresh_tokens"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_enrollment_user_course" ON "enrollments" ("courseId", "userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_KEYWORDS_LESSON_ID" ON "keywords" ("lessonId") `);
        await queryRunner.query(`ALTER TABLE "enrollments" ADD CONSTRAINT "FK_enrollments_courseId" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "enrollments" ADD CONSTRAINT "FK_enrollments_userId" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

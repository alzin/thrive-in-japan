// backend/src/infrastructure/database/migrations/1751500001000-CreateEnrollments.ts
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEnrollments1751500001000 implements MigrationInterface {
    name = 'CreateEnrollments1751500001000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "enrollments" ("id" character varying NOT NULL, "userId" character varying NOT NULL, "courseId" character varying NOT NULL, "enrolledAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7c0f752f9fb68bf6ed7367471b0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_enrollment_user_course" ON "enrollments" ("userId", "courseId") `);
        await queryRunner.query(`ALTER TABLE "enrollments" ADD CONSTRAINT "FK_enrollments_userId" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "enrollments" ADD CONSTRAINT "FK_enrollments_courseId" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "enrollments" DROP CONSTRAINT "FK_enrollments_courseId"`);
        await queryRunner.query(`ALTER TABLE "enrollments" DROP CONSTRAINT "FK_enrollments_userId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_enrollment_user_course"`);
        await queryRunner.query(`DROP TABLE "enrollments"`);
    }
}
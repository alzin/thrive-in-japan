import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1751977315335 implements MigrationInterface {
    name = 'Migrations1751977315335'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "verification_codes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "code" character varying(6) NOT NULL, "verified" boolean NOT NULL DEFAULT false, "verifiedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "expiresAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_18741b6b8bf1680dbf5057421d7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3b71b1fccadf73dc8d32517396" ON "verification_codes" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_ea798f5b2bd040e3e85c5f67bb" ON "verification_codes" ("email", "createdAt") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_ea798f5b2bd040e3e85c5f67bb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3b71b1fccadf73dc8d32517396"`);
        await queryRunner.query(`DROP TABLE "verification_codes"`);
    }

}

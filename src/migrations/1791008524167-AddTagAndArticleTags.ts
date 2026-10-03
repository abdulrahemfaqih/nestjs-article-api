import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTagAndArticleTags1791008524167 implements MigrationInterface {
    name = 'AddTagAndArticleTags1791008524167'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tag" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_6a9775008add570dc3e5a0bab7b" UNIQUE ("name"), CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "article_tags" ("articleId" uuid NOT NULL, "tagId" uuid NOT NULL, CONSTRAINT "PK_bfcd6ae5865482ee63ece446586" PRIMARY KEY ("articleId", "tagId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_acbc7f775fb5e3fe2627477b5f" ON "article_tags"  ("articleId") `);
        await queryRunner.query(`CREATE INDEX "IDX_83a0534713c9e7f6bb2110c7bc" ON "article_tags"  ("tagId") `);
        await queryRunner.query(`ALTER TABLE "article_tags" ADD CONSTRAINT "FK_acbc7f775fb5e3fe2627477b5f7" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "article_tags" ADD CONSTRAINT "FK_83a0534713c9e7f6bb2110c7bcc" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article_tags" DROP CONSTRAINT "FK_83a0534713c9e7f6bb2110c7bcc"`);
        await queryRunner.query(`ALTER TABLE "article_tags" DROP CONSTRAINT "FK_acbc7f775fb5e3fe2627477b5f7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_83a0534713c9e7f6bb2110c7bc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_acbc7f775fb5e3fe2627477b5f"`);
        await queryRunner.query(`DROP TABLE "article_tags"`);
        await queryRunner.query(`DROP TABLE "tag"`);
    }

}

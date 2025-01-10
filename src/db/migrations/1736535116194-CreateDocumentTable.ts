import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDocumentTable1736535116194 implements MigrationInterface {
    name = 'CreateDocumentTable1736535116194'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "documents" ("isActive" boolean NOT NULL DEFAULT true, "createDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdBy" character varying(300) NOT NULL, "lastChangedDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastChangedBy" character varying(300) NOT NULL, "id" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "content" text NOT NULL, "author" character varying(255) NOT NULL, "filePath" character varying(255), CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "documents"`);
    }

}

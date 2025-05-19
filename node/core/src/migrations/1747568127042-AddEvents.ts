import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEvents1747568127042 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "events" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "status" varchar NOT NULL,
                "type" varchar NOT NULL,
                "data" jsonb NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);
    await queryRunner.query(`
        CREATE INDEX "idx_events_status_type" ON "events" ("status", "type")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "events"`);
  }
}

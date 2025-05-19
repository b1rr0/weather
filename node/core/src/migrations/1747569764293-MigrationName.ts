import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndexes1747569764293 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_subscriptions_subscribe_type_is_confirmed" ON "subscriptions" ("subscribe_type", "is_confirmed")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_subscriptions_email" ON "subscriptions" ("email")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_subscriptions_token" ON "subscriptions" ("token")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "IDX_subscriptions_subscribe_type_is_confirmed"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_subscriptions_email"`);
    await queryRunner.query(`DROP INDEX "IDX_subscriptions_token"`);
  }
}

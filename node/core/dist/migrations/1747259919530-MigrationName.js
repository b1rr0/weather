"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationName1747259919530 = void 0;
class MigrationName1747259919530 {
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE "subscriptions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" varchar NOT NULL,
        "city" varchar NOT NULL,
        "is_confirmed" boolean NOT NULL DEFAULT false,
        "token" varchar,
        "subscribe_type" varchar,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_subscriptions_id" PRIMARY KEY ("id")
      )
    `);
    }
    async down(queryRunner) {
        await queryRunner.query('DROP TABLE "subscriptions"');
    }
}
exports.MigrationName1747259919530 = MigrationName1747259919530;
//# sourceMappingURL=1747259919530-MigrationName.js.map
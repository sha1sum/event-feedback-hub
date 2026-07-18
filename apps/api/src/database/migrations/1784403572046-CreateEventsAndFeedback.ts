import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEventsAndFeedback1784403572046 implements MigrationInterface {
  name = 'CreateEventsAndFeedback1784403572046';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "events" (
        "id" varchar PRIMARY KEY NOT NULL,
        "name" text NOT NULL,
        "date" date NOT NULL,
        "location" text NOT NULL,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_events_name" ON "events" ("name")
    `);

    await queryRunner.query(`
      CREATE TABLE "feedback" (
        "id" varchar PRIMARY KEY NOT NULL,
        "eventId" varchar NOT NULL,
        "submitterName" text NOT NULL,
        "rating" integer NOT NULL,
        "description" text NOT NULL,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        CONSTRAINT "CHK_feedback_rating_range" CHECK ("rating" BETWEEN 1 AND 5),
        CONSTRAINT "CHK_feedback_description_not_blank" CHECK (length(trim("description")) > 0),
        CONSTRAINT "FK_feedback_eventId" FOREIGN KEY ("eventId") REFERENCES "events" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_feedback_createdAt" ON "feedback" ("createdAt")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_feedback_eventId_createdAt" ON "feedback" ("eventId", "createdAt")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_feedback_eventId_rating_createdAt" ON "feedback" ("eventId", "rating", "createdAt")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_feedback_rating_createdAt" ON "feedback" ("rating", "createdAt")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_feedback_rating_createdAt"`);
    await queryRunner.query(
      `DROP INDEX "IDX_feedback_eventId_rating_createdAt"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_feedback_eventId_createdAt"`);
    await queryRunner.query(`DROP INDEX "IDX_feedback_createdAt"`);
    await queryRunner.query(`DROP TABLE "feedback"`);

    await queryRunner.query(`DROP INDEX "IDX_events_name"`);
    await queryRunner.query(`DROP TABLE "events"`);
  }
}

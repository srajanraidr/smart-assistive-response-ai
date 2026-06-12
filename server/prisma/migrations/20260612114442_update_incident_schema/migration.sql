/*
  Warnings:

  - You are about to drop the column `shortSummary` on the `incident` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `emergencycall` ADD COLUMN `transcriptConfidence` DOUBLE NULL;

-- AlterTable
ALTER TABLE `incident` DROP COLUMN `shortSummary`,
    ADD COLUMN `recommendedDepartment` VARCHAR(191) NULL,
    ADD COLUMN `requiresHumanReview` BOOLEAN NOT NULL DEFAULT true,
    ALTER COLUMN `priority` DROP DEFAULT,
    MODIFY `status` ENUM('NEW', 'REVIEW', 'ASSIGNED', 'EN_ROUTE', 'ON_SCENE', 'RESOLVED', 'CLOSED') NOT NULL DEFAULT 'NEW';

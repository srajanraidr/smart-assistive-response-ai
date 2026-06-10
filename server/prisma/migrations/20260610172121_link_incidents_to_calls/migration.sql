-- AlterTable
ALTER TABLE `incident` ADD COLUMN `keywords` JSON NULL,
    ADD COLUMN `riskLevel` VARCHAR(191) NULL,
    ADD COLUMN `shortSummary` VARCHAR(191) NULL;

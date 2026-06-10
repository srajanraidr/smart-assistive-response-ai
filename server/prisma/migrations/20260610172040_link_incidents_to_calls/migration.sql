/*
  Warnings:

  - Made the column `transcript` on table `emergencycall` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `emergencycall` MODIFY `transcript` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `incident` ADD COLUMN `emergencyCallId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Incident` ADD CONSTRAINT `Incident_emergencyCallId_fkey` FOREIGN KEY (`emergencyCallId`) REFERENCES `EmergencyCall`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE `incident` ADD COLUMN `assignedToId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Incident` ADD CONSTRAINT `Incident_assignedToId_fkey` FOREIGN KEY (`assignedToId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

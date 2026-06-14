-- CreateTable
CREATE TABLE `IncidentHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `incidentId` INTEGER NOT NULL,
    `oldStatus` VARCHAR(191) NULL,
    `newStatus` VARCHAR(191) NOT NULL,
    `changedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `IncidentHistory` ADD CONSTRAINT `IncidentHistory_incidentId_fkey` FOREIGN KEY (`incidentId`) REFERENCES `Incident`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

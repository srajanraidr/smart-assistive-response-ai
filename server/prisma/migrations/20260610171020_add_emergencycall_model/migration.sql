-- CreateTable
CREATE TABLE `EmergencyCall` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `callerPhone` VARCHAR(191) NULL,
    `transcript` VARCHAR(191) NULL,
    `audioFile` VARCHAR(191) NULL,
    `language` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

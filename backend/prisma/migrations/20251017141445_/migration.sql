-- DropIndex
DROP INDEX `Auxiliar_enderecoIgrejaId_fkey` ON `auxiliar`;

-- DropIndex
DROP INDEX `Auxiliar_enderecoResidencialId_fkey` ON `auxiliar`;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Auxiliar` ADD CONSTRAINT `Auxiliar_enderecoResidencialId_fkey` FOREIGN KEY (`enderecoResidencialId`) REFERENCES `Endereco`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Auxiliar` ADD CONSTRAINT `Auxiliar_enderecoIgrejaId_fkey` FOREIGN KEY (`enderecoIgrejaId`) REFERENCES `Endereco`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Auxiliar` ADD CONSTRAINT `Auxiliar_conjugeId_fkey` FOREIGN KEY (`conjugeId`) REFERENCES `Conjuge`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

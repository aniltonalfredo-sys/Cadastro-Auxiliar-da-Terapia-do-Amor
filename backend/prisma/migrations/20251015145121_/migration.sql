-- CreateTable
CREATE TABLE `Auxiliar` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `foto` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `dataNascimento` DATETIME(3) NOT NULL,
    `igreja` VARCHAR(191) NOT NULL,
    `regiao` VARCHAR(191) NOT NULL,
    `estadoCivil` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NOT NULL,
    `obreiro` BOOLEAN NOT NULL DEFAULT false,
    `batizado` BOOLEAN NOT NULL DEFAULT false,
    `dataCadastro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `enderecoResidencialId` INTEGER NULL,
    `enderecoIgrejaId` INTEGER NULL,
    `conjugeId` INTEGER NULL,

    UNIQUE INDEX `Auxiliar_conjugeId_key`(`conjugeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Endereco` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` VARCHAR(191) NOT NULL,
    `provincia` VARCHAR(191) NOT NULL,
    `municipio` VARCHAR(191) NOT NULL,
    `bairro` VARCHAR(191) NOT NULL,
    `rua` VARCHAR(191) NOT NULL,
    `numeroCasa` VARCHAR(191) NULL,
    `pontoReferencia` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Conjuge` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NOT NULL,
    `foto` VARCHAR(191) NULL,
    `obreiro` BOOLEAN NOT NULL DEFAULT false,
    `batizado` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Auxiliar` ADD CONSTRAINT `Auxiliar_enderecoResidencialId_fkey` FOREIGN KEY (`enderecoResidencialId`) REFERENCES `Endereco`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Auxiliar` ADD CONSTRAINT `Auxiliar_enderecoIgrejaId_fkey` FOREIGN KEY (`enderecoIgrejaId`) REFERENCES `Endereco`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Auxiliar` ADD CONSTRAINT `Auxiliar_conjugeId_fkey` FOREIGN KEY (`conjugeId`) REFERENCES `Conjuge`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

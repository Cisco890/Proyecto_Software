/*
  Warnings:

  - You are about to drop the column `disponibilidad` on the `TutoresInfo` table. All the data in the column will be lost.
  - You are about to drop the column `metodo_ensenanza` on the `TutoresInfo` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "modalidad" AS ENUM ('virtual', 'presencial', 'hibrido');

-- AlterTable
ALTER TABLE "TutoresInfo" DROP COLUMN "disponibilidad",
DROP COLUMN "metodo_ensenanza",
ADD COLUMN     "horario" INTEGER,
ADD COLUMN     "modalidad" "modalidad";

-- AlterTable
ALTER TABLE "Usuarios" ADD COLUMN     "foto_perfil" VARCHAR(255);

-- DropEnum
DROP TYPE "metodo_ensenanza";

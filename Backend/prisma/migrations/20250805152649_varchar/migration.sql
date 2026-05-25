/*
  Warnings:

  - The `horario` column on the `TutoresInfo` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Perfiles" ALTER COLUMN "nombre" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "TutoresInfo" DROP COLUMN "horario",
ADD COLUMN     "horario" "horario";

-- AlterTable
ALTER TABLE "Usuarios" ALTER COLUMN "nombre" SET DATA TYPE TEXT,
ALTER COLUMN "correo_electronico" SET DATA TYPE TEXT,
ALTER COLUMN "telefono" SET DATA TYPE TEXT;

/*
  Warnings:

  - The `horario` column on the `TutoresInfo` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "TutoresInfo" DROP COLUMN "horario",
ADD COLUMN     "horario" "horario";

/*
  Warnings:

  - Made the column `foto_perfil` on table `Usuarios` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Usuarios" ALTER COLUMN "foto_perfil" SET NOT NULL;

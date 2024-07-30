/*
  Warnings:

  - Added the required column `phoneNumber` to the `jobs` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `userrole` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "phoneNumber" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "userrole",
ADD COLUMN     "userrole" "UserRole" NOT NULL;

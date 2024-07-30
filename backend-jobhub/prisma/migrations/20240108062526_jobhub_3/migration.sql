/*
  Warnings:

  - Added the required column `userType` to the `jobs` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('EMPLOYEE', 'JOB_SEEKER');

-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "userType" "UserType" NOT NULL;

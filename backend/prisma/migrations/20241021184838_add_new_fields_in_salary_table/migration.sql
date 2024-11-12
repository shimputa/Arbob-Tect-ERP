/*
  Warnings:

  - Added the required column `paymentMethod` to the `Salary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Salary` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `Salary` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "SalaryStatus" AS ENUM ('PAID', 'UNPAID');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('BANK_TRANSFER', 'CASH', 'EASYPAISA');

-- AlterTable
ALTER TABLE "Salary" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "SalaryStatus" NOT NULL;

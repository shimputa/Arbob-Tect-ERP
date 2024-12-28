/*
  Warnings:

  - You are about to drop the column `expenseCategoryId` on the `Expense` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "Currency" ADD VALUE 'PKR';

-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_expenseCategoryId_fkey";

-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "expenseCategoryId",
ADD COLUMN     "expenseCategoryName" TEXT;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_expenseCategoryName_fkey" FOREIGN KEY ("expenseCategoryName") REFERENCES "ExpenseCategory"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "status" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "status" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "ProjectEmployee" ADD COLUMN     "status" INTEGER NOT NULL DEFAULT 1;

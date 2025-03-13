-- CreateEnum
CREATE TYPE "PaidStatus" AS ENUM ('NOT_PAID', 'PARTIAL_PAID', 'PAID');

-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('UPWORK', 'FIVER', 'LINKEDIN', 'WHATSAPP', 'OTHER');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('ONGOING', 'COMPLETE');

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "projectName" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "ownerEmail" TEXT NOT NULL,
    "ownerNumber" TEXT NOT NULL,
    "note" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "amount" DOUBLE PRECISION NOT NULL,
    "tax" DOUBLE PRECISION NOT NULL,
    "taxPercentage" DOUBLE PRECISION NOT NULL,
    "amountAfterTax" DOUBLE PRECISION NOT NULL,
    "paidAmount" DOUBLE PRECISION NOT NULL,
    "remainingAmount" DOUBLE PRECISION NOT NULL,
    "bonus" DOUBLE PRECISION NOT NULL,
    "sharedBonus" DOUBLE PRECISION NOT NULL,
    "paidStatus" "PaidStatus" NOT NULL,
    "projectStatus" "ProjectStatus" NOT NULL,
    "platform" "Platform" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectEmployee" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,
    "bonusShare" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isActive" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectEmployee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Project_projectStatus_paidStatus_idx" ON "Project"("projectStatus", "paidStatus");

-- CreateIndex
CREATE INDEX "Project_platform_idx" ON "Project"("platform");

-- CreateIndex
CREATE INDEX "ProjectEmployee_employeeId_idx" ON "ProjectEmployee"("employeeId");

-- CreateIndex
CREATE INDEX "ProjectEmployee_projectId_idx" ON "ProjectEmployee"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectEmployee_employeeId_projectId_key" ON "ProjectEmployee"("employeeId", "projectId");

-- AddForeignKey
ALTER TABLE "ProjectEmployee" ADD CONSTRAINT "ProjectEmployee_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectEmployee" ADD CONSTRAINT "ProjectEmployee_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

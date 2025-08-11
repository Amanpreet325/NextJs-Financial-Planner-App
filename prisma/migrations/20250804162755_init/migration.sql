-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "name" TEXT,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'client';

-- CreateTable
CREATE TABLE "public"."Questionnaire" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "personal" JSONB NOT NULL,
    "family" JSONB NOT NULL,
    "employment" JSONB NOT NULL,
    "income" JSONB NOT NULL,
    "liabilities" JSONB NOT NULL,
    "insurance" JSONB NOT NULL,
    "goals" JSONB NOT NULL,
    "investments" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Questionnaire_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Questionnaire" ADD CONSTRAINT "Questionnaire_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

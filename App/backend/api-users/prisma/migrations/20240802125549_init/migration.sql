-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "currentWeight" DOUBLE PRECISION NOT NULL,
    "height" INTEGER NOT NULL,
    "active" INTEGER NOT NULL,
    "bloodPressure" TEXT,
    "weightGoal" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

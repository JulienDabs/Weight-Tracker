-- CreateTable
CREATE TABLE "Weight" (
    "id" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "Weight_pkey" PRIMARY KEY ("id")
);

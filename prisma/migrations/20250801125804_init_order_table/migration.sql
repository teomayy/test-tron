-- CreateTable
CREATE TABLE "public"."Order" (
    "id" SERIAL NOT NULL,
    "amountExpected" DECIMAL(24,6) NOT NULL,
    "status" TEXT NOT NULL,
    "tronAddress" TEXT NOT NULL,
    "callbackUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_tronAddress_key" ON "public"."Order"("tronAddress");

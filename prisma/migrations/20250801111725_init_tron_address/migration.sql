-- CreateTable
CREATE TABLE "public"."TronDepositAddress" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "private_key" TEXT NOT NULL,
    "order_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TronDepositAddress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TronDepositAddress_address_key" ON "public"."TronDepositAddress"("address");

-- CreateTable
CREATE TABLE "public"."ReceivedTransaction" (
    "id" SERIAL NOT NULL,
    "tron_address" TEXT NOT NULL,
    "tx_hash" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "amount" DECIMAL(24,6) NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReceivedTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReceivedTransaction_tx_hash_key" ON "public"."ReceivedTransaction"("tx_hash");

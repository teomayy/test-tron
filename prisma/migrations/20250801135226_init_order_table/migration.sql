/*
  Warnings:

  - You are about to drop the column `amountExpected` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `tronAddress` on the `Order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[depositAddress]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `amount` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `depositAddress` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Order_tronAddress_key";

-- AlterTable
ALTER TABLE "public"."Order" DROP COLUMN "amountExpected",
DROP COLUMN "tronAddress",
ADD COLUMN     "amount" DECIMAL(24,6) NOT NULL,
ADD COLUMN     "depositAddress" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Order_depositAddress_key" ON "public"."Order"("depositAddress");

import crypto from "crypto";

export function generateEsewaSignature(
  totalAmount: string,
  transactionUuid: string,
  productCode: string
): string {
  const secretKey = process.env.ESEWA_SECRET_KEY || "8gAky6MdAStandardSecretKey";
  const data = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
  
  const hmac = crypto.createHmac("sha256", secretKey);
  hmac.update(data);
  return hmac.digest("base64");
}
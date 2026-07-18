import { createHash } from "crypto";

if (!process.env.APP_SECRET) {
  throw new Error("APP_SECRET is not set");
}

export function hashIp(ip: string): string {
  return createHash("sha256").update(`${ip}${process.env.APP_SECRET}`).digest("hex");
}

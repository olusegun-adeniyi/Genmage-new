import { createHash } from "crypto";

export function hashIp(ip: string): string {
  if (!process.env.APP_SECRET) {
    throw new Error("APP_SECRET is not set");
  }

  return createHash("sha256").update(`${ip}${process.env.APP_SECRET}`).digest("hex");
}

import { randomBytes } from "crypto";

const BASE62_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export function generateSlug(length = 8): string {
  const bytes = randomBytes(length);
  let slug = "";

  for (let i = 0; i < length; i++) {
    slug += BASE62_CHARS[bytes[i] % BASE62_CHARS.length];
  }

  return slug;
}

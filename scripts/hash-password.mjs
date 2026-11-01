// Prints the value for ADMIN_PASSWORD_HASH. Base64 keeps the "$" characters in a
// bcrypt hash away from .env variable expansion.
// Usage: npm run admin:hash -- "your-password"
import bcrypt from "bcryptjs";

const password = process.argv[2];
if (!password || password.length < 10) {
  console.error("Pass a password of at least 10 characters.");
  process.exit(1);
}
console.log(Buffer.from(await bcrypt.hash(password, 12)).toString("base64"));

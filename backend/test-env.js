import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

console.log("PORT:", process.env.PORT);
console.log("YT_API_KEY:", process.env.YT_API_KEY ? "✅ Loaded" : "❌ Missing");
console.log("HF_API_KEY:", process.env.HF_API_KEY ? "✅ Loaded" : "❌ Missing");

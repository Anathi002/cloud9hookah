import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config();

const port = Number(process.env.BACKEND_PORT || 4000);

app.listen(port, () => {
  console.log(`Cloud9 backend listening on http://localhost:${port}`);
});

import path from "path";
import { fileURLToPath } from "url";
import express from "express";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Serve React build
app.use(express.static(path.join(__dirname, "dist")));

// API route
app.get("/config", (req, res) => {
  res.json({ apiPort: process.env.PORT || 9001 });
});

// Catch-all to serve frontend for any non-API route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT || 9001;
const HOST = "0.0.0.0"; // required on Render to host

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});

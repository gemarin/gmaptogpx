import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";

import indexRouter from "./routes/index.js";

const app = express();

// view engine setup
app.set("views", path.join(process.cwd(), "views"));
app.set("view engine", "jade");

const allowedOrigins = [
  "https://gmaptogpxsite.onrender.com", // your frontend URL
];

app.use(logger("dev"));
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(process.cwd(), "public")));

app.use("/", indexRouter);

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

// Only start the server if this file is run directly
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get("/config", (req, res) => {
  res.json({ apiPort: process.env.PORT || 3000 });
});

export default app;

import express from "express";
import routeNumber from "./routeNumber.js";

const router = express.Router();

router.use("/api", routeNumber);

export default router;

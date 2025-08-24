// api/routes/routeNumber.js
import express from "express";
import { scrapeGPX } from "../scripts/gpxScraper.js";

const router = express.Router();

router.get("/gpx/:route", async (req, res) => {
  const routeRValue = req.url.includes("www")
    ? req.url.split("=")[1]
    : req.params.route;

  try {
    const isValid = !!parseInt(routeRValue);

    if (!isValid) {
      return res.status(403).send("URL not allowed");
    }

    const gpx = await scrapeGPX(routeRValue);
    res.set("Content-Type", "application/gpx+xml");
    res.send(gpx);
  } catch (err) {
    console.error("GPX generation failed:", err.message);
    res.status(500).send("Failed to generate GPX");
  }
});

export default router;

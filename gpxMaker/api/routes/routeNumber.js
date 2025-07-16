// api/routes/routeNumber.js
import express from "express";
import { scrapeGPX } from "../server/gpxScraper.js";
import { URL } from "url";

const router = express.Router();

router.get("/gpx/:route", async (req, res) => {
  console.log(
    "!!!!!Received request for GPX route:",
    req.params,
    req.params.route
  );
  console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  const routeRValue = req.url.includes("www")
    ? req.url.split("=")[1]
    : req.params.route;
  console.log("routeRValue", routeRValue);

  try {
    const isValid = !!parseInt(routeRValue);

    console.log("isValid", isValid);

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

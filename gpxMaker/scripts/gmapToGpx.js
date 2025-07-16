import { writeFileSync } from "fs";
import { launch } from "puppeteer";

const routeNumber = ""; // Replace with your route #
const outputFile = `route_${routeNumber}.gpx`;
const url = `https://www.gmap-pedometer.com/?r=${routeNumber}`;

function generateGPX(trackpoints) {
  console.log("generateGpx");
  const gpxHeader = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="gMapToGPX" xmlns="http://www.topografix.com/GPX/1/1">
  <trk>
    <name>Route ${routeNumber}</name>
    <trkseg>`;

  const gpxFooter = `
    </trkseg>
  </trk>
</gpx>`;

  const gpxPoints = trackpoints
    .map(
      (p) =>
        `      <trkpt lat="${p.lat}" lon="${p.lon}">
        ${p.ele ? `<ele>${p.ele}</ele>` : ""}
      </trkpt>`
    )
    .join("\n");

  return `${gpxHeader}\n${gpxPoints}\n${gpxFooter}`;
}

(async () => {
  const browser = await launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  // Wait until trackpoints are defined
  await page.waitForFunction(
    () =>
      typeof window.gLatLngArray !== "undefined" &&
      window.gLatLngArray.length > 0
  );

  // Extract trackpoints
  const trackpoints = await page.evaluate(() =>
    window.gLatLngArray.map((p) => ({
      lat: p.lat,
      lon: p.lng,
      ele: p.ele || null,
    }))
  );

  const gpx = generateGPX(trackpoints);

  writeFileSync(outputFile, gpx);
  console.log(`✅ GPX file saved to ${outputFile}`);

  await browser.close();
})();

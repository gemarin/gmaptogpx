import { launch } from "puppeteer";

export async function scrapeGPX(routeNumber) {
  const url = new URL(`https://www.gmap-pedometer.com/?r=${routeNumber}`);
  const browser = await launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--single-process",
      "--no-zygote",
    ],
  });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "networkidle2" });

  try {
    await page.waitForFunction(
      () => {
        return (
          typeof window.gLatLngArray !== "undefined" &&
          window.gLatLngArray.length > 0
        );
      },
      {
        timeout: 60000, // wait up to 1 minute
        polling: 500, // check every 0.5 seconds
      }
    );
  } catch (err) {
    // Log the page HTML for debugging
    const html = await page.content();
    console.error(
      "GPX generation failed: Timeout waiting for route data. Page HTML:",
      html
    );
    await browser.close();
    throw err;
  }

  const trackpoints = await page.evaluate(() =>
    window.gLatLngArray.map((p) => ({
      lat: p.lat,
      lon: p.lng,
      ele: p.ele || null,
    }))
  );

  const gpx = generateGPX(routeNumber, trackpoints);

  await browser.close();
  return gpx;
}

function generateGPX(routeNumber, trackpoints) {
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

import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

export async function scrapeGPX(routeNumber) {
  const url = `https://www.gmap-pedometer.com/?r=${routeNumber}`;
  const browser = await puppeteer.launch({
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

  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) " +
      "AppleWebKit/537.36 (KHTML, like Gecko) " +
      "Chrome/119.0.0.0 Safari/537.36"
  );

  await page.setViewport({ width: 1280, height: 800 });
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
    Object.defineProperty(navigator, "languages", {
      get: () => ["en-US", "en"],
    });
    Object.defineProperty(navigator, "plugins", { get: () => [1, 2, 3, 4, 5] });
  });

  await page.goto(url, { waitUntil: "domcontentloaded" });

  // Find the right frame that contains gLatLngArray
  const targetFrame = page
    .frames()
    .find((f) => f.url().includes(`gmap-pedometer.com/?r=${routeNumber}`));

  if (!targetFrame) {
    throw new Error("❌ Could not find gmap-pedometer route frame");
  }

  // Wait until gLatLngArray is populated
  await targetFrame.waitForFunction(
    () =>
      typeof window.gLatLngArray !== "undefined" &&
      window.gLatLngArray.length > 0,
    { timeout: 60000, polling: 500 }
  );

  // Extract trackpoints
  const trackpoints = await targetFrame.evaluate(() =>
    window.gLatLngArray.map((p) => ({
      lat: typeof p.lat === "function" ? p.lat() : p.lat,
      lon: typeof p.lng === "function" ? p.lng() : p.lng,
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

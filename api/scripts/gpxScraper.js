import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

export async function scrapeGPX(routeNumber) {
  const url = new URL(`https://www.gmap-pedometer.com/?r=${routeNumber}`);
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
  for (let i = 0; i < 10; i++) {
    const length = await page.evaluate(() => window.gLatLngArray?.length || 0);
    console.error(`🔎 Iteration ${i}: gLatLngArray length =`, length);
    await new Promise((r) => setTimeout(r, 2000)); // wait 2s
  }

  for (const frame of page.frames()) {
    const hasKey = await frame.evaluate(() => "gLatLngArray" in window);
    console.error(`Frame URL: ${frame.url()} -> has gLatLngArray? ${hasKey}`);
  }

  page.on("console", (msg) => console.log("📜 BROWSER:", msg.text()));

  // then inside evaluate
  await page.evaluate(() => {
    console.log(
      "Inside browser. gLatLngArray length:",
      window.gLatLngArray?.length
    );
  });
  await page.waitForTimeout(10000); // wait 10s
  const exists = await page.evaluate(
    () => typeof window.gLatLngArray !== "undefined"
  );
  const length = await page.evaluate(() => window.gLatLngArray?.length || 0);
  console.log("✅ Exists:", exists, "Length:", length);

  // try {
  //   await page.waitForFunction(
  //     () => {
  //       return (
  //         typeof window.gLatLngArray !== "undefined" &&
  //         window.gLatLngArray.length > 0
  //       );
  //     },
  //     {
  //       timeout: 60000, // wait up to 1 minute
  //       polling: 500, // check every 0.5 seconds
  //     }
  //   );
  // } catch (err) {
  //   // Log the page HTML for debugging

  //   const exists = await page.evaluate(
  //     () => typeof window.gLatLngArray !== "undefined"
  //   );
  //   const length = await page.evaluate(() => window.gLatLngArray?.length || 0);
  //   console.error(
  //     "❌ gLatLngArray check failed. Exists?",
  //     exists,
  //     "Length:",
  //     length
  //   );
  //   await browser.close();
  //   throw err;
  // }

  const trackpoints = await page.evaluate(() =>
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

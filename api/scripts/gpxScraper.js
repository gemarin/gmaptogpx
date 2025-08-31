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

  await page.goto(url, { waitUntil: "networkidle2" });

  // --- DEBUG: check every frame ---
  for (const frame of page.frames()) {
    try {
      const hasKey = await frame.evaluate(
        () => typeof window.gLatLngArray !== "undefined"
      );
      console.log(`🔎 Frame: ${frame.url()} -> gLatLngArray? ${hasKey}`);
    } catch (e) {
      console.log(`⚠️ Frame: ${frame.url()} -> error checking`, e.message);
    }
  }

  // Find the frame that actually contains gLatLngArray
  let targetFrame = null;
  for (const frame of page.frames()) {
    try {
      const hasKey = await frame.evaluate(
        () => typeof window.gLatLngArray !== "undefined"
      );
      if (hasKey) {
        targetFrame = frame;
        break;
      }
    } catch {
      // ignore inaccessible frames
    }
  }

  if (!targetFrame) {
    // dump some HTML for debugging
    const body = await page.evaluate(() =>
      document.body.innerHTML.slice(0, 500)
    );
    console.error("❌ Could not find gLatLngArray in any frame.");
    console.error("🔎 First 500 chars of body:\n", body);
    await browser.close();
    throw new Error("gLatLngArray not found");
  }

  console.log("✅ Found frame with gLatLngArray:", targetFrame.url());

  // --- wait for it to populate ---
  await targetFrame.waitForFunction(
    () => window.gLatLngArray && window.gLatLngArray.length > 0,
    { timeout: 60000, polling: 1000 }
  );

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

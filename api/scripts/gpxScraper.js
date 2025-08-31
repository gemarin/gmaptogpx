import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import fs from "fs";
import path from "path";

puppeteer.use(StealthPlugin());

export async function scrapeGPX(routeNumber) {
    console.log("start")
  const url = new URL(`https://www.gmap-pedometer.com/gp/ajaxRoute/get`);
    const data = await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ rId: "7794474"}), // todo make this routeNumber
    })
    let body = await data.text()
    console.log(body)
    let polyIndex = body.indexOf("polyline=");
    let test2 = body.substring(polyIndex+9, body.indexOf("&", polyIndex))
    console.log(test2)
    let arr = test2.split('a')
    console.log(arr)
    let newArr = [];
    for (let i = 0; i < arr.length -1; i+=2) {
        newArr.push({lng: arr[i+1], lat: arr[i]})
    }
    console.log(newArr) //todo window.gLatLngArray seems to truncate trailing zeros which im not you can if you need to


  const trackpoints = newArr.map((p) => ({
      lat: typeof p.lat === "function" ? p.lat() : p.lat,
      lon: typeof p.lng === "function" ? p.lng() : p.lng,
      ele: p.ele || null, // todo this does not actually exist in the latlong array????
  }));
    console.log(trackpoints)

  const gpx = generateGPX(routeNumber, trackpoints);
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

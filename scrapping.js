const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
  });
  const page = await browser.newPage();
  await page.goto("https://kog.tw/#p=maps");
  await page.waitForSelector(".card-deck");

  const mapsData = await page.evaluate(() => {
    const maps = [];

    const mapElements = document.querySelectorAll(".card-deck .card");
    mapElements.forEach((mapElement) => {
      const mapName = mapElement.querySelector(".card-header h4").innerText;

      const mapper = mapElement.querySelector(
        ".card-body li:nth-child(4)"
      ).innerText;

      const points = parseInt(
        mapElement.querySelector(".card-body li:nth-child(3)").innerText
      );

      const type = mapElement.querySelector(
        ".card-body li:nth-child(2)"
      ).innerText;

      const stars = mapElement.querySelectorAll(
        ".card-body li:nth-child(1) .bi-star-fill"
      ).length;

      const relesead = mapElement.querySelector(".card-footer").innerText;

      maps.push({
        map: mapName,
        mapper: mapper,
        type: type,
        points: points,
        stars: stars,
        relesead: relesead,
      });
    });

    return maps;
  });

  await browser.close();

  const fs = require("fs");
  fs.writeFileSync("maps-data.json", JSON.stringify(mapsData, null, 2));
  console.log("Map data extracted and saved to maps-data.json");
})();

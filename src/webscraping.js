const puppeteer = require('puppeteer'); 

const getQuotes = async (nombre) => {
  // Start a Puppeteer session with:
  // - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
  // - no default viewport (`defaultViewport: null` - website page will in full width and height)
  const browser = await puppeteer.launch({
    headless: "new",
    //defaultViewport: null,
    args:[
      '--no-sandbox'
    ]
  });

  // Open a new page
  const page = await browser.newPage();

  await page.goto("https://www.g2a.com/es/", {
    waitUntil: "domcontentloaded",
  });

  // Obtiene el HTML de la pagina actual
  const source = await page.content({"waitUntil": "domcontentloaded"});

  await page.waitForSelector('.indexes__InputContainer-sc-1n30rfz-154 input', {visible: true});
  await page.type('.indexes__InputContainer-sc-1n30rfz-154 input', nombre);
  await Promise.all([
    page.waitForNavigation({waitUntil: "domcontentloaded"}),
    page.keyboard.press("Enter"),
  ]);

  // Get page data
  const scraping = await page.evaluate(() => {
    // Fetch the first element with class "quote"
    const divs = document.querySelectorAll(".sc-csTbgd.kglWtV");
    
    return Array.from(divs).map((d) => {
        const div_juego = d.querySelector(".sc-dFRpbK.jtOUCg");
        const div_precio = d.querySelector(".sc-hBMUJo.bRGwob");
        
        const nombre = div_juego.querySelector("a").innerText;
        const url = div_juego.querySelector("a").href;
        const precio_act = div_precio.querySelector("span").innerText;
        
        return {nombre, url, precio_act};
    })

  });

  // Display the source
  console.log(scraping);

  // Close the browser
  await browser.close();
};

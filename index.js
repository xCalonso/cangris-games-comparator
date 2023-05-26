'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const port = process.env.PORT || 8080

const app = express()
var cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static('frontend/build'))
app.get('/', function(req, res) {
  console.log('hola')
  res.sendFile(__dirname + 'frontend/build/index.html')
});

const puppeteer = require('puppeteer')
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
  console.log('hola2')

  // Open a new page
  const page = await browser.newPage();

  // On this new page:
  // - open the "http://quotes.toscrape.com/" website
  // - wait until the dom content is loaded (HTML is ready)
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
  //console.log(scraping);

  // Close the browser
  await browser.close();
  return scraping;
};

app.get('/webscrap', async function(req, res) {
  const juego = req.query.juego || "Minecraft";
  console.log('hola3')
  const juegos = await getQuotes(juego)
  console.log(juegos)
  res.send(juegos)
  /*
  new Promise((resolve,reject) =>{
    getQuotes(juego)
    .then(data =>{
      resolve(data)
    })
    .catch(err => reject(err));
  })
  
  Promise.all([juegos])
  .then(data => {
    //console.log(data)
    //res.send(data[0])
    //res.render('index', { data: { juegos: data[0] }})
  })
  .catch(err => res.status(500).send(err))
  */
})

app.listen(port, () => {
  console.log(`Backend funcionando en http://localhost:${port}`)
})


process.on('error', function (err) {
  console.log(err);
});



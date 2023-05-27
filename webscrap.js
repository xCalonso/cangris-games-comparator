//const SteamAPI = require('steam-webapi');
//const steam = new SteamAPI('2A263491854331441324FA092F40370E');

const SteamAPI = require('steamapi');
const steam = new SteamAPI('2A263491854331441324FA092F40370E');
const stringSimilarity = require('string-similarity');
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

async function obtenerInfoJuego(nombreJuego) {
  try {

    const juegos = (await steam.getAppList()); // Obtiene la lista de juegos
    const nombresJuegos=juegos.map(juego => juego.name);

    const mejorMatch = stringSimilarity.findBestMatch(nombreJuego, nombresJuegos);

    // Busca el juego por nombre
    //const juegoEncontrado = juegos.find(juego => juego.name.toLowerCase() === nombreJuego.toLowerCase());

    if (mejorMatch.bestMatch.rating > 0) {
      const MejorResultado= juegos.find(juego=>juego.name===mejorMatch.bestMatch.target);
      appID= MejorResultado.appid.toString();
      //console.log(appID);
      //appID= juego_appID.appid.toString();
    } else {
      console.error('No se encontró el juego con el nombre especificado');
      return null;
    }
  } catch (error) {
    console.error('Error al obtener el appID:', error);
    return null;
  }
    const game = await steam.getGameDetails(appID);
    const nombre = game.name;
    if(game.price_overview===undefined){
        const precio= 'Juego actualmente fuera de Stock';
    }
    else{
          precio = game.price_overview.final_formatted;
    }
    //console.log(nombre);
   
    const urlImagen = game.header_image;
    const urlStore = game.url;
    return { nombre, precio, urlImagen };
//catch (error) {
  //  console.error('Error al obtener la información del juego:', error);
    //return null;
  //}
}

module.exports = {obtenerInfoJuego}

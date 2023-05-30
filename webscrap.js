const stringSimilarity = require('string-similarity');
const querystring = require('querystring');
const puppeteer = require('puppeteer');
const axios = require('axios');

const apiKey = '2A263491854331441324FA092F40370E';

const webscrapG2A = async (juego) => {
  const browser = await puppeteer.launch({
    headless: "new",
    ignoreDefaultArgs: ['--disable-extensions'],
    //defaultViewport: null,
    args:[
      '--no-sandbox'
    ]
  });
  
  const juego_query = querystring.stringify(juego) 

  const page = await browser.newPage();

  await page.goto(`https://www.g2a.com/es/search?query=${juego}`, {waitUntil: "domcontentloaded"});

  const nombre = await page.$eval('.sc-dFRpbK.jtOUCg a', el => el.textContent);
  const url = await page.$eval('.sc-dFRpbK.jtOUCg a', el => el.href);
  const precio = await page.$eval('.sc-hBMUJo.bRGwob span', el => el.textContent);
  
  const scraping = {nombre, precio, url};

  console.log(scraping);

  await browser.close();
  return scraping;
};

const webscrapIG = async (juego) => {
  const browser = await puppeteer.launch({
    headless: "new",
    ignoreDefaultArgs: ['--disable-extensions'],
    //defaultViewport: null,
    args:[
      '--no-sandbox'
    ]
  });
  const page = await browser.newPage();
    
  await page.goto('https://www.instant-gaming.com/es/', { waitUntil: 'domcontentloaded' });

  await page.click('input[class="search-input"]');
  await page.type('input[class="search-input"]', juego);
  await page.waitForNavigation();
  
  const nombre = await page.$eval('.text', el => el.textContent);
  const precio = await page.$$eval('.price', el => el[1].textContent.trim());
  const url = await page.$eval('.cover', el=> el.href);
  //const discount = await page.$eval('.discount', el => el.textContent.trim());

  //console.log(`Nombre: ${name}\nPrecio: ${price}\nDescuento: ${discount}`);

  await browser.close();
  return {nombre, precio, url};
};


const steamAPI = async (nombreJuego) => {
  try {
    const listaUrl = `https://api.steampowered.com/ISteamApps/GetAppList/v2/?key=${apiKey}&format=json`;

    const response1 = await axios.get(listaUrl);

    const juegos =response1.data.applist.apps;

    //console.log(juegos);

    const nombresJuegos=juegos.map(juego => juego.name.toLowerCase());
    
    //console.log(nombresJuegos);

    const mejorMatch = stringSimilarity.findBestMatch(nombreJuego.toLowerCase(), nombresJuegos);

    if (mejorMatch.bestMatch.rating > 0) {
      //console.log(mejorMatch.bestMatch);
      const MejorResultado= juegos.find(juego=>juego.name.toLowerCase()===mejorMatch.bestMatch.target);
      //console.log(MejorResultado);
      gameId= MejorResultado.appid.toString();
    } else {
      console.error('No se encontró el juego con el nombre especificado');
      return null;
    }
  } catch (error) {
    console.error('Error al obtener el appID:', error);
  }

  const apiUrl= `http://store.steampowered.com/api/appdetails?appids=${gameId}`; 
    
  const response2 = await axios.get(apiUrl);
    
  const datos = response2.data;

  //console.log(datos);

  const nombre= datos[gameId].data.name;
  const urlImagen= datos[gameId].data.header_image;
  precio = datos[gameId].data.price_overview;
  if(precio==undefined){
    precio= 'Juego actualmente fuera de Stock';
  }
  else{
    precio = precio.final_formatted;
  }
  const url = `https://store.steampowered.com/app/${gameId}`;

  //console.log(precio);

  return{nombre, precio, url, urlImagen};
}

//console.log(steamAPI("elden ring"))

module.exports = {webscrapG2A, webscrapIG, steamAPI}

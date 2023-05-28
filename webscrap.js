const stringSimilarity = require('string-similarity');
const puppeteer = require('puppeteer');
const axios = require('axios');

const apiKey = '2A263491854331441324FA092F40370E';

const webscrapG2A = async (nombre) => {
  const browser = await puppeteer.launch({
    headless: "new",
    //defaultViewport: null,
    args:[
      '--no-sandbox'
    ]
  });

  const page = await browser.newPage();

  await page.goto("https://www.g2a.com/es/", {waitUntil: "domcontentloaded"});

  const source = await page.content({"waitUntil": "domcontentloaded"});

  await page.waitForSelector('.indexes__InputContainer-sc-1n30rfz-154 input', {visible: true});
  await page.type('.indexes__InputContainer-sc-1n30rfz-154 input', nombre);
  await Promise.all([
    page.waitForNavigation({waitUntil: "domcontentloaded"}),
    page.keyboard.press("Enter"),
  ]);

  const scraping = await page.evaluate(() => {
    const div_juego = document.querySelector(".sc-dFRpbK.jtOUCg");
    const div_precio = document.querySelector(".sc-hBMUJo.bRGwob");

    const nombre = div_juego.querySelector("a").innerText;
    const url = div_juego.querySelector("a").href;
    const precio_act = div_precio.querySelector("span").innerText;

    return {nombre, url, precio_act};
    
    /*
    const divs = document.querySelectorAll(".sc-csTbgd.kglWtV");
    return Array.from(divs).map((d) => {
        const div_juego = d.querySelector(".sc-dFRpbK.jtOUCg");
        const div_precio = d.querySelector(".sc-hBMUJo.bRGwob");
        
        const nombre = div_juego.querySelector("a").innerText;
        const url = div_juego.querySelector("a").href;
        const precio_act = div_precio.querySelector("span").innerText;
        
        return {nombre, url, precio_act};
    })
    */

  });
  //console.log(scraping);

  await browser.close();
  return scraping;
};

const webscrapIG = async (nombre) => {
  const browser = await puppeteer.launch({
    headless: "new",
    ignoreDefaultArgs: ['--disable-extensions'],
    //defaultViewport: null,
    args:[
      '--no-sandbox'
    ]
  });
  const page = await browser.newPage();
    
  await page.goto('https://www.instant-gaming.com/es/', { waitUntil: 'networkidle0' });

  await page.click('input[class="search-input"]');
  await page.type('input[class="search-input"]', nombre);
  await page.waitForNavigation();
  
  const name = await page.$eval('.text', el => el.textContent);
  const price = await page.$$eval('.price', el => el[1].textContent.trim());
  const url = await page.$eval('.cover', el=> el.href);
  //const discount = await page.$eval('.discount', el => el.textContent.trim());

  //console.log(`Nombre: ${name}\nPrecio: ${price}\nDescuento: ${discount}`);

  await browser.close();
  return {name, price, url};
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
  const urlTienda= `https://store.steampowered.com/app/${gameId}`;

  //console.log(precio);

  return{nombre, precio, urlImagen, urlTienda};
}

//console.log(steamAPI("elden ring"))

module.exports = {webscrapG2A, webscrapIG, steamAPI}

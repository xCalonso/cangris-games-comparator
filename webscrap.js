//const SteamAPI = require('steam-webapi');
//const steam = new SteamAPI('2A263491854331441324FA092F40370E');

const SteamAPI = require('steamapi');
const steam = new SteamAPI('2A263491854331441324FA092F40370E');
const stringSimilarity = require('string-similarity');

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
    return { nombre, precio, urlImagen };
//catch (error) {
  //  console.error('Error al obtener la información del juego:', error);
    //return null;
  //}
}

module.exports = {obtenerInfoJuego}

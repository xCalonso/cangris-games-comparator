'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const port = process.env.PORT || 8080

const app = express()
var cors = require('cors');

const webscrap = require('./webscrap')

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static('frontend/dist'))
app.get('/', function(req, res) {
  console.log('hola')
  res.sendFile(__dirname + 'frontend/dist/index.html')
});

app.get('/webscrap', function(req, res) {
  const juego = req.query.juego || "Minecraft";
  webscrap.obtenerInfoJuego(juego)
  .then(infoJuego => {
    if (infoJuego) {
      res.send(infoJuego)
      /*
      console.log('Nombre:', infoJuego.nombre);
      console.log('Precio:', infoJuego.precio);
      console.log('URL de la imagen:', infoJuego.urlImagen);
      */
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
  /*
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



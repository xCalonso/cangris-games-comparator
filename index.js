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
  res.sendFile(__dirname + 'frontend/dist/index.html')
});

app.get('/webscrap/:n_juego', async function(req, res) {
  const juego = req.params.n_juego;
  console.log(juego)
  const steam = await webscrap.steamAPI(juego)
  const G2A = await webscrap.webscrapG2A(juego)
  const IG = await webscrap.webscrapIG(juego)
  
  //res.send(IG)
  res.send([steam, G2A, IG]);
  /*
  webscrap.steamAPI(juego)
    .then(infoJuego => {
      if (infoJuego) {
        res.send(infoJuego)
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  */
  /*
  const steam = new Promise((resolve,reject) =>{
    webscrap.steamAPI(juego)
    .then(data =>{
      resolve(data)
    })
    .catch(err => reject(err));
  })
  
  const IG = new Promise((resolve,reject) =>{
    webscrap.webscrapIG(juego)
    .then(data =>{
      resolve(data)
    })
    .catch(err => reject(err));
  })
  
  const G2A = new Promise((resolve,reject) =>{
    webscrap.webscrapG2A(juego)
    .then(data =>{
      resolve(data)
    })
    .catch(err => reject(err));
  })
  
  Promise.all([steam, IG, G2A])
  .then(data => {
    console.log(data)
    res.send(data)
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

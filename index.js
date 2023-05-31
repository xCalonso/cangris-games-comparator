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

app.use(express.static(__dirname + '/frontend/dist'))
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/frontend/dist/index.html')
});
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

app.get('/webscrap/:n_juego', async function(req, res) {
  const juego = req.params.n_juego;
  console.log(juego)
  try {
    const steam = await webscrap.steamAPI(juego)
    const G2A = await webscrap.webscrapG2A(juego)
    const IG = await webscrap.webscrapIG(juego)
    
    //res.send(IG)
    res.send([steam, G2A, IG]);
  }
  catch(err) {
    console.log(err);
    res.status(500).send(err)
  }
  
})

app.listen(port, () => {
  console.log(`Backend funcionando en http://localhost:${port}`)
})

process.on('error', function (err) {
  console.log(err);
});

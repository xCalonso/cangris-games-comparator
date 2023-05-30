<template>
  <div class="CGC">

    <header>
      <v-app-bar color="primary" dark>
        <v-toolbar-title>CANGRIS GAMES COMPARATOR</v-toolbar-title>
        <v-spacer></v-spacer>
        <nav>
          <ul>
            <li @click="menu('inicio')" style="cursor: pointer"><v-icon @click="menu('inicio')">mdi-home</v-icon>Inicio</li>
            <li @click="menu('busqueda')" style="cursor: pointer"><v-icon @click="menu('busqueda')">mdi-search-web</v-icon>Página de búsqueda</li>
            <li @click="menu('manual')" style="cursor: pointer"><v-icon @click="menu('manual')">mdi-book-open-outline</v-icon> Página de manual</li>
          </ul>
        </nav>
      </v-app-bar>
    </header>

    <div v-show="submenu === 'inicio'">
      <div class="display-2 font-weight-bold mt-6 mb-2" style="display: flex; justify-content: center; align-items: center;">Bienvenido a CGC</div>
      <div style="width: 500">
        <div class="display-1 font-weight-bold mt-6 mb-2" style="display: flex; justify-content: center; align-items: center;">
          CGC - Cangris Games Comparator es una aplicación que compara los precios entre tres de las tiendas de videojuegos más importantes
        </div>
      </div>
      
      <br><br>

      <div style="display: flex; justify-content: space-between; align-items: center;">
        <v-img :max-width="500" eager="true" aspect-ratio="16/9" cover src="https://www.g2a.com/static/assets/images/logo_g2a_white.svg"></v-img>
        <v-img :max-width="500" eager="true" aspect-ratio="16/9" cover src="https://cdn.freebiesupply.com/logos/large/2x/instant-gaming-1-logo-svg-vector.svg"></v-img>
        <v-img :max-width="500" eager="true" aspect-ratio="16/9" cover src="https://store.akamai.steamstatic.com/public/shared/images/header/logo_steam.svg"></v-img>
      </div>
    </div>

    <div v-show="submenu === 'busqueda'">
      <div class="display-2 font-weight-bold mt-6 mb-2" style="display: flex; justify-content: center; align-items: center;">Página de búsqueda</div>
      <div style="max-width: 900px; margin: 0 auto">
        <v-text-field :rules="[field_not_empty]" v-model="n_juego" placeholder="Nombre del Juego" outlined required></v-text-field>
      </div>
      <v-btn @click="webscrap" color="secondary" dark x-large outlined :style="{left: '50%', transform:'translateX(-50%)'}">Buscar</v-btn>
      <h2 v-if="!!juego">{{ juego }}</h2>

      <div style="display: flex; justify-content: center; align-items: center;">
        <img v-if="!!juego" v-bind:src="juego[0].urlImagen">
      </div>
    </div>

    <div v-show="submenu === 'manual'">
      <h1>Página de manual</h1>

      <h2>Proyecto realizado por Carlos de Alonso Andrés y Hugo Antonio Teruel</h2>
      <h3>Ingeniería de Sistemas de Información 2023 Universidad de Granada</h3>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
const url = 'http://localhost:8080'
//const url = 'https://cgc-cangris-games-comparator.nw.r.appspot.com'

export default {
  name: 'CGC',
  
  data: () => ({
    submenu:'inicio',
    
    juego: null,

    n_juego:"",
    
    field_not_empty   : (str)   => (str) ? true  : "El campo no puede ser vacío"
   }),
  
  methods: {
    async webscrap(){
      try {
        this.juego = (await axios.get(`${url}/webscrap/${this.n_juego}`)).data
      } catch (err){
        console.log(err)
      }
    },
    
    async menu(elegir) {
      this.submenu = elegir;
    }
  }  
}
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

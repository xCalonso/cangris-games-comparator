<template>
  <div class="CGC">

    <header>
      <v-app-bar color="#11009E" dark>
        <v-toolbar-title>CANGRIS GAMES COMPARATOR</v-toolbar-title>
        <v-spacer></v-spacer>
        <nav>
          <ul>
            <li @click="menu('inicio')" style="cursor: pointer"><v-icon @click="menu('inicio')">mdi-home</v-icon>Inicio</li>
            <li @click="menu('busqueda')" style="cursor: pointer"><v-icon @click="menu('busqueda')">mdi-search-web</v-icon>Búsqueda</li>
            <li @click="menu('manual')" style="cursor: pointer"><v-icon @click="menu('manual')">mdi-book-open-outline</v-icon> Ayuda</li>
          </ul>
        </nav>
      </v-app-bar>
    </header>

    <div v-show="submenu === 'inicio'">
      <div class="display-2 font-weight-bold mt-6 mb-2" style="color:#4942E4; display: flex; justify-content: center; align-items: center;">Bienvenido a CGC</div>
      <div style="width: 500">
        <div class="text-body-2 mb-4" style="display: flex; justify-content: center; align-items: center;">
          CGC - Cangris Games Comparator es una aplicación que compara precios entre tres de las tiendas de videojuegos más importantes
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
      <div class="display-2 font-weight-bold mt-6 mb-2" style="color:#4942E4; display: flex; justify-content: center; align-items: center;">Página de búsqueda</div>
      <div style="max-width: 900px; margin: 0 auto">
        <v-text-field :rules="[field_not_empty]" v-model="n_juego" placeholder="Nombre del Juego" outlined required></v-text-field>
      </div>
      <v-btn @click="webscrap" color="secondary" dark x-large outlined :style="{left: '50%', transform:'translateX(-50%)'}">Buscar</v-btn>

      <br><br>
      <div v-if="!!juego" >
        <div style="display: flex; justify-content: center; align-items: center;">
          <v-img :max-width="700" cover v-bind:src="juego[0].urlImagen"></v-img>
        </div>

        <br><br>
        <div style="display: flex; justify-content: center; align-items: center;">
          <v-card> 
            <v-card-title>
              Steam
            </v-card-title>
            <v-card-subtitle>
              El precio en la tienda de Steam es de: {{ juego[0].precio }}
            </v-card-subtitle>
            <v-card-actions>
              <v-btn v-bind:href="juego[0].url">Tienda Steam</v-btn>
            </v-card-actions>
          </v-card>

          <pre>     </pre>

          <v-card> 
            <v-card-title>
              G2A-Gaming
            </v-card-title>
            <v-card-subtitle>
              El precio en la tienda de G2A es de: {{ juego[1].precio }}
            </v-card-subtitle>
            <v-card-actions>
              <v-btn v-bind:href="juego[1].url">Tienda G2A</v-btn>
            </v-card-actions>
          </v-card>
          
          <pre>     </pre>

          <v-card> 
            <v-card-title>
              Instant-Gaming
            </v-card-title>
            <v-card-subtitle>
              El precio en la tienda de IG es de: {{ juego[2].precio }}
            </v-card-subtitle>
            <v-card-actions>
              <v-btn v-bind:href="juego[2].url">Tienda IG</v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </div>
    </div>

    <div v-show="submenu === 'manual'">
      <br>
      <div style="display: flex; justify-content: center; align-items: center;">
        <v-sheet class="d-flex align-center justify-center flex-wrap text-center mx-auto px-4" elevation="4" height="250" rounded max-width="900" width="100%"  >
          <div>
            <h2 class="text-h4 font-weight-black" style="color:#4942E4">CGC - Cangris Games Comparator</h2>
            <br>
            <div class="text-h5 font-weight-medium mb-2" style="color:#8696FE">
              Proyecto realizado por Carlos de Alonso Andrés y Hugo Antonio Teruel
            </div>
            <br>
            <p class="text-body-2 mb-4">
              Para realizar una búsqueda, diríjase a la página "Búsqueda", introduzca el juego que desea comparar y pulse en el botón.<br>
              La búsqueda al ser en caliente tarda unos segundos en completarse.
            </p>
          </div>
        </v-sheet>
      </div>

    </div>
  </div>
</template>

<script>
import axios from 'axios'
//const url = 'http://localhost:8080'
//const url = 'https://cgc-cangris-games-comparator.nw.r.appspot.com'
const url = 'https://isi-cgc.nw.r.appspot.com'

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

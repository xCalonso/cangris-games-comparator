<template>
  <div class="CGC">
    <div style="max-width: 900px; margin: 0 auto">
      <v-text-field :rules="[field_not_empty]" v-model="n_juego" placeholder="Nombre del Juego" outlined required></v-text-field>
    </div>
    <v-btn @click="webscrap" color="secondary" dark x-large outlined :style="{left: '50%', transform:'translateX(-50%)'}">prueba</v-btn>
    <h2>{{ juego }}</h2>
  </div>
</template>

<script>
import axios from 'axios'
const url = 'http://localhost:8080'
//const url = 'https://cgc-cangris-games-comparator.nw.r.appspot.com'

export default {
  name: 'CGC',
  
  data: () => ({
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
    } 
  }  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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

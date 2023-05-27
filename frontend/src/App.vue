<template>
  <v-app>
    <v-main>
      <CGC/>
    </v-main>
  </v-app>
</template>

<script>
import CGC from './components/CGC.vue'

export default {
  name: 'App',

  components: {
    CGC,
  },

  data: () => ({
    //
  }),
}
</script>

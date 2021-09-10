<template>
  <body>
    <next-track-screen></next-track-screen>
  </body>
</template>

<script>
import NextTrackScreen from './components/NextTrackScreen.vue'

export default {
  name: 'App',
  components: {
    NextTrackScreen
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: whitesmoke;
}
body{
  background-color: whitesmoke;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>

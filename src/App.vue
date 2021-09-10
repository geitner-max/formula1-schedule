<template>
  <body>
    <next-track-box></next-track-box>
  </body>
</template>

<script>
import NextTrackBox from './components/NextTrackBox.vue'

export default {
  name: 'App',
  components: {
    NextTrackBox
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

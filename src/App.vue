<template>

  <body>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <page-header/>
    <router-view></router-view>
    
  </body>
</template>

<script>
//import ScheduleScreen from './components/ScheduleScreen.vue'
import {RouterView} from "vue-router";
import PageHeader from './components/subcomponents/PageHeader.vue';


export default {
  name: 'App',
  components: {
    RouterView,
    PageHeader
  },
}
</script>


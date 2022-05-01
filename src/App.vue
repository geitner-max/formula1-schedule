<template>
  <body>
    <page-header/>
    <router-view></router-view>
    
  </body>
</template>

<script>
//import ScheduleScreen from './components/ScheduleScreen.vue'
import {RouterView} from "vue-router";
import PageHeader from './components/subcomponents/PageHeader.vue';
import "@/main.css";

export default {
  name: 'App',
  components: {
    RouterView,
    PageHeader
  },
}
</script>


<template>

  <body>
    <div class="page-container">
      <div id="content-wrap">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <page-header/>
        <router-view></router-view>
      </div>
      <page-footer/>
    </div>
  </body>
 
</template>

<script>
//import ScheduleScreen from './components/ScheduleScreen.vue'
import {RouterView} from "vue-router";
import PageHeader from './components/subcomponents/PageHeader.vue';
import PageFooter from './components/subcomponents/PageFooter.vue';

export default {
  name: 'App',
  components: {
    RouterView,
    PageHeader,
    PageFooter
  },
}
</script>


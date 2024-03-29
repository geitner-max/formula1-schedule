import {createApp} from 'vue';
import App from './App.vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import { createRouter, createWebHistory } from 'vue-router';
//import { BootstrapVue, } from 'bootstrap-vue';

import "bootstrap";
// Tooltip
import FloatingVue from 'floating-vue';
import 'floating-vue/dist/style.css';

import ScheduleScreen from './components/ScheduleScreen.vue';
import Standings from './components/Standings.vue';
import Analysis from './components/Analysis.vue';

// Import Bootstrap and BootstrapVue CSS files (order is important)

import "./theme/custom.css";
import "./main.css";
import PageNotFound from './components/PageNotFound.vue';

// 1. Define some routes
// Each route should map to a component.
// We'll talk about nested routes later.
const routes = [
  { path: '/', component: ScheduleScreen },
  { path: '/standings', component: Standings },
  { path: '/analysis', component: Analysis },
  { path: "/:pathMatch(.*)*", component: PageNotFound }
]


// 2. Create the router instance and pass the `routes` option
const router = createRouter({
    // 3. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: createWebHistory(import.meta.env.BASE_URL),
    routes, // short for `routes: routes`
  })
  

const app = createApp(App)
  app.use(FloatingVue)
  app.use(router)
  app.use(VueAxios, axios)
  app.provide('axios', app.config.globalProperties.axios)
  
  app.mount('#app')
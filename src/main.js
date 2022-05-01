import { createApp } from 'vue';
import App from './App.vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import { createRouter, createWebHistory } from 'vue-router';
import ScheduleScreen from '/src/components/ScheduleScreen';
import Standings from '/src/components/Standings';
//import PageNotFound from '/src/components/PageNotFound';
// 2. Define some routes
// Each route should map to a component.
// We'll talk about nested routes later.
const routes = [
  { path: '/', component: ScheduleScreen },
  { path: '/standings', component: Standings },
  /*{ path: "*", component: PageNotFound }*/
]


// 3. Create the router instance and pass the `routes` option
const router = createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: createWebHistory(),
    routes, // short for `routes: routes`
  })
  

const app = createApp(App)
    app.use(router)
    app.use(VueAxios, axios)
    app.provide('axios', app.config.globalProperties.axios)
    
    app.mount('#app')
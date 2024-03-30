import 'bootstrap/dist/css/bootstrap.css'

import { createApp } from 'vue'
import App from './App.vue'
import 'material-design-icons/iconfont/material-icons.css'

import axios from 'axios';
import VueAxios from 'vue-axios';

import router from './router'

import storage from './storage';

export const URL_API = 'http://localhost/api'; // Conexion al api con el reverse proxy
// export const URL_API = 'http://localhost:3000/api'; // Conexion al api sin el reverse proxy

axios.defaults.baseURL = URL_API; // Conexion al api con el reverse proxy

// let token = localStorage.getItem('token');
// axios.defaults.headers.common['Authorization']='Bearer '+token;

createApp(App).use(router).use(storage).use(VueAxios, axios).mount('#app')

import 'bootstrap/dist/js/bootstrap.js'
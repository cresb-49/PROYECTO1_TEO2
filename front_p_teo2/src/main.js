import 'bootstrap/dist/css/bootstrap.css'

import { createApp } from 'vue'
import App from './App.vue'
import 'material-design-icons/iconfont/material-icons.css'

import axios from 'axios';
import VueAxios from 'vue-axios';

import router from './router'

import storage from './storage';

axios.defaults.baseURL='http://localhost:3000/api';

// let token = localStorage.getItem('token');
// axios.defaults.headers.common['Authorization']='Bearer '+token;

createApp(App).use(router).use(storage).use(VueAxios,axios).mount('#app')

import 'bootstrap/dist/js/bootstrap.js'
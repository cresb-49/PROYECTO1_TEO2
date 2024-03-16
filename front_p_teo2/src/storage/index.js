import { createStore } from 'vuex';
import VuexPersistence from 'vuex-persist';
import router from '../router';

const storage = createStore({
    state: {
        isAuthenticated: false,
        token: '',
        id: null,
        roles: []
    },
    mutations: {
        setAuthenticated(state, value) {
            state.isAuthenticated = value;
        },
        setToken(state, token) {
            state.token = token;
        },
        setId(state, id) {
            state.id = id;
        },
        setRoles(state, roles) {
            state.roles = roles;
        },
        logout(state) {
            state.isAuthenticated = false;
            state.token = '';
            state.id = null;
            state.roles = [];
            router.push('/');
        }
    },
    getters: {
        isUser: state => {
            return state.roles.includes(0);
        },
        isAdmin: state => {
            return state.roles.includes(1);
        },
        isCategory: state => {
            return state.roles.includes(2);
        },
        isConfirm: state => {
            return state.roles.includes(3);
        },
        isAuth: state => {
            return state.isAuthenticated;
        },
        token: state => {
            return state.token;
        },
        idUser: state => {
            return state.id;
        }
    },
    plugins: [
        new VuexPersistence({
            storage: window.localStorage
        }).plugin
    ]
});

export default storage;
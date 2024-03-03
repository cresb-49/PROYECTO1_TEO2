import { createStore } from 'vuex';
import VuexPersistence from 'vuex-persist';
import router from '../router';

const storage = createStore({
    state: {
        isAuthenticated: false,
        token: '',
        id: null,
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
        logout(state) {
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            state.token = '';
            state.id = null;
            router.push('/');
        }
    },
    plugins: [
        new VuexPersistence({
            storage: window.localStorage
        }).plugin
    ]
});

export default storage;
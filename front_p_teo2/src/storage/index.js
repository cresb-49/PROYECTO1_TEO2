import { createStore } from 'vuex';
import VuexPersistence from 'vuex-persist';
import router from '../router';

const storage = createStore({
    state: {
        isAuthenticated: false,
        user: '',
        id: null,
        role: null
    }, 
    mutations: {
        setAuthenticated(state,value)
        {
            state.isAuthenticated = value;
        },
        setUser(state,user)
        {
            state.user=user;
        },
        setId(state,id)
        {
            state.id=id;
        },
        setRole(state,role)
        {
            state.role = role;
        },
        logout(state){
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            state.user = '';
            state.id=null;
            state.role=null;
            router.push('/');
        }
    },
    plugins:[
        new VuexPersistence({
            storage:window.localStorage
        }).plugin
    ]
});

export default storage;
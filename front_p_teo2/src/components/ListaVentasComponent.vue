<template>
    <div>
        <div v-for="d in data" v-bind:key="d">
            <div class="card mb-3" v-if="!d.venta.isHome">
                <div class="card-body">
                    <div class="row">
                        <div class="col-3">
                            <CarruselVue :articulos="d.articulos"></CarruselVue>
                        </div>
                        <div class="col-9">
                            <h5 class="card-title">Articulos</h5>
                            <template v-for="a in d.articulos" v-bind:key="a">
                                <ul>
                                    <li>{{ a.nombre }}</li>
                                </ul>
                            </template>
                            <button @click="verificarArticulo(d.venta)" class="btn btn-primary float-right">Modificar
                                Estado</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { toast } from 'vue3-toastify';
import CarruselVue from './CarruselVue.vue'
export default {
    name: 'ListaVentas',
    components: {
        CarruselVue
    },
    data() {
        return {
            data: []
        }
    },
    props: {

    },
    mounted() {
        let ver_obj = JSON.parse(localStorage.getItem('vuex'));
        let ver_auth = ver_obj.isAuthenticated;
        let ver_rol = ver_obj.role;//ADMIN USUARIO PAQUETERIA
        if (ver_auth && ver_rol === 'PAQUETERIA') {
            let vu = this;
            this.axios.get('/api/ventas/all')
                .then(response => {
                    vu.data = response.data;
                    toast.success('Articulos recuperados!!!')
                })
                .catch(response => {
                    let error = response.response.data.error
                    toast.error(error);
                });
        } else {
            this.$router.push('/');
        }
    },
    methods: {
        verificarArticulo(venta) {
            this.$router.push({ name: 'ModificarEstado', params: { id: venta._id } });
        }
    }
}
</script>
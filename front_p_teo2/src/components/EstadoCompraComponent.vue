<template>
    <div>
        <h1 class="mb-3">Seguimiento</h1>
        <div v-for="d in data" v-bind:key="d">
            <div class="card">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-4">
                            <CarruselVue :articulos="d.articulos"></CarruselVue>
                        </div>
                        <div class="col-md-8">
                            <h5 class="card-title">Articulos</h5>
                            <template v-for="a in d.articulos" v-bind:key="a">
                                <ul>
                                    <li>{{ a.nombre }}</li>
                                </ul>
                            </template>
                            <h5 class="card-title">Estado</h5>
                            <div v-if="d.venta.isCentro">
                                <p class="card-text">En el centro de Paqueteria</p>
                                <div class="progress">
                                    <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"
                                        aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width: 10%;"></div>
                                </div>
                            </div>
                            <div v-if="d.venta.isCamino">
                                <p class="card-text">En servicio de transporte</p>
                                <div class="progress">
                                    <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"
                                        aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width: 50%;"></div>
                                </div>
                            </div>
                            <div v-if="d.venta.isHome">
                                <p class="card-text">Entregado en su casa</p>
                                <div class="progress">
                                    <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"
                                        aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width: 100%;"></div>
                                </div>
                                <p class="card-text">Disfruta tu articulo :D</p>
                            </div>
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
    name: 'EstadoCompra',
    components: {
        CarruselVue
    },
    data() {
        return {
            data: [],
        }
    },
    mounted() {
        let ver_obj = JSON.parse(localStorage.getItem('vuex'));
        let ver_auth = ver_obj.isAuthenticated;
        let ver_rol = ver_obj.role;
        if (ver_auth && ver_rol === 'USUARIO') {
            let vu = this;
            const payload = {
                usuario: vu.$store.state.user
            }
            this.axios.get(`/api/ventas?usuario=${vu.$store.state.user}`, payload)
                .then(response => {
                    vu.data = response.data;
                    toast.success('Compras recuperadas');
                })
                .catch(response => {
                    toast.error(response.response.data.error);
                });
        } else {
            this.$router.push('/');
        }
    }
}
</script>

<style scoped>
.c {
    border: 1px solid #6b6969;
    border-radius: 5px;
    display: flex;
}
</style>
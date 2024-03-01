<template>
    <div>
        <div class="card">
            <div class="card-body">
                <div class="row">
                    <div class="col-md-4">
                        <CarruselVue v-if="data && data.articulos" :articulos="data.articulos"></CarruselVue>
                    </div>
                    <div class="col-md-8">
                        <h5 class="card-title mb-3">{{ venta && venta._id }}</h5>
                        <div>
                            <div class="form-check mb-3">
                                <template v-if="venta && venta.isCentro">
                                    <input class="form-check-input" type="radio" name="opcion" id="opcion1" value="1"
                                        @change="cambiarValor" checked>
                                </template>
                                <template v-else>
                                    <input class="form-check-input" type="radio" name="opcion" id="opcion1" value="1"
                                        @change="cambiarValor">
                                </template>
                                <label class="form-check-label" for="opcion1">
                                    Centro de logistica
                                </label>
                            </div>
                            <div class="form-check mb-3">
                                <template v-if="venta && venta.isCamino">
                                    <input class="form-check-input" type="radio" name="opcion" id="opcion2" value="2"
                                        @change="cambiarValor" checked>
                                </template>
                                <template v-else>
                                    <input class="form-check-input" type="radio" name="opcion" id="opcion2" value="2"
                                        @change="cambiarValor">
                                </template>
                                <label class="form-check-label" for="opcion2">
                                    Transporte
                                </label>
                            </div>
                            <div class="form-check mb-3">
                                <template v-if="venta && venta.isHome">
                                    <input class="form-check-input" type="radio" name="opcion" id="opcion3" value="3"
                                        @change="cambiarValor" checked>
                                </template>
                                <template v-else>
                                    <input class="form-check-input" type="radio" name="opcion" id="opcion3" value="3"
                                        @change="cambiarValor">
                                </template>
                                <label class="form-check-label" for="opcion3">
                                    Entregado
                                </label>
                            </div>
                            <button @click="modificarEstado" class="btn btn-primary">Modificar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import { toast } from 'vue3-toastify';
// eslint-disable-next-line no-unused-vars
import CarruselVue from './CarruselVue.vue'

export default {
    name: 'UbicacionPaquete',
    components: {
        // eslint-disable-next-line vue/no-unused-components
        CarruselVue
    },
    data() {
        return {
            data: null,
            articulos: [],
            venta: null,
            Ce: false,
            Ca: false,
            Ho: false
        }
    },
    mounted() {
        let ver_obj = JSON.parse(localStorage.getItem('vuex'));
        let ver_auth = ver_obj.isAuthenticated;
        let ver_rol = ver_obj.role;
        if (ver_auth && ver_rol === 'PAQUETERIA') {
            let vue = this;
            let idventa = this.$route.params.id;
            this.axios(`/api/venta?id=${idventa}`)
                .then(response => {
                    vue.data = response.data;
                    vue.articulos = response.data.articulos;
                    vue.venta = response.data.venta;
                    vue.Ce = vue.venta.isCentro;
                    vue.Ca = vue.venta.isCamino;
                    vue.Ho = vue.venta.isHome;
                })
                .catch(response => {
                    console.log(response);
                    toast.error(response.response.data.error);
                })
        } else {
            this.$router.push('/');
        }


    },
    methods: {
        modificarEstado() {
            let payload = {
                id: this.venta._id,
                estados: {
                    isCentro: this.Ce,
                    isCamino: this.Ca,
                    isHome: this.Ho
                }
            }
            this.axios.put('/api/venta', payload)
                .then(response => {
                    toast.success('Estado modificado correctamente');
                    console.log(response.data);
                })
                .catch(response => {
                    toast.error('Error de modificacion!!!' + response.response.data);
                    console.log(response.response.data);
                })
        },
        cambiarValor(e) {
            let value = e.target.value;
            this.Ce = (value === '1' ? true : false);
            this.Ca = (value === '2' ? true : false);
            this.Ho = (value === '3' ? true : false);
        }
    }
}

</script>
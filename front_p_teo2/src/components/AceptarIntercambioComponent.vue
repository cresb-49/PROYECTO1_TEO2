<template>
    <div class="mt-4">
        <h3>Aceptar Oferta de Intercambio</h3>
        <div v-for="d in data" v-bind:key="d">
            <h5><small>{{ d }}</small></h5>
            <div class="card mb-3">
                <div class="card-body">
                    <h5><small>{{ d.id }}</small></h5>
                    <div class="row">
                        <div class="col-5">
                            <div class="row">
                                <div class="col-3">
                                    <img :src="'http://localhost:3000/api/image?articulo=' + d.id_articulo_venta"
                                        class="img-fluid" alt="Imagen del producto">
                                </div>
                                <div class="col-9">
                                    <h5 class="card-title"><strong>Nombre:</strong> {{ d.articulo_venta.nombre }}</h5>
                                    <p class="card-text"><strong>Cantidad:</strong> <small> {{ d.cantidad_articulo_venta
                                            }}</small></p>
                                    <p class="card-text"><strong>KORNS:</strong> <small> {{ d.valor_venta }}</small></p>
                                    <p class="card-text"><strong>Fecha:</strong> <small> {{ formatDate(d.updated_at)
                                            }}</small></p>
                                </div>
                            </div>
                        </div>
                        <div class="col-1">
                            <h5><small>Por</small></h5>
                        </div>
                        <div class="col-5">
                            <div class="row">
                                <div class="col-3">
                                    <img :src="'http://localhost:3000/api/image?articulo=' + d.id_articulo_cambio"
                                        class="img-fluid" alt="Imagen del producto">
                                </div>
                                <div class="col-9">
                                    <h5 class="card-title"><strong>Nombre:</strong> {{ d.articulo_cambio.nombre }}</h5>
                                    <p class="card-text"><strong>Cantidad:</strong> <small> {{
            d.cantidad_articulo_cambio
        }}</small></p>
                                    <p class="card-text"><strong>Valor Unitario:</strong> <small> {{
                d.articulo_cambio.valor }}</small></p>
                                    <p class="card-text"><strong>Creditos Retirables:</strong> <small> {{ 0 }}</small>
                                    </p>
                                    <p class="card-text"><strong>Creditos No Retirables:</strong> <small> {{ 0 }}</small>
                                    </p>
                                    <p class="card-text"><strong>SUMA TOTAL KORNS:</strong> <small> {{
                                            d.cantidad_articulo_cambio * d.articulo_cambio.valor }}</small></p>
                                </div>
                            </div>
                        </div>
                        <button @click="verificarArticulo(d.venta)" class="btn btn-primary float-right mt-4">Modificar
                            Estado</button>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { toast } from 'vue3-toastify';
import { mapGetters } from 'vuex';

export default {
    name: 'AceptarIntercambioComponent',
    components: {
        ...mapGetters(['token'])
    },
    data() {
        return {
            data: [],
            totalPages: 0,
            currentPage: 0,
            previousPage: null,
            nextPage: null,
            pagesToShow: []
        }
    },
    mounted() {
        this.getVentasValidar();
    },
    methods: {
        getVentasValidar() {
            let state = this.$store.state;
            this.axios.get('ventas/por-validar/usuario',
                {
                    headers: {
                        Authorization: `Bearer ${state.token}`
                    }
                })
                .then(response => {
                    console.log(response.data.data);
                    const { data, totalPages, currentPage, previousPage, nextPage, pagesToShow } = response.data.data;
                    this.data = data;
                    this.totalPages = totalPages;
                    this.currentPage = currentPage;
                    this.previousPage = previousPage;
                    this.nextPage = nextPage;
                    this.pagesToShow = pagesToShow;
                })
                .catch(error => {
                    toast.error(error.response.data.error);
                    let errores = error.response.data.errores;
                    for (let index = 0; index < errores.length; index++) {
                        toast.error(errores[index]);
                    }
                });
        },
        formatDate(date) {
            const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
            return new Date(date).toLocaleString('es-ES', options);
        },
    }
}
</script>

<style scoped>
.img-fluid {
    max-height: 250px;
    object-fit: scale-down;
}
</style>
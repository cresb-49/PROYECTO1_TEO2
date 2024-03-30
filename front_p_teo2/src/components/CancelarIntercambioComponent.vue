<template>
    <div class="mt-4">
        <h3>Cancelar Intercambio</h3>
        <div v-for="d in data" v-bind:key="d">
            <div class="card mb-3">
                <div class="card-body">
                    <h5><small>Identificacion de Compra #{{ d.id }}</small></h5>
                    <div class="mt-4">
                        <div class="row">
                            <div class="col-5">
                                <div class="row">
                                    <div class="col-3">
                                        <img :src="`${URL_API}/image?articulo=` + d.id_articulo_cambio"
                                            class="img-fluid" alt="Producto">
                                    </div>
                                    <div class="col-9">
                                        <h5 class="card-title">
                                            <strong>Nombre:</strong> {{ d.articulo_cambio.nombre }}
                                        </h5>
                                        <p class="card-text">
                                            <strong>Cantidad:</strong> <small> {{ d.cantidad_articulo_cambio }}</small>
                                        </p>
                                        <p class="card-text">
                                            <strong>Valor Unitario: </strong>
                                            <small>{{ d.articulo_cambio.valor }}</small>
                                        </p>
                                        <p class="card-text">
                                            <strong>Creditos Retirables: </strong>
                                            <small> {{ d.creditos_retirables_usados }}</small>
                                        </p>
                                        <p class="card-text">
                                            <strong>Creditos No Retirables: </strong>
                                            <small> {{ d.creditos_no_retirables_usados }}</small>
                                        </p>
                                        <p class="card-text">
                                            <strong>SUMA TOTAL KORNS:</strong> <small> {{ sumatoriaKorns(d) }}</small>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-1">
                                <h5><strong>Por</strong></h5>
                            </div>
                            <div class="col-5">
                                <div class="row">
                                    <div class="col-3">
                                        <img :src="`${URL_API}/image?articulo=` + d.id_articulo_venta"
                                            class="img-fluid" alt="Producto">
                                    </div>
                                    <div class="col-9">
                                        <h5 class="card-title"><strong>Nombre:</strong> {{ d.articulo_venta.nombre }}
                                        </h5>
                                        <p class="card-text"><strong>Cantidad:</strong> <small> {{
            d.cantidad_articulo_venta
        }}</small></p>
                                        <p class="card-text"><strong>KORNS:</strong> <small> {{ d.valor_venta }}</small>
                                        </p>
                                        <p class="card-text"><strong>Fecha:</strong> <small> {{ formatDate(d.updated_at)
                                                }}</small></p>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-auto">
                                    <button @click="doDialog(() => this.cancelarCambtio(d))"
                                        class="btn btn-danger float-right mt-4">Cancelar
                                        Intercambio</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="d-flex justify-content-center align-items-center mt-4">
            <nav aria-label="Page navigation example">
                <ul class="pagination">
                    <li :class="['page-item', { 'disabled': currentPage === 1 }]">
                        <button class="page-link" @click="getVentasValidar(previousPage)"
                            :disabled="currentPage === 1">Anterior</button>
                    </li>
                    <li :class="['page-item', { 'active': pageNumber === currentPage }]"
                        v-for="(pageNumber, index) in pagesToShow" :key="index">
                        <button class="page-link" @click="getVentasValidar(pageNumber)">{{ pageNumber
                            }}</button>
                    </li>
                    <li :class="['page-item', { 'disabled': currentPage === totalPages || nextPage === null }]">
                        <button class="page-link" @click="getVentasValidar(nextPage)"
                            :disabled="currentPage === totalPages || nextPage === null">Siguiente</button>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
    <Dialog :show="dialog.show" :cancel="closeDialog" :tittle="dialog.title" :description="dialog.description"
        :confirm="dialog.action"></Dialog>
</template>

<script>
import { toast } from 'vue3-toastify';
import { mapGetters } from 'vuex';
import Dialog from '@/components/Dialog.vue'
import { URL_API } from '@/main';

export default {
    name: 'CancelarIntercambioComponent',
    computed: {
        ...mapGetters(['token'])
    },
    components: {
        Dialog
    },
    data() {
        return {
            data: [],
            totalPages: 0,
            currentPage: 0,
            previousPage: null,
            nextPage: null,
            pagesToShow: [],
            dialog: {
                show: false,
                title: "Cancelar Interacambio",
                description: "¿Está seguro de cancelar el intercambio?",
                action: null
            },
            URL_API
        }
    },
    mounted() {
        this.getVentasValidar();
    },
    methods: {
        getVentasValidar(page = 1) {
            let state = this.$store.state;
            this.axios.get('ventas/por-validar/usuario/comprador',
                {
                    headers: {
                        Authorization: `Bearer ${state.token}`
                    },
                    params: {
                        page: page
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
                    for (const element of errores) {
                        toast.error(element);
                    }
                });
        },
        formatDate(date) {
            const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
            return new Date(date).toLocaleString('es-ES', options);
        },
        sumatoriaKorns(d) {
            return parseFloat(d.cantidad_articulo_cambio) * parseFloat(d.articulo_cambio.valor) + parseFloat(d.creditos_retirables_usados) + parseFloat(d.creditos_no_retirables_usados);
        },
        cancelarCambtio(compra) {
            let state = this.$store.state;
            this.axios.put(`ventas/rechazar-intercambio/${compra.id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${state.token}`
                    }
                })
                .then(response => {
                    toast.success(response.data.mensaje);
                    this.getVentasValidar();
                })
                .catch(error => {
                    toast.error(error.response.data.error);
                    let errores = error.response.data.errores;
                    for (const element of errores) {
                        toast.error(element);
                    }
                });
        },
        doDialog(action) {
            this.dialog.show = true;
            this.dialog.action = action;
        },
        closeDialog() {
            this.dialog.show = false;
            this.dialog.action = null;
        }
    }
}
</script>

<style scoped>
.img-fluid {
    max-height: 250px;
    object-fit: scale-down;
}
</style>
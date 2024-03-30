<template>
    <div class="mt-4">
        <h2 class="mb-4">Mis Ventas</h2>
        <div v-for="compra in compras" v-bind:key="compra">
            <div class="card mb-3">
                <div class="card-body">
                    <div class="row">
                        <div class="col-3">
                            <img :src="`${URL_API}/image?articulo=` + compra.id_articulo_venta" class="img-fluid"
                                alt="Producto">
                        </div>
                        <div class="col-9">
                            <h5 class="card-title"><strong>Nombre:</strong> {{ compra.articulo_venta.nombre }}</h5>
                            <p class="card-text"><strong>Cantidad:</strong> <small> {{ compra.cantidad_articulo_venta
                                    }}</small></p>
                            <p class="card-text"><strong>KORNS ganados:</strong> <small> {{ compra.valor_venta
                                    }}</small></p>
                            <p class="card-text"><strong>Fecha:</strong> <small> {{ formatDate(compra.validate_at)
                                    }}</small></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="d-flex justify-content-center align-items-center mt-4">
            <nav aria-label="Page navigation example">
                <ul class="pagination">
                    <li :class="['page-item', { 'disabled': currentPage === 1 }]">
                        <button class="page-link" @click="getVentas(previousPage)"
                            :disabled="currentPage === 1">Anterior</button>
                    </li>
                    <li :class="['page-item', { 'active': pageNumber === currentPage }]"
                        v-for="(pageNumber, index) in pagesToShow" :key="index">
                        <button class="page-link" @click="getVentas(pageNumber)">{{ pageNumber }}</button>
                    </li>
                    <li :class="['page-item', { 'disabled': currentPage === totalPages }]">
                        <button class="page-link" @click="getVentas(nextPage)"
                            :disabled="currentPage === totalPages">Siguiente</button>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</template>

<script>
import { toast } from 'vue3-toastify';
import { mapGetters } from 'vuex';
import { URL_API } from '@/main';

export default {
    name: 'ListaVentasComponent',
    computed: {
        ...mapGetters(['isUser', 'isAdmin', 'isConfirm', 'isAuth', 'token']),
    },
    components: {
    },
    data() {
        return {
            compras: [],
            totalPages: 1,
            currentPage: 1,
            previousPage: 1,
            nextPage: 1,
            pagesToShow: [],
            URL_API
        }
    },
    props: {

    },
    mounted() {
        this.getVentas();
    },
    methods: {
        getVentas(page = 1) {
            this.axios.get(`/ventas/usuario?page=${page}`, {
                headers: {
                    Authorization: `Bearer ${this.token}` // Incluye el token en el encabezado Authorization
                },
            })
                .then(response => {
                    this.compras = response.data.data.data;
                    this.totalPages = response.data.data.totalPages;
                    this.currentPage = response.data.data.currentPage;
                    this.previousPage = response.data.data.previousPage;
                    this.nextPage = response.data.data.nextPage;
                    this.pagesToShow = response.data.data.pagesToShow;
                }).catch(error => {
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
    }
}
</script>
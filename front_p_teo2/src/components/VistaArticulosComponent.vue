<template>
    <div class="mt-4">
        <h2>¿Qué Busco Hoy.gt?</h2>
        <div class="container mt-4">
            <form @submit.prevent="buscarProductos()">
                <div class="input-group">
                    <input type="text" class="form-control rounded" placeholder="Search" aria-label="Search"
                        aria-describedby="search-addon" v-model="nombre" />
                    <button type="submit" class="btn btn-outline-primary">search</button>
                </div>
            </form>
        </div>
        <div id="contenedorProductos" style="margin-top: 20px;">
            <div class="row row-cols-1 row-cols-md-3 g-4">
                <template v-for="publicacion in publicaciones" :key="publicacion.id">
                    <CardArticulo :articulo="{
                            id: publicacion.id_articulo,
                            usuario: publicacion.id_usuario,
                            nombre: publicacion.articulo.nombre,
                            valor: publicacion.articulo.valor,
                            valor_entrada: publicacion.articulo.valor_entrada,
                            recompenza: publicacion.articulo.recompenza,
                            imagen: publicacion.articulo.id,
                            descripcion: publicacion.articulo.descripcion,
                            categoria: publicacion.articulo.category.nombre
                        }" :publicacion="{ id: publicacion.id }" :comprar="true" :isPublicacion="true">
                    </CardArticulo>
                </template>
            </div>
        </div>
        <div class="d-flex justify-content-center align-items-center mt-4">
            <nav aria-label="Page navigation example">
                <ul class="pagination">
                    <li :class="['page-item', { 'disabled': currentPage === 1 }]">
                        <button class="page-link" @click="navegacion(previousPage)"
                            :disabled="currentPage === 1">Anterior</button>
                    </li>
                    <li :class="['page-item', { 'active': pageNumber === currentPage }]"
                        v-for="(pageNumber, index) in pagesToShow" :key="index">
                        <button class="page-link" @click="navegacion(pageNumber)">{{ pageNumber }}</button>
                    </li>
                    <li :class="['page-item', { 'disabled': currentPage === totalPages }]">
                        <button class="page-link" @click="navegacion(nextPage)"
                            :disabled="currentPage === totalPages">Siguiente</button>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</template>

<script>
import CardArticulo from "./CardArticuloComponent.vue";
import { toast } from 'vue3-toastify'
import { mapGetters } from 'vuex';
import 'vue3-toastify/dist/index.css';
export default {
    name: "VistaProductos",
    computed: {
        ...mapGetters(['token']),
    },
    data() {
        return {
            publicaciones: [],
            nombre: '',
            totalPages: 1,
            currentPage: 1,
            previousPage: 1,
            nextPage: 1,
            pagesToShow: []
        }
    },
    components: {
        CardArticulo
    },
    methods: {
        buscarArticulos(page = 1) {
            this.axios.get(`publicaciones?page=${page}`, {
                headers: {
                    Authorization: `Bearer ${this.token}` // Incluye el token en el encabezado Authorization
                },
            }).then(response => {
                this.publicaciones = response.data.data.data;
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
        buscarProductos(page = 1) {
            this.axios.get(`publicaciones?nombre=${this.nombre}&page=${page}`, {
                headers: {
                    Authorization: `Bearer ${this.token}` // Incluye el token en el encabezado Authorization
                },
            }).then(response => {
                this.publicaciones = response.data.data.data;
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
        navegacion(page = 1) {
            if (this.nombre === undefined || this.nombre === null || this.nombre === "" || this.nombre.trim() === "" || this.nombre.length === 0) {
                this.buscarArticulos(page);
            } else {
                this.buscarProductos(page);
            }
            console.log(this.pagesToShow);
        }
    },
    mounted() {
        this.buscarArticulos();
    }
}
</script>
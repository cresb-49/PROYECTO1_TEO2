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
                    <CardArticulo
                        :articulo="{ id: publicacion.id_articulo, usuario: publicacion.id_usuario, nombre: publicacion.articulo.nombre, valor: publicacion.articulo.valor, imagen: publicacion.articulo.id, descripcion: publicacion.articulo.descripcion, categoria: publicacion.articulo.category.nombre }"
                        :publicacion="{ id: publicacion.id }" :comprar="true" :isPublicacion="true">
                    </CardArticulo>
                </template>
            </div>
        </div>
        <div class="d-flex justify-content-center align-items-center">
            <!-- Botones de paginación -->
            <div class="mt-3">
                <!-- Botón "Anterior" -->
                <button class="btn btn-secondary" @click="navegacion(previousPage)" :disabled="currentPage === 1">
                    Anterior
                </button>

                <!-- Números de página -->
                <button v-for="(pageNumber, index) in pagesToShow" :key="index"
                    :class="['btn', 'btn-secondary', { 'btn-info': pageNumber === currentPage }]"
                    @click="navegacion(pageNumber)">
                    {{ pageNumber }}
                </button>

                <!-- Botón "Siguiente" -->
                <button class="btn btn-secondary" @click="navegacion(nextPage)" :disabled="currentPage === totalPages">
                    Siguiente
                </button>
            </div>
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
                for (let index = 0; index < errores.length; index++) {
                    toast.error(errores[index]);
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
                for (let index = 0; index < errores.length; index++) {
                    toast.error(errores[index]);
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
<template>
    <div class="mt-4">
        <h2>¿Qué Busco Hoy.gt?</h2>
        <div class="container mt-4">
            <form @submit.prevent="buscarProductos">
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
            nombre: ''
        }
    },
    components: {
        CardArticulo
    },
    methods: {
        buscarArticulos() {
            this.axios.get('publicaciones', {
                headers: {
                    Authorization: `Bearer ${this.token}` // Incluye el token en el encabezado Authorization
                },
            }).then(response => {
                console.log(response.data);
                this.publicaciones = response.data.data;
            }).catch(error => {
                toast.error(error.response.data.error);
                let errores = error.response.data.errores;
                for (let index = 0; index < errores.length; index++) {
                    toast.error(errores[index]);
                }
            });
        },
        buscarProductos() {
            this.axios.get(`publicaciones?nombre=${this.nombre}`, {
                headers: {
                    Authorization: `Bearer ${this.token}` // Incluye el token en el encabezado Authorization
                },
            }).then(response => {
                console.log(response.data);
                this.publicaciones = response.data.data;
            }).catch(error => {
                toast.error(error.response.data.error);
                let errores = error.response.data.errores;
                for (let index = 0; index < errores.length; index++) {
                    toast.error(errores[index]);
                }
            });
        }
    },
    mounted() {
        this.buscarArticulos();
    }
}
</script>
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
                <template v-for="articulo in articulos" :key="articulo._1d">
                    <template v-if="!articulo.vendido && articulo.aceptado">
                        <CardArticulo
                            :articulo="{ codigo: articulo._id, usuario: articulo.usuario, nombre: articulo.nombre, precio: articulo.precio, imagen: articulo.imagen, descripcion: articulo.descripcion, categoria: articulo.categoria }"
                            :comprar="true">
                        </CardArticulo>
                    </template>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import CardArticulo from "./CardArticuloComponent.vue";
export default {
    name: "VistaProductos",
    data() {
        return {
            articulos: [],
            nombre: ''
        }
    },
    components: {
        CardArticulo
    },
    methods: {
        buscarProductos() {
            let vu = this;
            let payload = {
                nombre: this.nombre
            }
            this.axios.get(`/api/articulos?nombre=${payload.nombre}`, payload)
                .then(response => {
                    const res = response.data
                    vu.articulos = res;
                })
                .catch(response => {
                    console.log(response.response.data);
                })
        }
    },
    mounted() {
        this.axios.get('/api/articulos')
            .then(response => {
                this.articulos = response.data;
            })
            .catch(response => {
                console.log(response);
            })
    }
}
</script>
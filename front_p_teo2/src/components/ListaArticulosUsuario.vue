<template>
    <div class="mt-4">
        <h2>Mis Articulos</h2>
        <div id="contenedorProductos" style="margin-top: 20px;">
            <div class="container">
                <div class="row">
                    <template v-for="articulo in articulos" :key="articulo">
                        <div class="col-md-3">
                            <div class="card mb-3">
                                <img :src="'http://localhost:3000/api/image?articulo=' + articulo.id" class="card-img-top" alt="Imagen de {{articulo.nombre}}">
                                <div class="card-body">
                                    <h5 class="card-title">{{ articulo.nombre }}</h5>
                                    <p class="card-text">{{ articulo.descripcion }}</p>
                                    <p class="card-text"><strong>Precio:</strong> KORNS {{ articulo.valor }}</p>
                                    <p class="card-text"><strong>Cantidad:</strong> {{ articulo.cantidad }}</p>
                                    <button class="btn btn-primary" @click="editarArticulo(articulo)">
                                        Editar</button> 
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
//import { toast } from 'vue3-toastify';
import { toast } from 'vue3-toastify';
// import CardArticulo from './CardArticuloComponent.vue';

export default {
    name: 'VerMisProductos',
    components: {
        // CardArticulo
    },
    data() {
        return {
            articulos: []
        }
    },
    mounted() {
        this.obtenerArticulos();
    },
    methods: {
        obtenerArticulos() {
            let state = this.$store.state;
            this.axios.get(`articulos/usuario`, {
                headers: {
                    Authorization: `Bearer ${state.token}` // Incluye el token en el encabezado Authorization
                },
            }).then(response => {
                this.articulos = response.data.data;
                console.log(this.articulos);
            }).catch(error => {
                toast.error(error.response.data.error);
                let errores = error.response.data.errores;
                for (let index = 0; index < errores.length; index++) {
                    toast.error(errores[index]);
                }
            });
        },
        editarArticulo(articulo) {
            this.$router.push({ name: 'ModificarArticulo', params: { id: articulo.id } });
        }
    },
}
</script>
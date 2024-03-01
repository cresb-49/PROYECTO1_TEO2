<template>
    <div>
        <h2 style="text-align: center;">Articulos de {{ this.$store.state.user }}</h2>
        <div id="contenedorProductos" style="margin-top: 20px;">
            <h2>Articulos sin vender</h2>
            <div class="row row-cols-1 row-cols-md-3 g-4 mb-3">
                <template v-for="articulo in articulos" :key="articulo">
                    <template v-if="!articulo.vendido">
                        <CardArticulo
                            :articulo="{ codigo: articulo._id, usuario: articulo.usuario, nombre: articulo.nombre, precio: articulo.precio, imagen: articulo.imagen, descripcion: articulo.descripcion, categoria: articulo.categoria }"
                            :comprar="true">
                        </CardArticulo>
                    </template>
                </template>
            </div>
            <h2>Articulos vendidos</h2>
            <div class="row row-cols-1 row-cols-md-3 g-4">
                <template v-for="articulo in articulos" :key="articulo">
                    <template v-if="articulo.vendido">
                        <CardArticulo
                            :articulo="{ codigo: articulo._id, usuario: articulo.usuario, nombre: articulo.nombre, precio: articulo.precio, imagen: articulo.imagen, descripcion: articulo.descripcion, categoria: articulo.categoria }"
                            :comprar="false">
                        </CardArticulo>
                    </template>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
import { toast } from 'vue3-toastify';
import CardArticulo from './CardArticuloComponent.vue';

export default {
    name: 'VerMisProductos',
    components: {
        CardArticulo
    },
    data() {
        return {
            articulos: []
        }
    },
    mounted() {
        let ver_obj = JSON.parse(localStorage.getItem('vuex'));
        let ver_auth = ver_obj.isAuthenticated;
        let ver_rol = ver_obj.role;//ADMIN USUARIO PAQUETERIA
        if (ver_auth && ver_rol === 'USUARIO') {
            let vu = this;
            let usuario = this.$store.state.user;
            this.axios.get(`/api/articulos/usuario?usuario=${usuario}`)
                .then(response => {
                    vu.articulos = response.data;
                    toast.success('Articulos recuperados!!!');
                })
                .catch(response => {
                    toast.error(response.response.data.error)
                });
        } else {
            this.$router.push('/');
        }
    }
}
</script>
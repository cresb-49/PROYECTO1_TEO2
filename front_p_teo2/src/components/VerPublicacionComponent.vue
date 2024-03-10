<template>
    <div>
        <div align="center">
            <img :src="'http://localhost:3000/api/image?articulo=' + articulo.id" alt="Imagen del Articulo"
                style="max-width: 100%;">
        </div>
        <h4 style="margin-top: 20px;">{{ articulo.nombre }}</h4>
        <p>{{ articulo.descripcion }}</p>
        <h5>Categoria</h5>
        <ul class="list-group list-group-flush" v-for="cate in articulo.categoria" v-bind:key="cate">
            <li style="margin-left: 30px;">{{ cate }}</li>
        </ul>
        <h5 style="margin-top: 20px;"> Valor: Q. {{ articulo.precio }}</h5>
        <div class="row justify-content-between" style="margin-top: 20px;">
            <button v-if="$store.state.isAuthenticated && articulo.usuario !== $store.state.id" @click="agregarCarrito"
                class="btn btn-outline-success col" style="margin: 5px;">Agregar al
                Carrito</button>
            <button v-if="$store.state.isAuthenticated && articulo.usuario === $store.state.id"
                @click="modificarProducto" class="btn btn-outline-warning col" style="margin: 5px;">Modificar Producto
            </button>
        </div>
    </div>
    <div class="mt-4">
        <h5>Comentarios</h5>

        <!-- Espacio para escribir comentarios -->
        <form @submit.prevent="submitComment">
            <div class="mb-3">
                <label for="commentInput" class="form-label">Escribe tu comentario:</label>
                <textarea v-model="comment" class="form-control" id="commentInput" rows="3"></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Enviar</button>
        </form>

        <!-- Espacio para mostrar comentarios -->
        <div class="mt-4">
            <h6>Comentarios anteriores:</h6>
            <ul class="list-group">
                <!-- Aquí se agregarán los comentarios dinámicamente -->
                <li class="list-group-item mt-2 mb-2" v-for="(comment, index) in comments" :key="index">{{ comment }}</li>
            </ul>
        </div>
    </div>
</template>

<script>
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
    name: 'VerPublicacion',
    data() {
        return {
            articulo: {
                id: 0,
                usuario: -1,
                nombre: 'Producto Modelo',
                precio: 100.99,
                descripcion: 'This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.',
                categoria: ['otros']
            },
            comment: '',
            comments: [
                'Este es un comentario de ejemplo.',
                'Otro comentario aquí.',
                '¡Estoy probando Vue.js!',
                '¡Los comentarios son geniales!'
            ]
        }
    },
    mounted() {
        this.getPublicacion();
    },
    methods: {
        getPublicacion() {
            let state = this.$store.state;
            this.axios.get(`publicacion/${this.$route.params.id}`, {
                headers: {
                    Authorization: `Bearer ${state.token}`
                }
            }).then(response => {
                const publicacion = response.data.data;
                this.articulo = {
                    id: publicacion.articulo.id,
                    usuario: publicacion.articulo.id_usuario,
                    nombre: publicacion.articulo.nombre,
                    precio: publicacion.articulo.valor,
                    descripcion: publicacion.articulo.descripcion,
                    categoria: [publicacion.articulo.category.nombre]
                }
                console.log(this.articulo.usuario);
                console.log(this.$store.state.id);
            }).catch(error => {
                toast.error(error.response.data.error);
                let errores = error.response.data.errores;
                for (let index = 0; index < errores.length; index++) {
                    toast.error(errores[index]);
                }
            });
        },
        submitComment() {
            // Manejo del envío del comentario
            // Aquí puedes realizar acciones como enviar el comentario a un servidor, agregarlo a una lista de comentarios, etc.
            // Por ejemplo, agregar el comentario a la lista de comentarios:
            this.comments.push(this.comment);

            // Limpiar el campo de comentario después de enviarlo
            this.comment = '';
        },
        modificarProducto() {
            this.$router.push({ name: 'ModificarArticulo', params: { id: this.articulo._id } });
        }
    }
}
</script>

<style scoped>
img {
    height: 500px;
    align-self: center;
}
</style>
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
        <div class="container mt-4">
            <div class="row">
                <div class="col-md-6 d-flex justify-content-center align-items-center" @click="changeStateLike(true)">
                    <button id="likeButton"
                        :class="['btn', { 'btn-outline-primary': likes.liked === true, 'btn-primary': (likes.liked === null || likes.liked === false) }]">
                        Me gusta
                        <span id="likeCount" class="count ml-2">({{ likes.count_like }})</span>
                    </button>
                </div>
                <div class="col-md-6 d-flex justify-content-center align-items-center" @click="changeStateLike(false)">
                    <button id="dislikeButton"
                        :class="['btn', { 'btn-outline-danger': likes.liked === false, 'btn-danger': (likes.liked === null || likes.liked === true) }]">
                        No me gusta
                        <span id="dislikeCount" class="count ml-2">({{ likes.count_dislike }})</span>
                    </button>
                </div>
            </div>
        </div>
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
                <!-- Iterar sobre los comentarios -->
                <li class="list-group-item mt-2 mb-2" v-for="(comment, index) in comments" :key="index">
                    <!-- Contenido del comentario -->
                    <p>{{ comment.texto }}</p>
                    <!-- Mostrar el nombre del usuario y la fecha en letras pequeñas -->
                    <small class="style-small">
                        <p>
                            <strong>{{ comment.usuario.nombres + ' ' + comment.usuario.apellidos }}</strong>
                            <!-- Nombre del usuario -->
                            <span class="text-muted"> - {{ formatDate(comment.created_at) }}</span>
                            <!-- Fecha en letras pequeñas -->
                        </p>
                    </small>
                </li>
            </ul>
            <div class="d-flex justify-content-center align-items-center">
                <!-- Botones de paginación -->
                <div class="mt-3">
                    <!-- Botón "Anterior" -->
                    <button class="btn btn-secondary" @click="getComentarios(previousPage)"
                        :disabled="currentPage === 1">
                        Anterior
                    </button>

                    <!-- Números de página -->
                    <button v-for="(pageNumber, index) in totalPages" :key="index"
                        :class="['btn', 'btn-secondary', { 'btn-info': pageNumber === currentPage }]"
                        @click="getComentarios(pageNumber)">
                        {{ pageNumber }}
                    </button>

                    <!-- Botón "Siguiente" -->
                    <button class="btn btn-secondary" @click="getComentarios(nextPage)"
                        :disabled="currentPage === totalPages">
                        Siguiente
                    </button>
                </div>
            </div>

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
            likes: {
                liked: true,
                count_like: 0,
                count_dislike: 0
            },
            comment: '',
            comments: [],
            totalPages: 1,
            currentPage: 1,
            previousPage: 1,
            nextPage: 1
        }
    },
    mounted() {
        this.getPublicacion();
        this.getComentarios();
        this.getLikeInfo();
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
            }).catch(error => {
                toast.error(error.response.data.error);
                let errores = error.response.data.errores;
                for (let index = 0; index < errores.length; index++) {
                    toast.error(errores[index]);
                }
            });
        },
        submitComment() {
            let state = this.$store.state;
            let payload = {
                id_publicacion: this.$route.params.id,
                texto: this.comment
            }
            this.axios.post(`/comentario/publicacion`, payload, {
                headers: {
                    Authorization: `Bearer ${state.token}`
                }
            }).then(() => {
                this.getComentarios(1);
            }).catch(error => {
                toast.error(error.response.data.error);
                let errores = error.response.data.errores;
                for (let index = 0; index < errores.length; index++) {
                    toast.error(errores[index]);
                }
            });
        },
        getComentarios(page = 1) {
            let state = this.$store.state;
            this.axios.get(`comentarios/publicacion/${this.$route.params.id}?page=${page}`, {
                headers: {
                    Authorization: `Bearer ${state.token}`
                }
            }).then(response => {
                const { data, totalPages, previousPage, nextPage, currentPage } = response.data.data;
                this.comments = data;
                this.totalPages = totalPages;
                this.previousPage = previousPage;
                this.nextPage = nextPage;
                this.currentPage = currentPage;

            }).catch(error => {
                toast.error(error.response.data.error);
                let errores = error.response.data.errores;
                for (let index = 0; index < errores.length; index++) {
                    toast.error(errores[index]);
                }
            });
        },
        getLikeInfo() {
            let state = this.$store.state;
            this.axios.get(`likes/publicacion/${this.$route.params.id}`, {
                headers: {
                    Authorization: `Bearer ${state.token}`
                }
            }).then(response => {
                console.log(response.data.data);
                const { likes, dislikes } = response.data.data;
                this.likes.count_like = likes;
                this.likes.count_dislike = dislikes;
            }).catch(error => {
                toast.error(error.response.data.error);
                let errores = error.response.data.errores;
                for (let index = 0; index < errores.length; index++) {
                    toast.error(errores[index]);
                }
            });
            this.axios.get(`/like/usuario/publicacion/${this.$route.params.id}`, {
                headers: {
                    Authorization: `Bearer ${state.token}`
                }
            }).then(response => {
                this.likes.liked = response.data.data;
            }).catch(error => {
                toast.error(error.response.data.error);
                let errores = error.response.data.errores;
                for (let index = 0; index < errores.length; index++) {
                    toast.error(errores[index]);
                }
            });
        },
        changeStateLike(like_status) {
            let state = this.$store.state;
            if (this.likes.liked === null) {
                console.log('creando like');
                const payload = {
                    state: like_status,
                    id_publicacion: this.$route.params.id
                }
                this.axios.post(`like/publicacion`, payload, {
                    headers: {
                        Authorization: `Bearer ${state.token}`
                    }
                }).then(() => {
                    this.getLikeInfo();
                }).catch(error => {
                    toast.error(error.response.data.error);
                    let errores = error.response.data.errores;
                    for (let index = 0; index < errores.length; index++) {
                        toast.error(errores[index]);
                    }
                });
            } else if (this.likes.liked === like_status) {
                console.log('eliminando like')
                this.axios.delete(`like/publicacion/${this.$route.params.id}`, {
                    headers: {
                        Authorization: `Bearer ${state.token}`
                    }
                }).then(() => {
                    this.getLikeInfo();
                }).catch(error => {
                    toast.error(error.response.data.error);
                    let errores = error.response.data.errores;
                    for (let index = 0; index < errores.length; index++) {
                        toast.error(errores[index]);
                    }
                });
            } else {
                console.log('actualizando like')
                const payload = {
                    state: like_status,
                    id_publicacion: this.$route.params.id
                }
                this.axios.put('like/publicacion', payload, {
                    headers: {
                        Authorization: `Bearer ${state.token}`
                    }
                }).then(() => {
                    this.getLikeInfo();
                }).catch(error => {
                    toast.error(error.response.data.error);
                    let errores = error.response.data.errores;
                    for (let index = 0; index < errores.length; index++) {
                        toast.error(errores[index]);
                    }
                });
            }

        },
        formatDate(date) {
            const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
            return new Date(date).toLocaleString('es-ES', options);
        },
        modificarProducto() {
            this.$router.push({ name: 'ModificarArticulo', params: { id: this.articulo.id } });
        }
    }
}
</script>

<style scoped>
img {
    height: 500px;
    align-self: center;
}

.style-small {
    font-size: 15px;
    color: grey;
    /* o cualquier otro color gris que desees */
}
</style>
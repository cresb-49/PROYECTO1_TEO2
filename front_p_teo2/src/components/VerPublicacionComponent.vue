<template>
    <div class="mt-4">
        <div align="center">
            <img :src="`${URL_API}/image?articulo=` + articulo.id" alt="Articulo" style="max-width: 100%;">
        </div>
        <!-- Button trigger modal -->
        <button type="button" class="btn btn-sm btn-link" data-bs-toggle="modal" data-bs-target="#exampleModal"
            v-if="isAuth && idUser != articulo.usuario">
            Reportar Producto
        </button>
        <h4 style="margin-top: 20px;">{{ articulo.nombre }}</h4>
        <p>{{ articulo.descripcion }}</p>
        <h5><strong>Categoria</strong></h5>
        <ul class="list-group list-group-flush" v-for="cate in articulo.categoria" v-bind:key="cate">
            <li style="margin-left: 30px;">{{ cate }}</li>
        </ul>
        <h5 style="margin-top: 20px;"> <strong>Disponibles:</strong> {{ articulo.cantidad }}</h5>
        <h5 style="margin-top: 20px;" v-if="parseFloat(articulo.precio) > 0"> <strong>Precio: </strong>KOR. {{
                articulo.precio }}</h5>
        <h5 style="margin-top: 20px;" v-if="parseFloat(articulo.valor_entrada) > 0"> <strong>Valor Entrada:
            </strong>KOR. {{ articulo.valor_entrada }}</h5>
        <h5 style="margin-top: 20px;" v-if="parseFloat(articulo.recompenza) > 0"> <strong>Recompenza: </strong>KOR. {{
                articulo.recompenza }}</h5>
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
            <button v-if="isAuth && articulo.usuario !== idUser && parseInt(articulo.cantidad) > 0"
                @click="comparArticulo(articulo)" class="btn btn-outline-success col" style="margin: 5px;">{{
                labelButton }}</button>
            <button v-if="isAuth && articulo.usuario === idUser" @click="modificarProducto"
                class="btn btn-outline-warning col" style="margin: 5px;">Modificar Producto
            </button>
        </div>
    </div>
    <div class="mt-4" v-if="buyArticulo === false">
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
            <div class="d-flex justify-content-center align-items-center mt-4">
                <nav aria-label="Page navigation example">
                    <ul class="pagination">
                        <li :class="['page-item', { 'disabled': currentPage === 1 }]">
                            <button class="page-link" @click="getComentarios(previousPage)"
                                :disabled="currentPage === 1">Anterior</button>
                        </li>
                        <li :class="['page-item', { 'active': pageNumber === currentPage }]"
                            v-for="(pageNumber, index) in pagesToShow" :key="index">
                            <button class="page-link" @click="getComentarios(pageNumber)">{{ pageNumber }}</button>
                        </li>
                        <li :class="['page-item', { 'disabled': currentPage === totalPages }]">
                            <button class="page-link" @click="getComentarios(nextPage)"
                                :disabled="currentPage === totalPages">Siguiente</button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </div>

    <!-- Adquirir Articulo o Servicio -->
    <div class="mt-4 container col-md-8"
        v-if="buyArticulo === true && articulo.usuario !== idUser && tipo_adquisicion === 1">
        <form @submit.prevent="generarCompra">
            <fieldset>
                <div class="form-group mb-4">
                    <label for="disabledTextInput">Cantidad de Articulos Comprar</label>
                    <input type="number" id="disabledTextInput" class="form-control" placeholder="Cantidad"
                        v-model="compra.cantidad_articulo" min="0" :max="articulo.cantidad">
                </div>
                <div class="form-group row" v-if="cuenta.saldo_no_retirable > 0 || cuenta.saldo_retirable > 0">
                    <div class="col-md-6">
                        <label for="disabledTextInput">Korns Retirables Disponibles</label>
                        <input type="number" id="disabledTextInput" class="form-control" placeholder="Cantidad" disabled
                            v-model="cuenta.saldo_retirable">
                        <label for="disabledTextInput">Korns No Retirables Disponibles</label>
                        <input type="number" id="disabledTextInput" class="form-control" placeholder="Cantidad" disabled
                            v-model="cuenta.saldo_no_retirable">
                    </div>
                    <div class="col-md-6">
                        <label for="disabledTextInput">Korns Retirables a utilizar</label>
                        <input type="number" id="disabledTextInput" class="form-control" placeholder="Cantidad" min="0"
                            :max="cuenta.saldo_retirable" v-model="compra.uso_retirable">
                        <label for="disabledTextInput">Korns No Retirables a utilizar</label>
                        <input type="number" id="disabledTextInput" class="form-control" placeholder="Cantidad" min="0"
                            :max="cuenta.saldo_no_retirable" v-model="compra.uso_no_retirable">
                    </div>
                </div>
                <div v-if="articulosPublicados.length !== 0">
                    <div class="form-group mt-4">
                        <label for="disabledSelect">Articulo de Cambio</label>
                        <select id="disabledSelect" class="form-control" v-model="articuloSeleccionado.id"
                            @change="setCantidadSeleccionado">
                            <option value="-1" selected>Seleccionar Articulo</option>
                            <option v-for="articulo in articulosPublicados" :key="articulo.id" :value="articulo.id">
                                {{ articulo.nombre }}</option>
                        </select>
                    </div>
                    <div class="form-group mt-4 row">
                        <label for="disabledTextInput">Producto Seleccionado</label>
                        <div class="col-md-6">
                            <div class="form-group">
                                <img :src="`${URL_API}/image?articulo=` + articuloSeleccionado.id"
                                    class="imgP img-fluid" alt="Producto">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="disabledTextInput">Cantidad Disponible</label>
                                <input type="number" id="disabledTextInput" class="form-control"
                                    placeholder="Cantidad del Articulo Disponible" disabled
                                    v-model="articuloSeleccionado.cantidad">
                            </div>
                            <div class="form-group">
                                <label for="disabledTextInput">Valor Unitario</label>
                                <input type="number" id="disabledTextInput" class="form-control"
                                    placeholder="Cantidad del Articulo Disponible" disabled
                                    v-model="articuloSeleccionado.valor">
                            </div>
                            <div class="form-group">
                                <label for="disabledTextInput">Cantidad del articulo</label>
                                <input type="number" id="disabledTextInput" class="form-control" placeholder="Cantidad"
                                    v-model="compra.cantidad_articulo_cambio" :max="articuloSeleccionado.cantidad"
                                    min="0">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mt-4">
                    <button type="submit" class="btn btn-primary">Comprar</button>
                </div>
            </fieldset>
        </form>
    </div>
    <!-- Aplicar Trabajo / Voluntariado -->
    <div class="mt-4 container col-md-8"
        v-if="buyArticulo === true && articulo.usuario !== idUser && (tipo_adquisicion === 2 || tipo_adquisicion === 3)">
        <form @submit.prevent="aplicarVoluntariadoTrabajo">
            <div>
                <div class="form-group mb-4">
                    <label for="disabledTextInput">Razon para Aplicar</label>
                    <textarea rows="5" class="form-control" v-model="compra.razon_aplicar"></textarea>
                </div>
                <div class="form-group row"
                    v-if="(cuenta.saldo_no_retirable > 0 || cuenta.saldo_retirable > 0) && parseFloat(articulo.valor_entrada) > 0">
                    <div class="col-md-6">
                        <label for="disabledTextInput">Korns Retirables Disponibles</label>
                        <input type="number" id="disabledTextInput" class="form-control" placeholder="Cantidad" disabled
                            v-model="cuenta.saldo_retirable">
                        <label for="disabledTextInput">Korns No Retirables Disponibles</label>
                        <input type="number" id="disabledTextInput" class="form-control" placeholder="Cantidad" disabled
                            v-model="cuenta.saldo_no_retirable">
                    </div>
                    <div class="col-md-6">
                        <label for="disabledTextInput">Korns Retirables a utilizar</label>
                        <input type="number" id="disabledTextInput" class="form-control" placeholder="Cantidad" min="0"
                            :max="cuenta.saldo_retirable" v-model="compra.uso_retirable">
                        <label for="disabledTextInput">Korns No Retirables a utilizar</label>
                        <input type="number" id="disabledTextInput" class="form-control" placeholder="Cantidad" min="0"
                            :max="cuenta.saldo_no_retirable" v-model="compra.uso_no_retirable">
                    </div>
                </div>
                <div class="mt-4">
                    <button type="submit" class="btn btn-primary">Aplicar</button>
                </div>
            </div>
        </form>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <form @submit.prevent="reportarProducto">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Reportar Producto</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <textarea v-model="reporte.texto" class="form-control" id="commentInput"
                                rows="10"></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button type="submit" class="btn btn-primary">Enviar Reporte</button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { mapGetters } from 'vuex';
import { URL_API } from '@/main';

export default {
    name: 'VerPublicacion',
    computed: {
        ...mapGetters(['isUser', 'isAdmin', 'isConfirm', 'isAuth', 'token', 'idUser']),
    },
    data() {
        return {
            URL_API,
            reporte: {
                texto: ""
            },
            articulo: {
                id: 0,
                usuario: -1,
                nombre: 'Producto Modelo',
                cantidad: -1,
                precio: 100.99,
                valor_entrada: 100.99,
                recompenza: 100.99,
                descripcion: 'This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.',
                id_categoria: 0,
                categoria: ['otros']
            },
            cuenta: {
                saldo_retirable: 0,
                saldo_no_retirable: 0
            },
            articulosPublicados: [],
            likes: {
                liked: true,
                count_like: 0,
                count_dislike: 0
            },
            compra: {
                uso_retirable: 0,
                uso_no_retirable: 0,
                cantidad_articulo: 0,
                cantidad_articulo_cambio: 0,
                razon_aplicar: ""
            },
            articuloSeleccionado: {
                id: 0,
                cantidad: 0,
                valor: 0
            },
            tipo_adquisicion: 0, // 1 = Compra/Indercambio, 2 = Trabajo, 3 = Voluntariado
            comment: '',
            comments: [],
            totalPages: 1,
            currentPage: 1,
            previousPage: 1,
            nextPage: 1,
            pagesToShow: [],
            buyArticulo: false,
            labelButton: 'Comprar Articulo',
        }
    },
    mounted() {
        this.parametrosVista();
    },
    methods: {
        parametrosVista() {
            this.getPublicacion();
            this.getComentarios();
            this.getLikeInfo();
            this.getArticulosPublicadosComprador();
            this.getCuentaBalance();
        },
        getPublicacion() {
            let state = this.$store.state;
            this.axios.get(`publicacion/${this.$route.params.id}`, {
                headers: {
                    Authorization: `Bearer ${state.token}`
                }
            }).then(response => {
                const publicacion = response.data.data;
                const id_categoria = publicacion.articulo.category.id;
                this.articulo = {
                    id: publicacion.articulo.id,
                    cantidad: publicacion.articulo.cantidad,
                    usuario: publicacion.articulo.id_usuario,
                    nombre: publicacion.articulo.nombre,
                    precio: publicacion.articulo.valor,
                    valor_entrada: publicacion.articulo.valor_entrada,
                    recompenza: publicacion.articulo.recompenza,
                    descripcion: publicacion.articulo.descripcion,
                    id_categoria: id_categoria,
                    categoria: [publicacion.articulo.category.nombre]
                }
                console.log(this.articulo);
                switch (id_categoria) {
                    case 1:
                        this.labelButton = 'Comprar Articulo'
                        this.tipo_adquisicion = 1;
                        break;
                    case 2:
                        this.labelButton = 'Aplicar Trabajo'
                        this.tipo_adquisicion = 2;
                        break;
                    case 3:
                        this.labelButton = 'Aplicar Voluntariado'
                        this.tipo_adquisicion = 3;
                        break;
                    case 4:
                        this.labelButton = 'Contratar Servicio'
                        this.tipo_adquisicion = 1;
                        break;
                }
                console.log(id_categoria);
            }).catch(error => {
                toast.error(error.response.data.error);
                let errores = error.response.data.errores;
                for (const element of errores) {
                    toast.error(element);
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
                this.comment = '';
            }).catch(error => {
                toast.error(error.response.data.error);
                let errores = error.response.data.errores;
                for (const element of errores) {
                    toast.error(element);
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
                const { data, totalPages, previousPage, nextPage, currentPage, pagesToShow } = response.data.data;
                this.comments = data;
                this.totalPages = totalPages;
                this.previousPage = previousPage;
                this.nextPage = nextPage;
                this.currentPage = currentPage;
                this.pagesToShow = pagesToShow;
            }).catch(error => {
                toast.error(error.response.data.error);
                let errores = error.response.data.errores;
                for (const element of errores) {
                    toast.error(element);
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
                const { likes, dislikes } = response.data.data;
                this.likes.count_like = likes;
                this.likes.count_dislike = dislikes;
            }).catch(error => {
                toast.error(error.response.data.error);
                let errores = error.response.data.errores;
                for (const element of errores) {
                    toast.error(element);
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
                for (const element of errores) {
                    toast.error(element);
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
                    for (const element of errores) {
                        toast.error(element);
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
                    for (const element of errores) {
                        toast.error(element);
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
                    for (const element of errores) {
                        toast.error(element);
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
        },
        comparArticulo() {
            this.buyArticulo = !this.buyArticulo;
            if (this.buyArticulo) {
                switch (this.articulo.id_categoria) {
                    case 1:
                        this.labelButton = 'Ver Articulo'
                        this.tipo_adquisicion = 1;
                        break;
                    case 2:
                        this.labelButton = 'Ver Trabajo'
                        this.tipo_adquisicion = 2;
                        break;
                    case 3:
                        this.labelButton = 'Ver Voluntariado'
                        this.tipo_adquisicion = 3;
                        break;
                    case 4:
                        this.labelButton = 'Ver Servicio'
                        this.tipo_adquisicion = 1;
                        break;
                }
            } else {
                switch (this.articulo.id_categoria) {
                    case 1:
                        this.labelButton = 'Comprar Articulo'
                        this.tipo_adquisicion = 1;
                        break;
                    case 2:
                        this.labelButton = 'Aplicar Trabajo'
                        this.tipo_adquisicion = 2;
                        break;
                    case 3:
                        this.labelButton = 'Aplicar Voluntariado'
                        this.tipo_adquisicion = 3;
                        break;
                    case 4:
                        this.labelButton = 'Contratar Servicio'
                        this.tipo_adquisicion = 1;
                        break;
                }
            }
        },
        getArticulosPublicadosComprador() {
            let state = this.$store.state;
            this.axios.get(`articulos/usuario/publicados/intercambiables`, {
                headers: {
                    Authorization: `Bearer ${state.token}`
                }
            }).then(response => {
                this.articulosPublicados = response.data.data;
            }).catch(error => {
                toast.error(error.response.data.error);
                let errores = error.response.data.errores;
                for (const element of errores) {
                    toast.error(element);
                }
            });
        },
        setCantidadSeleccionado() {
            let busqueda = this.articulosPublicados.find(articulo => articulo.id === this.articuloSeleccionado.id);
            if (busqueda) {
                this.articuloSeleccionado.cantidad = busqueda.cantidad;
                this.articuloSeleccionado.valor = busqueda.valor;
            } else {
                this.articuloSeleccionado.cantidad = 0;
                this.articuloSeleccionado.valor = 0;
            }
        },
        getCuentaBalance() {
            let state = this.$store.state;
            this.axios.get(`cuenta/${state.id}`, {
                headers: {
                    Authorization: `Bearer ${state.token}`
                }
            })
                .then(response => {
                    const { saldo_retirable, saldo_no_retirable } = response.data.data;
                    this.cuenta.saldo_retirable = parseFloat(saldo_retirable);
                    this.cuenta.saldo_no_retirable = parseFloat(saldo_no_retirable);
                })
                .catch(error => {
                    toast.error(error.response.data.error);
                    let errores = error.response.data.errores;
                    for (const element of errores) {
                        toast.error(element);
                    }
                });
        },
        generarCompra() {
            let state = this.$store.state;
            let payload = {
                id_publicacion: this.$route.params.id,
                cantidad: this.compra.cantidad_articulo,
                creditos: {
                    retirables: this.compra.uso_retirable,
                    no_retirables: this.compra.uso_no_retirable
                },
                articulo_cambio: {
                    id_articulo: this.articuloSeleccionado.id,
                    cantidad_articulo: this.compra.cantidad_articulo_cambio
                }
            }
            this.axios.post(`compra`, payload, {
                headers: {
                    Authorization: `Bearer ${state.token}`
                }
            }).then((response) => {
                toast.success(response.data.mensaje);
                this.parametrosVista();
            }).catch(error => {
                toast.error(error.response.data.error);
                let errores = error.response.data.errores;
                for (const element of errores) {
                    toast.error(element);
                }
            });
        },
        reportarProducto() {
            let state = this.$store.state;
            console.log(state);
            this.axios.post(
                'publicacion/reportar',
                {
                    id_publicacion: this.$route.params.id,
                    comentario: this.reporte.texto
                },
                {
                    headers: {
                        Authorization: `Bearer ${state.token}`
                    }
                }
            ).then(response => {
                this.reporte.texto = "";
                toast.success(response.data.mensaje)
            }).catch(error => {
                toast.error(error.response.data.error);
                let errores = error.response.data.errores;
                for (const element of errores) {
                    toast.error(element);
                }
            });
        },
        aplicarVoluntariadoTrabajo() {
            let state = this.$store.state;
            let payload = {
                id_publicacion: this.$route.params.id,
                cantidad: 1,
                creditos: {
                    retirables: this.compra.uso_retirable,
                    no_retirables: this.compra.uso_no_retirable
                },
                razon: this.compra.razon_aplicar
            }
            this.axios.post(`compra`, payload, {
                headers: {
                    Authorization: `Bearer ${state.token}`
                }
            }).then((response) => {
                toast.success(response.data.mensaje);
                this.parametrosVista();
            }).catch(error => {
                toast.error(error.response.data.error);
                let errores = error.response.data.errores;
                for (const element of errores) {
                    toast.error(element);
                }
            });
            console.log(payload);
            console.log('Aplicar Voluntariado');
        }
    }
}
</script>

<style scoped>
img {
    height: 500px;
    align-self: center;
}

.imgP {
    margin: 20px;
    border-radius: 5px;
    max-height: 150px;
}

.style-small {
    font-size: 15px;
    color: grey;
    /* o cualquier otro color gris que desees */
}
</style>
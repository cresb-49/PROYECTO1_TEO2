<template>
    <div class="mt-4">
        <h3>Terminar Voluntariado o Trabajo</h3>
        <div class="mt-4">
            <div class="card mb-3" v-for="(publicacion) in data" v-bind:key="publicacion">
                <div class="card-body">
                    <div class="row">
                        <div class="col-3 d-flex justify-content-center align-items-center">
                            <div class="col">
                                <div class="row">
                                    <img :src="`${URL_API}/image?articulo=` + publicacion.id_articulo"
                                        class="img-fluid" alt="Producto">
                                </div>
                                <div class="row">
                                    <RouterLink :to="{ name: 'Publicacion', params: { id: publicacion.id } }"
                                        class="btn btn-sm btn-link">
                                        Ir a la publicacion</RouterLink>
                                </div>
                            </div>
                        </div>
                        <div class="col-7">
                            <div class="row">
                                <h5>{{ publicacion.articulo.nombre }}</h5>
                            </div>
                            <div class="row g-3 align-items-center">
                                <div class="col-auto">
                                    <label for="1" class="col-form-label">
                                        <h5>Cantidad:</h5>
                                    </label>
                                    <label for="2" class="col-form-label"> {{ publicacion.articulo.cantidad }}</label>
                                </div>
                            </div>
                            <div style="max-height: 200px; overflow-y: auto;">
                                <p>{{ publicacion.articulo.descripcion }}</p>
                            </div>
                        </div>
                        <div class="col-2 d-flex justify-content-center align-items-center">
                            <div class="col">
                                <div class="row mb-4">
                                    <button class="btn btn-danger"
                                        @click="doDialog(() => this.eliminar(publicacion))">Eliminar</button>
                                </div>
                                <div class="row mb-4">
                                    <button class="btn btn-warning"
                                        @click="doDialog(() => terminar(publicacion))">Terminar</button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <div class="d-flex justify-content-center align-items-center mt-4">
            <nav aria-label="Page navigation example">
                <ul class="pagination">
                    <li :class="['page-item', { 'disabled': currentPage === 1 }]">
                        <button class="page-link" @click="getTrabajosVoluntariados(previousPage)"
                            :disabled="currentPage === 1">Anterior</button>
                    </li>
                    <li :class="['page-item', { 'active': pageNumber === currentPage }]"
                        v-for="(pageNumber, index) in pagesToShow" :key="index">
                        <button class="page-link" @click="getTrabajosVoluntariados(pageNumber)">{{ pageNumber
                            }}</button>
                    </li>
                    <li :class="['page-item', { 'disabled': currentPage === totalPages || nextPage === null }]">
                        <button class="page-link" @click="getTrabajosVoluntariados(nextPage)"
                            :disabled="currentPage === totalPages || nextPage === null">Siguiente</button>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
    <Dialog :show="dialog.show" :cancel="closeDialog" :tittle="dialog.title" :description="dialog.description"
        :confirm="dialog.action"></Dialog>
</template>

<script>
import { toast } from 'vue3-toastify';
import { mapGetters } from 'vuex';
import Dialog from '@/components/Dialog.vue'
import { URL_API } from '@/main';

export default {
    name: 'TerminarTrabajosVoluntariados',
    computed: {
        ...mapGetters(['token', 'isAuth', 'isAdmin', 'isUser', 'isConfirm'])
    },
    components: {
        Dialog
    },
    data() {
        return {
            data: [],
            totalPages: 0,
            currentPage: 0,
            previousPage: null,
            nextPage: null,
            pagesToShow: [],
            dialog: {
                show: false,
                title: "Confirmar acción",
                description: "¿Está seguro de realizar esta acción?",
                action: null
            },
            URL_API
        }
    },
    mounted() {
        this.getTrabajosVoluntariados();
    },
    methods: {
        getTrabajosVoluntariados(page = 1) {
            console.log(this.token);
            this.axios.get('publicaciones/trabajos-voluntariados',
                {
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    },
                    params: {
                        page: page
                    }
                }).then(response => {
                    console.log(response.data);
                    const { data, totalPages, currentPage, previousPage, nextPage, pagesToShow } = response.data;
                    this.data = data;
                    this.totalPages = totalPages;
                    this.currentPage = currentPage;
                    this.previousPage = previousPage;
                    this.nextPage = nextPage;
                    this.pagesToShow = pagesToShow;
                }).catch(error => {
                    toast.error(error.response.data.error);
                    let errores = error.response.data.errores;
                    for (const element of errores) {
                        toast.error(element);
                    }
                });
        },
        eliminar(publicacion) {
            console.log(publicacion);
            this.axios.delete(`publicacion/voluntariado-trabajo/${publicacion.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    }
                }).then(response => {
                    console.log(response.data);
                    toast.success(response.data.mensaje);
                    this.getTrabajosVoluntariados();
                }).catch(error => {
                    toast.error(error.response.data.error);
                    let errores = error.response.data.errores;
                    for (const element of errores) {
                        toast.error(element);
                    }
                });
        },
        terminar(publicacion) {
            console.log(publicacion);
            this.axios.post('publicacion/voluntariado-trabajo/terminar',
                {
                    id_publicacion: publicacion.id
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    }
                }).then(response => {
                    console.log(response.data);
                    toast.success(response.data.mensaje);
                    this.getTrabajosVoluntariados();
                }).catch(error => {
                    toast.error(error.response.data.error);
                    let errores = error.response.data.errores;
                    for (const element of errores) {
                        toast.error(element);
                    }
                });
        },
        doDialog(action, tittle, des) {
            this.title = tittle ?? "Confirmar acción";
            this.description = des ?? "¿Está seguro de realizar esta acción?";
            this.dialog.show = true;
            this.dialog.action = action;
        },
        closeDialog() {
            this.dialog.show = false;
            this.dialog.action = null;
        }
    }
}
</script>

<template>
    <div class="mt-4">
        <h2>Reportes Publicacion</h2>
        <div class="contenedor">
            <div class="card mb-3" v-for="(publicacion, index1) in publicaciones" v-bind:key="publicacion">
                <div class="card-body">
                    <div class="row">
                        <div class="col-3">
                            <img :src="'http://localhost:3000/api/image?articulo=' + publicacion.id_articulo"
                                class="img-fluid" alt="Producto">
                        </div>
                        <div class="col-6">
                            <div style="max-height: 300px; overflow-y: auto;">
                                <div class="accordion accordion-flush" id="accordionFlushExample">
                                    <div class="accordion-item" v-for="(reporte, index) in publicaciones"
                                        v-bind:key="reporte">
                                        <h2 class="accordion-header" id="flush-headingOne">
                                            <button class="accordion-button collapsed" type="button"
                                                data-bs-toggle="collapse"
                                                :data-bs-target="'#flush-collapse-' + index1 + '-' + index"
                                                aria-expanded="false"
                                                :aria-controls="'flush-collapse-' + index1 + '-' + index">
                                                Accordion Item #1
                                            </button>
                                        </h2>
                                        <div :id="'flush-collapse-' + index1 + '-' + index"
                                            class="accordion-collapse collapse"
                                            :aria-labelledby="'flush-heading-' + index1 + '-' + index"
                                            data-bs-parent="#accordionFlushExample">
                                            <div class="accordion-body">Placeholder content for this accordion, which is
                                                intended to demonstrate the <code>.accordion-flush</code> class. This is
                                                the
                                                first item's accordion body.</div>
                                        </div>
                                    </div>
                                    <div class="accordion-item">
                                        <h2 class="accordion-header" id="flush-headingTwo">
                                            <button class="accordion-button collapsed" type="button"
                                                data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo"
                                                aria-expanded="false" aria-controls="flush-collapseTwo">
                                                Accordion Item #2
                                            </button>
                                        </h2>
                                        <div id="flush-collapseTwo" class="accordion-collapse collapse"
                                            aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample">
                                            <div class="accordion-body">Placeholder content for this accordion, which is
                                                intended to demonstrate the <code>.accordion-flush</code> class. This is
                                                the
                                                second item's accordion body. Let's imagine this being filled with some
                                                actual content.</div>
                                        </div>
                                    </div>
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
                        <button class="page-link" @click="getPublicacionesReportadas(previousPage)"
                            :disabled="currentPage === 1">Anterior</button>
                    </li>
                    <li :class="['page-item', { 'active': pageNumber === currentPage }]"
                        v-for="(pageNumber, index) in pagesToShow" :key="index">
                        <button class="page-link" @click="getPublicacionesReportadas(pageNumber)">{{ pageNumber
                            }}</button>
                    </li>
                    <li :class="['page-item', { 'disabled': currentPage === totalPages }]">
                        <button class="page-link" @click="getPublicacionesReportadas(nextPage)"
                            :disabled="currentPage === totalPages">Siguiente</button>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { toast } from 'vue3-toastify';

export default {
    name: 'ReportesPublicacionComponent',
    computed: {
        ...mapGetters(['isUser', 'isAdmin', 'isConfirm', 'isAuth', 'token']),
    },
    data() {
        return {

            publicaciones: [],
            totalPages: 1,
            currentPage: 1,
            previousPage: 1,
            nextPage: 1,
            pagesToShow: []
        }
    },
    mounted() {
        this.getPublicacionesReportadas();
    },
    methods: {
        getPublicacionesReportadas(page = 1) {
            this.axios.get('/publicaciones/reportadas', {
                headers: {
                    Authorization: `Bearer ${this.token}`
                },
                params: {
                    page: page
                }
            }).then(response => {
                console.log(response.data.data);
                this.publicaciones = response.data.data;
                this.totalPages = response.data.totalPages;
                this.currentPage = response.data.currentPage;
                this.previousPage = response.data.previousPage;
                this.nextPage = response.data.nextPage;
                this.pagesToShow = response.data.pagesToShow;
            }).catch(error => {
                toast.error(error.response.data.error);
                let errores = error.response.data.errores;
                for (const element of errores) {
                    toast.error(element);
                }
            });
        }
    }
}
</script>

<style scoped>
.contenedor {
    min-height: 450px;
}
</style>
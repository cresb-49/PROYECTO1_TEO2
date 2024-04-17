<template>
    <div class="mt-4 col-12">
        <h2>Modificar Porcentaje Ganancia Categoria</h2>
        <div class="container">
            <div class="col-md-12">
                <div class="row" v-for="categoria in categorias" v-bind:key="categoria">
                    <div class="col-auto mt-4">
                        <span>
                            <strong>
                                Categoria:
                            </strong>
                        </span>
                        <span>{{ categoria.nombre }}</span>
                        <div class="row">
                            <div class="col-auto">
                                <div class="row">
                                    <div class="col-auto">
                                        <label for="categoryPercentaje">Porcentaje de Ganancia</label>
                                    </div>
                                    <div class="col-auto">
                                        <input type="number" class="form-control" id="categoryPercentaje"
                                            placeholder="porcentaje" min="0" v-model="categoria.porcentaje_ganancias"
                                            step="0.5">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-12 mt-4">
                <div class="row">
                    <div class="col-auto">
                        <button class="btn btn-primary" @click="doDialog(() => this.enviarCambios())">
                            Guardar Cambios
                        </button>
                    </div>
                    <div class="col-auto">
                        <button class="btn btn-danger" @click="doDialog(() => this.resetCategorias())">
                            Cancelar Cambios
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Dialog :show="dialog.show" :cancel="closeDialog" :tittle="dialog.title" :description="dialog.description"
        :confirm="dialog.action"></Dialog>
</template>

<script>
import { mapGetters } from 'vuex';
// import { toast } from 'vue3-toastify';
import Dialog from '@/components/Dialog.vue'


export default {
    name: 'ModificarPorcentajeGanancias',
    computed: {
        ...mapGetters(['isUser', 'isAdmin', 'isConfirm', 'isAuth', 'token', 'idUser']),
    },
    components: {
        Dialog
    },
    data() {
        return {
            categorias: [],
            categorias_originales: [],
            dialog: {
                show: false,
                title: "Confirmar acción",
                description: "¿Está seguro de realizar esta acción?",
                action: null
            }
        }
    },
    mounted() {
        this.getCategorias();
    },
    methods: {
        getCategorias() {
            this.axios.get('categorias')
                .then((res) => {
                    this.categorias = res.data.data;
                    this.categorias_originales = res.data.data;
                })
                .catch((err) => {
                    console.log(err);
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
        },
        resetCategorias() {
            this.categorias = this.categorias_originales;
        },
        enviarCambios() {
            this.categorias_originales.forEach(element => {
                console.log(element);
            });
        }
    }
}
</script>
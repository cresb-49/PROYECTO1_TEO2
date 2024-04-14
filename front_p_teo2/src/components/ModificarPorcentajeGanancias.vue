<template>
    <div class="mt-4 col-12">
        <h2>Modificar Porcentaje Ganancia Categoria</h2>
        <div class="container">
            <div class="col-md-12">
                <div class="row" v-for="categoria in categorias" v-bind:key="categoria">
                    <div class="col-auto">
                        <span>Categoria</span>
                    </div>
                    <div class="col-auto">
                        <label for="categoryPercentaje">Valor de Venta</label>
                        <input type="number" class="form-control" id="categoryPercentaje" placeholder="porcentaje"
                            min="0" v-model="tasaDeCambio.valor_venta" step="0.5">
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
                    console.log(this.categorias);
                    console.log(this.categorias_originales);
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
        }
    }
}
</script>
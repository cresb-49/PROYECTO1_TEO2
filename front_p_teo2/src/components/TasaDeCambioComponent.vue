<template>
    <div class="mt-4">
        <h2>Actulizar Tasa de Cambio</h2>
        <div class="col-md-auto">
            <form @submit.prevent="doDialog(() => cambiarTasaDeCambio())" class="mt-4">
                <div class="col">
                    <div class="row">
                        <div class="form-group col-md-6">
                            <label for="inputEmail4">Valor de Compra</label>
                            <input type="number" class="form-control" id="inputEmail4" placeholder="Valor" min="0"
                                v-model="tasaDeCambio.valor_compra">
                        </div>
                        <div class="form-group col-md-6">
                            <label for="inputPassword4">Valor de Venta</label>
                            <input type="number" class="form-control" id="inputPassword4" placeholder="Valor" min="0"
                                v-model="tasaDeCambio.valor_venta">
                        </div>
                    </div>

                    <button type="submit" class="btn btn-primary mt-4">Sign in</button>
                </div>
            </form>
        </div>
    </div>
    <Dialog :show="dialog.show" :cancel="closeDialog" :tittle="dialog.title" :description="dialog.description"
        :confirm="dialog.action"></Dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import Dialog from '@/components/Dialog.vue'

export default {
    name: 'TasaDeCambioComponent',
    computed:
    {
        ...mapGetters(['token', 'isAuth', 'isAdmin', 'isUser', 'isConfirm'])
    },
    components: {
        Dialog
    },
    data() {
        return {
            tasaDeCambio: {
                id: 0,
                valor_compra: 0,
                valor_venta: 0,
            },
            dialog: {
                show: false,
                title: "Confirmar acción",
                description: "¿Está seguro de realizar esta acción?",
                action: null
            }
        }
    },
    mounted() {
        this.obtenerTasaDeCambio();
    },
    methods: {
        cambiarTasaDeCambio() {
            console.log("Cambiando tasa de cambio");
        },
        obtenerTasaDeCambio() {
            console.log("Obteniendo tasa de cambio");
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
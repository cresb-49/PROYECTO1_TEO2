<template>
    <div class="mt-4">
        <h2>Actualizar Tasa de Cambio</h2>
        <div class="col-md-auto">
            <form @submit.prevent="doDialog(() => cambiarTasaDeCambio())" class="mt-4">
                <div class="col">
                    <div class="row">
                        <div class="form-group col-md-6">
                            <label for="inputEmail4">Valor de Compra</label>
                            <input type="number" class="form-control" id="inputEmail4" placeholder="Valor" min="0"
                                v-model="tasaDeCambio.valor_compra" step="0.1">
                        </div>
                        <div class="form-group col-md-6">
                            <label for="inputPassword4">Valor de Venta</label>
                            <input type="number" class="form-control" id="inputPassword4" placeholder="Valor" min="0"
                                v-model="tasaDeCambio.valor_venta" step="0.1">
                        </div>
                    </div>

                    <button type="submit" class="btn btn-primary mt-4">Actualizar</button>
                </div>
            </form>
        </div>
    </div>
    <Dialog :show="dialog.show" :cancel="closeDialog" :tittle="dialog.title" :description="dialog.description"
        :confirm="dialog.action"></Dialog>
</template>

<script>
import { toast } from 'vue3-toastify';
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
        //Verificamos que el usuario sea administrador para poder acceder a esta vista
        if (!this.isAdmin) {
            this.$router.push('/');
        }
    },
    methods: {
        cambiarTasaDeCambio() {
            const payload = {
                valor_compra: this.tasaDeCambio.valor_compra,
                valor_venta: this.tasaDeCambio.valor_venta
            };
            this.axios.put('tasa', payload,
                {
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    }
                })
                .then(response => {
                    this.obtenerTasaDeCambio();
                    toast.success(response.data.mensaje);
                }).catch(error => {
                    toast.error(error.response.data.error);
                    let errores = error.response.data.errores;
                    for (const element of errores) {
                        toast.error(element);
                    }
                });
        },
        obtenerTasaDeCambio() {
            this.axios.get('tasa')
                .then(response => {
                    const data = response.data.data;
                    this.tasaDeCambio.valor_compra = data.valor_compra;
                    this.tasaDeCambio.valor_venta = data.valor_venta;
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
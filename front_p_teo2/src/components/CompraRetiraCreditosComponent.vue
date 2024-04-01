<template>
    <div class="mt-4">
        <h2>Compra Retira Creditos</h2>
        <div id="app" class="container mt-5">
            <div class="row">
                <!-- Formulario para comprar créditos -->
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Comprar Créditos</h5>
                            <form @submit.prevent="doDialog(() => this.comprarCreditos())">
                                <div class="form-group mb-2">
                                    <label>Quetzales a Ingresar</label>
                                    <input type="number" class="form-control" v-model="cantidadCompra">
                                </div>
                                <div>
                                    <label>Compra</label>
                                    <div class="row">
                                        <div class="col-5">
                                            <div class="input-group mb-2">
                                                <div class="input-group-prepend">
                                                    <div class="input-group-text">Q.</div>
                                                </div>
                                                <input type="number" class="form-control" id="inlineFormInputGroup"
                                                    placeholder="valor" value="1.00" readonly>
                                            </div>
                                        </div>
                                        <div class="col-1"
                                            style="display: flex; justify-content: center; align-items: center;">
                                            <div class="material-icons">
                                                <span>
                                                    arrow_forward
                                                </span>
                                            </div>
                                        </div>
                                        <div class="col-5">
                                            <div class="input-group mb-2">
                                                <div class="input-group-prepend">
                                                    <div class="input-group-text">KOR.</div>
                                                </div>
                                                <input type="number" class="form-control" id="inlineFormInputGroup"
                                                    placeholder="valor" v-model="tasaCambio1" readonly>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div class="mb-2">
                                    <label>Venta</label>
                                    <div class="row">
                                        <div class="col-5">
                                            <div class="input-group mb-2">
                                                <div class="input-group-prepend">
                                                    <div class="input-group-text">KOR.</div>
                                                </div>
                                                <input type="number" class="form-control" id="inlineFormInputGroup"
                                                    placeholder="valor" v-model="tasaCambio2" readonly>
                                            </div>
                                        </div>
                                        <div class="col-1"
                                            style="display: flex; justify-content: center; align-items: center;">
                                            <div class="material-icons">
                                                <span>
                                                    arrow_forward
                                                </span>
                                            </div>
                                        </div>
                                        <div class="col-5">
                                            <div class="input-group mb-2">
                                                <div class="input-group-prepend">
                                                    <div class="input-group-text">Q.</div>
                                                </div>
                                                <input type="number" class="form-control" id="inlineFormInputGroup"
                                                    placeholder="valor" value="1.00" readonly>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <button type="submit" class="btn btn-primary">Comprar</button>
                            </form>
                        </div>
                    </div>
                </div>

                <!-- Formulario para sacar créditos -->
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Sacar Créditos</h5>
                            <form @submit.prevent="doDialog(() => this.retirarCreditos())">
                                <div class="form-group">
                                    <label>Creditos disponibles</label>
                                    <input type="text" class="form-control" v-model="creditosDisponibles" readonly>
                                </div>
                                <div class="form-group mb-2">
                                    <label>Cantidad a sacar</label>
                                    <input type="number" class="form-control" v-model="cantidadSacar">
                                </div>
                                <button type="submit" class="btn btn-primary">Sacar</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Dialog :show="dialog.show" :cancel="closeDialog" :tittle="dialog.title" :description="dialog.description"
        :confirm="dialog.action"></Dialog>
</template>

<script>
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { mapGetters } from 'vuex';
import Dialog from '@/components/Dialog.vue'

export default {
    name: 'CompraRetiraCreditosApp',
    computed:
    {
        ...mapGetters(['token', 'isAuth', 'isAdmin', 'isUser', 'isConfirm'])
    },
    components: {
        Dialog
    },
    props: {
        // Propiedades del componente
    },
    data() {
        return {
            cantidadCompra: 0,
            tasaCambio1: 1.2, // Ejemplo de tasa de cambio 1
            tasaCambio2: 1.5, // Ejemplo de tasa de cambio 2
            creditosDisponibles: 100, // Ejemplo de créditos disponibles
            cantidadSacar: 0,
            dialog: {
                show: false,
                title: "Confirmar acción",
                description: "¿Está seguro de realizar esta acción?",
                action: null
            }
        }
    },
    mounted() {
        this.infoCuenta();
        this.obtenerTasaDeCambio();
    },
    methods: {
        infoCuenta() {
            let state = this.$store.state;
            this.axios.get(`cuenta/${state.id}`, {
                headers: {
                    Authorization: `Bearer ${state.token}` // Incluye el token en el encabezado Authorization
                },
            }).then(response => {
                let data = response.data.data;
                this.creditosDisponibles = data.saldo_retirable;
            }).catch(error => {
                toast.error(error.response.data.error);
                let errores = error.response.data.errores;
                for (const element of errores) {
                    toast.error(element);
                }
            });
        },
        comprarCreditos() {
            let state = this.$store.state;
            const payload = {
                cantidad: this.cantidadCompra
            };
            this.axios.post('transaccion/comprar-creditos', payload, {
                headers: {
                    Authorization: `Bearer ${state.token}` // Incluye el token en el encabezado Authorization
                },
            }).then(response => {
                toast.success(response.data.mensaje);
                this.infoCuenta();
                this.cantidadCompra = 0.0;
            }).catch(error => {
                toast.error(error.response.data.error);
                let errores = error.response.data.errores;
                for (const element of errores) {
                    toast.error(element);
                }
            })
        },
        retirarCreditos() {
            let state = this.$store.state;
            const payload = {
                cantidad: this.cantidadSacar
            };
            this.axios.post('transaccion/retirar-creditos', payload, {
                headers: {
                    Authorization: `Bearer ${state.token}` // Incluye el token en el encabezado Authorization
                },
            }).then(response => {
                toast.success(response.data.message);
                this.infoCuenta();
                this.cantidadSacar = 0.0;
            }).catch(error => {
                toast.error(error.response.data.error);
                let errores = error.response.data.errores;
                for (const element of errores) {
                    toast.error(element);
                }
            })
        },
        obtenerTasaDeCambio() {
            this.axios.get('tasa')
                .then(response => {
                    const data = response.data.data;
                    this.tasaCambio1 = data.valor_compra;
                    this.tasaCambio2 = data.valor_venta;
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
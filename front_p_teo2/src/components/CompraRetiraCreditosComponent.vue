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
                            <form @submit.prevent="comprarCreditos">
                                <div class="form-group mb-2">
                                    <label>Cantidad a comprar</label>
                                    <input type="number" class="form-control" v-model="cantidadCompra">
                                </div>
                                <div class="form-group mb-2">
                                    <label>Compra QUETZALES</label>
                                    <input type="text" class="form-control" v-model="tasaCambio1" readonly>
                                </div>
                                <div class="form-group mb-2">
                                    <label>Venta KORNS</label>
                                    <input type="text" class="form-control" v-model="tasaCambio2" readonly>
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
                            <form @submit.prevent="retirarCreditos">
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
</template>

<script>
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
export default {
    name: 'CompraRetiraCreditosApp',
    props: {
        // Propiedades del componente
    },
    data() {
        return {
            cantidadCompra: 0,
            tasaCambio1: 1.2, // Ejemplo de tasa de cambio 1
            tasaCambio2: 1.5, // Ejemplo de tasa de cambio 2
            creditosDisponibles: 100, // Ejemplo de créditos disponibles
            cantidadSacar: 0
        }
    },
    mounted() {
        this.infoCuenta();
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
                for (let index = 0; index < errores.length; index++) {
                    toast.error(errores[index]);
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
                for (let index = 0; index < errores.length; index++) {
                    toast.error(errores[index]);
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
                for (let index = 0; index < errores.length; index++) {
                    toast.error(errores[index]);
                }
            })
        }
    }
}
</script>
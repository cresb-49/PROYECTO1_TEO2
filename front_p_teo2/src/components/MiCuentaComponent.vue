<template>
    <div class="mt-4">
        <h2>Mi Cuenta</h2>
        <div class="container mt-4">
            <div class="row justify-content-center">
                <!-- Lado Izquierdo: Campos para Saldo y Datos Personales -->
                <div class="col-md-6">
                    <div class="border p-3 mb-4">
                        <h5 class="mb-3">Datos de mi cuenta</h5>
                        <div class="mb-3">
                            <label for="saldoRetirable" class="form-label">Saldo Retirable</label>
                            <div class="input-group">
                                <span class="input-group-text">Q</span>
                                <input type="number" class="form-control" id="saldoRetirable"
                                    placeholder="Saldo Retirable" readonly v-model="miCuenta.saldoRetirable">
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="saldoNoRetirable" class="form-label">Saldo No Retirable</label>
                            <div class="input-group">
                                <span class="input-group-text">Q</span>
                                <input type="number" class="form-control" id="saldoNoRetirable"
                                    placeholder="Saldo No Retirable" readonly v-model="miCuenta.saldoNoRetirable">
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="nombres" class="form-label">Nombres</label>
                            <input type="text" class="form-control" id="nombres" placeholder="Nombres" readonly
                                v-model="miCuenta.nombres">
                        </div>
                        <div class="mb-3">
                            <label for="apellidos" class="form-label">Apellidos</label>
                            <input type="text" class="form-control" id="apellidos" placeholder="Apellidos" readonly
                                v-model="miCuenta.apellidos">
                        </div>
                    </div>
                </div>
                <!-- Fin del Lado Izquierdo -->

                <!-- Lado Derecho: Bloques para Cambio de Email y Contraseña -->
                <div class="col-md-6">
                    <!-- Bloque para Cambio de Email -->
                    <form>
                        <div class="border p-3 mb-4">
                            <h5 class="mb-3">Cambio de Email</h5>
                            <div class="mb-3">
                                <label for="emailActual" class="form-label">Email Actual</label>
                                <input type="email" class="form-control" id="emailActual" placeholder="Email Actual"
                                    readonly v-model="email">
                            </div>
                            <div class="mb-3">
                                <label for="nuevoEmail" class="form-label">Nuevo Email</label>
                                <input type="email" class="form-control" id="nuevoEmail" placeholder="Nuevo Email"
                                    v-model="email2">
                            </div>
                            <div class="mb-3">
                                <input type="submit" value="Cambiar Email" class="btn btn-primary" />
                            </div>
                        </div>
                    </form>
                    <!-- Fin del Bloque para Cambio de Email -->

                    <!-- Bloque para Cambio de Contraseña -->
                    <form>
                        <div class="border p-3 mb-4">
                            <h5 class="mb-3">Cambio de Contraseña</h5>
                            <div class="mb-3">
                                <label for="actualPassword" class="form-label">Contraseña Actual</label>
                                <input type="password" class="form-control" id="actualPassword"
                                    placeholder="Contraseña Actual" v-model="password">
                            </div>
                            <div class="mb-3">
                                <label for="nuevaContrasenia" class="form-label">Nueva Contraseña</label>
                                <input type="password" class="form-control" id="nuevaContrasenia"
                                    placeholder="Nueva Contraseña" v-model="password2">
                            </div>
                            <div class="mb-3">
                                <label for="confirmarNuevaContrasenia" class="form-label">Confirmar Nueva
                                    Contraseña</label>
                                <input type="password" class="form-control" id="confirmarNuevaContrasenia"
                                    placeholder="Confirmar Nueva Contraseña" v-model="password3">
                            </div>
                            <div class="mb-3">
                                <input type="submit" value="Cambiar Contraseña" class="btn btn-primary" />
                            </div>
                        </div>
                    </form>
                    <!-- Fin del Bloque para Cambio de Contraseña -->
                </div>
                <!-- Fin del Lado Derecho -->
            </div>
        </div>
    </div>
</template>

<script>
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
    name: 'MiCuentaApp',
    props: {
        // Propiedades del componente
    },
    data() {
        return {
            miCuenta: {
                saldoRetirable: 0,
                saldoNoRetirable: 0,
                nombres: null,
                apellidos: null,
            },
            email: null,
            email2: null,
            password: null,
            password2: null,
            password3: null,
        }
    },
    methods: {
        infoCuenta() {
            let state = this.$store.state;
            this.axios.get(`cuenta/${state.id}`, {
                headers: {
                    Authorization: `Bearer ${state.token}` // Incluye el token en el encabezado Authorization
                },
            }).then(response => {
                console.log(response.data);
                this.miCuenta = response.data;
                this.email = response.data.email;
            }).catch(error => {
                toast.error(error.response.data)
                console.log(error.response.data);
            });
        }
    },
    mounted() {
        this.infoCuenta();
    }
}
</script>
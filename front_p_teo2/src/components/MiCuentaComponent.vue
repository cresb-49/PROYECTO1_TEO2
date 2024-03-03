<template>
    <div class="mt-4">
        <h2>Mi Cuenta</h2>
        <div class="container mt-4">
            <div class="row justify-content-center">
                <!-- Lado Izquierdo: Campos para Saldo y Datos Personales -->
                <div class="col-md-6">
                    <div class="border p-3 mb-4">
                        <h5 class="mb-3">Datos Personales</h5>
                        <div class="mb-3">
                            <label for="saldoRetirable" class="form-label">Saldo Retirable</label>
                            <div class="input-group">
                                <span class="input-group-text">Q</span>
                                <input type="number" class="form-control" id="saldoRetirable"
                                    placeholder="Saldo Retirable" readonly>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="saldoNoRetirable" class="form-label">Saldo No Retirable</label>
                            <div class="input-group">
                                <span class="input-group-text">Q</span>
                                <input type="number" class="form-control" id="saldoNoRetirable"
                                    placeholder="Saldo No Retirable" readonly>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="nombres" class="form-label">Nombres</label>
                            <input type="text" class="form-control" id="nombres" placeholder="Nombres" readonly>
                        </div>
                        <div class="mb-3">
                            <label for="apellidos" class="form-label">Apellidos</label>
                            <input type="text" class="form-control" id="apellidos" placeholder="Apellidos" readonly>
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
                                    readonly>
                            </div>
                            <div class="mb-3">
                                <label for="nuevoEmail" class="form-label">Nuevo Email</label>
                                <input type="email" class="form-control" id="nuevoEmail" placeholder="Nuevo Email">
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
                                    placeholder="Contraseña Actual">
                            </div>
                            <div class="mb-3">
                                <label for="nuevaContrasenia" class="form-label">Nueva Contraseña</label>
                                <input type="password" class="form-control" id="nuevaContrasenia"
                                    placeholder="Nueva Contraseña">
                            </div>
                            <div class="mb-3">
                                <label for="confirmarNuevaContrasenia" class="form-label">Confirmar Nueva
                                    Contraseña</label>
                                <input type="password" class="form-control" id="confirmarNuevaContrasenia"
                                    placeholder="Confirmar Nueva Contraseña">
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
// import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
    name: 'MiCuentaApp',
    props: {
        // Propiedades del componente
    },
    data() {
        return {
            // Datos del componente
        }
    },
    methods: {
        // Métodos asociados al componente
    },
    mounted() {
        // Código que se ejecuta cuando el componente se monta en la página
        // let ver_obj = JSON.parse(localStorage.getItem('vuex'));
        // console.log(ver_obj);
        let state = this.$store.state;
        console.log(state);
    }
}
</script>
<template>
    <div class="mt-4">
        <h2>Mis Transacciones</h2>
        <table class="table">
            <thead>
                <tr>
                    <th>ID Transacción</th>
                    <th>Valor</th>
                    <th>Fecha</th>
                    <th>Descripcion</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(transaccion, index) in transacciones" :key="index">
                    <td>{{ transaccion.id }}</td>
                    <td>{{ transaccion.valor }}</td>
                    <td>{{ transaccion.created_at }}</td>
                    <td>{{ transaccion.descripcion }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
export default {
    name: 'MisTransaccionesApp',
    props: {
        // Propiedades del componente
    },
    data() {
        return {
            transacciones: []
        }
    },
    mounted() {
        this.obtenerTransacciones()
    },
    methods: {
        obtenerTransacciones() {
            let state = this.$store.state;
            this.axios.get(`transaccion/usuario`, {
                headers: {
                    Authorization: `Bearer ${state.token}` // Incluye el token en el encabezado Authorization
                },
            }).then(response => {
                // this.transacciones = response.data.data;
                this.transacciones = response.data.data
            }).catch(error => {
                toast.error(error.response.data.error);
                let errores = error.response.data.errores;
                for (let index = 0; index < errores.length; index++) {
                    toast.error(errores[index]);
                }
            });
        }
    }
}
</script>
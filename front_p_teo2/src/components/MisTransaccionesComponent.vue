<template>
    <div class="mt-4">
        <h2>Mis Transacciones</h2>
        <table class="table">
            <thead>
                <tr>
                    <th>ID Transacción</th>
                    <th>Nombre Artículo</th>
                    <th>Valor Artículo</th>
                    <th>Cantidad Artículo</th>
                    <th>Valor Total</th>
                    <th>Créditos Ganados</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(transaccion, index) in transacciones" :key="index">
                    <td>{{ transaccion.id }}</td>
                    <td>{{ transaccion.nombre }}</td>
                    <td>{{ transaccion.valor }}</td>
                    <td>{{ transaccion.cantidad }}</td>
                    <td>{{ transaccion.valorTotal }}</td>
                    <td>{{ transaccion.creditosGanados }}</td>
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
            transacciones: [
                { id: 1, nombre: 'Artículo 1', valor: 10, cantidad: 2, valorTotal: 20, creditosGanados: 5 },
                { id: 2, nombre: 'Artículo 2', valor: 15, cantidad: 1, valorTotal: 15, creditosGanados: 3 },
                { id: 3, nombre: 'Artículo 3', valor: 8, cantidad: 3, valorTotal: 24, creditosGanados: 6 }
            ]
        }
    },
    mounted() {

    },
    methods: {
        obtenerTransacciones() {
            let state = this.$store.state;
            this.axios.get(`transacciones/${state.id}`, {
                headers: {
                    Authorization: `Bearer ${state.token}` // Incluye el token en el encabezado Authorization
                },
            }).then(response => {
                this.transacciones = response.data.data;
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
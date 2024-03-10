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
                    <td>{{ transaccion.fecha }}</td>
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
            transacciones: [
                { id: 1, valor: 100, fecha: '2021-10-01', descripcion: 'Compra de créditos' },
                { id: 2, valor: 200, fecha: '2021-10-02', descripcion: 'Retiro de créditos' },
                { id: 3, valor: 300, fecha: '2021-10-03', descripcion: 'Compra de créditos' },
                { id: 4, valor: 400, fecha: '2021-10-04', descripcion: 'Retiro de créditos' },
                { id: 5, valor: 500, fecha: '2021-10-05', descripcion: 'Compra de créditos' },
                { id: 6, valor: 600, fecha: '2021-10-06', descripcion: 'Retiro de créditos' },
                { id: 7, valor: 700, fecha: '2021-10-07', descripcion: 'Compra de créditos' },
                { id: 8, valor: 800, fecha: '2021-10-08', descripcion: 'Retiro de créditos' },
                { id: 9, valor: 900, fecha: '2021-10-09', descripcion: 'Compra de créditos' },
                { id: 10, valor: 1000, fecha: '2021-10-10', descripcion: 'Retiro de créditos' },
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
<template>
    <div class="mt-4">
        <h2>Compra Retira Creditos</h2>
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
<template>
    <div class="mt-4">
        <div v-for="compra in compras" v-bind:key="compra">
            <div class="card mb-3">
                <div class="card-body">
                    <div class="row">
                        <div class="col-3">
                            <img :src="'http://localhost:3000/api/image?articulo=' + compra.id_articulo_venta"
                                class="img-fluid" alt="Imagen del producto">
                        </div>
                        <div class="col-9">
                            <h5 class="card-title"><strong>Nombre:</strong> {{ compra.articulo_venta.nombre }}</h5>
                            <p class="card-text"><strong>Cantidad:</strong> <small> {{ compra.cantidad_articulo_venta
                                    }}</small></p>
                            <p class="card-text"><strong>KORNS usados:</strong> <small> {{ compra.valor_venta
                                    }}</small></p>
                            <p class="card-text"><strong>Fecha:</strong> <small> {{ formatDate(compra.validate_at)
                                    }}</small></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { toast } from 'vue3-toastify';
import { mapGetters } from 'vuex';

export default {
    name: 'ListaComprasComponent',
    computed: {
        ...mapGetters(['isUser', 'isAdmin', 'isConfirm', 'isAuth', 'token']),
    },
    components: {
    },
    data() {
        return {
            compras: []
        }
    },
    props: {

    },
    mounted() {
        this.getCompras();
    },
    methods: {
        getCompras() {
            this.axios.get('/compras/usuario', {
                headers: {
                    Authorization: `Bearer ${this.token}` // Incluye el token en el encabezado Authorization
                },
            })
                .then(response => {
                    console.log(response.data.data);
                    this.compras = response.data.data;
                }).catch(error => {
                    toast.error(error.response.data.error);
                    let errores = error.response.data.errores;
                    for (let index = 0; index < errores.length; index++) {
                        toast.error(errores[index]);
                    }
                });
        },
        formatDate(date) {
            const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
            return new Date(date).toLocaleString('es-ES', options);
        },
    }
}
</script>
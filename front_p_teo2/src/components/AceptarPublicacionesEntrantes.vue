<template>
    <div class="mt-4">
        <div v-for="publicacion in publicaciones" v-bind:key="publicacion">
            <div class="card mb-3">
                <div class="card-body">
                    <div class="row">
                        <div class="col-3">
                            <img :src="'http://localhost:3000/api/image?articulo=' + publicacion.id_articulo"
                                class="img-fluid" alt="Producto">
                        </div>
                        <div class="col-9">
                            <h5 class="card-title"><strong>Nombre:</strong> {{ publicacion.articulo.nombre }}</h5>
                            <p class="card-text"><strong>Descripcion:</strong> {{ publicacion.articulo.descripcion }}
                            </p>
                            <p class="card-text"><strong>KORNS:</strong> <small> {{ publicacion.articulo.valor
                                    }}</small></p>
                            <p class="card-text"><strong>Cantidad:</strong> <small> {{ publicacion.articulo.cantidad
                                    }}</small></p>
                            <button @click="verificarPublicacion(publicacion)"
                                class="btn btn-primary float-right">Verificar</button>
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
    name: 'AceptarPublicacionesEntrantes',
    computed: {
        ...mapGetters(['token', 'idUser', 'isConfirm', 'isAuth']),
    },
    data() {
        return {
            publicaciones: []
        }
    },
    props: {

    },
    mounted() {
        this.getPublicacionesSinConfirmar();
    },
    methods: {
        getPublicacionesSinConfirmar() {
            this.axios.get('publicaciones/sin-confirmar', {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            }).then(response => {
                this.publicaciones = response.data.data;
            }).catch(error => {
                toast.error(error.response.data.error);
                let errores = error.response.data.errores;
                for (let index = 0; index < errores.length; index++) {
                    toast.error(errores[index]);
                }
            });
        },
        verificarPublicacion(publicacion) {
            const payload = {
                "id_publicacion": publicacion.id
            };
            this.axios.post('publicacion/confirmar', payload,{
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            }).then(response => {
                toast.success(response.data.mensaje);
                this.getPublicacionesSinConfirmar();
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
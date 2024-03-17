<template>
    <div>
        <div v-for="d in data" v-bind:key="d">
            <div class="card mb-3" v-if="!d.venta.isHome">
                <div class="card-body">
                    <div class="row">
                        <div class="col-3">
                            <CarruselVue :articulos="d.articulos"></CarruselVue>
                        </div>
                        <div class="col-9">
                            <h5 class="card-title">Articulos</h5>
                            <template v-for="a in d.articulos" v-bind:key="a">
                                <ul>
                                    <li>{{ a.nombre }}</li>
                                </ul>
                            </template>
                            <button @click="verificarArticulo(d.venta)" class="btn btn-primary float-right">Modificar
                                Estado</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// import { toast } from 'vue3-toastify';
export default {
    name: 'ListaComprasComponent',
    components: {
    },
    data() {
        return {
            data: []
        }
    },
    props: {

    },
    mounted() {
    },
    methods: {
    }
}
</script>
<template>
    <div>
        <DialogVue :show='show' tittle="Nueva compra" description="Desea confinuar con la compra" :cancel="cancel"
            :confirm="comparCarrito"></DialogVue>
        <DialogVue :show='show2' tittle="Eliminar Carrito" description="Desea eliminar todo el carrito" :cancel="cancel"
            :confirm="vaciarCarrito"></DialogVue>
        <div class="card">
            <div class="card-header">
                <h5 class="card-title">Selecciona tu tarjeta de crédito</h5>
            </div>
            <div class="card-body">
                <select class="form-control" @change="asignarValor">
                    <option selected>Selecciona una tarjeta</option>
                    <template v-for=" card in tarjetas" v-bind:key="card">
                        <option>{{ card.numero }}</option>
                    </template>
                </select>
            </div>
        </div>
        <br>

        <h1 class="mb-2">Carrito</h1>
        <div class="mb-3 card">
            <div style="padding: 10px;">
                <h5>Valor del Carrito</h5>
                <div>Q. {{ getValor() }}</div>
            </div>
        </div>
        <button class="btn btn-primary mb-3" @click="this.show = true">Comprar todo el carrito</button>
        <button class="btn btn-danger mb-3" @click="this.show2 = true" style="margin-left: 10px;">Eliminar todo el
            carrito</button>
        <div v-for="articulo in articulos" v-bind:key="articulo">
            <div class="card mb-3" style="max-width: 300px;">
                <img :src="'http://localhost:3000/ecommercegt/img?id=' + articulo._id" alt="Placeholder Image"
                    style="max-width: 300px; margin: 5px; border-radius: 5px;" align="center">
                <div class="card-body">
                    <h5 class="card-title">{{ articulo.nombre }}</h5>
                    <p class="card-text">{{ articulo.descripcion }}</p>
                    <p class="card-text">Valor: Q. {{ articulo.precio }}</p>
                    <button class="btn btn-danger" @click="eliminar(articulo)">Eliminar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import DialogVue from './Dialog.vue'

export default {
    name: 'CarritoCompras',
    components: {
        DialogVue
    },
    data() {
        return {
            articulos: [],
            tarjetas: [],
            valor: 0,
            show: false,
            show2: false,
            card: null
        }
    },
    mounted() {
        let ver_obj = JSON.parse(localStorage.getItem('vuex'));
        let ver_auth = ver_obj.isAuthenticated;
        let ver_rol = ver_obj.role;
        if (ver_auth && ver_rol === 'USUARIO') {
            let vu = this;
            let usuario = this.$store.state.user;
            this.axios.get(`/api/carrito?usuario=${usuario}`)
                .then(response => {
                    vu.productos = response.data.productos;
                    vu.productos.forEach(element => {
                        vu.axios.get(`/api/articulo?_id=${element}`)
                            .then(response => {
                                vu.articulos.push(response.data);
                            }).catch(response => {
                                toast.error(response.response.data.error);
                            })
                    });
                })
                .catch(response => {
                    toast.error(response.response.data.error);
                })
            //Obtener la tarjetas de los usuarios ingresados
            const payload = {
                usuario: this.$store.state.user
            }
            this.axios.post('/api/usuario/cards', payload)
                .then(response => {
                    vu.tarjetas = response.data.card;
                })
                .catch(response => {
                    toast.error(response.response.data.error)
                });
        } else {
            this.$router.push('/');
        }
    },
    methods: {
        eliminar(articulo) {
            this.axios.delete(`/api/carrito/articulo`, { data: { id: articulo._id, usuario: this.$store.state.user } })
                // eslint-disable-next-line no-unused-vars
                .then(response => {
                    toast.success("Carrito actualizado!!");
                    this.actualizarInformacion()
                })
                .catch(response => {
                    console.log(response.response.data);
                    toast.error(response.response.data.error);
                })

        },
        actualizarInformacion() {
            this.productos = [];
            this.articulos = [];
            let vu = this;
            let usuario = this.$store.state.user;
            this.axios.get(`/api/carrito?usuario=${usuario}`)
                .then(response => {
                    vu.productos = response.data.productos;
                    vu.productos.forEach(element => {
                        vu.axios.get(`/api/articulo?_id=${element}`)
                            .then(response => {
                                vu.articulos.push(response.data)
                            }).catch(response => {
                                toast.error(response.response.data.error);
                            })
                    });
                })
                .catch(response => {
                    toast.error(response.response.data.error);
                });
        },
        comparCarrito() {
            let vu = this;
            let articulos = []
            for (const a of this.articulos) {
                articulos.push(a._id);
            }
            let payload = {
                usuario: this.$store.state.user,
                card: this.card,
                articulos: articulos,
                isCentro: true,
                isCamino: false,
                isHome: false
            }
            if (this.card != null) {
                if (this.articulos.length > 0) {
                    this.axios.post('/api/venta', payload)
                        // eslint-disable-next-line no-unused-vars
                        .then(response => {
                            toast.success('Compra realizada con exito!!!');
                            vu.vaciarCarrito();
                        })
                        .catch(response => {
                            toast.error('Error en compra!!!\n' + response.response.data.error);
                        });
                } else {
                    toast.warning("El carrito esta vacio");
                }
            } else {
                toast.warning("Debe de seleccionar una tarjeta para realizar la compra");
            }
            this.show = false;
        },
        getValor() {
            let value = 0;
            for (const a of this.articulos) {
                value = value + a.precio;
            }
            this.valor = value.toFixed(2);
            return this.valor;
        },
        cancel() {
            this.show2 = false;
            this.show = false;
        },
        asignarValor(e) {
            let vu = this;
            let card = e.target.value;
            const regex = /^\d{16}$/;
            if (regex.test(card)) {
                vu.card = card;
            } else {
                vu.card = null;
            }
        }, vaciarCarrito() {
            let vu = this;
            this.axios.delete('/api/carrito/articulos', { data: { usuario: this.$store.state.user } })
                .then(response => {
                    if (response.data.modifiedCount !== 0) {
                        vu.articulos = []
                    }
                })
                .catch(response => {
                    toast.error('Error en compra!!!\n' + response.response.data.error);
                });
            this.show2 = false;
        }
    }
}
</script>
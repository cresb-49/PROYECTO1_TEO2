<template>
    <div>
        <h1>Reportes</h1>
        <div class="row">
            <div class="col">
                <table style="border-collapse: collapse;">
                    <caption>Opciones de reporte</caption>
                    <tr>
                        <th>Nombre reporte</th>
                        <th>Accion</th>
                    </tr>
                    <tr>
                        <td>
                            <ul>
                                <li>Top 10 productos de mas valor vendidos en un intervalo de tiempo</li>
                            </ul>
                        </td>
                        <td><button type="button" class="btn btn-info" @click="getReporte1()">Generar</button></td>
                    </tr>
                    <tr>
                        <td>
                            <ul>
                                <li>Top 5 clientes que mas ganancias por compras generan en un intervalo</li>
                            </ul>
                        </td>
                        <td><button type="button" class="btn btn-info" @click="getReporte2()">Generar</button></td>
                    </tr>
                    <tr>
                        <td>
                            <ul>
                                <li>Top 5 clientes que mas productos han vendido en un intervalo</li>
                            </ul>
                        </td>
                        <td><button type="button" class="btn btn-info" @click="getReporte3()">Generar</button></td>
                    </tr>
                    <tr>
                        <td>
                            <ul>
                                <li>Top 10 clientes que mas pedidios han realizado en un intervalo</li>
                            </ul>
                        </td>
                        <td><button type="button" class="btn btn-info" @click="getReporte4()">Generar</button></td>
                    </tr>
                    <tr>
                        <td>
                            <ul>
                                <li>Top 10 clientes que mas productos tienen a la venta</li>
                            </ul>
                        </td>
                        <td><button type="button" class="btn btn-info" @click="getReporte5()">Generar</button></td>
                    </tr>
                </table>
            </div>
            <div class="col-3">
                <div class="row mb-3">
                    <label for="fecha1">Fecha Inicial</label>
                    <input type="date" name="fecha1" id="fecha1" v-model="fechaInicial">
                </div>
                <div class="row mb-3">
                    <label for="fecha1">Fecha Final</label>
                    <input type="date" name="fecha1" id="fecha1" v-model="fechaFinal">
                </div>

                <buttonb class="row btn btn-primary" @click="asignarFecha()">Guardar</buttonb>
            </div>
        </div>
        <br>
        <template v-if="reporte1.length > 0">
            <div class="container">
                <h1>Top 10 productos de mas valor vendidos en un intervalo de tiempo</h1>
                <table class="table table-striped">
                    <caption>Reporte 1</caption>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Producto</th>
                            <th>Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="articulo in reporte1" :key="articulo">
                            <tr>
                                <td>{{ articulo._id }}</td>
                                <td>{{ articulo.nombre }}</td>
                                <td>{{ articulo.precio }}</td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
        </template>
        <template v-if="reporte2.length > 0">
            <div class="container">
                <h1>Top 5 clientes que mas ganancias por compras generan en un intervalo</h1>
                <table class="table table-striped">
                    <caption>Reporte 2</caption>
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>Ganancia</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="user in reporte2" :key="user">
                            <tr>
                                <td>{{ user.usuario }}</td>
                                <td>{{ user.ganancia }}</td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
        </template>
        <template v-if="reporte3.length > 0">
            <div class="container">
                <h1>Top 5 clientes que mas productos han vendido en un intervalo</h1>
                <table class="table table-striped">
                    <caption>Reporte 3</caption>
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>Cantidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="user in reporte3" :key="user">
                            <tr>
                                <td>{{ user.usuario }}</td>
                                <td>{{ user.count }}</td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
        </template>
        <template v-if="reporte4.length > 0">
            <div class="container">
                <h1>Top 10 clientes que mas pedidios han realizado en un intervalo</h1>
                <table class="table table-striped">
                    <caption>Reporte 4</caption>
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>Pedidos</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="user in reporte4" :key="user">
                            <tr>
                                <td>{{ user.usuario }}</td>
                                <td>{{ user.count }}</td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
        </template>
        <template v-if="reporte5.length > 0">
            <div class="container">
                <h1>Top 10 clientes que mas productos tienen a la venta</h1>
                <table class="table table-striped">
                    <caption>Reporte 5</caption>
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>Cantidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="user in reporte5" :key="user">
                            <tr>
                                <td>{{ user.usuario }}</td>
                                <td>{{ user.count }}</td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
        </template>
    </div>
</template>

<script>
import { toast } from 'vue3-toastify';
const moment = require('moment');

export default {
    name: 'ReportesComponent',
    data() {
        return {
            reporte1: [],
            reporte2: [],
            reporte3: [],
            reporte4: [],
            reporte5: [],
            fechaInicial: '',
            fechaFinal: ''
        }
    },
    mounted() {
        let ver_obj = JSON.parse(localStorage.getItem('vuex'));
        let ver_auth = ver_obj.isAuthenticated;
        let ver_rol = ver_obj.role;//ADMIN USUARIO PAQUETERIA
        if (ver_auth && ver_rol === 'ADMIN') {
            //CODIGO ESTABLECITO EN LA SENTENCIA
            this.fechaFinal = moment().format('YYYY-MM-DD');
            this.fechaInicial = moment().format('YYYY-MM-DD');
        } else {
            this.$router.push('/');
        }
    },
    methods: {
        getReporte1() {
            let vu = this;
            this.reporte1 = [];
            this.reporte2 = [];
            this.reporte3 = [];
            this.reporte4 = [];
            vu.reporte5 = [];
            this.axios.get(`/api/reporte1?fecha1=${this.fechaInicial}&fecha2=${this.fechaFinal}`).
                then(res => {
                    vu.reporte1 = res.data;
                    if(vu.reporte1.length === 0){
                        toast.warning("No existen datos para mostrar el reporte");
                    }else{
                        toast.success('Reporte generado correctamente');
                    }
                })
                .catch(res => {
                    console.log(res.response.data);
                    toast.error('Error al generar el reporte!!!\n' + res.response.data.error);
                });
        },
        getReporte2() {
            let vu = this;
            this.reporte1 = [];
            this.reporte2 = [];
            this.reporte3 = [];
            this.reporte4 = [];
            vu.reporte5 = [];
            this.axios.get(`/api/reporte2?fecha1=${this.fechaInicial}&fecha2=${this.fechaFinal}`).
                then(res => {
                    vu.reporte2 = res.data;
                    if(vu.reporte2.length === 0){
                        toast.warning("No existen datos para mostrar el reporte");
                    }else{
                        toast.success('Reporte generado correctamente');
                    }
                })
                .catch(res => {
                    console.log(res.response.data);
                    toast.error('Error al generar el reporte!!!\n' + res.response.data.error);
                });
        },
        getReporte3() {
            let vu = this;
            this.reporte1 = [];
            this.reporte2 = [];
            this.reporte3 = [];
            this.reporte4 = [];
            vu.reporte5 = [];
            this.axios.get(`/api/reporte3?fecha1=${this.fechaInicial}&fecha2=${this.fechaFinal}`).
                then(res => {
                    vu.reporte3 = res.data;
                    if(vu.reporte3.length === 0){
                        toast.warning("No existen datos para mostrar el reporte");
                    }else{
                        toast.success('Reporte generado correctamente');
                    }
                })
                .catch(res => {
                    console.log(res.response.data);
                    toast.error('Error al generar el reporte!!!\n' + res.response.data.error);
                });
        },
        getReporte4() {
            let vu = this;
            this.reporte1 = [];
            this.reporte2 = [];
            this.reporte3 = [];
            this.reporte4 = [];
            vu.reporte5 = [];
            this.axios.get(`/api/reporte4?fecha1=${this.fechaInicial}&fecha2=${this.fechaFinal}`).
                then(res => {
                    vu.reporte4 = res.data;
                    if(vu.reporte4.length === 0){
                        toast.warning("No existen datos para mostrar el reporte");
                    }else{
                        toast.success('Reporte generado correctamente');
                    }
                })
                .catch(res => {
                    console.log(res.response.data);
                    toast.error('Error al generar el reporte!!!\n' + res.response.data.error);
                });
        },
        getReporte5() {
            let vu = this;
            this.reporte1 = [];
            this.reporte2 = [];
            this.reporte3 = [];
            this.reporte4 = [];
            vu.reporte5 = [];
            this.axios.get('/api/reporte5').
                then(res => {
                    vu.reporte5 = res.data;
                    if(vu.reporte5.length === 0){
                        toast.warning("No existen datos para mostrar el reporte");
                    }else{
                        toast.success('Reporte generado correctamente');
                    }
                })
                .catch(res => {
                    console.log(res.response.data);
                    toast.error('Error al generar el reporte!!!\n' + res.response.data.error);
                });
        },
        asignarFecha() {
            console.log(this.fechaInicial);
            console.log(this.fechaFinal);
        }
    }
}
</script>
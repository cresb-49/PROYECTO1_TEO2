<template>
    <div>
        <div>
            <table class="table" aria-describedby="Tarjetas usuario">
                <thead>
                    <tr>
                        <th>Usuario</th>
                        <th>Modificar</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for=" usuario in usuarios" v-bind:key="usuario">
                        <tr>
                            <td>{{ usuario.user }}</td>
                            <td><button class="btn btn-warning btn-sm" type="button"
                                    @click="modificarUsuario(usuario._id)">Modificar</button></td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
import { toast } from 'vue3-toastify';

export default {
    name: 'ListaUsuarios',
    data() {
        return {
            usuarios: []
        }
    },
    mounted() {
        let ver_obj = JSON.parse(localStorage.getItem('vuex'));
        let ver_auth = ver_obj.isAuthenticated;
        let ver_rol = ver_obj.role;//ADMIN USUARIO PAQUETERIA
        if (ver_auth && ver_rol === 'ADMIN') {
            let vu = this;
            this.axios.get('/api/usuario/empleados')
                .then(res => {
                    vu.usuarios = res.data;
                    toast.success('Empleados recuperados!!!');
                })
                .catch(res => {
                    toast.error(res.response.data.error);
                });
        } else {
            this.$router.push('/');
        }
    },
    methods: {
        modificarUsuario(usuario) {
            this.$router.push(`/ModificarUsuario/${usuario}`);
        }
    }
}
</script>
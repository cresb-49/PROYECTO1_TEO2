<template>
    <div>
        <div class="card">
            <div class="card-body">
                <form class="form-group" @submit.prevent="modificarUsuario">
                    <div class="mb-3">
                        <label for="name">Nombre de usuario</label>
                        <input type="text" class="form-control" id="name" placeholder="Ingrese su nombre de usuario"
                            v-model="user">
                    </div>
                    <div class="mb-3">
                        <label for="email">Correo electrónico</label>
                        <input type="email" class="form-control" id="email" placeholder="Ingrese su correo electrónico"
                            v-model="email" required>
                    </div>
                    <label class="mb-1">Cambio de contraseña</label>
                    <div class="card mb-3">
                        <div style="margin: 10px;">
                            <div class="mb-3">
                                <label for="password">Contraseña Nueva</label>
                                <input type="password" class="form-control" id="password"
                                    placeholder="Ingrese su contraseña" v-model="password">
                            </div>
                            <div class="mb-3">
                                <label for="password2">Verifica Contraseña Nueva</label>
                                <input type="password" class="form-control" id="password2"
                                    placeholder="Ingrese su contraseña" v-model="password2">
                            </div>
                            <div>
                                <label for="password">Contraseña Anterior</label>
                                <input type="password" class="form-control" id="password"
                                    placeholder="Ingrese su contraseña" v-model="confirmPass">
                            </div>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary">Modificar</button>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
import { toast } from 'vue3-toastify';

export default {
    name: 'ModificarUsuario',
    data() {
        return {
            usuario: null,
            user: '',
            email: '',
            password: '',
            password2: '',
            confirmPass: ''
        }
    },
    mounted() {
        let ver_obj = JSON.parse(localStorage.getItem('vuex'));
        let ver_auth = ver_obj.isAuthenticated;
        let ver_rol = ver_obj.role;//ADMIN USUARIO PAQUETERIA
        if (ver_auth && ver_rol === 'ADMIN') {
            let vu = this;
            let usuario = this.$route.params.id;
            this.axios.get(`/api/usuario?id=${usuario}`)
                .then(res => {
                    toast.success('Usuario recuperado!!!');
                    vu.usuario = res.data;
                    vu.user = vu.usuario.user;
                    vu.email = vu.usuario.email;
                })
                .catch(res => {
                    toast.error(res.response.data.error);
                });
        } else {
            this.$router.push('/');
        }
    },
    methods: {
        modificarUsuario() {
            let vu = this;
            let payload = {
                id: this.$route.params.id,
                email: this.email,
                user: this.user,
                newPass: this.password,
                newPass2: this.password2,
                oldPass: this.confirmPass
            }
            if (this.validarInputs(payload)) {
                this.axios.put('/api/usuario', payload)
                    .then(res => {
                        console.log(res.data);
                        toast.success('Informacion modificada!!!');
                        let ver_obj = JSON.parse(localStorage.getItem('vuex'));
                        if (ver_obj.user === vu.usuario.user) {
                            if (ver_obj.user !== vu.user || payload.newPass.length > 0) {
                                toast.info('Credenciales del usuario actual se han modificado se cerrara la session actual');
                                vu.cerrarSession();
                            }
                        }
                    })
                    .catch(res => {
                        toast.error(res.response.data.error);
                        console.log(res.response.data.error);
                    });
            }
        },
        validarInputs(payload) {
            let regexuser = /^[\w]{4,30}$/;
            let regexpassword = /^[^\s\t\n]{4,20}$/;
            let regexemail = /^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
            if (!regexuser.test(payload.user)) {
                toast.warning('El nombre de usuario solo puede contener numeros y letras, y un minimo de 4 caracteres y un maximo de 30');
                return false;
            }
            if (!regexemail.test(payload.email)) {
                toast.warning('El email ingresado no es valido');
                return false;
            }
            if (payload.newPass.length > 0) {
                if (!regexpassword.test(payload.newPass)) {
                    toast.error('La contraseña nueva debe de tener de 4 a 20 y no deben haber espacios');
                } else {
                    if (payload.newPass !== payload.newPass2) {
                        toast.error('Las nuevas contraseñas no coinciden');
                        return false;
                    }
                }
            } else {
                if (payload.oldPass.length > 0) {
                    toast.error('Solo al modificar la contraseña es necesario ingresar la contraseña anterior');
                    return false;
                }
                if (payload.newPass2.length > 0) {
                    toast.error('Solo al modificar la contraseña es necesario ingresar nuevamente la contraseña');
                    return false;
                }
            }
            return true;
        },
        cerrarSession() {
            this.$store.commit('logout')
        }
    }
}
</script>
<template>
    <div>
        <div class="card">
            <div class="card-body">
                <form class="form-group" @submit.prevent="loginUsuario">
                    <div class="mb-3">
                        <label for="user">Email</label>
                        <input type="text" class="form-control" id="user" placeholder="Ingrese su correo electrónico"
                            v-model="email" required>
                    </div>
                    <div class="mb-3">
                        <label for="password">Contraseña</label>
                        <input type="password" class="form-control" id="password" placeholder="Ingrese su contraseña"
                            v-model="password" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Iniciar sesión</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
    name: 'LoginApp',
    props: {
        // Propiedades del componente
    },
    data() {
        return {
            email: null,
            password: null
        }
    },
    methods: {
        loginUsuario() {
            let data = {
                email: this.email,
                password: this.password
            }
            this.axios.post('/login', data)
                .then(value => {
                    const { token, id_usuario } = value.data.data;
                    if (token === undefined || id_usuario === undefined) {
                        toast.error('Error al iniciar sesión');
                        return;
                    } else {
                        //Reinico de las variables del formulario
                        this.email = null; this.password = null;
                        toast.success('Session iniciada');
                        //this.axios.defaults.headers.common['Authorization']='Bearer '+data.token;
                        //localStorage.setItem('token',data.token);
                        this.$store.commit('setAuthenticated', true);
                        this.$store.commit('setToken', token);
                        this.$store.commit('setId', id_usuario);
                        //Redireccion al inicio de la pagina
                        this.$router.push('/');
                    }
                })
                .catch(response => {
                    //Mensaje de error por el response
                    const data = response.response.data;
                    toast.error(data.mensaje);
                })
        }
    },
    mounted() {
        // Código que se ejecuta cuando el componente se monta en la página
    }
}
</script>

<style scoped>
.card {
    border-radius: 0px 0px 5px 5px;
}
</style>
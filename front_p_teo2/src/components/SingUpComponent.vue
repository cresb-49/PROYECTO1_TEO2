<template>
    <div>
        <div class="card">
            <div class="card-body">
                <form class="form-group" @submit.prevent="registroUsuario">
                    <div class="mb-3">
                        <label for="names">Nombres</label>
                        <input type="text" class="form-control" id="names" placeholder="Ingrese su nombre o nombres"
                            v-model="nombres" required>
                    </div>
                    <div class="mb-3">
                        <label for="lastname">Apellidos</label>
                        <input type="text" class="form-control" id="lastname"
                            placeholder="Ingrese su apellido o apellidos" v-model="apellidos" required>
                    </div>
                    <div class="mb-3">
                        <label for="birtday">Fecha Nacimiento</label>
                        <input type="date" class="form-control" id="birtday"
                            placeholder="Ingrese su fecha de nacimiento" v-model="f_nacimiento" required>
                    </div>
                    <div class="mb-3">
                        <label for="email">Correo electrónico</label>
                        <input type="email" class="form-control" id="email" placeholder="Ingrese su correo electrónico"
                            v-model="email" required>
                    </div>
                    <div class="mb-3">
                        <label for="password">Contraseña</label>
                        <input type="password" class="form-control" id="password" placeholder="Ingrese su contraseña"
                            v-model="password" required>
                    </div>
                    <div class="mb-3">
                        <label for="password2">Verifica Contraseña</label>
                        <input type="password" class="form-control" id="password2" placeholder="Ingrese su contraseña"
                            v-model="password2" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Registrarse</button>
                </form>
            </div>
        </div>

    </div>
</template>

<script>
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css';

export default {
    name: 'SignUpApp',
    props: ['typeRole'],
    data() {
        return {
            nombres: null,
            apellidos: null,
            f_nacimiento: null,
            email: null,
            password: null,
            password2: null,
            role: 0
        }
    },
    methods: {
        registroUsuario() {
            let data = {
                nombres: this.nombres,
                apellidos: this.apellidos,
                email: this.email,
                password: this.password,
                password2: this.password2,
                f_nacimiento: this.f_nacimiento
            }
            this.axios.post('/usuario', data)
                .then(response => {
                    console.log(response.data);
                    toast.success('Registro correcto!!!');
                    //Reinico de las variables del formulario
                    this.nombres = null; this.apellidos = null; this.f_nacimiento = null; this.email = null; this.password = null; this.password2 = null;
                })
                .catch(response => {
                    const data = response.response.data;
                    toast.error(data.mensaje);
                })
        }
    },
    mounted() {
        // Código que se ejecuta cuando el componente se monta en la página
    },
    created() {
        if (this.typeRole) {
            this.role = this.typeRole;
        }
    }
}
</script>

<style scoped>
.card {
    border-radius: 0px 0px 5px 5px;
}
</style>
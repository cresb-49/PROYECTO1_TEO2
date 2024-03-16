<template>
    <div class="container mt-4">
        <h4>Crear Usuario</h4>
        <div>
            <div class="form-group mt-4">
                <label for="disabledSelect">Seleccionar Rol</label>
                <select id="disabledSelect" class="form-control" v-model="rolSeleccionado"
                    @change="setCantidadSeleccionado">
                    <option value="-1" selected>Seleccionar</option>
                    <option v-for="role in roles" :key="role.id" :value="role.id">
                        {{ role.nombre}}</option>
                </select>
            </div>
        </div>
        <div class="mt-4">
            <SingUpComponent :type-role="rolSeleccionado"></SingUpComponent>
        </div>
    </div>
</template>

<script>
import SingUpComponent from './SingUpComponent.vue'
import { toast } from 'vue3-toastify'
import { mapGetters } from 'vuex';

export default {
    name: 'RegistroUsuarioRol',
    computed: {
        ...mapGetters(['isUser', 'isAdmin', 'isConfirm', 'isAuth', 'token']),
    },
    components: {
        SingUpComponent
    },
    data() {
        return {
            roles: [],
            rolSeleccionado: -1
        }
    },
    mounted() {
        if (!this.isAdmin) {
            this.$router.push('/');
        }
        this.getRoles();
    },
    methods: {
        getRoles() {
            this.axios.get('roles', {
                headers: {
                    Authorization: `Bearer ${this.token}` // Incluye el token en el encabezado Authorization
                },
            })
                .then(response => {
                    this.roles = response.data.data;
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

<style scoped>
.container {
    width: 100%;
    margin: auto;
    max-width: 400px;
    position: relative;
}

.sombra {
    border-radius: 5px;
    box-shadow: 0 0px 0px 0 rgba(0, 0, 0, .24), 0 17px 50px 0 rgba(0, 0, 0, .19);
}

.tabs-container {
    display: flex;
}

.tabs-item {
    width: 100%;
    text-align: center;
    padding: 8px;
    cursor: pointer;
    background-color: transparent;
    color: #343a40;

}

.tab-login {
    border-radius: 5px 0px 0px 0px;
    border-color: #d0d2d4;
    border-width: 1px 1px 0px 1px;
    border-style: solid;
}

.tab-sign {
    border-radius: 0px 5px 0px 0px;
    border-color: #d0d2d4;
    border-width: 1px 1px 0px 0px;
    border-style: solid;
}

.tabs-item-active,
.tabs-item:hover {
    background-color: #007bff;
    color: #FFFFFF;
}
</style>
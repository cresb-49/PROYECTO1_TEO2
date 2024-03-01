<template>
    <div class="container">
        <h4>Administrador</h4>
        <div class="sombra">
            <SingUpComponent type-role="ADMIN"></SingUpComponent>
        </div>
    </div>
</template>

<script>
import SingUpComponent from './SingUpComponent.vue'

export default {
    name: 'RegistroAdmin',
    components: {
        SingUpComponent
    },
    data() {
        return {
            role: 'ADMIN'
        }
    },
    mounted() {
        let ver_obj = JSON.parse(localStorage.getItem('vuex'));
        let ver_auth = ver_obj.isAuthenticated;
        let ver_rol = ver_obj.role;//ADMIN USUARIO PAQUETERIA
        if (ver_auth && ver_rol === 'ADMIN') {
            //LOGICA AGREGADA
        } else {
            this.$router.push('/');
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
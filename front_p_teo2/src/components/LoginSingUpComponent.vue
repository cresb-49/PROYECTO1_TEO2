<template>
    <div class="container mt-3">
        <div class="sombra">
            <div class="tabs-container">
                <div class="tabs-item tab-login" @click="HandleTabClick(tabNames.LOGIN)"
                    :class="{ 'tabs-item-active': activeTabName === tabNames.LOGIN }">Login</div>
                <div class="tabs-item tab-sign" @click="HandleTabClick(tabNames.SINGUP)"
                    :class="{ 'tabs-item-active': activeTabName === tabNames.SINGUP }">Sign-Up</div>
            </div>
            <Component :is="currentTab" />
        </div>
    </div>
</template>
  
<script>
import LoginApp from './LoginComponent.vue';
import SingUpApp from './SingUpComponent.vue';

const tabNames = {
    LOGIN: 'login',
    SINGUP: 'singup'
}

export default {
    components: {
        // eslint-disable-next-line vue/no-unused-components
        LoginApp,
        // eslint-disable-next-line vue/no-unused-components
        SingUpApp
    },
    name: 'LoginSingUpApp',
    props: {
        // Propiedades del componente
    },
    data() {
        return {
            currentTab: LoginApp,
            activeTabName: 'login',
            tabNames,
            tabs: {
                [tabNames.LOGIN]: LoginApp,
                [tabNames.SINGUP]: SingUpApp
            }
        }
    },
    methods: {
        HandleTabClick: function (tabName) {
            this.activeTabName = tabName;
            this.currentTab = this.tabs[tabName];
        }
    },
    mounted() {
        // Código que se ejecuta cuando el componente se monta en la página
    }
}
</script>
  
<style scoped>
.container{
    width:100%;
	margin:auto;
	max-width:400px;
	position:relative;    
}

.sombra{
    border-radius: 5px;
    box-shadow:0 0px 0px 0 rgba(0,0,0,.24),0 17px 50px 0 rgba(0,0,0,.19);
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
    color:#343a40;
    
}

.tab-login{
    border-radius: 5px 0px 0px 0px;
    border-color:  	#d0d2d4;
    border-width: 1px 1px 0px 1px;
    border-style: solid;
}
.tab-sign{
    border-radius: 0px 5px 0px 0px;
    border-color:  	#d0d2d4;
    border-width: 1px 1px 0px 0px;
    border-style: solid;
}

.tabs-item-active,
.tabs-item:hover {
    background-color:#007bff;
    color:#FFFFFF;
}</style>
  
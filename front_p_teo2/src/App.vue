<template>
  <div id="contenedorHeader">
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <a class="navbar-brand textoLogo">
          <span class="celeste">Maya</span><span class="blanco">Market</span><span class="celeste">GT</span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll"
          aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarScroll">
          <ul class="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll" style="--bs-scroll-height: 100px;">
            <li class="nav-item">
              <router-link class="nav-link active" aria-current="page" to="/">Home</router-link>
            </li>
            <li class="nav-item dropdown" v-if="$store.state.isAuthenticated">
              <a class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Mi Cuenta
              </a>
              <ul class="dropdown-menu">
                <li><router-link to="/MiCuenta" class="dropdown-item">Configuracion Cuenta</router-link></li>
                <li><router-link to="/MisTransacciones" class="dropdown-item">Mis Transacciones</router-link></li>
                <li><router-link to="/CompraRetiraCreditos" class="dropdown-item">Compra y Retiro</router-link></li>
              </ul>
            </li>
            <li class="nav-item dropdown" v-if="$store.state.isAuthenticated">
              <a class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Articulos
              </a>
              <ul class="dropdown-menu">
                <li><router-link to="/MisArticulos" class="dropdown-item">Mis Articulos</router-link></li>
                <li><router-link to="/NuevoArticulo" class="dropdown-item">Crear Articulo</router-link></li>
                <li><router-link to="/CrearPublicacion" class="dropdown-item">Crear Publicacion</router-link></li>
              </ul>
            </li>
            <li class="nav-item dropdown" v-if="$store.state.isAuthenticated && $store.state.role === 'ADMIN'">
              <a class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Empleados
              </a>
              <ul class="dropdown-menu">
                <li><router-link to="/RegistroEmpleado" class="dropdown-item">Registro Empleado Paqueteria</router-link>
                </li>
                <li><router-link to="/RegistroAdmin" class="dropdown-item">Registro Adminitrador</router-link></li>
                <li><router-link to="/Empleados" class="dropdown-item">Modificacion Empleados</router-link></li>
              </ul>
            </li>
            <li class="nav-item">
              <router-link v-if="$store.state.isAuthenticated && $store.state.role === 'USUARIO'"
                class="nav-link active" aria-current="page" to="/CreditCard">Agregar Tarjeta</router-link>
            </li>
            <li class="nav-item">
              <router-link v-if="$store.state.isAuthenticated && $store.state.role === 'ADMIN'" class="nav-link active"
                aria-current="page" to="/Reportes">Reportes</router-link>
            </li>
            <li class="nav-item">
              <router-link v-if="$store.state.isAuthenticated && $store.state.role === 'PAQUETERIA'"
                class="nav-link active" aria-current="page" to="/AceptarArticulo">Aceptar Producto</router-link>
            </li>
            <li class="nav-item">
              <router-link v-if="$store.state.isAuthenticated && $store.state.role === 'PAQUETERIA'"
                class="nav-link active" aria-current="page" to="/CambiarEstado">Cambiar Estado</router-link>
            </li>
          </ul>
          <div style="margin-right: 10px;">
            <ul class="navbar-nav my-2 my-lg-0 navbar-nav-scroll" style="--bs-scroll-height: 100px;">
              <router-link to="/Carrito" v-if="$store.state.isAuthenticated && $store.state.role === 'USUARIO'"
                class="btn btn-outline-success material-icons"><span class="">shopping_cart</span></router-link>
            </ul>
          </div>
          <div>
            <ul class="navbar-nav my-2 my-lg-0 navbar-nav-scroll" style="--bs-scroll-height: 100px;">
              <router-link v-if="!$store.state.isAuthenticated" class="btn btn-outline-success"
                to="/Login">Login</router-link>
            </ul>
          </div>
          <div>
            <ul class="navbar-nav my-2 my-lg-0 navbar-nav-scroll" style="--bs-scroll-height: 100px;">
              <a v-if="$store.state.isAuthenticated" @click="$store.commit('logout')"
                class="btn btn-outline-success">Logout</a>
            </ul>
          </div>

        </div>
      </div>
    </nav>
  </div>

  <div class="container ventanaPrincipal">
    <router-view></router-view>
  </div>

  <div class="contenedor">
    <div class="blockcode">
      <footer class="page-footer shadow">
        <div class="d-flex flex-column mx-auto py-5" style="width: 80%">
          <div class="d-flex flex-wrap justify-content-between">
            <div>
              <a href="/" class="d-flex align-items-center p-0 text-dark">
                <img alt="logo" src="./assets/logo.png" width="30px" />
                <span class="ms-3 h5 font-weight-bold">MayaMarketGT</span>
              </a>
              <p class="my-3" style="width: 250px">
                Somos la pagina mas segura de compra y venta del pais, pioneros en el estandar de envio y manejo de
                paquetes, si tienes algo que vender
                MayaMarketGT es la mejor opcion
              </p>
            </div>
            <div>
              <p class="h5 mb-4" style="font-weight: 600">Help</p>
              <ul class="p-0" style="list-style: none; cursor: pointer">
                <li class="my-2">
                  <router-link v-if="!$store.state.isAuthenticated" class="text-dark" to="/Login">Login</router-link>
                  <a v-if="$store.state.isAuthenticated" @click="$store.commit('logout')" class="text-dark">Logout</a>
                </li>
              </ul>
            </div>
          </div>
          <small class="text-center mt-5">&copy; MayaMarketGT, 2023. All rights reserved.</small>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped>
#contenedorHeader {
  padding-bottom: 1%;
  padding-top: 1%;
  padding-left: 2%;
  padding-right: 2%;
  background: #bfff00;
}

.ventanaPrincipal {
  min-height: 550px;
}

.textoLogo {
  font-size: 30px;
  font-weight: bold;
}

div,
ul,
li {
  font-size: 20px;
}

.contenedor {
  margin-left: 1%;
  margin-right: 1%;
  margin-top: 20px;
  margin-bottom: 1%;
  background: #bfff00;
}

.textoLogo {
  /* border: 1px solid white; */
  /* Borde blanco */
  padding: 2px 5px;
  /* Espaciado interno */
  text-decoration: none;
  /* Quita la subrayado predeterminado de los enlaces */
  font-weight: bold;
  /* Texto en negrita */
}

.textoLogo .celeste {
  color: #007bff;
  /* Color celeste */
}

.textoLogo .blanco {
  color: white;
  /* Color blanco */
}
</style>
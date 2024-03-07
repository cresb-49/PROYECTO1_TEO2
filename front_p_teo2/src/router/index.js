import { createWebHistory, createRouter } from "vue-router";
import LoginSingUpComponent from '../components/LoginSingUpComponent.vue';
import VistaArticulosCoponent from '../components/VistaArticulosComponent';
import NuevoArticuloComponent from '../components/NuevoArticuloComponent.vue'
import EstadoCompraComponent from '../components/EstadoCompraComponent.vue'
import CarritoComponent from '../components/CarritoComponent.vue'
import RegistroAdministradorComponent from '../components/RegistroAdministradorComponent.vue'
import RegistroEmpleadoComponent from '../components/RegistroEmpleadoComponent.vue'
import ReportesComponent from '../components/ReportesComponent.vue'
import VerArticuloComponent from '../components/VerArticuloComponent.vue';
import ListaVentasComponent from '../components/ListaVentasComponent.vue';
import ListaArticulosEntradaComponent from '../components/ListaArticulosEntradaComponent.vue';
import CambiarEstadoComponent from '../components/CambiarEstadoComponent.vue';
import VerificarArticuloComponene from '../components/VerificarArticuloComponene.vue';
import ListaArticulosUsuario from '../components/ListaArticulosUsuario.vue';
import ModificarArticulo from '../components/ModificarArticulo.vue';
import ModificarUsuarioComponent from '../components/ModificarUsuarioComponent.vue';
import ListaUsuariosSistema from '../components/ListaUsuariosSistema.vue';
import MiCuentaComponent from '../components/MiCuentaComponent.vue';
import MisTransaccionesComponent from '../components/MisTransaccionesComponent.vue';
import CompraRetiraCreditosComponent from "@/components/CompraRetiraCreditosComponent.vue";
import CrearPublicacionComponent from "@/components/CrearPublicacionComponent.vue";
const routes = [
    {
        path: '/',
        name: 'VistaProductosCoponent',
        component: VistaArticulosCoponent
    },
    {
        path: '/MiCuenta',
        name: 'MiCuentaComponent',
        component: MiCuentaComponent
    },
    {
        path: '/MisTransacciones',
        name: 'MisTransaccionesComponent',
        component: MisTransaccionesComponent
    },
    {
        path: '/CrearPublicacion',
        name: 'CrearPublicacionComponent',
        component: CrearPublicacionComponent
    },
    {
        path: '/CompraRetiraCreditos',
        name: 'CompraRetiraCreditosComponent',
        component: CompraRetiraCreditosComponent
    },
    {
        path: '/Login',
        name: 'LoginSingUpComponent',
        component: LoginSingUpComponent
    },
    {
        path: '/NuevoArticulo',
        name: 'NuevoArticuloComponent',
        component: NuevoArticuloComponent
    },
    {
        path: '/Seguimiento',
        name: 'EstadoCompra',
        component: EstadoCompraComponent
    },
    {
        path: '/RegistroEmpleado',
        name: 'RegistroEmpleado',
        component: RegistroEmpleadoComponent
    },
    {
        path: '/RegistroAdmin',
        name: 'RegistroAdmin',
        component: RegistroAdministradorComponent
    },
    {
        path: '/Carrito',
        name: 'CarritoCompra',
        component: CarritoComponent
    },
    {
        path: '/Reportes',
        name: 'Reportes',
        component: ReportesComponent
    },
    {
        path: '/Articulo/:id',
        name: 'Articulo',
        component: VerArticuloComponent,
        props: true
    },
    {
        path: '/AceptarArticulo',
        name: 'AceptarArticulo',
        component: ListaArticulosEntradaComponent
    },
    {
        path: '/CambiarEstado',
        name: 'CambiarEstado',
        component: ListaVentasComponent
    },
    {
        path: '/ModificarEstado/:id',
        name: 'ModificarEstado',
        props: true,
        component: CambiarEstadoComponent
    },
    {
        path: '/VerificarArticulo/:id',
        name: 'VerificarArticulo',
        component: VerificarArticuloComponene,
        props: true
    },
    {
        path: '/MisArticulos',
        name: 'MisArticulos',
        component: ListaArticulosUsuario
    },
    {
        path: '/ModificarArticulo/:id',
        name: 'ModificarArticulo',
        props: true,
        component: ModificarArticulo
    },
    {
        path: '/ModificarUsuario/:id',
        name: 'ModificarUsuario',
        props: true,
        component: ModificarUsuarioComponent
    },
    {
        path: '/Empleados',
        name: 'ListaEmpleados',
        component: ListaUsuariosSistema
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
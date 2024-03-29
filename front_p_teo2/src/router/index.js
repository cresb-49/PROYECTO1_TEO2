import { createWebHistory, createRouter } from "vue-router";
import LoginSingUpComponent from '../components/LoginSingUpComponent.vue';
import VistaArticulosCoponent from '../components/VistaArticulosComponent';
import NuevoArticuloComponent from '../components/NuevoArticuloComponent.vue'
import EstadoCompraComponent from '../components/EstadoCompraComponent.vue'
import CarritoComponent from '../components/CarritoComponent.vue'
import RegistroUsuarioRol from '../components/RegistroUsuarioRol.vue'
import VerArticuloComponent from '../components/VerPublicacionComponent.vue';
import ListaVentasComponent from '../components/ListaVentasComponent.vue';
import AceptarPublicacionesEntrantes from '../components/AceptarPublicacionesEntrantes.vue';
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
import ListaComprasComponent from "@/components/ListaComprasComponent.vue";
import AceptarIntercambioComponent from "@/components/AceptarIntercambioComponent.vue";
import ChatComponent from "@/components/ChatComponent.vue"
import ReportesPublicacionComponent from "@/components/ReportesPublicacionComponent.vue";
import TerminarTrabajosVoluntariados from "@/components/TerminarTrabajosVoluntariados.vue";
import AceptarSolicitudVoluntariadoTrabajoComponent from "@/components/AceptarSolicitudVoluntariadoTrabajoComponent.vue";
import CancelarIntercambio from "@/components/CancelarIntercambioComponent.vue";
import CancelarSolicitudVoluntariadoTrabajoComponent from "@/components/CancelarSolicitudVoluntariadoTrabajoComponent.vue";
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
        path: '/RegistroUsuarioRol',
        name: 'RegistroUsuarioRol',
        component: RegistroUsuarioRol
    },
    {
        path: '/Carrito',
        name: 'CarritoCompra',
        component: CarritoComponent
    },
    {
        path: '/Publicacion/:id',
        name: 'Publicacion',
        component: VerArticuloComponent,
        props: true
    },
    {
        path: '/AceptarArticulo',
        name: 'AceptarArticulo',
        component: AceptarPublicacionesEntrantes
    },
    {
        path: '/ListaVentas',
        name: 'ListaVentas',
        component: ListaVentasComponent
    },
    {
        path: '/ListaCompras',
        name: 'ListaCompras',
        component: ListaComprasComponent
    },
    {
        path: '/AceptarIntercambio',
        name: 'AceptarIntercambio',
        component: AceptarIntercambioComponent
    },
    {
        path: '/CancelarIntercambio',
        name: 'CancelarIntercambio',
        component: CancelarIntercambio
    },
    {
        path: '/AceptarTrabajoVoluntariado',
        name: 'AceptarTrabajoVoluntariado',
        component: AceptarSolicitudVoluntariadoTrabajoComponent
    },
    {
        path: '/CancelarTrabajoVoluntariado',
        name: 'CancelarTrabajoVoluntariado',
        component: CancelarSolicitudVoluntariadoTrabajoComponent
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
    },
    {
        path: '/Chat',
        name: 'Chat',
        component: ChatComponent
    },
    {
        path: '/ReportesPublicacion',
        name: 'ReportesPublicacion',
        component: ReportesPublicacionComponent
    },
    {
        path: '/FinTrabajoVoluntariado',
        name: 'FinTrabajoVoluntariado',
        component: TerminarTrabajosVoluntariados
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
<template>
    <div>
        <DialogVue :show='show' tittle="Eliminar Tarjeta" description="Desea confinuar con la eliminacion" :cancel="cancel"
            :confirm="eliminarCard"></DialogVue>
        <div>
            <h1>Tarjetas Agregadas</h1>
        </div>
        <div>
            <table class="table" aria-describedby="Tarjetas usuario">
                <thead>
                    <tr>
                        <th>Propietario</th>
                        <th>Número</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for=" card in    tarjetas   " v-bind:key="card">
                        <tr>
                            <td>{{ card.propietario }}</td>
                            <td>{{ card.numero }}</td>
                            <td><button @click="this.show = true; this.cardDelete = card.numero"
                                    class="btn btn-danger btn-sm" type="button">Eliminar</button></td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
        <div class="creditCardForm">
            <div class="heading">
                <h3>Nueva Trajeta</h3>
            </div>
            <div class="payment">
                <form @submit.prevent=" enviarTrajeta ">
                    <div class="form-group owner">
                        <label for="owner">Propietario</label>
                        <input type="text" class="form-control" id="owner" v-model=" propietario " required>
                    </div>
                    <div class="form-group CVV">
                        <label for="cvv">CVV</label>
                        <input type="text" class="form-control" id="cvv" v-model=" ccv " required>
                    </div>
                    <div class="form-group" id="card-number-field">
                        <label for="cardNumber">Numero de la Tarjeta</label>
                        <input type="text" class="form-control" id="cardNumber" v-model=" numero " required>
                    </div>
                    <div class="form-group" id="expiration-date">
                        <label>Fecha de Vencimiento</label>
                        <select @change=" asignarMes ">
                            <option value="01">Enero</option>
                            <option value="02">Febrero</option>
                            <option value="03">Marzo</option>
                            <option value="04">Abril</option>
                            <option value="05">Mayo</option>
                            <option value="06">Junio</option>
                            <option value="07">Julio</option>
                            <option value="08">Agosto</option>
                            <option value="09">Septiembre</option>
                            <option value="10">Octubre</option>
                            <option value="11">Noviembre</option>
                            <option value="12">Diciembre</option>
                        </select>
                        <select @change=" asignarYear ">
                            <option value="2023"> 2023</option>
                            <option value="2024"> 2024</option>
                            <option value="2025"> 2025</option>
                            <option value="2026"> 2026</option>
                            <option value="2027"> 2027</option>
                            <option value="2028"> 2028</option>
                            <option value="2029"> 2029</option>
                        </select>
                    </div>
                    <div class="form-group" id="credit_cards">
                        <img src="" id="visa" alt="visa">
                        <img src="" id="mastercard" alt="mastecard">
                        <img src="" id="amex" alt="amex">
                    </div>
                    <div class="form-group" id="pay-now">
                        <button type="submit" class="btn btn-default" id="confirm-purchase">Agregar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import DialogVue from './Dialog.vue'
export default {
    name: 'AddCard',
    components: {
        DialogVue
    },
    data() {
        return {
            nombreUsuario: null,
            tarjetas: [],
            propietario: null,
            numero: null,
            ccv: null,
            mes: '01',
            year: '2023',
            show: false,
            cardDelete: null
        }
    },
    mounted() {
        let ver_obj = JSON.parse(localStorage.getItem('vuex'));
        let ver_auth = ver_obj.isAuthenticated;
        let ver_rol = ver_obj.role;
        if (ver_auth && ver_rol === 'USUARIO') {
            const vu = this;
            vu.nombreUsuario = vu.$store.state.user;
            //Obtener la tarjetas de los usuarios ingresados
            const payload = {
                usuario: vu.nombreUsuario
            }
            this.axios.post('/api/usuario/cards', payload)
                .then(response => {
                    vu.tarjetas = response.data.card;
                })
                .catch(response => {
                    toast.error(response.response.data.error)
                });
        } else {
            this.$router.push('/');
        }
    },
    methods: {
        asignarMes(e) {
            this.mes = e.target.value;
        },
        asignarYear(e) {
            this.year = e.target.value;
        },
        enviarTrajeta() {
            let vu = this;
            const regex = /^\d{16}$/;
            if (regex.test(vu.numero)) {
                const regexcvv = /^\d{3}$/;
                if (regexcvv.test(vu.ccv)) {
                    const card = {
                        numero: vu.numero,
                        propietario: vu.propietario,
                        ccv: vu.ccv,
                        mes: vu.mes,
                        year: vu.year
                    }
                    const payload = {
                        usuario: vu.nombreUsuario,
                        card: card
                    }
                    this.axios.post('/api/usuario/newcard', payload)
                        .then(response => {
                            vu.tarjetas = response.data;
                            toast.success('Se agrego con exito la tarjeta')
                        })
                        .catch(response => {
                            toast.error(response.response.data.error)
                        })
                } else {
                    toast.error('El cvv debe ser de 3 digitos');
                }
            } else {
                toast.error('Las tarjetas de credito deben de tener 16 digitos');
            }
        },
        eliminarCard() {
            let vu = this;
            let card = this.cardDelete;
            console.log(card);
            if (card != null) {
                const payload = {
                    user: vu.nombreUsuario,
                    card: card,
                }
                this.axios.delete('/api/usuario/card', { data: payload })
                    .then(response => {
                        vu.tarjetas = response.data
                        toast.success('Se elimino con exito la tarjeta');
                    })
                    .catch(response => {
                        toast.error(response.response.data.error);
                    })
            }
            this.show = false;
        },
        cancel() {
            this.show = false;
            this.cardDelete = null;
        }
    }
}
</script>

<style scoped>
.creditCardForm {
    max-width: 700px;
    background-color: #fff;
    margin: 100px auto;
    overflow: hidden;
    padding: 25px;
    color: #4c4e56;
}

.creditCardForm label {
    width: 100%;
    margin-bottom: 10px;
}

.creditCardForm .heading h3 {
    text-align: center;
    font-family: 'Open Sans', sans-serif;
    color: #4c4e56;
}

.creditCardForm .payment {
    float: left;
    font-size: 18px;
    padding: 10px 25px;
    margin-top: 20px;
    position: relative;
}

.creditCardForm .payment .form-group {
    float: left;
    margin-bottom: 15px;
}

.creditCardForm .payment .form-control {
    line-height: 40px;
    height: auto;
    padding: 0 16px;
}

.creditCardForm .owner {
    width: 63%;
    margin-right: 10px;
}

.creditCardForm .CVV {
    width: 35%;
}

.creditCardForm #card-number-field {
    width: 100%;
}

.creditCardForm #expiration-date {
    width: 49%;
}

.creditCardForm #credit_cards {
    width: 50%;
    margin-top: 25px;
    text-align: right;
}

.creditCardForm #pay-now {
    width: 100%;
    margin-top: 25px;
}

.creditCardForm .payment .btn {
    width: 100%;
    margin-top: 3px;
    font-size: 24px;
    background-color: #2ec4a5;
    color: white;
}

.creditCardForm .payment select {
    padding: 10px;
    margin-right: 15px;
}

.transparent {
    opacity: 0.2;
}

@media(max-width: 650px) {

    .creditCardForm .owner,
    .creditCardForm .CVV,
    .creditCardForm #expiration-date,
    .creditCardForm #credit_cards {
        width: 100%;
    }

    .creditCardForm #credit_cards {
        text-align: left;
    }
}
</style>
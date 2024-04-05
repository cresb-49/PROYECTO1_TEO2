<template>
    <div class="mt-4 col-12">
        <h2>Chat</h2>
        <div class="row">
            <div class="col-4">
                <div class="direct-chat-contacts" style="max-height: 665px; overflow-y: auto;">
                    <form @submit.prevent="buscarContactos">
                        <div class="input-group mb-3">
                            <input type="text" id="searchInput" class="form-control" placeholder="Buscar contacto..."
                                v-model="email_name">
                            <div class="input-group-append">
                                <button class="btn btn-outline-primary" type="sumbit" id="searchButton"
                                    style="margin-left: 10px;">Buscar</button>
                            </div>
                        </div>
                    </form>

                    <div class="mb-3 bnt-chat-container">
                        <button type="button" class="btn btn-primary" style="flex: 1; margin-right: 5px;"
                            @click="verChats = true">Chats</button>
                        <button type="button" class="btn btn-primary" style="flex: 1; margin-left: 5px;"
                            @click="verChats = false">Contactos</button>
                    </div>


                    <div class="list-group" v-if="verChats">
                        <a class="list-group-item list-group-item-action" v-for="chat in chats" v-bind:key="chat"
                            @click="abrirChat(chat)">
                            <!-- <img class="contacts-list-img" src="dist/img/user1-128x128.jpg" alt="User Avatar"> -->
                            <div class="d-flex w-100 justify-content-between align-items-center">
                                <h5 class="mb-1">{{ nombreMostrar(chat) }}</h5>
                                <small>{{ formatDate(chat.updated_at) }}</small>
                                <button class="btn btn btn-outline-danger material-icons"
                                    @click.stop="eliminarChat(chat)">
                                    <small>
                                        <span>delete</span>
                                    </small>
                                </button>
                                <!-- <small>2/28/2015</small> -->
                            </div>
                            <!-- <p class="mb-1">How have you been? I was...</p> -->
                        </a>
                    </div>
                    <div class="list-group" v-else>
                        <a class="list-group-item list-group-item-action" v-for="contacto in contactos"
                            v-bind:key="contacto" @click="crearChat(contacto)">
                            <!-- <img class="contacts-list-img" src="dist/img/user1-128x128.jpg" alt="User Avatar"> -->
                            <div class="d-flex w-100 justify-content-between">
                                <!-- <h5 class="mb-1">Usuaro Contacto</h5> -->
                                <h5 class="mb-1">{{ contacto.nombres }} {{ contacto.apellidos }}</h5>
                                <!-- <small>2/28/2015</small> -->
                            </div>
                            <!-- <p class="mb-1">How have you been? I was...</p> -->
                            <p class="mb-1">
                                <small class="view_email">
                                    {{ contacto.email }}
                                </small>
                            </p>
                        </a>
                    </div>
                </div>
            </div>
            <div class="col-8">
                <div class="card direct-chat direct-chat-primary">
                    <div class="card-header">
                        <!-- <h3 class="card-title">Chat de Sarah Bullock </h3> -->
                        <h3 class="card-title"> Mensaje Directo con {{ current_chat.other_user.nombres + " " +
                        current_chat.other_user.apellidos }}</h3>
                    </div>
                    <!-- /.card-header -->
                    <div class="card-body" style="max-height: 550px; height: 550px; overflow-y: auto;">
                        <!-- Conversations are loaded here -->
                        <div class="d-flex flex-column">
                            <template v-for="message in current_chat.messages" v-bind:key="message">
                                <div class="message-bubble"
                                    :class="message.id_usuario === current_chat.current_user.id ? 'message-bubble-right' : 'message-bubble-left'">
                                    <div style="white-space: pre-wrap;">
                                        {{ message.text }}
                                    </div>
                                    <span class="float-right">
                                        <small style="font-size: 13px;">
                                            {{ formatDate(message.created_at) }}
                                        </small>
                                    </span>
                                </div>
                            </template>
                        </div>
                        <!--/.direct-chat-messages-->
                        <!-- /.direct-chat-pane -->
                    </div>
                    <!-- /.card-body -->
                    <div class="card-footer">
                        <form @submit.prevent="sendMessage">
                            <div class="input-group">
                                <input type="text" name="message" placeholder="Type Message ..." class="form-control"
                                    v-model="message_send">
                                <span class="input-group-append">
                                    <button type="submit" class="btn btn-outline-primary">Send</button>
                                </span>
                            </div>
                        </form>
                    </div>
                    <!-- /.card-footer-->
                </div>
            </div>
        </div>
    </div>
    <Dialog :show="dialog.show" :cancel="closeDialog" :tittle="dialog.title" :description="dialog.description"
        :confirm="dialog.action"></Dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import { toast } from 'vue3-toastify';
import Dialog from '@/components/Dialog.vue'
export default {
    name: 'ChatComponent',
    computed: {
        ...mapGetters(['isUser', 'isAdmin', 'isConfirm', 'isAuth', 'token', 'idUser']),
    },
    components: {
        Dialog
    },
    data() {
        return {
            chats: [],
            contactos: [],
            verChats: true,
            email_name: "",
            message_send: "",
            current_chat: {
                id: -1,
                current_user: {
                    id: -1,
                    nombres: "",
                    apellidos: ""
                },
                other_user: {
                    id: -1,
                    nombres: "",
                    apellidos: ""
                },
                messages: []
            },
            dialog: {
                show: false,
                title: "Eliminar Chat",
                description: "¿Está seguro que desea eliminar el chat?",
                action: null
            },
            intervalID: null
        }
    },
    mounted() {
        this.getChatsDisponibles();
    },
    methods: {
        getChatsDisponibles() {
            this.axios.get('chats', {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            }).then(response => {
                const data = response.data.data;
                this.chats = data;
                this.current_chat = {
                    id: -1,
                    current_user: {
                        id: -1,
                        nombres: "",
                        apellidos: ""
                    },
                    other_user: {
                        id: -1,
                        nombres: "",
                        apellidos: ""
                    },
                    messages: []
                }
            }).catch(error => {
                console.log(error.response);
                toast.error(error.response.data.error);
                let errores = error.response.data.errores;
                for (let error of errores) {
                    toast.error(error);
                }
            });
        },
        buscarContactos() {
            this.axios.post('chat/contacto',
                {
                    email_name: this.email_name
                },
                {
                    headers:
                    {
                        Authorization: `Bearer ${this.token}`
                    }
                }).then(response => {
                    let data = response.data.data
                    console.log(response);
                    console.log(data);
                    if (data.length > 0) {
                        this.verChats = false;
                        this.contactos = data;
                    } else {
                        this.verChats = true;
                        this.contactos = [];
                    }
                }).catch(error => {
                    console.log(error.response);
                    toast.error(error.response.data.error);
                    let errores = error.response.data.errores;
                    for (let error of errores) {
                        toast.error(error);
                    }
                });
        },
        crearChat(usuario) {
            console.log(usuario);
            this.axios.post('/chat', {
                id_usuario_2: usuario.id
            }, {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            }).then(response => {
                console.log(response);
                this.verChats = true;
                this.getChatsDisponibles();
            }).catch(error => {
                console.log(error.response);
                toast.error(error.response.data.error);
                let errores = error.response.data.errores;
                for (let error of errores) {
                    toast.error(error);
                }
            });
        },
        abrirChat(chat) {
            console.log(chat);
            this.current_chat.id = chat.id;
            this.current_chat.chat = chat;
            if (chat.id_usuario_1 === this.idUser) {
                this.current_chat.current_user = {
                    id: chat.usuario_1.id,
                    nombres: chat.usuario_1.nombres,
                    apellidos: chat.usuario_1.apellidos
                };
                this.current_chat.other_user = {
                    id: chat.usuario_2.id,
                    nombres: chat.usuario_2.nombres,
                    apellidos: chat.usuario_2.apellidos
                };
            } else {
                this.current_chat.current_user = {
                    id: chat.usuario_2.id,
                    nombres: chat.usuario_2.nombres,
                    apellidos: chat.usuario_2.apellidos
                };
                this.current_chat.other_user = {
                    id: chat.usuario_1.id,
                    nombres: chat.usuario_1.nombres,
                    apellidos: chat.usuario_1.apellidos
                };
            }
            this.getMessagesOfChat(chat);
            this.actulizacionChat();
        },
        getMessagesOfChat(chat) {
            this.axios.post('chat/mensajes', {
                id_chat: chat.id
            }, {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            }).then(response => {
                console.log(response);
                this.current_chat.messages = response.data.data;
            }).catch(error => {
                console.log(error.response);
                toast.error(error.response.data.error);
                let errores = error.response.data.errores;
                for (let error of errores) {
                    toast.error(error);
                }
            });
        },
        formatDate(date) {
            const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
            return new Date(date).toLocaleString('es-ES', options);
        },
        nombreMostrar(chat) {
            if (chat.id_usuario_1 === this.idUser) {
                return chat.usuario_2.nombres + " " + chat.usuario_2.apellidos;
            } else {
                return chat.usuario_1.nombres + " " + chat.usuario_1.apellidos;
            }
        },
        sendMessage() {
            let message = this.message_send;
            this.message_send = "";
            this.axios.post('chat/send', {
                id_chat: this.current_chat.id,
                mensaje: message
            }, {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            }).then(response => {
                console.log(response);
                this.current_chat.messages.push(response.data.data);
            }).catch(error => {
                console.log(error.response);
                toast.error(error.response.data.error);
                let errores = error.response.data.errores;
                for (let error of errores) {
                    toast.error(error);
                }
            });
        },
        eliminarChat(chat) {
            this.dialog.show = true;
            this.dialog.action = () => this.deleteChat(chat);
        },
        closeDialog() {
            this.dialog.show = false;
            this.dialog.action = null;
        },
        deleteChat(chat) {
            this.axios.delete('chat/' + chat.id, {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            }).then((response) => {
                this.dialog.show = false;
                toast.success(response.data.mensaje);
                this.getChatsDisponibles();
            }).catch(error => {
                console.log(error.response);
                toast.error(error.response.data.error);
                let errores = error.response.data.errores;
                for (let error of errores) {
                    toast.error(error);
                }
            });
        },
        actulizacionChat() {
            this.intervalID = setInterval(() => {
                if (this.current_chat.id !== undefined || this.current_chat.id !== null || this.current_chat.id !== -1)
                    this.getMessagesOfChat(this.current_chat)
            }, 2000);
        },
        stopActulizacionChat() {
            if (this.intervalID !== null)
                clearInterval(this.intervalID);
        }
    },
    beforeUnmount() {
        this.stopActulizacionChat();
    }
}
</script>

<style scoped>
.chat-container {
    max-width: 500px;
    margin: auto;
}

.message-bubble {
    border-radius: 20px;
    padding: 10px 20px;
    margin-bottom: 10px;
    max-width: 70%;
}

.message-bubble-right {
    background-color: #007bff;
    color: white;
    align-self: flex-end;
}

.message-bubble-left {
    background-color: #f0f0f0;
    color: black;
    align-self: flex-start;
}

.view_email {
    font-size: 15px;
}

.bnt-chat-container {
    display: flex;
    width: 100%;
}
</style>
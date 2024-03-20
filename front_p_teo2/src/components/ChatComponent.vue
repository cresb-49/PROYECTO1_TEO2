<template>
    <div class="mt-4 col-12">
        <h2>Chat</h2>
        <div class="row">
            <div class="col-4">
                <div class="direct-chat-contacts" style="max-height: 665px; overflow-y: auto;">
                    <div class="input-group mb-3">
                        <input type="text" id="searchInput" class="form-control" placeholder="Buscar contacto...">
                        <div class="input-group-append">
                            <button class="btn btn-outline-primary" type="button" id="searchButton">Buscar</button>
                        </div>
                    </div>
                    <div class="list-group">
                        <a href="#" class="list-group-item list-group-item-action">
                            <!-- <img class="contacts-list-img" src="dist/img/user1-128x128.jpg" alt="User Avatar"> -->
                            <div class="d-flex w-100 justify-content-between">
                                <h5 class="mb-1">Count Dracula</h5>
                                <small>2/28/2015</small>
                            </div>
                            <p class="mb-1">How have you been? I was...</p>
                        </a>

                        <a href="#" class="list-group-item list-group-item-action">
                            <div class="d-flex w-100 justify-content-between">
                                <h5 class="mb-1">Sarah Doe</h5>
                                <small>2/23/2015</small>
                            </div>
                            <p class="mb-1">I will be waiting for...</p>
                        </a>

                        <a href="#" class="list-group-item list-group-item-action">
                            <div class="d-flex w-100 justify-content-between">
                                <h5 class="mb-1">Nadia Jolie</h5>
                                <small>2/20/2015</small>
                            </div>
                            <p class="mb-1">I'll call you back at...</p>
                        </a>

                        <a href="#" class="list-group-item list-group-item-action">
                            <div class="d-flex w-100 justify-content-between">
                                <h5 class="mb-1">Nora S. Vans</h5>
                                <small>2/10/2015</small>
                            </div>
                            <p class="mb-1">Where is your new...</p>
                        </a>

                        <a href="#" class="list-group-item list-group-item-action">
                            <div class="d-flex w-100 justify-content-between">
                                <h5 class="mb-1">John K.</h5>
                                <small>1/27/2015</small>
                            </div>
                            <p class="mb-1">Can I take a look at...</p>
                        </a>

                        <a href="#" class="list-group-item list-group-item-action">
                            <div class="d-flex w-100 justify-content-between">
                                <h5 class="mb-1">Kenneth M.</h5>
                                <small>1/4/2015</small>
                            </div>
                            <p class="mb-1">Never mind I found...</p>
                        </a>
                    </div>
                </div>
            </div>
            <div class="col-8">
                <div class="card direct-chat direct-chat-primary">
                    <div class="card-header">
                        <h3 class="card-title">Chat de Sarah Bullock </h3>
                    </div>
                    <!-- /.card-header -->
                    <div class="card-body" style="max-height: 550px; overflow-y: auto;">
                        <!-- Conversations are loaded here -->
                        <div class="d-flex flex-column">
                            <div class="message-bubble message-bubble-right">
                                <div>
                                    Mensaje del usuario
                                </div>
                                <span class="float-right">
                                    <small style="font-size: 13px;">
                                        23 Jan 6:10 pm
                                    </small>
                                </span>
                            </div>
                            <div class="message-bubble message-bubble-left">
                                <div>
                                    Mensaje del otro usuario
                                </div>
                                <span class="float-right">
                                    <small style="font-size: 13px;">
                                        23 Jan 6:10 pm
                                    </small>
                                </span>
                            </div>
                            <div class="message-bubble message-bubble-right">
                                <div>
                                    Otro mensaje del usuario
                                </div>
                                <span class="float-right">
                                    <small style="font-size: 13px;">
                                        23 Jan 6:10 pm
                                    </small>
                                </span>
                            </div>
                            <div class="message-bubble message-bubble-left">
                                <div>
                                    Mensaje del otro usuario
                                </div>
                                <span class="float-right">
                                    <small style="font-size: 13px;">
                                        23 Jan 6:10 pm
                                    </small>
                                </span>
                            </div>
                            <div class="message-bubble message-bubble-right">
                                <div>
                                    Otro mensaje del usuario
                                </div>
                                <span class="float-right">
                                    <small style="font-size: 13px;">
                                        23 Jan 6:10 pm
                                    </small>
                                </span>
                            </div>
                            <div class="message-bubble message-bubble-left">
                                <div>
                                    Mensaje del otro usuario
                                </div>
                                <span class="float-right">
                                    <small style="font-size: 13px;">
                                        23 Jan 6:10 pm
                                    </small>
                                </span>
                            </div>
                            <div class="message-bubble message-bubble-right">
                                <div>
                                    Otro mensaje del usuario
                                </div>
                                <span class="float-right">
                                    <small style="font-size: 13px;">
                                        23 Jan 6:10 pm
                                    </small>
                                </span>
                            </div>
                            <div class="message-bubble message-bubble-left">
                                <div>
                                    Mensaje del otro usuario
                                </div>
                                <span class="float-right">
                                    <small style="font-size: 13px;">
                                        23 Jan 6:10 pm
                                    </small>
                                </span>
                            </div>
                            <div class="message-bubble message-bubble-right">
                                <div>
                                    Otro mensaje del usuario
                                </div>
                                <span class="float-right">
                                    <small style="font-size: 13px;">
                                        23 Jan 6:10 pm
                                    </small>
                                </span>
                            </div>

                        </div>
                        <!--/.direct-chat-messages-->
                        <!-- /.direct-chat-pane -->
                    </div>
                    <!-- /.card-body -->
                    <div class="card-footer">
                        <form action="#" method="post">
                            <div class="input-group">
                                <input type="text" name="message" placeholder="Type Message ..." class="form-control">
                                <span class="input-group-append">
                                    <button type="button" class="btn btn-outline-primary">Send</button>
                                </span>
                            </div>
                        </form>
                    </div>
                    <!-- /.card-footer-->
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
    name: 'ChatComponent',
    computed: {
        ...mapGetters(['isUser', 'isAdmin', 'isConfirm', 'isAuth', 'token']),
    },
    data() {
        return {
            chats: [],
            contactos: [],
        }
    },
    mounted() {
        this.getChatsDisponibles();
    },
    methods: {
        getChatsDisponibles() {
            console.log(this.token);
            this.axios.get('', {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            }).then(response => {
                console.log(response.data);
                this.chats = response.data;
            }).catch(error => {
                console.log(error);
            });
        }
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
</style>
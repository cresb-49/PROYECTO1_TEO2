<template>
    <div class="mt-4 col-12">
        <h2>Chat</h2>
        <div class="row">
            <div class="col-3">
                
            </div>
            <div class="col-9">

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
            chats: []
        }
    },
    mounted() {
        this.getChatsDisponibles();
    },
    methods: {
        getChatsDisponibles() {
            console.log(this.token);
        }
    }
}
</script>

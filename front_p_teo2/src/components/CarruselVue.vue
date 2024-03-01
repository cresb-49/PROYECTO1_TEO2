<template>
    <div>
        <div>
            <template v-for="(articulo, index) in arts" :key="articulo">
                <div :id="articulo._id" v-show="state[index]">
                    <img :src="'http://localhost:3000/ecommercegt/img?id=' + articulo._id" :alt="articulo._id"
                        class="img-fluid">
                </div>
            </template>
        </div>
        <template v-if="this.arts.length>1" >
            <div class="contenedor-botones">
                <button @click="siguiente" class="btn btn-control">Anterior</button>
                <button @click="anterior" class="btn btn-control">Siguiente</button>
            </div>
        </template>
    </div>
</template>
<script>
export default {
    props: ['articulos'],
    data() {
        return {
            arts: this.articulos,
            state: [true],
            currenImg: 0
        }
    },
    mounted() {
        let vu = this;
        for (let index = 1; index < this.arts.length; index++) {
            vu.state.push(false);
        }
    },
    methods: {
        siguiente() {
            this.state[this.currenImg]=false;
            let t = this.arts.length - 1;
            this.currenImg++;
            if (this.currenImg > t) {
                this.currenImg = 0;
            }
            this.state[this.currenImg]=true;
        },
        anterior() {
            this.state[this.currenImg]=false;
            let t = this.arts.length - 1;
            this.currenImg--;
            if (this.currenImg == -1) {
                this.currenImg = t;
            }
            this.state[this.currenImg]=true;
        }
    }
}
</script>

<style scoped>
.contenedor-botones {
    display: flex;
    align-items: center;
}

.btn-control {
    width: 100%;
}

.oculto {
    display: none;
}
</style><div class="contenedor-botones">
    <button @click="siguiente" class="btn btn-control">Anterior</button>
    <button @click="anterior" class="btn btn-control">Siguiente</button>
</div>
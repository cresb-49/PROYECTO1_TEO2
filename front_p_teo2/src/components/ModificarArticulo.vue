<template>
    <div>
        <div class="card">
            <div class="container" style="padding: 20px;">
                <h2 class="mb-3">Modificar Articulo</h2>
                <form @submit.prevent="generarArticulo">
                    <div class="mb-3">
                        <label for="nombre" class="form-label">Nombre del articulo</label>
                        <input type="text" id="nombre" class="form-control" aria-labelledby="nombreHelpBlock"
                            v-model="nombre" required>
                        <div id="nombreHelpBlock" class="form-text">
                            Agrega un nombre no tan complicado para mejor la busqueda en la pagina, se descriptivo como
                            manta de
                            seda azul o la marca del producto asi como Samsumg Galxy s20
                        </div>
                    </div>

                    <div class="input-group mb-3">
                        <label for="precio" class="col-form-label" style="margin-right: 15px;">Precio</label>
                        <div class="input-group-text" style="border-radius: 5px 0px 0px 5px;">$</div>
                        <input type="number" step="0.01" class="form-control"
                            style="max-width: 200px;border-radius: 0px 5px 5px 0px;" v-model="precio" required>
                        <span class="input-group form-text">Agrega el valor del articulo</span>
                    </div>
                    <div class="mb-3">
                        <label for="descripcion" class="form-label">Descripcion</label>
                        <textarea type="text" id="descripcion" class="form-control" aria-labelledby="descripcionHelpBlock"
                            rows="5" v-model="descripcion" required></textarea>
                        <div id="descripcionHelpBlock" class="form-text">
                            Agrega una pequena descripcion de el estado fisico del articulo o una recomenadacion sobre el
                            mismo
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="categorias" class="form-label">Categorias</label>
                        <div id="categorias" class="form-control">
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1"
                                    v-model="tec">
                                <label class="form-check-label" for="inlineCheckbox1">Tecnología</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="checkbox" id="inlineCheckbox2" value="option2"
                                    v-model="hogar">
                                <label class="form-check-label" for="inlineCheckbox2">Hogar</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="checkbox" id="inlineCheckbox3" value="option3"
                                    v-model="academico">
                                <label class="form-check-label" for="inlineCheckbox3">Académico</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="checkbox" id="inlineCheckbox3" value="option3"
                                    v-model="literatura">
                                <label class="form-check-label" for="inlineCheckbox3">Literatura</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="checkbox" id="inlineCheckbox3" value="option3"
                                    v-model="decoracion">
                                <label class="form-check-label" for="inlineCheckbox3">Decoración</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="checkbox" id="inlineCheckbox3" value="option3"
                                    v-model="otros">
                                <label class="form-check-label" for="inlineCheckbox3">Otros</label>
                            </div>
                        </div>
                        <div id="categoriasHelpBlock" class="form-text">
                            Agrega una o varias clasificaciones para tu articulo
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="formFile" class="form-label">Imagen del articulo</label>
                        <input @change="manejoImagen" class="form-control" id="formFile" type="file">
                    </div>
                    <img :src="imagen" id="imageFile" alt="..."><br><br>
                    <button type="submit" class="btn btn-outline-primary">Modificar Articulo</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { toast } from 'vue3-toastify';

export default {
    name: 'ModificacionArticulo',
    data() {
        return {
            id: null,
            usuario: null,
            nombre: null,
            precio: 0.00,
            descripcion: null,
            imagen: 'data:image/png;base64,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',
            img: false,
            tec: false,
            hogar: false,
            academico: false,
            literatura: false,
            decoracion: false,
            otros: false
        }
    }, mounted() {
        if (JSON.parse(localStorage.getItem('vuex')).isAuthenticated) {
            let vu = this;
            this.usuario = JSON.parse(localStorage.getItem('vuex')).user;
            this.id = this.$route.params.id;
            this.axios.get(`/api/articulo/all?_id=${this.id}`)
                .then(response => {
                    const data = response.data;
                    vu.nombre = data.nombre;
                    vu.precio = data.precio;
                    vu.descripcion = data.descripcion;
                    vu.imagen = data.imagen;
                    vu.tec = (data.categoria.find(element => element === 'Tecnología') === undefined ? false : true);
                    vu.hogar = (data.categoria.find(element => element === 'Hogar') === undefined ? false : true);
                    vu.academico = (data.categoria.find(element => element === 'Académico') === undefined ? false : true);
                    vu.literatura = (data.categoria.find(element => element === 'Literatura') === undefined ? false : true);
                    vu.decoracion = (data.categoria.find(element => element === 'Decoración') === undefined ? false : true);
                    vu.otros = (data.categoria.find(element => element === 'Otros') === undefined ? false : true);
                    if(data.usuario !== vu.usuario){
                        this.$router.push('/');
                    }
                })
                .catch(response => {
                    console.log(response.response.error);
                });
        } else {
            this.$router.push('/');
        }
    }
    ,
    methods: {
        generarArticulo() {
            //Formar las categorias
            let cate = [];
            if (this.tec) {
                cate.push('Tecnología')
            }
            if (this.hogar) {
                cate.push('Hogar')
            }
            if (this.academico) {
                cate.push('Académico')
            }
            if (this.literatura) {
                cate.push('Literatura')
            }
            if (this.decoracion) {
                cate.push('Decoración')
            }
            if (this.otros) {
                cate.push('Otros')
            }

            if (cate.length >= 1) {
                let payloand = {
                    id: this.id,
                    articulo: {
                        usuario: this.usuario,
                        nombre: this.nombre,
                        precio: this.precio,
                        imagen: this.imagen,
                        descripcion: this.descripcion,
                        categoria: cate
                    }
                }
                this.axios.put('/api/articulo/modificar', payloand)
                    .then(response => {
                        console.log(response);
                        toast.success('Modificacion Exitosa');
                    })
                    .catch(response => {
                        console.log(response);
                        const data = response.response.data;
                        toast.error(data.error);
                    })

            } else {
                toast.error('Debe de seleccionar almenos una categoria para el producto');
            }

        },
        manejoImagen(e) {
            const HEIGHT = 400;
            const QUALITY = 5; //Este valor es un porcentaje desde 1 a 100
            let vu = this.$data;
            let fileSelect = e.target.files;
            if (fileSelect.length > 0) {
                let file = fileSelect[0];
                let fileReader = new FileReader();
                fileReader.onload = (FileLoadEvent) => {
                    let result = FileLoadEvent.target.result;
                    console.log(result);
                    let img = document.createElement("img");
                    img.src = result
                    img.onload = (e) => {
                        let canvas = document.createElement("canvas");
                        let ratio = HEIGHT / e.target.height
                        canvas.height = HEIGHT;
                        canvas.width = e.target.width * ratio;
                        const context = canvas.getContext("2d");
                        context.drawImage(img, 0, 0, canvas.width, canvas.height);
                        let new_img_url = context.canvas.toDataURL('image/jpeg', QUALITY);
                        vu.imagen = new_img_url;
                    }
                }
                fileReader.readAsDataURL(file);
            }
        }
    }
}
</script>

<style scoped>
img {
    max-height: 400px;
}
</style>
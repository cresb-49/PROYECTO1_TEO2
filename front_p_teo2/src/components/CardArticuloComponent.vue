<template>
  <div class="col">
    <div class="card h-100">
      <img :src="'http://localhost:3000/api/image?articulo=' + articulo.id" class="imgP img-fluid" alt="Producto">
      <div class="card-body">
        <h5 class="card-title">{{ articulo.nombre }}</h5>
        <p class="card-text overflow-ellipsis"><small>{{ articulo.descripcion }}</small></p>
        <p class="card-text" v-if="parseFloat(articulo.valor) !== 0">Valor: KOR. {{ articulo.valor }}</p>
        <p class="card-text" v-if="parseFloat(articulo.valor_entrada) !== 0">Valor Entrada: KOR. {{ articulo.valor_entrada }}</p>
        <p class="card-text"  v-if="parseFloat(articulo.recompenza) !== 0">Recompensa: KOR. {{ articulo.recompenza }}</p>
        <p class="card-text">Categoria: {{ articulo.categoria }}</p>
        <RouterLink :to="{ name: 'Publicacion', params: { id: publicacion.id } }" class="btn btn-outline-primary btn-sm"
          v-show="comprar">
          Ver</RouterLink>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardArticulo',
  props: {
    articulo: {
      type: Object,
      default() {
        return {
          id: 0,
          nombre: 'nombre',
          valor: 100.99,
          valor_entrada: 100.99,
          recompenza: 100.99,
          descripcion: 'descripcion',
          category: {
            nombre: 'categoria'
          }
        }
      }
    },
    publicacion: {
      type: Object,
      default() {
        return {
          id: 0
        }
      }
    },
    comprar: {
      type: Boolean
    },
    isPublicacion: {
      type: Boolean
    }
  }
}
</script>

<style scoped>
.imgP {
  margin: 20px;
  border-radius: 5px;
  max-height: 200px;
  object-fit: scale-down;
}

p {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
}

.overflow-visible {
  white-space: initial;
}

.overflow-clip {
  text-overflow: clip;
}

.overflow-ellipsis {
  text-overflow: ellipsis;
}

.overflow-string {
  /* Not supported in most browsers,
     see the 'Browser compatibility' section below */
  text-overflow: " [..]";
}
</style>
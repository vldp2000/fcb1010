<template>
  <div class="row">
    <div class="col-8">
      <h3>Draggable table</h3>

      <table class="table table-striped table-bordered">
        <thead class="thead-dark">
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Name</th>
            <th scope="col">Sport</th>
          </tr>
        </thead>
        <draggable v-model="list" tag="tbody">
          <tr v-for="item in list" :key="item.name">
            <td scope="row">{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.sport }}</td>
          </tr>
        </draggable>
      </table>
    </div>
    <div>
     <button class="btn" @click="loadAll">Load All</button>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'TestPanel2',
  display: 'Table',
  order: 8,
  components: {
    draggable
  },
  data () {
    return {
      list: [
        { id: 1, name: 'Abby', sport: 'basket' },
        { id: 2, name: 'Brooke', sport: 'foot' },
        { id: 3, name: 'Courtenay', sport: 'volley' },
        { id: 4, name: 'David', sport: 'rugby' }
      ],
      dragging: false
    }
  },
  methods: {
    loadAll () {
      this.$store.dispatch('initAllLists', 'Load All')
    }
  }
}
</script>

<style scoped>
  .buttons {
    margin-top: 35px;
  }
  tr:nth-child(even) {
    background-color: #f2f2f2;
  }

table {
  border-collapse: collapse;
  width: 100%;
}

table, th, td {
  border-bottom: 1px solid #ddd;
  padding: 15px;
  text-align: left;
}

th {
  height: 30px;
}
tr {
  height: 30px;
}
td {
  height: 50px;
  vertical-align: center;
}
tr:hover {
  background-color: #a0a5c4;
}
</style>

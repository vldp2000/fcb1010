<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="12" md="6">
        <div class="row">
          <div class="col-8">
            <h3>Set the order of Songs</h3>

            <table class="table table-striped table-bordered">
              <thead class="thead-dark">
                <tr>
                  <th scope="col">Id</th>
                  <th scope="col">Name</th>
                </tr>
              </thead>
              <draggable
                v-model="list"
                tag="tbody"
              >
                <tr v-for="item in list" :key="item.id">
                  <td scope="row">{{ item.id }}</td>
                  <td>{{ item.name }}</td>
                </tr>
                <button slot="footer" @click="saveOrder">Save </button>
              </draggable>
            </table>
          </div>
        </div>
      </v-col>
       <v-col cols="12" md="6">
        <div class="row">
          <div class="col-8">
            <h3>All Songs</h3>
            <table class="table table-striped table-bordered">
              <thead class="thead-dark">
                <tr>
                  <th scope="col">Id</th>
                  <th scope="col">Name</th>
                </tr>
              </thead>
              <draggable
                v-model="allSongs"
                tag="tbody"
              >
                <tr v-for="item in allSongs" :key="item.id">
                  <td scope="row">{{ item.id }}</td>
                  <td>{{ item.name }}</td>
                </tr>
                <button slot="footer" @click="saveOrder">Save </button>
              </draggable>
            </table>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// import SortableTable from '@/plugins/SortableTable'
import draggable from 'vuedraggable'

export default {
  name: 'GigSongPanel',
  display: 'Table',
  order: 8,

  components: {
    draggable
  },
  props: {
    gig: {
      type: Object,
      default: null
    },
    allSongs: {
      type: Array,
      default: null
    }
  },

  data () {
    return {
      dragging: false,
      list: []
    }
  },
  mounted () {
    // console.log(this.gig)
    if (this.gig) {
      this.list = this.gig.songList
    }
  },

  methods: {
    saveOrder: function () {
      const result = { 'gigId': this.gig.id, 'songList': this.list }
      this.$store.dispatch('resetGigSongs', result)
    },
    checkMove: function (e) {
      console.log(`Future index:  ${e.draggedContext.futureIndex}`)
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

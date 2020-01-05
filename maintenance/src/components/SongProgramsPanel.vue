<template>
  <v-data-table
    :headers="headers"
    :items="programList"
    item-key="id"
    class="elevation-1"
  >
  </v-data-table>
</template>

<script>
// import { mapState } from 'vuex'

export default {
  name: 'SongProgramsPanel',
  props: ['programList'],
  data () {
    return {
      headers: [
        {
          text: 'name',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: 'midipedal', value: 'midipedal' }
      ]
    }
  }

  // computed: {
  //   ...mapState(['songList'])
  // }

  // mounted () {
  //   this.programList = this.selectedSong.programList
  // }

  // watch: {
  //   songList: function (newValue, oldValue) {
  //     this.programList = newValue.programList
  //   }
  // }
}
</script>

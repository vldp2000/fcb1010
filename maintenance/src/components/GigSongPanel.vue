<template>
  <v-data-table
    :headers="headers"
    :items="gigSongList"
    item-key="id"
    class="elevation-1"
    hide-default-footer
  >

  </v-data-table>
</template>

<script>
// import { mapState } from 'vuex'

export default {
  name: 'GigSongPanel',

  props: {
    gigSongList: {
      type: Array
    }
  },

  data () {
    return {
      headers: [
        {
          text: 'name',
          align: 'left',
          sortable: false,
          value: 'name'
        }
      ]
    }
  },

  // computed: {
  //   ...mapState(['songList'])
  // }

  mounted () {
  //   this.programList = this.selectedSong.programList
    console.log('-----> SongProgramsPanel')
    console.log(this.gigSongList)
  }
}
</script>

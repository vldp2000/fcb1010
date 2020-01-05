<template>
  <v-data-table
    :headers="headers"
    :items="presetList"
    item-key="id"
    class="elevation-1"
  >
  </v-data-table>
</template>

<script>
// import { mapState } from 'vuex'

export default {
  name: 'SongPresetsPanel',
  props: {
    presetList: {
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
        },
        { text: 'instrument', value: 'refinstrument' },
        { text: 'instrumentbank', value: 'refinstrumentbank' },
        { text: 'volume', value: 'volume' },
        { text: 'pan', value: 'pan' },
        { text: 'muteflag', value: 'muteflag' },
        { text: 'reverbflag', value: 'reverbflag' },
        { text: 'reverbvalue', value: 'reverbvalue' },
        { text: 'delayflag', value: 'delayflag' },
        { text: 'delayvalue', value: 'delayvalue' },
        { text: 'modeflag', value: 'modeflag' }
      ],
      expanded: [],
      singleExpand: false
    }
  },

  // computed: {
  //   ...mapState(['songList'])
  // }

  mounted () {
  //   this.programList = this.selectedSong.programList
    console.log('----->SongPresetsPanel')
    console.log(this.presetList)
  }

  // watch: {
  //   songList: function (newValue, oldValue) {
  //     this.programList = newValue.programList
  //   }
  // }
}
</script>

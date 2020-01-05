<template>
  <v-data-table
    :headers="headers"
    :items="programList"
    item-key="id"
    class="elevation-1"
    @click:row="rowClicked"
    :single-expand="singleExpand"
    :expanded.sync="expanded"
    hide-default-footer
  >
    <template v-slot:expanded-item="{ headers }">
      <td :colspan="headers.length">
        <div>
          <song-presets-panel v-bind:songPresetList="selectedPresetList" >

          </song-presets-panel>
        </div>
      </td>
    </template>

  </v-data-table>
</template>

<script>
// import { mapState } from 'vuex'
import SongPresetsPanel from '@/components/SongPresetsPanel'

export default {
  name: 'SongProgramsPanel',
  components: {
    SongPresetsPanel
  },
  props: {
    programList: {
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
        { text: 'midipedal', value: 'midipedal' }
      ],
      selectedPresetList: [],
      expanded: [],
      singleExpand: false
    }
  },

  // computed: {
  //   ...mapState(['songList'])
  // }

  mounted () {
  //   this.programList = this.selectedSong.programList
    console.log('-----> SongProgramsPanel')
    console.log(this.programList)
  },
  methods: {
    async rowClicked (value) {
      console.log(`<SongProgramPanel row clicked> ${value.id}`)
      console.log(value)

      if (this.expanded.length > 0) {
        this.expanded.pop()
      }
      this.selectedPresetList = value.presetList
      this.expanded.push(value)
      console.log(this.selectedPresetList)
    }
  }

  // watch: {
  //   songList: function (newValue, oldValue) {
  //     this.programList = newValue.programList
  //   }
  // }
}
</script>

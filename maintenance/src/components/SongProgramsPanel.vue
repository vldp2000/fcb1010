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

    <template v-slot:item.action="{ item }">
      <v-icon
        class="mr-2"
        @click="editItem(item)"
      >
        edit
      </v-icon>
    </template>

    <template v-slot:top>
      <v-dialog  v-if="editable" v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Edit Song Program</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="editedItem.tytle" label="Tytle"></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="cyan darken-1" text @click="closeDialog">Cancel</v-btn>
            <v-btn color="cyan darken-1" text @click="saveSong">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
        { text: 'midipedal', value: 'midipedal', sortable: false },
        { text: 'tytle', value: 'tytle', sortable: false },
        { text: 'Actions', value: 'action', sortable: false }
      ],
      selectedPresetList: [],
      expanded: [],
      singleExpand: true,
      dialog: false,
      editedIndex: -1,
      editedItem: null
    }
  },

  computed: {
    editable: {
      get () { return (this.editedIndex > -1 && this.editedItem) }
    }
  },

  watch: {
    dialog: function (val) {
      val || this.closeDialog()
    }
  },

  methods: {
    async rowClicked (value) {
      console.log(value)
      let oldId = -1
      if (this.expanded.length === 1) {
        oldId = this.expanded[0].id
        this.expanded.pop()
      }
      if (oldId === value.id || !value.presetList || value.presetList.lenght === 0) {
        this.$log.debug('empty ----')
      } else {
        // this.$log.debug('expand ----')
        this.selectedPresetList = value.presetList
        this.expanded.push(value)
      }

      // if (this.expanded.length > 0) {
      //   this.expanded.pop()
      // }
      // this.selectedPresetList = value.presetList
      // this.expanded.push(value)
      // this.$log.debug(this.selectedPresetList)
    },

    editItem (item) {
      this.$log.debug('... Edit Item', item)
      this.editedIndex = this.programList.indexOf(item)
      this.$log.debug(this.editedIndex)
      this.editedItem = Object.assign({}, item)
      this.$log.debug(this.editedItem)
      this.dialog = true
    },
    closeDialog () {
      this.dialog = false
      setTimeout(() => {
        this.editedIndex = -1
      }, 300)
    },

    saveSongProgram () {
      this.$log.debug('() saveSongProgram () -------')
      this.$log.debug(this.editedItem)
      if (this.editedIndex > -1) {
        try {
          // SongsService.put(this.editedItem)
          this.$store.dispatch('updateSongProgram', this.editedItem)
        } catch (err) {
          this.$log.debug(err)
        }
      } else {
        this.$log.debug('User is not allowed to create Song Program records manually')
      }
      this.closeDialog()
    }
  }
}
</script>

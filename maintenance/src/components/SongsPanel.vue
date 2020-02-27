<template>
  <custom-panel title="Songs">
    <v-data-table
      :headers="headers"
      :items="songList"
      :single-expand="singleExpand"
      :expanded.sync="expanded"
      :loading="isLoading"
      :custom-filter="customDataTableItemsFilter"
      @click:row="rowClicked"
      item-key="id"
      sort-by="id"
      class="elevation-1"
      ref="sortableTable"
    >

      <template v-slot:expanded-item="{ headers }">
        <td :colspan="headers.length">
          <div>
            <song-programs-panel v-bind:programList="selectedProgramList" >
            </song-programs-panel>
          </div>
        </td>
      </template>

      <template v-slot:item.name="{ item }">
        <div class="customTableCell">{{ item.name }}</div>
      </template>
      <template v-slot:item.tempo="{ item }">
        <div class="customTableCell">{{ item.tempo }}</div>
      </template>

      <template v-slot:item.tempo="{ item }">
        <div class="customKnob">
          <my-knob
            :value="parseInt(item.tempo,10)"
            :max=200
          >
          </my-knob>
        </div>
      </template>

      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Songs</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <v-spacer></v-spacer>

          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark class="mb-2" v-on="on">New Item</v-btn>
            </template>

            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.name" label="Name"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.tempo" label="Tempo"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <div class="gauge">
                        <span>
                        <vue-svg-gauge
                          :start-angle="-110"
                          :end-angle="110"
                          :value="parseInt(editedItem.tempo,10)"
                          :separator-step="10"
                          :min="0"
                          :max="200"
                          :gauge-color="[{ offset: 0, color: '#347AB0'}, { offset: 100, color: '#8CDFAD'}]"
                          :scale-interval="0.5">
                          <div class="inner-text">
                            <span>
                              {{ editedItem.tempo }}
                            </span>
                          </div>
                        </vue-svg-gauge>
                        </span>

                      </div>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="cyan darken-1" text @click="closeDialog">Cancel</v-btn>
                <v-btn color="cyan darken-1" text @click="saveSong(null)">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>

      <template v-slot:item.action="{ item }">
        <v-icon
          class="mr-1"
          @click="editItem(item)"
        >
          edit
        </v-icon>
      </template>

      <template v-slot:item.save="{ item }">
        <v-icon
          class="mr-1"
          @click="saveSong(item)"
        >
          save
        </v-icon>
      </template>

    </v-data-table>
  </custom-panel>
</template>

<script>

import { mapState } from 'vuex'
// import SongsService from '@/services/SongsService'
import SongProgramsPanel from '@/components/SongProgramsPanel'

export default {
  components: {
    SongProgramsPanel
  },
  data () {
    return {
      songs: [],
      dialog: false,
      expanded: [],
      singleExpand: true,
      isLoading: true,
      headers: [
        {
          text: 'Name',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: 'Tempo', value: 'tempo' },
        { text: 'Actions', value: 'action', sortable: false },
        { text: 'Save', value: 'save', sortable: false }
      ],

      editedIndex: -1,
      editedItem: {
        name: '',
        tempo: 0,
        lirycs: '',
        tabs: '',
        id: -1,
        createdAt: '',
        updatedAt: ''
      },
      defaultItem: {
        name: '',
        tempo: 0,
        lirycs: '',
        tabs: '',
        id: -1,
        createdAt: '',
        updatedAt: ''
      },
      pagination: {
        page: 1,
        itemsPerPage: 20,
        pageStart: 1,
        // pageStop: 2,
        // pageCount: number
        itemsLength: 128
      },
      selectedProgramList: []
    }
  },

  computed: {
    ...mapState(['songList']),
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    }
  },

  mounted () {
    this.init()
  },
  watch: {
    songList: function (newValue, oldValue) {
      this.songs = newValue
    },
    dialog: function (val) {
      val || this.closeDialog()
    }
  },

  methods: {

    showLoading (value) {
      this.isLoading = value
    },

    editItem (item) {
      this.$log.debug('... Edit Item', item)
      this.editedIndex = this.songs.indexOf(item)
      this.$log.debug(this.editedIndex)
      this.editedItem = Object.assign({}, item)
      this.$log.debug(this.editedItem)
      this.dialog = true
    },

    deleteItem (item) {
      const index = this.songs.indexOf(item)
      confirm('Are you sure you want to delete this item?') && this.songs.splice(index, 1)
    },

    closeDialog () {
      // console.log('closeDialog')
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    saveSong (value) {
      if (value === null) {
        this.showLoading(true)
        this.$log.debug('saveSong () -------')
        this.$log.debug(this.editedItem)
        if (this.editedIndex > -1) {
          try {
            // SongsService.put(this.editedItem)
            this.$store.dispatch('updateSong', this.editedItem)
          } catch (err) {
            this.$log.debug(err)
          }
        } else {
          try {
            // SongsService.post(this.editedItem)
            this.$store.dispatch('addSong', this.editedItem)
          } catch (err) {
            this.$log.error(err)
          }
        }
      } else {
        this.$log.debug(value)
      }
      this.showLoading(false)
      this.closeDialog()
    },

    async init () {
      this.$log.debug(' >>> Init all relted to songs storage')
      // await SongsService.initAll()
      await this.showLoading(false)
      this.$log.debug(' Finish Init all relted to songs storage <<< ')
    },

    customDataTableItemsFilter (value, search, items) {
      const wordArray = search
        .toString()
        .toLowerCase()
        .split(' ')
        .filter(x => x)
      return wordArray.every(word =>
        JSON.stringify(Object.values(items))
          .toString()
          .toLowerCase()
          .includes(word)
      )
    },

    async rowClicked (value) {
      this.$log.debug(`<SongPanel row clicked> ${value.id}`)
      let oldId = -1

      if (this.expanded.length === 1) {
        oldId = this.expanded[0].id
        this.expanded.pop()
      }

      let song = this.songList.find(sn => sn.id === value.id)
      this.$log.debug(song)

      if (!song.programList || song.programList.lenght === 0) {
        await this.$store.dispatch('addSongItems', value.id)
      }
      if (oldId === value.id || !value.programList || value.programList.lenght === 0) {
        this.$log.debug('empty ----')
      } else {
        this.$log.debug('expand ----')
        this.selectedProgramList = song.programList
        this.expanded.push(value)
      }
    }
  }
}
</script>

<style scoped>
  .inner-text {
    /* allow the text to take all the available space in the svg on top of the gauge */
    height: 100%;
    width: 100%;
    text-align: center;
    margin-top: 50px;
    font-size: 50px !important;
  }
  .customKnob {
    height:55px;
    width: 55px;
    /* margin-top: 5px; */
  }
  .customTableCell {
    font-size: 20px !important;
  }
</style>

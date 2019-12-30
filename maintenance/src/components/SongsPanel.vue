<template>
  <custom-panel title="Songs">
    <v-data-table
      @pagination="pagination = $event"
      :headers="headers"
      :items="songList"
      sort-by="name"
      class="elevation-1"
    >

      <template v-slot:item.name="{ item }">
        <div class="customTableCell">{{ item.name }}</div>
      </template>
      <template v-slot:item.tempo="{ item }">
        <div class="customTableCell">{{ item.tempo }}</div>
      </template>

      <template v-slot:item.songTempo="{ item }">
        <div class="gauge">
          <vue-svg-gauge
            :start-angle="-110"
            :end-angle="110"
            :value="parseInt(item.tempo,10)"
            :separator-step="10"
            :min="0"
            :max="200"
            :gauge-color="[{ offset: 0, color: '#347AB0'}, { offset: 100, color: '#8CDFAD'}]"
            :scale-interval="0.5">
            <div class="inner-text">
              <span> {{ item.tempo }}</span>
            </div>
          </vue-svg-gauge>
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
                        <span v-touch:swipe="swipeHandler">
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
                            <span> {{ editedItem.tempo }}</span>
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
                <v-btn color="cyan darken-1" text @click="saveSong">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon
          class="mr-2"
          @click="editItem(item)"
        >
          edit
        </v-icon>
      </template>
    </v-data-table>
  </custom-panel>
</template>

<script>

import { mapState } from 'vuex'
import SongsService from '@/services/SongsService'

export default {
  data () {
    return {
      songs: [],
      dialog: false,
      headers: [
        {
          text: 'Name',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: 'Tempo', value: 'tempo' },
        { text: 'Tempo', value: 'songTempo' },
        { text: 'Actions', value: 'action', sortable: false }
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
      selected: []
    }
  },
  computed: {
    ...mapState(['songList']),
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    }
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
    editItem (item) {
      console.log(item)
      this.editedIndex = this.songs.indexOf(item)
      console.log(this.editedIndex)
      this.editedItem = Object.assign({}, item)
      console.log(this.editedItem)
      this.dialog = true
    },

    deleteItem (item) {
      const index = this.songs.indexOf(item)
      confirm('Are you sure you want to delete this item?') && this.songs.splice(index, 1)
    },

    closeDialog () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    saveSong () {
      console.log('saveSong () -------')
      console.log(this.editedItem)
      if (this.editedIndex > -1) {
        try {
          SongsService.put(this.editedItem)
        } catch (err) {
          console.log(err)
        }
      } else {
        try {
          SongsService.post(this.editedItem)
        } catch (err) {
          console.log(err)
        }
      }
      this.closeDialog()
    },
    async init () {
      console.log(this.songList.length)
      // if (!this.$store.state.songList || this.$store.state.songList === undefined || !this.$store.state.songList.Length) {
      if (this.$store.state.songList.length === 0) {
        console.log('Init songs storage')
        let result = await SongsService.getAll()
        let list = await result.data
        // console.log('<< Init Song List?>>')
        await this.$store.dispatch('setSongList', list)
        // console.log(this.$store.state.songList)
      } else {
        console.log(' Song List already populated')
      }
    },
    swipeHandler (direction) {
      console.log(direction)
      // May be left right top bottom
      if (direction === 'left' || direction === 'bottom') {
        this.editedItem.tempo--
      } else {
        this.editedItem.tempo++
      }
    }
  },
  mounted () {
    this.init()
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
  .gauge {
    height:80px;
    width: 100px;
  }
  .customTableCell {
    font-size: 20px !important;
  }
</style>

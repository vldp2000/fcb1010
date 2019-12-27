<template>
  <custom-panel title="Songs">
    <v-data-table
      @pagination="pagination = $event"
      :headers="headers"
      :items="songList"
      sort-by="name"
      class="elevation-1"
    >
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
              <v-btn color="cyan" dark class="mb-2" v-on="on">New Item</v-btn>
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
          small
          class="mr-2"
          @click="editItem(item)"
        >
          edit
        </v-icon>
        <v-icon
          small
          @click="deleteItem(item)"
        >
          delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">Reset</v-btn>
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
        { text: 'Actions', value: 'action', sortable: false }
      ],

      editedIndex: -1,
      editedItem: {
        name: '',
        tempo: 0,
        lirycs: '',
        tabs: ''
      },
      defaultItem: {
        name: '',
        tempo: 0,
        lirycs: '',
        tabs: ''
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
    }
  },

  methods: {
    editItem (item) {
      this.editedIndex = this.songs.indexOf(item)
      this.editedItem = Object.assign({}, item)
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
      console.log('saveSong () ')
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
    }
  }
}
</script>

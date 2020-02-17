<template>
  <custom-panel title="Gigs">
    <v-data-table
      :headers="headers"
      :items="gigList"
      sort-by="gigdate"
      class="elevation-1"
      :single-expand="singleExpand"
      :expanded.sync="expanded"
      hide-default-footer
      item-key="id"
      @click:row="rowClicked"
    >
      <template v-slot:expanded-item="{ headers }">
        <td :colspan="headers.length">
          <div>
            <gig-song-panel
              :gig="selectedGig"
            />
          </div>
        </td>
      </template>

      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Gigs</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical/>
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
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-date-picker v-model="editedItem.gigdate" :landscape="landscape" :reactive="reactive"></v-date-picker>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="cyan darken-1" text @click="closeDialog">Cancel</v-btn>
                <v-btn color="cyan darken-1" text @click="saveGig">Save</v-btn>
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
import GigSongPanel from '@/components/GigSongPanel'

export default {
  name: 'GigPanel',
  components: {
    GigSongPanel
  },
  data () {
    return {
      dialog: false,
      expanded: [],
      singleExpand: true,
      headers: [
        {
          text: 'Name',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: 'Date', value: 'gigdate' },
        { text: 'Action', value: 'action' }
      ],

      editedIndex: -1,
      editedItem: {
        id: -1,
        name: '',
        gigdate: '',
        songList: []
      },
      defaultItem: {
        id: -1,
        name: '',
        gigdate: '',
        songList: []
      },
      pagination: {
        page: 1,
        itemsPerPage: 20,
        pageStart: 1,
        // pageStop: 2,
        // pageCount: number
        itemsLength: 128
      },
      selected: [],
      landscape: true,
      reactive: true,
      selectedGig: []
    }
  },
  computed: {
    ...mapState(['gigList', 'allInitialized']),
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    }
  },

  watch: {
    dialog: function (val) {
      val || this.closeDialog()
    }
  },

  methods: {
    editItem (item) {
      this.$log.debug(item)
      this.editedIndex = this.gigList.indexOf(item)
      this.$log.debug(this.editedIndex)
      this.editedItem = Object.assign({}, item)
      this.$log.debug(this.editedItem)
      this.dialog = true
    },

    closeDialog () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    saveGig () {
      // this.$log.debug('saveGig () -------')
      // this.$log.debug(this.editedItem)
      if (this.editedIndex > -1) {
        try {
          // GigsService.put(this.editedItem)
          this.$store.dispatch('updateGig', this.editedItem)
        } catch (err) {
          this.$log.debug(err)
        }
      } else {
        try {
          this.$store.dispatch('addGig', this.editedItem)
        } catch (err) {
          this.$log.debug(err)
        }
      }
      this.closeDialog()
    },

    async rowClicked (value) {
      let oldGigId = -1
      if (this.expanded.length === 1) {
        oldGigId = this.expanded[0].id
        this.expanded.pop()
      }
      this.$log.debug(value)
      if (oldGigId === value.id || !value.songList || value.songList.lenght === 0) {
        this.$log.debug('empty ----')
      } else {
        this.$log.debug('expand ----')
        this.selectedGig = value
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
  .v-data-table th {
    font-size: 16px;
  }
  .v-data-table td {
    font-size: 20px;
  }

</style>

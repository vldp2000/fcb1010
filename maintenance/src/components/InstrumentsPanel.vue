<template>
  <v-layout>
    <v-flex class="ml-2">
      <custom-panel title="Instruments">
        <v-data-table
          @pagination="pagination = $event"
          :headers="headers"
          :items="instrumentList"
          sort-by="name"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>Instruments</v-toolbar-title>
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
                          <v-text-field v-model="editedItem.midichannel" label="Midi Channel"></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="cyan darken-1" text @click="closeDialog">Cancel</v-btn>
                    <v-btn color="cyan darken-1" text @click="saveInstrument">Save</v-btn>
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
        </v-data-table>
      </custom-panel>
    </v-flex>
  </v-layout>
</template>

<script>

import { mapState } from 'vuex'
import InstrumentsService from '@/services/InstrumentsService'

export default {
  data () {
    return {
      instruments: [],
      dialog: false,
      headers: [
        {
          text: 'Name',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: 'Midi Channel', value: 'midichannel' },
        { text: 'Actions', value: 'action', sortable: false }
      ],

      editedIndex: -1,
      editedItem: {
        id: -1,
        name: '',
        midichannel: 0
      },
      defaultItem: {
        id: -1,
        name: '',
        midichannel: 0
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

  mounted () {
    this.init()
  },

  computed: {
    ...mapState(['instrumentList']),
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    }
  },

  watch: {
    instrumentList: function (newValue, oldValue) {
      this.instruments = newValue
    },
    dialog: function (val) {
      val || this.closeDialog()
    }
  },

  methods: {
    async init () {
      console.log(this.instrumentList.length)
      if (this.instrumentList.length === 0) {
        console.log('Init instruments storage')
        let result = await InstrumentsService.getAll()
        let list = await result.data
        // console.log('<< Init instrument List?>>')
        await this.$store.dispatch('setInstrumentList', list)
        // console.log(this.$store.state.instrumentList)
      } else {
        console.log(' Instrument List already populated')
        console.log(this.$store.state.instrumentList)
      }
    },
    editItem (item) {
      this.editedIndex = this.instrumentList.indexOf(item)
      this.editedItem = Object.assign({}, item)
      console.log(this.editedItem)
      this.dialog = true
    },

    deleteItem (item) {
      const index = this.instruments.indexOf(item)
      confirm('Are you sure you want to delete this item?') && this.instruments.splice(index, 1)
    },

    closeDialog () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    saveInstrument () {
      console.log('saveInstrument () -------')
      console.log(this.editedItem)
      if (this.editedIndex > -1) {
        try {
          InstrumentsService.put(this.editedItem)
        } catch (err) {
          console.log(err)
        }
      } else {
        try {
          InstrumentsService.post(this.editedItem)
        } catch (err) {
          console.log(err)
        }
      }
      this.closeDialog()
    }
  }
}
</script>
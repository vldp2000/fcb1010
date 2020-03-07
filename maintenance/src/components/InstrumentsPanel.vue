<template>
  <v-layout>
    <v-flex class="ml-2">
      <custom-panel title="Instruments">
        <v-data-table
          :headers="headers"
          :items="instrumentList"
          sort-by="name"
          class="elevation-1"
          hide-default-footer
          item-key="id"
          disable-pagination
        >
          <template v-slot:item.image="{ item }">
            <div class ="image">
              <v-img v-bind:src="item.imageURL" :alt="item.image"
                contain
                height="60px"
                width="60px"
              >
              </v-img>
            </div>
          </template>

          <template v-slot:item.channel="{ item }">
            <div class="customKnob">
              <my-knob
                :value="parseInt(item.midichannel,10)"
              >
              </my-knob>
            </div>
          </template>

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
              class="mr-2"
              @click="editItem(item)"
            >
              edit
            </v-icon>
          </template>
        </v-data-table>
      </custom-panel>
    </v-flex>
  </v-layout>
</template>

<script>

import { mapState } from 'vuex'
// import InstrumentsService from '@/services/InstrumentsService'

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
        { text: 'Image', value: 'image' },
        { text: 'Midi Channel', value: 'midichannel' },
        { text: 'Channel', value: 'channel' },
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
      selected: []
    }
  },

  mounted () {
    this.init()
    // this.importAll(require.context('../assets/', false, /\.png$/))
    // this.importAll(require.context('../assets/', true, ([a-zA-Z0-9\image_\\.\-\(\):])+(.png)$))
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
    init () {
      if (this.instrumentList.length === 0) {
        this.$store.dispatch('initAllLists', 'initAll')
      } else {
        this.$log.debug(' Instrument List already populated')
      }
    },

    editItem (item) {
      this.editedIndex = this.instrumentList.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.$log.debug(this.editedItem)
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
      // console.log('saveInstrument () -------')
      if (this.editedIndex > -1) {
        try {
          this.$store.dispatch('updateInstrument', this.editedItem)
        } catch (err) {
          this.$log.error(err)
        }
      } else {
        try {
          this.$store.dispatch('addInstrument', this.editedItem)
        } catch (err) {
          this.$log.error(err)
        }
      }
      this.closeDialog()
    }

    // importAll (files) {
    //   try {
    //     files.keys().forEach(key => {
    //       const pathLong = files(key)
    //       const pathShort = key
    //       let id = -1
    //       if (pathShort.includes('image_')) {
    //         id = key.substring(8, 10)
    //         const payload = { 'id': parseInt(id, 10), 'url': pathLong }
    //         this.$store.dispatch('setInstrumentImage', payload)
    //       }
    //     })
    //     // this.$log.debug(this.instrumentList)
    //   } catch (ex) {
    //     this.$log.debug(ex)
    //   }
    // }
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
    height:80px;
    width: 100px;
  }
  .image {
    height:80px;
    width: 80px;
    margin-top: 20px;
  }
  .dataTable {
    font-size: 24px !important;
  }
</style>

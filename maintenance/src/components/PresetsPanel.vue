<template>
  <v-layout>
    <v-flex class="ml-2">
      <custom-panel title="Presets">
        <v-data-table
          @pagination="pagination = $event"
          :headers="headers"
          :items="presetList"
          sort-by="name"
          class="elevation-1"
        >

          <template v-slot:item.instrument="{ item }">
            <v-chip color="blue" dark>{{ instrumentList.find(i => i.id === item.refinstrument).name }}</v-chip>
          </template>

          <template v-slot:item.bank="{ item }">
            <v-chip color="blue" dark>{{ instrumentBankList.find(i => i.id === item.refinstrumentbank).name }}</v-chip>
          </template>

          <template v-slot:item.pc="{ item }">
            <div class="gauge">
              <vue-svg-gauge
                :start-angle="-110"
                :end-angle="110"
                :value="item.midipc"
                :separator-step="10"
                :min="0"
                :max="127"
                :gauge-color="[{ offset: 0, color: '#347AB0'}, { offset: 100, color: '#8CDFAD'}]"
                :scale-interval="0.5">
                <div class="inner-text">
                  <span><b>{{ item.midipc }}</b></span>
                </div>
              </vue-svg-gauge>
            </div>
          </template>

          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>Presets</v-toolbar-title>
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
                          <v-text-field v-model="editedItem.midipc" label="Midi PC"></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="cyan darken-1" text @click="closeDialog">Cancel</v-btn>
                    <v-btn color="cyan darken-1" text @click="savePreset">Save</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.action="{ item }">
            <div class="editicon">
              <v-icon
                big
                class="mr-2"
                @click="editItem(item)"
              >
                edit
              </v-icon>
            </div>
          </template>
        </v-data-table>
      </custom-panel>
    </v-flex>
  </v-layout>
</template>

<script>

import { mapState } from 'vuex'
import PresetsService from '@/services/PresetsService'
import InstrumentsService from '@/services/InstrumentsService'
import InstrumentBankService from '@/services/InstrumentBankService'

export default {
  data () {
    return {
      presets: [],
      dialog: false,
      headers: [
        {
          text: 'Name',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: 'Instrument', value: 'instrument' },
        { text: 'Bank', value: 'bank' },
        { text: 'Midi PC', value: 'midipc' },
        { text: 'PC', value: 'pc' },
        { text: 'Actions', value: 'action', sortable: false }
      ],

      editedIndex: -1,
      editedItem: {
        id: -1,
        name: '',
        midipc: 0,
        refinstrument: null,
        refinstrumentbank: null,
        isDefault: 0
      },
      defaultItem: {
        id: -1,
        name: '',
        midipc: 0,
        refinstrument: null,
        refinstrumentbank: null,
        isDefault: 0
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
    ...mapState(['presetList', 'instrumentList', 'instrumentBankList']),
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    }
  },

  watch: {
    presetList: function (newValue, oldValue) {
      this.presets = newValue
    },
    dialog: function (val) {
      val || this.closeDialog()
    }
  },

  methods: {
    async init () {
      console.log(this.presetList.length)
      if (this.presetList.length === 0) {
        console.log('Init presets storage')
        let result = await PresetsService.getAll()
        let list = await result.data
        // console.log('<< Init preset List?>>')
        await this.$store.dispatch('setPresetList', list)
        // console.log(this.$store.state.presetList)
      } else {
        console.log(' Preset List already populated')
        console.log(this.$store.state.presetList)
      }

      if (this.instrumentList.length === 0) {
        console.log('Init instrument storage')
        let result = await InstrumentsService.getAll()
        let list = await result.data
        await this.$store.dispatch('setInstrumentList', list)
      } else {
        console.log(' Instrument Bank already populated')
        // console.log(this.$store.state.instrumentBankList)
      }

      if (this.instrumentBankList.length === 0) {
        console.log('Init instrument Banks storage')
        let result = await InstrumentBankService.getAll()
        let list = await result.data
        // console.log('<< Init instrument bank List?>>')
        await this.$store.dispatch('setInstrumentBankList', list)
        // console.log(this.$store.state.instrumentBankList)
      } else {
        console.log(' Instrument Bank List already populated')
        // console.log(this.$store.state.instrumentBankList)
      }
    },

    editItem (item) {
      this.editedIndex = this.presetList.indexOf(item)
      this.editedItem = Object.assign({}, item)
      console.log(this.editedItem)
      this.dialog = true
    },

    deleteItem (item) {
      const index = this.presets.indexOf(item)
      confirm('Are you sure you want to delete this item?') && this.presets.splice(index, 1)
    },

    closeDialog () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    savePreset () {
      console.log('savePreset () -------')
      console.log(this.editedItem)
      if (this.editedIndex > -1) {
        try {
          PresetsService.put(this.editedItem)
        } catch (err) {
          console.log(err)
        }
      } else {
        try {
          PresetsService.post(this.editedItem)
        } catch (err) {
          console.log(err)
        }
      }
      this.closeDialog()
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
  .gauge {
    height:80px;
    width: 100px;
  }
  .dataTable {
    font-size: 24px !important;
  }
</style>

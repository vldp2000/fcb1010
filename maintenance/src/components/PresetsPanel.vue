<template>
  <v-layout>
    <v-flex class="ml-2">
      <custom-panel title="Presets">
        <v-data-table
          v-if ="presetList.length > 0"
          @pagination="pagination = $event"
          :headers="headers"
          :items="presetList"
          sort-by="name"
          class="elevation-1"
        >

          <template v-slot:item.instrument="{ item }">
            <v-chip color="blue" dark>{{ getInstrument(item.refinstrument) }}</v-chip>
          </template>

          <template v-slot:item.bank="{ item }">
            <v-chip color="blue" dark>{{ getInstrumentBank(item.refinstrumentbank) }}</v-chip>
          </template>

          <template v-slot:item.pc="{ item }">
            <div class="customKnob">
              <custom-knob
                :value="parseInt(item.midipc,10)"
              >
              </custom-knob>
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
                       <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-select
                            v-if="instrumentList"
                            label="Select Instrument"
                            v-model="instrumentId"
                            :items="instrumentList"
                            required
                            item-text="name"
                            item-value="id">
                          </v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-select
                            v-if="bankList"
                            label="Select Bank"
                            v-model="bankId"
                            :items="bankList"
                            required
                            item-text="name"
                            item-value="id">
                          </v-select>
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
        itemsLength: 128
      },
      selected: [],
      instrumentId: -1,
      bankList: [],
      bankId: -1
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
    },
    instrumentId: function () {
      // console.log(`-- on InstrumentId change ${this.instrumentId}`)
      if (this.instrumentId && this.instrumentId > 0) {
        this.editedItem.refinstrument = this.instrumentId
        this.bankList = this.getBankList(this.instrumentId)
      } else {
        this.bankList = []
      }

      if (this.dialog && this.editedIndex > -1 && this.bankList.length > 0) {
        this.bankId = this.editedItem.refinstrumentbank
      }
    },
    bankId: function () {
      this.editedItem.refinstrumentbank = this.bankId
    }
  },

  methods: {
    async init () {
      // console.log(this.presetList.length)
      if (this.presetList.length === 0) {
        // console.log('Init presets storage')
        let result = await PresetsService.getAll()
        let list = await result.data
        // console.log('<< Init preset List?>>')
        await this.$store.dispatch('setPresetList', list)
        // console.log(this.$store.state.presetList)
      } else {
        console.log(' Preset List already populated')
        // console.log(this.$store.state.presetList)
      }

      if (this.instrumentList.length === 0) {
        // console.log('Init instrument storage')
        let result = await InstrumentsService.getAll()
        let list = await result.data
        await this.$store.dispatch('setInstrumentList', list)
      } else {
        console.log(' Instrument Bank already populated')
        // console.log(this.$store.state.instrumentBankList)
      }

      if (this.instrumentBankList.length === 0) {
        // console.log('Init instrument Banks storage')
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
      // console.log(`-------start editItem (item)  ${item.id}`)
      this.editedIndex = this.presetList.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
      this.instrumentId = item.refinstrument
      // console.log(`-------finish editItem (item)  ${item.id}`)
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
        this.instrumentId = -1
        this.bankList = []
        this.bankId = -1
      }, 300)
    },

    savePreset () {
      // console.log('savePreset () -------')
      // console.log(this.editedItem)
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
    },
    getBankList (id) {
      // console.log(' -----getBankList======== ')
      let result = []
      // console.log(id)
      if (id > -1 && this.editedItem.refinstrument && this.editedItem.refinstrument > -1) {
        result = this.instrumentBankList.filter(item => item.refinstrument === id)
        if (result && result.length === 1) {
          this.bankId = result.id
        }
      }
      // console.log(result)
      return result
    },
    getInstrument (id) {
      let instrument = null
      if (id > 0 && this.instrumentList.length > 0) {
        instrument = this.instrumentList.find(i => i.id === id)
      }
      if (instrument) {
        return instrument.name
      } else {
        return ''
      }
    },
    getInstrumentBank (id) {
      let bank = null
      if (id > 0 && this.instrumentBankList.length > 0) {
        bank = this.instrumentBankList.find(i => i.id === id)
      }
      if (bank) {
        return bank.name
      } else {
        return ''
      }
    }

  }
}
</script>

<style scoped>

  .customKnob {
    height:80px;
    width: 100px;
    padding-top: 5px;
  }
  .dataTable {
    font-size: 28px !important;
  }
</style>

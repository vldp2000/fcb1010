<template>
  <v-layout>
    <v-flex class="ml-2">
      <custom-panel title="Banks of Instruments">
        <v-data-table
          :headers="headers"
          :items="instrumentBankList"
          sort-by="refInstrument"
          class="elevation-1"
          hide-default-footer
          item-key="id"
          disable-pagination
        >
          <template v-slot:item.instrument="{ item }">
            <v-chip color="blue" dark>{{ instrumentList.find(i => i.id === item.refinstrument).name }}</v-chip>
          </template>
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>Banks Instruments</v-toolbar-title>
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
                          <v-text-field v-model="editedItem.number" label="Number"></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-select
                          label="Instrument"
                          v-model="editedItem.refinstrument"
                          :items="instrumentList"
                          required
                          item-text="name"
                          item-value="id">
                        </v-select>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="cyan darken-1" text @click="closeDialog">Cancel</v-btn>
                    <v-btn color="cyan darken-1" text @click="save">Save</v-btn>
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
// import InstrumentBankService from '@/services/InstrumentBankService'
// import InstrumentsService from '@/services/InstrumentsService'

export default {
  data () {
    return {
      instrumentBanks: [],
      dialog: false,
      headers: [
        {
          text: 'Name',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: 'Number', value: 'number' },
        { text: 'refInstrument', value: 'refinstrument' },
        { text: 'Instrument', value: 'instrument' },
        { text: 'Actions', value: 'action', sortable: false }
      ],

      editedIndex: -1,
      editedItem: {
        id: -1,
        name: '',
        number: 0,
        refinstrument: -1
      },
      defaultItem: {
        id: -1,
        name: '',
        number: 0,
        refinstrument: -1
      },
      selected: []
    }
  },

  // mounted () {
  //   this.init()
  // },

  computed: {
    ...mapState(['instrumentBankList', 'instrumentList']),
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    }
  },

  watch: {
    instrumentBankList: function (newValue, oldValue) {
      this.instrumentBanks = newValue
    },
    dialog: function (val) {
      val || this.closeDialog()
    }
  },

  methods: {
    editItem (item) {
      this.editedIndex = this.instrumentBankList.indexOf(item)
      this.editedItem = Object.assign({}, item)
      //this.$log.debug(this.editedItem)
      this.dialog = true
    },

    deleteItem (item) {
      const index = this.instrumentBanks.indexOf(item)
      confirm('Are you sure you want to delete this item?') && this.instrumentBanks.splice(index, 1)
    },

    closeDialog () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    save () {
      //this.$log.debug('save Instrument bank -------')
      //this.$log.debug(this.editedItem)
      if (this.editedIndex > -1) {
        try {
          this.$store.dispatch('updateInstrumentBank', this.editedItem)
        } catch (err) {
          this.$log.debug(err)
        }
      } else {
        try {
          this.$store.dispatch('addInstrumentBank', this.editedItem)
        } catch (err) {
          this.$log.debug(err)
        }
      }
      this.closeDialog()
    }
  }
}
</script>

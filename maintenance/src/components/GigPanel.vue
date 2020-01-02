<template>
  <custom-panel title="Gigs">
    <v-data-table
      @pagination="pagination = $event"
      :headers="headers"
      :items="gigList"
      sort-by="name"
      class="elevation-1"
    >

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
import GigsService from '@/services/GigsService'

export default {
  data () {
    return {
      dialog: false,
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
        name: '',
        gigdate: '',
        id: -1
      },
      defaultItem: {
        name: '',
        gigdate: '',
        id: -1
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
      reactive: true
    }
  },
  computed: {
    ...mapState(['gigList']),
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    }
  },

  watch: {
    // gigList: function (newValue, oldValue) {
    // this.gigs = newValue
    // },
    dialog: function (val) {
      val || this.closeDialog()
    }
  },

  methods: {
    editItem (item) {
      console.log(item)
      this.editedIndex = this.gigList.indexOf(item)
      console.log(this.editedIndex)
      this.editedItem = Object.assign({}, item)
      console.log(this.editedItem)
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
      console.log('saveGig () -------')
      console.log(this.editedItem)
      if (this.editedIndex > -1) {
        try {
          GigsService.put(this.editedItem)
        } catch (err) {
          console.log(err)
        }
      } else {
        try {
          GigsService.post(this.editedItem)
        } catch (err) {
          console.log(err)
        }
      }
      this.closeDialog()
    },
    async init () {
      console.log(this.gigList.length)
      // if (!this.$store.state.gigList || this.$store.state.gigList === undefined || !this.$store.state.gigList.Length) {
      if (this.gigList.length === 0) {
        console.log('Init gig list storage')
        let result = await GigsService.getAll()
        let list = await result.data
        // console.log('<< Init Gig List?>>')
        await this.$store.dispatch('setGigList', list)
        // console.log(this.$store.state.gigList)
      } else {
        console.log(' Gig List already populated')
      }
    }

  },
  mounted () {
    this.init()
  }

}
</script>

<style>
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

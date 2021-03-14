<template>
  <v-card
    class="mx-auto ma-0 pa-0"
    max-width="400"
  >
    <v-container v-bind:class="view-mode ma-0 pa-0" fluid>
      <v-row no-gutters>
        <div>
          <h1>ABC</h1>
        </div>
        <div class="instrumentImage">
          <v-img :src="imageURL" />
        </div>
      </v-row>
      <v-row no-gutters>
        <div>
          <h1>DEF</h1>
        </div>
        <div class="presetName"
          v-bind:class="(volume > 0) ? 'active' : 'inactive'"
          <b>{{ getPresetName() }}</b>
        </div>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import _sortBy from 'lodash/sortBy'

export default {
  props: {
    presetControlData: {
      type: Object
    },
    programIdx: {
      type: Number,
      default: -1
    }
  },
  data () {
    return {
      dialog: false,
      imageURL: '',
      presets: {},
      presetId: -1,

      songPreset: {
        id: -1,
        refsong: -1,
        refsongprogram: -1,
        refinstrument: -1,
        refinstrumentbank: -1,
        refpreset: -1,
        volume: 0,
        pan: 0,
        muteflag: 0,
        reverbflag: 0,
        delayflag: 0,
        modeflag: 0,
        reverbvalue: 0,
        delayvalue: 0
      }
    }
  },
  computed: {
    ...mapState(['presetList', 'instrumentList', 'instrumentBankList', 'songList', 'presetVolumeFromController']),
  },

  watch: {
    presetControlData: function () {
      if (this.presetControlData && this.presetControlData.id > -1) {
        Object.assign(this.songPreset, this.presetControlData)
        if (typeof this.songPreset !== 'undefined' && this.songPreset.refpreset > -1) {
          if (typeof this.instrumentList !== 'undefined' && this.instrumentList &&
            this.songPreset.refinstrument > 0) {
            const instrument = this.instrumentList.find(item => item.id === this.songPreset.refinstrument)
            this.imageURL = instrument.imageURL
            this.populatePresetList(this.songPreset.refinstrument)
          }
        } else {
          this.$log.debug('------------- empty -----')
          // this.$log.debug(this.songPreset)
        }
      }
    }
  },

  methods: {
    getPresetName () {
      if (typeof this.presetList === 'undefined' || this.presetList === null ||
        typeof this.songPreset === 'undefined' || this.songPreset === null ||
        typeof this.instrumentList === 'undefined' || this.instrumentList === null) {
        return {}
      }
      const pr = this.presetList.find(item => item.id === this.songPreset.refpreset)
      if (typeof pr === 'undefined') {
        return {}
      }
      // this.$log.debug(pr.name)
      return pr.name
    },

    async populatePresetList (id) {
      if (typeof this.presetList !== 'undefined' && this.presetList !== null &&
        typeof this.songPreset !== 'undefined' && this.songPreset !== null) {
        // this.$log.debug('---get--preset--------------')
        let list = await this.presetList.filter(item => item.refinstrument === id)
        this.presets = await _sortBy(list, 'name')
        // this.$log.debug(this.presets)
      }
    },
    setPreset () {
      const preset = this.presetList.find(item => item.id === this.presetId)
      // this.$log.debug('---set-preset---------------')
      // this.$log.debug(preset)
      if (preset) {
        this.songPreset.refpreset = this.presetId
        this.songPreset.refinstrumentbank = preset.refinstrumentbank
        this.songPreset.refinstrument = preset.refinstrument
        if (preset.midipc === 0) {
          this.songPreset.volume = 0
          this.songPreset.pan = 64
        }

        this.dialog = false
      }
    },
    getBaseColor () {
      if (this.songPreset && this.songPreset.volume > 0) return 'snow'
      else return 'gray'
    },
  }
}
</script>

<style>
  .active {
    color:white
  }
  .inactive {
    color:gray
  }
  .presetName {
    display: flex;
    margin: 0px;
    padding: 0px;
    /* justify-content: flex-start; */
    /* align-items: flex-end; */
    /*flex-direction: column;*/
    height: 100px;
  }
  .custom-text-input {
    width: 65px;
  }
  .inputpanel {
    margin-left: 10px;
  }
  .valueInput {
    width: 80px;
  }
  .instrumentImage {
    height: 40px;
    width: 40px;
    margin-top: 5px;
    margin-left: 5px;
    padding-bottom: -5px;
  }
  .view-mode {
    background-color:rgba(36, 34, 34, 0.830)
  }
</style>

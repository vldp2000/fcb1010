
<template>
  <v-card
    class="mx-auto ma-0 pa-0"
    max-width="400"
  >
    <v-container v-bind:class="(editMode) ? 'edit-mode ma-0 pa-0' : 'view-mode ma-0 pa-0'" fluid>
      <v-row no-gutters>
          <v-col cols=2>
            <div class="instrumentImage">
              <v-img :src="imageURL" @click="onIconClick()"/>
            </div>
            <div class="saveSongPreset()">
              <v-icon
                v-if="editMode"
                class="mr-2 ma-0 pa-0"
                @click="saveSongPreset()"
              >
              save
              </v-icon>
            </div>
          </v-col>
          <v-col cols=10>
            <div class="presetName"
              v-bind:class="(volume > 0) ? 'active' : 'inactive'"
              @click="onPresetClick()">
              <b>{{ getPresetName() }}</b>
            </div>
          </v-col>
      </v-row>

      <v-row no-gutters>
        <div class="customKnob">
          <my-knob
            v-model='volume'
            :editMode='editMode'
            :activeVolumePedal='activeVolumePedal'
            knobLabel='Vol'
            :base-color='getBaseColor()'
          />
        </div>
        <div class="customKnob">
          <my-knob
            v-model='pan'
            :editMode='editMode'
            knobLabel='Pan'
            :base-color='getBaseColor()'
          />
        </div>
        <div class="ma=0 pa=0">
            <v-checkbox :readonly="!editMode"
              v-if="volume > 0"
              class="ma-0 pa-0 checkbox"
              dense hide-details
              label="Mute"
              :disabled="volume == 0"
              v-model="songPreset.muteflag" />
            <v-checkbox
              v-if="volume > 0"
              :readonly="!editMode"
              class="ma-0 pa-0 checkbox"
              dense hide-details
              label="Del"
              :disabled="volume == 0"
              v-model="songPreset.delayflag" />
            <v-checkbox
              v-if="volume > 0"
              :readonly="!editMode"
              class="ma-0 pa-0 checkbox"
              dense hide-details
              label="Rev"
              :disabled="volume == 0"
              v-model="songPreset.reverbflag" />
        </div>
        <div class="inputpanel">
          <div>
            <v-checkbox
              v-if="volume > 0"
              :readonly="!editMode"
              class="ma-0 pa-0 checkbox"
              dense hide-details
              label="Mode"
              :disabled="volume == 0"
              v-model="songPreset.modeflag" />
          </div>
          <div class="valueInput">
            <custom-text-input
              v-if="volume > 0"
              :editMode='editMode'
              v-model="songPreset.delayvalue" />
          </div>
          <div class="valueInput">
            <custom-text-input
              v-if="volume > 0"
              :editMode='editMode'
              v-model="songPreset.reverbvalue" />
          </div>
        </div>
          <v-dialog v-if="editMode"  v-model="dialog" persistent max-width="600px">
            <v-card>
              <v-card-title class="headline">Preset</v-card-title>
              <div>
                <v-select
                  class="ml-10 mr-10"
                  :items="presets"
                  v-model="presetId"
                  label="Preset"
                  required
                  item-text="name"
                  item-value="id">
                ></v-select>
              </div>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="green darken-1"
                  text
                  @click="dialog = false"
                >
                  Cancel
                </v-btn>

                <v-btn
                  color="green darken-1"
                  text
                  @click="setPreset()"
                >
                  OK
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
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
    activeVolumePedal: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      editMode: false,
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
  // created () {
  //   Object.assign(this.songPreset, this.presetControlData)
  // },

  computed: {
    ...mapState(['presetList', 'instrumentList', 'instrumentBankList', 'songList']),

    volume: {
      get () {
        return this.songPreset.volume
      },
      set (val) {
        this.songPreset.volume = val
      }
    },
    pan: {
      get () {
        if (this.songPreset && this.songPreset.volume > 0) return this.songPreset.pan
        else return 0
      },
      set (val) {
        this.songPreset.pan = val
      }
    }
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
          this.$log.debug(this.songPreset)
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
    saveSongPreset () {
      this.$log.debug(this.songPreset)
      this.$store.dispatch('updateSongProgramPreset', this.songPreset)
      this.editMode = false
      this.$emit('changed', true)
    },
    onIconClick () {
      this.editMode = !this.editMode
      this.presetId = this.songPreset.refpreset
    },
    onPresetClick () {
      if (this.editMode) {
        // this.$log.debug(this.presets)
        this.dialog = true
      }
    },
    getBaseColor () {
      if (this.songPreset && this.songPreset.volume > 0) return 'snow'
      else return 'gray'
    }
  }
}
</script>

<style>
  .customKnob {
    height: 60px;
    width: 60px;
    margin-top: 15px;
    margin-right: 5px;
  }
  .customControls {
    height: 60px;
  }
  /* .v-label {
    font-size: 8px;
  } */

  .active {
    color:azure
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
    flex-direction: column;
    height: 40px;
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
  .checkbox label {
    font-size: 10px!important;
    margin-left: -10px!important;
    padding: 0px!important;
  }

  .view-mode {
    background-color:rgba(36, 34, 34, 0.830)
  }
  .edit-mode {
    background-color:rgba(57, 57, 66, 0.83)
  }
</style>

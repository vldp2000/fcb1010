
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
                @click="savePreset()"
              >
              save
              </v-icon>

            </div>
          </v-col>
          <v-col cols=10>
            <div class="presetName" @click="onPresetClick()">
              <b>{{ getPresetName() }}</b>
            </div>
          </v-col>
      </v-row>

      <v-row no-gutters>
        <div class="customKnob">
          <my-knob
            :value='parseInt(presetControlData.volume,10)'
            :editMode='editMode'
            knobLabel='Vol'
          />
        </div>

        <div class="customKnob">
          <my-knob
            :value="parseInt(presetControlData.pan,10)"
            :editMode='editMode'
            knobLabel='Pan'
          />
        </div>
        <div class="ma=0 pa=0">
            <v-checkbox :readonly="!editMode" class="ma-0 pa-0 checkbox" dense hide-details  label="Mute" v-model="presetControlData.muteflag" />
            <v-checkbox :readonly="!editMode" class="ma-0 pa-0 checkbox" dense hide-details  label="Del" v-model="presetControlData.delayflag" />
            <v-checkbox :readonly="!editMode" class="ma-0 pa-0 checkbox" dense hide-details  label="Rev" v-model="presetControlData.reverbflag" />
        </div>
        <div class="inputpanel">
          <div>
            <v-checkbox :readonly="!editMode" class="ma-0 pa-0 checkbox" dense hide-details  label="Mode" v-model="presetControlData.reverbflag" />
          </div>
          <div class="valueInput">
            <custom-text-input :editMode='editMode' v-model="presetControlData.delayvalue" />
          </div>
          <div class="valueInput">
            <custom-text-input :editMode='editMode' v-model="presetControlData .reverbvalue" />
          </div>
        </div>
          <v-dialog v-if="editMode"  v-model="dialog" persistent max-width="600px">
            <v-card>
              <v-card-title class="headline">Preset</v-card-title>
              <div>
                <v-select
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

export default {
  props: {
    presetControlData: {
      type: Object
    }
  },
  data () {
    return {
      editMode: false,
      dialog: false,
      currentPreset: null,
      imageURL: '',
      presets: {}
    }
  },
  computed: {
    ...mapState(['presetList', 'instrumentList', 'instrumentBankList', 'songList']),
    presetId: {
      get () { return this.currentPreset.refpreset },
      set (value) { this.currentPreset.refpreset = value }
    }
  },
  watch: {
    presetControlData: function () {
      if (typeof this.presetControlData !== 'undefined' && this.presetControlData.refpreset > -1) {
        // console.log('--WATCH presetControlData<<<-->>')
        this.currentPreset = this.presetControlData
        this.getPresets(this.currentPreset.refinstrument)
        this.presetId = this.currentPreset.refpreset
        // console.log(this.currentPreset)
        // console.log(this.currentPreset.refinstrument)
        // console.log(this.presetId)
        // console.log(this.presetList)

        if (typeof this.instrumentList === 'undefined' || this.instrumentList === null) {
          console.log('--instrument list is not ready->>')
        } else {
          // console.log(this.currentPreset)
          // console.log(this.instrumentList)
          if (this.presetControlData.refinstrument > 0) {
            const instrument = this.instrumentList.find(item => item.id === this.currentPreset.refinstrument)
            // console.log(instrument)
            this.imageURL = instrument.imageURL
            // console.log(this.imageURL)
          }
        }
      }
    }
  },

  methods: {
    getPresetName () {
      // const pr = this.getPresetById(this.preset.id)
      if (typeof this.presetList === 'undefined' || this.presetList === null ||
        typeof this.presetControlData === 'undefined' || this.presetControlData === null ||
        typeof this.instrumentList === 'undefined' || this.instrumentList === null) {
        return {}
      }

      // console.log(this.preset)
      const pr = this.presetList.find(item => item.id === this.presetControlData.refpreset)
      if (typeof pr === 'undefined') {
        return {}
      }
      return pr.name
    },

    getPresets (id) {
      if (typeof this.presetList !== 'undefined' && this.presetList !== null &&
        typeof this.presetControlData !== 'undefined' && this.presetControlData !== null) {
        console.log('-------------------')
        this.presets = this.presetList.filter(item => item.refinstrument === id)
        console.log(this.presets)
      }
    },
    setPreset () {
      const preset = this.presetList.find(item => item.id === this.presetId)
      console.log(preset)
      if (preset) {
        this.presetControlData.refpreset = this.presetId
        this.presetControlData.refinstrumentbank = preset.refinstrumentbank
        this.presetControlData.refinstrument = preset.refinstrument
        this.presetControlData.volume = 127
        this.presetControlData.pan = 64
        this.presetControlData.muteflag = 1
        this.presetControlData.reverbflag = 1
        this.presetControlData.delayflag = 1
        this.presetControlData.modeflag = 1
        this.presetControlData.reverbvalue = 0
        this.presetControlData.delayvalue = 0
        this.dialog = false
      }
    },
    saveSongPreset () {
      const preset = this.presetControlData
      console.log(preset)
      // save song preset
      this.dialog = false
    },
    onIconClick () {
      this.editMode = !this.editMode
      this.presetId = this.presetControlData.refpreset
    },
    onPresetClick () {
      if (this.editMode) {
        console.log(this.presets)
        this.dialog = true
      }
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

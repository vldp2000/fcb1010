
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
import SongsService from '@/services/SongsService'

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
      songPreset: null,
      imageURL: '',
      presets: {},
      presetId: -1
    }
  },

  computed: {
    ...mapState(['presetList', 'instrumentList', 'instrumentBankList', 'songList'])
  },

  watch: {
    // presetId: function () {
    //   this.songPreset.refpreset = this.presetId
    // },
    presetControlData: function () {
      this.songPreset = this.presetControlData

      if (typeof this.songPreset !== 'undefined' && this.songPreset.refpreset > -1) {
        console.log('--WATCH songPreset<<<-->>')

        this.getPresets(this.songPreset.refinstrument)
        // this.presetId = this.songPreset.refpreset
        // console.log(this.songPreset)
        // console.log(this.songPreset.refinstrument)
        // console.log(this.presetId)
        // console.log(this.presetList)

        if (typeof this.instrumentList === 'undefined' || this.instrumentList === null) {
          console.log('--instrument list is not ready->>')
        } else {
          // console.log(this.songPreset)
          // console.log(this.instrumentList)
          if (this.songPreset.refinstrument > 0) {
            const instrument = this.instrumentList.find(item => item.id === this.songPreset.refinstrument)
            console.log(instrument)
            this.imageURL = instrument.imageURL
            console.log(this.imageURL)
          }
        }
      } else {
        console.log('------------- empty -----')
        console.log(this.songPreset)
      }
    }
  },

  methods: {
    getPresetName () {
      // const pr = this.getPresetById(this.preset.id)
      // console.log(this.songPreset)
      if (typeof this.presetList === 'undefined' || this.presetList === null ||
        typeof this.songPreset === 'undefined' || this.songPreset === null ||
        typeof this.instrumentList === 'undefined' || this.instrumentList === null) {
        return {}
      }
      // console.log('---get--preset-name-------------')
      const pr = this.presetList.find(item => item.id === this.songPreset.refpreset)
      if (typeof pr === 'undefined') {
        return {}
      }
      // console.log(pr.name)
      return pr.name
    },

    getPresets (id) {
      if (typeof this.presetList !== 'undefined' && this.presetList !== null &&
        typeof this.songPreset !== 'undefined' && this.songPreset !== null) {
        // console.log('---get--preset--------------')
        this.presets = this.presetList.filter(item => item.refinstrument === id)
        // console.log(this.presets)
      }
    },
    setPreset () {
      const preset = this.presetList.find(item => item.id === this.presetId)
      // console.log('---set-preset---------------')
      // console.log(preset)
      if (preset) {
        this.songPreset.refpreset = this.presetId
        this.songPreset.refinstrumentbank = preset.refinstrumentbank
        this.songPreset.refinstrument = preset.refinstrument
        this.songPreset.volume = 127
        this.songPreset.pan = 64
        this.songPreset.muteflag = 1
        this.songPreset.reverbflag = 1
        this.songPreset.delayflag = 1
        this.songPreset.modeflag = 1
        this.songPreset.reverbvalue = 0
        this.songPreset.delayvalue = 0
        this.dialog = false
      }
    },
    saveSongPreset () {
      console.log('---save-preset---------------')
      console.log(this.songPreset)
      // save song preset
      SongsService.putSongPreset(this.songPreset)
      this.dialog = false
    },
    onIconClick () {
      this.editMode = !this.editMode
      this.presetId = this.songPreset.refpreset
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

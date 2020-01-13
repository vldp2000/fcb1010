
<template>
  <v-card
    class="mx-auto"
    max-width="400"
  >
  <v-container class="pa-0 ma-0" fluid>
    <v-row no-gutters>
      <v-col cols=3>
        <div class="instrumentImage">
          <v-img :src="imageURL"/>
        </div>
      </v-col>
      <v-col cols=9>
        <div class="presetName">
          <b>{{ getPresetName() }}</b>
        </div>
      </v-col>
    </v-row>

      <v-row no-gutters>

        <div class="customKnob">
          <custom-knob
            :value='parseInt(presetControlData.volume,10)'
            knobLabel='Vol'
          />
        </div>

        <div class="customKnob">
          <custom-knob
            :value="parseInt(presetControlData.pan,10)"
            knobLabel='Pan'
          />
        </div>
        <div>
            <v-checkbox class="ma-0 pa-0" dense hide-details  label="Mute" v-model="presetControlData.muteflag" />
            <v-checkbox class="ma-0 pa-0" dense hide-details  label="Del" v-model="presetControlData.delayflag" />
            <v-checkbox class="ma-0 pa-0" dense hide-details  label="Rev" v-model="presetControlData.reverbflag" />
        </div>
        <div class="inputpanel">
          <div>
            <v-checkbox class="ma-0 pa-0" dense hide-details  label="Mode" v-model="presetControlData.reverbflag" />
          </div>
          <div class="valueInput">
            <custom-text-input v-model="presetControlData.delayvalue" />
          </div>
          <div class="valueInput">
            <custom-text-input v-model="presetControlData .reverbvalue" />
          </div>
        </div>
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
      currentPreset: null,
      imageURL: ''
    }
  },
  computed: {
    ...mapState(['presetList', 'instrumentList', 'instrumentBankList', 'songList'])
  },
  watch: {
    presetControlData: function () {
      if (typeof this.presetControlData !== 'undefined') {
        // console.log('--WATCH presetControlData<<<-->>')
        this.currentPreset = this.presetControlData
        if (typeof this.instrumentList === 'undefined' || this.instrumentList === null) {
          console.log('--instrument list is not ready->>')
        } else {
          console.log(this.currentPreset)
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

  mounted () {
    if (typeof this.presetControlData !== 'undefined' && this.presetControlData !== null) {
      this.currentPreset = this.presetControlData
      console.log('-----presetControlData was MOUNTED >>>>')
      console.log(this.presetControlData)
      console.log(this.currentPreset)
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
  .v-label {
    font-size: 10px;
  }

  .presetName {
    display: flex;
    /* justify-content: flex-start; */
    /* align-items: flex-end; */
    flex-direction: column;
    height: 40px;
  }
  .custom-text-input {
    width: 70px;
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
</style>


<template>
  <v-card
    class="mx-auto"
    max-width="400"
  >
  <v-container class="px-0" fluid>
    <v-row no-gutters>
      <v-col cols=3>
        <div class="presetName">
          <v-img height="55" width="55" margine-right="10" :src="item.imageURL"/>
        </div>
      </v-col>
      <v-col cols=9>
        <b>Preset Accouatic guitar</b>
      </v-col>
    </v-row>

      <v-row no-gutters>

        <div class="customKnob">
          <custom-knob
            :value='parseInt(90,10)'
            knobLabel='Vol'
          />
        </div>

        <div class="customKnob">
          <custom-knob
            :value="parseInt(80,10)"
            knobLabel='Pan'
          />
        </div>
        <div>
            <v-checkbox class="ma-0 pa-0" dense hide-details  label="Mute" v-model="item.muteflag" />
            <v-checkbox class="ma-0 pa-0" dense hide-details  label="Del" v-model="item.delayflag" />
            <v-checkbox class="ma-0 pa-0" dense hide-details  label="Rev" v-model="item.reverbflag" />
        </div>
        <div class="textInput">
            <custom-text-input
              v-model="item.delayvalue" />
            <custom-text-input
              v-model="item.delayvalue" />
            <custom-text-input
              v-model="item.delayvalue" />
        </div>
      </v-row>

    </v-container>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      item: {
        id: 1,
        refsong: 1,
        refsongprogram: 1,
        refinstrument: 3,
        refinstrumentbank: 1,
        refpreset: 1,
        volume: 0,
        pan: 64,
        muteflag: 1,
        reverbflag: 0,
        delayflag: 0,
        modeflag: 0,
        reverbvalue: 1,
        delayvalue: 1,
        imageURL: '/img/image_01.3f6122bf.png'
      }
    }
  },
  computed: {
    ...mapState(['presetList', 'instrumentList', 'instrumentBankList'])
  }
}
</script>
<style>
  .customKnob {
    height: 60px;
    width: 60px;
    margin-top: 10px;
    margin-right: 10px;
  }
  .customControls {
    height: 60px;
  }
  .v-label {
    font-size: 10px;
  }
  .v-text-field input {
    font-size: 0.8em;
  }
  .v-text-field {
    margin: 5px;
    /* height: 10px; */
  }
  .presetName {
    display: flex;
    /* justify-content: flex-start; */
    /* align-items: flex-end; */
    flex-direction: column;
  }
  .custom-text-input {
    margin: 4px;
  }
  .textInput {
    margin-left: 10px;
    margin-inline: 2px;
    width: 30px;
  }

</style>

<template>
  <v-card  dark v-bind:class="(currentProgramIdx === 0) ? 'presetControlSelected' : 'presetControl'">
    <preset-control :presetControlData='defaultPreset'/>
  </v-card>
</template>

<script>

export default {
  data () {
    return {
      currentProgramIdx: 0,
      defaultPreset: {
        id: 1,
        refsong: 1,
        refsongprogram: 1,
        refinstrument: 1,
        refinstrumentbank: 1,
        refpreset: 1,
        volume: 100,
        pan: 50,
        muteflag: 1,
        reverbflag: 0,
        delayflag: 1,
        modeflag: 0,
        reverbvalue: 101,
        delayvalue: 200
      }
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
  .v-data-table th {
    font-size: 16px;
  }
  .v-data-table td {
    font-size: 20px;
  }

</style>

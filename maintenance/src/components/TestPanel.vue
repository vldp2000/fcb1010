<template>
      <div class="customKnob">
        <my-knob
          :value="parseInt(vl,10)"
          knobLabel='Vol'
          :min='parseInt(0,10)'
          :max='parseInt(127,10)'
        />
      </div>
</template>

<script>

export default {

  data () {
    return {
      vl: 50
    }
  }
}

</script>

<style scoped>
  .customKnob {
    /* allow the text to take all the available space in the svg on top of the gauge */
    height: 100%;
    width: 100%;
    /* text-align: center;
    margin-top: 50px;
    font-size: 50px !important; */
  }

</style>

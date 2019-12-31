<template>
  <div class="customknob">
    <vue-svg-gauge
      :start-angle='startAngle'
      :end-angle='endAngle'
      :value='parseInt(value,10)'
      :separator-step='separatorStep'
      :min='min'
      :max='max'
      :gauge-color='gaugeColor'
      :scale-interval='scaleInterval'>
      <div class="inner-text">
        <span><b>{{ value }}</b></span>
      </div>
    </vue-svg-gauge>
  </div>
</template>

<script>

// import knobProps from './CustomKnobProps.js'

export default {
  name: 'CustomKnob',

  data () {
    return {
      currentValue: 0
    }
  },

  props: {
    value: {
      type: Number,
      default: 0
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 127
    },
    startAngle: {
      type: Number,
      default: -110
    },
    endAngle: {
      type: Number,
      default: 110
    },
    innerRadius: {
      type: Number,
      default: 60
    },
    separatorStep: {
      type: Number,
      default: 10
    },
    separatorThickness: {
      type: Number,
      default: 4
    },
    gaugeColor: {
      type: [Array, String],
      default: () => ([
        { offset: 0, color: '#347AB0' },
        { offset: 100, color: '#8CDFAD' }
      ])
    },
    baseColor: {
      type: String,
      default: '#DDDDDD'
    },
    easing: {
      type: String,
      default: 'Circular.Out'
    },
    scaleInterval: {
      type: Number,
      default: 5
    },
    transitionDuration: {
      type: Number,
      default: 500
    }
  },
  watch: {
    immediate: true,
    value: function (newValue, oldValue) {
      this.currentValue = newValue
      console.log(oldValue)
      console.log(newValue)
    }
  }

}
</script>

<!--  change style to calculate the position of the inner text automatically  -->
<style>
.inner-text {
    height: 100%;
    width: 100%;
    text-align: center;
    margin-top: 50px;
    font-size: 50px !important;
  }
 </style>

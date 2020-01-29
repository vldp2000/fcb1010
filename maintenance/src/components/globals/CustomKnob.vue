<template>
  <div class="customknob">
    <!-- <v-row align-center style="background-color:#ffffff;"> -->
    <vue-svg-gauge
      :start-angle='startAngle'
      :end-angle='endAngle'
      :value='parseInt(value,10)'
      :separator-step='separatorStep'
      :min='min'
      :max='max'
      :gauge-color='gaugeColor'
      :scale-interval='scaleInterval'>
      <div>
        <div class="inner-text">
          <b class="custom-label1 custom-label">{{ value }}</b>
        </div>
        <div class="inner-text">
          <b class="custom-label2 custom-label">{{ knobLabel }}</b>
        </div>
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
        // { offset: 0, color: '#347AB0' },
        // { offset: 100, color: '#8CDFAD' }  'rgba(238, 3, 54, 0.945)'
        { offset: 0, color: 'lightblue' },
        { offset: 50, color: 'blue' }
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
    },
    knobLabel: {
      type: String,
      default: ''
    }
  },
  watch: {
    immediate: true,
    value: function (newValue, oldValue) {
      this.currentValue = newValue
      // console.log(oldValue)
      // console.log(newValue)
    }
  }

}
</script>

<!--  change style to calculate the position of the inner text automatically  -->
<style scoped>

.custom-label {
  display: flex;
  align-items: center;
  justify-content: center;

  display: -webkit-flex;
  -webkit-box-align: center;

  display: -ms-flexbox;
  -ms-flex-align: center;
}
.custom-label1 {
  padding-top: 50px!important;
  font-size: 45px!important;
  /* -webkit-padding-start: 0px; */
}
.custom-label2 {
  margin-top: -15px!important;
  font-size: 30px!important;
}
 </style>

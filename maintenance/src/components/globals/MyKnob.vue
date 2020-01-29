<template>
  <div
    class="customknob"
    d="info-box"
    ref="infoBox"
    @mousedown="moveStart"
    @touchstart="moveStart"
  >
    <vue-svg-gauge
      :start-angle='startAngle'
      :end-angle='endAngle'
      :value='parseInt(currentValue,10)'
      :separator-step='separatorStep'
      :min='min'
      :max='max'
      :gauge-color='gaugeColor'
      :scale-interval='scaleInterval'>
      <div>
        <div class="inner-text">
          <b class="custom-label1 custom-label">{{ currentValue }}</b>
        </div>
        <div class="inner-text">
          <b class="custom-label2 custom-label">{{ knobLabel }}</b>
        </div>
      </div>
    </vue-svg-gauge>
  </div>
</template>

<script>

export default {
  name: 'MyKnob',

  data () {
    return {

      flag: false,
      size: 0,
      currentValue: 0,
      isComponentExists: true,
      interval: 1,
      lazy: false,
      realTime: false
    }
  },

  props: {
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
      default: 800
    },
    knobLabel: {
      type: String,
      default: ''
    },

    // --------- swipe
    data: {
      type: Array,
      default: null
    },
    id: {
      type: String,
      default: 'wrap'
    },
    range: {
      type: Array,
      default: null
    },
    speed: {
      type: Number,
      default: 0.5
    },
    value: {
      type: [String, Number],
      default: 0
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    draggable: {
      type: Boolean,
      default: true
    },
    paddingless: {
      type: Boolean,
      default: false
    }

  },
  watch: {
    immediate: true,

    value (val) {
      if (this.flag) this.setValue(val)
      else this.setValue(val, this.speed)
    },
    max (val) {
      if (val < this.min) {
        return this.printError('[VueSlideBar error]: The maximum value can not be less than the minimum value.')
      }
      let resetVal = this.limitValue(this.val)
      this.setValue(resetVal)
      this.refresh()
    },
    min (val) {
      if (val > this.max) {
        return this.printError('[VueSlideBar error]: The minimum value can not be greater than the maximum value.')
      }
      let resetVal = this.limitValue(this.val)
      this.setValue(resetVal)
      this.refresh()
    }
  },

  computed: {

    val: {
      get () {
        return this.data ? this.data[this.currentValue] : this.currentValue
      },
      set (val) {
        if (this.data) {
          let index = this.data.indexOf(val)
          if (index > -1) {
            this.currentValue = index
          }
        } else {
          this.currentValue = val
        }
      }
    },
    currentIndex () {
      return (this.currentValue - this.minimum) / this.spacing
    },
    indexRange () {
      return [0, this.currentIndex]
    },
    minimum () {
      return this.data ? 0 : this.min
    },
    maximum () {
      return this.data ? (this.data.length - 1) : this.max
    },
    multiple () {
      let decimals = `${this.interval}`.split('.')[1]
      return decimals ? Math.pow(10, decimals.length) : 1
    },
    spacing () {
      return this.data ? 1 : this.interval
    },
    total () {
      if (this.data) {
        return this.data.length - 1
      } else if (Math.floor((this.maximum - this.minimum) * this.multiple) % (this.interval * this.multiple) !== 0) {
        this.printError('[VueSlideBar error]: Prop[interval] is illegal, Please make sure that the interval can be divisible')
      }
      return (this.maximum - this.minimum) / this.interval
    },
    gap () {
      return this.size / this.total
    },
    position () {
      return ((this.currentValue - this.minimum) / this.spacing * this.gap)
    },
    limit () {
      return [0, this.size]
    },
    valueLimit () {
      return [this.minimum, this.maximum]
    }
  },

  methods: {
    bindEvents () {
      document.addEventListener('touchmove', this.moving, { passive: false })
      document.addEventListener('touchend', this.moveEnd, { passive: false })
      document.addEventListener('mousemove', this.moving)
      document.addEventListener('mouseup', this.moveEnd)
      document.addEventListener('mouseleave', this.moveEnd)
      window.addEventListener('resize', this.refresh)
    },
    unbindEvents () {
      window.removeEventListener('resize', this.refresh)
      document.removeEventListener('touchmove', this.moving)
      document.removeEventListener('touchend', this.moveEnd)
      document.removeEventListener('mousemove', this.moving)
      document.removeEventListener('mouseup', this.moveEnd)
      document.removeEventListener('mouseleave', this.moveEnd)
    },
    getPos (e) {
      let result = e.clientX - this.offset
      return result
    },
    wrapClick (e) {
      if (this.isDisabled || (!this.draggable && e.target.id === this.id)) return false
      let pos = this.getPos(e)
      this.setValueOnPos(pos)
    },
    moveStart (e, index) {
      if (!this.draggable) return false
      this.flag = true
      this.$emit('dragStart', this)
    },
    moving (e) {
      if (!this.flag || !this.draggable) return false
      e.preventDefault()
      if (e.targetTouches && e.targetTouches[0]) e = e.targetTouches[0]
      this.setValueOnPos(this.getPos(e), true)
    },
    moveEnd (e) {
      if (this.flag && this.draggable) {
        this.$emit('dragEnd', this)
      } else {
        return false
      }
      this.flag = false
    },
    setValueOnPos (pos, isDrag) {
      let range = this.limit
      let valueRange = this.valueLimit
      if (pos >= range[0] && pos <= range[1]) {
        let v = (Math.round(pos / this.gap) * (this.spacing * this.multiple) + (this.minimum * this.multiple)) / this.multiple
        this.setCurrentValue(v, isDrag)
      } else if (pos < range[0]) {
        this.setCurrentValue(valueRange[0])
      } else {
        this.setCurrentValue(valueRange[1])
      }
    },
    isDiff (a, b) {
      if (Object.prototype.toString.call(a) !== Object.prototype.toString.call(b)) {
        return true
      } else if (Array.isArray(a) && a.length === b.length) {
        return a.some((v, i) => v !== b[i])
      }
      return a !== b
    },
    setCurrentValue (val, bool) {
      if (bool) {
        if (val < this.minimum || val > this.maximum) return false
        if (this.isDiff(this.currentValue, val)) {
          this.currentValue = val
        }
      }
    },
    setIndex (val) {
      val = this.spacing * val + this.minimum
      this.setCurrentValue(val)
    },
    setValue (val, speed) {
      if (this.isDiff(this.val, val)) {
        let resetVal = this.limitValue(val)
        this.val = resetVal
      }
    },

    limitValue (val) {
      if (this.data) {
        return val
      }
      const inRange = (v) => {
        if (v < this.min) {
          this.printError(`[VueSlideBar warn]: The value of the slider is ${val}, the minimum value is ${this.min}, the value of this slider can not be less than the minimum value`)
          return this.min
        } else if (v > this.max) {
          this.printError(`[VueSlideBar warn]: The value of the slider is ${val}, the maximum value is ${this.max}, the value of this slider can not be greater than the maximum value`)
          return this.max
        }
        return v
      }
      return inRange(val)
    },
    getValue () {
      return this.val
    },
    getIndex () {
      return this.currentIndex
    },
    getStaticData () {
      if (this.$refs.infoBox) {
        this.size = this.$refs.infoBox.clientHeight
        this.offset = this.$refs.infoBox.getBoundingClientRect().left
      }
    },
    refresh () {
      if (this.$refs.infoBox) {
        this.getStaticData()
      }
    },
    printError (msg) {
      console.error(msg)
    }
  },
  mounted () {
    this.isComponentExists = true
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return this.printError('[VueSlideBar error]: window or document is undefined, can not be initialization.')
    }
    this.$nextTick(() => {
      if (this.isComponentExists) {
        this.getStaticData()
        this.setValue(this.limitValue(this.value), 0)
        this.bindEvents()
      }
    })
  },
  beforeDestroy () {
    this.isComponentExists = false
    this.unbindEvents()
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

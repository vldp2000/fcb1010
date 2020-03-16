<template>
  <v-container grid-list-md text-md-center fluid>
    <v-row no-gutters>
      <v-col>
        <v-icon v-if="running"
          v-bind:class="getMetronomeColor()"
        >
          fiber_manual_record
        </v-icon>
      </v-col>
      <v-col>
        <v-icon  large class="playButton" @click="toggleRunning">
          play_circle_outline
        </v-icon>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      x: 0,
      // bpm: 128,
      running: false,
      count: 0,
      totalCount: 1,
      time: performance.now(),
      // timeSignature: '4/4',
      soundReady: false,
      tapTempoTimes: [],
      tapTempoTime: null,
      backgroundActive: false,
      enableBackground: false
    }
  },
  props: {
    bmp: {
      type: Number,
      default: -1
    },
    timeSignature: {
      type: [String],
      default: '4/4'
    }
  },

  computed: {
    interval () {
      return (60 * 1000) / (this.bpm * (this.measure / 4))
    },
    beats () {
      return Number(this.timeSignature.split('/')[0])
    },
    measure () {
      return Number(this.timeSignature.split('/')[1])
    },
    color () {
      if (this.count === 0) return 'red'
      else return 'green'
    }
  },
  watch: {
    bpm: 'reset',
    beats: 'reset',
    measure: 'reset'
  },
  mounted () {
    const frame = () => {
      const d = performance.now() - this.time
      if (d / this.totalCount > this.interval) {
        this.tick()
        this.totalCount += 1
      }
      requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  },
  methods: {
    toggleRunning () {
      this.x = 0
      this.running = !this.running
      this.tickActive = false

      if (this.running) {
        this.updateBackground()
        setTimeout(() => {
          this.updateBackground()
        }, this.interval)
        this.set(2)
      }
    },
    set (count) {
      this.totalCount = count
      this.count = count
      this.time = performance.now()
    },
    reset () {
      this.set(0)
    },
    tick () {
      if (!this.running) {
        return
      }

      if (this.count === this.beats) {
        this.count = 0
      }

      this.updateBackground()
      this.count += 1
      this.x += 1
      // if (this.x > 100) this.running = false
    },
    updateBackground () {
      this.backgroundActive = !this.backgroundActive
    },
    getMetronomeColor () {
      if (this.count === 1) {
        return 'redback'
      } else if (this.count % 2 === 0) {
        return 'greenback'
      } else {
        return 'whiteback'
      }
    }
  }
}
</script>

<style scoped>

  .playButton {
    color: rgb(103, 103, 109);
    margin-left: 10px;
    margin-top: -5px;
  }
  .input-group label {
    transition: none !important;
  }

  .input-group__details:before {
    transition: none !important;
  }

  .redback {
    color: brown;
  }
  .greenback {
    color:green;
  }
  .whiteback {
    color:white;
  }
</style>

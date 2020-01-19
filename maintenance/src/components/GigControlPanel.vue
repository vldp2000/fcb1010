<template>
  <v-container grid-list-md text-md-center fluid class="darkBackgroud">
 <!-- <v-container fluid  class="darkBackgroud"> -->
    <v-row md12no-gutters>
      <v-col md6>
        <v-select
          label="Select Gig"
          v-model="songId"
          :items="songList"
          required
          item-text="name"
          item-value="id">
        </v-select>
      </v-col>
      <v-col md6>
        <v-select
          label="Select Song"
          v-model="songId"
          :items="songList"
          required
          item-text="name"
          item-value="id">
        </v-select>
      </v-col>
    </v-row>

<!-------PROFRAM A----------->
    <v-row md12 ma-0 pa-0 no-gutters>

      <div id="Proram0" v-bind:class="(currentProgramIdx === 0) ? 'progLabelSelected' : 'progLabel'" @click="onProgramClick(0)">
        <h1>A</h1>
      </div>

      <v-col md3 d-flex>
        <v-card  dark v-bind:class="(currentProgramIdx === 0) ? 'presetControlSelected' : 'presetControl'">
          <preset-control :presetControlData='getPresetControlData(0, 0)'/>
        </v-card>
      </v-col>
      <v-col md3 d-flex>
        <v-card  dark v-bind:class="(currentProgramIdx === 0) ? 'presetControlSelected' : 'presetControl'">
          <preset-control :presetControlData='getPresetControlData(0, 1)'/>
        </v-card>
      </v-col>
      <v-col md3 d-flex>
        <v-card  dark v-bind:class="(currentProgramIdx === 0) ? 'presetControlSelected' : 'presetControl'">
          <preset-control :presetControlData='getPresetControlData(0, 2)' />
        </v-card>
      </v-col>
      <v-col md3 d-flex>
        <v-card  dark v-bind:class="(currentProgramIdx === 0) ? 'presetControlSelected' : 'presetControl'">
          <preset-control :presetControlData='getPresetControlData(0, 3)' />
        </v-card>
      </v-col>

    </v-row>

<!-------PROFRAM B----------->
    <v-row md12 ma-0 pa-0 no-gutters>

      <div id="Proram1" v-bind:class="(currentProgramIdx === 1) ? 'progLabelSelected' : 'progLabel'" @click="onProgramClick(1)" >
        <h1>B</h1>
      </div>

      <v-col md3 d-flex>
        <v-card  dark v-bind:class="(currentProgramIdx === 1) ? 'presetControlSelected' : 'presetControl'">
          <preset-control :presetControlData='getPresetControlData(1, 0)' />
        </v-card>
      </v-col>
      <v-col md3 d-flex>
        <v-card  dark v-bind:class="(currentProgramIdx === 1) ? 'presetControlSelected' : 'presetControl'">
          <preset-control :presetControlData='getPresetControlData(1, 1)' />
        </v-card>
      </v-col>
      <v-col md3 d-flex>
        <v-card  dark v-bind:class="(currentProgramIdx === 1) ? 'presetControlSelected' : 'presetControl'">
          <preset-control :presetControlData='getPresetControlData(1, 2)' />
        </v-card>
      </v-col>
      <v-col md3 d-flex>
        <v-card  dark v-bind:class="(currentProgramIdx === 1) ? 'presetControlSelected' : 'presetControl'">
          <preset-control :presetControlData='getPresetControlData(1, 3)' />
        </v-card>
      </v-col>

    </v-row>
<!-------PROFRAM C----------->
    <v-row md12 ma-0 pa-0 no-gutters>

      <div id="Proram2"  v-bind:class="(currentProgramIdx === 2) ? 'progLabelSelected' : 'progLabel'" @click="onProgramClick(2)">
        <h1>C</h1>
      </div>

      <v-col md3 d-flex>
        <v-card  dark v-bind:class="(currentProgramIdx === 2) ? 'presetControlSelected' : 'presetControl'">
          <preset-control :presetControlData='getPresetControlData(2, 0)' />
        </v-card>
      </v-col>
      <v-col md3 d-flex>
        <v-card  dark v-bind:class="(currentProgramIdx === 2) ? 'presetControlSelected' : 'presetControl'">
          <preset-control :presetControlData='getPresetControlData(2, 1)' />
        </v-card>
      </v-col>
      <v-col md3 d-flex>
        <v-card  dark v-bind:class="(currentProgramIdx === 2) ? 'presetControlSelected' : 'presetControl'">
          <preset-control :presetControlData='getPresetControlData(2, 2)' />
        </v-card>
      </v-col>
      <v-col md3 d-flex>
        <v-card  dark v-bind:class="(currentProgramIdx === 2) ? 'presetControlSelected' : 'presetControl'">
          <preset-control :presetControlData='getPresetControlData(2, 3)' />
        </v-card>
      </v-col>
    </v-row>

<!-------PROFRAM D----------->
    <v-row md12 no-gutters>

      <div id="Proram3"  v-bind:class="(currentProgramIdx === 3) ? 'progLabelSelected' : 'progLabel'" @click="onProgramClick(3)">
        <h1>D</h1>
      </div>

      <v-col md3 d-flex>
        <v-card  dark v-bind:class="(currentProgramIdx === 3) ? 'presetControlSelected' : 'presetControl'">
          <preset-control  :presetControlData='getPresetControlData(3, 0)'/>
        </v-card>
      </v-col>
      <v-col md3 d-flex>
        <v-card  dark v-bind:class="(currentProgramIdx === 3) ? 'presetControlSelected' : 'presetControl'">
          <preset-control :presetControlData='getPresetControlData(3, 1)' />
        </v-card>
      </v-col>
      <v-col md3 d-flex>
        <v-card  dark v-bind:class="(currentProgramIdx === 3) ? 'presetControlSelected' : 'presetControl'">
          <preset-control :presetControlData='getPresetControlData(3, 2)' />
        </v-card>
      </v-col>
      <v-col md3 d-flex>
        <v-card  dark v-bind:class="(currentProgramIdx === 3) ? 'presetControlSelected' : 'presetControl'">
          <preset-control :presetControlData='getPresetControlData(3, 3)' />
        </v-card>
      </v-col>
    </v-row>
    <v-row md12 ma-0 pa-0 no-gutters>
      <v-btn large @click="btnClickPogram()" > change current program </v-btn>
      <v-btn large @click="btnClickSong()" > change current song </v-btn>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import SongsService from '@/services/SongsService'

export default {
  data () {
    return {
      // songId: 1,
      currentGig: null,
      currentSong: null,
      currentProgramIdx: 0,
      initFlag: true,
      defaultPreset: {
        id: -1,
        refsong: -1,
        refsongprogram: -1,
        refinstrument: -1,
        refinstrumentbank: -1,
        refpreset: -1,
        volume: 0,
        pan: 0,
        muteflag: 0,
        reverbflag: 0,
        delayflag: 0,
        modeflag: 0,
        reverbvalue: 0,
        delayvalue: 0
      }
    }
  },

  computed: {
    currentGigId: state => state.currentGigId,
    ...mapState(['presetList', 'instrumentList', 'instrumentBankList', 'gigList', 'songList', 'currentSongId', 'currentProgramMidiPedal', 'currentGigId']),
    songId: {
      get () { return this.currentSongId },
      set (value) { this.$store.dispatch('setCurrentSongId', value) }
    }
  },

  watch: {
    currentGigId: async function (id) {
      this.initFlag = true
      if (typeof this.gigList !== 'undefined') {
        console.log(id)
        this.currentSong = await this.songList.find(item => item.id === id)

        if (this.currentSong.programList === null ||
        typeof (this.currentSong.programList) === 'undefined') {
          await SongsService.getSongItems(this.currentSong.id)
        }

        console.log(this.currentSong)
        this.songId = id
        console.log('----,,,,, Song Changed')
      }
      this.initFlag = false
    },

    currentSongId: async function (id) {
      this.initFlag = true
      if (typeof this.songList !== 'undefined') {
        console.log(id)
        this.currentSong = await this.songList.find(item => item.id === id)

        if (this.currentSong.programList === null ||
        typeof (this.currentSong.programList) === 'undefined') {
          await SongsService.getSongItems(this.currentSong.id)
        }

        console.log(this.currentSong)
        this.songId = id
        console.log('----,,,,, Song Changed')
      }
      this.initFlag = false
    },

    currentProgramMidiPedal: function (idx) {
      this.currentProgramIdx = idx
    }
    // songId: function () {
    //   console.log('----,,,,,try to set setCurrentSongId')
    //   this.$store.dispatch('setCurrentSongId', this.songId)
    // }
  },

  mounted () {
    this.init()
  },

  methods: {
    async init () {
      try {
        this.initFlag = true
        console.log(' >>> Init all related collections in storage')
        await SongsService.initAll()
        console.log(' Finish the Init of all related collections in storage <<< ')
        await this.$store.dispatch('setCurrentSongId', 1)

        // console.log(this.currentSong.programList)
        // if (this.currentSong.programList === null ||
        // typeof (this.currentSong.programList) === 'undefined') {
        //   await SongsService.getSongItems(this.currentSong.id)
        //   this.currentSong = await this.songList[0]
        // }
        // console.log('--- Current song ----')
        // console.log(this.currentSong)
        // this.currentProgramIdx = 0
        // this.initFlag = false
      } catch (ex) {
        console.log(ex)
      }
    },

    getPresetControlData (programIndex, presetIndex) {
      if (!this.initFlag) {
        try {
          console.log(`get program for ${programIndex} ${presetIndex} `)
          console.log(this.currentSong)
          if (typeof (this.currentSong) === 'undefined' || this.currentSong === null) {
            console.log(programIndex)
            return this.defaultPreset
          } else {
            if (this.currentSong.programList === null ||
            typeof (this.currentSong.programList) === 'undefined') {
              // SongsService.getSongItems(this.currentSong.id)
              // this.currentSong = this.songList[]
              return this.defaultPreset
            }

            const preset = this.currentSong.programList[programIndex].presetList[presetIndex]
            // console.log(preset)
            return preset
          }
        } catch (ex) {
          console.log(ex)
        }
      } else {
        return this.defaultPreset
      }
    },

    btnClickPogram () {
      let x = this.currentProgramIdx + 1
      if (x > 3) { x = 0 }
      this.$store.dispatch('setCurrentProgramMidiPedal', x)
    },
    btnClickSong () {
      let x = this.songId + 1
      if (x > 12) { x = 0 }
      this.$store.dispatch('setCurrentSongId', x)
    },

    onProgramClick (idx) {
      this.$store.dispatch('setCurrentProgramMidiPedal', idx)
      // this.$store.dispatch('setCurrentProgramMidiPedal', 0)
    }
  }
}
</script>

<style>

.preset {
  margin: 5px;
}
.presetControl {
  padding: 5px;
  margin: 5px;
}
.presetControlSelected {
  padding: 5px;
  margin: 5px;
  box-shadow: 1px 4px 8px 1px rgba(5, 79, 218, 0.83);
  /* box-shadow: 0px 1px 5px 0px; */
  /* color: blue !important; */
}

.darkBackgroud {
  /* background-color:rgba(50, 31, 119, 0.83) */
  background-color:rgba(36, 34, 34, 0.830)
}

.progLabel {
  text-align: center;
  text-justify: auto;
  color:black;
  border: 2px solid black;
  border-radius: 10px;

  width: 50px;
  height: 50px;
  /* margin: 50px, 10px, 0px, -10px; */
  margin-top: 40px;
  margin-left: -10px;
  margin-right: 2px;
  padding: 0px;
}

.progLabelSelected {
  text-align: center;
  text-justify: auto;
  color: blue;
  border: 2px solid blue;
  border-radius: 10px;

  width: 50px;
  height: 50px;
  /* margin: 50px, 10px, 0px, -10px; */
  margin-top: 40px;
  margin-left: -10px;
  margin-right: 2px;
  padding: 0px;
}

.v-select  {
  font-size: 20px;
  font-style: bold;
  text-shadow: 2px 2px 1px rgba(5, 79, 218, 0.83);
  text-transform: uppercase;
  font-weight: bold;
  margin-bottom: -10px;
  margin-bottom: -20px;
  padding-top: -5px;
  padding-bottom: -20px;
  padding-left: 60px;
  padding-right: 20px;
}

</style>

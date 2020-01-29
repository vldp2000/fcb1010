<template>
  <v-container grid-list-md text-md-center fluid class="darkBackgroud">
 <!-- <v-container fluid  class="darkBackgroud"> -->
  <div class="selector-panel">
    <v-row md12no-gutters>
      <v-col md6>
        <v-select
          v-if="gigList"
          label="Select Gig"
          v-model="gigId"
          :items="gigList"
          required
          item-text="name"
          item-value="id">
        </v-select>
      </v-col>
      <v-col md6>
        <v-select
          v-if="currentSongList"
          label="Select Song"
          v-model="songId"
          :items="currentSongList"
          required
          item-text="name"
          item-value="id">
        </v-select>
      </v-col>
    </v-row>
  </div>
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
import io from 'socket.io-client'

const config = require('@/config/config')

export default {
  data () {
    return {
      // songId: 1,
      currentGig: null,
      currentSong: null,
      currentProgramIdx: 0,
      currentSongList: [],
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
      },
      socket: {}
    }
  },

  computed: {
    // currentGigId: state => state.currentGigId,
    ...mapState(['presetList', 'instrumentList', 'instrumentBankList', 'gigList', 'songList', 'currentSongId', 'currentProgramMidiPedal', 'currentGigId']),
    songId: {
      get () { return this.currentSongId },
      set (value) { this.$store.dispatch('setCurrentSongId', value) }
    },
    gigId: {
      get () { return this.currentGigId },
      set (value) { this.$store.dispatch('setCurrentGigId', value) }
    }
  },

  watch: {
    currentGigId: async function (id) {
      this.initFlag = true
      if (id > 0) {
        if (typeof this.gigList !== 'undefined') {
          this.currentGig = await this.gigList.find(gig => gig.id === id)
          // console.log('Gig-Song <<<<<<<')
          // console.log(this.currentGig)
          if (!this.currentGig.songList) {
            await this.$store.dispatch('populateGigSongs', id)
            this.currentGig = await this.gigList.find(gig => gig.id === id)
            // console.log(this.currentGig)
          }
          this.currentSongList = this.currentGig.songList

          this.songId = this.currentGig.songList[0].id
        }
      }
      this.initFlag = false
    },

    currentSongId: async function (id) {
      this.initFlag = true
      this.currentSong = null
      try {
        // console.log('>> set Song <<')
        // console.log(this.currentGig)
        // console.log(this.currentGigId)
        // console.log(id)
        if (this.currentGig && this.currentGig.songList && this.currentGig.songList.length > 0) {
          this.currentSong = await this.currentGig.songList.find(item => item.id === id)
        }
        if (!this.currentSong) {
          await this.setSongOutOfGig(id)
        }
        if (this.currentSong.programList === null ||
          typeof (this.currentSong.programList) === 'undefined') {
          await this.initSongPrograms(id)
        }
        console.log(this.currentSong.name)
      } catch (ex) {
        console.log(ex)
      }
      this.initFlag = false
    },

    currentProgramMidiPedal: function (idx) {
      this.currentProgramIdx = idx
      console.log(`currentProgramMidiPedal was changed -> ${this.currentProgramIdx}`)
    }
    // songId: function () {
    //   console.log('----,,,,,try to set setCurrentSongId')
    //   this.$store.dispatch('setCurrentSongId', this.songId)
    // }
  },
  created () {
    this.initMessageSocket()
  },

  mounted () {
    this.init()
  },

  methods: {
    initMessageSocket () {
      try {
        this.socket = io(`${config.messageURL}`)

        this.socket.on(config.programMessage, (data) => {
          console.log('-- Preset socket IO message')
          console.log(data)
          this.$store.dispatch('setCurrentProgramMidiPedal', parseInt(data))
        })
        this.socket.on(config.songMessage, (data) => {
          console.log('-- Song socket IO message')
          console.log(data)
          this.$store.dispatch('setCurrentSongId', parseInt(data))
        })
      } catch (ex) {
        console.log(ex)
      }
    },
    async init () {
      try {
        this.initFlag = true
        console.log(' >>> Init all related collections in storage1')
        await SongsService.initAll()
        console.log(' >>> Init all related collections in storage2')
        console.log(this.gigList)
        var gId = -1
        gId = this.gigList.find(g => g.currentFlag === 1).id
        if (gId > 0) {
          this.gigId = gId
        } else {
          this.gigId = -1
          this.songId = -1
        }
        console.log(gId)
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
      // console.log('---setpreset')
      // console.log(this.initFlag)
      if (!this.initFlag) {
        try {
          // console.log(`get program for ${programIndex} ${presetIndex} `)
          // console.log(this.currentSong)
          if (typeof (this.currentSong) === 'undefined' || this.currentSong === null ||
            this.currentSongId === -1) {
            // console.log('default preset')
            return this.defaultPreset
          } else {
            if (this.currentSong.programList === null ||
            typeof (this.currentSong.programList) === 'undefined') {
              // SongsService.getSongItems(this.currentSong.id)
              // this.currentSong = this.songList[]
              // console.log('default preset')
              return this.defaultPreset
            }

            const preset = this.currentSong.programList[programIndex].presetList[presetIndex]
            // console.log(this.currentSong)
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

    async setSongOutOfGig (id) {
      try {
        this.gigId = -1
        this.currentGig = null
        console.log('--- out of gig')
        this.currentSong = await this.songList.find(item => item.id === id)
        if (this.currentSong) {
          console.log(this.currentSong.name)
          if (this.currentSong && (this.currentSong.programList === null ||
          typeof (this.currentSong.programList) === 'undefined')) {
            await this.initSongPrograms(id)
          }

          this.currentSongList = [this.currentSong]
          // console.log(this.currentSong)
          this.songId = id
        } else {
          this.currentSong = null
          this.songId = -1
        }
      } catch (ex) {
        console.log(ex)
      }
    },

    async initSongPrograms (songId) {
      await SongsService.getSongItems(songId)
    },

    btnClickPogram () {
      let x = this.currentProgramIdx + 1
      if (x > 3) { x = 0 }
      // this.$store.dispatch('setCurrentProgramMidiPedal', x)
      this.socket.emit(config.programMessage, x)
    },
    btnClickSong () {
      let x = this.songId + 1
      if (x > 12) { x = 0 }
      // this.$store.dispatch('setCurrentSongId', x)
      this.socket.emit(config.songMessage, x)
    },

    onProgramClick (idx) {
      // this.$store.dispatch('setCurrentProgramMidiPedal', idx)
      // this.$store.dispatch('setCurrentProgramMidiPedal', 0)
      this.socket.emit(config.programMessage, idx)
    }
  }
}
</script>

<style  scoped>

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
.selector-panel {
  height: 45px;
}
.v-select  {
  color:azure;
  font-size: 20px;
  font-style: bold;
  text-shadow: 2px 2px 1px rgba(5, 79, 218, 0.83);
  text-transform: uppercase;
  font-weight: bold;
  margin: 0px;
  /* margin-bottom: -10px;
  margin-bottom: -20px; */
  margin-top: -20px;
  padding-bottom: 40px;
  padding-left: 60px;
  padding-right: 20px;
}

</style>

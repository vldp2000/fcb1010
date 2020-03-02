<template>
  <v-container grid-list-md text-md-center fluid class="darkBackgroud">
  <div class="selector-panel">
    <v-row md12 no-gutters>
      <v-col cols="12" md="5">
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
      <v-col cols="12" md="1">
        <div>
          <v-icon large
            v-bind:class="(checkIfGigIsCurrent()) ? 'defaultGigHighighted' : 'defaultGig'"
            @click="saveGigAsCurrent()"
          >
          grade
          </v-icon>
          <v-icon large class="clearGigBbutton"
            @click="clearGig()"
          >
          cancel
          </v-icon>
        </div>
      </v-col>
      <v-col cols="12" md="5">
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
       <v-col cols="12" md="1">
        <div>
          <v-icon large
            v-bind:class="(dataChanged) ? 'saveSongButtonHighighted' : 'saveSongButton'"
            @click="saveSong()"
          >
          save
          </v-icon>
          <v-icon large class="selectSongButton"
            @click="selectSong()"
          >
          settings_remote
          </v-icon>
        </div>
      </v-col>
    </v-row>
  </div>
<!-------PROFRAM A----------->
    <v-row md12 ma-0 pa-0 no-gutters>

      <div id="Proram0" v-bind:class="(currentProgramIdx === 0) ? 'progLabelSelected' : 'progLabel'" @click="onProgramClick(0)">
        <h1>A</h1>
      </div>
      <div class="programTytle">
        <b>{{ getProgramTytle(0) }}</b>
      </div>
      <v-col md3 d-flex>
        <v-card  dark v-bind:class="(currentProgramIdx === 0) ? 'presetControlSelected' : 'presetControl'">
          <preset-control
            :presetControlData='getPresetControlData(0, 0)'
            @changed="OnControlDataChanged()" />
        </v-card>
      </v-col>
      <v-col md3 d-flex>
        <v-card  dark v-bind:class="(currentProgramIdx === 0) ? 'presetControlSelected' : 'presetControl'">
          <preset-control
            :presetControlData='getPresetControlData(0, 1)'
            @changed="OnControlDataChanged()" />
        </v-card>
      </v-col>
      <v-col md3 d-flex>
        <v-card  dark v-bind:class="(currentProgramIdx === 0) ? 'presetControlSelected' : 'presetControl'">
          <preset-control
            :presetControlData='getPresetControlData(0, 2)'
            @changed="OnControlDataChanged()" />
        </v-card>
      </v-col>
      <v-col md3 d-flex>
        <v-card  dark v-bind:class="(currentProgramIdx === 0) ? 'presetControlSelected' : 'presetControl'">
          <preset-control
            :presetControlData='getPresetControlData(0, 3)'
            @changed="OnControlDataChanged()"/>
        </v-card>
      </v-col>
    </v-row>

<!-------PROFRAM B----------->
    <v-row md12 ma-0 pa-0 no-gutters>

      <div id="Proram1" v-bind:class="(currentProgramIdx === 1) ? 'progLabelSelected' : 'progLabel'" @click="onProgramClick(1)" >
        <h1>B</h1>
      </div>
      <div class="programTytle">
        <b>{{ getProgramTytle(1) }}</b>
      </div>
      <v-col md3 d-flex>
        <v-card  dark v-bind:class="(currentProgramIdx === 1) ? 'presetControlSelected' : 'presetControl'">
          <preset-control
            :presetControlData='getPresetControlData(1, 0)'
            @changed="OnControlDataChanged()" />
        </v-card>
      </v-col>
      <v-col md3 d-flex>
        <v-card  dark v-bind:class="(currentProgramIdx === 1) ? 'presetControlSelected' : 'presetControl'">
          <preset-control
            :presetControlData='getPresetControlData(1, 1)'
            @changed="OnControlDataChanged()" />
        </v-card>
      </v-col>
      <v-col md3 d-flex>
        <v-card  dark v-bind:class="(currentProgramIdx === 1) ? 'presetControlSelected' : 'presetControl'">
          <preset-control
            :presetControlData='getPresetControlData(1, 2)'
            @changed="OnControlDataChanged()" />
        </v-card>
      </v-col>
      <v-col md3 d-flex>
        <v-card  dark v-bind:class="(currentProgramIdx === 1) ? 'presetControlSelected' : 'presetControl'">
          <preset-control
            :presetControlData='getPresetControlData(1, 3)'
            @changed="OnControlDataChanged()" />
        </v-card>
      </v-col>

    </v-row>
<!-------PROFRAM C----------->
    <v-row md12 ma-0 pa-0 no-gutters>

      <div id="Proram2"  v-bind:class="(currentProgramIdx === 2) ? 'progLabelSelected' : 'progLabel'" @click="onProgramClick(2)">
        <h1>C</h1>
      </div>
      <div class="programTytle">
        <b>{{ getProgramTytle(2) }}</b>
      </div>
      <v-col md3 d-flex>
        <v-card  dark v-bind:class="(currentProgramIdx === 2) ? 'presetControlSelected' : 'presetControl'">
          <preset-control
            :presetControlData='getPresetControlData(2, 0)'
            @changed="OnControlDataChanged()" />
        </v-card>
      </v-col>
      <v-col md3 d-flex>
        <v-card  dark v-bind:class="(currentProgramIdx === 2) ? 'presetControlSelected' : 'presetControl'">
          <preset-control
          :presetControlData='getPresetControlData(2, 1)'
          @changed="OnControlDataChanged()" />
        </v-card>
      </v-col>
      <v-col md3 d-flex>
        <v-card  dark v-bind:class="(currentProgramIdx === 2) ? 'presetControlSelected' : 'presetControl'">
          <preset-control
            :presetControlData='getPresetControlData(2, 2)'
            @changed="OnControlDataChanged()" />
        </v-card>
      </v-col>
      <v-col md3 d-flex>
        <v-card  dark v-bind:class="(currentProgramIdx === 2) ? 'presetControlSelected' : 'presetControl'">
          <preset-control
            :presetControlData='getPresetControlData(2, 3)'
            @changed="OnControlDataChanged()" />
        </v-card>
      </v-col>
    </v-row>

<!-------PROFRAM D----------->
    <v-row md12 no-gutters>

      <div id="Proram3"  v-bind:class="(currentProgramIdx === 3) ? 'progLabelSelected' : 'progLabel'" @click="onProgramClick(3)">
        <h1>D</h1>
      </div>
      <div class="programTytle">
        <b>{{ getProgramTytle(3) }}</b>
      </div>
      <v-col md3 d-flex>
        <v-card  dark v-bind:class="(currentProgramIdx === 3) ? 'presetControlSelected' : 'presetControl'">
          <preset-control
            :presetControlData='getPresetControlData(3, 0)'
            @changed="OnControlDataChanged()" />
        </v-card>
      </v-col>
      <v-col md3 d-flex>
        <v-card  dark v-bind:class="(currentProgramIdx === 3) ? 'presetControlSelected' : 'presetControl'">
          <preset-control
            :presetControlData='getPresetControlData(3, 1)'
            @changed="OnControlDataChanged()" />
        </v-card>
      </v-col>
      <v-col md3 d-flex>
        <v-card  dark v-bind:class="(currentProgramIdx === 3) ? 'presetControlSelected' : 'presetControl'">
          <preset-control
            :presetControlData='getPresetControlData(3, 2)'
            @changed="OnControlDataChanged()" />
        </v-card>
      </v-col>
      <v-col md3 d-flex>
        <v-card  dark v-bind:class="(currentProgramIdx === 3) ? 'presetControlSelected' : 'presetControl'">
          <preset-control
            :presetControlData='getPresetControlData(3, 3)'
            @changed="OnControlDataChanged()" />
        </v-card>
      </v-col>
    </v-row>
    <!-- <v-row md12 ma-0 pa-0 no-gutters>
      <v-btn large @click="btnClickPogram()" > change current program </v-btn>
      <v-btn large @click="btnClickSong()" > change current song </v-btn>
    </v-row> -->
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

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
      dataChanged: false
    }
  },

  computed: {
    // currentGigId: state => state.currentGigId,
    ...mapState(['presetList', 'instrumentList', 'instrumentBankList',
      'gigList', 'songList', 'currentSongId', 'currentProgramMidiPedal',
      'currentGigId', 'allInitialized', 'instrumentListImagesInitialized',
      'refreshSong', 'initialisingIsInProgress', 'defaultPreset']),
    songId: {
      get () {
        // this.$log.debug(` SongId GETTER is fired ---((( ${this.currentSongId}`)
        return this.currentSongId
      },
      set (value) {
        this.$log.debug(` >>>> SongId setter  old=${this.currentSongId}  new=${value} `)
        if (this.currentSongId !== value && value > 0) {
          this.$log.debug(` >>> SongId setter is fired ---))) -- ${value}`)
          this.$store.dispatch('setCurrentSongId', value)
        }
      }
    },
    gigId: {
      get () { return this.currentGigId },
      set (value) { this.$store.dispatch('setCurrentGigId', value) }
    }
  },

  watch: {
    allInitialized: async function () {
      this.$log.debug(`-- ... received allInitialized ....-- ${this.allInitialized}`)
      this.$log.debug(this.instrumentListImagesInitialized)
      if (this.allInitialized) {
        this.setGigSong()
        this.initFlag = false
      }
    },
    refreshSong: async function () {
      if (this.currentSongId > 0) {
        if (typeof this.songList !== 'undefined') {
          //  this.setCurrentSong()
          this.currentSong = await this.songList.find(song => song.id === this.currentSongId)
          // this.$log.debug(`currentSong <<<<<<< ${this.currentSong.name}`)
          // if (!this.currentGig.songList) {
          //   this.$log.debug(` Need to populate Gig Songs ${this.currentGig}`)
          //   await this.$store.dispatch('populateGigSongs', id)
          //   this.currentGig = await this.gigList.find(gig => gig.id === id)
          //   this.$log.debug(this.currentGig)
          // }
          // this.currentSongList = this.currentGig.songList
          this.songId = this.currentSong.id
        }
      }
    },
    currentGigId: async function (id) {
      // this.initFlag = true
      if (id > 0) {
        if (typeof this.gigList !== 'undefined') {
          this.currentGig = await this.gigList.find(gig => gig.id === id)
          // this.$log.debug(`currentGig <<<<<<< ${this.currentGig}`)
          if (!this.currentGig.songList) {
            // this.$log.debug(` Need to populate Gig Songs ${this.currentGig}`)
            await this.$store.dispatch('populateGigSongs', id)
            this.currentGig = await this.gigList.find(gig => gig.id === id)
            // this.$log.debug(this.currentGig)
          }
          this.currentSongList = this.currentGig.songList
          this.songId = this.currentGig.songList[0].id
        }
      } else {
        if (this.songList && this.songList.length > 0) {
          this.currentSongList = this.songList
        }
      }
    },

    currentSongId: async function () {
      if (!this.currentSong || this.currentSong.id !== this.currentSongId) {
        this.$log.debug('-- >>>>> current Song id was changed')
        this.setCurrentSong()
      }
    },

    currentProgramMidiPedal: function (idx) {
      this.currentProgramIdx = idx
      this.$log.debug(`currentProgramMidiPedal was changed -> ${this.currentProgramIdx}`)
    }
  },
  created () {
    this.initMessageSocket()
  },

  mounted () {
    this.initAllData()
  },

  methods: {
    OnControlDataChanged () {
      this.dataChanged = true
    },
    setCurrentSong () {
      const id = this.currentSongId
      this.$log.debug(' --- setCurrentSong ---', id)
      // this.$log.debug(this.currentGig)
      if (this.currentGig && this.currentGig.songList && this.currentGig.songList.length > 0) {
        // console.log(this.currentGig)
        this.currentSong = this.currentGig.songList.find(item => item.id === id)
      }

      if (!this.currentSong) {
        this.$log.debug(`NOT found song in current gig >>  ${id}`)
        this.setSongOutOfGig(id)
      }
      // this.$log.debug(this.currentSong.name)
      if (this.currentSong && (this.currentSong.programList === null ||
        typeof (this.currentSong.programList) === 'undefined')) {
        this.initSongPrograms(id)
      }
    },

    async setSongOutOfGig (id) {
      try {
        this.gigId = -1
        this.currentGig = null
        this.$log.debug('--- out of gig')
        this.currentSong = await this.songList.find(item => item.id === this.currentSongId)
      } catch (ex) {
        this.$log.error(ex)
      }
    },

    initMessageSocket () {
      try {
        this.$store.dispatch('socketClientInitialize', 'socketClientInitialize')
      } catch (ex) {
        this.$log.error(ex)
      }
    },

    selectSong () {
      try {
        this.$store.dispatch('selectSong', this.currentSongId)
      } catch (ex) {
        this.$log.error(ex)
      }
    },

    async setGigSong () {
      this.$log.debug(` Lenght of gigList  = ${this.gigList.length}`)
      // this.$log.debug(this.gigList)
      var gId = -1
      gId = this.gigList.find(g => g.currentFlag === 1).id
      if (gId > 0) {
        this.gigId = gId
      } else {
        this.gigId = -1
        this.songId = -1
      }
      this.$log.debug(gId)
    },

    async initAllData () {
      try {
        if (!this.allInitialized && !this.initialisingIsInProgress) {
          // this.$log.debug(' >>> Init all related collections in storage1')
          await this.$store.dispatch('initAllLists', 'initAll')
        }
      } catch (ex) {
        this.$log.error(ex)
      }
    },

    getPresetControlData (programIndex, presetIndex) {
      try {
        if (typeof (this.currentSong) === 'undefined' || this.currentSong === null ||
          this.currentSongId === -1) {
          return this.defaultPreset
        } else {
          if (this.currentSong.programList === null ||
          typeof (this.currentSong.programList) === 'undefined') {
            return this.defaultPreset
          }
          let preset = {}
          Object.assign(preset, this.currentSong.programList[programIndex].presetList[presetIndex])
          return preset
        }
      } catch (ex) {
        this.$log.error(ex)
      }
    },
    getProgramTytle (idx) {
      if (this.currentSong && this.currentSong.programList) {
        return this.currentSong.programList[idx].tytle
      }
    },
    async initSongPrograms (songId) {
      this.$store.dispatch('addSongItems', songId)
    },

    btnClickPogram () {
      let x = this.currentProgramIdx + 1
      if (x > 3) { x = 0 }
      this.$socket.client.emit(config.controllerProgramMessage, x)
    },
    btnClickSong () {
      let x = this.songId + 1
      if (x > 12) { x = 1 }
      this.$socket.client.emit(config.controllerSongMessage, x)
    },

    onProgramClick (idx) {
      this.$socket.client.emit(config.controllerProgramMessage, idx)
    },
    checkIfGigIsCurrent () {
      return (this.currentGig && this.currentGig.currentFlag)
    },

    saveGigAsCurrent () {
      if (this.currentGig) {
        this.$log.debug('setGigAsCurrent')
        this.$store.dispatch('setGigAsCurrent', this.currentGig.id)
      }
    },
    clearGig () {
      this.$log.debug('clearGig')
      this.currentGig = null
      this.$store.dispatch('setCurrentGigId', -1)
    },
    saveSong () {
      this.$log.debug('save song')
      this.$store.dispatch('updateSong', this.currentSong)
      this.dataChanged = false
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
  background-color:rgba(12, 12, 12, 0.884)
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
  margin-top: 50px;
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
  margin-top: 50px;
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
  text-shadow: 1px 1px 1px rgba(5, 79, 218, 0.83);
  text-transform: uppercase;
  font-weight: bold;
  margin: 0px;
  /* margin-bottom: -10px;
  margin-bottom: -20px; */
  margin-top: 0px;
  padding-bottom: 40px;
  padding-left: 60px;
  padding-right: 20px;
}

.saveSongButtonHighighted {
  color: darkblue;
}
.saveSongButton {
  color:  rgb(103, 103, 109);
}
.selectSongButton {
  margin-left: 10px;
  color: darkblue;
}
.defaultGigHighighted {
  margin-left: -10px;
  margin-top: 5px;
  color: darkblue;
  font-size: 36px;
}
.defaultGig {
  margin-left: -10px;
  margin-top: 5px;
  color: rgb(103, 103, 109);
  font-size: 36px;
}
.clearGigBbutton {
  margin-left: 10px;
  margin-top: 5px;
  color: rgb(103, 103, 109);
  font-size: 36px;
}
.programTytle {

  -ms-transform: rotate(-90deg);
  -moz-transform: rotate(-90deg);
  -webkit-transform: rotate(-90deg);
  transform: rotate(-90deg);
  filter: none; /* Mandatory for IE9 to show the vertical text correctly */
  margin-top: 110px;
  margin-left: 5px;
  padding-left: 10px;
  padding-top: 5px;
  width: 10px;
  color: rgb(99, 98, 96);
  -ms-transform-origin: center center 0;
  -moz-transform-origin: center center 0;
  -webkit-transform-origin: center center  0;
  transform-origin: center center 0;
  display: block;
  position: relative;
  text-align: center;
  white-space: nowrap !important;
  font-size: 14px;
/*
  border: 1px solid red; */
  /* transform-origin:left top; */
}

.rotated {
  /* border: 1px solid red;
  writing-mode: sideways-lr;
  -webkit-writing-mode: sideways-lr;
  -ms-writing-mode: sideways-lr; */
  writing-mode: vertical-rl;
  text-orientation: upright;
}

</style>

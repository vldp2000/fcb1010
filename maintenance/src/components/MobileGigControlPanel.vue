<template>
  <v-container grid-list-md text-md-center fluid class="darkBackgroud">
  <div class="selector-panel">
    <v-row sm12 no-gutters>
      <v-col cols="5" sm="5">
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
      <v-col cols="6" sm="6">
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
      <v-col cols="1" sm="1">
        <div>
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
      <v-col md3 d-flex>
        <v-card  dark v-bind:class="(currentProgramIdx === 0) ? 'presetControlSelected' : 'presetControl'">
          <mobile-preset-control
            :presetControlData='getPresetControlData(0, 0)'
            :programIdx=0 />
        </v-card>
      </v-col>
      <v-col md3 d-flex>
        <v-card  dark v-bind:class="(currentProgramIdx === 0) ? 'presetControlSelected' : 'presetControl'">
          <mobile-preset-control
            :presetControlData='getPresetControlData(0, 1)'
            :programIdx=0 />
        </v-card>
      </v-col>
      <v-col md3 d-flex>
        <v-card  dark v-bind:class="(currentProgramIdx === 0) ? 'presetControlSelected' : 'presetControl'">
          <mobile-preset-control
            :presetControlData='getPresetControlData(0, 2)'
            :programIdx=0 />
        </v-card>
      </v-col>
      <v-col md3 d-flex>
        <v-card  dark v-bind:class="(currentProgramIdx === 0) ? 'presetControlSelected' : 'presetControl'">
          <mobile-preset-control
            :presetControlData='getPresetControlData(0, 3)'
            :programIdx=0 />
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
          <mobile-preset-control
            :presetControlData='getPresetControlData(1, 0)'
            :programIdx=1 />
        </v-card>
      </v-col>
      <v-col md3 d-flex>
        <v-card  dark v-bind:class="(currentProgramIdx === 1) ? 'presetControlSelected' : 'presetControl'">
          <mobile-preset-control
            :presetControlData='getPresetControlData(1, 1)'
            :programIdx=1  />
        </v-card>
      </v-col>
      <v-col md3 d-flex>
        <v-card  dark v-bind:class="(currentProgramIdx === 1) ? 'presetControlSelected' : 'presetControl'">
          <mobile-preset-control
            :presetControlData='getPresetControlData(1, 2)'
            :programIdx=1  />
        </v-card>
      </v-col>
      <v-col md3 d-flex>
        <v-card  dark v-bind:class="(currentProgramIdx === 1) ? 'presetControlSelected' : 'presetControl'">
          <mobile-preset-control
            :presetControlData='getPresetControlData(1, 3)'
            :programIdx=1  />
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
          <mobile-preset-control
            :presetControlData='getPresetControlData(2, 0)'
            :programIdx=2  />
        </v-card>
      </v-col>
      <v-col md3 d-flex>
        <v-card  dark v-bind:class="(currentProgramIdx === 2) ? 'presetControlSelected' : 'presetControl'">
          <mobile-preset-control
          :presetControlData='getPresetControlData(2, 1)'
          :programIdx=2  />
        </v-card>
      </v-col>
      <v-col md3 d-flex>
        <v-card  dark v-bind:class="(currentProgramIdx === 2) ? 'presetControlSelected' : 'presetControl'">
          <mobile-preset-control
            :presetControlData='getPresetControlData(2, 2)'
            :programIdx=2  />
        </v-card>
      </v-col>
      <v-col md3 d-flex>
        <v-card  dark v-bind:class="(currentProgramIdx === 2) ? 'presetControlSelected' : 'presetControl'">
          <mobile-preset-control
            :presetControlData='getPresetControlData(2, 3)'
            :programIdx=2  />
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
          <mobile-preset-control
            :presetControlData='getPresetControlData(3, 0)'
            :programIdx=3  />
        </v-card>
      </v-col>
      <v-col md3 d-flex>
        <v-card  dark v-bind:class="(currentProgramIdx === 3) ? 'presetControlSelected' : 'presetControl'">
          <mobile-preset-control
            :presetControlData='getPresetControlData(3, 1)'
            :programIdx=3  />
        </v-card>
      </v-col>
      <v-col md3 d-flex>
        <v-card  dark v-bind:class="(currentProgramIdx === 3) ? 'presetControlSelected' : 'presetControl'">
          <mobile-preset-control
            :presetControlData='getPresetControlData(3, 2)'
            :programIdx=3  />
        </v-card>
      </v-col>
      <v-col md3 d-flex>
        <v-card  dark v-bind:class="(currentProgramIdx === 3) ? 'presetControlSelected' : 'presetControl'">
          <mobile-preset-control
            :presetControlData='getPresetControlData(3, 3)'
            :programIdx=3  />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      // songId: 1,
      currentGig: null,
      currentSong: null,
      currentProgramIdx: 0,
      currentSongList: [],
      initFlag: true,
      dataChanged: false,
      isPlaying: false
    }
  },

  computed: {
    ...mapState(['presetList', 'instrumentList', 'instrumentBankList',
      'gigList', 'songList', 'currentSongId', 'currentProgramMidiPedal',
      'selectedGigId', 'scheduledGigId',
      'allInitialized', 'instrumentListImagesInitialized',
      'refreshSong', 'initialisingIsInProgress', 'defaultPreset']),
    songId: {
      get () {
        // this.$log.debug(` SongId GETTER is fired ---((( ${this.currentSongId}`)
        return this.currentSongId
      },
      set (value) {
        // this.$log.debug(` >>>> SongId setter  old=${this.currentSongId}  new=${value} `)
        if (this.currentSongId !== value && value > 0) {
          // this.$log.debug(` >>> SongId setter is fired ---))) -- ${value}`)
          this.$store.dispatch('setCurrentSongId', value)
        }
      }
    },
    gigId: {
      get () {
        return this.selectedGigId
      },
      set (value) {
        this.$store.dispatch('setSelectedGigId', value)
      }
    },

    tempo: {
      get () {
        if (this.currentSong) return this.currentSong.tempo
        else return -1
      }
    }
  },

  watch: {
    allInitialized: async function () {
      if (this.allInitialized) {
        this.setGigSong()
        this.initFlag = false
      }
    },
    refreshSong: async function () {
      if (this.currentSongId > 0) {
        if (typeof this.songList !== 'undefined') {
          this.currentSong = await this.songList.find(song => song.id === this.currentSongId)
          this.songId = this.currentSong.id
        }
      }
    },
    selectedGigId: async function (id) {
      if (id > 0) {
        if (typeof this.gigList !== 'undefined') {
          this.currentGig = await this.gigList.find(gig => gig.id === id)
          if (!this.currentGig.songList) {
            await this.$store.dispatch('populateGigSongs', id)
            this.currentGig = await this.gigList.find(gig => gig.id === id)
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
        this.setCurrentSong()
      }
    },

    currentProgramMidiPedal: function (idx) {
      this.currentProgramIdx = idx
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

    async setCurrentSong () {
      const id = this.currentSongId
      if (this.currentSongList) {
        this.currentSong = await this.currentSongList.find(item => item.id === id)
      }
      if (!this.currentSong && this.selectedGigId > 0) {
        if (this.currentGig && this.currentGig.songList && this.currentGig.songList.length > 0) {
          this.currentSong = await this.currentGig.songList.find(item => item.id === id)
        }
      }

      if (!this.currentSong) {
        await this.setSongOutOfGig(id)
      }
      if (this.currentSong && !this.currentSong.programList) {
        await this.initSongPrograms(id)
      }
    },

    async setSongOutOfGig (id) {
      try {
        this.gigId = -1
        this.currentGig = null
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
      var gId = -1
      gId = this.gigList.find(g => g.currentFlag === 1).id
      if (gId > 0) {
        this.gigId = gId
      } else {
        this.gigId = -1
        this.songId = -1
      }
    },

    async initAllData () {
      try {
        if (!this.allInitialized && !this.initialisingIsInProgress) {
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
    async initSongPrograms (songId) {
      this.$store.dispatch('addSongItems', songId)
    },

    onProgramClick (idx) {
      this.$store.dispatch('selectSongProgram', idx)
    },

    checkIfGigIsCurrent () {
      if (!this.currentGig) return false
      return (this.currentGig.id === this.scheduledGigId)
    }
  }
}
</script>

<style scoped>

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
}
.darkBackgroud {
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
  margin-top: 5px;
  margin-left: -5px;
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
  margin-top: 5px;
  margin-left: -5px;
  margin-right: 2px;
  padding: 0px;
}
.selector-panel {
  height: 45px;
}
.v-select  {
  color: "warning";
  font-size: 20px;
  font-style: bold;
  text-shadow: 1px 1px 1px white;
  text-transform: uppercase;
  font-weight: bold;
  margin: 0px;
  margin-top: 0px;
  padding-bottom: 5px;
  padding-left: 5px;
  padding-right: 5px;
}
.v-select__selection,
.v-select__selection__comma,
.v-text-field input {
  color: yellow!important;
}
.selectSongButton {
  margin-left: 10px;
  color: blue;
}
.defaultGigHighighted {
  margin-left: -10px;
  margin-top: 5px;
  color: blue;
  font-size: 36px;
}
</style>

<template>
 <v-container grid-list-md text-md-center fluid class="darkBackgroud">
 <!-- <v-container fluid  class="darkBackgroud"> -->
<!-------PROFRAM A----------->
    <v-row md12 ma-0 pa-0 no-gutters style="background-color='red'">

      <div class="progLabel">
        <h1>A</h1>
      </div>

      <v-col md3 d-flex>
        <v-card class="pa-1" dark >
          <preset-control :presetControlData='getPresetControlData(0, 0)'/>
        </v-card>
      </v-col>
      <v-col md3 d-flex>
        <v-card class="pa-1" dark >
          <preset-control :presetControlData='getPresetControlData(0, 1)'/>
        </v-card>
      </v-col>
      <v-col md3 d-flex>
        <v-card class="pa-1" dark >
          <preset-control :presetControlData='getPresetControlData(0, 2)' />
        </v-card>
      </v-col>
      <v-col md3 d-flex>
        <v-card class="pa-1" dark >
          <preset-control :presetControlData='getPresetControlData(0, 3)' />
        </v-card>
      </v-col>

    </v-row>

<!-------PROFRAM B----------->
    <v-row md12 ma-0 pa-0 no-gutters>

      <div class="progLabelSelected">
        <h1>B</h1>
      </div>

      <v-col md3 d-flex>
        <v-card  class="pa-1" dark >
          <preset-control :presetControlData='getPresetControlData(1, 0)' />
        </v-card>
      </v-col>
      <v-col md3 d-flex>
        <v-card  class="pa-1" dark >
          <preset-control :presetControlData='getPresetControlData(1, 1)' />
        </v-card>
      </v-col>
      <v-col md3 d-flex>
        <v-card  class="pa-1" dark >
          <preset-control :presetControlData='getPresetControlData(1, 2)' />
        </v-card>
      </v-col>
      <v-col md3 d-flex>
        <v-card  class="pa-1" dark >
          <preset-control :presetControlData='getPresetControlData(1, 3)' />
        </v-card>
      </v-col>

    </v-row>
<!-------PROFRAM C----------->
    <v-row md12 ma-0 pa-0 no-gutters>

      <div class="progLabel">
        <h1>C</h1>
      </div>

      <v-col md3 d-flex>
        <v-card  class="pa-1" dark >
          <preset-control :presetControlData='getPresetControlData(2, 0)' />
        </v-card>
      </v-col>
      <v-col md3 d-flex>
        <v-card  class="pa-1" dark >
          <preset-control :presetControlData='getPresetControlData(2, 1)' />
        </v-card>
      </v-col>
      <v-col md3 d-flex>
        <v-card  class="pa-1" dark >
          <preset-control :presetControlData='getPresetControlData(2, 2)' />
        </v-card>
      </v-col>
      <v-col md3 d-flex>
        <v-card  class="pa-1" dark >
          <preset-control :presetControlData='getPresetControlData(2, 3)' />
        </v-card>
      </v-col>
    </v-row>

<!-------PROFRAM D----------->
    <v-row md12 no-gutters>

      <div class="progLabel">
        <h1>D</h1>
      </div>

      <v-col md3 d-flex>
        <v-card  class="pa-1" dark >
          <preset-control  :presetControlData='getPresetControlData(3, 0)'/>
        </v-card>
      </v-col>
      <v-col md3 d-flex>
        <v-card  class="pa-1" dark >
          <preset-control :presetControlData='getPresetControlData(3, 1)' />
        </v-card>
      </v-col>
      <v-col md3 d-flex>
        <v-card  class="pa-1" dark >
          <preset-control :presetControlData='getPresetControlData(3, 2)' />
        </v-card>
      </v-col>
      <v-col md3 d-flex>
        <v-card  class="pa-1" dark >
          <preset-control :presetControlData='getPresetControlData(3, 3)' />
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import SongsService from '@/services/SongsService'

export default {
  data () {
    return {
      currentSong: null,
      currentProgram: null,
      initFlag: true
    }
  },
  computed: {
    ...mapState(['presetList', 'instrumentList', 'instrumentBankList', 'songList', 'currentSongId', 'currentProgramId'])
  },
  watch: {
    currentSongId: function (id) {
      if (typeof this.songList !== 'undefined') {
        this.currentSong = this.songList.find(item => item.id === id)
      }
    },
    currentProgramId: function (id) {
      if (typeof this.programList !== 'undefined') {
        this.currentProgram = this.programList.find(item => item.id === id)
      }
    }
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
        this.currentSong = await this.songList[0]
        console.log(this.currentSong.programList)
        if (this.currentSong.programList === null ||
        typeof (this.currentSong.programList) === 'undefined') {
          await SongsService.getSongItems(this.currentSong.id)
          this.currentSong = await this.songList[0]
        }
        console.log('--- Current song ----')
        console.log(this.currentSong)
        this.currentProgram = 0
        this.initFlag = false
      } catch (ex) {
        console.log(ex)
      }
    },

    getPresetControlData (programIndex, presetIndex) {
      if (!this.initFlag) {
        try {
          // console.log(`get program for ${programIndex} ${presetIndex} `)
          // console.log(this.currentSong)
          if (typeof (this.currentSong) === 'undefined' || this.currentSong === null) {
            console.log(programIndex)
            return {}
          } else {
            if (this.currentSong.programList === null ||
            typeof (this.currentSong.programList) === 'undefined') {
              SongsService.getSongItems(this.currentSong.id)
              this.currentSong = this.songList[0]
            }

            const preset = this.currentSong.programList[programIndex].presetList[presetIndex]
            // console.log(preset)
            return preset
          }
        } catch (ex) {
          console.log(ex)
        }
      }
    }
  }
}
</script>

<style scoped>
  .preset {
    margin: 5px;
  }
  .v-card {
    color: rgba(36, 34, 34, 0.856);
    padding: 3px;
    margin: 4px;
  }
  .darkBackgroud {
    background-color:rgba(36, 34, 34, 0.830)
  }

.progLabel {
  text-align: center;
  text-justify: auto;
  color:black;
  border: 2px solid black;
  border-radius: 10px;

  width: 40px;
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

  width: 40px;
  height: 50px;
  /* margin: 50px, 10px, 0px, -10px; */
  margin-top: 50px;
  margin-left: -10px;
  margin-right: 2px;
  padding: 0px;
}

</style>

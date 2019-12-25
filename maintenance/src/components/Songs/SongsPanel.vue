<template>
  <vpanel title="Songs">
    <v-btn
      slot="action"
      :to="{
        name: 'songs-create'
      }"
      class="cyan accent-2"
      light
      medium
      absolute
      right
      middle
      fab>
      <v-icon>add</v-icon>
    </v-btn>
    <div
      v-for="song in songs"
      class="song"
      :key="song.id">
      <v-layout>
        <v-flex xs6>
          <div class="song-name">
            {{song.name}}
          </div>
          <div class="song-tempo">
            {{song.tempo}}
          </div>
          <v-btn
            dark
            class="cyan"
            :to="{
              name: 'song',
              params: {
                songId: song.id
              }
            }">
            View
          </v-btn>
        </v-flex>
        <v-flex xs6>
          <v-text-field
            v-model="placeholder"
            label="Lirycs"
          ></v-text-field>
        </v-flex>
      </v-layout>
    </div>
  </vpanel>
</template>

<script>
import SongsService from '@/services/SongsService'

export default {
  data () {
    return {
      songs: null,
      placeholder: ''
    }
  },
  watch: {
    '$route.query.search': {
      immediate: true,
      async handler (value) {
        this.songs = (await SongsService.showAll()).data
      }
    }
  }
}
</script>

<style scoped>
.song {
  padding: 20px;
  height: 330px;
  overflow: hidden;
}

.song-title {
  font-size: 30px;
}

.song-artist {
  font-size: 24px;
}

.song-genre {
  font-size: 18px;
}

.album-image {
  width: 70%;
  margin: 0 auto;
}
</style>

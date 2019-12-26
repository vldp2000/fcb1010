<template>
  <v-layout>
    <v-flex class="ml-2">
      <songs-panel class="mt-2" />
    </v-flex>
  </v-layout>
</template>

<script>
import SongsPanel from './SongsPanel'
import SongsService from '@/services/SongsService'

export default {
  components: {
    SongsPanel
  },
  data () {
    return {
    }
  },
  async mounted () {
    if (!this.$store.state.songList || !this.$store.state.songList.Length) {
      let songs = (await SongsService.index()).data
      this.$store.dispatch('setSongList', songs)
    }
  }
}
</script>

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
  methods: {
    async init () {
      console.log(this.$store.state.songList.length)
      // if (!this.$store.state.songList || this.$store.state.songList === undefined || !this.$store.state.songList.Length) {
      if (this.$store.state.songList.length === 0) {
        console.log('Init songs storage')
        let result = await SongsService.getAll()
        let list = await result.data
        // console.log('<< Init Song List?>>')
        await this.$store.dispatch('setSongList', list)
        // console.log(this.$store.state.songList)
      } else {
        console.log(' Song List already populated')
      }
    }
  },
  mounted () {
    this.init()
  }
}
</script>

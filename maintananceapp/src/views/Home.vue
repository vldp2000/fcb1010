<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <SongList msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import SongList from '@/components/SongList.vue'

export default {
  name: 'home',
  components: {
    SongList
  }
}
</script>

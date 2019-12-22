<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >

    </v-app-bar>

    <v-content>
      <SongList/>
    </v-content>
  </v-app>
</template>

<script>
import SongList from './components/SongList';

export default {
  name: 'App',

  components: {
    SongList,
  },

  data: () => ({
    //
  }),
};
</script>


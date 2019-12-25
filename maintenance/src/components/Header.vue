<template>
<div>
  <v-toolbar fixed class="cyan" dark solid>
    <v-toolbar-title class="mr-4">
      <router-link
        class="maintenance"
        tag="span"
        :to="{
          name: 'home'
        }">
        Maintenance
      </router-link>
    </v-toolbar-title>

    <v-toolbar-items>
      <v-btn
        :to="{
          name: 'home'
        }">
        Home
      </v-btn>
      <v-btn
        :to="{
          name: 'songs'
        }">
        songs
      </v-btn>
    </v-toolbar-items>

  </v-toolbar>
  </div>
</template>

<script>
export default {
}
</script>

<style scoped>
.home {
  cursor: pointer;
}

.home:hover {
  color: #E9E;
}
</style>

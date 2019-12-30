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
          name: 'gigcontrol'
        }">
        Gig Contol
      </v-btn>
      <v-btn
        :to="{
          name: 'songs'
        }">
        songs
      </v-btn>
      <v-btn
        :to="{
          name: 'test'
        }">
        Test
      </v-btn>
      <v-btn
        :to="{
          name: 'instruments'
        }">
        Instruments
      </v-btn>
      <v-btn
        :to="{
          name: 'presets'
        }">
        Presets
      </v-btn>
      <v-btn
        :to="{
          name: 'instrumentBank'
        }">
        instrumentBank
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

<template>
  <v-container>
    <v-layout
      text-center
      wrap
    >
      <v-flex mb-12>
        <custom-panel title="Song Programs">
          <h1 class="display-2 font-weight-bold mb-3">
            Welcome to Song Programs
          </h1>
        </custom-panel>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'SongProgramsPanel',

  data: () => ({
    selectedGig: {}

  })
}
</script>

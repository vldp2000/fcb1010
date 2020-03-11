<template>
  <v-app id="inspire">

    <nav>
      <v-navigation-drawer
        v-model="drawer"
        :clipped="$vuetify.breakpoint.lgAndUp"
        app
      >
        <v-list>
          <template v-for="item in items">

            <v-row
              v-if="item.heading"
              :key="item.heading"
              :to="item.link"
              align="center"
            >
              <v-col cols="6">
                <v-subheader v-if="item.heading">
                  {{ item.heading }}
                </v-subheader>
              </v-col>
              <v-col
                cols="6"
                class="text-center"
              >
                <a class="body-2 black--text"> EDIT </a>
              </v-col>
            </v-row>

            <v-list-group
              v-else-if="item.children"
              :key="item.text"
              v-model="item.model"
              :prepend-icon="item.model ? item.icon : item['icon-alt']"
              append-icon=""
            >
              <template v-slot:activator>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ item.text }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
              <v-list-item
                v-for="(child, i) in item.children"
                :key="i"
                :to="child.link"
              >
                <v-list-item-action v-if="child.icon">
                  <v-icon>{{ child.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ child.text }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-group>

            <v-list-item
              v-else
              :key="item.text"
              :to="item.link"
            >
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.text }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>
      </v-navigation-drawer>

    </nav>

    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      color="blue darken-3"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title
        style="width: 300px"
        class="ml-0 pl-4"
      >
        <span>Midi Gig Manager</span>
      </v-toolbar-title>

      <!-- <v-text-field
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="mdi-magnify"
        label="Search"
      /> -->
      <v-spacer />

      <v-btn
        icon
        large
      >
        <v-avatar
          size="32px"
          item
        >
          <v-img
            src="https://cdn.vuetifyjs.com/images/logos/logo.svg"
            alt="Vuetify"
          /></v-avatar>
      </v-btn>
    </v-app-bar>
    <v-content>
      <!-- Display view pages here based on route -->
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>

import { mapState } from 'vuex'

export default {
  props: {
    source: String
  },

  data: () => ({
    drawer: null,
    items: [
      { icon: 'mdi-desktop-classic', text: 'gigcontrol', link: '/gigcontrol' },
      { icon: 'mdi-chevron-up',
        'icon-alt': 'mdi-chevron-down',
        text: 'Maintenance',
        model: false,
        children: [
          { icon: 'mdi-playlist-check', text: 'Songs', link: '/songs' },
          { icon: 'mdi-calendar', text: 'Gigs', link: '/gigs' },
          { icon: 'mdi-bookmark-music', text: 'Presets', link: '/presets' },
          { icon: 'mdi-guitar-acoustic', text: 'Instruments', link: '/instruments' },
          { icon: 'mdi-window-restore', text: 'Instrument Banks', link: '/instrumentBanks' }
        ]
      }
    ]
  }),
  created () {
    this.$log.debug('VUE is mounted')
    this.initAllData()
  },

  computed: {
    ...mapState(['allInitialized', 'initialisingIsInProgress'])
  },

  methods: {
    async initAllData () {
      try {
        if (!this.allInitialized && !this.initialisingIsInProgress) {
          // this.$log.debug(' >>> Init all related collections in storage1')
          this.$store.dispatch('initAllLists', true)
        }
      } catch (ex) {
        this.$log.debug(ex)
      }
    }
  }
}
</script>

<style>
  #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  /* color: #2c3e50; */
  /* margin-top: 60px; */
}

.danger-alert {
  color: red;
}
</style>

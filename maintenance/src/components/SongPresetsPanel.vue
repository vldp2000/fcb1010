<template>
<div style="overflow-x: scroll;">
  <v-data-table
    :headers="headers"
    :items="songPresetList"
    item-key="id"
    class="elevation-1"
    dense
    hide-default-footer
    disable-sort
    disable-pagination
    @click:row="onClick"
  >

    <template v-slot:item.image="{ item }">
      <div class ="image">
        <v-img v-bind:src="instrumentList.find(i => i.id === item.refinstrument).imageURL" :alt="item.image"
          contain
        >
        </v-img>
      </div>
    </template>

    <template v-slot:item.preset="{ item }">
      <v-chip color="blue" dark>{{ presetList.find(i => i.id === item.refpreset).name }}</v-chip>
    </template>

    <template v-slot:item.instrumentbank="{ item }">
      <v-chip color="blue" dark>{{ instrumentBankList.find(i => i.id === item.refinstrumentbank).name }}</v-chip>
    </template>

    <template v-slot:item.volume="{ item }">
      <div class="customKnob">
        <my-knob
          :value="parseInt(item.volume,10)"
        >
        </my-knob>
      </div>
    </template>

    <template v-slot:item.pan="{ item }">
      <div class="customKnob">
        <my-knob
          :value="parseInt(item.pan,10)"
        >
        </my-knob>
      </div>
    </template>

    <template v-slot:item.muteflag="{ item }">
      <v-checkbox v-model="item.muteflag" />
   </template>

    <template v-slot:item.reverbflag="{ item }">
      <v-checkbox v-model="item.reverbflag" />
   </template>

    <template v-slot:item.reverbvalue="{ item }">
      <div class="customKnob">
        <my-knob
          :value="parseInt(item.reverbvalue,10)"
        >
        </my-knob>
      </div>
    </template>

    <template v-slot:item.delayflag="{ item }">
      <v-checkbox v-model="item.delayflag" />
   </template>

    <template v-slot:item.delayvalue="{ item }">
      <div class="customKnob">
        <my-knob
          :value="parseInt(item.delayvalue,10)"
        >
        </my-knob>
      </div>
    </template>

    <template v-slot:item.modeflag="{ item }">
      <v-checkbox v-model="item.modeflag" />
   </template>
  </v-data-table>
</div>
</template>

<script>
// import { mapState } from 'vuex'
import { mapState } from 'vuex'
import { singleOrDoubleRowClick } from '@/helpers/utils'

export default {
  name: 'SongPresetsPanel',
  props: {
    songPresetList: {
      type: Array
    }
  },

  data () {
    return {
      headers: [
        // {
        //   text: 'name',
        //   align: 'left',
        //   sortable: false,
        //   value: 'name'
        // },
        { text: 'image', value: 'image' },
        { text: 'bank', value: 'instrumentbank' },
        { text: 'preset', value: 'preset' },
        { text: 'volume', value: 'volume' },
        { text: 'pan', value: 'pan' },
        { text: 'mute', value: 'muteflag' },
        { text: 'reverb', value: 'reverbflag' },
        { text: 'rev value', value: 'reverbvalue' },
        { text: 'delay', value: 'delayflag' },
        { text: 'del value', value: 'delayvalue' },
        { text: 'mode', value: 'modeflag' }
      ],
      expanded: [],
      singleExpand: false
    }
  },
  computed: {
    ...mapState(['presetList', 'instrumentList', 'instrumentBankList'])
  },

  mounted () {
    //this.programList = this.selectedSong.programList
    // this.$log.debug('----->SongPresetsPanel')
    // this.$log.debug(this.songPresetList)
  },
  methods: {
    onClick (item) {
      try {
        let that = this
        singleOrDoubleRowClick(item,
          function singleCLick (item) {
            that.$log.debug('Single Click')
          },
          function doubleCLick (item) {
            that.$log.debug('Double Click')
          }
        )
      } catch (ex) {
        this.$log.debug(ex)
      }
    }
  }
}
</script>

<style scoped>
  .image {
    height:70px;
    width: 55px;
    padding: 2px;
  }
  .customKnob {
    height:55px;
    width: 55px;
    margin-top: 5px;
  }
  .td {
    text-align: "text-xs-left";
  }
</style>

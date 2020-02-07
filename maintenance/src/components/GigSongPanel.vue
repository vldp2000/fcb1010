<template>
  <v-data-table :items="codes"
                      hide-actions
                      hide-headers
                      class="elevation-1 ml-5"
                      no-data-text="No codes found"
                      v-sortable-table
                      @sorted="saveOrder"
        />
</template>

<script>
// import SortableTable from '@/plugins/SortableTable'

export default {
  name: 'GigSongPanel',

  props: {
    gigSongList: {
      type: Array
    }
  },

  data () {
    return {
      headers: [
        {
          text: 'Name',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: 'Id', sortable: false, value: 'id' }
      ]
    }
  },

  methods: {
    saveOrder: function () {
      console.log(' order changed')
    }
  }
}

</script>

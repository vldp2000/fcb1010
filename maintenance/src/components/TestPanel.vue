<template>
  <v-container fluid>
    <v-layout align-start justify-center>
      <v-data-table :headers="headers" :items="desserts" hide-actions class="elevation-2">
        <template slot="items" slot-scope="props">
          <td class="handle" style="max-width: 28px;">::</td>
          <td>{{ props.item.name }}</td>
          <td class="text-xs-right">{{ props.item.calories }}</td>
          <td class="text-xs-right">{{ props.item.fat }}</td>
          <td class="text-xs-right">{{ props.item.carbs }}</td>
          <td class="text-xs-right">{{ props.item.protein }}</td>
          <td class="text-xs-right">{{ props.item.iron }}</td>
        </template>
      </v-data-table>
    </v-layout>
  </v-container>
</template>

<script>
import Sortable from 'sortablejs';
export default {
  name: 'TestPanel',
  data() {
    return {
      headers: [
        {
          text: '',
          align: 'left',
          sortable: false
        },
        {
          text: 'Dessert (100g serving)',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: 'Calories', value: 'calories' },
        { text: 'Fat (g)', value: 'fat' },
        { text: 'Carbs (g)', value: 'carbs' },
        { text: 'Protein (g)', value: 'protein' },
        { text: 'Iron (%)', value: 'iron' }
      ],
      desserts: [
        {
          value: false,
          name: 'Lollipop',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          iron: '1%'
        },
        {
          value: false,
          name: 'Marshamallow',
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          iron: '7%'
        },
        {
          value: false,
          name: 'Noughat',
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          iron: '8%'
        },
        {
          value: false,
          name: 'Oreo',
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          iron: '16%'
        },
        {
          value: false,
          name: 'Peppermint',
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          iron: '2%'
        }
      ]
    };
  },
  mounted() {
    let table = document.querySelector('.v-datatable tbody');
    const _self = this;
    Sortable.create(table, {
      handle: '.handle', // Use handle so user can select text
      onEnd({ newIndex, oldIndex }) {
        const rowSelected = _self.desserts.splice(oldIndex, 1)[0]; // Get the selected row and remove it
        _self.desserts.splice(newIndex, 0, rowSelected); // Move it to the new index
      }
    });
  }
};
</script>

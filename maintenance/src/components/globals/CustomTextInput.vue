<template>
  <div>
    <label class='label-input' v-bind:for="fieldId">{{labelName}}</label>
    <input v-bind:id="fieldId" v-bind:class="cssClass" v-bind:placeholder="placeHolder" v-bind:value="value" v-on:input="updateValue($event.target.value)"/>
  </div>
</template>

<script>
export default {
  props: {
    labelName: {
      type: String,
      required: true
    },
    fieldId: {
      type: String,
      required: false
    },
    cssClass: {
      type: String,
      default: 'input-field'
    },
    placeHolder: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: '0'
    }
  },

  methods: {
    updateValue: function (value) {
      this.$emit('input', value)
    }
  }
}
</script>

<style>
  .label-input {
    display: block;
    margin: 2px;
  }
  .input-field {
    padding: -3px;
    margin: 2px;
    font-size: 12px;
    display: block;
    -moz-box-shadow: 1px 1px 2px 3px #ccc;
    -webkit-box-shadow: 1px 2px 2px 3px #ccc;
    box-shadow: 1px 1px 2px 3px #ccc;
  }
</style>

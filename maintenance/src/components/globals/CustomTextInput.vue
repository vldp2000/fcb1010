<template>
  <div id="main">
    <!-- <label class='label-input' v-bind:for="fieldId">{{labelName}}</label> -->
    <input
      :id="fieldId"
      :readonly="!editMode"
      class="input-field"
      :placeholder="placeHolder"
      :value="value"
      v-on:input="updateValue($event.target.value)"/>
  </div>
</template>

<script>
export default {
  props: {
    editMode: {
      type: Boolean,
      default: false
    },
    labelName: {
      type: String,
      default: '',
      required: false
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
      type: [String, Number],
      default: 0
    }
  },

  methods: {
    updateValue: function (value) {
      this.$emit('input', value)
    }
  },

  beforeDestroy () {
    this.isComponentInitialised = false
  }
}
</script>

<style scoped>
  #main {
    width: 60px;
    height: 24px;
    /* border: 1px solid black; */
    display: -webkit-flex; /* Safari */
    -webkit-align-items: center; /* Safari 7.0+ */
    display: flex;
    align-items: center;
  }
  /* .textInput {
    border: solid 1px #444342fd;
    width: 50px;
    height: 20px;
    margin-top: 5px;
  } */

  /* .label-input {
    display: block;
  } */
  .input-field {
    /* padding: -3px;
    margin: 2px; */
    font-size: 10px;
    /* display: block; */
    -moz-box-shadow: 0px 0px 1px 1px #ccc;
    -webkit-box-shadow: 0px 0px 1px 1px #ccc;
    box-shadow: 0px 0px 1px 1px #ccc;

    border: solid 1px #444342fd;
    /* padding: 1px; */
    width: 60px;
    height: 16px;
  }
</style>

<template>
  <div class="details_title">
    <h1 :style="`color: ${color}`">{{ title }}</h1>
  </div>
</template>

<script>
export default {
  name: 'Index',
  props: {
    title: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: ''
    }
  },
  data() {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
  .details_title {
    height: 32px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f5f5f5;
    margin-bottom: 6px;
    h1,
    p {
      margin: 0;
      color: #343434;
      font-size: 14px;
    }
    h1 {
      font-weight: bold;
    }
  }
</style>

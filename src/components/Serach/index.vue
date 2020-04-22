<template>
  <div class="serach">
    <div v-for="item in options" :key="item.serachvalue">
      <el-input v-model="item.value" size="mini" :placeholder="item.label" />
    </div>
    <div>
      <el-button size="mini" class="from-serach" @click="serach">搜索</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Serach',
  components: {},
  props: {
    options: {
      type: Array
    }
  },
  data() {
    return {
      value: '',
      Sreachvalue: ''
    }
  },
  created() {

  },
  methods: {
    serach() {
      this.$emit('serach', this.options)
    }
  }
}
</script>
<style lang="scss" scoped>

</style>

<template>
  <div class="serach">
    <div>
      <el-input v-model="Sreachvalue" size="mini" placeholder="请输入分类名称" />
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
  data() {
    return {
      Sreachvalue: ''
    }
  },
  created() {

  },
  methods: {
    serach() {
      this.$emit('newsSearch', this.Sreachvalue)
    }
  }
}
</script>
<style lang="scss" scoped>

</style>

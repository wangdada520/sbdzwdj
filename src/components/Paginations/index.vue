<template>
  <el-pagination
    background
    layout="total, sizes, prev, pager, next, jumper"
    :hide-on-single-page="isHide"
    :page-size="pageSize"
    :total="total"
    :current-page.sync="pageNum"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    isHide: {
      type: Boolean,
      default: false
    },
    pageSize: {
      type: Number,
      default: 20
    },
    pageNum: {
      type: Number,
      default: 1
    },
    total: {
      type: Number,
      default: 0
    }
  },
  watch: {
    pageNum(val) {
      console.log(val)
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('handleSizeChange', val)
    },
    handleCurrentChange(val) {
      this.$emit('handleCurrentChange', val)
    }
  }
}
</script>

<style scoped>
.pagination{
    float: right;
    padding-top: 20px;
    padding-bottom: 20px;
}
</style>

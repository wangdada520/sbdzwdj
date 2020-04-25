<template>
  <div>
    <el-dialog
      class="dialog_tab"
      :visible.sync="centerDialogVisible"
      append-to-body
      :close-on-click-modal="false"
      title="详情"
      @closed="closed"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane label="基本信息" name="first">
          <JobInformation :taskid="taskid" />
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import JobInformation from './Details/JobInformation'
export default {
  name: 'AllDetails',
  components: {
    JobInformation
  },
  props: {
    taskid: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      centerDialogVisible: false,
      activeName: 'first'
    }
  },
  mounted() {
    console.log(this.taskid)
  },
  methods: {
    // 关闭动画结束后触发
    closed() {
      this.$emit('closed')
    }
  }
}
</script>

<style scoped>

</style>

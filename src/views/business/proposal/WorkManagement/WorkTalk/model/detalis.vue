<template>
  <!-- 工作沟通-新增沟通-->
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      append-to-body
      :close-on-click-modal="false"
      @closed="closed"
    >
      <!-- 进度条 -->
      <!-- <div class="progress">
        <el-progress :percentage="percent" />
      </div> -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="沟通信息" name="first">
          <WorkInfo ref="WorkInfoRef" :form="form" />
        </el-tab-pane>
        <el-tab-pane label="沟通记录" name="second">配置管理</el-tab-pane>
      </el-tabs>
      <DialogFooter slot="footer" @handleOk="handleOk" @handleNo="handleNo" />
    </el-dialog>
  </div>
</template>

<script>
import WorkInfo from '../components/WorkInfo'
import { addworkFeedback, getworkFeedback } from '@/views/business/api/WorkTalk'
export default {
  components: {
    WorkInfo
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    form: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      activeName: 'first'
    }
  },
  created() {
    if (this.title === '编辑') {
      this.getForm(this.form.wfId)
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    handleNo() {
      this.dialogVisible = false
    },
    // 编辑
    getForm(id) {
      getworkFeedback(id).then(res => {
        const { data, code } = res
        if (code === 200) {
          this.$refs.WorkInfoRef.workform = data
        }
      })
    },
    handleOk() {
      const flag = this.$refs.WorkInfoRef.$refs.workformRef.validate()
      const workform = this.$refs.WorkInfoRef.workform
      workform.wfTaskId = this.form.taskId
      if (flag) {
        // 提交数据
        addworkFeedback(workform).then(res => {
          const { code } = res
          if (code === 200) {
            this.dialogVisible = false
            this.$parent.getList()
            this.$notify({
              title: '成功',
              message: '填写成功',
              type: 'success'
            })
          }
        })
      } else {
        this.$message({ message: '请完善数据!', type: 'warning' })
      }
    },
    // 关闭模态框
    closed() {
      this.$emit('closed')
    }
  }
}
</script>

<style scoped>
.btn_content {
  position: relative;
}
.btn {
  position: absolute;
  left: 20px;
}
.progress {
  padding: 10px 0;
}
</style>

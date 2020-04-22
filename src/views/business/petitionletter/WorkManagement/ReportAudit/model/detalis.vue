<template>
  <!-- 汇报审核详情页 -->
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      append-to-body
      :close-on-click-modal="false"
      @closed="closed"
    >
      <DetaTab :title="form.taskName" />
      <!-- 进度条 -->
      <div class="progress">
        <el-progress :percentage="percent" />
      </div>
      <TableHeader :id="form.taskId" />
      <ReportTable
        :id="form.reportId"
        operation-code="taskReport"
        :operation-id="form.reportId"
        @percent="setPercent"
      />
      <!-- 审核记录 -->
      <WorkReportForm
        :id="form.checkId"
        ref="WorkReportForm"
        :operation-code="operationCode"
        :operation-id="form.reportId"
      />
      <DialogFooter slot="footer" @handleOk="handleOk" @handleNo="handleNo" />
    </el-dialog>
  </div>
</template>

<script>
import TableHeader from '@/views/business/petitionletter/components/TableHeader'
import ReportTable from '@/views/business/petitionletter/components/ReportTable'
import WorkReportForm from '@/views/business/components/WorkReport/WorkReportForm'
import { putCheckde } from '@/views/business/api/ReportAudit'
export default {
  components: {
    TableHeader,
    ReportTable,
    WorkReportForm
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
      operationCode: 'taskReport', // 附件编码
      percent: 0
    }
  },
  methods: {
    // 审核
    handleOk() {
      const flag = this.$refs['WorkReportForm'].validateForm()
      if (flag) {
        putCheckde(this.form.checkId, this.$refs['WorkReportForm'].form).then(
          res => {
            const { code } = res
            if (code === 200) {
              this.dialogVisible = false
              this.$parent.getList()
              this.$notify({
                title: '成功',
                message: '审核成功',
                type: 'success'
              })
            }
          }
        )
      } else {
        this.$message({ message: '请完善数据!', type: 'warning' })
      }
    },
    // 设置进度条
    setPercent(val) {
      this.percent = Number(val)
    },
    handleNo() {
      console.log(1111)

      this.dialogVisible = false
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

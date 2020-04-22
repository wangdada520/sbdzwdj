<template>
  <!-- 工作汇报记录详情页面 -->
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      append-to-body
      :close-on-click-modal="false"
      @closed="closed"
    >
      <div @click="log1">
        <DetaTab :title="form.taskName" />
      </div>
      <!-- 进度条 -->
      <div class="progress">
        <el-progress :percentage="percent" />
      </div>
      <TableHeader :id="form.taskId" />
      <!-- 汇报记录 -->
      <ReportTable
        :id="form.reportId"
        :operation-code="operationCode"
        :operation-id="form.reportId"
        @percent="setPercent"
      >
        <AuditTableOne :report-id="form.reportId" />
      </ReportTable>
    </el-dialog>
  </div>
</template>

<script>
import TableHeader from '@/views/business/petitionletter/components/TableHeader'
import ReportTable from '@/views/business/petitionletter/components/ReportTable'
import AuditTableOne from '@/views/business/components/Audit/AuditTableOne'
import { getChecksByReportId } from '@/views/business/api/WorkReportLog'
export default {
  components: {
    TableHeader,
    ReportTable,
    AuditTableOne
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
      percent: 0,
      operationCode: 'taskReport', // 附件编码
      activeName: 'first'
    }
  },
  methods: {
    log1() {},
    // 设置进度条
    setPercent(val) {
      this.percent = Number(val)
    },
    handleClick(tab, event) {
      console.log(tab, event)
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

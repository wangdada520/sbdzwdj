<template>
  <!-- 汇报审核记录详情页面 -->
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      append-to-body
      :close-on-click-modal="false"
      @closed="closed"
    >
      <div @click="cx">
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
        <AuditTableTwo :check-id="form.checkId" />
      </ReportTable>
    </el-dialog>
  </div>
</template>

<script>
import TableHeader from '@/views/business/Instructions/components/TableHeader'
import ReportTable from '@/views/business/Instructions/components/ReportTable'
import AuditTableTwo from '@/views/business/components/Audit/AuditTableTwo'
import { getTaskCheck } from '@/views/business/api/ReportAudit'
export default {
  components: {
    TableHeader,
    ReportTable,
    AuditTableTwo
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
      operationCode: 'taskReport' // 附件编码
    }
  },
  created() {
    this.getDetalis()
  },
  methods: {
    // 获取审批记录表格的数据
    getDetalis() {
      getTaskCheck(this.form.checkId).then(res => {
        const { data, code } = res
        if (code === 200) {
          this.details = data
        }
      })
    },
    // 设置进度条
    setPercent(val) {
      this.percent = Number(val)
    },
    // 关闭模态框
    closed() {
      this.$emit('closed')
    },
    cx() {
      console.log(1111)
    }
  }
}
</script>

<style scoped>
.progress {
  padding: 10px 0;
}
</style>

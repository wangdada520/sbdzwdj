<template>
  <div>
    <DetaTab title="审批记录" />
    <div class="details-height">
      <div class="details-form">
        <div>
          <label>审核部门</label>
          <span>{{ details.deptName }}</span>
        </div>
        <div>
          <label>审核人</label>
          <span>{{ details.userName }}</span>
        </div>
      </div>
      <div class="details-form">
        <div>
          <label>审核状态</label>
          <span>{{ details.statusStr }}</span>
        </div>
        <div>
          <label />
          <span />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getChecksByReportId } from '@/views/business/api/WorkReportLog'
export default {
  props: {
    reportId: {
      type: String,
      required: true,
      default: ''
    }
  },
  data() {
    return {
      details: {}
    }
  },
  created() {
    this.getDetailByReportId()
  },
  methods: {
    // 通过ReportId获取审核详情
    getDetailByReportId() {
      const params = {
        reportId: this.reportId
      }
      getChecksByReportId(params).then(res => {
        const { data, code } = res
        if (code === 200) {
          this.details = data[0]
        }
      })
    }
  }
}
</script>

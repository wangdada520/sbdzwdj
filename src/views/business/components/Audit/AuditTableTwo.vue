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
          <label>审核时间</label>
          <span>{{ details.checkTime }}</span>
        </div>
      </div>
      <div class="details-form">
        <div>
          <label>进展认定</label>
          <span>{{ details.newProgressStr }}</span>
        </div>
        <div>
          <label />
          <span />
        </div>
      </div>
      <div class="details-form">
        <div>
          <label>意见内容</label>
          <span>{{ details.content }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getTaskCheck } from '@/views/business/api/ReportAudit'
export default {
  props: {
    checkId: {
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
    this.getDetalis()
  },
  methods: {
    // 通过checkId获取审核详情
    getDetalis() {
      getTaskCheck(this.checkId).then(res => {
        const { data, code } = res
        if (code === 200) {
          this.details = data
        }
      })
    }
  }
}
</script>

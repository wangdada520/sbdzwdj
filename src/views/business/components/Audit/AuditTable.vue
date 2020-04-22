<template>
  <div>
    <DetaTab title="审批记录" />
    <div class="details-height">
      <!-- 工作汇报记录中的审核记录 -->
      <template v-if="iswork">
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
      </template>

      <!-- 汇报审核记录中的审核记录 -->
      <template v-if="isAuditLog">
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
      </template>
    </div>
  </div>
</template>

<script>
import { getChecksByReportId, getTaskCheck } from '@/views/business/api/Common'
export default {
  props: {
    idName: {
      type: String,
      required: true,
      default: ''
    },
    id: {
      type: String,
      required: true,
      default: ''
    }
  },
  data() {
    return {
      details: {},
      iswork: false,
      isAuditLog: false
    }
  },
  created() {
    switch (this.idName) {
      // 根据汇报id获取审核记录
      case 'reportId':
        this.getChecks()
        this.iswork = true
        break
      case 'checkId':
        //   汇报审核、审核记录获取表格
        this.isAuditLog = true
        this.getTask()
        break
    }
  },
  methods: {
    // 根据汇报id获取审核记录
    getChecks() {
      const params = {}
      params[this.idName] = this.id
      getChecksByReportId(params).then(res => {
        const { data, code } = res
        if (code === 200) {
          this.details = data[0]
        }
      })
    },
    // 根据汇报审核、审核记录获取表格
    getTask() {
      getTaskCheck(this.id).then(res => {
        const { data, code } = res
        if (code === 200) {
          this.details = data
        }
      })
    }
  }
}
</script>

<template>
  <div>
    <div class="details-height">
      <div class="details-form">
        <div>
          <label>汇报单位</label>
          <span>{{ details.deptName }}</span>
        </div>
        <div>
          <label>汇报时间</label>
          <span>{{ details.reportTime }}</span>
        </div>
      </div>
      <div class="details-form">
        <div>
          <label>汇报人</label>
          <span>{{ details.userName }}</span>
        </div>
        <div>
          <label>联系电话</label>
          <span>{{ details.phone }}</span>
        </div>
      </div>
      <div class="details-form">
        <div>
          <label>汇报时限</label>
          <span>{{ details.reportEndTime }}</span>
        </div>
        <div>
          <label>办结时限</label>
          <span>{{ details.endTime }}</span>
        </div>
      </div>
      <div class="details-form">
        <div>
          <label>进展认定</label>
          <span>{{ details.progressStr }}</span>
        </div>
        <div>
          <label>预警状态</label>
          <span>{{ details.beyondTypeStr }}</span>
        </div>
      </div>
      <div class="details-form">
        <div>
          <label>推进情况</label>
          <span>
            <pre>{{ details.content }}</pre>
          </span>
        </div>
      </div>
      <div class="details-form">
        <div>
          <label>存在问题</label>
          <span>
            <pre>{{ details.problem }}</pre>
          </span>
        </div>
      </div>
      <div class="details-form">
        <div>
          <label>下步计划</label>
          <span>
            <pre>{{ details.plan }}</pre>
          </span>
        </div>
      </div>
    </div>
    <FilePreview :operation-code="operationCode" :operation-id="operationId" />
    <slot />
  </div>
</template>

<script>
import { getTaskReport } from '@/views/business/api/Common'
export default {
  props: {
    id: {
      type: String,
      required: true,
      default: ''
    },
    operationCode: {
      type: String,
      required: true,
      default: ''
    },
    operationId: {
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
    this.getReport()
  },
  methods: {
    getReport() {
      getTaskReport(this.id).then(res => {
        const { data, code } = res
        if (code === 200) {
          this.details = data
          this.postValue(this.details.percent)
        }
      })
    },
    postValue(val) {
      this.$emit('percent', val)
    }
  }
}
</script>

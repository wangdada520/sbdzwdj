<template>
  <div>
    <!-- 第一个表格 -->
    <div class="details-height">
      <div class="details-form">
        <div>
          <label>会议大类</label>
          <span>{{ details.dictValueTwoStr }}</span>
        </div>
        <div>
          <label>会议小类</label>
          <span>{{ details.dictValueThreeStr }}</span>
        </div>
      </div>
      <div class="details-form">
        <div>
          <label>会议名称</label>
          <span>
            <pre>{{ details.reportAsk }}</pre>
          </span>
        </div>
      </div>
      <div class="details-form">
        <div>
          <label>工作目标内容</label>
          <span>
            <pre>{{ details.taskContent }}</pre>
          </span>
        </div>
      </div>
      <div class="details-form">
        <div>
          <label>督办要求</label>
          <span>
            <pre>{{ details.dbAskcontent }}</pre>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDetail } from '@/views/business/api/WorkSignOn'
export default {
  props: {
    id: {
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
    this.getDetailForm()
  },
  methods: {
    getDetailForm() {
      const params = {
        taskId: this.id
      }
      getDetail(params).then(res => {
        const { data, code } = res
        if (code === 200) {
          this.details = data.taskRecord
        }
      })
    }
  }
}
</script>

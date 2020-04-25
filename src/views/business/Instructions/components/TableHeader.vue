<template>
  <div>
    <!-- 第一个表格 -->
    <div class="details-height">
      <div class="details-form">
        <div>
          <label>批示领导</label>
          <span>{{ details.people3 }}</span>
        </div>
        <div>
          <label>督办频次</label>
          <span>{{ details.cycleStr }}</span>
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
          <span>{{ details.dbAskcontent }}</span>
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

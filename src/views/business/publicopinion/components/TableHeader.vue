<template>
  <div>
    <!-- 第一个表格 -->
    <div class="details-height">
      <div class="details-form">
        <div>
          <label>记录来源</label>
          <span>{{ details.dictValueTwoStr }}</span>
        </div>
      </div>
      <div class="details-form">
        <div>
          <label>问题类别</label>
          <span>{{ details.dictValueOneStr }}</span>
        </div>
      </div>
      <div class="details-form">
        <div>
          <label>反映问题</label>
          <span>{{ details.taskContent }}</span>
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

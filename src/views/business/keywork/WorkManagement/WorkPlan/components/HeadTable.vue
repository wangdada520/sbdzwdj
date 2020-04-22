<template>
  <!-- 新增月计划、周计划表格 -->
  <div>
    <div class="details-height">
      <div class="details-form">
        <div>
          <label>工作类别</label>
          <span>{{ details.dictValueOneStr }}</span>
        </div>
        <div>
          <label>督办频次</label>
          <span>{{ details.cycleStr }}</span>
        </div>
      </div>
      <div class="details-form">
        <div>
          <label>阶段工作目标内容</label>
          <span>{{ details.dutieTarget }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDetail } from '@/views/business/api/WorkSignOn'
import { getworkPlan } from '@/views/business/api/WorkPlan'
export default {
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      details: {}
    }
  },
  created() {
    console.log(this.id)
    if (this.id) {
      this.getDetalis(this.id)
    }
  },
  methods: {
    getDetalis(id) {
      const params = {
        taskId: id
      }
      getDetail(params).then(res => {
        const { data, code } = res
        if (code === 200) {
          this.details = data.taskRecord
        }
        this.$emit('sendType', this.details.cycle, this.details.dictValueTwo)
      })
    }
  }
}
</script>


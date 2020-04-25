<template>
  <!-- 领导批示件工作签收表格 -->
  <div class="details-height">
    <div class="details-form">
      <div>
        <label>工作类别</label>
        <span>{{ detail.dictValueOneStr }}</span>
      </div>
      <div>
        <label>工作编号</label>
        <span>{{ detail.workNumber }}</span>
      </div>
    </div>
    <div class="details-form">
      <div>
        <label>批示领导</label>
        <span>{{ detail.people3 }}</span>
      </div>
    </div>
    <div class="details-form">
      <div>
        <label>工作名称</label>
        <span>{{ detail.taskName }}</span>
      </div>
    </div>
    <div class="details-form">
      <div>
        <label>工作目标内容</label>
        <span>
          <pre>{{ detail.taskContent }}</pre>
        </span>
      </div>
    </div>
    <div class="details-form">
      <div>
        <label>督办要求</label>
        <span>
          <pre>{{ detail.dbAskcontent }}</pre>
        </span>
      </div>
    </div>
    <div class="details-form">
      <div>
        <label>分管领导</label>
        <span>{{ detail.people2 }}</span>
      </div>
    </div>
    <div class="details-form">
      <div>
        <label>责任单位</label>
        <span>{{ detail.people0 }}</span>
      </div>
    </div>
    <div class="details-form">
      <div>
        <label>协办单位</label>
        <span>{{ detail.people1 }}</span>
      </div>
    </div>
    <div class="details-form">
      <div>
        <label>督办频次</label>
        <span>{{ detail.cycleStr }}</span>
      </div>
      <div>
        <label>首次反馈要求</label>
        <span>{{ detail.dbAsk }}</span>
      </div>
    </div>
    <div class="details-form">
      <div>
        <label>联合督办</label>
        <span>{{ detail.people7 }}</span>
      </div>
    </div>
    <div class="details-form">
      <div>
        <label>交办时间</label>
        <span>{{ detail.handTime }}</span>
      </div>
      <div>
        <label>办结时限</label>
        <span>{{ detail.endTime }}</span>
      </div>
    </div>
    <div class="details-form">
      <div>
        <label>交办部门</label>
        <span>{{ detail.deptName }}</span>
      </div>
      <div>
        <label>交办人</label>
        <span>{{ detail.userName }}</span>
      </div>
    </div>
    <div class="details-form">
      <div>
        <label>工作联系人</label>
        <span>{{ detail.workPeople }}</span>
      </div>
      <div>
        <label>联系电话</label>
        <span>{{ detail.workPeopleNumber }}</span>
      </div>
    </div>
  </div>
</template>

<script>
// api方法
import { getDetail } from '@/views/business/api/WorkSignOn'
export default {
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      detail: {}
    }
  },
  created() {
    if (this.id) {
      this.getTable(this.id)
    }
  },
  methods: {
    getTable(id) {
      const params = {
        taskId: id
      }
      getDetail(params).then(res => {
        const { data, code } = res
        if (code === 200) {
          this.detail = data.taskRecord
        }
      })
    }
  }
}
</script>

<style scoped>
</style>

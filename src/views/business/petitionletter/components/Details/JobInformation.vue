<template>
  <div>
    <div class="details-height">
      <div class="details-form">
        <div>
          <label>工作类别</label>
          <span>{{ details.dictValueOneStr }}</span>
        </div>
        <div>
          <label>工作编号</label>
          <span>{{ details.workNumber }}</span>
        </div>
      </div>
      <div class="details-form">
        <div>
          <label>批示领导</label>
          <span>{{ details.people3 }}</span>
        </div>
      </div>
      <div class="details-form">
        <div>
          <label>工作名称</label>
          <span>{{ details.taskName }}</span>
        </div>
      </div>
      <div class="details-form">
        <div>
          <label>工作目标内容</label>
          <span><pre>{{ details.taskContent }}</pre></span>
        </div>
      </div>
      <div class="details-form">
        <div>
          <label>督办要求</label>
          <span><pre>{{ details.dbAskcontent }}</pre></span>
        </div>
      </div>
      <div class="details-form">
        <div>
          <label>分管领导</label>
          <span>{{ details.people2 }}</span>
        </div>
      </div>
      <div class="details-form">
        <div>
          <label>责任单位</label>
          <span>{{ details.people0 }}</span>
        </div>
      </div>
      <div class="details-form">
        <div>
          <label>协办单位</label>
          <span>{{ details.people1 }}</span>
        </div>
      </div>
      <div class="details-form">
        <div>
          <label>督办频次</label>
          <span>{{ details.cycleStr }}</span>
        </div>
        <div>
          <label>首次反馈要求</label>
          <span>{{ details.dbAsk }}</span>
        </div>
      </div>
      <div class="details-form">
        <div>
          <label>联合督办</label>
          <span>{{ details.people7 }}</span>
        </div>
      </div>
      <div class="details-form">
        <div>
          <label>交办时间</label>
          <span>{{ details.handTime }}</span>
        </div>
        <div>
          <label>办结时限</label>
          <span>{{ details.endTime }}</span>
        </div>
      </div>
      <div class="details-form">
        <div>
          <label>交办部门</label>
          <span>{{ details.deptName }}</span>
        </div>
        <div>
          <label>交办人</label>
          <span>{{ details.userName }}</span>
        </div>
      </div>
      <div class="details-form">
        <div>
          <label>工作联系人</label>
          <span>{{ details.workPeople }}</span>
        </div>
        <div>
          <label>联系电话</label>
          <span>{{ details.workPeopleNumber }}</span>
        </div>
      </div>
      <div class="details-form">
        <div>
          <label>提醒给</label>
          <span>{{ details.pushUserTypeStr }}</span>
        </div>
      </div>
      <div class="details-form">
        <div>
          <label>提醒方式</label>
          <span>{{ details.pushTypeStr }}</span>
        </div>
      </div>
    </div>
    <FilePreview :operation-id="taskid" operation-code="taskRecord" />
  </div>
</template>

<script>
import { gettaskRecordDetail } from '../../../api/JobAssignment'
export default {
  name: 'JobInformation',
  props: {
    taskid: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      details: {}
    }
  },
  mounted() {
    this.getDetails()
  },
  methods: {
    getDetails() {
      const params = {
        taskId: this.taskid
      }
      gettaskRecordDetail(params).then(res => {
        if (res.code === 200) {
          this.details = res.data.taskRecord
        }
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>

</style>

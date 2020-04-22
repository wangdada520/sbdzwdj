<template>
  <div>
    <div class="details_title">
      <h1>{{ details.taskName }}</h1>
    </div>
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
          <label>责任单位</label>
          <span>{{ details.people0 }}</span>
        </div>
        <div>
          <label>办结时限</label>
          <span>{{ details.endTime }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { gettaskRecordDetail } from '@/views/business/api/JobAssignment'
export default {
  name: 'TaskDetails',
  props: {
    taskid: {
      type: [String, Number],
      details: ''
    }
  },
  data() {
    return {
      details: {} // 任务详情
    }
  },
  mounted() {
    this.getDetail(this.taskid)
  },
  methods: {
    /**
     * 获取任务详情
     * */
    getDetail(id) {
      const params = {
        taskId: id
      }
      gettaskRecordDetail(params).then((res) => {
        if (res.code === 200) {
          this.details = res.data.taskRecord
        }
      }).catch(() => {
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .details_title {
    height: 32px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f5f5f5;
    margin-bottom: 6px;
    h1,
    p {
      margin: 0;
      color: #343434;
      font-size: 14px;
    }
    h1 {
      font-weight: bold;
      text-decoration: underline;
      color: #409EFF;
      cursor: pointer;
    }
  }
</style>

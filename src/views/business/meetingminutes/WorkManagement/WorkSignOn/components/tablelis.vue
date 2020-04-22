<template>
  <div class="details-height">
    <div class="details-form">
      <div>
        <label>会议大类</label>
        <span>{{ detail.dictValueTwoStr }}</span>
      </div>
      <div>
        <label>会议小类</label>
        <span>{{ detail.dictValueThreeStr }}</span>
      </div>
    </div>
    <div class="details-form">
      <div>
        <label>会议名称</label>
        <span>{{ detail.reportAsk }}</span>
      </div>
    </div>
    <div class="details-form">
      <div>
        <label>会议召开人</label>
        <span>{{ detail.beginUser }}</span>
      </div>
      <div>
        <label>会议召开日期</label>
        <span>{{ detail.beginTime }}</span>
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
        <span>{{ detail.taskContent }}</span>
      </div>
    </div>
    <div class="details-form">
      <div>
        <label>督办要求</label>
        <span>{{ detail.dbAskcontent }}</span>
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
        <label>联合督办</label>
        <span>{{ detail.people7 }}</span>
      </div>
      <div>
        <label />
        <span />
      </div>
    </div>
    <div class="details-form">
      <div>
        <label>交办日期</label>
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
        <label>提醒给</label>
        <span>
          <el-checkbox-group v-model="pushUserType">
            <el-checkbox label="0">责任单位</el-checkbox>
            <el-checkbox label="2">分管领导</el-checkbox>
          </el-checkbox-group>
        </span>
      </div>
    </div>
    <div class="details-form">
      <div>
        <label>提醒方式</label>
        <span>
          <el-checkbox-group v-model="pushType">
            <el-checkbox label="0">站内信</el-checkbox>
            <el-checkbox label="1">手机短信</el-checkbox>
          </el-checkbox-group>
        </span>
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
      detail: {},
      pushUserType: [],
      pushType: []
    }
  },
  watch: {
    pushUserType(val) {
      if (val.length !== 0) {
        this.sendpushUserType(val)
      } else {
        this.sendpushUserType(val, true)
      }
    },
    pushType(val) {
      if (val.length !== 0) {
        this.sendpushType(val)
      } else {
        this.sendpushType(val, true)
      }
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
    },
    sendpushUserType(val, type) {
      this.$emit('sendUserType', val)
      // if (type) console.log(1111)
    },
    sendpushType(val, type) {
      this.$emit('sendType', val)
      // if (type) console.log(1111)
    }
  }
}
</script>

<style scoped>
</style>

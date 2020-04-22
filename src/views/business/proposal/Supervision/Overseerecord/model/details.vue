<template>
  <div>
    <el-dialog
      :visible.sync="centerDialogVisible"
      append-to-body
      :close-on-click-modal="false"
      title="详情"
      @closed="closed"
    >
      <TaskDetails :taskid="form.srTaskId" />
      <div class="details-height">
        <div class="details-form">
          <div>
            <label>催办内容</label>
            <span>{{ detail.srContext }}</span>
          </div>
        </div>
        <div class="details-form">
          <div>
            <label>督办方式</label>
            <span>{{ detail.srModeIdStr }}</span>
          </div>
        </div>
        <div class="details-form">
          <div>
            <label>提醒给</label>
            <span>{{ detail.year }}</span>
          </div>
          <div>
            <label>提醒方式</label>
            <span>{{ detail.dictValueStr }}</span>
          </div>
        </div>
        <div class="details-form">
          <div>
            <label>催办人</label>
            <span>{{ detail.srUserName }}</span>
          </div>
          <div>
            <label>催办时间</label>
            <span>{{ detail.createTime }}</span>
          </div>
        </div>
      </div>
      <FilePreview operation-code="supervision" :operation-id="form.srId" />
    </el-dialog>
  </div>
</template>
<script>
import { getsupervisionRecord } from '@/views/business/api/Cuibanoverseeing'
import TaskDetails from '@/views/business/Instructions/components/TaskDetails'
export default {
  name: 'Details',
  components: {
    TaskDetails
  },
  props: {
    form: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      centerDialogVisible: false,
      detail: {}
    }
  },
  mounted() {
    this.getdetails(this.form.srId)
  },
  methods: {
    /**
     * 获取详情
     * */
    getdetails(id) {
      const params = {
        srId: id
      }
      getsupervisionRecord(id, params).then(res => {
        if (res.code === 200) {
          this.detail = res.data
        }
      }).catch(() => {})
    },
    /**
     * 关闭动画结束后触发
     * */
    closed() {
      this.$emit('closed')
    }
  }
}
</script>
<style lang="scss" scoped>
</style>

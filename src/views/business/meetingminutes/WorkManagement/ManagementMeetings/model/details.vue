<template>
  <div>
    <el-dialog
      :visible.sync="centerDialogVisible"
      append-to-body
      :close-on-click-modal="false"
      title="详情"
      @closed="closed"
    >
      <div class="details-height">
        <div class="details-form">
          <div>
            <label>会议大类</label>
            <span>{{ details.dictValueOneStr }}</span>
          </div>
          <div>
            <label>会议小类</label>
            <span>{{ details.dictValueTwoStr }}</span>
          </div>
        </div>
        <div class="details-form">
          <div>
            <label>会议名称</label>
            <span>{{ details.meetName }}</span>
          </div>
        </div>
        <div class="details-form">
          <div>
            <label>会议召开人</label>
            <span>{{ setselection01 }}</span>
          </div>
        </div>
        <div class="details-form">
          <div>
            <label>会议召开日期</label>
            <span>{{ details.beginTime }}</span>
          </div>
          <div>
            <label>发文字号</label>
            <span>{{ details.meetNumber }}</span>
          </div>
        </div>
        <div class="details-form">
          <div>
            <label>备注说明</label>
            <span>{{ details.meetRemark }}</span>
          </div>
        </div>
      </div>
      <FilePreview :operation-id="form.meetId" operation-code="meeting" />
    </el-dialog>
  </div>
</template>

<script>
import { gettaskMeeting, gettaskRelationshipPeoplelist } from '@/views/business/api/ManagementMeetings'
export default {
  name: 'Details',
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
      activeName: 'first',
      details: {},
      setselection01: ''
    }
  },
  mounted() {
    this.getDetail(this.form.meetId)
    this.gettaskRelationshipPeoplelist(this.form.meetId)
  },
  methods: {
    /**
     * 获取详情
     * */
    getDetail(id) {
      const params = {
        meetId: id
      }
      gettaskMeeting(id, params).then((res) => {
        if (res.code === 200) {
          this.details = res.data
        }
      }).catch(() => {
      })
    },
    /**
     * 获取任务相关人列表
     * */
    gettaskRelationshipPeoplelist(id) {
      const params = {
        pageNum: 1,
        pageSize: 100,
        search: {
          taskId: id
        }
      }
      gettaskRelationshipPeoplelist(params).then((res) => {
        if (res.code === 200) {
          this['setselection01'] = res.data.map(item => item.rpUserName).join(',')
        }
      }).catch(() => {
      })
    },
    // 关闭动画结束后触发
    closed() {
      this.$emit('closed')
    }
  }
}
</script>

<style scoped>

</style>

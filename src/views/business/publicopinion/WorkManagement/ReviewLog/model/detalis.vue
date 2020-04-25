<template>
  <!-- 信访管理-回访记录-详情页 -->
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      append-to-body
      :close-on-click-modal="false"
      @closed="closed"
    >
      <div @click="cx">
        <DetaTab :title="form.taskName" />
      </div>
      <!-- 进度条 -->
      <div class="progress">
        <el-progress :percentage="percent" />
      </div>
      <TableHeader :id="taskId" />
      <!-- 汇报记录 -->
      <ReportTable
        :id="form.reportId"
        :operation-code="operationCode"
        :operation-id="form.reportId"
        @percent="setPercent"
      />
      <!-- 审核记录 -->
      <template v-if="isShowAut">
        <DetaTab title="审核记录" />
        <div class="details-height">
          <div class="details-form">
            <div>
              <label>审核部门</label>
              <span>{{ audit.deptName }}</span>
            </div>
            <div>
              <label>审核人</label>
              <span>{{ audit.userName }}</span>
            </div>
          </div>
          <div class="details-form">
            <div>
              <label>审核状态</label>
              <span>{{ audit.statusStr }}</span>
            </div>
            <div>
              <label>审核时间</label>
              <span>{{ audit.checkTime }}</span>
            </div>
          </div>
          <div class="details-form">
            <div>
              <label>审核意见</label>
              <span>{{ audit.content }}</span>
            </div>
          </div>
        </div>
      </template>

      <!-- 回访信息 -->
      <DetaTab title="回访信息" />
      <div class="details-height">
        <div class="details-form">
          <div>
            <label>回访日期</label>
            <span>{{ details.vlmVisitTime }}</span>
          </div>
          <div>
            <label>回访人</label>
            <span>{{ details.vlmVisitor }}</span>
          </div>
        </div>
        <div class="details-form">
          <div>
            <label>回访方式</label>
            <span>{{ details.vlmVisitTypeStr }}</span>
          </div>
          <div>
            <label>满意度</label>
            <span>{{ details.vlmSatisfactionDegreeStr }}</span>
          </div>
        </div>
        <div class="details-form">
          <div>
            <label>情况说明</label>
            <span>{{ details.vlmSituationDescription }}</span>
          </div>
        </div>
        <div class="details-form">
          <div>
            <label>操作人</label>
            <span>{{ details.vlmVisitor }}</span>
          </div>
          <div>
            <label>操作人所在部门</label>
            <span>{{ details.vlmDeptName }}</span>
          </div>
        </div>
        <div class="details-form">
          <div>
            <label>操作时间</label>
            <span>{{ details.createTime }}</span>
          </div>
          <div>
            <label />
            <span />
          </div>
        </div>
      </div>
      <template v-if="isShow">
        <DetaTab title="不满意后续跟踪情况" />
        <el-input
          v-model="details.vlmSituationDescription"
          type="textarea"
          placeholder="限300字"
          maxlength="300"
          show-word-limit
          resize="none"
          :autosize="{ minRows: 4}"
        />
        <div class="btn">
          <el-button type="primary" @click="Submit">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import TableHeader from '@/views/business/petitionletter/components/TableHeader'
import ReportTable from '@/views/business/petitionletter/components/ReportTable'
import { getTaskCheck } from '@/views/business/api/ReportAudit'
import { getManageRecord, addVisitMan } from '@/views/business/api/ReviewLog'
export default {
  components: {
    TableHeader,
    ReportTable
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    form: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      percent: 0,
      operationCode: 'taskReport', // 附件编码
      details: {},
      isShow: true,
      taskId: this.form.vlmTaskId,
      isShowAut: false,
      audit: {}
    }
  },
  created() {
    if (this.form.vlmReportId !== '') {
      this.isShowAut = true
      this.getCheckDetalis()
    }
    // this.form.isvlmSatisfactionDegree === true
    //   ? (this.isShow = true)
    //   : (this.isShow = false)
    this.getDetalis()
  },
  methods: {
    async getCheckDetalis() {
      const { data, code } = await getTaskCheck(this.form.vlmReportId)
      if (code === 200) {
        this.audit = data
      }
    },
    // 获取审批记录表格的数据
    getDetalis() {
      getManageRecord(this.form.vlmId).then(res => {
        const { data, code } = res
        if (code === 200) {
          this.details = data
        }
      })
    },
    async Submit() {
      const { code } = await addVisitMan(this.details)
      if (code === 200) {
        console.log('添加成功')
      }
    },
    // 设置进度条
    setPercent(val) {
      this.percent = Number(val)
    },
    // 关闭模态框
    closed() {
      this.$emit('closed')
    },
    cx() {
      console.log(1111)
    }
  }
}
</script>

<style scoped>
.progress {
  padding: 10px 0;
}
.btn {
  display: flex;
  justify-content: center;
  align-content: center;
  padding: 10px;
}
</style>

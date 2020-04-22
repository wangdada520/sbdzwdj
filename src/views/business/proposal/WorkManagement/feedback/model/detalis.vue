<template>
  <!-- 代表反馈详情页 -->
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      append-to-body
      :close-on-click-modal="false"
      @closed="closed"
    >
      <div @click="log1">
        <DetaTab :title="form.taskName" />
      </div>
      <!-- 进度条 -->
      <!-- <div class="progress">
        <el-progress :percentage="percent" />
      </div>-->
      <TableHeader :id="form.taskId" />
      <!-- 汇报记录 -->
      <!-- <ReportTable
        :id="form.reportId"
        :operation-code="operationCode"
        :operation-id="form.rfId"
        @percent="setPercent"
      /> -->
      <!-- 代表反馈信息 -->
      <DetaTab title="代表反馈信息" />
      <el-form ref="feedBackformRef" :model="feedBackform" label-width="110px" :rules="rules">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="意见类型" prop="rfTypeId">
              <el-select
                v-model="feedBackform.rfTypeId"
                style="width: 100%"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="24">
            <el-form-item label="建议意见" prop="rfContext">
              <el-input
                v-model="feedBackform.rfContext"
                type="textarea"
                placeholder="限300字"
                maxlength="300"
                show-word-limit
                resize="none"
                :autosize="{ minRows: 4}"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <DialogFooter slot="footer" @handleOk="handleOk" @handleNo="handleNo" />
    </el-dialog>
  </div>
</template>

<script>
import TableHeader from '@/views/business/proposal/components/TableHeader'
import ReportTable from '@/views/business/proposal/components/ReportTable'
import { getFeedback, addworkFeedback } from '@/views/business/api/feedback'
import { getFormatDate } from '@/utils/index'
export default {
  components: {
    TableHeader
    // ReportTable
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
      feedBackform: {},
      rules: {
        rfTypeId: [
          { required: true, message: '请选择意见', trigger: 'change' }
        ],
        rfContext: [
          { required: true, message: '请输入建议意见', trigger: 'blur' }
        ]
      },
      options1: [
        { label: '不满意', value: 0 },
        { label: '满意', value: 1 }
      ]
    }
  },
  created() {
    this.feedBackform.wfTaskId = this.form.taskId
    this.feedBackform.wfTalkTime = getFormatDate()
    if (this.form.rfId) {
      this.getFeedbackDetalis(this.form.rfId)
    }
  },
  methods: {
    // 获取详情
    async getFeedbackDetalis(id) {
      const { data, code } = await getFeedback(id)
      if (code === 200) {
        console.log(data)
      }
    },
    handleOk() {
      this.$refs.feedBackformRef.validate(valid => {
        if (valid) {
          addworkFeedback(this.feedBackform).then(res => {
            this.dialogVisible = false
            const { code } = res
            if (code === 200) {
              this.$parent.getList()
              this.$notify({
                title: '成功',
                message: '填写成功',
                type: 'success'
              })
            }
          })
        } else {
          this.$message({ message: '请完善数据' })
        }
      })
    },
    handleNo() {
      this.dialogVisible = false
    },
    getTimeValue(val) {
      this.$set(this.feedBackform, 'rfBackTime', val)
    },
    log1() {},
    // 设置进度条
    setPercent(val) {
      this.percent = Number(val)
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    // 关闭模态框
    closed() {
      this.$emit('closed')
    }
  }
}
</script>

<style scoped>
.btn_content {
  position: relative;
}
.btn {
  position: absolute;
  left: 20px;
}
.progress {
  padding: 10px 0;
}
</style>

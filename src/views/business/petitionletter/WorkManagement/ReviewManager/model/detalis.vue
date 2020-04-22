<template>
  <!-- 信访办理-回访管理-详情页 -->
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
      <TableHeader :id="form.taskId" />
      <!-- 汇报记录 -->
      <ReportTable
        :id="form.reportId"
        :operation-code="operationCode"
        :operation-id="form.reportId"
        @percent="setPercent"
      >
        <AuditTable :id="form.reportId" id-name="reportId" />
      </ReportTable>
      <DetaTab title="回访信息" />
      <el-form ref="reviewform" :model="reviewform" label-width="110px" :rules="rules">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="回访日期" prop="vlmVisitTime">
              <Times :model-value="reviewform.vlmVisitTime" @getTimeValue="getTimeValue" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="回访人" prop="vlmVisitor">
              <el-input v-model="reviewform.vlmVisitor" placeholder="请输入回访人" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="回访方式" prop="vlmVisitType">
              <el-select v-model="reviewform.vlmVisitType" placeholder="请选择">
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="满意度" prop="vlmSatisfactionDegree">
              <el-select v-model="reviewform.vlmSatisfactionDegree" placeholder="请选择">
                <el-option
                  v-for="item in options2"
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
            <el-form-item label="情况说明">
              <el-input
                v-model="reviewform.vlmSituationDescription"
                type="textarea"
                placeholder="限300字"
                maxlength="300"
                show-word-limit
                resize="none"
                :autosize="{ minRows: 2}"
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
import TableHeader from '@/views/business/petitionletter/components/TableHeader'
import ReportTable from '@/views/business/petitionletter/components/ReportTable'
import AuditTable from '@/views/business/components/Audit/AuditTable'
import { getByDictCode } from '@/api/Common'
import { addVisitMan } from '@/views/business/api/ReviewManager'
export default {
  components: {
    TableHeader,
    ReportTable,
    AuditTable
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
      reviewform: {},
      rules: {
        vlmVisitTime: [
          { required: true, message: '请选择回访日期', trigger: 'change' }
        ],
        vlmVisitor: [
          { required: true, message: '请输入回访人', trigger: 'blur' }
        ],
        vlmVisitType: [
          { required: true, message: '请选择回访方式', trigger: 'change' }
        ],
        vlmSatisfactionDegree: [
          { required: true, message: '请选择满意度', trigger: 'change' }
        ]
      },
      options1: [],
      options2: []
    }
  },
  created() {
    this.reviewform.vlmTaskId = this.form.taskId
    this.reviewform.vlmDeptName = this.form.deptName
    this.reviewform.vlmType = 3
    this.getByDictCode('visitType', 'options1')
    this.getByDictCode('satisfactionDegree', 'options2')
  },
  mounted() {
    console.log(this.form)

    // this.reviewform.vlmDeptName = this.form.vlmDeptName
  },
  methods: {
    // 获取字典
    getByDictCode(code, obj) {
      const params = {
        dictcode: code
      }
      getByDictCode(params).then(res => {
        if (res.code === 200 && res.data) {
          res.data.map(item => {
            this[obj].push({
              value: item.value,
              label: item.description
            })
          })
        }
      })
    },
    handleOk() {
      this.$refs.reviewform.validate(valid => {
        if (valid) {
          addVisitMan(this.reviewform).then(res => {
            const { code } = res
            if (code === 200) {
              this.dialogVisible = false
              this.$parent.getList()
              this.$notify({
                title: '成功',
                message: '添加回访成功',
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
    // 设置进度条
    setPercent(val) {
      this.percent = Number(val)
    },
    getTimeValue(val) {
      this.$set(this.reviewform, 'vlmVisitTime', val)
    },
    cx() {},
    // 关闭模态框
    closed() {
      this.$emit('closed')
    }
  }
}
</script>


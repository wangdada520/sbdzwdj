<template>
  <div>
    <!-- 表单 -->
    <el-form ref="form" :model="form" label-width="110px" :rules="rules">
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="11">
          <el-form-item label="汇报单位">
            <el-input v-model="form.deptName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="汇报时限">
            <Times :model-value="form.reportEndTime" :disabled="true" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="11">
          <el-form-item label="汇报人">
            <el-input v-model="form.userName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="联系电话">
            <el-input v-model="form.phone" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="11">
          <el-form-item label="复函文号" prop="fileNum">
            <el-input v-model="form.fileNum" />
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="类别标记" prop="classSign">
            <el-select v-model="form.classSign" placeholder="请选择">
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
        <el-col :span="11">
          <!-- fileDate: [
          { required: true, message: '请选择复函日期', trigger: 'blur' }
          ],-->
          <!-- required
            :rules="{
              required: true, message: '请选择复函日期', trigger: 'blur'
          }"-->
          <el-form-item label="复函日期" prop="fileDate">
            <Times :model-value="form.fileDate" @getTimeValue="getTimeValue" />
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="签发人">
            <el-input v-model="form.acceptUserName" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="11">
          <el-form-item label="督办频次">
            <el-input v-model="form.cycleStr" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="预警状态">
            <el-input v-model="form.beyondTypeStr" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="11">
          <el-form-item label="进展认定" prop="progress">
            <el-select v-model="form.progress" placeholder="请选择">
              <el-option
                v-for="item in options2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="完成度" prop="percent">
            <el-input v-model="form.percent">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!--  -->
      <el-row>
        <el-col :span="24">
          <el-form-item label="简要说明" prop="content">
            <el-input
              v-model="form.content"
              type="textarea"
              placeholder="限300字"
              maxlength="300"
              show-word-limit
              resize="none"
              :autosize="{ minRows: 6}"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="附件" label-width="110px">
            <Upload
              :multiple="true"
              operation-code="taskReport"
              :operation-id="formdetali.taskId"
              @getfjlist="getfjlist"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="追加审批人" label-width="110px">
            <ChoiceUser @returnData="returnData" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getTaskReportById } from '@/views/business/api/WorkReport'
import { byDictName } from '@/api/SysDictionaries'
import ChoiceUser from '@/components/ChoiceUser'
import Upload from '@/components/Upload/SingleImage'
export default {
  components: {
    ChoiceUser
  },
  props: {
    formdetali: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      form: {},
      oldform: {},
      options1: [], // 类别标记
      options2: [], // 进展认定
      showUser: false,
      rules: {
        fileNum: [
          { required: true, message: '请输入复函文号', trigger: 'blur' }
        ],
        classSign: [
          { required: true, message: '请选择类别标记', trigger: 'change' }
        ],
        fileDate: [
          { required: true, message: '请选择复函日期', trigger: 'blur' }
        ],
        progress: [
          { required: true, message: '请选择进展认定', trigger: 'change' }
        ],
        percent: [
          { required: true, message: '请输入完成进度', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入简要说明', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    if (this.formdetali.reportId) {
      this.getform(this.formdetali.reportId)
    }
    // 获取字典
    this.getcode('classSign', 'options1')
    this.getcode('progress', 'options2')
    // 获取原因分析字典
    this.getReasonCode()
  },
  methods: {
    // 获取表单数据
    getform(id) {
      getTaskReportById(id).then(res => {
        const { data, code } = res
        this.oldform = data
        if (code === 200) {
          this.form = data
          delete this.form.classSign
          delete this.form.progress
          // delete this.form.fileDate
        }
      })
    },
    // 获取字典
    getcode(code, arr) {
      const params = {
        dictcode: code
      }
      byDictName(params).then(res => {
        const { data, code } = res
        if (code === 200) {
          data.forEach(item => {
            this[arr].push({
              label: item.description,
              value: item.value
            })
          })
        }
      })
    },
    // 获取汇报时限
    getreportEndTime(val) {
      this.form.reportEndTime = val
    },
    // 获取完成时限
    getTimeValue(val) {
      this.$set(this.form, 'fileDate', val)
    },
    getfjlist(val) {
      this.form.fileIds = val
    },
    returnData(val) {
      this.form.userIds = []
      val.forEach(item => {
        this.form.userIds.push(item.userId)
      })
      this.form.userIds = this.form.userIds.join()
    },
    // 校验数据
    validateForm() {
      let flag = null
      this.$refs['form'].validate(valid => {
        if (valid) {
          flag = true
        } else {
          flag = false
        }
      })
      return flag
    }
    // // 重置表单
    // resetForm() {
    //   this.$refs['form'].resetFields()
    // }
  }
}
</script>
<style scoped>
.atricle {
  text-align: center;
  padding: 5px;
  color: #f56c6c;
}
</style>

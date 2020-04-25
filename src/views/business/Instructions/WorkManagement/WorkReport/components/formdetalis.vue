<template>
  <div>
    <!-- 领导批示件工作汇报表单 -->
    <el-form ref="form" :model="form" label-width="110px" :rules="rules">
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="11">
          <el-form-item label="汇报单位">
            <el-input v-model="form.deptName" />
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="汇报时限">
            <Times :model-value="form.reportEndTime" @getTimeValue="getreportEndTime" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="11">
          <el-form-item label="汇报人">
            <el-input v-model="form.userName" />
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="联系电话">
            <el-input v-model="form.phone" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="11">
          <el-form-item label="进展认定" prop="progress">
            <el-select v-model="form.progress" placeholder="请选择" @change="progressChange">
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
          <el-form-item label="预警状态">
            <el-input v-model="form.beyondTypeStr" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="11">
          <template v-if="showTime">
            <el-form-item label="完成时限" prop="endTime">
              <Times :model-value="form.endTime" @getTimeValue="getendTime" />
            </el-form-item>
          </template>
        </el-col>
        <el-col :span="11">
          <el-form-item label="完成进度" prop="percent">
            <el-input v-model="form.percent">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <p class="atricle">温馨提示：（完成时限仅在第一次上报且不是办结的时候填写，若第一次就办结了则不用修改）</p>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="推进情况" prop="content">
            <el-input
              v-model="form.content"
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
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="24">
          <el-form-item label="存在的问题">
            <el-input
              v-model="form.problem"
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
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="24">
          <el-form-item label="下步计划">
            <el-input
              v-model="form.plan"
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
      options1: [],
      showUser: false,
      showTime: true,
      rules: {
        progress: [
          { required: true, message: '请选择进展认定', trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '请选择完成时限', trigger: 'change' }
        ],
        percent: [
          { required: true, message: '请选择完成进度', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请选择推进情况', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    if (this.formdetali.reportId) {
      this.getform(this.formdetali.reportId)
    }
    // 获取字典
    this.getcode()
  },
  methods: {
    // 获取表单数据
    getform(id) {
      getTaskReportById(id).then(res => {
        const { data, code } = res
        this.oldform = data
        if (code === 200) {
          this.form = data
          delete this.form.progress
        }
      })
    },
    // 获取字典
    getcode() {
      const params = {
        dictcode: 'progress'
      }
      byDictName(params).then(res => {
        const { data, code } = res
        if (code === 200) {
          this.options1 = data.map(item => {
            const obj = {
              label: item.description,
              value: item.value
            }
            return obj
          })
        }
      })
    },
    // 获取汇报时限
    getreportEndTime(val) {
      this.form.reportEndTime = val
    },
    // 获取完成时限
    getendTime(val) {
      this.form.endTime = val
    },
    getfjlist(val) {
      this.form.fileIds = val
    },
    returnData(val) {
      this.form.userIds = []
      val.forEach(item => {
        this.form.userIds.push(item.userId)
      })
      this.form.userIds = this.form.userIds.join(',')
    },
    progressChange(val) {
      if (val === '3') {
        console.log(111)
        this.showTime = false
      } else {
        this.showTime = true
      }
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

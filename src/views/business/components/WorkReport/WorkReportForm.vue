<template>
  <div>
    <!-- 汇报审核页面 -->
    <!-- <FilePreview :operation-code="operationCode" :operation-id="operationId" /> -->
    <DetaTab title="审批记录" />
    <div class="details-height">
      <div class="details-form">
        <div>
          <label>审核部门</label>
          <span>{{ details.deptName }}</span>
        </div>
        <div>
          <label>审核人</label>
          <span>{{ details.userName }}</span>
        </div>
      </div>
      <div class="details-form">
        <div>
          <label>审核状态</label>
          <span>{{ details.statusStr }}</span>
        </div>
        <div>
          <label>审核时间</label>
          <span>{{ details.checkTime }}</span>
        </div>
      </div>
      <div class="details-form">
        <div>
          <label>审核意见</label>
          <span>{{ details.content }}</span>
        </div>
        <div>
          <label />
          <span />
        </div>
      </div>
    </div>
    <DetaTab title="审批操作" />
    <el-form ref="form" :model="form" label-width="110px" :rules="rules">
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="11">
          <el-form-item label="审核意见" prop="status">
            <el-select v-model="form.status" placeholder="请选择">
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
          <el-form-item label="进展认定" prop="newProgress">
            <el-select v-model="form.newProgress" placeholder="请选择">
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
          <el-form-item label="意见内容">
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
    </el-form>
    <!-- <div>
          <el-checkbox v-show="ischecked" v-model="checked">默认生成督查报告</el-checkbox>
          <el-button type="primary" @click="dialogVisible = false">确定</el-button>
    </div>-->
    <!-- </div> -->
  </div>
</template>

<script>
import { byDictName } from '@/api/SysDictionaries'
import { getTaskCheck } from '@/views/business/api/ReportAudit'
export default {
  props: {
    id: {
      type: String,
      required: true,
      default: ''
    }
    // operationCode: {
    //   type: String,
    //   required: true,
    //   default: ''
    // },
    // operationId: {
    //   type: String,
    //   required: true,
    //   default: ''
    // }
  },
  data() {
    return {
      details: {},
      form: {},
      options1: [
        { label: '审核通过', value: '1' },
        { label: '审核退回', value: '2' }
      ],
      options2: [],
      // 表单校验
      rules: {
        status: [
          { required: true, message: '请选择审核意见', trigger: 'change' }
        ],
        newProgress: [
          { required: true, message: '请选择进展认定', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    // 获取审批记录表格的数据
    getTaskCheck(this.id).then(res => {
      const { data, code } = res
      if (code === 200) {
        this.details = data
      }
    })
    this.getcode()
  },
  methods: {
    // 获取字典
    getcode() {
      const params = {
        dictcode: 'progress'
      }
      byDictName(params).then(res => {
        const { data, code } = res
        if (code === 200) {
          this.options2 = data.map(item => {
            const obj = {
              label: item.description,
              value: item.value
            }
            return obj
          })
        }
      })
    },
    // 校验表单
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
  }
}
</script>

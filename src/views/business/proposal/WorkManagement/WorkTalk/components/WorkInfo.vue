<template>
  <div>
    <div @click="log1">
      <DetaTab :title="form.taskName" />
      <el-form ref="workformRef" :model="workform" label-width="110px" :rules="rules">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="沟通日期" prop="wfTalkTime">
              <Times :model-value="workform.wfTalkTime" @getTimeValue="getTimeValue" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="沟通方式" prop="wfTalkTypeId">
              <el-select
                v-model="workform.wfTalkTypeId"
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
        <el-row>
          <el-col :span="24">
            <el-form-item label="沟通情况说明" prop="wfContext">
              <el-input
                v-model="workform.wfContext"
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
                operation-code="communicationFeedback"
                :operation-id="form.wfId"
                @getfjlist="getfjlist"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getByDictCode } from '@/api/Common'
export default {
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
      workform: {},
      options1: [], // 沟通方式
      rules: {
        wfTalkTime: [{ required: true, message: '请选择时间', trigger: 'change' }],
        wfTalkTypeId: [{ required: true, message: '请选择沟通方式', trigger: 'change' }],
        wfContext: [{ required: true, message: '请输入沟通情况说明', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getCode('wfTalkTypeId', 'options1')
  },
  methods: {
    log1() {},
    getCode(code, obj) {
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
    getTimeValue(val) {
      this.$set(this.workform, 'wfTalkTime', val)
    },
    getfjlist(val) {
      this.workform.accessories = val
    }
  }
}
</script>

<template>
  <div>
    <el-dialog
      :visible.sync="centerDialogVisible"
      append-to-body
      :close-on-click-modal="false"
      :title="title"
      @closed="closed"
    >
      <el-form
        ref="form"
        v-loading="loading"
        :rules="rules"
        :model="editform"
        label-width="110px"
        label-position="left"
      >
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="24">
            <el-form-item label="工作名称">
              <CheckTaskName
                ref="CheckTaskName"
                :placeholder="workName"
                @closeCheck="closeCheck"
                @sendRow="sendRow"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="24">
            <el-form-item label="责任单位">
              <ChoiceDepartment :setselection="setselection" @returnData="returnData" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="考核理由">
              <el-select
                v-model="assessType"
                placeholder="请选择考核理由"
                clearable
                @change="selectAssess"
              >
                <el-option
                  v-for="item in options"
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
            <el-form-item label="分值">
              <el-input v-model="score" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label-width="0">
              <span>（温馨提示：正数为加分，负数为减分）</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="24">
            <el-form-item label="考核说明">
              <el-input
                v-model="editform.assessOption"
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
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="24">
            <el-form-item label="附件">
              <Upload
                :multiple="true"
                operation-code="taskRecord"
                :operation-id="editform.assessId"
                @getfjlist="getfjlist"
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
import ChoiceDepartment from '@/components/ChoiceDepartment'
import CheckTaskName from '@/views/business/components/CheckTaskName/CheckTaskName'
import {
  getAssessSetlist,
  addAssessRecord,
  getDetalis,
  modifileForm
} from '@/views/business/api/PerformanceAppraisal'
export default {
  components: {
    ChoiceDepartment,
    CheckTaskName
  },
  props: {
    id: {
      type: String,
      default: ''
    },
    form: {
      type: Object,
      default: () => {
        return {}
      }
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      centerDialogVisible: false,
      loading: false,
      editform: {},
      assessType: '',
      score: '',
      options: [],
      rules: {},
      setselection: '',
      workName: ''
    }
  },
  watch: {
    assessType(val) {
      if (val === '') {
        this.score = ''
        delete this.editform.assessType
      } else {
        this.editform.assessType = this.assessType
        this.options.forEach(item => {
          if (item.value === val) {
            this.score = item.score
          }
        })
      }
    },
    score(val) {
      if (val === '') {
        delete this.editform.score
      } else {
        this.editform.score = this.score
      }
    }
  },
  created() {
    //   获取考核理由
    this.getAssess()
  },
  mounted() {
    if (this.id) {
      this.getEdit(this.id)
    }
  },
  methods: {
    // 获取考核理由
    getAssess() {
      const params = {
        pageNum: 1,
        pageSize: 20,
        search: {}
      }
      getAssessSetlist(params).then(res => {
        const { data, code } = res
        if (code === 200) {
          this.options = data.map(item => {
            const obj = {
              label: item.assessName,
              value: item.assessType,
              score: item.score
            }
            return obj
          })
        }
      })
    },
    selectAssess(val) {
      this.options.forEach(item => {
        if (item.value === val) {
          this.editform.assessName = item.label
        }
      })
    },
    sendRow(val) {
      this.editform.taskId = val.taskId
    },
    // 获取编辑
    getEdit(id) {
      getDetalis(id).then(res => {
        const { data, code } = res
        if (code === 200) {
          console.log(data)

          this.assessType = data.assessType
          this.score = data.score
          this.editform = data
          this.workName = this.editform.taskName
          this.setselection = this.editform.deptId
        }
      })
    },
    handleOk() {
      console.log(this.title)
      switch (this.title) {
        case '新增':
          addAssessRecord(this.editform).then(res => {
            const { code } = res
            if (code === 200) {
              this.$notify({
                title: '成功',
                message: `新增成功`,
                type: 'success'
              })
              this.centerDialogVisible = false
              this.$parent.getList()
            }
          })
          break
        case '编辑':
          modifileForm(this.id, this.editform).then(res => {
            console.log(res)
            const { code } = res
            if (code === 200) {
              this.$notify({
                title: '成功',
                message: `编辑成功`,
                type: 'success'
              })
              this.centerDialogVisible = false
              this.$parent.getList()
            }
          })
          break
      }
    },
    handleNo() {
      this.centerDialogVisible = false
    },
    closeCheck() {
      this.$refs.CheckTaskName.DialogVisible = false
    },
    //   关闭
    closed() {
      // 关闭结束时,清空表单
      this.$emit('closed')
    },
    returnData(val) {
      this.form.deptId = ''
      const deptIds = []
      const deptNames = []
      val.forEach(item => {
        deptIds.push(item.departmentid)
        deptNames.push(item.deptname)
      })
      this.editform.deptId = deptIds.join(',')
      this.editform.deptName = deptNames.join(',')
    },
    getfjlist(val) {
      this.editform.fileIds = val
    }
  }
}
</script>

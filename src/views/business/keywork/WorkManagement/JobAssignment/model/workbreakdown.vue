<template>
  <div>
    <el-dialog
      :visible.sync="centerDialogVisible"
      append-to-body
      :close-on-click-modal="false"
      :title="title"
      @closed="closed"
    >
      <el-form ref="form" v-loading="loading" :rules="rules" :model="thisform" label-width="110px" label-position="left">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="24">
            <el-form-item
              label="分管领导"
              prop="type01"
              :rules="{
                required: true, message: '请选择分管领导', trigger: 'blur'
              }"
            >
              <ChoiceUser identification="type01" :setselection="setselection01" @returnData="returnData" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item
              label="选择单位"
              prop="type02"
              :rules="{
                required: true, message: '请选择单位', trigger: 'blur'
              }"
            >
              <ChoiceDepartment identification="type02" :issingle="true" :setselection="setselection02" @returnData="returnData" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="责任类型">
              <el-select
                v-model="rpUserType"
                style="width: 100%"
                placeholder="请选择"
                @change="changeSelect"
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
            <el-form-item label="序号">
              <el-input v-model="thisform.childrenTask.sortNumber" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <div class="table_tab"><span>职责及目标内容(可添加多个)</span><i class="icon_add el-icon-circle-plus" @click="addMember" /></div>
        <div v-for="(item,index) in thisform.plans" :key="item.key" class="form_list">
          <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="24">
              <el-form-item
                label="完成时限"
                :prop="'plans.' + index + '.ipDate'"
                :rules="{
                  required: true, message: '请选择完成时限', trigger: 'blur'
                }"
              >
                <Times :model-value="item.ipDate" :status="index" @getTimeValue="getTimeValue" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="24">
              <el-form-item
                label="工作目标内容"
                :prop="'plans.' + index + '.ipContent'"
                :rules="{
                  required: true, message: '请输入工作目标内容', trigger: 'blur'
                }"
              >
                <el-input
                  v-model="item.ipContent"
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
          <!--关闭按钮-->
          <div v-if="thisform.plans.length > 1" class="form_list_error" @click="errorMember(index)">
            <i class="el-icon-error" />
          </div>
        </div>
      </el-form>
      <DialogFooter slot="footer" :ischecked="false" cancelname="centerDialogVisible" @handleOk="handleOk" />
    </el-dialog>
  </div>
</template>
<script>
import ChoiceUser from '@/components/ChoiceUser'
import ChoiceDepartment from '@/components/ChoiceDepartment'

export default {
  name: 'Workbreakdown',
  components: {
    ChoiceUser,
    ChoiceDepartment
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    editIndex: {
      type: [String, Number],
      default: ''
    },
    details: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      centerDialogVisible: false,
      loading: '',
      rules: {},
      thisform: {
        childrenTask: {},
        childrenTaskPeoples: [],
        plans: [],
        type01: '',
        type02: ''
      },
      type01: [],
      type02: [],
      setselection01: '',
      setselection02: '',
      options: [{
        value: 0,
        label: '责任单位'
      }, {
        value: 1,
        label: '协办单位'
      }],
      rpUserType: 0
    }
  },
  computed: {
  },
  watch: {
    type01(obj) {
      this.thisform.type01 = obj.length > 0 || ''
    },
    type02(obj) {
      this.thisform.type02 = obj.length > 0 || ''
    },
    details() {
      this.editdetails()
    }
  },
  mounted() {
    if (this.details.childrenTask) {
      this.editdetails()
    }
  },
  methods: {
    /**
     * 编辑
     * */
    editdetails() {
      this.type01 = []
      this.type02 = []
      this.thisform.childrenTask = { ...this.details.childrenTask }
      this.thisform.childrenTaskPeoples = { ...this.details.childrenTaskPeoples }
      if (this.details.plans) {
        this.details.plans.map(item => {
          this.thisform.plans.push(item)
        })
      }
      this.details.childrenTaskPeoples.map((res, index) => {
        switch (res.type) {
          case 0:
            this.type01.push(res)
            break
          case 1:
            this.type02.push(res)
            this.rpUserType = res.rpUserType
            break
          default:
            return false
        }
        if (this.details.childrenTaskPeoples.length - 1 === index) {
          this.setselection01 = this.type01.map(item => item.rpUserId).join(',')
          this.setselection02 = this.type02.map(item => item.rpUserId).join(',')
        }
      })
    },
    /**
     * 确定
     * */
    handleOk(type) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.thisform.childrenTaskPeoples = this.type01.concat(this.type02)
          delete this.thisform.type01
          delete this.thisform.type02
          switch (this.title) {
            case '新增':
              this.$emit('returnWorkbreakdown', this.thisform, this.title)
              break
            case '编辑':
              this.$emit('returnWorkbreakdown', this.thisform, this.title, this.editIndex)
              break
            default:
              return false
          }
          this.centerDialogVisible = false
        } else {
          this.$message({ message: '请完善数据' })
          return false
        }
      })
    },
    /**
     * 返回人员
     * */
    returnData(val, stats) {
      const taskId = this.thisform.childrenTask.taskId || ''
      this[stats] = []
      switch (stats) {
        case 'type01':
          val.map(res => {
            this[stats].push({
              rpUserType: 2,
              type: 0,
              taskId: taskId,
              rpUserId: res.userId,
              rpUserName: res.trueName
            })
          })
          break
        case 'type02':
          val.map(res => {
            this[stats].push({
              rpUserType: this.rpUserType,
              type: 1,
              taskId: taskId,
              rpUserId: res.departmentid,
              rpUserName: res.deptname
            })
          })
          break
        default:
          return false
      }
    },
    /**
     * 返回时间
     * */
    getTimeValue(val, status) {
      this.$set(this.thisform.plans[status], 'ipDate', val)
    },
    /**
     * 修改单位状态
     * */
    changeSelect(val) {
      this.type02[0].rpUserType = val
    },
    /**
     * 新增工作目标
     * */
    addMember() {
      let move = this.thisform.plans
      if (move) {
        if (move.constructor === Array || move.length > 0) {
          move.push({})
        } else {
          move = [{}]
        }
      } else {
        move = [{}]
      }
    },
    /**
     * 删除工作目标
     * */
    errorMember(index) {
      this.thisform.plans.splice(index, 1)
    },
    closed() {
      // 关闭结束时,清空表单
      this.$emit('closed')
    }
  }
}
</script>
<style lang="scss" scoped>
  .table_tab {
    width: 100%;
    height: 32px;
    display: flex;
    align-items: center;
    padding: 0 10px;
    background: #f5f5f5;
    margin-bottom: 6px;

    span {
      font-size: 14px;
      color: #343434;
      font-weight: bold;
    }

    .icon_add {
      font-size: 18px;
      color: #409eff;
      margin-left: 8px;
      cursor: pointer;
    }

    .icon_add:hover {
      opacity: 0.9;
    }

    .icon_add:active {
      opacity: 0.8;
    }
  }

  .form_list {
    width: 100%;
    padding: 10px 8px 0 8px;
    background: #FAFAFA;
    margin-bottom: 10px;
    position: relative;
    .form_list_error{
      position: absolute;
      font-size: 16px;
      top: 4px;
      right: 4px;
      color: #f4727f;
      cursor: pointer;
    }
  }
</style>

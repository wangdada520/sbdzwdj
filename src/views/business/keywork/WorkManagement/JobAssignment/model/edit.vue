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
        :rules="rules"
        :model="thisform"
        label-width="110px"
        label-position="left"
      >
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item
              label="工作年度"
              required
              prop="taskRecord.dictValueTwo"
              :rules="{
                required: true, message: '请选择工作年度', trigger: 'blur'
              }"
            >
              <Times :model-value="thisform.taskRecord.dictValueTwo" time-value="yyyy" times-type="year" status="status02" @getTimeValue="getTimeValue" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="工作类别"
              required
              prop="taskRecord.dictValueOne"
              :rules="{
                required: true, message: '请选择工作类别', trigger: 'blur'
              }"
            >
              <el-select
                v-model="thisform.taskRecord.dictValueOne"
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
            <el-form-item
              label="工作名称"
              required
              prop="taskRecord.taskName"
              :rules="{
                required: true, message: '请输入工作名称', trigger: 'blur'
              }"
            >
              <el-input v-model="thisform.taskRecord.taskName" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="24">
            <el-form-item label="工作目标内容">
              <el-input
                v-model="thisform.taskRecord.taskContent"
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
            <el-form-item label="督办要求">
              <el-input
                v-model="thisform.taskRecord.dbAskcontent"
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
            <el-form-item
              label="分管领导"
              required
              prop="type02"
              :rules="{
                required: true, message: '请选择分管领导', trigger: 'blur'
              }"
            >
              <ChoiceUser identification="type02" flag="1" :setselection="setselection02" @returnData="returnData" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item
              label="汇报周期"
              required
              prop="taskRecord.cycle"
              :rules="{
                required: true, message: '请选择汇报周期', trigger: 'blur'
              }"
            >
              <el-select
                v-model="thisform.taskRecord.cycle"
                style="width: 100%"
                placeholder="请选择"
                clearable
              >
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
            <el-form-item label="序号">
              <el-input v-model="thisform.taskRecord.sortNumber" type="number" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="交办时间">
              <el-input v-model="thisform.taskRecord.handTime" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="办结时限"
              required
              prop="taskRecord.endTime"
              :rules="{
                required: true, message: '请选择办结时限', trigger: 'blur'
              }"
            >
              <Times :model-value="thisform.taskRecord.endTime" status="status01" @getTimeValue="getTimeValue" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="交办部门">
              <el-input v-model="deptName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="交办人">
              <el-input v-model="userName" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="24">
            <el-form-item label="联合督办">
              <ChoiceDepartment identification="type05" :setselection="setselection05" @returnData="returnData" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="工作联系人">
              <el-input v-model="thisform.taskRecord.workPeople" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="联系电话">
              <el-input v-model="thisform.taskRecord.workPeopleNumber" type="number" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="24">
            <el-form-item label="附件">
              <Upload :multiple="true" operation-code="taskRecord" :operation-id="thisform.taskRecord.taskId" @getfjlist="getfjlist" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="24">
            <el-form-item label="提醒给">
              <el-checkbox-group v-model="pushUserType">
                <el-checkbox label="0">责任单位</el-checkbox>
                <el-checkbox label="2">分管领导</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="24">
            <el-form-item label="提醒方式">
              <el-checkbox-group v-model="pushType">
                <el-checkbox label="0">站内信</el-checkbox>
                <el-checkbox label="1">手机短信</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="table_tab"><span>工作分解</span><i class="icon_add el-icon-circle-plus" @click="handleEdit('', 'add')" /></div>
        <el-table
          ref="multipleTable"
          :data="thisform.taskChildrenEntities"
          stripe
          border
          style="width: 100%"
        >
          <el-table-column align="center" width="100" label="操作">
            <template slot-scope="scope">
              <EditDeletOpetionNew
                :scope="scope"
                :menulist="[{
                  name: '编辑',
                  icon: 'el-icon-edit',
                  type: 'edit',
                  ishow: true
                }, {
                  name: '删除',
                  icon: 'el-icon-delete',
                  type: 'delete',
                  color: '#f56c6c',
                  ishow: true
                }]"
                @handleEdit="handleEdit"
              />
            </template>
          </el-table-column>
          <el-table-column align="center" type="index" width="50px" label="序号" :show-overflow-tooltip="true" />
          <el-table-column align="left" width="155px" label="单位名称" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-for="item in scope.row.childrenTaskPeoples" :key="item.key">
                <span v-if="item.rpUserType === 0 || item.rpUserType === 1">{{ item.rpUserName }}</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column align="left" label="责任类型" width="80px" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-for="item in scope.row.childrenTaskPeoples" :key="item.key">
                <span v-if="item.rpUserType === 0">责任单位</span>
                <span v-if="item.rpUserType === 1">协办单位</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column align="left" label="阶段工作目标内容" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <div v-if="scope.row.plans">
                <p v-for="item in scope.row.plans" :key="item.key">{{ item.ipContent }}</p>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <DialogFooter slot="footer" cancelbut="保存并派发" @handleOk="handleOk" @handleNo="handleNo" />
    </el-dialog>

    <!--新增/编辑工作分解-->
    <workbreakdown v-if="hackWorkbreakdown" ref="childenWorkbreakdown" :details="details" :edit-index="editIndex" :title="WorkbreakdownTitle" @returnWorkbreakdown="returnWorkbreakdown" @closed="closedworkbreakdown" />
  </div>
</template>
<script>
import { addtaskRecordsaveTask, gettaskRecordDetail } from '@/views/business/api/JobAssignment'
import { getByDictCode } from '@/api/Common'
import { parseTime } from '@/utils/index'
import { getUserName, getDepartmentName } from '@/utils/auth'
import ChoiceUser from '@/components/ChoiceUser'
import ChoiceDepartment from '@/components/ChoiceDepartment'
import workbreakdown from '@/views/business/keywork/WorkManagement/JobAssignment/model/workbreakdown'

export default {
  components: {
    ChoiceUser,
    ChoiceDepartment,
    workbreakdown
  },
  props: {
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
      hackWorkbreakdown: false,
      rules: {},
      dbAskrules: {
        required: true, message: '请输入首次汇报要求', trigger: 'blur'
      },
      thisform: {
        peoples: [],
        taskChildrenEntities: [],
        taskRecord: {
          dictValueTwo: parseTime(new Date(), '{y}') || '',
          handTime: parseTime(new Date(), '{y}-{m}-{d} {h}:{i}'),
          type: '1' // 业务类型（0：领导批示，1：重点工作，2：会议纪要，3：信访，4：民意快线，5：建议提案）
        },
        type01: '',
        type02: '',
        type03: ''
      },
      type01: [],
      type02: [],
      type03: [],
      type04: [],
      type05: [],
      details: {},
      editIndex: '',
      WorkbreakdownTitle: '',
      setselection01: '',
      setselection02: '',
      setselection03: '',
      setselection04: '',
      setselection05: '',
      pushUserType: [], // 提醒给
      pushType: [], // 提醒方式
      options1: [], // 工作类别
      options2: [{
        value: 1,
        label: '周'
      }, {
        value: 3,
        label: '月'
      }] // 督办频次
    }
  },
  computed: {
    /**
     * 交办人名称
     * */
    userName() {
      return this.thisform.taskRecord.userName || getUserName()
    },
    /**
     * 交办人部门名称
     * */
    deptName() {
      return this.thisform.taskRecord.deptName || getDepartmentName()
    }
  },
  watch: {
    type01(obj) {
      this.thisform.type01 = obj.length > 0 || ''
    },
    type02(obj) {
      this.thisform.type02 = obj.length > 0 || ''
    },
    type03(obj) {
      this.thisform.type03 = obj.length > 0 || ''
    },
    pushUserType(obj) {
      this.thisform.taskRecord.pushUserType = obj.join(',')
    },
    pushType(obj) {
      this.thisform.taskRecord.pushType = obj.join(',')
    }
  },
  created() {

  },
  mounted() {
    if (this.form.taskId) {
      this.getDetail(this.form.taskId)
    }
    this.getByDictCode('workType1', 'options1')
  },
  methods: {
    /**
     * 关闭弹窗
     * */
    closedworkbreakdown() {
      this.hackWorkbreakdown = false
    },
    /**
     * 保存并派发
     * */
    handleNo(type) {
      this.handleOk(type, '1')
    },
    /**
    * 保存
    * */
    handleOk(type, status) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.thisform.taskChildrenEntities.length > 0) {
            /**
             * 整合选择的人和单位
             * */
            this.thisform.taskRecord['status'] = status || '0'
            this.thisform.peoples = this.type01.concat(this.type02).concat(this.type03).concat(this.type04).concat(this.type05) || []
            /* delete this.thisform.type01
            delete this.thisform.type02
            delete this.thisform.type03*/
            this.loading = this.$loading()
            addtaskRecordsaveTask(this.thisform).then((res) => {
              this.loading.close()
              if (res.code === 200) {
                this.submitForm(type, res)
              }
            }).catch(() => {
              this.loading.close()
            })
          } else {
            this.$message({ message: '请新增工作分解' })
          }
        } else {
          this.$message({ message: '请完善数据' })
        }
      })
    },
    submitForm(type, res) {
      this.loading.close()
      if (res.code === 200) {
        switch (this.title) {
          case '新增':
            type ? this.centerDialogVisible = false : this.$refs.form.resetFields()
            this.$emit('handlBtnokClick', true)
            break
          case '编辑':
            type ? this.centerDialogVisible = false : ''
            this.$emit('handlBtnokClick')
            break
          default:
            return false
        }
        this.$notify({
          title: '提示',
          message: `${this.title}成功`
        })
      } else {
        this.$message.error(`${this.title}失败`)
      }
    },
    /**
     * 获取详情
     * */
    getDetail(id) {
      this.loading = this.$loading()
      const params = {
        taskId: id
      }
      gettaskRecordDetail(params).then((res) => {
        this.loading.close()
        if (res.code === 200) {
          this.thisform.taskRecord = res.data.taskRecord
          this.thisform.peoples = res.data.peoples
          this.thisform.taskChildrenEntities = res.data.taskChildrenEntities
          res.data.peoples.map((item, index) => {
            switch (item.rpUserType) {
              case 3:
                this.type01.push(item)
                break
              case 2:
                this.type02.push(item)
                break
              case 0:
                this.type03.push(item)
                break
              case 1:
                this.type04.push(item)
                break
              case 7:
                this.type05.push(item)
                break
            }
            if (res.data.peoples.length - 1 === index) {
              this.setselection01 = this.type01.map(item => item.rpUserId).join(',')
              this.setselection02 = this.type02.map(item => item.rpUserId).join(',')
              this.setselection03 = this.type03.map(item => item.rpUserId).join(',')
              this.setselection04 = this.type04.map(item => item.rpUserId).join(',')
              this.setselection05 = this.type05.map(item => item.rpUserId).join(',')
            }
          })
          this.pushUserType = res.data.taskRecord.pushUserType ? res.data.taskRecord.pushUserType.split(',') : []
          this.pushType = res.data.taskRecord.pushType ? res.data.taskRecord.pushType.split(',') : []
        }
      }).catch(() => {
        this.loading.close()
      })
    },
    /**
     * 按钮操作
     * */
    handleEdit(row, type, index) {
      this.details = Object.assign({}, row)
      switch (type) {
        case 'add':
          this.WorkbreakdownTitle = '新增'
          this.hackWorkbreakdown = true
          this.$nextTick(() => {
            this.$refs.childenWorkbreakdown.centerDialogVisible = true
          })
          break
        case 'edit':
          this.WorkbreakdownTitle = '编辑'
          this.editIndex = index
          this.hackWorkbreakdown = true
          this.$nextTick(() => {
            this.$refs.childenWorkbreakdown.centerDialogVisible = true
          })
          break
        case 'delete':
          this.thisform.taskChildrenEntities.splice(index, 1)
          break
        default:
          return false
      }
    },
    /**
     * 返回工作分解内容
     * */
    returnWorkbreakdown(data, title, index) {
      if (title === '新增') {
        this.thisform.taskChildrenEntities.push(data)
      } else if (title === '编辑') {
        this.thisform.taskChildrenEntities.splice(index, 1, data)
      }
    },
    /**
     * 获取字典
     * */
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
    /**
     * 获取办结时限
     * */
    getTimeValue(val, type) {
      switch (type) {
        case 'status01':
          this.$set(this.thisform.taskRecord, 'endTime', val)
          break
        case 'status02':
          this.$set(this.thisform.taskRecord, 'dictValueTwo', val)
          break
      }
    },
    /**
     * 获取选择人员/单位
     * */
    returnData(val, stats) {
      const taskId = this.thisform.taskRecord.taskId || ''
      this[stats] = []
      switch (stats) {
        case 'type01':
          val.map(res => {
            this[stats].push({
              rpUserType: '3',
              type: '0',
              taskId: taskId,
              rpUserId: res.userId,
              rpUserName: res.trueName
            })
          })
          break
        case 'type02':
          val.map(res => {
            this[stats].push({
              rpUserType: '2',
              type: '0',
              taskId: taskId,
              rpUserId: res.userId,
              rpUserName: res.trueName
            })
          })
          break
        case 'type03':
          val.map(res => {
            this[stats].push({
              rpUserType: '0',
              type: '1',
              taskId: taskId,
              rpUserId: res.departmentid,
              rpUserName: res.deptname
            })
          })
          break
        case 'type04':
          val.map(res => {
            this[stats].push({
              rpUserType: '1',
              type: '1',
              taskId: taskId,
              rpUserId: res.departmentid,
              rpUserName: res.deptname
            })
          })
          break
        case 'type05':
          val.map(res => {
            this[stats].push({
              rpUserType: '7',
              type: '1',
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
     * 获取附件
     * */
    getfjlist(val) {
      this.thisform.fileIds = val
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
  p{
    margin: 0;
  }
</style>

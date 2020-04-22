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
        :model="thisform"
        label-width="110px"
        label-position="left"
      >
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="24">
            <el-form-item label="工作类别">
              <el-radio-group v-model="thisform.taskRecord.dictValueFour" @change="changegzlb">
                <el-radio label="0">建议类</el-radio>
                <el-radio label="1">提案类</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg no_label" justify="space-between">
          <el-col :span="7">
            <el-form-item
              prop="taskRecord.proposalCircles"
              :rules="{
                required: true, message: '请选择届', trigger: 'change'
              }"
            >
              <el-select
                v-model="thisform.taskRecord.proposalCircles"
                style="width: 100%"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in thisform.taskRecord.dictValueFour === '0' ? All_jylj : All_talj"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <span class="el_form_txt">届</span>
          </el-col>
          <el-col :span="7">
            <el-form-item
              prop="taskRecord.proposalSecond"
              :rules="{
                required: true, message: '请选择次', trigger: 'change'
              }"
            >
              <el-select
                v-model="thisform.taskRecord.proposalSecond"
                style="width: 100%"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in thisform.taskRecord.dictValueFour === '0' ? All_jylc : All_talc"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <span class="el_form_txt">次</span>
          </el-col>
          <el-col :span="7">
            <el-form-item
              prop="taskRecord.proposalNumber"
              :rules="{
                required: true, message: '请选择号', trigger: 'blur'
              }"
            >
              <el-input v-model="thisform.taskRecord.proposalNumber" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <span class="el_form_txt">号</span>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item
              label="主体类别"
              required
              prop="taskRecord.dictValueOne"
              :rules="{
                required: true, message: '请选择主体类别', trigger: 'change'
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
          <el-col :span="11">
            <el-form-item
              label="内容类别"
              required
              prop="taskRecord.dictValueTwo"
              :rules="{
                required: true, message: '请选择内容类别', trigger: 'blur'
              }"
            >
              <el-select
                v-model="thisform.taskRecord.dictValueTwo"
                style="width: 100%"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in options3"
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
            <el-form-item
              label="领衔人"
              required
              prop="taskRecord.petitionPeople"
              :rules="{
                required: true, message: '请输入领衔人', trigger: 'blur'
              }"
            >
              <el-input v-model="thisform.taskRecord.petitionPeople" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="界别">
              <el-select
                v-model="thisform.taskRecord.dictValueThree"
                style="width: 100%"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in options4"
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
            <el-form-item label="单位及职务">
              <el-input v-model="thisform.taskRecord.petitionDept" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="联系电话">
              <el-input v-model="thisform.taskRecord.petitionNumber" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="24">
            <el-form-item
              label="案由"
              required
              prop="taskRecord.taskName"
              :rules="{
                required: true, message: '请输入案由', trigger: 'blur'
              }"
            >
              <el-input v-model="thisform.taskRecord.taskName" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="24">
            <el-form-item label="简要说明">
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
            >
              <ChoiceUser identification="type02" :setselection="setselection02" @returnData="returnData" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="24">
            <el-form-item
              label="责任单位"
              required
              prop="type03"
              :rules="{
                required: true, message: '请选择责任单位', trigger: 'blur'
              }"
            >
              <ChoiceDepartment identification="type03" :setselection="setselection03" @returnData="returnData" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="24">
            <el-form-item label="协办单位">
              <ChoiceDepartment identification="type04" :setselection="setselection04" @returnData="returnData" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item
              label="办理方式"
            >
              <el-select
                v-model="thisform.taskRecord.workType"
                style="width: 100%"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in All_workType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item
              label="督办频次"
              required
              prop="taskRecord.cycle"
              :rules="{
                required: true, message: '请选择督办频次', trigger: 'blur'
              }"
            >
              <el-select
                v-model="thisform.taskRecord.cycle"
                style="width: 100%"
                placeholder="请选择"
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
        </el-row>

        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="建议提案联系人">
              <el-input v-model="thisform.taskRecord.taPeople" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="联系电话">
              <el-input v-model="thisform.taskRecord.taPhoneNumber" type="number" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="24">
            <el-form-item label="通讯地址">
              <el-input v-model="thisform.taskRecord.taAddress" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="邮政编码">
              <el-input v-model="thisform.taskRecord.taCode" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="其他联系方式">
              <el-input v-model="thisform.taskRecord.taOrtherPnumber" type="number" placeholder="请输入内容" />
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
              <Times :model-value="thisform.taskRecord.endTime" @getTimeValue="getTimeValue" />
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
      </el-form>
      <DialogFooter slot="footer" cancelbut="保存并派发" @handleOk="handleOk" @handleNo="handleNo" />
    </el-dialog>
  </div>
</template>
<script>
import { addtaskRecordsaveTask, gettaskRecordDetail } from '@/views/business/api/JobAssignment'
import { getByDictCode } from '@/api/Common'
import { parseTime } from '@/utils/index'
import { getUserName, getDepartmentName } from '@/utils/auth'
import ChoiceUser from '@/components/ChoiceUser'
import ChoiceDepartment from '@/components/ChoiceDepartment'

export default {
  components: {
    ChoiceUser,
    ChoiceDepartment
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
      rules: {},
      dbAskrules: {
        required: true, message: '请输入首次汇报要求', trigger: 'blur'
      },
      thisform: {
        peoples: [],
        taskRecord: {
          handTime: parseTime(new Date(), '{y}-{m}-{d} {h}:{i}'),
          dictValueFour: '0',
          cycle: 4,
          proposalCircles: '',
          proposalSecond: '',
          type: '5' // 业务类型（0：领导批示，1：重点工作，2：会议纪要，3：信访，4：民意快线，5：建议提案）
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
      setselection01: '',
      setselection02: '',
      setselection03: '',
      setselection04: '',
      setselection05: '',
      pushUserType: [], // 提醒给
      pushType: [], // 提醒方式
      All_jylj: [], // 建议类界
      All_talj: [], // 提案类界
      All_jylc: [], // 建议类次
      All_talc: [], // 提案类次
      options1: [], // 主体类别
      options3: [], // 内容类别
      options4: [], // 界别
      options2: [{
        value: 4,
        label: '办结报送'
      }], // 督办频次
      All_workType: [{
        value: 0,
        label: '单独办理'
      }, {
        value: 1,
        label: '会办'
      }, {
        value: 2,
        label: '分办'
      }] // 办理方式
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
    this.getByDictCode('workType5', 'options1')
    this.getByDictCode('jytanrlb', 'options3')
    this.getByDictCode('jytanrjb', 'options4')
    this.getByDictCode('jylj', 'All_jylj')
    this.getByDictCode('talj', 'All_talj')
    this.getByDictCode('jylc', 'All_jylc')
    this.getByDictCode('talc', 'All_talc')
  },
  methods: {
    /**
     * 工作类别变化
     * */
    changegzlb() {
      this.thisform.taskRecord['proposalCircles'] = ''
      this.thisform.taskRecord['proposalSecond'] = ''
      this.thisform.taskRecord['proposalNumber'] = ''
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
          /**
           * 整合选择的人和单位
           * */
          this.thisform.taskRecord['status'] = status || '0'
          this.thisform.peoples = this.type01.concat(this.type02).concat(this.type03).concat(this.type04).concat(this.type05) || []
          this.loading = this.$loading()
          addtaskRecordsaveTask(this.thisform).then((res) => {
            this.submitForm(type, res)
          }).catch(() => {
            this.loading.close()
          })
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
      const params = {
        taskId: id
      }
      gettaskRecordDetail(params).then((res) => {
        if (res.code === 200) {
          this.thisform.taskRecord = res.data.taskRecord
          this.thisform.peoples = res.data.peoples
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
      })
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
    getTimeValue(val) {
      this.$set(this.thisform.taskRecord, 'endTime', val)
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
  .el_form_txt{
    line-height: 32px;
    padding: 0 5px;
  }
</style>

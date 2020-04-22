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
            <el-form-item>
              <el-dropdown>
                <span class="el-dropdown-link handleThePhrase">
                  选择常用语<i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="item in options1" :key="item.key"><span @click="handleThePhrase(item.sclContext)">{{ item.sclContext }}</span></el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item>
              <div class="addThePhrase"><span @click="addThePhrase()">添加常用语</span></div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="24">
            <el-form-item
              :label="`${title}内容`"
              prop="srContext"
              :rules="[
                { required: true, message: `请输入${title}内容`, trigger: 'blur' }
              ]"
            >
              <el-input
                v-model="thisform.srContext"
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
        <el-row v-if="state === '0'" type="flex" class="row-bg" justify="space-between">
          <el-col :span="24">
            <el-form-item
              label="督办方式"
              prop="srModeId"
              :rules="[
                { required: true, message: `请选择督办方式`, trigger: 'blur' }
              ]"
            >
              <el-select v-model="thisform.srModeId" placeholder="请选择">
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
        <el-row v-if="state === '0'" type="flex" class="row-bg" justify="space-between">
          <el-col :span="24">
            <el-form-item label="附件">
              <Upload :multiple="true" operation-code="supervision" @getfjlist="getfjlist" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="提醒给"
              prop="srRemind"
              :rules="[
                { required: true, message: '请选择提醒给', trigger: 'change' }
              ]"
            >
              <el-checkbox-group v-model="pushUserType">
                <el-checkbox label="0">责任单位</el-checkbox>
                <el-checkbox label="2">分管领导</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="24">
            <el-form-item
              label="提醒方式"
              prop="srRemindType"
              :rules="[
                { required: true, message: '请选择提醒方式', trigger: 'change' }
              ]"
            >
              <el-checkbox-group v-model="pushType">
                <el-checkbox label="0">站内信</el-checkbox>
                <el-checkbox label="1">手机短信</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item :label="`${title}人`">
              <el-input v-model="userName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item :label="`${title}时间`">
              <el-input v-model="handTime" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <DialogFooter slot="footer" :ischecked="false" cancelname="centerDialogVisible" @handleOk="handleOk" />
    </el-dialog>
  </div>
</template>
<script>
import { addsupervisionRecordinsertList, addsupervisionCommonLanguage, getsupervisionCommonLanguagelist } from '@/views/business/api/Cuibanoverseeing'
import { parseTime } from '@/utils/index'
import { getUserName } from '@/utils/auth'

export default {
  components: {},
  props: {
    form: {
      type: Array,
      default: () => {
        return []
      }
    },
    state: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      centerDialogVisible: false,
      loading: false,
      rules: {},
      thisform: {}, // 表单数据
      pushUserType: [], // 提醒给
      pushType: [], // 提醒方式
      options: [{
        value: '0',
        label: '电话督办'
      }, {
        value: '1',
        label: '现场督办'
      }],
      options1: []
    }
  },
  computed: {
    /**
     * 催办人
     * */
    userName() {
      return getUserName()
    },
    /**
     * 催办时间
     * */
    handTime() {
      return parseTime(new Date(), '{y}-{m}-{d} {h}:{i}')
    },
    /**
     * 类型
     * */
    title() {
      return this.state === '0' ? '督办' : this.state === '1' ? '催办' : ''
    }
  },
  watch: {
    /**
     * 提醒给
     * */
    pushUserType(obj) {
      this.$set(this.thisform, 'srRemind', obj.join(','))
    },
    /**
     * 提醒方式
     * */
    pushType(obj) {
      this.$set(this.thisform, 'srRemindType', obj.join(','))
    }
  },
  created() {

  },
  mounted() {
    if (this.form.taskId) {
      this.thisform['srReportId'] = this.form.reportId
      this.thisform['srAcceptId'] = this.form.acceptId
      this.thisform['srTaskId'] = this.form.taskId
      this.thisform['srWarningTypeId'] = this.form.reportStatus
      this.thisform['srWarningType'] = this.form.reportStatusStr
      this.thisform['srDepartmentName'] = this.form.deptName
      this.thisform['srAcceptTime'] = this.form.acceptEndTime
    }
    this.getsupervisionCommonLanguagelist()
  },
  methods: {
    /**
     * 保存
     * */
    handleOk(type) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          /**
           * 处理数据
           * */
          this.loading = this.$loading()
          const move = this.thisform
          const thisform = {
            srTypeId: this.state,
            srModelType: '2',
            srContext: move.srContext,
            srModeId: move.srModeId,
            srRemind: move.srRemind,
            srRemindType: move.srRemindType,
            modelList: []
          }
          this.form.map((item, index) => {
            thisform.modelList.push({
              srReportId: item.reportId,
              srAcceptId: item.acceptId,
              srTaskId: item.taskId,
              srWarningTypeId: item.reportStatus,
              srWarningType: item.reportStatusStr,
              srDepartmentName: item.deptName,
              srAcceptTime: item.acceptEndTime,
              accessories: move.accessories
            })
            if (this.form.length - 1 === index) {
              addsupervisionRecordinsertList(thisform).then((res) => {
                this.submitForm(type, res)
              }).catch(() => {
                this.loading.close()
              })
            }
          })
        } else {
          this.$message({ message: '请完善数据' })
        }
      })
    },
    submitForm(type, res) {
      this.loading.close()
      if (res.code === 200) {
        this.centerDialogVisible = false
        this.$emit('handlBtnokClick', true)
        this.$notify({
          title: '提示',
          message: `${this.title}成功`
        })
      } else {
        this.$message.error(`${this.title}失败`)
      }
    },
    /**
     * 添加常用语
     * */
    addThePhrase() {
      this.$prompt('', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '请填写常用语',
        inputType: 'textarea',
        inputPattern: /\S/,
        inputErrorMessage: '请填写常用语'
      }).then(({ value }) => {
        this.loading = this.$loading()
        const params = {
          sclTypeId: this.state,
          sclContext: value
        }
        addsupervisionCommonLanguage(params).then(res => {
          this.loading.close()
          if (res.code === 200) {
            this.getsupervisionCommonLanguagelist()
            this.$notify({
              title: '提示',
              message: `添加成功`
            })
          }
        }).catch(() => {
          this.loading.close()
        })
      })
    },
    /**
     * 获取常用语列表
     * */
    getsupervisionCommonLanguagelist() {
      const params = {
        pageNum: 1,
        pageSize: 100,
        search: {
          sclTypeId: this.state
        }
      }
      getsupervisionCommonLanguagelist(params).then(res => {
        this['options1'] = res.data
      }).catch(() => {})
    },
    /**
     * 选择常用语
     * */
    handleThePhrase(val) {
      this.$set(this.thisform, 'srContext', val)
    },
    /**
     * 获取附件
     * */
    getfjlist(val) {
      this.thisform.accessories = val
    },
    closed() {
      // 关闭结束时,清空表单
      this.$emit('closed')
    }
  }
}
</script>
<style lang="scss" scoped>
  .addThePhrase{
    width: 100%;
    text-align: right;
    span{
      color: #409EFF;
      cursor: pointer;
    }
  }
  .handleThePhrase{
    color: #409EFF;
    cursor: pointer;
  }
</style>

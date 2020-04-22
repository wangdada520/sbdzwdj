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
              label="会议大类"
              required
              prop="meeting.dictValueOne"
            >
              <el-select
                v-model="thisform.meeting.dictValueOne"
                style="width: 100%"
                placeholder="请选择"
                clearable
                @change="changehydl"
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
              label="会议小类"
              required
              prop="meeting.dictValueTwo"
            >
              <el-select
                v-model="thisform.meeting.dictValueTwo"
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
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="24">
            <el-form-item
              label="会议名称"
              required
              prop="meeting.meetName"
            >
              <el-input v-model="thisform.meeting.meetName" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="24">
            <el-form-item
              label="会议召开人"
            >
              <ChoiceUser identification="type01" :setselection="setselection01" @returnData="returnData" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item
              label="会议召开日期"
              required
              prop="meeting.beginTime"
            >
              <Times :model-value="thisform.meeting.beginTime" @getTimeValue="getTimeValue" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="发文字号">
              <el-input v-model="thisform.meeting.meetNumber" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="24">
            <el-form-item label="备注说明">
              <el-input
                v-model="thisform.meeting.meetRemark"
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
            <el-form-item label="附件">
              <Upload :multiple="true" operation-code="meeting" :operation-id="thisform.meeting.meetId" @getfjlist="getfjlist" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <DialogFooter slot="footer" cancelname="centerDialogVisible" @handleOk="handleOk" />
    </el-dialog>
  </div>
</template>
<script>
import { addtaskMeeting, gettaskMeeting, gettaskRelationshipPeoplelist } from '@/views/business/api/ManagementMeetings'
import { getByDictCode } from '@/api/Common'
import ChoiceUser from '@/components/ChoiceUser'

export default {
  components: {
    ChoiceUser
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
      rules: {
        meeting: {
          dictValueOne: {
            required: true, message: '请选择会议大类', trigger: 'blur'
          },
          dictValueTwo: {
            required: true, message: '请选择会议小类', trigger: 'blur'
          },
          meetName: {
            required: true, message: '请输入会议名称', trigger: 'blur'
          },
          beginTime: {
            required: true, message: '请选择会议召开日期', trigger: 'blur'
          }
        }
      },
      thisform: {
        meeting: {
          dictValueOne: '',
          dictValueTwo: ''
        },
        peoples: [],
        files: ''
      },
      setselection01: '',
      options1: [], // 会议大类
      options2: [] // 会议小类
    }
  },
  computed: {},
  created() {

  },
  mounted() {
    if (this.form.meetId) {
      this.getDetail(this.form.meetId)
      this.gettaskRelationshipPeoplelist(this.form.meetId)
    }
    this.getByDictCode('hydl', 'options1')
  },
  methods: {
    /**
    * 保存
    * */
    handleOk(type) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = this.$loading()
          addtaskMeeting(this.thisform).then((res) => {
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
      this.loading = this.$loading()
      const params = {
        meetId: id
      }
      gettaskMeeting(id, params).then((res) => {
        this.loading.close()
        if (res.code === 200) {
          this.thisform['meeting'] = res.data
          this.getByDictCode(res.data.dictValueOne, 'options2')
        }
      }).catch(() => {
        this.loading.close()
      })
    },
    /**
     * 获取任务相关人列表
     * */
    gettaskRelationshipPeoplelist(id) {
      const params = {
        pageNum: 1,
        pageSize: 100,
        search: {
          taskId: id
        }
      }
      gettaskRelationshipPeoplelist(params).then((res) => {
        if (res.code === 200) {
          this['setselection01'] = res.data.map(item => item.rpUserId).join(',')
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
     * 会议大类改变、获取会议小类
     * */
    changehydl(val) {
      this.getByDictCode(val, 'options2')
      this.$set(this.thisform.meeting, 'dictValueTwo', '')
    },
    /**
     * 获取办结时限
     * */
    getTimeValue(val) {
      this.$set(this.thisform.meeting, 'beginTime', val)
    },
    /**
     * 获取选择人员/单位
     * */
    returnData(val) {
      this.thisform.peoples = []
      val.map(res => {
        this.thisform.peoples.push({
          rpUserType: 4,
          type: 0,
          rpUserId: res.userId,
          rpUserName: res.trueName
        })
      })
    },
    /**
     * 获取附件
     * */
    getfjlist(val) {
      this.thisform.files = val
    },
    closed() {
      // 关闭结束时,清空表单
      this.$emit('closed')
    }
  }
}
</script>
<style scoped>
</style>

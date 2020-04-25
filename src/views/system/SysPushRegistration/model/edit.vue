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
            <el-form-item label="推送地址">
              <el-input v-model="thisform.mpsPushUrl" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="web地址">
              <el-input v-model="thisform.mpsWebUrl" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="app地址">
              <el-input v-model="thisform.mpsAppUrl" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="编码" prop="mpsSetName">
              <el-input v-model="thisform.mpsSetName" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input
                v-model="thisform.mpsRemark"
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
            <el-form-item label="内容">
              <el-input
                v-model="thisform.mpsContent"
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
      <DialogFooter slot="footer" cancelname="centerDialogVisible" @handleOk="handleOk" />
    </el-dialog>
  </div>
</template>
<script>
import { addmessagePushSet, editmessagePushSet, getmessagePushSet } from '../../../../api/SysPushRegistration'

export default {
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
        mpsSetName: {
          required: true, message: '请输入编码', trigger: 'blur'
        }
      },
      thisform: {}
    }
  },
  created() {

  },
  mounted() {
    if (this.form.mpsId) {
      this.getDetail(this.form.mpsId)
    }
  },
  methods: {
    /**
     * 保存
     * */
    handleOk(type) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = this.$loading()
          switch (this.title) {
            case '新增':
              addmessagePushSet(this.thisform).then((res) => {
                this.submitForm(type, res)
              }).catch(() => {
                this.loading.close()
              })
              break
            case '编辑':
              editmessagePushSet(this.thisform.mpsId, this.thisform).then((res) => {
                this.submitForm(type, res)
              }).catch(() => {
                this.loading.close()
              })
              break
            default:
              return false
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
      const params = {
        mpsId: id
      }
      getmessagePushSet(id, params).then((res) => {
        if (res.code === 200) {
          this.thisform = res.data
        }
      }).catch(() => {
      })
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

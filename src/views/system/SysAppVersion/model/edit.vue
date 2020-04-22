<template>
  <div>
    <el-dialog :visible.sync="centerDialogVisible" :close-on-click-modal="false" :title="title" @closed="closed">
      <el-form ref="form" v-loading="loading" :rules="rules" :model="form" label-width="110px" label-position="left">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="内部版本号" prop="versionCode">
              <el-input v-model="form.versionCode" placeholder="(例如：20200102)" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="版本号" prop="versionName">
              <el-input v-model="form.versionName" placeholder="(例如：v1.0.1)" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="平台">
              <el-select v-model="form.type">
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
          <el-col :span="24">
            <el-form-item label="更新内容">
              <el-input
                v-model="form.version"
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
              <Upload
                operation-code="sysVersion"
                :operation-id="form.id"
                :multiple="true"
                :limit="1"
                tip=" (上传类型为apk)"
                @getfjlist="getfjlist"
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
import { addSysVersion, editSysVersion } from '@/api/SysAppVersion'
import Upload from '@/components/Upload/SingleImage'

export default {
  components: {
    Upload
  },
  props: {
    form: Object,
    title: String
  },
  data() {
    return {
      centerDialogVisible: false,
      loading: false,
      sysSysrole: {},
      rules: {
        versionCode: [
          { required: true, message: '请输入内部版本号', trigger: 'blur' }
        ],
        versionName: [
          { required: true, message: '请输入版本号', trigger: 'blur' }
        ]
      },
      options: [{
        value: 0,
        label: 'IOS'
      }, {
        value: 1,
        label: 'Android'
      }],
      gentype: ''
    }
  },
  created() {

  },
  mounted() {
  },
  methods: {
    handleOk(type) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitForm(type)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async submitForm(type) {
      let res = ''
      switch (this.title) {
        case '新增':
          res = await addSysVersion(this.form)
          break
        case '编辑':
          res = await editSysVersion(this.form.id, this.form)
          break
        default:
          return false
      }
      this.loading = true
      if (res) {
        this.loading = false
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
        this.loading = false
      }
    },
    closed() {
      // 关闭结束时,清空表单
      this.$emit('closed')
    },
    getfjlist(fjid, operationCode) {
      this.form.attachments = fjid
    }
  }
}
</script>
<style scoped>

</style>

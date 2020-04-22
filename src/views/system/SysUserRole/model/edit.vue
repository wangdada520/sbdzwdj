<template>
  <div>
    <el-dialog :visible.sync="centerDialogVisible" :title="title" :close-on-click-modal="false" @closed="closed">
      <el-form ref="form" v-loading="loading" :rules="rules" :model="form" label-width="110px" label-position="left">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="部门名称">
              <el-input v-model="module.name" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="姓名">
              <el-input v-model="form.trueName" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="登录名" prop="loginName">
              <el-input v-model="form.loginName" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="手机号码">
              <el-input v-model="form.mobilePhone" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="邮件">
              <el-input v-model="form.email" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="过期时间(秒)">
              <el-input v-model="form.overTime" type="number" min="0" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="排序">
              <el-input v-model="form.sortNum" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <DialogFooter slot="footer" cancelname="centerDialogVisible" @handleOk="handleOk" />
    </el-dialog>
  </div>
</template>
<script>
import { AddModule, EditModule } from '@/api/SysUserRole'
import DialogFooter from '@/components/DialogFooter'
import { filterObject } from '@/utils/index'
export default {
  name: 'Edit',
  components: { DialogFooter },
  props: {
    form: Object,
    title: String,
    module: Object
  },
  data() {
    return {
      centerDialogVisible: false,
      loading: false,
      formData: {},
      rules: {
        loginName: [
          { required: true, message: '请输入登录名', trigger: 'blur' }
        ]
      }
    }
  },
  created() {

  },
  methods: {
    async handleOk(type) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.formData = {
            userId: this.form.userId,
            trueName: this.form.trueName,
            loginName: this.form.loginName,
            mobilePhone: this.form.mobilePhone,
            archivesId: this.form.archivesId,
            email: this.form.email,
            overTime: this.form.overTime,
            dingUserId: this.form.dingUserId,
            sortNum: this.form.sortNum
          }
          filterObject(this.formData) // 处理undefind,''
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
          this.form.departmentId = this.module.id
          res = await AddModule(this.form)
          break
        case '编辑':
          res = await EditModule(this.form.userId, this.formData)
          break
        default:
          return false
      }
      this.loading = true
      if (res) {
        this.loading = false
        type ? this.centerDialogVisible = false : this.$refs.form.resetFields()
        this.$emit('handlBtnokClick')
        this.$notify({
          title: '提示',
          message: `${this.title}成功`
        })
      }
    },
    closed() {
      // 关闭结束时,清空表单
      this.$refs.form.resetFields()
      // Object.assign(this.$data,this.$options.data())
    }
  }
}
</script>
<style scoped>

</style>

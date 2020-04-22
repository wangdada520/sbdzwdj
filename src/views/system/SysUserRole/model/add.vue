<template>
  <div>
    <el-dialog :visible.sync="centerDialogVisible" title="新增">
      <el-form ref="form" v-loading="loading" :rules="rules" :model="form" label-width="120px" label-position="right">
        <el-form-item label="部门名称">
          <el-input v-model="module.name" disabled />
        </el-form-item>
        <el-form-item label="登录名" prop="loginName">
          <el-input v-model="form.loginName" />
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model="form.mobilePhone" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.trueName" />
        </el-form-item>
        <el-form-item label="邮件">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="过期时间(秒)">
          <el-input v-model="form.overTime" type="number" min="0" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="form.sortNum" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { addsysUsers } from '@/api/SysUserRole'

export default {
  props: {
    module: Object
  },
  data() {
    return {
      centerDialogVisible: false,
      loading: false,
      isfromsubmit: false,
      sysModule: {},
      form: {
        loginName: '',
        archivesId: '',
        mobilePhone: '',
        trueName: '',
        email: '',
        overTime: 0,
        sortNum: '',
        departmentid: ''
      },
      rules: {
        loginName: [
          { required: true, message: '请输入登录名', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {

  },
  methods: {
    handleOk() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.isfromsubmit = true
          this.submitForm()
        } else {
          console.log('error submit!!')
          this.isfromsubmit = false
          return false
        }
      })
    },
    async submitForm() {
      this.loading = true
      this.form.departmentid = this.module.id
      const res = await addsysUsers(this.form)
      if (res) {
        this.loading = false
        this.centerDialogVisible = false
        this.$emit('handlBtnokClick')
        this.$notify({
          title: '提示',
          message: '新增成功'
        })
      }
    }
  }
}
</script>
<style scoped>

</style>

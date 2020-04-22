<template>
  <div>
    <el-dialog :visible.sync="centerDialogVisible" :title="title" :close-on-click-modal="false" @closed="closed">
      <el-form ref="form" v-loading="loading" :rules="rules" :model="form" label-width="100px" label-position="right">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="form.roleName" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="角色描述">
              <el-input v-model="form.roleDesc" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <DialogFooter slot="footer" cancelname="centerDialogVisible" @handleOk="handleOk" />
    </el-dialog>
  </div>
</template>
<script>
import { AddModule, EditModule } from '@/api/sysSysRole'
import DialogFooter from '@/components/DialogFooter'
import { filterObject } from '@/utils/index'

export default {
  name: 'Edit',
  components: { DialogFooter },
  props: {
    form: Object, // 传过来的表单
    title: String
  },
  data() {
    return {
      centerDialogVisible: false,
      loading: false,
      formData: {},
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
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
            roleName: this.form.roleName,
            roleDesc: this.form.roleDesc,
            roleId: this.form.roleId
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
          res = await AddModule(this.formData)
          break
        case '编辑':
          res = await EditModule(this.form.roleId, this.formData)
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

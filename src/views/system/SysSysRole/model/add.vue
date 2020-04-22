<template>
  <div>
    <el-dialog :visible.sync="centerDialogVisible" title="新增">
      <el-form ref="form" v-loading="loading" :rules="rules" :model="form" label-width="110px" label-position="left">
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
import { addSysModule } from '@/api/sysSysRole'
import DialogFooter from '@/components/DialogFooter'
export default {
  name: 'Add',
  components: { DialogFooter },
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
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {

  },
  methods: {
    handleOk(type) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.isfromsubmit = true
          this.submitForm(type)
        } else {
          console.log('error submit!!')
          this.isfromsubmit = false
          return false
        }
      })
    },
    async submitForm(type) {
      this.loading = true
      const res = await addSysModule(this.form)
      if (res) {
        this.loading = false
        type ? this.centerDialogVisible = false : this.$refs.form.resetFields()
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

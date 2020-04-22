<template>
  <div>
    <el-dialog :visible.sync="centerDialogVisible" title="新增">
      <el-form ref="form" v-loading="loading" :rules="rules" :model="form" label-width="120px" label-position="right">

        <el-form-item label="当前父节点">
          <el-input v-model="module.name" disabled />
        </el-form-item>
        <el-form-item label="部门名称" prop="deptname">
          <el-input v-model="form.deptname" />
        </el-form-item>
        <el-form-item label="部门描述">
          <el-input v-model="form.remark" />
        </el-form-item>
        <el-form-item label="排序号">
          <el-input v-model="form.sortnum" type="number" min="0" />
        </el-form-item>
      </el-form>
      <DialogFooter slot="footer" cancelname="centerDialogVisible" @handleOk="handleOk" />
    </el-dialog>
  </div>
</template>
<script>
import { AddModule } from '@/api/SysDepartment'
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
        deptname: '',
        remark: '',
        sortnum: '',
        parentdeptid: '',
        levelpath: ''
      },
      rules: {
        deptname: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {

  },
  methods: {
    /* handleOk() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitForm()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },*/
    async handleOk(type) {
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
      // 如果根节点为空那么就增加一个根节点
      if (!this.module.name) {
        this.form.departmentid = 'ROOT'
        this.form.parentdeptid = ''
      } else {
        this.form.parentdeptid = this.module.id
      }
      this.loading = true
      this.form.levelpath = this.module.levelpath + 1
      const res = await AddModule(this.form)
      if (res) {
        this.loading = false
        this.centerDialogVisible = false
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

<template>
  <div>
    <el-dialog :visible.sync="centerDialogVisible" title="新增">
      <el-form ref="form" v-loading="loading" :rules="rules" :model="form" label-width="120px" label-position="right">

        <el-form-item label="用例菜单">
          <el-input v-model="module.name" disabled />
        </el-form-item>
        <el-form-item label="用列编码" prop="usecaseId">
          <el-input v-model="form.usecaseId" />
        </el-form-item>
        <el-form-item label="用列标题" prop="usecaseTitle">
          <el-input v-model="form.usecaseTitle" />
        </el-form-item>
        <el-form-item label="api映射路径">
          <el-input v-model="form.mappingUrl" />
        </el-form-item>
        <el-form-item label="用列描述">
          <el-input v-model="form.usecaseDesc" type="textarea" />
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
import { addSysModule } from '@/api/sysModuleUseCase'

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
        usecaseTitle: '',
        usecaseDesc: '',
        usecaseId: '',
        moduleId: '',
        mappingUrl: ''
      },
      rules: {
        usecaseId: [
          { required: true, message: '请输入用列编码', trigger: 'blur' }
        ],
        usecaseTitle: [
          { required: true, message: '请输入标题', trigger: 'blur' }
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
      this.form.moduleId = this.module.id
      const res = await addSysModule(this.form)
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

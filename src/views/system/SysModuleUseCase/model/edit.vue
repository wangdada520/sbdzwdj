<template>
  <div>
    <el-dialog :visible.sync="centerDialogVisible" :title="title" :close-on-click-modal="false" @closed="closed">
      <el-form ref="form" v-loading="loading" :rules="rules" :model="form" label-width="110px" label-position="left">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="用例菜单">
              <el-input v-model="module.name" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="用列编码" prop="usecaseId">
              <el-input v-model="form.usecaseId" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="用列标题" prop="usecaseTitle">
              <el-input v-model="form.usecaseTitle" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="api映射路径" prop="mappingUrl">
              <el-input v-model="form.mappingUrl" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="用例类型">
              <el-select
                v-model="form.caseType"
                style="width: 100%"
                placeholder="请选择"
                clearable
              >
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
            <el-form-item label="用列描述">
              <el-input v-model="form.usecaseDesc" type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <DialogFooter slot="footer" cancelname="centerDialogVisible" @handleOk="handleOk" />
    </el-dialog>
  </div>
</template>
<script>
import { AddModule, EditModule } from '@/api/sysModuleUseCase'
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
        usecaseId: [
          { required: true, message: '请输入用列编码', trigger: 'blur' }
        ],
        usecaseTitle: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        mappingUrl: [
          { required: true, message: '请输入api映射路径', trigger: 'blur' }
        ]
      },
      options: [{
        value: 'get',
        label: 'get'
      }, {
        value: 'post',
        label: 'post'
      }, {
        value: 'put',
        label: 'put'
      }, {
        value: 'delete',
        label: 'delete'
      }]
    }
  },
  created() {

  },
  methods: {
    async handleOk(type) {
      // const res = await sysModuleUseCase(from.moduleId, this.sysModule)
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.formData = {
            usecaseTitle: this.form.usecaseTitle,
            usecaseDesc: this.form.usecaseDesc,
            usecaseId: this.form.usecaseId,
            caseType: this.form.caseType,
            mappingUrl: this.form.mappingUrl
          }
          filterObject(this.formData) // 处理undefind
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
          this.form.moduleId = this.module.id
          res = await AddModule(this.form)
          break
        case '编辑':
          res = await EditModule(this.form.moduleId, this.formData)
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

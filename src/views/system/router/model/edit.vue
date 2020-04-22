<template>
  <div>
    <el-dialog :visible.sync="centerDialogVisible" :title="title" :close-on-click-modal="false" @closed="closed">
      <el-form ref="form" v-loading="loading" :rules="rules" :model="form" label-width="110px" label-position="left">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="菜单名" prop="moduleTitle">
              <el-input v-model="form.moduleTitle" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="菜单链接" prop="linkUrl">
              <el-input v-model="form.linkUrl" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="菜单图标">
              <el-input v-model="form.iconFile" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="菜单name值" prop="moduleType">
              <el-input v-model="form.moduleType" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="排序索引">
              <el-input v-model="form.indexNum" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <DialogFooter slot="footer" cancelname="centerDialogVisible" @handleOk="handleOk" />
    </el-dialog>
  </div>
</template>
<script>
import { AddModule, EditModule } from '@/api/sysModule'
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
        moduleTitle: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        linkUrl: [
          { required: true, message: '请输入菜单链接指向本地路由路径', trigger: 'blur' }
        ],
        moduleType: [
          { required: true, message: '请输入name值注意必须和本地路由上的name值对应否则会缓存不生效', trigger: 'blur' }
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
            moduleTitle: this.form.moduleTitle,
            linkUrl: this.form.linkUrl,
            moduleId: this.form.moduleId,
            iconFile: this.form.iconFile,
            moduleType: this.form.moduleType,
            indexNum: this.form.indexNum
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
          if (!this.module.moduleTitle) {
            this.form.departmentid = 'ROOT'
            this.form.pmoduleId = ''
          } else {
            this.form.pmoduleId = this.module.moduleId
            this.form.moduleLevel = this.module.moduleLevel + 1
          }
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

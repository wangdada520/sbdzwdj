<template>
  <div>
    <el-dialog :visible.sync="centerDialogVisible" title="新增">
      <el-form ref="form" v-loading="loading" :rules="rules" :model="form" label-width="110px" label-position="left">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="菜单链接" prop="linkUrl">
              <el-input v-model="form.linkUrl" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="菜单图标">
              <el-input v-model="form.iconFile" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="菜单name值" prop="moduleType">
              <el-input v-model="form.moduleType" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="排序索引">
              <el-input v-model="form.indexNum" type="number" min="0" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <!-- <el-col :span="11">
             <el-form-item label="当前父节点">
               <el-input v-model="module.name" disabled />
             </el-form-item>
           </el-col>-->
          <el-col :span="11">
            <el-form-item label="菜单名" prop="moduleTitle">
              <el-input v-model="form.moduleTitle" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <DialogFooter slot="footer" cancelname="centerDialogVisible" @handleOk="handleOk" />
    </el-dialog>
  </div>
</template>
<script>
import { addSysModule } from '@/api/sysModule'
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
        moduleTitle: '',
        linkUrl: '',
        iconFile: '',
        moduleType: '',
        pmoduleId: '',
        moduleLevel: '',
        indexNum: 0
      },
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
      // 如果根节点为空那么就增加一个根节点
      if (!this.module.name) {
        this.form.departmentid = 'ROOT'
        this.form.pmoduleId = ''
      } else {
        this.form.pmoduleId = this.module.id
        this.form.moduleLevel = this.module.moduleLevel + 1
      }
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

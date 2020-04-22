<template>
  <div>
    <el-dialog :visible.sync="centerDialogVisible" :close-on-click-modal="false" :title="title" @closed="closed">
      <el-form ref="form" v-loading="loading" :rules="rules" :model="form" label-width="110px" label-position="left">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="字典编码" prop="dictcode">
              <el-input v-model="form.dictcode" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="字典名称" prop="dictname">
              <el-input v-model="form.dictname" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="排序" prop="indexnum">
              <el-input v-model="form.indexnum" type="number" min="0" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <DialogFooter slot="footer" cancelname="centerDialogVisible" @handleOk="handleOk" />
    </el-dialog>
  </div>
</template>
<script>
import { editSysDict, addSysDict } from '@/api/SysDictionaries'
import DialogFooter from '@/components/DialogFooter/index'

export default {
  components: {
    DialogFooter
  },
  props: {
    form: Object,
    title: String
  },
  data() {
    return {
      centerDialogVisible: false,
      loading: false,
      rules: {
        dictcode: [
          { required: true, message: '请输入字典编码', trigger: 'blur' }
        ],
        dictname: [
          { required: true, message: '请输入字典名称', trigger: 'blur' }
        ],
        indexnum: [
          { required: true, message: '请输入排序', trigger: 'blur' }
        ]
      }
    }
  },
  created() {

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
          res = await addSysDict(this.form)
          break
        case '编辑':
          res = await editSysDict(this.form.id, this.form)
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
    }
  }
}
</script>
<style scoped>

</style>

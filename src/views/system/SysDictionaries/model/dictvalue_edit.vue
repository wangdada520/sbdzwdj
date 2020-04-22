<template>
  <div>
    <el-dialog :visible.sync="centerDialogVisible" :close-on-click-modal="false" title="编辑">
      <el-form ref="form" v-loading="loading" :rules="rules" :model="form" label-width="110px" label-position="left">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="字典值" prop="value">
              <el-input v-model="form.value" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="排序" prop="indexnum">
              <el-input v-model="form.indexnum" type="number" min="0" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="24">
            <el-form-item label="字典值描述" prop="description">
              <el-input v-model="form.description" type="textarea" resize="none" :autosize="{ minRows: 2}" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <DialogFooter slot="footer" cancelname="centerDialogVisible" @handleOk="handleOk" />
    </el-dialog>
  </div>
</template>
<script>
import { editSysDictvalue, addSysDictvalue } from '@/api/SysDictionaries'
import DialogFooter from '@/components/DialogFooter/index'

export default {
  name: 'DictvalueEdit',
  components: {
    DialogFooter
  },
  props: {
    module: Object,
    form: Object,
    title: String
  },
  data() {
    return {
      centerDialogVisible: false,
      loading: false,
      sysSysrole: {},
      rules: {
        value: [
          { required: true, message: '请输入字典值', trigger: 'blur' }
        ],
        indexnum: [
          { required: true, message: '请输入排序', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入字典值描述', trigger: 'blur' }
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
          this.form.dictid = this.module.id
          res = await addSysDictvalue(this.form)
          break
        case '编辑':
          res = await editSysDictvalue(this.form.id, this.form)
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
      this.$refs.form.resetFields()
    }
  }
}
</script>
<style scoped>

</style>


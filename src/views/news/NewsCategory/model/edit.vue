<template>
  <div>
    <el-dialog
      :visible.sync="centerDialogVisible"
      append-to-body
      :close-on-click-modal="false"
      :title="title"
      @closed="closed"
    >
      <el-form ref="form" v-loading="loading" :rules="rules" :model="thisform" label-width="110px" label-position="left">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="上级分类">
              <el-input v-model="ncpname" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="分类名称" prop="ncname">
              <el-input v-model="thisform.ncname" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="排序索引" prop="ncsort">
              <el-input v-model="thisform.ncsort" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <DialogFooter slot="footer" cancelname="centerDialogVisible" @handleOk="handleOk" />
    </el-dialog>
  </div>
</template>
<script>
import { editNewsCategory, SysModuledetails, addNewsCategory } from '@/api/NewsCategory'

export default {
  props: {
    form: {
      type: Object,
      default: () => {
        return {}
      }
    },
    module: {
      type: Object,
      default: () => {
        return {}
      }
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      centerDialogVisible: false,
      loading: '',
      rules: {
        ncname: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ],
        ncsort: [
          { required: true, message: '请输入排序索引', trigger: 'blur' }
        ]
      },
      thisform: {},
      ncpname: ''// 父节点名称
    }
  },
  created() {

  },
  mounted() {
    this.ncpname = this.module.name
    this.thisform.ncpid = this.module.id
    if (this.form.ncid) {
      this.getPerAntecedent(this.form.ncid)
    }
  },
  methods: {
    handleOk(type) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const loading = this.$loading()
          this.submitForm(type, loading)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async submitForm(type, loading) {
      let res = ''
      switch (this.title) {
        case '新增':
          res = await addNewsCategory(this.thisform)
          break
        case '编辑':
          res = await editNewsCategory(this.thisform.ncid, this.thisform)
          break
        default:
          return false
      }
      if (res && res.code === 200) {
        loading.close()
        switch (this.title) {
          case '新增':
            type ? this.centerDialogVisible = false : this.$refs.form.resetFields()
            break
          case '编辑':
            type ? this.centerDialogVisible = false : ''
            break
          default:
            return false
        }
        this.$emit('handlBtnokClick')
        this.$notify({
          title: '提示',
          message: `${this.title}成功`
        })
      } else {
        loading.close()
      }
    },
    async getPerAntecedent(id) {
      const params = {
        antecedentId: id
      }
      const res = await SysModuledetails(id, params)
      if (res && res.code === 200) {
        this.thisform = res.data
        this.departmentName = res.data.departmentName
        this.setselection = res.data.archivesId
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

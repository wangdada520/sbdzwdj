<template>
  <div>
    <el-dialog :visible.sync="centerDialogVisible" :close-on-click-modal="false" title="编辑" @closed="closed">
      <el-form ref="form" v-loading="loading" :rules="rules" :model="form" label-width="110px" label-position="left">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="附件编码" prop="operationcode">
              <el-input v-model="form.operationcode" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="附件名称" prop="operationname">
              <el-input v-model="form.operationname" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="文件大小" prop="limittotalsize">
              <el-input v-model="form.limittotalsize" type="number" min="0" placeholder="单位为b" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="文件类型">
              <!--<el-input v-model="form.filetype" placeholder="用半角逗号分隔，如jpg,png" />-->
              <el-select
                v-model="value2"
                multiple
                collapse-tags
                placeholder="请选择"
              >
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="保存路径" prop="savepath">
              <el-input v-model="form.savepath" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="子文件生成规则" prop="gentype">
              <el-select v-model="form.gentype">
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
            <el-form-item label="备注">
              <el-input
                v-model="form.remark"
                type="textarea"
                placeholder="限300字"
                maxlength="300"
                show-word-limit
                resize="none"
                :autosize="{ minRows: 2}"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <DialogFooter slot="footer" cancelname="centerDialogVisible" @handleOk="handleOk" />
    </el-dialog>
  </div>
</template>
<script>
import { addSysAccoperation, getByDictCode } from '@/api/SysRegisterFile'
import DialogFooter from '@/components/DialogFooter/index'

export default {
  components: {
    DialogFooter
  },
  props: {
    form: Object,
    title: String,
    types: Boolean
  },
  data() {
    return {
      centerDialogVisible: false,
      loading: false,
      sysSysrole: {},
      rules: {
        operationcode: [
          { required: true, message: '请输入附件编码', trigger: 'blur' }
        ],
        operationname: [
          { required: true, message: '请输入附件名称', trigger: 'blur' }
        ],
        limittotalsize: [
          { required: true, message: '请输入文件大小', trigger: 'blur' }
        ],
        savepath: [
          { required: true, message: '请输入保存路径', trigger: 'blur' }
        ],
        gentype: [
          { required: true, message: '请选择子文件生成规则', trigger: 'blur' }
        ]
      },
      options: [{
        value: 0,
        label: '按年'
      }, {
        value: 1,
        label: '按月'
      }, {
        value: 2,
        label: '按日'
      }],
      options1: [],
      value2: [],
      gentype: ''
    }
  },
  watch: {
    value2(obj) {
      this.form.filetype = this.value2.join(',')
    }
  },
  created() {

  },
  mounted() {
    this.getByDictCode('filetype')
    if (this.form.filetype) {
      this.value2 = this.form.filetype.split(',')
    }
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
      const res = await addSysAccoperation(this.form)
      this.loading = true
      if (res) {
        this.loading = false
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
        this.loading = false
      }
    },
    async getByDictCode(dictcode) {
      const params = {
        dictcode: dictcode
      }
      const res = await getByDictCode(params)
      if (res) {
        res.data.forEach((item) => {
          this.options1.push({
            value: item.value,
            label: item.description
          })
        })
      } else {
        this.loading = false
      }
    },
    // 关闭动画结束后触发
    closed() {
      this.$emit('closed')
    }
  }
}
</script>
<style scoped>

</style>

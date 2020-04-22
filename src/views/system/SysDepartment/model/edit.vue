<template>
  <div>
    <el-dialog :visible.sync="centerDialogVisible" :title="title" :close-on-click-modal="false" @closed="closed">
      <el-form ref="form" v-loading="loading" :rules="rules" :model="form" label-width="110px" label-position="left">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="当前父节点">
              <el-input v-model="module.name" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="部门名称" prop="deptname">
              <el-input v-model="form.deptname" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="部门属性" prop="deptAttribute">
              <el-select
                v-model="form.deptAttribute"
                style="width: 100%"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in selectdwon.deptAttributeStr"
                  :key="item.value"
                  :label="item.description"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="部门级别">
              <el-select
                v-model="form.deptLevel"
                style="width: 100%"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in selectdwon.deptLevelStr"
                  :key="item.value"
                  :label="item.description"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="部门描述">
              <el-input v-model="form.remark" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="排序号">
              <el-input v-model="form.sortnum" type="number" min="0" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <DialogFooter slot="footer" cancelname="centerDialogVisible" @handleOk="handleOk" />
    </el-dialog>
  </div>
</template>
<script>
import { AddModule, EditModule } from '@/api/SysDepartment'
import { getByDictCode } from '@/api/Common'
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
      selectdwon: {
        deptAttributeStr: '',
        deptLevelStr: ''
      },
      operationId: '',
      rules: {
        deptname: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
        ],
        deptAttribute: [
          { required: true, message: '请选择部门属性', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getByDictCode('deptAttribute') // 部门属性
    this.getByDictCode('deptLevel') // 部门级别
  },
  methods: {
    async handleOk(type) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.formData = {
            deptname: this.form.deptname,
            remark: this.form.remark,
            sortnum: this.form.sortnum,
            departmentid: this.form.departmentid,
            levelpath: this.form.levelpath,
            deptAttribute: this.form.deptAttribute,
            deptLevel: this.form.deptLevel
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
          if (!this.module.name) {
            this.form.departmentid = 'ROOT'
            this.form.parentdeptid = ''
          } else {
            this.form.parentdeptid = this.module.id
          }
          this.form.levelpath = this.module.levelpath + 1
          res = await AddModule(this.form)
          break
        case '编辑':
          res = await EditModule(this.form.departmentid, this.formData)
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
    async getByDictCode(dictcode) {
      const params = {
        dictcode: dictcode
      }
      const { code, data } = await getByDictCode(params)
      if (code === 200) {
        if (dictcode === 'deptAttribute') {
          this.selectdwon.deptAttributeStr = data
        } else if (dictcode === 'deptLevel') {
          this.selectdwon.deptLevelStr = data
        }
      }
    },
    closed() {
      // 关闭结束时,清空表单
      this.$refs.form.resetFields()
      this.$emit('closed')
      // Object.assign(this.$data,this.$options.data())
    },
    getfjlist(val) {
      this.form.accessories = val
    },
    getLeaderValue(val) {
      this.form.head = val.value[0]
      this.form.headName = val.key
    }
  }
}
</script>
<style scoped>

</style>

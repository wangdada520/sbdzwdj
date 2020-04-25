<template>
  <div>
    <el-dialog
      :visible.sync="centerDialogVisible"
      append-to-body
      :close-on-click-modal="false"
      :title="title"
      @closed="closed"
    >
      <el-form
        ref="form"
        :rules="rules"
        :model="thisform"
        label-width="110px"
        label-position="left"
      >
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="关联业务主键" prop="mainId">
              <el-input v-model="thisform.mainId" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="编码" prop="mpsSetName">
              <el-select
                v-model="thisform.mpsSetName"
                style="width: 100%"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in options"
                  :key="item.key"
                  :label="item.mpsSetName"
                  :value="item.mpsSetName"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <DialogFooter slot="footer" cancelname="centerDialogVisible" @handleOk="handleOk" />
    </el-dialog>
  </div>
</template>
<script>
import { addmessagePushRecord, editmessagePushRecord, getmessagePushRecord } from '../../../../api/SysPushManagement'
import { getmessagePushSetlist } from '../../../../api/SysPushRegistration'

export default {
  props: {
    form: {
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
      loading: false,
      rules: {
        mainId: {
          required: true, message: '请输入关联业务主键', trigger: 'blur'
        },
        mpsSetName: {
          required: true, message: '请选择编码', trigger: 'blur'
        }
      },
      thisform: {},
      options: []
    }
  },
  created() {

  },
  mounted() {
    this.getmessagePushSetlist()
    if (this.form.mprId) {
      this.getDetail(this.form.mprId)
    }
  },
  methods: {
    /**
     * 保存
     * */
    handleOk(type, status) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = this.$loading()
          switch (this.title) {
            case '新增':
              addmessagePushRecord(this.thisform).then((res) => {
                this.submitForm(type, res)
              }).catch(() => {
                this.loading.close()
              })
              break
            case '编辑':
              editmessagePushRecord(this.thisform.mprId, this.thisform).then((res) => {
                this.submitForm(type, res)
              }).catch(() => {
                this.loading.close()
              })
              break
            default:
              return false
          }
        } else {
          this.$message({ message: '请完善数据' })
        }
      })
    },
    submitForm(type, res) {
      this.loading.close()
      if (res.code === 200) {
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
        this.$message.error(`${this.title}失败`)
      }
    },
    /**
     * 获取详情
     * */
    getDetail(id) {
      const params = {
        mprId: id
      }
      getmessagePushRecord(id, params).then((res) => {
        if (res.code === 200) {
          this.thisform = res.data
        }
      }).catch(() => {
      })
    },
    /**
     * 获取编码
     * */
    getmessagePushSetlist() {
      const params = {
        pageNum: 1,
        pageSize: 1000,
        search: {}
      }
      getmessagePushSetlist(params).then(res => {
        if (res.code === 200) {
          this.options = res.data
        }
      }).catch(() => {})
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

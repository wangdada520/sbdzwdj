<template>
  <div>
    <el-dialog :visible.sync="centerDialogVisible" :close-on-click-modal="false" :title="title" @closed="closed">
      <el-form ref="form" v-loading="loading" :rules="rules" :model="thisform" label-width="110px" label-position="left">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="11">
            <el-form-item label="标题" prop="nrtitle">
              <el-input v-model="thisform.nrtitle" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="信息分类" prop="ncid">
              <el-select v-model="thisform.ncid" :disabled="form.nrid?true:false" placeholder="请选择">
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
          <el-col :span="11">
            <el-form-item label="是否置顶">
              <el-select v-model="thisform.nristop" placeholder="请选择">
                <el-option
                  v-for="item in options01"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="是否发布">
              <el-select v-model="thisform.nrstatus" placeholder="请选择">
                <el-option
                  v-for="item in options02"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="文本">
            <Tinymce :value="thisform.nrcontent" @input="Tinymce" />
          </el-form-item>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col :span="24">
            <el-form-item label="封面图">
              <Upload
                operation-code="news"
                :operation-id="thisform.nrid"
                :multiple="true"
                :limit="1"
                @getfjlist="getfjlist"
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
import { addNewsRecord, editNewsRecord, getNewsRecord } from '@/api/NewsRecord'
import { list } from '@/api/NewsCategory'
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/SingleImage'

export default {
  name: 'Edit',
  components: {
    Tinymce,
    Upload
  },
  props: {
    form: Object,
    title: String
  },
  data() {
    return {
      centerDialogVisible: false,
      loading: false,
      thisform: {
        nristop: 0,
        nrstatus: 0
      },
      rules: {
        nrtitle: [
          { required: true, message: '请填写标题', trigger: 'blur' }
        ],
        ncid: [
          { required: true, message: '请选择分类', trigger: 'change' }
        ]
      },
      options: [],
      options01: [
        {
          label: '否',
          value: 0
        },
        {
          label: '是',
          value: 1
        }
      ],
      options02: [
        {
          label: '否',
          value: 0
        },
        {
          label: '是',
          value: 1
        }
      ]
    }
  },
  mounted() {
    this.listByNcpid()
    if (this.form.nrid) {
      this.getNewsRecord()
    }
  },
  created() {
  },
  methods: {
    handleOk(type) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const loading = this.$loading()
          switch (this.title) {
            case '新增':
              addNewsRecord(this.thisform).then((res) => {
                this.submitForm(type, loading)
              }).catch((res) => {
                loading.close()
              })
              break
            case '编辑':
              editNewsRecord(this.thisform.nrid, this.thisform).then((res) => {
                this.submitForm(type, loading)
              }).catch((res) => {
                loading.close()
              })
              break
            default:
              return false
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    submitForm(type, loading) {
      loading.close()
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
        message: '编辑成功'
      })
    },
    // 获取分类
    listByNcpid() {
      const params = {
        pageNum: '1',
        pageSize: '100',
        search: {}
      }
      list(params).then((res) => {
        if (res.data.length > 0) {
          res.data.map((item, index) => {
            this.options.push({
              label: item.ncname,
              value: item.ncid
            })
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getNewsRecord() {
      const { nrid = '' } = this.form
      const params = {
        nrid
      }
      getNewsRecord(this.form.nrid, params).then((res) => {
        this.thisform = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    //  富文本的内容
    Tinymce(val) {
      this.thisform.nrcontent = val
    },
    //  附件
    getfjlist(val) {
      this.thisform.fileIds = val
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

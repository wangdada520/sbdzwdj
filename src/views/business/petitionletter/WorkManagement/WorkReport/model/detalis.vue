<template>
  <!-- 工作汇报详情 -->
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      append-to-body
      :close-on-click-modal="false"
      @closed="closed"
    >
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="上报信息" name="first">
          <div @click="log1">
            <DetaTab :title="form.taskName" />
          </div>
          <TableHeader :id="form.taskId" />
          <!-- 表单组件 -->
          <FormDetalis ref="childRules" :formdetali="form" />
        </el-tab-pane>
        <el-tab-pane label="上报记录" name="second">上报记录</el-tab-pane>
      </el-tabs>
      <DialogFooter slot="footer" cancelbut="取消" @handleOk="handleOk" @handleNo="handleNo" />
    </el-dialog>
  </div>
</template>

<script>
import FormDetalis from '../components/formdetalis'
import TableHeader from '@/views/business/petitionletter/components/TableHeader'
import { putTaskReport } from '@/views/business/api/WorkReport'
export default {
  components: {
    FormDetalis,
    TableHeader
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    form: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      innerVisible: false,
      activeName: 'first'
      // details: {}
    }
  },
  created() {},
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    log1() {
      console.log(11111)
    },
    handleNo() {
      this.dialogVisible = false
    },
    handleOk(istrue) {
      const flag = this.$refs['childRules'].validateForm()
      if (flag) {
        // 提交
        putTaskReport(this.form.reportId, this.$refs['childRules'].form).then(
          res => {
            console.log(res)

            const { code } = res
            if (code === 200) {
              this.dialogVisible = false
              this.$parent.getList()
              this.$notify({
                title: '成功',
                message: '保存成功',
                type: 'success'
              })
            }
          }
        )
      } else {
        this.$message({ message: '请完善数据!', type: 'warning' })
      }
    },
    // 关闭结束时,清空表单
    closed() {
      this.$emit('closed')
    }
  }
}
</script>

<style scoped>
.btn_content {
  position: relative;
}
.btn {
  position: absolute;
  left: 20px;
}
</style>

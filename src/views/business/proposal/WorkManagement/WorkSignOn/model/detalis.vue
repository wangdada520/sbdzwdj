<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="outerVisible"
      append-to-body
      :close-on-click-modal="false"
      @closed="closed"
    >
      <!-- 表格部分 -->
      <tablelist :id="form.taskId" @sendUserType="sendUserType" @sendType="sendType" />
      <FilePreview :id="form.taskId" :operation-code="operationCode" :operation-id="form.taskId" />
      <el-dialog title="拒签理由" :visible.sync="innerVisible" append-to-body center>
        <el-input
          v-model="refuseReason"
          type="textarea"
          :autosize="{ minRows: 6, maxRows: 10}"
          placeholder="请输入..."
          resize="none"
        />
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="signOk(3)">确定</el-button>
        </div>
      </el-dialog>
      <div slot="footer" class="dialog-footer btn_content">
        <el-button class="btn">打印签收单</el-button>
        <el-button type="danger" @click="innerVisible = true">拒签</el-button>
        <el-button @click="signOk(1)">签收</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import tablelist from '../components/tablelis'
// api方法
import { putSign } from '@/views/business/api/WorkSignOn'
export default {
  components: {
    tablelist
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
      outerVisible: false,
      innerVisible: false,
      operationCode: 'taskRecord', // 附件编码
      refuseReason: '', // 拒签理由
      status: 1, // 签收状态
      acceptId: this.form.acceptId
    }
  },
  methods: {
    // 关闭结束时,清空表单
    closed() {
      this.$emit('closed')
    },
    cancel() {
      this.refuseReason = ''
      this.innerVisible = false
    },
    sendUserType(val) {
      this.pushUserType = val.join(',')
    },
    sendType(val) {
      this.pushType = val.join(',')
    },
    // 拒签/签收
    signOk(num) {
      this.innerVisible = false
      this.outerVisible = false
      const params = new FormData()
      params.append('acceptId', this.acceptId)
      params.append('refuseReason', this.refuseReason)
      params.append('pushUserType', this.pushUserType)
      params.append('pushType', this.pushType)
      // 1代表签收、3代表拒签
      switch (num) {
        case 1:
          this.status = 1
          params.append('status', this.status)
          putSign(params).then(res => {
            const { code } = res
            if (code === 200) {
              this.$parent.getList()
              this.$notify({
                title: '成功',
                message: '签收成功',
                type: 'success'
              })
            }
          })
          break
        case 3:
          this.status = 3
          params.append('status', this.status)
          putSign(params).then(res => {
            const { data, code } = res
            if (code === 200) {
              this.$parent.getList()
              this.$notify({
                title: '警告',
                message: '拒签成功',
                type: 'warning'
              })
            }
          })
          this.$parent.getList()
          break
      }
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

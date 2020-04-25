<template>
  <div>
    <el-dialog
      :visible.sync="centerDialogVisible"
      append-to-body
      :close-on-click-modal="false"
      title="详情"
      @closed="closed"
    >
      <div class="details-height">
        <div class="details-form">
          <div>
            <label>推送地址</label>
            <span>{{ details.mpsPushUrl }}</span>
          </div>
          <div>
            <label>web地址</label>
            <span>{{ details.mpsWebUrl }}</span>
          </div>
        </div>
        <div class="details-form">
          <div>
            <label>app地址</label>
            <span>{{ details.mpsAppUrl }}</span>
          </div>
          <div>
            <label>注册编码</label>
            <span>{{ details.mpsSetName }}</span>
          </div>
        </div>
        <div class="details-form">
          <div>
            <label>备注</label>
            <span>{{ details.mpsRemark }}</span>
          </div>
        </div>
        <div class="details-form">
          <div>
            <label>内容</label>
            <span>{{ details.mpsContent }}</span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getmessagePushSet } from '../../../../api/SysPushRegistration'
export default {
  name: 'Details',
  props: {
    form: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      centerDialogVisible: false,
      activeName: 'first',
      details: {}
    }
  },
  mounted() {
    this.getDetail(this.form.mpsId)
  },
  methods: {
    /**
     * 获取详情
     * */
    getDetail(id) {
      const params = {
        mpsId: id
      }
      getmessagePushSet(id, params).then((res) => {
        if (res.code === 200) {
          this.details = res.data
        }
      }).catch(() => {
      })
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

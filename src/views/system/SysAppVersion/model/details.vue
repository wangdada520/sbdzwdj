<template>
  <div>
    <el-dialog :visible.sync="centerDialogVisible" :close-on-click-modal="false" title="查看详情" @closed="closed">
      <div class="details-height">
        <div class="details-form">
          <div>
            <label>内部版本号</label>
            <span>{{ detail.version }}</span>
          </div>
          <div>
            <label>版本号</label>
            <span>{{ detail.versionName }}</span>
          </div>
        </div>
        <div class="details-form">
          <div>
            <label>平台</label>
            <span>{{ detail.typeStr }}</span>
          </div>
          <div>
            <label>更新内容</label>
            <span>{{ detail.version }}</span>
          </div>
        </div>
      </div>
      <FilePreview operation-code="sysVersion" :operation-id="details.id" />
    </el-dialog>
  </div>
</template>
<script>
import { getSysVersion } from '@/api/SysAppVersion'

export default {
  name: '',
  components: {},
  props: {
    details: Object
  },
  data() {
    return {
      centerDialogVisible: false,
      detail: '',
      jsondata: {}
    }
  },
  created() {
    this.getdetials()
  },
  mounted() {

  },
  methods: {
    async getdetials() {
      this.jsondata = {
        id: this.details.id
      }
      const res = await getSysVersion(this.details.id, this.jsondata)
      if (res) {
        this.detail = res.data
      }
    },
    // 关闭动画结束后触发
    closed() {
      this.$emit('closed')
    }
  }
}
</script>
<style lang="scss" scoped>

</style>

<template>
  <div>
    <el-dialog :visible.sync="centerDialogVisible" :close-on-click-modal="false" title="查看详情" @closed="closed">
      <div class="details-height">
        <div class="details-form">
          <div>
            <label>附件编码</label>
            <span>{{ detail.operationcode }}</span>
          </div>
          <div>
            <label>附件名称</label>
            <span>{{ detail.sysfilename }}</span>
          </div>
        </div>
        <div class="details-form">
          <div>
            <label>文件大小</label>
            <span>{{ detail.filesize }}</span>
          </div>
          <div>
            <label>文件类型</label>
            <span>{{ detail.filetype }}</span>
          </div>
        </div>
        <div class="details-form">
          <div>
            <label>保存路径</label>
            <span>{{ detail.savepath }}</span>
          </div>
          <div>
            <label>创建时间</label>
            <span>{{ detail.createtimeStr }}</span>
          </div>
        </div>
        <div class="details-form">
          <div>
            <label>备注</label>
            <span>{{ detail.remark }}</span>
          </div>
          <!--<div>
            <label>附件：</label>
            <span><img :src="detail.httpPath" alt=""></span>
          </div>-->
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { GetFile } from '@/api/SysManageFile'

export default {
  name: 'Details',
  components: {},
  props: {
    details: Object
  },
  data() {
    return {
      centerDialogVisible: false,
      rolesData: [],
      detail: '',
      height: document.documentElement.clientHeight - 250,
      jsondata: {}
    }
  },
  created() {
    this.getdetials()
  },
  mounted() {

  },
  methods: {
    // 关闭动画结束后触发
    closed() {
      this.$emit('closed')
    },
    async getdetials() {
      this.jsondata = {
        id: this.details.id
      }
      const res = await GetFile(this.details.id, this.jsondata)
      if (res) {
        this.detail = res.data
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>

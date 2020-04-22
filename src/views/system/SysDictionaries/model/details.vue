<template>
  <div>
    <el-dialog :visible.sync="centerDialogVisible" :close-on-click-modal="false" title="查看详情" @closed="closed">
      <div class="details-height">
        <div class="details-form">
          <div>
            <label>字典编码</label>
            <span>{{ details.dictcode }}</span>
          </div>
          <div>
            <label>字典名称</label>
            <span>{{ details.dictname }}</span>
          </div>
        </div>
        <div class="details-form">
          <div>
            <label>排序</label>
            <span>{{ details.indexnum }}</span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getSysDict } from '@/api/SysDictionaries'

export default {
  name: '',
  components: {},
  props: {
    details: Object
  },
  data() {
    return {
      centerDialogVisible: false,
      rolesData: []
    }
  },
  created() {
    this.getSysDict()
  },
  methods: {
    // 关闭动画结束后触发
    closed() {
      this.$emit('closed')
    },
    async getSysDict() {
      const params = {
        id: this.details.id
      }
      const res = await getSysDict(this.details.id, params)
      if (res) {
        this.rolesData.push({
          dictcode: res.data.dictcode,
          dictname: res.data.dictname,
          indexnum: res.data.indexnum
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>

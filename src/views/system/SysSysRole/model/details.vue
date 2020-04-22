<template>
  <div>
    <el-dialog :visible.sync="centerDialogVisible" :close-on-click-modal="false" title="查看详情" @closed="closed">
      <div class="details-height">
        <div class="details-form">
          <div>
            <label>角色名称</label>
            <span>{{ rolesData.roleName }}</span>
          </div>
        </div>
        <div class="details-form">
          <div>
            <label>角色描述</label>
            <span>{{ rolesData.roleDesc }}</span>
          </div>
        </div>
        <div class="details-form">
          <div>
            <label>用例详情(用例名称)</label>
            <span>{{ rolesData.userCase }}</span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getListByRoleId } from '@/api/sysSysRole'
export default {
  name: '',
  components: {},
  props: {
    details: Object
  },
  data() {
    return {
      centerDialogVisible: false,
      rolesData: {}
    }
  },
  created() {
    this.getListByRoleId()
  },
  methods: {
    async getListByRoleId() {
      const params = `roleId=${this.details.roleId}`
      const res = await getListByRoleId(params)
      if (res) {
        const usecaseTitle = []
        res.data.forEach(item => {
          usecaseTitle.push(item.usecaseTitle)
        })
        this.rolesData = {
          roleName: this.details.roleName,
          roleDesc: this.details.roleDesc,
          userCase: usecaseTitle.join(',')
        }
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

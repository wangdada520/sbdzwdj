<template>
  <div>
    <el-dialog :visible.sync="centerDialogVisible" :close-on-click-modal="false" title="查看详情" @closed="closed">
      <div class="details-height">
        <div class="details-form">
          <div>
            <label>姓名</label>
            <span>{{ detail.syUsers.trueName }}</span>
          </div>
          <div>
            <label>登录名</label>
            <span>{{ detail.syUsers.loginName }}</span>
          </div>
        </div>
        <div class="details-form">
          <div>
            <label>电话号码</label>
            <span>{{ detail.syUsers.mobilePhone }}</span>
          </div>
          <div>
            <label>邮件</label>
            <span>{{ detail.syUsers.email }}</span>
          </div>
        </div>
        <div class="details-form">
          <div>
            <label>所属部门</label>
            <span>{{ detail.syUsers.departmentName }}</span>
          </div>
          <div>
            <label>钉钉usrid</label>
            <span>{{ detail.syUsers.dingUserId }}</span>
          </div>
        </div>
        <div class="details-form">
          <div>
            <label>过期时间(秒)</label>
            <span>{{ detail.syUsers.overTime }}</span>
          </div>
          <div>
            <label>角色信息</label>
            <span>{{ detail.roleinfo }}</span>
          </div>
        </div>
      </div>
      <!--<span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleOk(form)">确 定</el-button>
      </span>-->
    </el-dialog>
  </div>
</template>
<script>
import { getdetials } from '@/api/SysUserRole'

export default {
  name: '',
  components: {},
  props: {
    details: Object
  },
  data() {
    return {
      centerDialogVisible: false,
      rolesData: [],
      detail: {
        syUsers: {},
        sysUserRoleList: {}
      },
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
    async getdetials() {
      this.jsondata = {
        id: this.details.userId
      }
      const res = await getdetials(this.details.userId, this.jsondata)
      if (res) {
        const arry = []
        if (res.data.sysUserRoleList.length !== 0) {
          res.data.sysUserRoleList.forEach(item => {
            arry.push(item.roleName)
          })
          res.data.roleinfo = arry.join(',')
        }
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

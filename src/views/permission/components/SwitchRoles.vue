<template>
  <div>
    <!--<div style="margin-bottom:15px;">
      您当前的权限: {{ getName() }}
    </div>-->
    <!-- <el-radio-group v-for="item in roles" :key="item.roleId" v-model="switchRoles">
      <el-radio-button :label="item.roleId"> {{ item.roleName }}</el-radio-button>
    </el-radio-group>-->
    <el-dropdown-item v-for="item in roles" :key="item.roleId">
      <span style="display: block" @click="drownpdown(item)"> {{ item.roleName }}</span>
    </el-dropdown-item>
  </div>
</template>

<script>
import { getRoleId } from '@/utils/auth'
export default {

  computed: {
    roles() {
      return this.$store.getters.roles
    },
    switchRoles: {
      get() {
        const RoleId = getRoleId() === 'RoleId' ? this.roles[0].roleId : getRoleId()
        return RoleId
      },
      set(val) {
        const loading = this.$loading({
          lock: true,
          text: '角色切换中,请稍候...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        this.$store.dispatch('user/changeRoles', val).then(() => {
          loading.close()
          localStorage.setItem('identityFlag', this.getidentityFlag(val))
          this.$emit('change', val)
        })
      }
    }
  },
  methods: {
    getName() {
      const roles = this.$store.getters.roles
      let roleName = ''
      roles.forEach(item => {
        if (item.roleId === this.switchRoles) {
          roleName = item.roleName
        }
      })
      return roleName
    },
    // 设置角色身份
    getidentityFlag(val) {
      const roles = this.$store.getters.roles
      let identityFlag = ''
      roles.forEach(item => {
        if (item.roleId === val) {
          identityFlag = item.identityFlag
        }
      })
      return identityFlag
    },
    drownpdown(item) {
      this.$confirm(`是否将角色切换为${item.roleName}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.switchRoles = item.roleId
      }).catch(() => {

      })
    }
  }
}
</script>

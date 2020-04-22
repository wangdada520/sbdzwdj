<template>
  <div class="sidebar-header">
    <div class="sidebar-logo">
    <!--  <img src="../../../assets/BigScreen/BigScreen_title.png" alt="">-->
    </div>
    <div class="sidebar-info navbar">
      <div class="right-menu">
        <template v-if="device!=='mobile'">

          <error-log class="errLog-container right-menu-item hover-effect" />

          <screenfull id="screenfull" class="right-menu-item hover-effect" />

        </template>

        <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
          <div class="avatar-wrapper">
            <div style="text-align: center">
              <!-- <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">-->
              <span>
                {{ username }}
              </span>

            </div>
            <i class="el-icon-caret-bottom" />
          </div>
          <el-dropdown-menu slot="dropdown">
            <!-- <router-link to="/profile/index">
              <el-dropdown-item>个人信息</el-dropdown-item>
            </router-link>-->
            <el-dropdown-item>
              <span style="display:block;" @click="handlenewPassword">修改密码</span>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <span style="display:block;" @click="logout"><svg-icon icon-class="exitsystem" /> 退出系统</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <el-dialog v-el-drag-dialog title="修改密码" :visible.sync="dialogVisible" center :show-close="false">
      <el-form ref="changenewPasswordForm" :model="changenewPasswordForm" :rules="rules">
        <el-form-item label="旧密码" prop="oldPassword" label-width="100px">
          <el-input v-model="changenewPasswordForm.oldPassword" type="newPassword" placeholder="新密码" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword" label-width="100px">
          <el-input v-model="changenewPasswordForm.newPassword" type="newPassword" placeholder="新密码" />
        </el-form-item>
        <el-form-item label="确认新密码" prop="newPassword_confirm" label-width="100px">
          <el-input v-model="changenewPasswordForm.newPassword_confirm" type="newPassword" placeholder="再次输入新密码" />
        </el-form-item>
      </el-form>
      <DialogFooter slot="footer" :ischecked="false" handleoklbut="确定" @handleNo="closeDialog('changenewPasswordForm')" @handleOk="changenewPassword('changenewPasswordForm')" />
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import elDragDialog from '@/directive/el-drag-dialog'
import DialogFooter from '@/components/DialogFooter'
import { Message } from 'element-ui'
import { updateUsernewPassword } from '@/api/user'
import { getUserName, getUserId } from '@/utils/auth'
export default {
  directives: { elDragDialog },
  components: {
    ErrorLog,
    Screenfull,
    DialogFooter
  },
  data() {
    var validateoldPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码长度不能小于6'))
      } else {
        callback()
      }
    }
    var validatenewPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码长度不能小于6'))
      } else {
        if (this.changenewPasswordForm.newPassword_confirm !== '') {
          this.$refs.changenewPasswordForm.validateField('newPassword_confirm')
        }
        callback()
      }
    }
    var validatenewPasswordConfirm = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.changenewPasswordForm.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: false,
      changenewPasswordForm: {
        oldPassword: '',
        newPassword: '',
        newPassword_confirm: ''
      },
      username: '',
      rules: {
        oldPassword: [
          { validator: validateoldPassword, trigger: 'blur' }
        ],
        newPassword: [
          { validator: validatenewPassword, trigger: 'blur' }
        ],
        newPassword_confirm: [
          { validator: validatenewPasswordConfirm, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name',
      'user_id',
      'device'
    ])
  },
  mounted() {
    this.username = getUserName()
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    handlenewPassword() {
      this.dialogVisible = true
    },
    // 取消修改密码
    closeDialog(formName) {
      this.dialogVisible = false
      this.$refs[formName].resetFields()
    },
    changenewPassword(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = `newPassword=${this.changenewPasswordForm.newPassword}&oldPassword=${this.changenewPasswordForm.oldPassword}&userId=${getUserId()}`
          updateUsernewPassword(params).then(res => {
            this.dialogVisible = false
            this.$store.dispatch('user/logout')
            const text = res.msg + '，请重新登录。'
            this.$confirm(text, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$router.push(`/login?redirect=${this.$route.fullPath}`)
            }).catch(() => {
              this.$router.push(`/login?redirect=${this.$route.fullPath}`)
            })
          })
        } else {
          Message.error('数据验证失败！')
          return false
        }
      })
    },
    logout() {
      this.$confirm('确认退出登录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.exit()
      }).catch(() => {

      })
    },
    // 关闭所有标签
    closeAllTags(view) {
      this.$store.dispatch('tagsView/delAllViews').then(({ visitedViews }) => {
        this.toLastView(visitedViews, view)
      })
    },
    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        this.$router.push(latestView)
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Dashboard') {
          // to reload home page
          this.$router.replace({ path: '/redirect' + view.fullPath })
        } else {
          this.$router.push('/')
        }
      }
    },
    async exit() {
      await this.$store.dispatch('user/logout')
      this.closeAllTags()
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)  //记住标签缓存
      this.$router.push(`/login`) // 不记住标签缓存
    },
    resivename(val) {
      this.username = getUserName() + '(' + this.getName(val) + ')'
    },
    getName(roleId) {
      const roles = this.$store.getters.roles
      let roleName = ''
      roles.forEach(item => {
        if (item.roleId === roleId) {
          roleName = item.roleName
        }
      })
      return roleName
    }
  }
}
</script>
<style lang="scss" scoped>
  .navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    //box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

  &
  :hover {
    background: rgba(0, 0, 0, .025)
  }

  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

  &
  :focus {
    outline: none;
  }

  .right-menu-item {
    display: inline-block;
    padding: 0 8px;
    height: 100%;
    font-size: 18px;
    color: #fff;
   //vertical-align: text-bottom;

  &
  .hover-effect {
    cursor: pointer;
    transition: background .3s;

  &
  :hover {
    background: rgba(0, 0, 0, .025)
  }

  }
  }

  .avatar-container {
    margin-right: 30px;

  .avatar-wrapper {
    margin-top: 5px;
    position: relative;

  .user-avatar {
    cursor: pointer;
    width: 40px;
    height: 40px;
    border-radius: 10px;
  }

  .el-icon-caret-bottom {
    cursor: pointer;
    position: absolute;
    right: -20px;
    top: 25px;
    font-size: 12px;
  }

  }
  }
  }
  }
</style>

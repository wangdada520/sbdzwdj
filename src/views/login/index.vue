<template>
  <div class="login-container">
    <div class="login_Company">
      <!-- <img src="../../assets/login/login_Company.png" alt="">-->
    </div>
    <div class="title-container">
      <h3 class="title">
      <!--  <img src="../../assets/login/login_banner.png" alt="">-->
      </h3>
    </div>
    <div class="login-bg-text01">
      <!-- <img src="../../assets/login/login_bg_txet01.png" alt="">-->
    </div>
    <div class="login-bg-text02">
      <!-- <img src="../../assets/login/login_bg_txet02.png" alt="">-->
    </div>
    <div class="login-bg">
      <div class="titles">
        <!--        <img src="../../assets/login/logo.png" alt="">-->
        <img src="../../assets/login/name.png" alt="">
      </div>
      <div>
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          auto-complete="on"
          label-position="top"
        >
          <div class="login_main">
            <div class="login_input_container">
              <div class="login_user">
                <el-form-item prop="username" label="用户名">
                  <!--              <div class="login_title">用户名：</div>-->
                  <!--              <span class="svg-container">-->
                  <!--                <svg-icon icon-class="user" />-->
                  <!--              </span>-->
                  <el-input
                    ref="username"
                    v-model="loginForm.username"
                    placeholder="用户名"
                    name="username"
                    type="text"
                    tabindex="1"
                    auto-complete="on"
                    @blur="blur"
                  />
                </el-form-item>
              </div>
              <div class="login_pass">
                <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
                  <el-form-item prop="password" label="密码">
                    <!--                <div class="login_title">密码：</div>-->
                    <!--                <span class="svg-container">-->
                    <!--                  <svg-icon icon-class="password" />-->
                    <!--                </span>-->
                    <el-input
                      :key="passwordType"
                      ref="password"
                      v-model="loginForm.password"
                      :type="passwordType"
                      placeholder="密码"
                      name="password"
                      tabindex="2"
                      auto-complete="on"
                      @keyup.native="checkCapslock"
                      @blur="capsTooltip = false"
                      @keyup.enter.native="handleLogin"
                    />
                    <span class="show-pwd" @click="showPwd">
                      <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                    </span>
                  </el-form-item>
                </el-tooltip>
              </div>
              <div v-show="isverification" class="verification">
                <el-form-item>
                  <div class="login_title">验证码：</div>
                  <span class="svg-container">
                    <svg-icon icon-class="yzm" />
                  </span>
                  <el-input
                    v-model="verCode"
                    placeholder="请输入验证码"
                    name="verCode"
                    type="text"
                    tabindex="1"
                    auto-complete="on"
                  />
                  <span class="yzm" @click="getCaptcha"><img :src="Bas64" alt=""></span>
                </el-form-item>
              </div>
            </div>
            <template>
              <el-checkbox v-model="checked" style="margin-bottom: 10px">记住密码</el-checkbox>
            </template>
            <el-button
              :loading="loading"
              type="success"
              style="width:100%;"
              @click.native.prevent="handleLogin"
            >
              登 录
            </el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value.trim()) {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码至少6位数'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ trigger: 'blur', validator: validateUsername }],
        password: [{ trigger: 'blur', validator: validatePassword }]
      },
      verCode: '', // 验证码
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      checked: true,
      Bas64: '',
      isverification: false // 是否显示验证码
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
  },
  destroyed() {
  },
  mounted() {
    if (localStorage.getItem('loginForm')) {
      this.loginForm = JSON.parse(localStorage.getItem('loginForm'))
    }
    this.checked = localStorage.getItem('Checked') === 'true'
  },
  methods: {
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.loginForm.verCode = this.verCode
          this.$store.dispatch('user/login', this.loginForm)
            .then((res) => {
              if (this.checked) {
                localStorage.setItem('loginForm', JSON.stringify(this.loginForm))
              } else {
                const loginInfo = this.loginForm
                loginInfo.password = ''
                localStorage.setItem('loginForm', JSON.stringify(loginInfo))
              }
              localStorage.setItem('Checked', this.checked)
              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
            })
            .catch((code) => {
              this.loading = false
              if (code === 402) {
                localStorage.setItem('firstuser', this.loginForm.username)
                this.isverification = true
                this.verCode = ''
                this.getCaptcha()
              }
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getCaptcha() {
      this.$store.dispatch('user/getCaptcha', this.loginForm.username).then((res) => {
        this.Bas64 = 'data:image/png;base64,' + res
      }).catch((code) => {
        if (code === 500) {
          this.isverification = false
        }
      })
    },
    blur() {
      if (localStorage.getItem('firstuser') !== this.loginForm.username) {
        this.isverification = false
      }
    }
  }
}
</script>

<style lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg: #fff;
  $border: #ffd6ab;
  $light_gray: #0bafc1;
  $cursor: rgba(51,125,247,1);
  $text: #666;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      /*<!--color: $cursor;-->*/
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-input {
      /*display: inline-block;*/
      height: 30px;
      width: calc(100%);

      input {
        background: transparent;
        /*border: 0;*/
        -webkit-appearance: none;
        border-radius: 0;
        padding: 0 5px 0 15px;
        /*<!--color: $cursor;-->*/
        /*height: 30px;*/
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0 1000px $bg inset !important;
          -webkit-text-fill-color: $text !important;
        }
      }
    }

    .svg-container {
      height: 30px;
      padding: 0 0 0 15px !important;
      line-height: 30px;
      color: $cursor !important;
    }

    .el-form-item {
      background: $bg;
      height: 45px;
      /*border: 1px solid #e1e1e1;*/
      margin-bottom: 12px;
    }
    .el-form-item__label{
      padding:0 !important;
      /*width:21px;*/
      /*height:7px;*/
      font-size:14px;
      font-family:Microsoft YaHei;
      font-weight:400;
      color:rgba(52,52,52,1);
      line-height:10px;
    }

    .el-button--success {
      background-color: $cursor;
      border-color: $cursor;
      border-radius: 0;
      font-size: 18px;
    }

    .el-form-item__error{
      width: 100%;
      text-align: right;
      top: -1px;
    }

    .el-checkbox__inner{
      border-radius: 0;
      background-color: transparent;
      border-color: $cursor;
    }

    .el-checkbox__input.is-checked .el-checkbox__inner{
      background-color: $cursor;
      border-color: $cursor;
    }

    .el-checkbox__input.is-checked + .el-checkbox__label ,
    .el-checkbox__label{
      color: $text;
    }

    .el-checkbox__inner:hover,
    .el-checkbox__input.is-focus .el-checkbox__inner {
      border-color: $cursor !important;
    }

    .el-form-item--medium .el-form-item__content {
      height: 30px;
      display: flex;
      align-items: center;
    }
  }

</style>

<style lang="scss" scoped type="text/scss">
  $bg: #2d3a4b;
  $text: #6c6c6c;
  $dark_gray: #be1c21;
  $light_gray: #0bafc1;

  .login-container {
    min-height: 100%;
    width: 100%;
    overflow: hidden;
    /*<!--background: $light_gray;-->*/
    background: url("../../assets/login/bg.jpg") no-repeat center/cover;

    .login_Company{
      position: absolute;
      top: 20px;
      left: 20px;
    }
    .login-bg{
      display: flex;
      align-items: center;
      z-index: -1;
      width:100%;
      height:150px;
      background: rgba(0,0,0,0.5);
      margin-top: 13.5%;
    }
    .titles{
      position: absolute;
      left: 15%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width:500px;
      height:101px;
      font-size:33px;
      font-weight:400;
      color:rgba(255,255,255,1);
    }

    .login-form {
      position: absolute;
      right: 1%;
      transform: translate(-50%,-50%);
      background: rgba(255,255,255,1);
      width: 320px;
      height: 260px;
      max-width: 100%;
      overflow: hidden;
      border-radius:3px;
      box-shadow: 0 0 13px 2px rgba(74,0,4,0.2);
      padding: 9px;
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%);
      margin-top: -330px;

      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0 auto 70px auto;
        text-align: center;
        font-weight: bold;
      }
    }

    .login-bg-text01,
    .login-bg-text02 {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      justify-content: center;
      width: 50%;
    }

    .login-bg-text01{
      right: 50%;
      padding-right: 160px;
    }

    .login-bg-text02{
      left: 50%;
      padding-left: 160px;
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 0;
      font-size: 16px;
      /*<!--color: $dark_gray;-->*/
      cursor: pointer;
      user-select: none;
    }

    .thirdparty-button {
      position: absolute;
      right: 0;
      bottom: 6px;
    }

    @media only screen and (max-width: 470px) {
      .thirdparty-button {
        display: none;
      }
    }
  }

  .login_input_container >div{
    margin-bottom: 35px;
  }

  .login_input_container >div:last-child{
    margin-bottom: 30px;
  }

  .login_main {
    width: 100%;
    height: 100%;
    background: #fff;
    margin: 0 auto;
    padding:0 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .login_user {
      position: relative;
    }

    .login_pass {
      position: relative;
    }

    .login_title{
      position: absolute;
      /*<!--top: -30px;-->*/
      color: $text;
      font-size: 18px;
      line-height: 18px;
      display: none;
    }
  }
  .verification{
  .el-input{
    width: 160px;
   }
  .yzm{
    display: inline-block;
    width: calc(100% - 190px);
    height: 30px;
    cursor: pointer;
    img{
      width: 100%;
      height: 100%;
    }
  }
  }
</style>

<template>
  <div class="content">
    <div class="welcom">
      <h2>{{ nowHours() }}</h2>
      <p>欢迎登陆{{ defaultSettings.title }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      defaultSettings: require('../../../../src/settings')
    }
  },
  methods: {
    nowHours() {
      const now = new Date(); const hour = now.getHours()
      if (hour < 6) { return ('凌晨好！') } else if (hour < 9) { return ('早上好！') } else if (hour < 12) { return ('上午好！') } else if (hour < 14) { return ('中午好！') } else if (hour < 17) { return ('下午好！') } else if (hour < 19) { return ('傍晚好！') } else if (hour < 22) { return ('晚上好！') } else { return ('夜里好！') }
    }
  }
}
</script>
<style lang="scss" scoped>
  .content{
    background-image: url("../../../assets/svg/welcome.svg");
    background-repeat: no-repeat;
    background-size: 100% 100%;
  .welcom{
    padding-top: 100px;
    padding-left: 100px;
  h2{
    font-size: 58px;
    color: #51ac83;
    line-height: 0;
    font-weight: inherit;
  }
  p{
    font-size: 26px;
    color: #343434;
    line-height: 10px;
  }
  }
  }
</style>

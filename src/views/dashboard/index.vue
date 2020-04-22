<template>
  <div class="content">
    <welcone v-show="identityFlag!==20||identityFlag!==10||!identityFlag" />
  </div>

</template>

<script>

import welcone from './welcome/index'
export default {
  name: 'Dashboard',
  components: {
    welcone
  },
  data() {
    return {
      identityFlag: Number(localStorage.getItem('identityFlag')) // 角色身份：identityFlag（其他身份=0，干警=10，负责人=20，配验中心=30，领导=40）
    }
  },
  mounted() {

  },
  methods: {}
}
</script>

<style lang="scss" scoped>

</style>


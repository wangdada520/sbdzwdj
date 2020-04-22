<template>
  <div>
    <switch-roles ref="switchs" @change="handleRolesChange" />
  </div>
</template>

<script>
import SwitchRoles from './components/SwitchRoles'
export default {
  name: 'PagePermission',
  components: { SwitchRoles },
  mounted() {
    // console.log(store.getters.buttons)
  },
  methods: {
    handleRolesChange(val) {
      this.$router.push({ path: '/?' + +new Date() })
      this.$emit('resivename', val)
    }
  }
}
</script>

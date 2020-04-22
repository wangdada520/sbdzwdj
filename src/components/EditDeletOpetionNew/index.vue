<template>
  <div>
    <div v-for="(item,index) in Menufilter" :key="index" style="display: inline-block">
      <el-tooltip v-for="(items,index) in item.firstarry" :key="index" placement="top" :content="items.name">
        <i :class="items.icon" class="font-icon" :style="items.color?`color:${items.color}`:''" @click.prevent.stop="handleEdit(scope.row,items.type)" />
      </el-tooltip>
      <el-dropdown v-show="item.otherarry.length>0" size="medium" placement="bottom-start">
        <span class="el-dropdown-link font-icon">
          <i class="el-icon-more" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(items,index) in item.otherarry" :key="index">
            <span style="display: block" @click.prevent.stop="handleEdit(scope.row,items.type)">{{ items.name }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Edit',
  components: {},
  props: {
    menulist: { // 数据格式 {name:名称,icon:el-icon-edit,ishow:true,type:edit,color:#fff}
      type: Array,
      default: () => {
        return []
      }
    },
    scope: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      Menufilter: [{
        firstarry: [],
        otherarry: []
      }]
    }
  },
  computed: {
  },
  watch: {
    menulist() {
      this.editmenu()
    }
  },
  created() {

  },
  mounted() {
    this.editmenu()
  },
  methods: {
    editmenu() {
      const newarry = []
      const menulist = []
      this.menulist.map((item, index) => {
        if (item.ishow) {
          menulist.push(item)
        }
        if (this.menulist.length - 1 === index) {
          newarry.push({
            firstarry: menulist.slice(0, 2),
            otherarry: menulist.slice(2)
          })
          this.Menufilter = newarry
        }
      })
    },
    handleEdit(val, name) {
      this.$emit('handleEdit', val, name, this.scope.$index)
    }
  }
}
</script>
<style lang="scss" scoped>

</style>

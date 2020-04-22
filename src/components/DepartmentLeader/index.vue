<template>
  <el-cascader ref="cascaderAddr" v-model="data.value" :options="options" clearable @change="handleAddressFun" />
</template>
<script>
/*
* 选择领导
*/
import { getByParentDeptId } from '@/api/Common'
import { list } from '@/api/SysUserRole'
import { getUserId, getUserName } from '@/utils/auth'
export default {
  name: 'DepartmentLeader',
  props: {
    parentDeptId: {
      type: String,
      default: ''
    },
    parameter: {
      type: [Array, String],
      default: ''
    }
  },
  data() {
    return {
      value: '',
      data: {
        key: '',
        value: ''
      },
      model: '',
      options: []

    }
  },
  watch: {
    parameter() {
      this.data.value = this.parameter
    }
  },
  created() {

  },
  mounted() {
    this.data.value = this.parameter
    if (this.parentDeptId) {
      this.getusrlist(this.parentDeptId)
    } else {
      this.getByParentDeptId()
    }
  },
  methods: {
    changeGetvalue(val) {
      this.$emit('change', val)
    },
    // 获取所有单位合集
    getByParentDeptId() {
      getByParentDeptId().then((res) => {
        res.data.map((item, index) => {
          this.options.push({
            value: '',
            label: item.deptname,
            children: []
          })
          this.list(item, index)
        })
      }).catch(() => {
      })
    },
    async list(item, index) {
      const params = {
        pageNum: 1,
        pageSize: 1000,
        search: {
          departmentId: item.departmentid
        }
      }
      const { code, data } = await list(params)
      if (code === 200) {
        this.options[0].children.push({
          value: getUserId(),
          label: getUserName()
        })
        data.forEach(item => {
          this.options[index].children.push({
            value: item.userId,
            label: item.trueName
          })
        })
      }
    },
    async getusrlist(parentDeptId) {
      const params = {
        pageNum: 1,
        pageSize: 1000,
        search: {
          departmentId: parentDeptId
        }
      }
      const { code, data } = await list(params)
      if (code === 200) {
        data.forEach(item => {
          this.options.push({
            value: item.userId,
            label: item.trueName
          })
        })
      }
    },
    handleAddressFun() {
      // this.data.key = this.$refs['cascaderAddr'].getCheckedNodes()[0].label
      // this.$emit('getLeaderValue', this.data)
      const $cascader = this.$refs.cascaderAddr
      const result = $cascader.getCheckedNodes()
      const ids = result.map(item => item.value)
      const names = result.map(item => item.label)
      this.$emit('getLeaderValue', ids, names)
    }
  }
}
</script>
<style lang="scss" scoped>

</style>

<template>
  <el-select v-model="value" :disabled="disabled" :size="size" clearable :placeholder="placeholder" @change="changeGetvalue">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>
<script>
/*
* 搜索选择单位
*/
import { getUnitList } from '@/api/Common'

export default {
  name: 'CompanyList',
  props: {
    modelValue: {
      type: [String, Array],
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'small'
    },
    placeholder: {
      type: String,
      default: '请选择'
    }
  },
  data() {
    return {
      value: '',
      options: []
    }
  },
  watch: {
    modelValue(obj) {
      this.value = obj
    }
  },
  created() {

  },
  mounted() {
    this.getUnitList()
    this.$emit('input', this.value)
  },
  methods: {
    changeGetvalue(val) {
      this.$emit('change', val)
    },
    // 获取所有单位合集
    getUnitList() {
      getUnitList().then((res) => {
        res.data.map((item) => {
          this.options.push({
            value: item.departmentId,
            label: item.departmentName
          })
        })
      }).catch(() => {
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>

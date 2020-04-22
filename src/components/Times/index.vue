<template>
  <div>
    <el-date-picker
      v-model="model"
      style="width: 100%"
      align="left"
      :type="timesType"
      :value-format="timeValue"
      :format="timeValue"
      :default-value="defaultValue"
      :disabled="disabled"
      :size="size"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :placeholder="placeholder"
      @change="changeGetvalue"
      @blur="blurGetvalue"
    />
  </div>
</template>
<script>
export default {
  name: 'Time',
  props: {
    status: {
      type: [String, Number], // 多个时间选择，标识
      default: ''
    },
    timesType: {
      type: String,
      default: 'date' // date or datetime
    },
    timeValue: {
      type: String,
      default: 'yyyy-MM-dd' // yyyy-MM-dd or  yyyy-MM-dd-HH:mm
    },
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
    defaultValue: {
      // 可选，选择器打开时默认显示的时间
    },
    placeholder: {
      type: String,
      default: '选择日期'
    }
  },
  data() {
    return {
      value2: '',
      model: ''
    }
  },
  watch: {
    modelValue(obj) {
      this.model = obj
    }
  },
  created() {
    this.model = this.modelValue
  },
  mounted() {
    this.$emit('input', this.model)
  },
  methods: {
    changeGetvalue(val) {
      this.$emit('getTimeValue', val, this.status)
    },
    // 失去焦点触发
    blurGetvalue(val) {
      this.$emit('getTimeNode', val, this.status)
    }
  }
}
</script>
<style lang="scss" scoped>

</style>

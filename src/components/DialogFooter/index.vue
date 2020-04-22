<template>
  <div class="dialog_footer_box">
    <span> <el-checkbox v-show="ischecked" v-model="checked">保存并关闭窗口</el-checkbox>  </span>

    <span class="dialog-footer">
      <el-button class="cancel" @click="cancel">{{ cancelbut||"取消" }}</el-button>
      <el-button type="success" class="preserve" @click="handleOk">{{ handleoklbut||"保存" }}</el-button>
    </span>
  </div>
</template>

<script>
export default {
  name: 'DialogFooter',
  props: {
    cancelname: String, // 需要关闭的data参数名（如何存在则点击关闭按钮直接关闭）
    cancelbut: String, // 取消按钮的名称
    handleoklbut: String, // 保存按钮的名字
    ischecked: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      checked: true
    }
  },
  mounted() {
  },
  methods: {
    cancel() {
      if (this.cancelname) {
        this.$parent.$parent.$data[this.cancelname] = false
      }
      this.$emit('handleNo', this.checked)
    },
    handleOk() {
      this.$emit('handleOk', this.checked)
    }
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';

  .dialog_footer_box {
    .el-checkbox__input.is-checked .el-checkbox__inner {
      background-color: $green;
      border-color: $green;
    }

    .el-checkbox__input.is-checked + .el-checkbox__label {
      color: #343434;
    }

    .el-checkbox__inner:hover,
    .el-checkbox__input.is-focus .el-checkbox__inner {
      border-color: $green !important;
    }
  }
</style>

<style lang="scss" scoped>
  @import '~@/styles/variables.scss';

  .preserve {
    background: $green;
    border-color: $green;
  }

  .cancel {
    background: transparent;
    border-color: #909090;
    color: #666;
  }

  .el-button--medium {
    padding: 9px 33px;
    line-height: 1em;
  }

  .el-button--medium:hover {
    opacity: 0.9;
  }

  .el-button--medium:active {
    opacity: 0.8;
  }

  .dialog_footer_box {
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0 30px;
  }

  .el-button--success {
    background-color: $green;
    border-color: $green;
  }

</style>

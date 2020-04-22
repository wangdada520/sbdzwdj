<template>
  <el-upload
    class="avatar-uploader"
    :action="action"
    :data="dataobj"
    :name="namefile"
    :headers="myHeader"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
  >
    <span>{{ text }}</span>
  </el-upload>
</template>

<script>
import { getToken } from '@/utils/auth'
import { baseUrl } from '@/utils/baseurl'
export default {
  name: 'Import',
  props: {
    // 接口地址
    url: {
      type: String,
      default: ''
    },
    dataobj: {
      type: Object,
      default: () => {}
    },
    namefile: {
      type: String,
      default: 'upFile'
    },
    text: {
      type: String,
      default: '导入'
    }
  },
  data() {
    return {
      action: baseUrl + this.url,
      loading: ''
    }
  },
  computed: {
    myHeader() {
      return {
        'token': getToken()
      }
    }
  },
  methods: {
    // 上传成功回调
    handleAvatarSuccess(res, file) {
      this.loading.close()
      if (res.code === 200) {
        if (res.data) {
          const a = document.createElement('a')
          a.href = res.data.httpPath
          a.download = '错误文档.xlsx'
          a.click()
          this.$emit('getlist', true)
          // this.$message.error('导入失败,请查看失败文档')
        } else {
          this.$message.success('导入成功')
          this.$emit('getlist', true)
        }
      }
    },
    beforeAvatarUpload(file) {
      this.loading = this.$loading({
        lock: true,
        text: '正在导入中，可能时间较长，请耐心等待。',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    }
  }
}
</script>

<style scoped>

</style>

<template>
  <el-upload
    class="avatar-uploader"
    :action="action"
    :data="dataObj"
    name="upfile"
    :headers="myHeader"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
  >
    <div v-if="imageUrl" class="avatar"><img :src="imageUrl"></div>
    <i v-else class="el-icon-plus avatar-uploader-icon" />
  </el-upload>
</template>

<script>
import { getToken } from '@/utils/auth'
import { baseUrl } from '@/utils/baseurl'
import { queryFile } from '@/api/files'

export default {
  name: 'UploadPhoto',
  props: {
    operationCode: {
      type: String,
      default: ''
    },
    operationId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dataObj: { operationCode: this.operationCode },
      action: `${baseUrl}/api-file-uploader/file/uploadFile`,
      imageUrl: '',
      base64: ''
    }
  },
  computed: {
    myHeader() {
      return {
        'token': getToken()
      }
    }
  },
  watch: {
    operationId(obj) {
      if (this.operationId && this.operationCode) {
        this.queryFile()
      }
    }
  },
  mounted() {
    if (this.operationId && this.operationCode) {
      this.queryFile()
    }
  },
  methods: {
    // 上传头像
    handleAvatarSuccess(res, file) {
      if (res.code !== 200) {
        this.$message.error(res.msg)
      }
      this.imageUrl = URL.createObjectURL(file.raw)
      this.$emit('getPhoto', res.data, this.base64)
    },
    beforeAvatarUpload(file) {
      const that = this
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = function() {
        // 获取到base64格式图片
        that.base64 = reader.result
      }
      // const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 5

      /* if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }*/
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 5MB!')
      }
      // return isJPG && isLt2M
      return isLt2M
    },
    async queryFile() {
      const params = {
        operationCode: this.operationCode,
        operationId: this.operationId
      }
      const res = await queryFile(params)
      if (res) {
        if (res.data.length > 0) {
          this.$emit('getPhoto', res.data[0].id)
          this.imageUrl = res.data[0].httpPath
        }
      }
    }
  }
}
</script>
<style lang="scss">
  .avatar-uploader{
    .el-upload{
      width: 100%;
    }
  }
</style>
<style lang="scss" scoped>
  .avatar-uploader{
    width: 100%;
    height: 115px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100%;
    height: 115px;
    line-height: 115px;
    text-align: center;
    border: 1px dashed #DCDFE6;
  }
  .avatar {
    width: 100%;
    height: 115px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed #DCDFE6;
    img{
      max-width: 100%;
      max-height: 100%;
    }
  }

</style>

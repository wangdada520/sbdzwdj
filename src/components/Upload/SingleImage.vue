<template>
  <div class="upload-container">
    <el-upload
      :data="dataObj"
      name="upfile"
      :multiple="multiple"
      :show-file-list="true"
      :file-list="fileList"
      :on-success="handleImageSuccess"
      :on-remove="onRemove"
      class="image-uploader"
      :headers="myHeader"
      :limit="limit"
      drag
      :action="action"
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">
        将文件拖到此处，或<em>点击上传</em>{{ tip }}
      </div>
    </el-upload>
    <!-- <div class="image-preview">
        <div  class="image-preview-wrapper">
          <img :src="tempUrl">
          <div class="image-preview-action">
            <i class="el-icon-delete" @click="rmImage" />
          </div>
        </div>
      </div>-->
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { baseUrl } from '@/utils/baseurl'
import { queryFile } from '@/api/files'

export default {
  name: 'SingleImageUpload',
  props: {
    value: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false // 是否支持多选
    },
    operationCode: {
      type: String,
      default: ''
    },
    operationId: {
      type: [String, Number],
      default: ''
    },
    limit: {
      type: Number // 限制个数
    },
    tip: {
      type: String,
      default: '' // 提示文本
    }
  },
  data() {
    return {
      tempUrl: '',
      dataObj: { operationCode: this.operationCode },
      action: `${baseUrl}/api-file-uploader/file/uploadFile`,
      fileList: []
    }
  },
  computed: {
    imageUrl() {
      return this.value
    },
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
    rmImage() {
      this.emitInput('')
    },
    emitInput(val) {
      this.$emit('input', val)
    },
    handleImageSuccess(response, file, fileList) {
      if (response.code !== 200) {
        this.$message.error(response.msg)
      }
      fileList.map((item, index) => {
        if (item.response) {
          if (item.response.code !== 200) {
            fileList.splice(index, 1)
          }
        }
      })
      this.fileList = fileList
      this.getfjlist()
    },
    onRemove(file, fileList) {
      this.fileList = fileList
      this.getfjlist()
    },
    getfjlist() {
      const fjid = []
      let fjidjoin = ''
      this.fileList.map(item => {
        if (item.response) {
          fjid.push(item.response.data)
        }
      })
      fjidjoin = fjid.join(',')
      this.$emit('getfjlist', fjidjoin, this.operationCode)
    },
    async queryFile() {
      const params = {
        operationCode: this.operationCode,
        operationId: this.operationId
      }
      const res = await queryFile(params)
      if (res) {
        this.fileList = []
        if (res.data.length > 0) {
          res.data.map((item) => {
            this.fileList.push({
              status: 'success',
              name: item.sysfilename,
              size: item.filesize,
              uid: item.createtime,
              response: {
                msg: '成功',
                code: 200,
                data: item.id
              }
            })
          })
          this.getfjlist()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin.scss";

  .upload-container {
    width: 100%;
    position: relative;
    @include clearfix;

    .image-uploader {
      width: 100%;
    }

    .image-preview {
      width: 200px;
      height: 200px;
      position: relative;
      border: 1px dashed #d9d9d9;
      float: left;
      margin-left: 50px;

      .image-preview-wrapper {
        position: relative;
        width: 100%;
        height: 100%;

        img {
          width: 100%;
          height: 100%;
        }

      }

      .image-preview-action {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        cursor: default;
        text-align: center;
        color: #fff;
        opacity: 0;
        font-size: 20px;
        background-color: rgba(0, 0, 0, .5);
        transition: opacity .3s;
        cursor: pointer;
        text-align: center;
        line-height: 200px;

        .el-icon-delete {
          font-size: 36px;
        }

      }

      &
      :hover {

        .image-preview-action {
          opacity: 1;
        }

      }
    }
  }

  .el-upload-dragger .el-icon-upload {
    margin: 5px 0 0;
    font-size: 40px;
  }

</style>

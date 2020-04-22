<template>
  <div>
    <template v-if="filesList.length > 0">
      <div class="files_tab">附件</div>
      <div class="files_cont">
        <div v-for="(item,index) in filesList" :key="index" class="files_box">
          <div class="files_box_icon">
            <img :src="item.type" alt="">
          </div>
          <div class="files_box_info">
            <p class="files_box_title">{{ item.name }}</p>
            <div class="files_box_but">
              <span @click="filesClick(item.url)">下载</span>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-if="videoList.length > 0">
      <div class="files_tab">视频</div>
      <div class="files_cont">
        <div v-for="(item,index) in videoList" :key="index" class="files_box">
          <div class="files_box_icon">
            <video :src="item.url" />
          </div>
          <div class="files_box_info">
            <p class="files_box_title">{{ item.name }}</p>
            <div class="files_box_but">
              <span @click="filesClick(item.url)">播放</span>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-if="imgList.length > 0">
      <div class="files_tab">图片</div>
      <div class="files_cont">
        <div v-for="(item,index) in imgList" :key="index" class="files_box">
          <div class="files_box_icon">
            <el-image
              :key="item.id"
              style="width: 70px; height: 70px"
              :src="item.url"
              fit="contain"
              :preview-src-list="fits"
            />
          </div>
          <div class="files_box_info">
            <p class="files_box_title">{{ imgList[index].name }}</p>
            <!--<div v-if="!isRecommend" class="files_box_but">
              <span @click="downloadPic(item.url)">下载</span>
            </div>-->
            <div v-if="isRecommend" v-loading="recommendloading" class="files_box_buttton">
              <span @click="recommend(imgList[index])">推荐到大屏</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>

import { queryFile } from '@/api/files'
import { recommendPic } from '@/api/LogOverview'

export default {
  name: 'FilePreview',
  props: {
    operationCode: {
      type: String,
      default: ''
    },
    operationId: {
      type: String,
      default: ''
    },
    isRecommend: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      filesList: [],
      imgList: [],
      videoList: [],
      fits: [],
      recommendloading: false
    }
  },
  watch: {
    operationId(val) {
      this.queryFile()
    }
  },
  mounted() {
    this.queryFile()
  },
  methods: {
    queryFile() {
      if (!this.operationCode || !this.operationId) {
        return false
      }
      this.filesList = []
      this.imgList = []
      this.fits = []
      const params = {
        operationCode: this.operationCode,
        operationId: this.operationId
      }
      queryFile(params).then(res => {
        if (res.code === 200) {
          this.$emit('filedata', res.data)
          res.data.map((item) => {
            if (item.filetype === 'jpg' || item.filetype === 'jpeg' || item.filetype === 'gif' || item.filetype === 'png') {
              this.imgList.push({
                url: item.httpPath,
                name: item.sysfilename,
                id: item.id
              })
              this.fits.push(item.httpPath)
            } else if (item.filetype === 'mp4') {
              this.videoList.push({
                url: item.httpPath,
                name: item.sysfilename,
                id: item.id
              })
            } else {
              let filetype = 'all'
              switch (item.filetype) {
                case 'doc':
                  filetype = 'doc'
                  break
                case 'docx':
                  filetype = 'doc'
                  break
                case 'zip':
                  filetype = 'zip'
                  break
                case 'xls':
                  filetype = 'xsl'
                  break
                case 'xlsx':
                  filetype = 'xsl'
                  break
                case 'pdf':
                  filetype = 'pdf'
                  break
                case 'mp3':
                  filetype = 'mp3'
                  break
                case 'rar':
                  filetype = 'rar'
                  break
                case 'ppt':
                  filetype = 'ppt'
                  break
              }
              this.filesList.push({
                url: item.httpPath,
                name: item.sysfilename,
                type: require(`../../assets/files/files_${filetype}.png`)
              })
            }
          })
        }
      })
    },
    filesClick(val) {
      window.open(val)
    },
    async recommend(item) {
      let res = ''
      var _this = this
      _this.recommendloading = true
      res = await recommendPic({
        fileId: item.id,
        logId: _this.operationId
      })

      if (res) {
        _this.recommendloading = false
        this.$notify({
          title: '提示',
          message: `推荐成功`,
          type: 'success'
        })
      } else {
        _this.recommendloading = false
        this.$notify({
          title: '提示',
          message: `推荐失败`,
          type: 'success'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~@/styles/index.scss';

  .files_tab {
    height: 32px;
    display: flex;
    align-items: center;
    padding: 0 10px;
    background: #f5f5f5;
    font-size: 14px;
    color: #343434;
    font-weight: bold;
    margin-bottom: 6px;
  }

  .files_cont {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 9px;

    .files_box {
      width: calc(50% - 3px);
      height: 92px;
      margin-bottom: 6px;
      border-radius: 2px;
      border: 1px solid #e0e0e0;
      display: flex;
      align-items: center;
      padding: 0 10px;

      .files_box_icon {
        width: 70px;
        height: 70px;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          max-width: 100%;
          max-height: 100%;
        }

        video{
          width: 100%;
          height: 100%;
        }
      }

      .files_box_info {
        flex: 1;
        padding-left: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .files_box_title {
          margin: 0 0 5px 0;
          font-size: 14px;
          color: #666;
          line-height: 20px;
        }

        .files_box_but {
          display: flex;
          align-items: center;
          span{
            color: $green;
            text-decoration: underline;
            cursor: pointer;
            margin-right: 5px;
          }
        }
        .files_box_buttton{
            display: flex;
          align-items: center;
          span{
            background-color: #4e78dc;
            color: #ffffff;
            padding: 7px 8px;
            cursor: pointer;
          }
        }
      }
    }
  }

</style>

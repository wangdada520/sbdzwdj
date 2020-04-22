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
    <template v-if="imgList.length > 0">
      <div class="files_tab">图片</div>
      <div class="files_cont">
        <div v-for="(item,index) in fits" :key="index" class="files_box">
          <div class="files_box_icon">
            <el-image
              :key="item"
              style="width: 70px; height: 70px"
              :src="item"
              fit="contain"
              :preview-src-list="fits"
            />
          </div>
          <div class="files_box_info">
            <p class="files_box_title">{{ imgList[index].name }}</p>
            <!--<div class="files_box_but">
              <span @click="filesClick(item)">下载</span>
            </div>-->
            <a :href="item" download="">下载</a>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>

import { queryFileid } from '@/api/files'

export default {
  name: 'FilePreview',
  props: {
    id: {}
  },
  data() {
    return {
      filesList: [],
      imgList: [],
      fits: []
    }
  },
  watch: {
    id(val) {
      this.queryFile()
    }
  },
  mounted() {
    // this.queryFile()
  },
  methods: {
    async queryFile() {
      this.filesList = []
      this.imgList = []
      this.fits = []
      const params = {
        id: this.id
      }
      const res = await queryFileid(this.id, params)
      if (res) {
        const item = res.data
        if (item.filetype === 'jpg' || item.filetype === 'jpeg' || item.filetype === 'gif' || item.filetype === 'png') {
          this.imgList.push({
            url: item.httpPath,
            name: item.sysfilename
          })
          this.fits.push(item.httpPath)
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
            type: require(`../../../assets/files/files_${filetype}.png`)
          })
        }
      }
    },
    filesClick(val) {
      window.open(val)
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
      }
    }
  }

</style>

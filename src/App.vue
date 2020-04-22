<template>
  <div id="app">
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
export default {
  name: 'App',
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterAlive: true
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(function() {
        this.isRouterAlive = true
      })
    }
  }
}
</script>
<style>
  .content {
    background-color: #fff;
    padding: 10px;
    height: 100%;
    //box-shadow: 0px 0px 2px 0 rgba(7, 0, 2, .2);
    border-radius: 1px;
    overflow: hidden;
  }

  .form-content {
    padding: 20px;
  }

  .el-select--medium {
    width: 100%;
  }

  /*滚动条样式*/
  ::-webkit-scrollbar { /*滚动条整体样式*/
    width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 6px;
  }

  ::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
    border-radius: 3px;
    -webkit-box-shadow: inset 0 0 5px #dedede;
    background: #dedede;
  }

  ::-webkit-scrollbar-thumb:hover {
    -webkit-box-shadow: inset 0 0 5px #cdcdcd;
    background: #cdcdcd;
  }

  ::-webkit-scrollbar-track { /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px transparent;
    border-radius: 0;
    background: transparent;
  }
   .form-search {
      background-color: #f04141!important;
      color: #fff;
      border: 1px solid #f04141!important;
      margin-bottom: 0;
    }
    body .el-table colgroup.gutter{
    display: table-cell!important;
}
.el-table th.gutter{
   display: table-cell!important;
}
</style>

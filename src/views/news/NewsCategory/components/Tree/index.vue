<template>
  <div style="height: 100%">
    <el-tree
      ref="tree"
      :key="treeKey"
      node-key="id"
      :data="data"
      :props="defaultProps"
      :default-expanded-keys="treeExpandedKeys"
      :expand-on-click-node="false"
      :lazy="true"
      :load="loadTreeNode"
      @node-expand="treeExpand"
      @node-collapse="treeCollapse"
      @node-click="handleNodeClick"
    />
  </div>
</template>
<script>
import { baseUrl } from '@/utils/baseurl'
import { getToken } from '@/utils/auth'
import axios from 'axios'

export default {
  name: 'Tree',
  components: {},
  data() {
    return {
      defaultProps: { // 树相关属性设置
        id: '',
        children: 'childList',
        label: 'name',
        isLeaf: 'leaf'
      },
      data: [],
      activeData: null, // 当前操作数据
      treeExpandedKeys: ['ROOT'], // 记录打开节点的数组
      treeKey: '', // 控制tree渲染的key
      nodeQuery: {
        name: '' // 编辑树节点表单的model
      },
      isFirst: true
    }
  },
  mounted() {

  },
  methods: {
    // 异步树叶子节点懒加载逻辑
    loadTreeNode(node, resolve) {
      const id = node ? node.data.id : ''
      const slef = this
      axios.get(baseUrl + '/api-sys/news/newsCategory/listByNcpid', {
        params: {
          ncpid: id
        },
        headers: {
          'token': getToken()
        }
      }).then(function(response) {
        const result = response.data
        const treeData = result.data
        const data = []
        if (result.msg && node.level === 0) {
          // 如果是第一次加载数据，直接返回数据
          treeData.forEach(item => {
            data.push({
              'name': item.ncname,
              'id': item.ncid,
              'moduleLevel': item.nclevel,
              'leaf': !item.isLevel
            })
          })
          resolve(data)
          if (slef.isFirst) {
            const obj = {}
            data.map(function(e, item) {
              obj['name'] = e.name
              obj['id'] = e.id
              obj['moduleLevel'] = e.moduleLevel
              obj['leaf'] = e.leaf
            })
            slef.defaultGetlistClick(obj)
          }
          slef.isFirst = false
        } else if (result.msg) {
          // 如果非第一次加载数据，将返回数据拼接到操作节点的childList属性中
          treeData.forEach(item => {
            data.push({
              'name': item.ncname,
              'id': item.ncid,
              'moduleLevel': item.nclevel,
              'leaf': !item.isLevel
            })
          })
          node.data.childList = data
          resolve(data)
        } else {
          resolve([])
        }
      })
    },
    handleNodeClick(data) {
      this.$emit('getList', data, true)
    },
    // 默认加载树表格数据
    defaultGetlistClick(data) {
      this.$emit('getList', data, true)
    },
    // 新增节点回调函数
    appendCallback(data) {
      const nodeQuery = this.nodeQuery
      nodeQuery.parentId = data.id === '0' ? '' : data.id
      // 将新节点名称和父节点id传递到后台
      this.renderTree()
    },
    // 当节点打开时，记录下打开节点的id
    treeExpand(data, node, self) {
      this.treeExpandedKeys.push(data.id)
    },
    // 当节点关闭时，移除节点的id
    treeCollapse(data) {
      const index = this.treeExpandedKeys.indexOf(data.id)
      if (index > -1) {
        this.treeExpandedKeys.splice(index, 1)
      }
    },
    // 刷新key值，重新渲染tree
    renderTree() {
      this.treeKey = +new Date()
    }
  }

}

</script>
<style scoped>

</style>

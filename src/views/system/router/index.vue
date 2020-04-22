<template>
  <div class="content">
    <div class="from-serach">
      <div />
      <div>
        <el-button
          size="mini"
          icon="el-icon-plus"
          @click="handleEdit"
        >
          新增根节点
        </el-button>
      </div>
    </div>
    <el-table
      ref="table"
      v-loading="loading"
      :data="treeData"
      style="width: 100%"
      height="100%"
      row-key="moduleId"
      border
      lazy
      :load="load"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column
        prop="moduleTitle"
        label="菜单名称"
      />
      <el-table-column align="left" prop="linkUrl" label="菜单链接" :show-overflow-tooltip="true" />
      <el-table-column align="left" prop="iconFile" label="菜单图标" :show-overflow-tooltip="true" />
      <el-table-column align="left" prop="moduleType" label="菜单name值" :show-overflow-tooltip="true" />
      <el-table-column align="center" width="80" label="操作">
        <template slot-scope="scope">
          <EditDeletOpetion
            :scope="scope"
            :menulist="menulist"
            @handleEdit="handleEdit"
          />
        </template>
      </el-table-column>
    </el-table>
    <!--edit-->
    <Edit ref="chldenEdit" :form="form" :module="Module" :title="title" @handlBtnokClick="getListTree" />
  </div>
</template>
<script>
import { getListTree, deleteSysModule, SysModuledetails } from '@/api/sysModule'
import Edit from './model/edit'

export default {
  name: 'Role',
  components: {
    Edit
  },
  data() {
    return {
      loading: false,
      title: '',
      form: {},
      Module: {},
      menulist: [
        {
          name: '编辑',
          icon: 'el-icon-edit',
          type: 'edg',
          ishow: true
        },
        {
          name: '删除',
          icon: 'el-icon-delete',
          type: 'deldet',
          color: 'red',
          ishow: true
        },
        {
          name: '新增',
          icon: 'el-icon-delete',
          type: 'add',
          ishow: true
        }
      ],
      treeData: [],
      loadNodeMap: new Map()
    }
  },
  created() {
    this.getListTree()
  },
  mounted() {

  },
  methods: {
    load(tree, treeNode, resolve) {
      const moduleId = tree.moduleId
      // 将当前操作报错起来
      this.loadNodeMap.set(moduleId, { tree, treeNode, resolve })
      getListTree(moduleId).then(res => {
        const nodes = res.data.map(v => {
          return { ...v, hasChildren: !v.isLeaf }
        })
        resolve(nodes)
      })
    },
    // 操作
    handleEdit(row, name) {
      switch (name) {
        case 'edg':
          this.title = '编辑'
          this.form = Object.assign({}, row) // copy obj
          this.Module = row
          this.$refs.chldenEdit.centerDialogVisible = true
          break
        case 'deldet':
          this.handleDelete(row)
          break
        case 'add':
          this.title = '新增'
          this.form = {}
          this.Module = row
          this.$refs.chldenEdit.centerDialogVisible = true
          break
        default:
          this.title = '新增'
          this.form = {}
          this.Module.moduleTitle = '根节点'
          this.Module.moduleId = 'ROOT'
          this.$refs.chldenEdit.centerDialogVisible = true
      }
    },
    handleDelete(row) {
      this.loading = true
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.Module = row
        this.deleteSysModule(row, row.moduleId)
      }).catch(() => {
      })
      this.loading = false
    },
    async deleteSysModule(row, id) {
      const data = {
        id: id
      }
      const res = await deleteSysModule(id, data)
      if (res) {
        this.$message('删除成功')
        this.getListTree()
      }
    },
    getListTree() {
      this.loading = true
      getListTree('ROOT').then((res) => {
        if (res.code === 200) {
          res.data.forEach(item => {
            item.hasChildren = !item.isLeaf
          })
          this.treeData = res.data
          // console.log(this.Module.moduleTitle, this.Module.pmoduleId)
          if (this.Module.moduleTitle) {
            if (this.Module.pmoduleId === 'ROOT') {
              const { tree, treeNode, resolve } = this.loadNodeMap.get(this.Module.moduleId)
              this.$set(this.$refs.table.store.states.lazyTreeNodeMap, this.Module.moduleId, [])
              this.load(tree, treeNode, resolve)
            } else {
              const { tree, treeNode, resolve } = this.loadNodeMap.get(this.Module.pmoduleId)
              this.$set(this.$refs.table.store.states.lazyTreeNodeMap, this.Module.pmoduleId, [])
              this.load(tree, treeNode, resolve)
            }
          } else {
            const { tree, treeNode, resolve } = this.loadNodeMap.get('')
            this.$set(this.$refs.table.store.states.lazyTreeNodeMap, '', [])
            this.load(tree, treeNode, resolve)
          }
        }
        this.loading = false
      }).catch((error) => {
        console.log(error)
        this.loading = false
      })
    }
  }
}
</script>

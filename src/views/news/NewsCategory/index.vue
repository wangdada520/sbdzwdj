<template>
  <div class="content">
    <el-row :gutter="20" class="heightmax">

      <el-col :span="3" style="background-color: #efeeee" class="heightmax">
        <div ref="Tree" class="grid-content bg-purple tree-style">
          <Tree ref="childenTree" @getList="getList" />
        </div>
      </el-col>
      <el-col :span="21" style="background-color: #fff;padding-top: 10px;height:calc(100% - 52px)" class="global_table_box">
        <div class="from-serach">
          <div />
          <div>
            <el-button
              v-show="isbuttonshow"
              size="mini"
              icon="el-icon-plus"
              @click="handleEdit"
            >
              新增
            </el-button>
          </div>
        </div>
        <div class="grid-content bg-purple-light global_table_content">
          <el-table
            v-loading="loading"
            :data="rolesData"
            stripe
            border
            style="width: 100%"
            height="100%"
          >
            <el-table-column align="center" width="100" label="操作">
              <template slot-scope="scope">
                <EditDeletOpetion :scope="scope" @handleEdit="handleEdit" @handleDelete="handleDelete" />
              </template>
            </el-table-column>
            <el-table-column align="left" prop="ncname" label="分类名称" :show-overflow-tooltip="true" />
            <el-table-column align="left" prop="ncsort" label="排序值" :show-overflow-tooltip="true" />
            <el-table-column align="center" width="155px" prop="createtimeStr" label="创建时间" :show-overflow-tooltip="true" />
          </el-table>
          <div class="pagination">
            <pagination
              :page-size="pages.pageSize"
              :total="pages.total"
              :page.sync="pagNum"
              @handleCurrentChange="handleCurrentChange"
              @handleSizeChange="handleSizeChange"
            />
          </div>
        </div>
      </el-col>
    </el-row>
    <!--edit-->
    <Edit v-if="hackEdit" ref="chldenEdit" :form="form" :module="Module" :title="title" @handlBtnokClick="refresh" @closed="closed" />
  </div>
</template>

<script>
import { list, deleteNewsCategory, SysModuledetails } from '@/api/NewsCategory'
import Edit from '@/views/news/NewsCategory/model/edit'
import Tree from '@/views/news/NewsCategory/components/Tree'

export default {
  name: 'Role',
  components: {
    Tree,
    Edit
  },
  data() {
    return {
      loading: false,
      hackReset: true,
      pagNum: 1,
      pages: {
        pageNum: 1,
        pageSize: 20,
        total: 0
      },
      rolesData: [],
      search: {},
      centerDialogVisible: false,
      form: {},
      sysModule: {},
      Module: {},
      ParentName: '',
      isbuttonshow: false,
      hackEdit: false
    }
  },

  created() {

  },
  mounted() {
    this.$refs.Tree.style.height = (this.height + 100) + 'px'
  },
  methods: {
    closed() {
      this.hackEdit = false
    },
    // 修改
    handleEdit(row) {
      if (row.ncid || row.ncid === 0) {
        this.title = '编辑'
        this.form = Object.assign({}, row) // copy obj
      } else {
        this.title = '新增'
        this.form = {}
      }
      this.$nextTick(() => {
        this.hackEdit = true
        setTimeout(() => {
          this.$refs.chldenEdit.centerDialogVisible = true
        })
      })
    },
    handleDelete(row) {
      this.loading = true
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteNewsCategory(row.ncid)
      }).catch(() => {
      })
      this.loading = false
    },
    async deleteNewsCategory(id) {
      const data = {
        id: id
      }
      const res = await deleteNewsCategory(id, data)
      if (res) {
        this.$message('删除成功')
        this.refresh()
      }
    },
    handleCurrentChange(val) {
      this.pages.pageNum = val
      this.getList(this.Module)
    },
    handleSizeChange(val) {
      this.pages.pageSize = val
      this.getList(this.Module)
    },
    getList(val, isFirstpage) {
      this.isbuttonshow = true
      this.loading = true
      this.ParentName = val.name
      this.search.ncpid = val.id
      this.Module = val
      if (isFirstpage) {
        this.pagNum = 1
        this.pages.pageNum = 1
      }
      const params = {
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        search: this.search
      }
      list(params).then(res => {
        this.rolesData = res.data
        this.pages.total = res.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    refresh() {
      this.$refs.childenTree.appendCallback(this.Module)
      this.$refs.childenTree.handleNodeClick(this.Module)
    }
  }
}
</script>

<style scoped>
  .content{
    padding: 0;
    padding-right: 15px;
  }
  .tree-style{
    background-color: #fff;
  }
  element.style {
    padding-left: 10px !important;
    padding-right: 10px !important;
    background-color: rgb(239, 238, 238);
  }
</style>

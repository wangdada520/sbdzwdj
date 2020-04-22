<template>
  <div class="content">
    <el-row :gutter="20" class="heightmax">
      <el-col :span="3" style="background-color: #efeeee" class="heightmax">
        <div class="grid-content bg-purple tree-style">
          <Tree ref="childenTree" @getList="getList" />
        </div>
      </el-col>
      <el-col
        :span="21"
        style="background-color: #fff;padding-top: 10px;height:calc(100% - 52px)"
        class="global_table_box"
      >
        <div class="from-serach">
          <div>
            <Serach ref="fromSerach" :options="options" @serach="serach" />
          </div>
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
          <el-table :data="rolesData" border stripe highlight-current-row style="width: 100%" height="100%">
            <el-table-column align="center" width="100" label="操作">
              <template slot-scope="scope">
                <EditDeletOpetion :scope="scope" :menulist="menulist" @handleEdit="handleEdit" />
              </template>
            </el-table-column>
            <el-table-column align="center" type="index" width="50" label="序号" />
            <el-table-column align="left" prop="usecaseId" label="用例编码" :show-overflow-tooltip="true" />
            <el-table-column align="left" prop="usecaseTitle" label="用例标题" :show-overflow-tooltip="true" />
            <el-table-column align="left" prop="mappingUrl" label="api映射路径" :show-overflow-tooltip="true" />
            <el-table-column align="left" prop="usecaseDesc" label="用例描述" :show-overflow-tooltip="true" />
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
    <Edit ref="chldenEdit" :form="form" :title="title" :module="Module" @handlBtnokClick="refresh" />
  </div>
</template>
<script>
import { list, deleteSysModule } from '@/api/sysModuleUseCase'
import Tree from '@/components/Tree'
import Edit from '@/views/system/SysModuleUseCase/model/edit'
import Serach from '@/components/Serach'
import { returnValue } from '@/utils/index'

export default {
  name: 'SysModuleUseCase',
  components: {
    Tree,
    Edit,
    Serach
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
      serachValue: '',
      moduleId: '',
      options: [{
        value: '',
        serachvalue: 'usecaseId',
        label: '请输入用例编码'
      },
      {
        value: '',
        serachvalue: 'usecaseTitle',
        label: '请输入用例标题'
      }
      ],
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
        }],
      title: '',
      centerDialogVisible: false,
      form: {},
      sysModule: {},
      Module: {},
      height: 0,
      isbuttonshow: false
    }
  },
  computed: {
    condition: {
      get() {
        const params = {
          pageNum: this.pages.pageNum,
          pageSize: this.pages.pageSize,
          search: {}
        }
        params['search']['moduleId'] = this.moduleId
        if (returnValue('usecaseId', this.serachValue)) {
          params['search']['usecaseId'] = returnValue('usecaseId', this.serachValue)
        }
        if (returnValue('usecaseTitle', this.serachValue)) {
          params['search']['usecaseTitle'] = returnValue('usecaseTitle', this.serachValue)
        }
        return params
      },
      set(val) {
        this.moduleId = val
      }
    }
  },
  created() {

  },
  mounted() {
  },
  methods: {
    async getList(val, serach) {
      this.isbuttonshow = true
      this.Module = val
      this.condition = val.id
      if (this.title === '新增') {
        this.pagNum = 1
        this.pages.pageNum = 1
      }
      const res = await list(this.moduleId, this.condition)
      if (res) {
        this.rolesData = res.data
        this.pages.total = res.total
      }
    },
    handleAdd() {
      this.hackReset = false
      this.$nextTick(() => {
        this.hackReset = true
        setTimeout(() => {
          this.$refs.chldenAdd.centerDialogVisible = true
        }, 0)
      })
    },
    // 操作
    handleEdit(row, name) {
      switch (name) {
        case 'edg':
          this.title = '编辑'
          this.form = Object.assign({}, row) // copy obj
          this.$refs.chldenEdit.centerDialogVisible = true
          break
        case 'deldet':
          this.handleDelete(row)
          break
        default:
          this.title = '新增'
          this.form = {}
          this.$refs.chldenEdit.centerDialogVisible = true
          return
      }
    },
    // 删除
    handleDelete(row) {
      this.loading = true
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteSysModule(row.usecaseId)
      }).catch(() => {
      })
      this.loading = false
    },
    handleCurrentChange(val) {
      this.pages.pageNum = val
      this.getList(this.Module)
    },
    handleSizeChange(val) {
      this.pages.pageSize = val
      this.getList(this.Module)
    },
    async deleteSysModule(id) {
      const data = {
        id: id
      }
      const res = await deleteSysModule(id, data)
      if (res) {
        this.$message('删除成功')
        this.refresh()
      }
    },
    handleaddOk() {
      this.$refs.chldenAdd.handleOk()
      if (this.$refs.chldenAdd.isfromsubmit) {
        this.centerDialogVisible = false
        this.refresh()
      }
    },
    refresh() {
      this.$refs.childenTree.appendCallback(this.Module)
      this.$refs.childenTree.handleNodeClick(this.Module)
    },
    serach(val) {
      this.serachValue = val
      this.pages.pageNum = 1
      this.getList(this.Module, true)
    }
  }
}
</script>
<style lang="scss" scoped>
  .content {
    padding: 0;
    padding-right: 10px;
  }

  .tree-style {
    background-color: #fff;
  }
</style>

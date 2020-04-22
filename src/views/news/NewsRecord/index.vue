<template>
  <div class="content">
    <div class="global_table_box">
      <div class="from-serach">
        <div>
          <div>
            <div class="serach">
              <div>
                <el-input v-model="nrtitle" size="mini" placeholder="请输入标题" clearable />
              </div>
              <div>
                <el-input v-model="createusername" size="mini" placeholder="请输入创建人" clearable />
              </div>
              <div>
                <el-button size="mini" class="from-serach" @click="serach">搜索</el-button>
              </div>
            </div>
          </div>
        </div>
        <el-button
          size="mini"
          icon="el-icon-plus"
          @click="handleEdit"
        >
          新增
        </el-button>
      </div>
      <el-table
        v-loading="loading"
        :data="rolesData"
        stripe
        border
        highlight-current-row
        style="width: 100%"
        height="100%"
      >
        <el-table-column align="center" width="100" label="操作">
          <template slot-scope="scope">
            <EditDeletOpetion
              :scope="scope"
              @handleEdit="handleEdit"
              @handleDelete="handleDelete"
            />
          </template>
        </el-table-column>
        <el-table-column align="left" prop="nrtitle" label="标题" :show-overflow-tooltip="true" />
        <el-table-column align="left" width="150px" prop="ncname" label="分类名称" :show-overflow-tooltip="true" />
        <el-table-column align="left" width="100px" prop="createusername" label="创建人" :show-overflow-tooltip="true" />
        <el-table-column align="center" width="155px" prop="createtimeStr" label="创建时间" :show-overflow-tooltip="true" />
        <el-table-column align="center" width="120px" label="发布状态" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.nrstatus"
              active-color="#13ce66"
              @change="handClickisuse(scope,scope.row.nrstatus)"
            />
          </template>
        </el-table-column>>
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

    <!--edit-->
    <Edit v-if="hackEdit" ref="chldenEdit" :form="form" :title="title" @handlBtnokClick="getList" @closed="closed" />
  </div>

</template>

<script>
import { nrlist, deleteNews, editNewsRecordStutas } from '@/api/NewsRecord'
import Edit from '@/views/news/NewsRecord/model/edit'

export default {
  name: 'SysDictionaries',
  components: {
    Edit
  },
  data() {
    return {
      pagNum: 1,
      pages: {
        pageNum: 1,
        pageSize: 20,
        total: 0
      },
      form: {},
      rolesData: [],
      hackDetails: false,
      hackEdit: false,
      loading: false,
      Details: {},
      nrtitle: '',
      createusername: '',
      search: {},
      newsCategory: [],
      nrstatus: '',
      title: ''
    }
  },
  created() {
  },
  mounted() {
    this.getList()
  },
  methods: {
    closed() {
      this.hackDetails = false
      this.hackEdit = false
    },
    getList(isFirstpage) {
      this.loading = true
      if (isFirstpage) {
        this.pagNum = 1
        this.pages.pageNum = 1
      }
      const params = {
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        search: this.search
      }
      this.loading = true
      nrlist(params).then((res) => {
        this.loading = false
        this.rolesData = this.dataConversion(res.data)
        this.pages.total = res.total
      }).catch((res) => {
        this.loading = false
      })
    },
    serach() {
      this.search = {}
      if (String(this.nrtitle)) {
        this.search.nrtitle = this.nrtitle
      }
      if (String(this.createusername)) {
        this.search.createusername = this.createusername
      }
      this.getList(true)
    },
    handClickisuse(row, val) {
      this.loading = true
      const nrstatus = val ? 1 : 0
      const params = {
        nrid: row.row.nrid,
        nrstatus: nrstatus
      }
      delete row.row.nrcontent
      editNewsRecordStutas(row.row.nrid, nrstatus, params).then((res) => {
        this.getList()
      }).catch((res) => {
        this.loading = false
      })
    },
    handleCurrentChange(val) {
      this.pages.pageNum = val
      this.getList()
    },
    handleSizeChange(val) {
      this.pages.pageSize = val
      this.getList()
    },
    // 删除
    handleDelete(row) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deletenew(row.nrid)
      }).catch(() => {
      })
    },
    deletenew(id) {
      this.loading = true
      const data = {
        ncid: id
      }
      deleteNews(id, data).then((res) => {
        this.$message('删除成功')
        this.getList()
      }).catch((res) => {
        this.loading = false
      })
    },
    // 修改
    handleEdit(row) {
      if (row.nrid || row.nrid === 0) {
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
    //  状态显示数据转换
    dataConversion(data) {
      for (const i in data) {
        if (data[i].nrstatus === 0) {
          data[i].nrstatus = false
        } else {
          data[i].nrstatus = true
        }
      }
      return data
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

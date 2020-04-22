<template>
  <div class="content">
    <div class="global_table_box">
      <div class="from-serach">
        <div>
          <div class="serach">
            <div>
              <el-input v-model="operationCode" size="mini" placeholder="请输入附件编码" clearable />
            </div>
            <div>
              <el-input v-model="operationName" size="mini" placeholder="请输入附件名称" clearable />
            </div>
            <div>
              <el-button size="mini" class="from-serach" @click="serach">搜索</el-button>
            </div>
          </div>
        </div>
        <div>
          <el-button
            size="mini"
            icon="el-icon-plus"
            @click="handleEdit"
          >
            新增
          </el-button>
        </div>
      </div>
      <el-table
        v-loading="loading"
        :data="rolesData"
        stripe
        border
        style="width: 100%"
        height="100%"
        @row-dblclick="rowdblClick"
      >
        <el-table-column align="center" width="100" label="操作">
          <template slot-scope="scope">
            <EditDeletOpetion
              :scope="scope"
              :menulist="menulist"
              @handleEdit="handleEdit"
            />
          </template>
        </el-table-column>
        <el-table-column align="left" prop="operationcode" label="附件编码" :show-overflow-tooltip="true" />
        <el-table-column align="left" prop="operationname" label="附件名称" :show-overflow-tooltip="true" />
        <el-table-column align="left" prop="limittotalsize" label="文件大小" :show-overflow-tooltip="true" />
        <el-table-column align="left" prop="filetype" label="上传文件类型" :show-overflow-tooltip="true" />
        <el-table-column align="left" prop="savepath" label="保存路径" :show-overflow-tooltip="true" />
        <el-table-column align="left" prop="gentypeStr" label="子文件生成规则" :show-overflow-tooltip="true" />
        <el-table-column align="left" prop="remark" label="备注" :show-overflow-tooltip="true" />
        <el-table-column align="center" prop="createtimeStr" width="155px" label="创建时间" :show-overflow-tooltip="true" />
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

    <!--details-->
    <Details v-if="hackDetails" ref="childenDetails" :details="Details" @closed="closed" />
    <!--edit-->
    <Edit v-if="hackEdit" ref="chldenEdit" :form="form" :title="title" @handlBtnokClick="getList" @closed="closed" />
  </div>

</template>

<script>
import { list, deleteSysAccoperation } from '@/api/SysRegisterFile'
import Details from '@/views/system/SysRegisterFile/model/details'
import Edit from '@/views/system/SysRegisterFile/model/edit'

export default {
  name: 'SysRegisterFile',
  components: {
    Details,
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
      height: 0,
      Details: {},
      search: {},
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
      operationCode: '',
      operationName: '',
      title: ''
    }
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
        operationCode: this.search.operationCode || '',
        operationName: this.search.operationName || ''
      }
      list(params).then((res) => {
        this.loading = false
        this.rolesData = res.data
        this.pages.total = res.total
      }).catch(() => {
        this.loading = false
      })
    },
    serach() {
      this.search = {}
      if (String(this.operationCode)) {
        this.search.operationCode = this.operationCode
      }
      if (String(this.operationName)) {
        this.search.operationName = this.operationName
      }
      this.getList(true)
    },
    handleCurrentChange(val) {
      this.pages.pageNum = val
      this.getList()
    },
    handleSizeChange(val) {
      this.pages.pageSize = val
      this.getList()
    },
    rowdblClick(row) {
      this.Details = Object.assign({}, row) // copy obj
      this.$nextTick(() => {
        this.hackDetails = true
        setTimeout(() => {
          this.$refs.childenDetails.centerDialogVisible = true
        }, 0)
      })
    },
    // 删除
    handleDelete(row) {
      this.loading = true
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this.deleteSysDict(row.operationcode)
      }).catch(() => {
      })
      this.loading = false
    },
    deleteSysDict(id) {
      const data = {
        operationCode: id
      }
      deleteSysAccoperation(id, data).then((res) => {
        this.loading = false
        this.$message('删除成功')
        this.getList()
      }).catch(() => {
        this.loading = false
      })
    },
    // 操作
    handleEdit(row, name) {
      switch (name) {
        case 'edg':
          this.title = '编辑'
          this.form = Object.assign({}, row) // copy obj
          this.$nextTick(() => {
            this.hackEdit = true
            setTimeout(() => {
              this.$refs.chldenEdit.centerDialogVisible = true
            }, 0)
          })
          break
        case 'deldet':
          this.handleDelete(row)
          break
        default:
          this.title = '新增'
          this.form = {}
          this.$nextTick(() => {
            this.hackEdit = true
            setTimeout(() => {
              this.$refs.chldenEdit.centerDialogVisible = true
            }, 0)
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

<template>
  <div ref="content" class="content">
    <div class="global_table_box">
      <div ref="serach" class="from-serach">
        <div />
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
      <div class="global_table_content">
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
          <el-table-column align="center" type="index" width="50" label="序号" />
          <el-table-column align="left" prop="versionCode" label="内部版本号" :show-overflow-tooltip="true" />
          <el-table-column align="left" prop="versionName" label="版本号" :show-overflow-tooltip="true" />
          <el-table-column align="left" prop="typeStr" label="平台" :show-overflow-tooltip="true" />
          <el-table-column align="left" prop="version" label="更新内容" :show-overflow-tooltip="true" />
        </el-table>
      </div>
      <div ref="pagination" class="pagination">
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
import { list, deleteSysVersion } from '@/api/SysAppVersion'
import Details from '@/views/system/SysAppVersion/model/details'
import Edit from '@/views/system/SysAppVersion/model/edit'

export default {
  name: 'SysAppVersion',
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
      Details: {},
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
      options: [
        {
          value: 'operationcode',
          label: '附件编码'
        },
        {
          value: 'operationname',
          label: '附件名称'
        }
      ],
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
        search: {}
      }
      list(params).then((res) => {
        this.loading = false
        this.rolesData = res.data
        this.pages.total = res.total
      }).catch(() => {
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
        this.deleteSysDict(row.id)
      }).catch(() => {
      })
      this.loading = false
    },
    deleteSysDict(id) {
      const data = {
        id: id
      }
      deleteSysVersion(id, data).then((res) => {
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
            })
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
            })
          })
          return
      }
    }
  }
}
</script>

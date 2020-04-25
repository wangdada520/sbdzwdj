<template>
  <div class="content">
    <div class="global_table_box">
      <div class="from-serach">
        <div>
          <div class="serach">
            <div>
              <el-input v-model="mainId" size="mini" placeholder="请输入关联业务主键" clearable />
            </div>
            <div>
              <el-input v-model="mpsSetName" size="mini" placeholder="请输入编码" clearable />
            </div>
            <div>
              <el-button size="mini" class="from-serach" @click="serach">搜索</el-button>
            </div>
          </div>
        </div>
        <div>
          <el-button-group>
            <el-button
              size="mini"
              icon="el-icon-plus"
              @click="handleEdit({},'add')"
            >
              新增
            </el-button>
          </el-button-group>
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
            <EditDeletOpetionNew
              :scope="scope"
              :menulist="[{
                name: '编辑',
                icon: 'el-icon-edit',
                type: 'edit',
                ishow: true
              }, {
                name: '删除',
                icon: 'el-icon-delete',
                type: 'delete',
                color: '#f56c6c',
                ishow: true
              }]"
              @handleEdit="handleEdit"
            />
          </template>
        </el-table-column>
        <el-table-column align="left" prop="mainId" label="关联业务主键" :show-overflow-tooltip="true" />
        <el-table-column align="left" prop="mpsSetName" label="编码" :show-overflow-tooltip="true" />
        <el-table-column align="left" prop="createTime" label="创建时间" :show-overflow-tooltip="true" />
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

    <!--新增/编辑-->
    <Edit v-if="hackEdit" ref="childenEdit" :form="form" :title="title" @handlBtnokClick="getList" @closed="closed" />
    <!--详情-->
    <!--<Details v-if="hackDetails" ref="childenDetails" :taskid="form.taskId" @handlBtnokClick="getList" @closed="closed" />-->
  </div>

</template>

<script>
import { getmessagePushRecordlist, deletemessagePushRecord } from '../../../api/SysPushManagement'
import Edit from './model/edit'
/* import Details from '../../../api/SysPushManagement'*/

export default {
  name: 'SysPushManagement',
  components: {
    Edit
    /* Details*/
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
      hackEdit: false,
      hackDetails: false,
      loading: false,
      height: 0,
      search: {},
      mainId: '', // 关联业务主键
      mpsSetName: '', // 编码
      title: '',
      multipleSelection: []
    }
  },
  mounted() {
    this.serach()
  },
  activated() {
    this.serach()
  },
  methods: {
    closed() {
      this.hackEdit = false
      this.hackDetails = false
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
      getmessagePushRecordlist(params).then((res) => {
        this.loading = false
        if (res.code === 200) {
          this.rolesData = res.data
          this.pages.total = res.total
        }
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * 搜索条件
     * */
    serach() {
      this.search = {}
      if (String(this.mainId)) {
        this.search['mainId'] = this.mainId
      }
      if (String(this.mpsSetName)) {
        this.search['mpsSetName'] = this.mpsSetName
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
    /**
     * 删除
     * */
    handleDelete(id) {
      this.loading = true
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        const data = {
          mprId: id
        }
        deletemessagePushRecord(id, data).then((res) => {
          this.loading = false
          if (res.code === 200) {
            this.$message('删除成功')
            this.getList()
          } else {
            this.$message.error('删除失败')
          }
        }).catch(() => {
          this.loading = false
        })
      }).catch(() => {
      })
      this.loading = false
    },
    /**
     * 按钮操作
     * */
    handleEdit(row, type) {
      this.form = Object.assign({}, row)
      switch (type) {
        case 'add':
          this.title = '新增'
          this.hackEdit = true
          this.$nextTick(() => {
            this.$refs.childenEdit.centerDialogVisible = true
          })
          break
        case 'edit':
          this.title = '编辑'
          this.hackEdit = true
          this.$nextTick(() => {
            this.$refs.childenEdit.centerDialogVisible = true
          })
          break
        case 'delete':
          this.handleDelete(row.mprId)
          break
        default:
          return false
      }
    },
    /**
     * 打开详情
     * */
    rowdblClick(row) {
      this.form = Object.assign({}, row)
      this.$nextTick(() => {
        this.hackDetails = true
        setTimeout(() => {
          this.$refs.childenDetails.centerDialogVisible = true
        }, 0)
      })
    },
    /**
     * 获取年度
     * */
    getTimeValue(val) {
      this.year = val
    }
  }
}
</script>

<style lang="scss" scoped>

</style>


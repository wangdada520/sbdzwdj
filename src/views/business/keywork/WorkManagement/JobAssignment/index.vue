<template>
  <div class="content">
    <div class="global_table_box">
      <div class="from-serach">
        <div>
          <div class="serach">
            <div>
              <el-select
                v-model="status"
                size="mini"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div>
              <el-input v-model="taskName" size="mini" placeholder="请输入工作名称" clearable />
            </div>
            <div>
              <el-input v-model="people0" size="mini" placeholder="请输入责任单位" clearable />
            </div>
            <div>
              <el-button size="mini" class="from-serach" @click="serach">搜索</el-button>
            </div>
          </div>
        </div>
        <div>
          <el-button-group>
            <el-button
              v-if="false"
              size="mini"
              icon="el-icon-thumb"
              @click="handleEdit({},'distribute')"
            >
              派发
            </el-button>
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
        ref="multipleTable"
        v-loading="loading"
        :data="rolesData"
        :row-key="getRowKeys"
        stripe
        border
        style="width: 100%"
        height="100%"
        @row-dblclick="rowdblClick"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          v-if="false"
          align="center"
          type="selection"
          :reserve-selection="true"
          :selectable="selectEnable"
          width="55px"
        />
        <el-table-column align="center" width="100" label="操作">
          <template slot-scope="scope">
            <EditDeletOpetionNew
              :scope="scope"
              :menulist="[{
                name: '派发',
                icon: 'el-icon-thumb',
                type: 'oneDistribute',
                ishow: scope.row.status === 0
              }, {
                name: '编辑',
                icon: 'el-icon-edit',
                type: 'edit',
                ishow: scope.row.status === 0 || scope.row.status === 1
              }, {
                name: '删除',
                icon: 'el-icon-delete',
                type: 'delete',
                color: '#f56c6c',
                ishow: scope.row.status === 0 || scope.row.status === 1
              }]"
              @handleEdit="handleEdit"
            />
          </template>
        </el-table-column>
        <el-table-column align="left" prop="taskName" label="工作名称" :show-overflow-tooltip="true" />
        <el-table-column align="left" prop="taskContent" label="工作目标内容" :show-overflow-tooltip="true" />
        <el-table-column align="left" prop="people2" width="150px" label="分管领导" :show-overflow-tooltip="true" />
        <el-table-column align="left" prop="people0" width="150px" label="责任单位" :show-overflow-tooltip="true" />
        <el-table-column align="center" prop="handTime" width="140px" label="交办时间" :show-overflow-tooltip="true" />
        <el-table-column align="center" prop="statusStr" width="80px" label="状态" :show-overflow-tooltip="true" />
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
    <Details v-if="hackDetails" ref="childenDetails" :taskid="form.taskId" @handlBtnokClick="getList" @closed="closed" />
  </div>

</template>

<script>
import { getMyListtaskRecord, addsendTasktaskRecord, deletetaskRecord } from '@/views/business/api/JobAssignment'
import Edit from '@/views/business/keywork/WorkManagement/JobAssignment/model/edit'
import Details from '../../components/AllDetails'

export default {
  name: 'JobAssignment',
  components: {
    Edit,
    Details
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
      options: [{
        value: '0',
        label: '未派发'
      }, {
        value: '1',
        label: '未签收'
      }, {
        value: '2',
        label: '办理中'
      }, {
        value: '3',
        label: '已办结'
      }, {
        value: '4',
        label: '工作暂停'
      }, {
        value: '5',
        label: '工作停止'
      }],
      status: '', // 任务状态
      taskName: '', // 任务名称
      people0: '', // 责任单位
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
    /**
     * 列表多选框是否禁用
     * */
    selectEnable(row, rowIndex) {
      if (row.status === 0) {
        return true// 不禁用
      } else {
        return false
      }
    },
    getRowKeys(row) {
      return row.taskId
    },
    /**
     * 多选选中数据
     * */
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    getList(isFirstpage) {
      this.loading = true
      if (isFirstpage) {
        this.pagNum = 1
        this.pages.pageNum = 1
      }
      this.search['type'] = '1'
      const params = {
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        search: this.search
      }
      getMyListtaskRecord(params).then((res) => {
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
      if (String(this.status)) {
        this.search['status'] = this.status
      }
      if (String(this.taskName)) {
        this.search['taskName'] = this.taskName
      }
      if (String(this.people0)) {
        this.search['people0'] = this.people0
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
     * 派发
     * */
    addsendTasktaskRecord(taskId) {
      this.$confirm('是否派发当前选择数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          taskId: taskId
        }
        this.loading = true
        addsendTasktaskRecord(params).then(res => {
          this.loading = false
          if (res.code === 200) {
            this.$notify({
              title: '提示',
              message: `派发成功`
            })
            this.$refs.multipleTable.clearSelection() // 清空多选
            this.getList()
          }
        }).catch(() => {
          this.loading = false
        })
      }).catch(() => {

      })
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
          taskId: id
        }
        deletetaskRecord(id, data).then((res) => {
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
        case 'allocation':
          break
        case 'add':
          this.title = '新增'
          this.hackEdit = true
          this.$nextTick(() => {
            this.$refs.childenEdit.centerDialogVisible = true
          })
          break
        case 'distribute':
          if (this.multipleSelection.length <= 0) {
            this.$message('未选择需要派发的数据')
          } else {
            const taskId = this.multipleSelection.map(item => item.taskId).join(',')
            this.addsendTasktaskRecord(taskId)
          }
          break
        case 'oneDistribute':
          this.addsendTasktaskRecord(row.taskId)
          break
        case 'edit':
          this.title = '编辑'
          this.hackEdit = true
          this.$nextTick(() => {
            this.$refs.childenEdit.centerDialogVisible = true
          })
          break
        case 'delete':
          this.handleDelete(row.taskId)
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


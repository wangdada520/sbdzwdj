<template>
  <div class="content">
    <div class="global_table_box">
      <div class="from-serach">
        <div>
          <div class="serach">
            <div>
              <el-select
                v-model="allsearch.dictValueFour"
                size="mini"
                placeholder="请选择工作类别"
                clearable
                @change="changeserach"
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
              <el-select
                v-model="allsearch.proposalCircles"
                size="mini"
                placeholder="请选择届"
                clearable
              >
                <el-option
                  v-for="item in proposalCircleslist"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div>
              <el-select
                v-model="allsearch.proposalSecond"
                size="mini"
                placeholder="请选择次"
                clearable
              >
                <el-option
                  v-for="item in proposalSecondlist"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div>
              <el-input v-model="allsearch.taskName" size="mini" placeholder="请输入案由" clearable />
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
        <el-table-column align="center" prop="year" width="80px" label="预警灯" :show-overflow-tooltip="true" />
        <el-table-column align="left" prop="dictValueFourStr" width="120px" label="工作类别" :show-overflow-tooltip="true" />
        <el-table-column align="left" prop="taskName" width="150px" label="届次" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.proposalCircles }}{{ scope.row.proposalSecond }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" prop="proposalNumber" width="110px" label="字号" :show-overflow-tooltip="true" />
        <el-table-column align="left" prop="taskName" label="案由" :show-overflow-tooltip="true" />
        <el-table-column align="left" prop="petitionPeople" width="100px" label="领衔人" :show-overflow-tooltip="true" />
        <el-table-column align="left" prop="workTypeStr" width="100px" label="办理方式" :show-overflow-tooltip="true" />
        <el-table-column align="left" prop="people0" label="责任单位" :show-overflow-tooltip="true" />
        <el-table-column align="center" prop="endTime" width="100px" label="办结时限" :show-overflow-tooltip="true" />
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
    <!--
    <Details v-if="hackDetails" ref="childenDetails" :form="form" @handlBtnokClick="getList" @closed="closed" />-->
  </div>

</template>

<script>
import { getMyListtaskRecord, addsendTasktaskRecord, deletetaskRecord } from '@/views/business/api/JobAssignment'
import Edit from '@/views/business/proposal/WorkManagement/JobAssignment/model/edit'
import { getByDictCode } from '@/api/Common'
/* import Details from '@/views/Task/Collection/model/details'*/

export default {
  name: 'JobAssignment',
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
      allsearch: {
        dictValueFour: '',
        proposalCircles: '',
        proposalSecond: '',
        taskName: ''
      },
      options: [{
        value: '0',
        label: '建议类'
      }, {
        value: '1',
        label: '提案类'
      }],
      All_jylj: [],
      All_talj: [],
      All_jylc: [],
      All_talc: [],
      title: '',
      multipleSelection: []
    }
  },
  computed: {
    proposalCircleslist() {
      return this.allsearch.dictValueFour === '0' ? this.All_jylj : this.allsearch.dictValueFour === '1' ? this.All_talj : []
    },
    proposalSecondlist() {
      return this.allsearch.dictValueFour === '0' ? this.All_jylc : this.allsearch.dictValueFour === '1' ? this.All_talc : []
    }
  },
  mounted() {
    this.serach()
    this.getByDictCode('jylj', 'All_jylj')
    this.getByDictCode('talj', 'All_talj')
    this.getByDictCode('jylc', 'All_jylc')
    this.getByDictCode('talc', 'All_talc')
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
    changeserach(val) {
      this.allsearch['proposalCircles'] = ''
      this.allsearch['proposalSecond'] = ''
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
      this.search['type'] = '5'
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
      const allsearch = this.allsearch
      if (String(allsearch.dictValueFour)) {
        this.search['dictValueFour'] = allsearch.dictValueFour
      }
      if (String(allsearch.proposalCircles)) {
        this.search['proposalCircles'] = allsearch.proposalCircles
      }
      if (String(allsearch.proposalSecond)) {
        this.search['proposalSecond'] = allsearch.proposalSecond
      }
      if (String(allsearch.taskName)) {
        this.search['taskName'] = allsearch.taskName
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
     * 获取字典
     * */
    getByDictCode(code, obj) {
      const params = {
        dictcode: code
      }
      getByDictCode(params).then(res => {
        if (res.code === 200 && res.data) {
          res.data.map(item => {
            this[obj].push({
              value: item.value,
              label: item.description
            })
          })
        }
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


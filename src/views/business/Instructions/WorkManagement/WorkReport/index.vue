<template>
  <!-- 领导批示件-工作汇报首页 -->
  <div class="content">
    <div class="global_table_box">
      <div class="from-serach">
        <div class="serach">
          <div>
            <el-select v-model="status" size="mini" placeholder="请选择状态" clearable>
              <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div>
            <el-select v-model="beyondType" size="mini" placeholder="请选择预警灯" clearable>
              <el-option
                v-for="item in options2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div>
            <el-select v-model="people3" size="mini" placeholder="请选择批示领导" clearable>
              <el-option
                v-for="item in options3"
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
            <el-button size="mini" class="from-serach" @click="getList">查询</el-button>
          </div>
        </div>
      </div>
      <!-- 表格 -->
      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        border
        style="width: 100%"
        height="100%"
        @row-dblclick="showdetails"
      >
        <el-table-column align="center" width="100" label="操作">
          <template slot-scope="scope">
            <EditDeletOpetionNew :scope="scope" :menulist="menulist" @handleEdit="handleEdit" />
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="beyondTypeStr"
          width="80px"
          label="预警灯"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="left"
          prop="workNumber"
          width="80px"
          label="工作编号"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="left"
          prop="taskName"
          label="工作名称"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="left"
          prop="people3"
          width="150"
          label="批示领导"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="left"
          prop="deptName"
          width="100"
          label="交办单位"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          prop="handTime"
          width="100px"
          label="交办时间"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          prop="endTime"
          width="100px"
          label="办结时限"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          prop="reportEndTime"
          width="100px"
          label="汇报时限"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="left"
          prop="cycleStr"
          width="100px"
          label="督办频次"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          prop="lastTime"
          width="140px"
          label="上次汇报日期"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="left"
          prop="reportStatusStr"
          width="80px"
          label="状态"
          :show-overflow-tooltip="true"
        />
      </el-table>
      <!-- 分页 -->
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
    <!-- 弹出层 -->
    <Details v-if="hackDetails" ref="childenDetails" :form="form" title="工作汇报" @closed="closed" />
  </div>
</template>

<script>
import Details from './model/detalis'
import { getTaskReportList } from '@/views/business/api/WorkReport'
import { getChosedList } from '@/views/business/api/TaskUser'
export default {
  components: {
    Details
  },
  data() {
    return {
      status: '', // 状态
      options1: [
        { label: '全部状态', value: -1 },
        { label: '未汇报', value: 0 },
        { label: '退件重报', value: 1 }
      ],
      beyondType: '', // 预警灯
      options2: [
        { label: '正常', value: 0 },
        { label: '即将到期', value: 1 },
        { label: '已过期', value: 2 }
      ],
      people3: '', // 批示领导
      taskName: '', // 工作名称
      options3: [],
      hackDetails: false,
      loading: false,
      tableData: [], // 表格数据
      pagNum: 1,
      pages: {
        pageNum: 1,
        pageSize: 20,
        total: 0
      },
      search: {
        status: -1,
        type: 0
      },
      form: {},
      menulist: [
        {
          name: '汇报',
          icon: 'el-icon-document',
          type: 'edit',
          ishow: true
        }
      ]
    }
  },
  watch: {
    // 状态
    status(val) {
      if (val === '') {
        delete this.search.status
        this.search = {
          status: -1,
          type: 0
        }
      } else {
        this.search.status = this.status
      }
      this.getList()
    },
    // 预警灯
    beyondType(val) {
      if (val === '') {
        delete this.search.beyondType
        this.search = {
          status: -1,
          type: 0
        }
      } else {
        this.search.beyondType = this.beyondType
      }
      this.getList()
    },
    // 批示领导
    people3(val) {
      if (val === '') {
        delete this.search.people3
        this.search = {
          status: -1,
          type: 0
        }
        this.getList()
      } else {
        this.search.people3 = val
      }
      this.getList()
    },
    // 工作名称
    taskName(val) {
      if (val.trim() === '') {
        delete this.search.taskName
        this.search = {
          status: -1,
          type: 0
        }
        this.getList()
      } else {
        this.search.taskName = val
      }
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.getUser()
  },
  methods: {
    // 获取待汇报列表
    getList() {
      this.loading = true
      const params = {
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        search: this.search
      }
      getTaskReportList(params)
        .then(res => {
          this.loading = false
          const { data, code, total } = res
          if (code === 200) {
            this.tableData = data
            this.pages.total = total
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    getUser() {
      const params = {
        pageNum: 1,
        pageSize: 999,
        type: 0,
        userType: 3
      }
      getChosedList(params).then(res => {
        const { data, code } = res
        if (code === 200) {
          this.options3 = data.map(item => {
            return {
              label: item.rpUserName,
              value: item.rpUserId
            }
          })
        }
      })
    },
    handleEdit(row) {
      this.showdetails(row)
    },
    showdetails(row) {
      this.form = Object.assign({}, row)
      this.$nextTick(() => {
        this.hackDetails = true
        setTimeout(() => {
          this.$refs.childenDetails.dialogVisible = true
        }, 0)
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
    closed() {
      this.hackDetails = false
    }
  }
}
</script>

<style>
</style>

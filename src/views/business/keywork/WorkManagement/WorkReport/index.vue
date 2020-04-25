<template>
  <!-- 重点工作-工作汇报首页 -->
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
        <el-table-column align="left" prop="taskName" label="工作名称" :show-overflow-tooltip="true" />
        <el-table-column
          align="left"
          prop="dutieTarget"
          label="当前节点"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="left"
          prop="deptName"
          width="200"
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
          prop="reportEndTime"
          width="100px"
          label="汇报时限"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          prop="monthWeek"
          width="140px"
          label="汇报周期"
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
          width="100px"
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
export default {
  components: {
    Details
  },
  data() {
    return {
      status: '', // 状态
      options1: [
        { label: '全部状态', value: -1 },
        { label: '待汇报', value: 0 },
        { label: '退件重报', value: 1 }
      ],
      beyondType: '', // 预警灯
      options2: [
        { label: '正常', value: 0 },
        { label: '即将到期', value: 1 },
        { label: '已超期', value: 2 }
      ],
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
        type: 1
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
    status(val) {
      if (val === '') {
        delete this.search.status
        this.search = {
          status: -1,
          type: 1
        }
      } else {
        this.search.status = this.status
      }
      this.getList()
    },
    beyondType(val) {
      if (val === '') {
        delete this.search.beyondType
        this.search = {
          status: -1,
          type: 1
        }
      } else {
        this.search.beyondType = this.beyondType
      }
      this.getList()
    },
    taskName(val) {
      if (val.trim() === '') {
        delete this.search.taskName
        this.search = {
          status: -1,
          type: 1
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

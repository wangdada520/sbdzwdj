<template>
  <!-- 工作汇报首页 -->
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
            <el-select v-model="dictValueFour" size="mini" placeholder="请选择工作类别" clearable>
              <el-option
                v-for="item in options3"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div>
            <el-input v-model="taskName" size="mini" placeholder="请输入案由" clearable />
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
          align="center"
          prop="beyondTypeStr"
          width="80px"
          label="预警灯"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          prop="dictValueFourStr"
          width="80px"
          label="工作类别"
          :show-overflow-tooltip="true"
        />
        <el-table-column align="left" label="届次" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.proposalCircles }}{{ scope.row.proposalSecond }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="proposalNumber"
          width="150"
          label="字号"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="left"
          prop="taskName"
          width="200"
          label="案由"
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
          align="left"
          prop="handTime"
          width="200"
          label="交办时间"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="left"
          prop="endTime"
          width="200"
          label="办结时限"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          prop="lastTime"
          width="200"
          label="上次汇报日期"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          prop="reportStatusStr"
          width="200"
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
import { uniqueArr } from '@/utils/index'
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
        { label: '未汇报', value: 0 },
        { label: '退件重报', value: 1 }
      ],
      beyondType: '', // 预警灯
      options2: [
        { label: '正常', value: 0 },
        { label: '即将到期', value: 1 },
        { label: '已过期', value: 2 }
      ],
      dictValueFour: '', // 工作类别
      options3: [
        {
          value: '0',
          label: '建议类'
        },
        {
          value: '1',
          label: '提案类'
        }
      ],
      taskName: '', // 案由
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
        type: 5
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
      this.search = {
        status: 0,
        type: 5
      }
      if (val === '') {
        delete this.search.status
      } else {
        this.search.status = this.status
      }
      this.getList()
    },
    beyondType(val) {
      this.search = {
        status: 0,
        type: 5
      }
      if (val === '') {
        delete this.search.beyondType
      } else {
        this.search.beyondType = this.beyondType
      }
      this.getList()
    },
    dictValueFour(val) {
      this.search = {
        status: 0,
        type: 5
      }
      if (val === '') {
        delete this.search.dictValueTwo
      } else {
        this.search.dictValueTwo = val
      }
      this.getList()
    },
    taskName(val) {
      this.search = {
        status: 0,
        type: 5
      }
      if (val === '') {
        delete this.search.taskName
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
            // this.options3 = data.map((item, i) => {
            //   // data.forEach((index, j) => {
            //   //   if()
            //   // })
            //   const obj = {
            //     label: item.people3,
            //     value: item.people3
            //   }
            //   return obj
            // })
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

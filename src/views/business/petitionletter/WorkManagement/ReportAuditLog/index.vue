<template>
  <!-- 汇报审核记录首页 -->
  <div class="content">
    <div class="global_table_box">
      <div class="from-serach">
        <div class="serach">
          <div>
            <el-select v-model="status" size="mini" placeholder="请选择状态">
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
            <el-input v-model="input" size="mini" placeholder="请输入办理单位" clearable />
          </div>
          <div>
            <el-button size="mini" class="from-serach" @click="getList">查询</el-button>
          </div>
          <div>
            <el-button size="mini" class="from-serach" @click="cx">高级查询</el-button>
          </div>
        </div>
        <!-- <div>
          <el-button size="mini" @click="handleEdit">导出EXCEL</el-button>
        </div>-->
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
        <el-table-column
          align="center"
          prop="workNumber"
          width="80px"
          label="工作编号"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="left"
          prop="taskName"
          width="150"
          label="工作名称"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="left"
          prop="workMoney"
          width="200"
          label="办理单位"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="left"
          prop="reportEndTime"
          width="200"
          label="汇报时限"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          prop="reportTime"
          width="200"
          label="汇报时间"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          prop="progressStr"
          width="200"
          label="进展状态"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="left"
          prop="content"
          width="200"
          label="推进情况"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          prop="problem"
          width="200"
          label="存在问题"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          prop="plan"
          width="200"
          label="下步计划"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          prop="beginTime"
          width="200"
          label="审核时间"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          prop="beginTime"
          width="200"
          label="是否超期"
          :show-overflow-tooltip="true"
        />
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
    <div>
      <SearchDetalis ref="searchDetails" title="搜索" />
      <!-- 弹出层 -->
      <Details
        v-if="hackDetails"
        ref="childenDetails"
        :form="form"
        title="汇报审核详情"
        @closed="closed"
      />
    </div>
  </div>
</template>

<script>
import SearchDetalis from './model/searchdeatlis'
import Details from './model/detalis'
import { getrecordList } from '@/views/business/api/ReportAuditLog'
export default {
  components: {
    SearchDetalis,
    Details
  },
  data() {
    return {
      status: '', // 状态
      options: [
        { label: '全部状态', value: -2 },
        { label: '待审核', value: 2 },
        { label: '审核通过', value: 3 },
        { label: '审核退回', value: 4 }
      ],
      taskName: '',
      input: '',
      loading: false,
      tableData: [],
      pagNum: 1,
      pages: {
        pageNum: 1,
        pageSize: 20,
        total: 0
      },
      search: {
        status: -1,
        type: 3
      },
      hackDetails: false,
      form: {}
    }
  },
  watch: {
    status(val) {
      if (val === '') {
        delete this.search.status
        this.search = {
          status: -1,
          type: 3
        }
      } else {
        this.search.status = this.status
      }
      this.getList()
    },
    people3(val) {
      if (val === '') {
        delete this.search.people3
        this.search = {
          status: -1,
          type: 3
        }
      } else {
        this.search.people3 = val
      }
      this.getList()
    },
    taskName(val) {
      if (val === '') {
        delete this.search.taskName
        this.search = {
          status: -1,
          type: 3
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
    getList() {
      this.loading = true
      const params = {
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        search: this.search
      }
      getrecordList(params)
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
    cx() {
      this.$refs.searchDetails.dialogVisible = true
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

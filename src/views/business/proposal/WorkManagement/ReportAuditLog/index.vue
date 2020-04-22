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
            <el-select v-model="dictValueFour" size="mini" placeholder="请选择工作类别" clearable>
              <el-option
                v-for="item in options1"
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
            <el-input v-model="reportDeptName" size="mini" placeholder="请输入办理单位" clearable />
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
          prop="dictValueFourStr"
          width="80px"
          label="工作类别"
          :show-overflow-tooltip="true"
        />
        <el-table-column align="left" width="150" label="届次" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.proposalCircles }}{{ scope.row.proposalSecond }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="proposalNumber"
          width="200"
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
          align="center"
          prop="reportDeptName"
          width="200"
          label="办理单位"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          prop="reportEndTime"
          width="200"
          label="汇报时限"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="left"
          prop="reportTime"
          width="200"
          label="汇报时间"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          prop="fileNum"
          width="200"
          label="复函文号"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          prop="fileDate"
          width="200"
          label="复函日期"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          prop="classSignStr"
          width="200"
          label="类别标记"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          prop="content"
          width="200"
          label="简要说明"
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
      dictValueFour: '', // 工作类别
      options1: [
        {
          value: '0',
          label: '建议类'
        },
        {
          value: '1',
          label: '提案类'
        }
      ],
      taskName: '', // 案由名称
      reportDeptName: '', // 办理单位
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
        type: 5
      },
      hackDetails: false,
      form: {}
    }
  },
  watch: {
    status(val) {
      if (val === '') {
        delete this.search.status
      } else {
        this.search.status = this.status
      }
      this.getList()
    },
    people3(val) {
      if (val === '') {
        delete this.search.people3
      } else {
        this.search.people3 = val
      }
      this.getList()
    },
    taskName(val) {
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

<template>
  <!-- 单位推进情况首页 -->
  <div class="content">
    <div class="global_table_box">
      <div class="from-serach">
        <div class="serach">
          <div>
            <el-select v-model="status" size="mini" placeholder="请选择进展状态">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div>
            <Times
              :model-value="reportTime"
              placeholder="选择汇报周期"
              size="mini"
              @getTimeValue="getTimeValue"
            />
          </div>
          <div>
            <el-input v-model="taskName" size="mini" placeholder="请输入工作名称" clearable />
          </div>
          <div>
            <el-input v-model="deptName" size="mini" placeholder="请输入办理单位" clearable />
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
      >
        <el-table-column
          align="left"
          prop="taskName"
          width="150"
          label="工作名称"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="left"
          prop="dutieTarget"
          width="150"
          label="当前节点"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="left"
          prop="deptName"
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
          width="100px"
          label="汇报时间"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="left"
          prop="monthWeek"
          width="200"
          label="汇报周期"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="left"
          prop="progressStr"
          width="100px"
          label="进展状态"
          :show-overflow-tooltip="true"
        />
        <el-table-column align="left" prop="content" label="推进情况" :show-overflow-tooltip="true" />
        <el-table-column
          align="left"
          prop="problem"
          width="200"
          label="存在问题"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="left"
          prop="plan"
          width="200"
          label="下步计划"
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
    </div>
  </div>
</template>

<script>
import SearchDetalis from './model/searchdeatlis'
import { getPogressList } from '@/views/business/api/UnitSituation'
export default {
  components: {
    SearchDetalis
  },
  data() {
    return {
      status: '', // 状态
      options: [
        { label: '全部进展状态', value: 0 },
        { label: '正常推进', value: 1 },
        { label: '进展缓慢', value: 2 },
        { label: '已办结', value: 3 }
      ],
      taskName: '',
      deptName: '', // 办理单位
      reportTime: '', // 汇报时间
      loading: false,
      tableData: [], // 表格数据
      pagNum: 1,
      pages: {
        pageNum: 1,
        pageSize: 20,
        total: 0
      },
      search: {
        type: 1
      }
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
    deptName(val) {
      if (val === '') {
        delete this.search.deptName
        this.getList()
      } else {
        this.search.deptName = val
      }
    },
    taskName(val) {
      if (val === '') {
        delete this.search.taskName
        this.getList()
      } else {
        this.search.taskName = val
      }
    },
    reportTime(val) {
      if (val === '') {
        delete this.search.reportTime
      } else {
        this.search.reportTime = val
      }
      this.getList()
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
      getPogressList(params)
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
    getTimeValue(val) {
      this.reportTime = val
      this.search.reportTime = this.reportTime
      this.getList()
    },
    handleCurrentChange(val) {
      this.pages.pageNum = val
      this.getList()
    },
    handleSizeChange(val) {
      this.pages.pageSize = val
      this.getList()
    }
  }
}
</script>

<style>
</style>

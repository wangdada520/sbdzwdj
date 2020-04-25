<template>
  <!-- 会议纪要-单位推进情况首页 -->
  <div class="content">
    <div class="global_table_box">
      <div class="from-serach">
        <div class="serach">
          <div>
            <el-select v-model="progress" size="mini" placeholder="请选择进展状态" clearable>
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div>
            <el-input v-model="reportAsk" size="mini" placeholder="请输入会议名称" clearable />
          </div>
          <div>
            <el-input v-model="taskName" size="mini" placeholder="请输入工作名称" clearable />
          </div>
          <div>
            <el-input v-model="reportDeptName" size="mini" placeholder="请输入办理单位" clearable />
          </div>
          <div>
            <el-button size="mini" class="from-serach" @click="serachFn">查询</el-button>
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
          prop="dictValueTwoStr"
          width="80px"
          label="会议大类"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="left"
          prop="dictValueThreeStr"
          label="会议小类"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="left"
          prop="reportAsk"
          width="150"
          label="会议名称"
          :show-overflow-tooltip="true"
        />
        <el-table-column align="left" prop="taskName" label="工作名称" :show-overflow-tooltip="true" />
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
          width="100px"
          label="汇报时间"
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
import { getByDictCode } from '@/api/Common'
export default {
  components: {
    SearchDetalis
  },
  data() {
    return {
      progress: '', // 进展认定
      options: [],
      reportAsk: '', // 会议名称
      taskName: '', // 工作名称
      reportDeptName: '', // 办理单位
      loading: false,
      tableData: [], // 表格数据
      pagNum: 1,
      pages: {
        pageNum: 1,
        pageSize: 20,
        total: 0
      },
      search: {
        type: 4
      }
    }
  },
  watch: {
    progress(val) {
      if (val === '') {
        delete this.search.progress
      } else {
        this.search.progress = this.progress
      }
      this.getList()
    },
    taskName(val) {
      if (val === '') {
        delete this.search.taskName
      } else {
        this.search.taskName = val
      }
    },
    reportDeptName(val) {
      this.search = {
        type: 4
      }
      if (val === '') {
        delete this.search.reportDeptName
      } else {
        this.search.reportDeptName = val
      }
    }
  },
  created() {
    this.getByDictCode('progress', 'options')
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
    // 获取字典
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
    cx() {
      this.$refs.searchDetails.dialogVisible = true
    },
    serachFn() {},
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

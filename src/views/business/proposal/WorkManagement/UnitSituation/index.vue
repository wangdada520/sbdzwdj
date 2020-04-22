<template>
  <!-- 建议提案-单位推进情况首页 -->
  <div class="content">
    <div class="global_table_box">
      <div class="from-serach">
        <div class="serach">
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
            <el-select v-model="proposalCircles" size="mini" placeholder="请选择届" clearable>
              <el-option
                v-for="item in options2"
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
          label="建议号"
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
        <el-table-column align="left" prop="content" label="推进情况" :show-overflow-tooltip="true" />
        <el-table-column
          align="center"
          prop="reportTime"
          width="200"
          label="汇报时间"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
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
      proposalCircles: '',
      option2: [], // 届
      taskName: '', // 案由
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
        type: 5
      },
      All_jylj: [],
      All_talj: []
    }
  },
  watch: {
    dictValueFour(val) {
      this.proposalCircles = ''
      this.search = {
        type: 5
      }
      if (val === '') {
        delete this.search.dictValueFour
      } else {
        this.search.dictValueFour = val
      }
      if (val === '0') {
        this.options2 = this.All_jylj
      }
      if (val === '1') {
        this.options2 = this.All_talj
      }
      this.getList()
    },
    proposalCircles(val) {
      this.search = {
        type: 5
      }
      if (val === '') {
        delete this.search.proposalCircles
      } else {
        this.search.proposalCircles = val
      }
      this.getList()
    },
    taskName(val) {
      this.search = {
        type: 5
      }
      if (val === '') {
        delete this.search.taskName
      } else {
        this.search.taskName = val
      }
    },
    reportDeptName(val) {
      this.search = {
        type: 5
      }
      if (val === '') {
        delete this.search.reportDeptName
      } else {
        this.search.reportDeptName = val
      }
    }
  },
  created() {
    this.getList()
    this.getByDictCode('jylj', 'All_jylj')
    this.getByDictCode('talj', 'All_talj')
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

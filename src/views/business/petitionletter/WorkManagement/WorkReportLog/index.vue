<template>
  <!-- 工作汇报记录首页 -->
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
            <el-select v-model="dictValueTwo" size="mini" placeholder="请选择来源" clearable>
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
            <el-date-picker v-model="reportTime" type="date" placeholder="汇报时间" size="mini" />
          </div>
          <div>
            <el-button size="mini" class="from-serach" @click="getList">查询</el-button>
          </div>
          <div>
            <el-button size="mini" class="from-serach" @click="cx">高级查询</el-button>
          </div>
        </div>
        <div>
          <el-button size="mini">导出EXCEL</el-button>
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
          prop="workNumber"
          width="100px"
          label="工作编号"
          :show-overflow-tooltip="true"
        />
        <el-table-column align="left" prop="taskName" label="工作名称" :show-overflow-tooltip="true" />
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
          width="100"
          label="汇报时限"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          prop="reportTime"
          width="100"
          label="汇报时间"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="left"
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
        <el-table-column align="left" prop="problem" label="存在问题" :show-overflow-tooltip="true" />
        <el-table-column
          align="left"
          prop="plan"
          width="200"
          label="下步计划"
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
    <!-- 高级搜索 -->
    <div>
      <SearchDetalis ref="searchDetails" title="搜索" />
      <!-- 弹出层 -->
      <Details
        v-if="hackDetails"
        ref="childenDetails"
        :form="form"
        title="工作汇报详情"
        @closed="closed"
      />
    </div>
  </div>
</template>

<script>
import SearchDetalis from './model/searchdeatlis'
import Details from './model/detalis'
import { getrecordList } from '@/views/business/api/WorkReportLog'
import { getByDictCode } from '@/api/Common'
export default {
  components: {
    SearchDetalis,
    Details
  },
  data() {
    return {
      status: '', // 审核状态
      options1: [
        { label: '全部状态', value: -2 },
        { label: '待审核', value: 2 },
        { label: '审核通过', value: 3 },
        { label: '审核退回', value: 4 }
      ],
      dictValueTwo: '', // 来源
      options2: [],
      taskName: '', // 工作名称
      reportTime: '', // 汇报时间
      hackDetails: false,
      loading: false,
      pagNum: 1,
      pages: {
        pageNum: 1,
        pageSize: 20,
        total: 0
      },
      search: {
        status: -2,
        type: 3
      },
      tableData: [],
      menulist: [
        {
          name: '汇报',
          icon: 'el-icon-document',
          type: 'edit',
          ishow: true
        }
      ],
      form: {}
    }
  },
  watch: {
    status(val) {
      if (val === '') {
        delete this.search.status
        this.search = {
          status: -2,
          type: 3
        }
      } else {
        this.search.status = this.status
      }
      this.getList()
    },
    dictValueTwo(val) {
      if (val === '') {
        delete this.search.dictValueTwo
        this.search = {
          status: -2,
          type: 3
        }
      } else {
        this.search.dictValueTwo = val
      }
      this.getList()
    },
    taskName(val) {
      if (val === '') {
        delete this.search.taskName
        this.search = {
          status: -2,
          type: 3
        }
        this.getList()
      } else {
        this.search.taskName = val
      }
    },
    reportTime(val) {
      if (val === '') {
        delete this.search.reportTime
        this.search = {
          status: -2,
          type: 3
        }
        this.getList()
      } else {
        this.search.reportTime = val
      }
    }
  },
  created() {
    this.getByDictCode('xfly', 'options2')
    this.getList()
  },
  mounted() {
    // this.getUser()
  },
  methods: {
    // 获取汇报记录列表
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
            // this.options2 = data.map(item => {
            //   const obj = {
            //     label: item.people3,
            //     value: item.people3
            //   }
            //   return obj
            // })
            // this.options2 = this.uniqueArr(this.options2)
            this.pages.total = total
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 字典
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
    // 数组去重
    // uniqueArr(arr) {
    //   const obj = {}
    //   arr = arr.reduce((item, next) => {
    //     if (!obj[next.label]) {
    //       item.push(next)
    //       obj[next.label] = true
    //     }
    //     return item
    //   }, [])
    //   return arr
    // },
    cx() {
      this.$refs.searchDetails.dialogVisible = true
    },
    // 双击表格
    showdetails(row) {
      this.form = Object.assign({}, row)
      this.$nextTick(() => {
        this.hackDetails = true
        setTimeout(() => {
          this.$refs.childenDetails.dialogVisible = true
        }, 0)
      })
    },
    handleEdit(row) {
      this.showdetails(row)
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

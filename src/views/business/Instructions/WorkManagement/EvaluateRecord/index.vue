<template>
  <!-- 领导批示件-领导评价记录 -->
  <div class="content">
    <div class="global_table_box">
      <div class="from-serach">
        <div class="serach">
<!--           <div>
            <el-select v-model="status" size="mini" placeholder="请选择状态" clearable>
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div> -->
          <div>
            <el-input v-model="taskName" size="mini" placeholder="按批示领导" clearable />
          </div>
          <div>
            <el-input v-model="taskName" size="mini" placeholder="按工作名称" clearable />
          </div>
          <div>
            <el-input v-model="deptName" size="mini" placeholder="按责任单位" clearable />
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
        <el-table-column
          align="left"
          prop="workNumber"
          width="100px"
          label="工作编号"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="left"
          prop="deptName"
          width="100"
          label="工作名称"
          :show-overflow-tooltip="true"
        />
        <el-table-column
           align="left"
          prop="reportEndTime"
          width="100px"
          label="批示领导"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="left"
          prop="reportTime"
          width="100px"
          label="分管领导"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="left"
          prop="progressStr"
          width="100px"
          label="被评价单位"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          prop="content"
          width="200"
          label="办结时限"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="left"
          prop="content"
          width="200"
          label="评价领导"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          prop="content"
          width="200"
          label="评价时间"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="left"
          prop="content"
          width="200"
          label="评价状态"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="left"
          prop="plan"
          width="200"
          label="评价意见"
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
    <!-- <Details v-if="hackDetails" ref="childenDetails" :form="form" title="汇报审核详情" @closed="closed" /> -->
  </div>
</template>

<script>
// import Details from './model/detalis'
import { getCommentList } from '../../../api/Transaction'
import { getTaskCheckList } from '@/views/business/api/ReportAudit'
export default {
  components: {
    // Details
  },
  data() {
    return {
      status: '', // 状态
      options: [
        { label: '全部状态', value: -2 },
        { label: '待审核', value: 2 },
        { label: '审核通过', value: 3 },
        { label: '审核退回', value: 4 }
      ], // 下拉选项
      taskName: '', // 工作名称
      deptName: '', // 办理单位
      loading: false,
      tableData: [],
      menulist: [
        {
          name: '审核',
          icon: 'el-icon-edit-outline',
          type: 'edit',
          ishow: true
        }
      ],
      form: {},
      pagNum: 1,
      pages: {
        pageNum: 1,
        pageSize: 20,
        total: 0
      },
      search: {},
      hackDetails: false
    }
  },
  watch: {
    status(val) {
      if (val === '') {
        delete this.search.status
        this.search = {
          status: 0,
          type: 0
        }
      } else {
        this.search.status = this.status
      }
      this.getList()
    },
    taskName(val) {
      if (val.trim() === '') {
        delete this.search.taskName
        this.search = {
          status: 0,
          type: 0
        }
        this.getList()
      } else {
        this.search.taskName = val
      }
    },
    deptName(val) {
      if (val.trim() === '') {
        delete this.search.deptName
        this.search = {
          status: 0,
          type: 0
        }
        this.getList()
      } else {
        this.search.deptName = val
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /**
     * 搜索条件
     * */
    serach() {
      this.search = {}
      if (String(this.status)) {
        this.search['status'] = this.status
      }
      if (String(this.taskName)) {
        this.search['taskName'] = this.taskName
      }
      if (String(this.people0)) {
        this.search['people0'] = this.people0
      }
      this.getList(true)
    },
    // 获取评价列表
    getList() {
      this.loading = true
      const params = {
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        type: 1,
        search: this.search
      }
      getCommentList(params)
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
    handleCurrentChange(val) {
      this.pages.pageNum = val
      this.getList()
    },
    handleSizeChange(val) {
      this.pages.pageSize = val
      this.getList()
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
    handleEdit(row) {
      this.showdetails(row)
    },
    closed() {
      this.hackDetails = false
    }
  }
}
</script>

<style>
</style>

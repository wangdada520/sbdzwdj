<template>
  <!-- 信访管理-回访记录首页 -->
  <div class="content">
    <div class="global_table_box">
      <div class="from-serach">
        <div class="serach">
          <div>
            <el-input v-model="vlmVisitor" size="mini" placeholder="请输入回访人" clearable />
          </div>
          <div>
            <el-input v-model="taskName" size="mini" placeholder="请输入工作名称" clearable />
          </div>
          <div>
            <el-input v-model="vlmDeptName" size="mini" placeholder="请输入办理单位" clearable />
          </div>
          <div>
            <el-button size="mini" class="from-serach" @click="getList">查询</el-button>
          </div>
          <div>
            <el-button size="mini" class="from-serach" @click="showdetails">详情</el-button>
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
          align="center"
          prop="workNumber"
          width="80px"
          label="工作编号"
          :show-overflow-tooltip="true"
        />
        <el-table-column align="left" prop="taskName" label="工作名称" :show-overflow-tooltip="true" />
        <el-table-column
          align="left"
          prop="vlmDeptName"
          width="200"
          label="办理单位"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          prop="vlmVisitTime"
          width="200"
          label="回访日期"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          prop="vlmVisitor"
          width="200"
          label="回访人"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="left"
          prop="vlmVisitTypeStr"
          width="200"
          label="回访方式"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          prop="vlmSituationDescription"
          width="200"
          label="情况说明"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          prop="vlmSatisfaction_Degree"
          width="200"
          label="满意度"
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
      <Details v-if="hackDetails" ref="childenDetails" :form="form" title="回访管理" @closed="closed" />
    </div>
  </div>
</template>

<script>
import Details from './model/detalis'
import { getRecordList } from '@/views/business/api/ReviewLog'
export default {
  components: {
    Details
  },
  data() {
    return {
      vlmVisitor: '', // 信访人
      taskName: '', // 工作名称
      vlmDeptName: '', // 办理单位
      loading: false,
      pagNum: 1,
      pages: {
        pageNum: 1,
        pageSize: 20,
        total: 0
      },
      search: {
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
      hackDetails: false,
      form: {}
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
      getRecordList(params)
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

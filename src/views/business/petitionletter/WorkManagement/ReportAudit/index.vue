<template>
  <!-- 汇报审核首页 -->
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
        </div>
        <!-- <div>
          <el-button size="mini" @click="handleEdit">批量通过</el-button>
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
        <el-table-column type="selection" width="55" />
        <el-table-column align="center" width="100" label="操作">
          <template slot-scope="scope">
            <EditDeletOpetionNew :scope="scope" :menulist="menulist" @handleEdit="handleEdit" />
          </template>
        </el-table-column>
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
          prop="workMoney"
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
          align="center"
          prop="reportTime"
          width="200"
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
    <Details v-if="hackDetails" ref="childenDetails" :form="form" title="审核汇报详情" @closed="closed" />
  </div>
</template>

<script>
import Details from './model/detalis'
import { getTaskCheckList } from '@/views/business/api/ReportAudit'
export default {
  components: {
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
      ], // 下拉选项
      taskName: '', // 工作名称
      input: '', // 办理单位
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
      search: {
        status: 0,
        type: 3
      },
      hackDetails: false
    }
  },
  watch: {
    status(val) {
      if (val === '') {
        delete this.search.status
        this.search = {
          status: 0,
          type: 3
        }
      } else {
        this.search.status = this.status
      }
      this.getList()
    },
    taskName(val) {
      if (val === '') {
        delete this.search.taskName
        this.search = {
          status: 0,
          type: 3
        }
        this.getList()
      } else {
        this.search.taskName = val
      }
    },
    people3(val) {
      if (val === '') {
        delete this.search.people3
        this.search = {
          status: 0,
          type: 3
        }
      } else {
        this.search.people3 = val
      }
      this.getList()
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取审核列表
    getList() {
      this.loading = true
      const params = {
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        search: this.search
      }
      getTaskCheckList(params)
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

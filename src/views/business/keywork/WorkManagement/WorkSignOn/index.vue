<template>
  <!-- 重点工作-工作签收首页 -->
  <div class="content">
    <div class="global_table_box">
      <div class="from-serach">
        <div class="serach">
          <div>
            <el-input v-model="taskName" size="mini" placeholder="请输入工作名称" clearable />
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
          align="left"
          prop="taskName"
          label="工作名称"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="left"
          prop="taskContent"
          label="职责及目标内容"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="left"
          prop="people2"
          width="150px"
          label="分管领导"
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
          prop="acceptTypeStr"
          width="150px"
          label="责任类型"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          prop="endTime"
          width="100px"
          label="办结时限"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          prop="handTime"
          width="100px"
          label="交办时间"
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

    <!-- 详情 -->
    <Details v-if="hackDetails" ref="childenDetails" :form="form" title="工作签收" @closed="closed" />
  </div>
</template>

<script>
import Details from './model/detalis'
// api方法
import {
  getPeoplelist,
  getTaskAcceptList
} from '@/views/business/api/WorkSignOn'
export default {
  components: {
    Details
  },
  data() {
    return {
      taskName: '', // 工作名称
      tableData: [], // 表格数据
      hackDetails: false,
      loading: false,
      pagNum: 1,
      pages: {
        pageNum: 1,
        pageSize: 20,
        total: 0
      },
      search: {
        status: 0,
        type: 1
      },
      menulist: [
        {
          name: '签收',
          icon: 'el-icon-edit-outline',
          type: 'edit',
          ishow: true
        },
        {
          name: '打印',
          icon: 'el-icon-printer',
          type: 'day',
          ishow: true
        }
      ]
    }
  },
  watch: {
    taskName(val) {
      if (val === '') {
        delete this.search.taskName
        this.search = {
          status: 0,
          type: 1
        }
        this.getList()
      } else {
        this.search.taskName = val
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    showdetails(row) {
      this.form = Object.assign({}, row)
      this.$nextTick(() => {
        this.hackDetails = true
        setTimeout(() => {
          this.$refs.childenDetails.outerVisible = true
        }, 0)
      })
    },
    // 获取工作签收列表
    getList() {
      this.loading = true
      const params = {
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        search: this.search
      }
      getTaskAcceptList(params)
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
    handleEdit(row, type) {
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

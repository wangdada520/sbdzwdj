<template>
  <!-- 重点工作-工作计划首页列表 -->
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
            <el-input v-model="taskName" size="mini" placeholder="请输入工作名称" clearable />
          </div>
          <div>
            <el-button size="mini" class="from-serach">查询</el-button>
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
      >
        <el-table-column align="center" width="100" label="操作">
          <template slot-scope="scope">
            <EditDeletOpetionNew
              :scope="scope"
              :menulist="[
                {name: '新增',
                 icon: 'el-icon-edit-outline',
                 type: 'add',
                 ishow: scope.row.wpState === 0
                },
                {name: '编辑',
                 icon: 'el-icon-edit',
                 type: 'edit',
                 ishow: scope.row.wpState === 1
                }
              ]"
              @handleEdit="handleEdit"
            />
          </template>
        </el-table-column>
        <el-table-column align="left" prop="taskName" label="工作名称" :show-overflow-tooltip="true" />
        <el-table-column
          align="left"
          prop="dutieTarget"
          width="200px"
          label="职责及目标内容"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="left"
          prop="people2"
          width="200"
          label="分管领导"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="left"
          prop="deptName"
          width="120px"
          label="交办单位"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          prop="endTime"
          width="100px"
          label="完成时限"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          prop="handTime"
          width="140px"
          label="交办时间"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          prop="wpStateStr"
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
    <!-- 弹出层 -->
    <Details
      v-if="hackDetails"
      ref="childenDetails"
      :form="form"
      :title-type="titletype"
      @closed="closed"
    />
  </div>
</template>

<script>
import { getPlanList } from '@/views/business/api/WorkPlan'
import Details from './model/detalis'
export default {
  components: {
    Details
  },
  data() {
    return {
      status: '', // 选择状态
      options1: [
        { label: '全部状态', value: 0 },
        { label: '未制定', value: 1 },
        { label: '已制定', value: 2 }
      ], // 状态数组
      taskName: '', // 工作名称
      loading: false,
      hackDetails: false,
      dialogVisible: false,
      tableData: [],
      isMonth: true, // 是否为月
      pagNum: 1,
      pages: {
        pageNum: 1,
        pageSize: 20,
        total: 0
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
      ],
      form: {},
      search: {
        type: 1
      },
      titletype: ''
    }
  },
  watch: {
    status(val) {
      if (val === '') {
        delete this.search.status
      } else {
        this.search.status = val
      }
      this.getList()
    },
    taskName(val) {
      if (val === '') {
        delete this.search.taskName
      } else {
        this.search.taskName = val
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
      getPlanList(params).then(res => {
        this.loading = false
        const { data, code, total } = res
        if (code === 200) {
          this.tableData = data
          this.pages.total = total
        }
      })
    },
    handleEdit(row, type) {
      this.form = Object.assign({}, row)
      switch (type) {
        case 'add':
          this.titletype = '新增'
          this.hackDetails = true
          this.$nextTick(() => {
            this.$refs.childenDetails.dialogVisible = true
          })
          break
        case 'edit':
          this.hackDetails = true
          this.$nextTick(() => {
            this.$refs.childenDetails.dialogVisible = true
          })
          this.titletype = '编辑'
          break
      }
    },
    showdetails() {},
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

<template>
  <!-- 民意快线-回访管理首页 -->
  <div class="content">
    <div class="global_table_box">
      <div class="from-serach">
        <div class="serach">
          <div>
            <el-select v-model="isState" size="mini" placeholder="请选择回访状态">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div>
            <el-input v-model="vlmVisitor" size="mini" placeholder="请输入信访人" clearable />
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
            <EditDeletOpetionNew
              :scope="scope"
              :menulist="[
                {
                  name: '新增回访',
                  icon: 'el-icon-document',
                  type: 'add',
                  ishow: scope.row.isState === 0 ? true :false
                },
                {
                  name: '编辑回访',
                  icon: 'el-icon-edit',
                  type: 'edit',
                  ishow: scope.row.isState === 1 ? true :false
                }]"
              @handleEdit="handleEdit"
            />
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
          label="信访人及联系电话"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="left"
          prop="vlmDeptName"
          width="200"
          label="办理单位"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          prop="reportTime"
          width="100px"
          label="办理时限"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          prop="progressStr"
          width="200"
          label="进展状态"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="left"
          prop="content"
          width="200"
          label="进展落实情况"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          prop="isStateStr"
          width="100px"
          label="回访状态"
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
      <Details
        v-if="hackDetails"
        ref="childenDetails"
        :form="form"
        :title="title"
        @closed="closed"
      />
    </div>
  </div>
</template>

<script>
import Details from './model/detalis'
import { getTaskList } from '@/views/business/api/ReviewManager'
export default {
  components: {
    Details
  },
  data() {
    return {
      isState: '', // 回访状态
      options: [
        { label: '未回访', value: 0 },
        { label: '已回访', value: 1 }
      ], // 回访状态数组
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
          name: '新增回访',
          icon: 'el-icon-document',
          type: 'add',
          ishow: true
        },
        {
          name: '编辑回访',
          icon: 'el-icon-edit',
          type: 'edit',
          ishow: true
        }
      ],
      title: '',
      hackDetails: false,
      form: {}
    }
  },
  watch: {
    isState(val) {
      if (val === '') {
        delete this.search.isState
      } else {
        this.search.isState = this.isState
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
      getTaskList(params)
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
    handleEdit(row, type) {
      console.log(type)
      // console.log(row)
      switch (type) {
        case 'add':
          this.title = '新增'
          this.showdetails(row)
          break
        case 'edit':
          this.title = '编辑'
          this.showdetails(row)
          break
      }
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

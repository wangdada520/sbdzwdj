<template>
  <!-- 建议提案-代表反馈 -列表-->
  <div class="content">
    <div class="global_table_box">
      <div class="from-serach">
        <div class="serach">
          <div>
            <el-select v-model="rfState" size="mini" placeholder="请选择状态" clearable>
              <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div>
            <el-select v-model="dictValueFour" size="mini" placeholder="请选择工作类别" clearable>
              <el-option
                v-for="item in options2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div>
            <el-select v-model="rfTypeId" size="mini" placeholder="请选择意见类型" clearable>
              <el-option
                v-for="item in options3"
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
            <el-button size="mini" class="from-serach" @click="getList">查询</el-button>
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
      >
        <el-table-column align="center" width="100" label="操作">
          <template slot-scope="scope">
            <EditDeletOpetionNew
              :scope="scope"
              :menulist="[
                {
                  name: '填写反馈',
                  icon: 'el-icon-document',
                  type: 'add',
                  ishow: scope.row.rfState === 0 ? true : false
                },{
                  name: '编辑',
                  icon: 'el-icon-edit',
                  type: 'edit',
                  ishow: true
                }]
              "
              @handleEdit="handleEdit"
            />
          </template>
        </el-table-column>
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
          label="字号"
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
          prop="deptName"
          width="200"
          label="交办单位"
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
          align="left"
          prop="rfBackTime"
          width="200"
          label="代表反馈日期"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          prop="rfTypeId"
          width="200"
          label="意见类型"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          prop="rfContext"
          label="建议意见"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          prop="rfStateStr"
          width="200"
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
      <!-- 弹出层 -->
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
import { getFeedbackList } from '@/views/business/api/feedback'
export default {
  components: {
    Details
  },
  data() {
    return {
      rfState: '', // 反馈状态
      options1: [
        { label: '待反馈', value: 0 },
        { label: '已反馈', value: 1 }
      ],
      dictValueFour: '', // 工作类别
      options2: [
        { value: '0', label: '建议类' },
        { value: '1', label: '提案类' }
      ],
      rfTypeId: '', // 选择意见类型
      options3: [
        { label: '建议类', value: 0 },
        { label: '协议类', value: 1 }
      ],
      taskName: '', // 案由
      hackDetails: false,
      loading: false,
      pagNum: 1,
      pages: {
        pageNum: 1,
        pageSize: 20,
        total: 0
      },
      search: {
        type: 5
      },
      tableData: [],
      menulist: [
        {
          name: '填写沟通',
          icon: 'el-icon-document',
          type: 'add',
          ishow: true
        },
        {
          name: '编辑',
          icon: 'el-icon-edit',
          type: 'edit',
          ishow: true
        }
      ],
      form: {},
      title: ''
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
    people3(val) {
      if (val === '') {
        delete this.search.people3
      } else {
        this.search.people3 = val
      }
      this.getList()
    },
    taskName(val) {
      if (val === '') {
        delete this.search.taskName
        this.getList()
      } else {
        this.search.taskName = val
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取工作沟通列表
    getList() {
      this.loading = true
      const params = {
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        search: this.search
      }
      getFeedbackList(params)
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
    // 双击表格
    // showdetails(row) {
    //   this.form = Object.assign({}, row)
    //   this.$nextTick(() => {
    //     this.hackDetails = true
    //     setTimeout(() => {
    //       this.$refs.childenDetails.dialogVisible = true
    //     }, 0)
    //   })
    // },
    handleEdit(row, type) {
      this.form = Object.assign({}, row)
      switch (type) {
        case 'add':
          this.title = '新增'
          this.$nextTick(() => {
            this.hackDetails = true
            setTimeout(() => {
              this.$refs.childenDetails.dialogVisible = true
            }, 0)
          })
          break
        case 'edit':
          this.title = '编辑'
          this.$nextTick(() => {
            this.hackDetails = true
            setTimeout(() => {
              this.$refs.childenDetails.dialogVisible = true
            }, 0)
          })
          break
      }
      // this.showdetails(row)
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

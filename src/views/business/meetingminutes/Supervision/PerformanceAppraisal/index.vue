<template>
  <!-- 会议纪要-绩效考核-列表 -->
  <div class="content">
    <div class="global_table_box">
      <div class="from-serach">
        <div class="serach">
          <div>
            <el-select v-model="assessType" size="mini" placeholder="请选择考核理由" clearable>
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div>
            <Times
              :model-value="assessTime"
              placeholder="选择考核时间"
              size="mini"
              @getTimeValue="getTimeValue"
            />
          </div>
          <div>
            <el-input v-model="taskName" size="mini" placeholder="请输入工作名称" clearable />
          </div>
          <div>
            <el-input v-model="deptName" size="mini" placeholder="请输入责任单位" clearable />
          </div>
          <div>
            <el-button size="mini" class="from-serach">查询</el-button>
          </div>
        </div>
        <div>
          <el-button size="mini" icon="el-icon-plus" @click="handleEdit({},'add')">新增</el-button>
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
          prop="deptName"
          width="200"
          label="责任单位"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="left"
          prop="assessName"
          width="200"
          label="考核理由"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          prop="score"
          width="200"
          label="考核分值"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          prop="assessTime"
          width="200"
          label="考核时间"
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
    <!--新增/编辑-->
    <Edit
      v-if="hackEdit"
      :id="form.assessId"
      ref="childenEdit"
      :form="form"
      :title="title"
      @handlBtnokClick="getList"
      @closed="closed"
    />
  </div>
</template>

<script>
import Edit from '@/views/business/Instructions/Supervision/PerformanceAppraisal/model/edit'
import {
  getAssessSetlist,
  getAssessRecord,
  deleteList
} from '@/views/business/api/PerformanceAppraisal'

export default {
  components: {
    Edit
  },
  data() {
    return {
      assessType: '', // 考核理由
      options: [],
      assessTime: '', // 考核时间
      taskName: '', // 工作名称
      deptName: '', // 责任单位
      loading: false,
      tableData: [], // 表格数据
      hackEdit: false,
      menulist: [
        {
          name: '编辑',
          icon: 'el-icon-edit',
          type: 'edit',
          ishow: true
        },
        {
          name: '删除',
          icon: 'el-icon-delete',
          type: 'delete',
          ishow: true
        }
      ],
      pagNum: 1,
      pages: {
        pageNum: 1,
        pageSize: 20,
        total: 0
      },
      search: {},
      form: {},
      title: ''
    }
  },
  watch: {
    assessType(val) {
      if (val === '') {
        delete this.search.assessType
      } else {
        this.search.assessType = this.assessType
      }
      this.getList()
    },
    assessTime(val) {
      if (val === '') {
        delete this.search.assessTime
      } else {
        this.search.assessTime = this.assessTime
      }
    },
    taskName(val) {
      if (val === '') {
        delete this.search.taskName
      } else {
        this.search.taskName = this.taskName
      }
    },
    deptName(val) {
      if (val === '') {
        delete this.search.deptName
      } else {
        this.search.deptName = this.deptName
      }
    }
  },
  created() {
    //   获取考核理由
    this.getAssess()
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 获取考核理由
    getAssess() {
      const params = {
        pageNum: 1,
        pageSize: 20,
        search: {}
      }
      getAssessSetlist(params).then(res => {
        console.log(res)
        const { data, code } = res
        if (code === 200) {
          this.options = data.map(item => {
            const obj = {
              label: item.assessName,
              value: item.assessType
            }
            return obj
          })
        }
      })
    },
    // 获取列表
    getList() {
      this.loading = true
      const params = {
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        search: this.search
      }
      getAssessRecord(params)
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
    getTimeValue() {},
    showdetails() {},
    handleEdit(row, type) {
      this.form = Object.assign({}, row)
      switch (type) {
        case 'add':
          this.title = '新增'
          this.hackEdit = true
          this.$nextTick(() => {
            this.$refs.childenEdit.centerDialogVisible = true
          })
          break
        case 'edit':
          this.title = '编辑'
          this.hackEdit = true
          this.$nextTick(() => {
            this.$refs.childenEdit.centerDialogVisible = true
          })
          break
        case 'delete':
          this.handleDelete(row.assessId)
          break
      }
    },
    handleDelete(assessId) {
      this.loading = true
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          const data = {
            assessId: assessId
          }
          deleteList(assessId, data)
            .then(res => {
              this.loading = false
              if (res.code === 200) {
                this.$notify({
                  title: '成功',
                  message: '删除成功',
                  type: 'success'
                })
                this.getList()
              } else {
                this.$notify({
                  title: '失败',
                  message: '删除失败',
                  type: 'error'
                })
              }
            })
            .catch(() => {
              this.loading = false
            })
        })
        .catch(() => {})
      this.loading = false
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
      this.hackEdit = false
    }
  }
}
</script>

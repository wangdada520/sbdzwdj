<template>
  <!-- 民意快线-工作签收首页 -->
  <div class="content">
    <div class="global_table_box">
      <div class="from-serach">
        <div class="serach">
          <div>
            <el-select v-model="dictValueTwo" size="mini" placeholder="请选择来源" clearable>
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
          align="center"
          prop="workNumber"
          width="80px"
          label="工作编号"
          :show-overflow-tooltip="true"
        />
        <el-table-column align="left" prop="taskName" label="标题" :show-overflow-tooltip="true" />
        <el-table-column
          align="left"
          prop="dictValueTwoStr"
          width="150"
          label="记录来源"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="left"
          prop="dictValueOneStr"
          width="200"
          label="问题类别"
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
          prop="endTime"
          width="200"
          label="办结时限"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="center"
          prop="handTime"
          width="200"
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
import { getByDictCode } from '@/api/Common'
export default {
  components: {
    Details
  },
  data() {
    return {
      dictValueTwo: '', // 来源
      options1: [], // 来源
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
        type: 4
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
    dictValueTwo(val) {
      if (val === '') {
        delete this.search.dictValueTwo
        this.search = {
          status: 0,
          type: 4
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
          status: 0,
          type: 4
        }
      } else {
        this.search.taskName = val
      }
    }
  },
  mounted() {
    this.getByDictCode('mykxly', 'options1')
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
            this.options = data.map(item => {
              const obj = {
                label: item.people3,
                value: item.people3
              }
              return obj
            })
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
    // 搜索
    getSearch() {},
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

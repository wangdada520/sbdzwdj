<template>
  <!-- 建议提案-工作签收首页 -->
  <div class="content">
    <div class="global_table_box">
      <div class="from-serach">
        <div class="serach">
          <div>
            <el-select v-model="dictValueFour" size="mini" placeholder="请选择工作类别" clearable>
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div>
            <el-select v-model="proposalCircles" size="mini" placeholder="请选择届" clearable>
              <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div>
            <el-select v-model="proposalSecond" size="mini" placeholder="请选择次" clearable>
              <el-option
                v-for="item in options2"
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
          prop="dictValueFourStr"
          width="80px"
          label="工作类别"
          :show-overflow-tooltip="true"
        />
        <el-table-column align="left" label="届次" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.proposalCircles }}{{ scope.row.proposalSecond }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="proposalNumber"
          width="150"
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
          align="left"
          prop="petitionPeople"
          width="200"
          label="领衔人"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          align="left"
          prop="workTypeStr"
          width="200"
          label="办理方式"
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
      dictValueFour: '', // 工作类别
      options: [
        {
          value: '0',
          label: '建议类'
        },
        {
          value: '1',
          label: '提案类'
        }
      ], // 选择类别
      proposalCircles: '', // 届
      options1: [],
      proposalSecond: '', // 次
      options2: [],
      taskName: '', // 案由
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
        type: 5
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
      All_jylj: [],
      All_talj: [],
      All_jylc: [],
      All_talc: []
    }
  },
  watch: {
    dictValueFour(val) {
      this.proposalCircles = ''
      this.proposalSecond = ''
      if (val === '') {
        delete this.search.dictValueFour
        this.search = {
          status: 0,
          type: 5
        }
      } else {
        this.search.dictValueFour = val
      }
      if (val === '0') {
        this.options1 = this.All_jylj
        this.options2 = this.All_jylc
      }
      if (val === '1') {
        this.options1 = this.All_talj
        this.options2 = this.All_talc
      }
      this.getList()
    },
    proposalCircles(val) {
      if (val === '') {
        delete this.search.proposalCircles
        this.search = {
          status: 0,
          type: 5
        }
      } else {
        this.search.proposalCircles = val
      }
      this.getList()
    },
    proposalSecond(val) {
      if (val === '') {
        delete this.search.proposalSecond
        this.search = {
          status: 0,
          type: 5
        }
      } else {
        this.search.proposalSecond = val
      }
      this.getList()
    },
    taskName(val) {
      if (val === '') {
        delete this.search.taskName
        this.search = {
          status: 0,
          type: 5
        }
      } else {
        this.search.taskName = val
      }
    }
  },
  mounted() {
    this.getList()
    this.getByDictCode('jylj', 'All_jylj')
    this.getByDictCode('talj', 'All_talj')
    this.getByDictCode('jylc', 'All_jylc')
    this.getByDictCode('talc', 'All_talc')
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
    handleEdit(row, type) {
      this.showdetails(row)
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

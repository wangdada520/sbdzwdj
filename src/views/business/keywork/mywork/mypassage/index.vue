<template>
  <div class="content">
    <div class="global_table_box">
      <div class="from-serach">
        <div>
          <div class="serach">
            <div>
              <el-select
                v-model="status"
                size="mini"
                placeholder="请选择"
                clearable
              >
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
              <el-input v-model="people0" size="mini" placeholder="请输入责任单位" clearable />
            </div>
            <div>
              <el-button size="mini" class="from-serach" @click="serach">查询</el-button>
            </div>
          </div>
        </div>
        <div>
          <el-button size="mini" @click="ExportData">导出EXCEL</el-button>
        </div>
      </div>
      <el-table
        v-loading="loading"
        :data="rolesData"
        stripe
        border
        style="width: 100%"
        height="100%"
        @row-dblclick="rowdblClick"
      >
        <el-table-column align="left" prop="taskName" width="200px" label="工作名称" :show-overflow-tooltip="true" />
        <el-table-column align="left" prop="workNumber" width="120px" label="工作目标内容" :show-overflow-tooltip="true" />
        <el-table-column align="left" prop="people3" width="200px" label="批示领导" :show-overflow-tooltip="true" />
        <!-- <el-table-column align="left" prop="people2" width="110px" label="分管领导" :show-overflow-tooltip="true" /> -->
        <el-table-column align="left" prop="people0" label="责任单位" :show-overflow-tooltip="true" />
        <el-table-column align="center" prop="handTime" width="140px" label="交办时间" :show-overflow-tooltip="true" />
        <el-table-column align="center" prop="endTime" width="100px" label="办结时限" :show-overflow-tooltip="true" />
        <!-- <el-table-column align="center" prop="" width="100px" label="汇报时间" :show-overflow-tooltip="true" />
        <el-table-column align="center" prop="" width="100px" label="进展状态" :show-overflow-tooltip="true" />
        <el-table-column align="center" prop="" width="100px" label="推进情况" :show-overflow-tooltip="true" />
        <el-table-column align="center" prop="" width="100px" label="存在问题" :show-overflow-tooltip="true" /> -->
        <el-table-column align="center" prop="statusStr" width="80px" label="状态" :show-overflow-tooltip="true" />
      </el-table>
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
    <!--详情-->
    <Details v-if="hackDetails" ref="childenDetails" :taskid="form.taskId" @handlBtnokClick="getList" @closed="closed" />
  </div>

</template>

<script>
import { Mybranchedpassage } from '@/views/business/api/mywork'
/* import Details from '@/views/Task/Collection/model/details'*/
import Details from '../../components/AllDetails'

export default {
  name: 'Mypassage',
  components: {
    Details
  },
  data() {
    return {
      pagNum: 1,
      pages: {
        pageNum: 1,
        pageSize: 20,
        total: 0
      },
      form: {},
      rolesData: [],
      hackEdit: false,
      hackDetails: false,
      loading: false,
      height: 0,
      search: {},
      options: [{
        value: '0',
        label: '未派发'
      }, {
        value: '1',
        label: '未签收'
      }, {
        value: '2',
        label: '办理中'
      }, {
        value: '3',
        label: '已办结'
      }, {
        value: '4',
        label: '工作暂停'
      }, {
        value: '5',
        label: '工作停止'
      }],
      status: '', // 任务状态
      taskName: '', // 任务名称
      people0: '', // 责任单位
      title: '',
      multipleSelection: []
    }
  },
  mounted() {
    this.serach()
  },
  activated() {
    this.serach()
  },
  methods: {
    closed() {
      this.hackEdit = false
      this.hackDetails = false
    },
    getList(isFirstpage) {
      this.loading = true
      if (isFirstpage) {
        this.pagNum = 1
        this.pages.pageNum = 1
      }
      this.search['type'] = '1'
      this.search['rpUseType'] = '2'
      const params = {
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        // type: '2',
        search: this.search
      }
      Mybranchedpassage(params).then((res) => {
        this.loading = false
        if (res.code === 200) {
          this.rolesData = res.data
          this.pages.total = res.total
        }
      }).catch(() => {
        this.loading = false
      })
    },
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
    handleCurrentChange(val) {
      this.pages.pageNum = val
      this.getList()
    },
    handleSizeChange(val) {
      this.pages.pageSize = val
      this.getList()
    },
    /**
     * 打开详情
     * */
    rowdblClick(row) {
      this.form = Object.assign({}, row)
      this.$nextTick(() => {
        this.hackDetails = true
        setTimeout(() => {
          console.log(this.$refs.childenDetails.centerDialogVisible)
          this.$refs.childenDetails.centerDialogVisible = true
        }, 0)
      })
    },
    /**
     * 获取年度
     * */
    getTimeValue(val) {
      this.year = val
    },
    /**
     * 表格导出
     * */
    ExportData() {
      console.log(111)
      // import('@/vendor/Export2Excel').then(excel => {
      //   const tHeader = ['Id', 'Title', 'Author', 'Readings', 'Date']
      //   const data = [
      //     { 'Id': '1', 'Title': 'a', 'Author': '大大', 'Readings': 'aaaa', 'Date': '2020-04-22' },
      //     { 'Id': '2', 'Title': 'b', 'Author': '大大', 'Readings': 'bbbb', 'Date': '2020-04-23' }
      //   ]
      //   excel.export_json_to_excel({
      //     header: tHeader, // 表头 必填
      //     data, // 具体数据 必填
      //     filename: '大大', // 非必填
      //     autoWidth: true, // 非必填
      //     bookType: 'xlsx' // 非必填
      //   })
      // })
      //   .catch(e => {
      //     console.log(e)
      //   })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>


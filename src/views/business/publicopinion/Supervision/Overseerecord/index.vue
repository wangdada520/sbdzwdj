<template>
  <div class="content">
    <div class="global_table_box">
      <div class="from-serach">
        <div>
          <div class="serach">
            <div>
              <el-select
                v-model="reportStatus"
                size="mini"
                placeholder="请选择预警类别"
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
              <Times size="mini" @getTimeValue="getTimeValue" />
            </div>
            <div>
              <el-input v-model="deptName" size="mini" placeholder="请输入单位名称" clearable />
            </div>
            <div>
              <el-input v-model="taskName" size="mini" placeholder="请输入工作名称" clearable />
            </div>
            <div>
              <el-button size="mini" class="from-serach" @click="serach">搜索</el-button>
            </div>
          </div>
        </div>
        <div />
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
        <el-table-column v-if="false" align="center" width="100" label="操作">
          <template slot-scope="scope">
            <EditDeletOpetionNew
              :scope="scope"
              :menulist="[{
                name: '打印',
                icon: 'el-icon-bell',
                type: 'CuiBan',
                ishow: false
              }]"
              @handleEdit="handleEdit"
            />
          </template>
        </el-table-column>
        <el-table-column align="left" prop="workNumber" width="120px" label="工作编号" :show-overflow-tooltip="true" />
        <el-table-column align="left" prop="taskName" label="工作名称" :show-overflow-tooltip="true" />
        <el-table-column align="left" prop="srDepartmentName" label="办理单位" :show-overflow-tooltip="true" />
        <el-table-column align="left" prop="srWarningType" width="80px" label="预警类别" :show-overflow-tooltip="true" />
        <el-table-column align="center" prop="srAcceptTime" width="100px" label="办结时限" :show-overflow-tooltip="true" />
        <el-table-column align="center" prop="createTime" width="145px" label="督办时间" :show-overflow-tooltip="true" />
        <el-table-column align="center" prop="srUserName" width="80px" label="督办人" :show-overflow-tooltip="true" />
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

    <Details v-if="hackDetails" ref="childenDetails" :form="form" @handlBtnokClick="getList" @closed="closed" />
  </div>

</template>

<script>
import { getsupervisionRecordlist } from '@/views/business/api/Cuibanoverseeing'
import Details from '@/views/business/publicopinion/Supervision/Overseerecord/model/details'

export default {
  name: 'Overseerecord',
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
      state: '',
      rolesData: [],
      hackDetails: false,
      loading: false,
      height: 0,
      search: {},
      options: [{
        value: '-1',
        label: '未签收'
      }, {
        value: '0',
        label: '未汇报'
      }, {
        value: '1',
        label: '退件重报'
      }],
      reportStatus: '', // 预警状态
      deptName: '', // 单位名称
      taskName: '', // 工作名称
      acceptEndTime: '' // 完成时限
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
      this.hackDetails = false
    },
    getList(isFirstpage) {
      this.loading = true
      if (isFirstpage) {
        this.pagNum = 1
        this.pages.pageNum = 1
      }
      this.search['srTypeId'] = '0'
      this.search['srModelType'] = '4'
      const params = {
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        search: this.search
      }
      getsupervisionRecordlist(params).then((res) => {
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
      if (String(this.reportStatus)) {
        this.search['reportStatus'] = this.reportStatus
      }
      if (String(this.deptName)) {
        this.search['deptName'] = this.deptName
      }
      if (String(this.taskName)) {
        this.search['taskName'] = this.taskName
      }
      if (String(this.acceptEndTime)) {
        this.search['acceptEndTime'] = this.acceptEndTime
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
     * 按钮操作
     * */
    handleEdit(row, type) {
      this.form = Object.assign({}, row)
      switch (type) {
        case 'CuiBan':
          this.state = '1'
          this.$nextTick(() => {
            this.$refs.childenCuiBan.centerDialogVisible = true
          })
          break
        default:
          return false
      }
    },
    /**
     * 打开详情
     * */
    rowdblClick(row) {
      this.form = Object.assign({}, row)
      this.$nextTick(() => {
        this.hackDetails = true
        setTimeout(() => {
          this.$refs.childenDetails.centerDialogVisible = true
        }, 0)
      })
    },
    /**
     * 获取年度
     * */
    getTimeValue(val) {
      this['acceptEndTime'] = val || ''
    }
  }
}
</script>

<style lang="scss" scoped>

</style>


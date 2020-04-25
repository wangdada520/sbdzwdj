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
            <div style="width: 230px">
              <Times size="mini" times-type="daterange" @getTimeValue="getTimeValue" />
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
        <div>
          <el-button-group>
            <el-button
              size="mini"
              icon="el-icon-thumb"
              @click="handleEdit({},'AllCuiBan')"
            >
              批量催办
            </el-button>
            <el-button
              size="mini"
              icon="el-icon-plus"
              @click="handleEdit({},'Alloversee')"
            >
              批量督办
            </el-button>
          </el-button-group>
        </div>
      </div>
      <el-table
        ref="multipleTable"
        v-loading="loading"
        :data="rolesData"
        :row-key="getRowKeys"
        stripe
        border
        style="width: 100%"
        height="100%"
        @row-dblclick="rowdblClick"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          align="center"
          type="selection"
          :reserve-selection="true"
          :selectable="selectEnable"
          width="55px"
        />
        <el-table-column align="center" width="100" label="操作">
          <template slot-scope="scope">
            <EditDeletOpetionNew
              :scope="scope"
              :menulist="[{
                name: '催办',
                icon: 'el-icon-bell',
                type: 'CuiBan',
                ishow: true
              }, {
                name: '督办',
                icon: 'el-icon-document-copy',
                type: 'oversee',
                ishow: true
              }]"
              @handleEdit="handleEdit"
            />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="year" width="80px" label="预警灯" :show-overflow-tooltip="true" />
        <el-table-column align="left" prop="workNumber" width="120px" label="工作编号" :show-overflow-tooltip="true" />
        <el-table-column align="left" prop="taskName" label="工作名称" :show-overflow-tooltip="true" />
        <el-table-column align="left" prop="deptName" label="办理单位" :show-overflow-tooltip="true" />
        <el-table-column align="left" prop="reportStatusStr" width="80px" label="预警类别" :show-overflow-tooltip="true" />
        <el-table-column align="center" prop="acceptEndTime" width="100px" label="办结时限" :show-overflow-tooltip="true" />
        <el-table-column align="center" prop="cbCount" width="80px" label="催办次数" :show-overflow-tooltip="true" />
        <el-table-column align="center" prop="dbCount" width="80px" label="督办次数" :show-overflow-tooltip="true" />
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

    <!--催办/督办-->
    <CuiBan v-if="hackCuiBan" ref="childenCuiBan" :state="state" :form="form" @handlBtnokClick="getList" @closed="closed" />
    <!--批量催办/督办-->
    <AllCuiBan v-if="hackAllCuiBan" ref="childenAllCuiBan" :state="state" :form="multipleSelection" @handlBtnokClick="getList" @closed="closed" />
    <!--详情-->
    <Details v-if="hackDetails" ref="childenDetails" :taskid="form.taskId" @handlBtnokClick="getList" @closed="closed" />
  </div>

</template>

<script>
import { getDBList } from '@/views/business/api/Cuibanoverseeing'
import CuiBan from '@/views/business/keywork/Supervision/Cuibanoverseeing/model/CuiBan'
import AllCuiBan from '@/views/business/keywork/Supervision/Cuibanoverseeing/model/AllCuiBan'
import Details from '../../components/AllDetails'

export default {
  name: 'Cuibanoverseeing',
  components: {
    CuiBan,
    AllCuiBan,
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
      hackCuiBan: false,
      hackAllCuiBan: false,
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
      endTimeStart: '', // 完成时限-开始时间
      endTimeEnd: '', // 完成时限-结束时间
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
      this.$refs.multipleTable.clearSelection() // 清空多选
      this.hackCuiBan = false
      this.hackDetails = false
    },
    /**
       * 列表多选框是否禁用
       * */
    selectEnable(row, rowIndex) {
      return true// 不禁用
    },
    getRowKeys(row) {
      return row.acceptId
    },
    /**
       * 多选选中数据
       * */
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    getList(isFirstpage) {
      this.loading = true
      if (isFirstpage) {
        this.pagNum = 1
        this.pages.pageNum = 1
      }
      this.search['type'] = '1'
      const params = {
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        search: this.search
      }
      getDBList(params).then((res) => {
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
      if (String(this.endTimeStart)) {
        this.search['endTimeStart'] = this.endTimeStart
      }
      if (String(this.endTimeEnd)) {
        this.search['endTimeEnd'] = this.endTimeEnd
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
          this.hackCuiBan = true
          this.state = '1'
          this.$nextTick(() => {
            this.$refs.childenCuiBan.centerDialogVisible = true
          })
          break
        case 'oversee':
          this.hackCuiBan = true
          this.state = '0'
          this.$nextTick(() => {
            this.$refs.childenCuiBan.centerDialogVisible = true
          })
          break
        case 'AllCuiBan':
          if (this.multipleSelection.length > 0) {
            this.hackAllCuiBan = true
            this.state = '1'
            this.$nextTick(() => {
              this.$refs.childenAllCuiBan.centerDialogVisible = true
            })
          } else {
            this.$message('未选择需要催办的数据')
          }
          break
        case 'Alloversee':
          if (this.multipleSelection.length > 0) {
            this.hackAllCuiBan = true
            this.state = '0'
            this.$nextTick(() => {
              this.$refs.childenAllCuiBan.centerDialogVisible = true
            })
          } else {
            this.$message('未选择需要督办的数据')
          }
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
      this['endTimeStart'] = val ? val[0] : ''
      this['endTimeEnd'] = val ? val[1] : ''
    }
  }
}
</script>

<style lang="scss" scoped>

</style>


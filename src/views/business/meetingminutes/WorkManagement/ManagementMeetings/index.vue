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
              <el-button size="mini" class="from-serach" @click="serach">搜索</el-button>
            </div>
          </div>
        </div>
        <div>
          <el-button-group>
            <el-button
              v-if="false"
              size="mini"
              icon="el-icon-thumb"
              @click="handleEdit({},'distribute')"
            >
              派发
            </el-button>
            <el-button
              size="mini"
              icon="el-icon-plus"
              @click="handleEdit({},'add')"
            >
              新增
            </el-button>
          </el-button-group>
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
        <el-table-column align="center" width="100" label="操作">
          <template slot-scope="scope">
            <EditDeletOpetionNew
              :scope="scope"
              :menulist="[{
                name: '编辑',
                icon: 'el-icon-edit',
                type: 'edit',
                ishow: true
              }, {
                name: '删除',
                icon: 'el-icon-delete',
                type: 'delete',
                color: '#f56c6c',
                ishow: true
              }]"
              @handleEdit="handleEdit"
            />
          </template>
        </el-table-column>
        <el-table-column align="left" prop="meeting.dictValueOneStr" width="120px" label="会议大类" :show-overflow-tooltip="true" />
        <el-table-column align="left" prop="meeting.dictValueTwoStr" width="120px" label="会议小类" :show-overflow-tooltip="true" />
        <el-table-column align="left" prop="meeting.meetName" label="会议名称" :show-overflow-tooltip="true" />
        <el-table-column align="left" prop="meeting.meetNumber" width="110px" label="发文字号" :show-overflow-tooltip="true" />
        <el-table-column align="left" prop="meeting.people4" label="会议召开人" :show-overflow-tooltip="true" />
        <el-table-column align="center" prop="meeting.beginTime" width="110px" label="会议召开日期" :show-overflow-tooltip="true" />
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

    <!--新增/编辑-->
    <Edit v-if="hackEdit" ref="childenEdit" :form="form" :title="title" @handlBtnokClick="getList" @closed="closed" />
    <!--详情-->
    <Details v-if="hackDetails" ref="childenDetails" :form="form" @handlBtnokClick="getList" @closed="closed" />
  </div>

</template>

<script>
import { gettaskMeetinglist, deletetaskMeeting } from '@/views/business/api/ManagementMeetings'
import Edit from '@/views/business/meetingminutes/WorkManagement/ManagementMeetings/model/edit'
import Details from './model/details'

export default {
  name: 'ManagementMeetings',
  components: {
    Edit,
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
      title: ''
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
      const params = {
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        search: this.search
      }
      gettaskMeetinglist(params).then((res) => {
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
     * 删除
     * */
    handleDelete(id) {
      this.loading = true
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        const data = {
          meetId: id
        }
        deletetaskMeeting(id, data).then((res) => {
          this.loading = false
          if (res.code === 200) {
            this.$message('删除成功')
            this.getList()
          } else {
            this.$message.error('删除失败')
          }
        }).catch(() => {
          this.loading = false
        })
      }).catch(() => {
      })
      this.loading = false
    },
    /**
     * 按钮操作
     * */
    handleEdit(row, type) {
      switch (type) {
        case 'add':
          this.form = {}
          this.title = '新增'
          this.hackEdit = true
          this.$nextTick(() => {
            this.$refs.childenEdit.centerDialogVisible = true
          })
          break
        case 'edit':
          this.form = Object.assign({}, row.meeting)
          this.title = '编辑'
          this.hackEdit = true
          this.$nextTick(() => {
            this.$refs.childenEdit.centerDialogVisible = true
          })
          break
        case 'delete':
          this.handleDelete(row.meeting.meetId)
          break
        default:
          return false
      }
    },
    /**
     * 打开详情
     * */
    rowdblClick(row) {
      this.form = Object.assign({}, row.meeting)
      this.$nextTick(() => {
        this.hackDetails = true
        setTimeout(() => {
          this.$refs.childenDetails.centerDialogVisible = true
        }, 0)
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>


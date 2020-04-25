<template>
  <div class="WorkTrend">
    <DetaTab :title="'签收情况'" />
    <el-table :data="signInList" height="250" border style="width: 100%">
      <el-table-column prop="deptName" label="单位名称" width="180" :show-overflow-tooltip="true" />
      <el-table-column prop="userName" label="签收人" width="180" :show-overflow-tooltip="true" />
      <el-table-column prop="phone" label="签收人电话" :show-overflow-tooltip="true" />
      <el-table-column prop="acceptTime" align="center" label="签收时间" width="180" :show-overflow-tooltip="true" />
      <el-table-column prop="statusStr" label="签收状态" :show-overflow-tooltip="true" />
    </el-table>
    <DetaTab :title="'扣分记录'" />
    <el-table :data="deductList" height="250" border style="width: 100%">
      <el-table-column prop="deptName" label="单位名称" width="180" :show-overflow-tooltip="true" />
      <el-table-column prop="assessTime" align="center" label="扣分时间" width="200" :show-overflow-tooltip="true" />
      <el-table-column prop="assessName" label="扣分类型" :show-overflow-tooltip="true" />
      <el-table-column prop="score" label="扣分分值" :show-overflow-tooltip="true" />
    </el-table>
    <DetaTab :title="'催办记录'" />
    <el-table :data="cuiBanList" height="250" border style="width: 100%">
      <el-table-column prop="srDepartmentName" label="单位名称" width="180" :show-overflow-tooltip="true" />
      <el-table-column prop="srWarningType" label="预警类别" width="180" :show-overflow-tooltip="true" />
      <el-table-column prop="srAcceptTime" align="center" label="办理时限" :show-overflow-tooltip="true" />
      <el-table-column prop="createTime" align="center" label="催办时间" :show-overflow-tooltip="true" />
      <el-table-column prop="srUserName" label="催办人" :show-overflow-tooltip="true" />
    </el-table>
    <DetaTab :title="'督办记录'" />
    <el-table :data="dubanList" height="250" border style="width: 100%">
      <el-table-column prop="srDepartmentName" label="单位名称" width="180" :show-overflow-tooltip="true" />
      <el-table-column prop="srWarningType" label="预警类别" width="180" :show-overflow-tooltip="true" />
      <el-table-column prop="srAcceptTime" align="center" label="办理时限" :show-overflow-tooltip="true" />
      <el-table-column prop="createTime" align="center" label="督办时间" :show-overflow-tooltip="true" />
      <el-table-column prop="srUserName" label="督办人" :show-overflow-tooltip="true" />
    </el-table>
    <DetaTab :title="'领导浏览记录'" />
    <el-table :data="browse" height="250" border style="width: 100%">
      <el-table-column prop="date" label="浏览领导" width="180" :show-overflow-tooltip="true" />
      <el-table-column prop="name" align="center" label="浏览时间" :show-overflow-tooltip="true" />
    </el-table>
    <DetaTab :title="'领导关注记录'" />
    <el-table :data="FocusonRecordList" height="250" border style="width: 100%">
      <el-table-column prop="leaderName" label="关注领导" :show-overflow-tooltip="true" />
      <el-table-column prop="attentionTime" align="center" label="关注时间" :show-overflow-tooltip="true" />
    </el-table>
  </div>
</template>

<script>
import { WorkTrend, getListByTaskId, getAcceptByTaskId, FocusonRecordList, selTaskRecord, getTaskFocusRecord } from '../../../api/WorkTrend'
export default {
  name: 'WorkTrend',
  props: ['taskid'],
  data() {
    return {
      tableData: [],
      details: {},
      deductList: [], // 扣分
      signInList: [], // 签收情况
      dubanList: [], // 督办
      cuiBanList: [], // 催办
      FocusonRecordList: [], // 领导关注
      browse: [] // 浏览记录

    }
  },
  mounted() {
    this.getWorkTrend()
    this.getListByTask()
    this.getAcceptByTask()
    this.FocusonRecord()
    this.getTaskFocusRecordList()
    this.selTaskRecordList()
  },
  methods: {
    // 督办记录
    getWorkTrend() {
      const params = {
        srTaskId: this.taskid
      }
      WorkTrend(params).then(res => {
        if (res.code === 200) {
          this.dubanList = res.data.dubanList
          this.cuiBanList = res.data.cuiBanList
        }
      }).catch(() => {})
    },
    // 工作动态扣分记录
    getListByTask() {
      const params = {
        taskId: this.taskid
      }
      getListByTaskId(params).then(res => {
        if (res.code === 200) {
          this.deductList = res.data
        }
      }).catch(() => {})
    },
    // 工作签收记录
    getAcceptByTask() {
      const params = {
        taskId: this.taskid
      }
      getAcceptByTaskId(params).then(res => {
        if (res.code === 200) {
          this.signInList = res.data
        }
      }).catch(() => {})
    },
    // 工作签收记录
    FocusonRecord() {
      const params = {
        taskId: this.taskid
      }
      FocusonRecordList(params).then(res => {
        if (res.code === 200) {
          this.FocusonRecordList = res.data
        }
      }).catch(() => {})
    },
    // 获取领导关注记录
    getTaskFocusRecordList() {
      const params = {
        taskId: this.taskid
      }
      getTaskFocusRecord(params).then(res => {
        if (res.code === 200) {
          this.FocusonRecordList = res.data
        }
      })
    },
    // 获取领导浏览记录
    selTaskRecordList() {
      const params = {
        taskId: this.taskid
      }
      selTaskRecord(params).then(res => {
        if (res.code === 200) {
          this.browse = res.data
        }
      })
    }
  }

}
</script>

<style lang="scss" scoped>
.WorkTrend{

}
</style>

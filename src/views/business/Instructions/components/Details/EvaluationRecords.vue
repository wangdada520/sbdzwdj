<template>
  <div class="EvaluationRecords">
    <DetaTab :title="'工作总评价'" />
    <el-table :data="signInList" height="250" border style="width: 100%">
      <el-table-column prop="deptName" label="评价领导" width="180" :show-overflow-tooltip="true" />
      <el-table-column prop="userName" label="评价时间" width="180" :show-overflow-tooltip="true" />
      <el-table-column prop="phone" label="评价状态" :show-overflow-tooltip="true" />
      <el-table-column prop="acceptTime" align="center" label="评价意见" width="180" :show-overflow-tooltip="true" />
    </el-table>
    <DetaTab :title="'工作汇报评价'" />
    <el-table :data="deductList" height="250" border style="width: 100%">
      <el-table-column prop="deptName" label="单位名称" width="100" :show-overflow-tooltip="true" />
      <el-table-column prop="assessTime" align="center" label="进展状态" width="100" :show-overflow-tooltip="true" />
      <el-table-column prop="assessName" label="汇报时间" :show-overflow-tooltip="true" />
      <el-table-column prop="score" label="评价领导" width="80" :show-overflow-tooltip="true" />
      <el-table-column prop="score" label="评价时间" :show-overflow-tooltip="true" />
      <el-table-column prop="score" label="评价状态" :show-overflow-tooltip="true" />
      <el-table-column prop="score" label="评价意见" :show-overflow-tooltip="true" />
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'EvaluationRecords',
  props: ['taskid'],
  data() {
    return {
      deductList: [], // 扣分
      signInList: [] // 签收情况
    }
  }
}
</script>

<style scoped>

</style>

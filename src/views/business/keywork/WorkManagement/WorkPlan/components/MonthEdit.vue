<template>
  <!-- 新增月计划 -->
  <div>
    <el-table ref="tableref" :data="tableData" stripe border style="width: 100%" height="100%">
      <el-table-column
        align="center"
        prop="wpMonth"
        width="100"
        :label="year"
        :show-overflow-tooltip="true"
      />
      <el-table-column align="left" label="计划内容" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.wpMonthPlanContent"
            type="textarea"
            placeholder="请输入计划内容"
            maxlength="300"
            show-word-limit
            resize="none"
            :autosize="{ minRows: 4}"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    year: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tableData: []
    }
  },
  created() {
    this.initTableData()
  },
  mounted() {
    console.log(this.year)
  },
  methods: {
    initTableData() {
      for (let i = 1; i < 13; i++) {
        this.tableData.push({ wpMonth: i, wpMonthPlanContent: '' })
      }
    }
  }
}
</script>

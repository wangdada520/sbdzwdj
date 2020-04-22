<template>
  <!-- 新增周计划 -->
  <div>
    <el-table ref="tableref" :data="tableData" stripe border style="width: 100%" height="100%">
      <el-table-column
        align="center"
        prop="wpMonth"
        width="100"
        label="月份/周"
        :show-overflow-tooltip="true"
      />
      <el-table-column align="center" label="第一周" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.wpWeekContentOne"
            type="textarea"
            placeholder="请输入"
            maxlength="300"
            show-word-limit
            resize="none"
            :autosize="{ minRows: 4}"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="第二周" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.wpWeekContentTwo"
            type="textarea"
            placeholder="请输入"
            maxlength="300"
            show-word-limit
            resize="none"
            :autosize="{ minRows: 4}"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="第三周" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.wpWeekContentThree"
            type="textarea"
            placeholder="请输入"
            maxlength="300"
            show-word-limit
            resize="none"
            :autosize="{ minRows: 4}"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="第四周" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.wpWeekContentFour"
            type="textarea"
            placeholder="请输入"
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
        const str = `${this.year}${i}月`
        this.tableData.push({ wpMonth: str, wpWeekContentOne: '', wpWeekContentTwo: '', wpWeekContentThree: '', wpWeekContentFour: '' })
      }
    }
  }
}
</script>

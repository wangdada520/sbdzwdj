<template>
  <!-- 新增周计划 -->
  <div>
    <el-table ref="tableref" :data="tableData" stripe border style="width: 100%">
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
import { getworkPlan } from '@/views/business/api/WorkPlan'
export default {
  props: {
    year: {
      type: String,
      default: ''
    },
    form: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      tableData: []
    }
  },
  created() {
    if (this.form.wpId === '') {
      this.initTableData()
    } else {
      this.getPlan()
    }
  },
  methods: {
    // 获取计划
    getPlan() {
      console.log(111)

      this.tableData = []
      getworkPlan(this.form.taskId).then(res => {
        const { data, code } = res
        if (code === 200) {
          this.tableData = data.planExpendList.map(item => {
            return {
              wpMonth: `${this.year}${item.wpMonth}月`,
              wpWeekContentOne: item.wpWeekContentOne,
              wpWeekContentTwo: item.wpWeekContentTwo,
              wpWeekContentThree: item.wpWeekContentThree,
              wpWeekContentFour: item.wpWeekContentFour
            }
          })
        }
      })
    },
    initTableData() {
      console.log(222)

      this.tableData = []
      for (let i = 1; i < 13; i++) {
        this.tableData.push({
          wpMonth: `${this.year}${i}月`,
          wpWeekContentOne: '',
          wpWeekContentTwo: '',
          wpWeekContentThree: '',
          wpWeekContentFour: ''
        })
      }
    }
  }
}
</script>

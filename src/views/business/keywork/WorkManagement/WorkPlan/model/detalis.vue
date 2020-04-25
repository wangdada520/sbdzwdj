<template>
  <div id="diog">
    <el-dialog
      custom-class="widthdia"
      style="boder:5px solid red "
      :title="title"
      width="60%"
      :visible.sync="dialogVisible"
      append-to-body
      :close-on-click-modal="false"
      @closed="closed"
    >
      <div @click="log1">
        <DetaTab title="这是工作名称" />
      </div>
      <HeadTable :id="form.taskId" @sendType="sendType" />
      <div>
        <MonthnEdit v-if="isMonthEdit" ref="MonthnEdit" :year="year" :form="form" />
        <WeekEdit v-if="isWeekEdit" ref="WeekEdit" :year="year" :form="form" />
        <template v-if="isShowBtn">
          <div class="btns">
            <el-button @click="showtable">提交表格</el-button>
          </div>
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addworkPlan, putworkPlan } from '@/views/business/api/WorkPlan'
import MonthnEdit from '../components/MonthEdit'
import WeekEdit from '../components/WeekEdit'
import HeadTable from '.././components/HeadTable'
export default {
  components: {
    HeadTable,
    MonthnEdit,
    WeekEdit
  },
  props: {
    titleType: {
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
      title: '',
      loading: false,
      dialogVisible: false,
      year: '',
      tableData: [],
      addform: {},
      isMonthEdit: false,
      isWeekEdit: false,
      isShowBtn: true
    }
  },
  created() {
    this.addform.wpMainId = this.form.taskId
    if (this.form.isDetalis) {
      this.title = '工作计划详情'
      this.isShowBtn = false
    } else {
      if (this.titleType === '新增') {
        this.title = '新增工作计划'
      } else {
        this.addform.wpId = this.form.wpId
        this.title = '编辑工作计划'
      }
    }
  },
  methods: {
    showtable() {
      switch (this.addform.wpTypeId) {
        case 1:
          this.$refs.WeekEdit.$refs.tableref.data.forEach(item => {
            item.wpMonth = item.wpMonth
              .slice(5)
              .replace('月', '')
              .trim()
          })
          this.addform.planExpendList = this.$refs.WeekEdit.$refs.tableref.data
          if (this.titleType === '新增') {
            addworkPlan(this.addform).then(res => {
              const { code } = res
              if (code === 200) {
                this.dialogVisible = false
                this.$parent.getList()
                this.$notify({
                  title: '成功',
                  message: '新增周计划成功',
                  type: 'success'
                })
              }
            })
          } else {
            putworkPlan(this.addform.wpMainId, this.addform).then(res => {
              const { code } = res
              if (code === 200) {
                this.dialogVisible = false
                this.$parent.getList()
                this.$notify({
                  title: '成功',
                  message: '编辑周计划成功',
                  type: 'success'
                })
              }
            })
          }

          break
        case 3:
          this.addform.planExpendList = this.$refs.MonthnEdit.$refs.tableref.data
          if (this.titleType === '新增') {
            addworkPlan(this.addform).then(res => {
              const { code } = res
              if (code === 200) {
                this.dialogVisible = false
                this.$parent.getList()
                this.$notify({
                  title: '成功',
                  message: '新增月计划成功',
                  type: 'success'
                })
              }
            })
          } else {
            putworkPlan(this.addform.wpMainId, this.addform).then(res => {
              const { code } = res
              if (code === 200) {
                this.dialogVisible = false
                this.$parent.getList()
                this.$notify({
                  title: '成功',
                  message: '编辑月计划成功',
                  type: 'success'
                })
              }
            })
          }
          break
      }
    },
    sendType(val, year) {
      this.year = `${year}年`
      this.addform.wpYear = year
      this.addform.wpTypeId = val
      // 1代表周、3代表月
      if (val === 1) {
        this.isWeekEdit = true
        this.isMonthEdit = false
      }
      if (val === 3) {
        this.isMonthEdit = true
        this.isWeekEdit = false
      }
    },
    log1() {},
    closed() {
      this.$emit('closed')
    }
  }
}
</script>

<style>
.widthdia {
  height: 800px;
  top: 50% !important;
  left: 50%;
  transform: translate(-50%, -400px);
  margin: 0 !important;
}
.btns {
  text-align: center;
  padding: 10px;
}
</style>

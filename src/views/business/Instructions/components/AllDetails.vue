<template>
  <div>
    <el-dialog
      class="dialog_tab"
      :visible.sync="centerDialogVisible"
      append-to-body
      :close-on-click-modal="false"
      title="详情"
      @closed="closed"
    >
      <div class="starbox">
        <div v-if="!star" class="starbox_off" @click="addinsertMyConcern()">
          <i class="el-icon-star-off" />
          <span>{{ starStr }}</span>
        </div>
        <div v-if="star" class="starbox_on" @click="deletemyConcern()">
          <i class="el-icon-star-on" />
          <span>{{ starStr }}</span>
        </div>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="first">
          <JobInformation :taskid="taskid" />
        </el-tab-pane>
        <el-tab-pane label="工作动态" name="second">
          <WorkTrend :taskid="taskid" />
        </el-tab-pane>
        <el-tab-pane label="办理情况" name="third">
          <Management :taskid="taskid"/>
        </el-tab-pane>
        <el-tab-pane label="在线批示" name="fourth">
          <OnlineInstruction />
        </el-tab-pane>
        <el-tab-pane label="督查报告" name="report">
          5
        </el-tab-pane>
        <el-tab-pane label="流程可视化" name="flow">
          <Visualization />
        </el-tab-pane>
        <el-tab-pane label="评价记录" name="evaluate">
          <EvaluationRecords :taskid="taskid"/>
        </el-tab-pane>
        <el-tab-pane label="变更记录" name="alteration">
          <ChangeRecord />
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <div class="evaluate">
    </div>
  </div>
</template>

<script>
import JobInformation from './Details/JobInformation'
import WorkTrend from './Details/WorkTrend'
import Management from './Details/Management'
import OnlineInstruction from './Details/OnlineInstruction'
import Visualization from './Details/Visualization'
import EvaluationRecords from './Details/EvaluationRecords'
import ChangeRecord from './Details/ChangeRecord'
import { addinsertMyConcern, deletemyConcern, getMyConcern } from '../../api/Common'
export default {
  name: 'AllDetails',
  components: {
    JobInformation,
    WorkTrend,
    Management,
    OnlineInstruction,
    Visualization,
    EvaluationRecords,
    ChangeRecord
  },
  props: {
    taskid: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      centerDialogVisible: false,
      activeName: 'first',
      visible: false,
      star: false
    }
  },
  computed: {
    starStr() {
      return this.star ? '已关注' : '关注'
    }
  },
  mounted() {
    this.getMyConcern()
  },
  methods: {
    /**
     * 取消关注
     * */
    deletemyConcern() {
      const params = {
        concernId: this.taskid
      }
      deletemyConcern(this.taskid, params).then(res => {
        if (res.code === 200) {
          this.star = false
          this.$message('取消关注成功')
        }
      })
    },
    /**
     * 关注
     * */
    addinsertMyConcern() {
      const params = {
        grade: '1',
        taskId: this.taskid
      }
      addinsertMyConcern(params).then(res => {
        if (res.code === 200) {
          this.star = true
          this.$message('关注成功')
        }
      })
    },
    /**
     * 判断是否关注
     * */
    getMyConcern() {
      const params = {
        taskId: this.taskid
      }
      getMyConcern(params).then(res => {
        if (res.code === 200) {
          this.star = !!res.data.grade
        }
      })
    },
    /**
     * 关闭动画结束后触发
     * */
    closed() {
      this.$emit('closed')
    },
    /**
     * 详情
     * */
    handleClick(tab, event) {
      // console.log(tab, event)
    }
  }
}
</script>

<style lang="scss" scoped>
  .starbox{
    width: 100%;
    padding-top: 10px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 40px;
    >div{
      display: flex;
      align-items: center;
      cursor: pointer;
      span{
        margin-left: 5px;
      }
    }
    .starbox_on{
      color: #F56C6C;
      i{
        font-size: 30px;
      }
    }
    .starbox_off{
      color: #409EFF;
      i{
        font-size: 24px;
      }
    }
  }
  .evaluate{
    .el-dialog{
      height: 200pxy;
    }
  }
</style>

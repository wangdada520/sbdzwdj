<template>
  <div class="Management">
    <el-table :data="TransactionList" height="250" border style="width: 100%">
      <el-table-column prop="deptName" label="汇报单位" width="180" />
      <el-table-column prop="reportTimeStr" label="汇报日期" width="180" />
      <el-table-column prop="progressStr" label="进展状态" />
      <el-table-column prop="percent" label="完成进度" />
      <el-table-column prop="content" label="推进情况" />
      <el-table-column prop="address" label="领导评价">
        <template slot-scope="scope">
          <el-button slot="reference" v-if="scope.row.progressStr === '办结'" type="primary" size="mini" @click="opendialog(scope.row)">评价</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="dialog" v-show="visible">
      <div class="dialog_wrap">
        <h2>领导办结评价</h2>
        <div class="radios">
          <el-radio-group v-model="radio">
            <el-radio :label="'1'">好</el-radio>
            <el-radio :label="'2'">一般</el-radio>
            <el-radio :label="'3'">差</el-radio>
          </el-radio-group>
        </div>
        <div class="textareas">
          <textarea type="textarea" v-model="content" placeholder="请输入评价内容" />
        </div>
        <div class="buttons">
          <el-button size="mini" type="info" plain @click="visible = false">取消</el-button>
          <el-button type="primary" size="mini" @click="EvaluatetaskComment()">确定</el-button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { Transaction, taskComment } from '../../../api/Transaction'
export default {
  name: 'Management',
  props: ['taskid'],
  data() {
    return {
      TransactionList: [],
      content: '',
      radio: '1',
      visible: false
    }
  },
  mounted() {
    this.getListByTaskIdList()
  },
  methods: {
    handleEdit(index, row) {
      console.log(index, row)
    },
    // 获取领导关注记录
    getListByTaskIdList() {
      const params = {
        taskId: this.taskid
      }
      Transaction(params).then(res => {
        if (res.code === 200) {
          this.TransactionList = res.data
        }
      })
    },
    opendialog(row) {
      this.visible = true
      console.log(row)
    },
    // 新增评价
    EvaluatetaskComment() {
      const taskComment = {
        taskId: this.taskid,
        evaluationContent: this.content,
        evaluationState: Number(this.radio)
      }
      Transaction(taskComment).then(res => {
        if (res.code === 200) {
          this.visible = false
          this.$message({
            message: '评价成功',
            type: 'success'
          })
        }
      }).catch(e => {
        this.$message({
          message: e,
          type: 'warning'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  /deep/.cell{
    text-align: center;
  }
  .dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  .dialog_wrap {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 30%;
    height: 30%;
    background: #fff;
    border: 1px solid #000;
    h2,.radios,.buttons {
      text-align: center;
    }
    .textareas {
      padding: 0 20px;
      margin: 12px 0;
      textarea {
        resize: none;
        width: 100%;
        height: 80px;
      }
    }
    .buttons {
      display: flex;
      justify-content: space-around;
      padding: 0 24%;
      /deep/.el-button.is-plain:hover {
        background: #f4f4f5;
        color: #909399;
        border-color: #d3d4d6;
      }
    }
  }
}
</style>

<template>
  <div>
    <div>
      <DetaTab :title="'互动交流'" />
      <div style="display: flex;align-items: center;margin-top: 14px;">
        <div>
          <span>发送给</span>
        </div>
        <el-button type="primary" size="mini" class="from-serach" @click="openDialogVisible()">请选择</el-button>
      </div>
      <div style="margin-top: 15px;display: flex;height:80px">
        <textarea style="width:85%;resize: none;height:100%;" placeholder="" v-model="input2" />
        <div class="written">批示/回复</div>
      </div>
    </div>
    <div>
      <DetaTab style="margin-top: 15px;" :title="'批示回复记录'" />
      <div style="margin-top: 15px;">
        <el-timeline :reverse="reverse">
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            :timestamp="activity.timestamp"
          >
            {{ activity.content }}
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
    <el-dialog class="form_Department_main" :visible.sync="DialogVisible" :close-on-click-modal="false" append-to-body @closed="handleNo">
      <div class="form_Department_cont">
        <div class="form_Department_left">
          <div class="form_Department_search" />
          <div class="form_Department_content DepartmentTree">
            <DepartmentTree ref="childenTree" @getList="getList" />
          </div>
        </div>
        <div class="form_Department_center">
          <div class="form_Department_search">
            <i class="el-icon-search" />
            <input v-model="search" type="text" placeholder="请输入姓名" @blur="getList(Module)">
            <div class="Allelection" @click="Allelection()">全选</div>
          </div>
          <div class="form_Department_content">
            <ul v-if="listShow" class="form_Department_list">
              <li v-for="(item,index) in move" :key="index" :class="item.isok?'form_Department_list_on':''" @click="clickDepartment(index)">
                <div class="form_Department_list_txt">
                  <p>姓名：{{ item.trueName }}</p>
                  <p>手机号：{{ item.mobilePhone }}</p>
                </div>
                <div v-show="item.isok" class="form_Department_delete"><i class="el-icon-check" /></div>
              </li>
            </ul>
            <div v-show="move.length <= 0" class="nodata">{{ loading?'加载中...':'暂无数据' }}</div>
          </div>
          <div class="pagination">
            <pagination
              :page-size="pages.pageSize"
              :total="pages.total"
              :small="true"
              :pagercount="5"
              layout="total, sizes, prev, pager, next"
              @handleCurrentChange="handleCurrentChange"
              @handleSizeChange="handleSizeChange"
            />
          </div>
        </div>
        <div class="form_Department_right">
          <div class="form_Department_search">已选人员</div>
          <div class="form_Department_content">
            <ul class="form_Department_list">
              <li v-for="(item,index) in Selection" :key="index">
                <div class="form_Department_list_txt">
                  <p>姓名：{{ item.trueName }}</p>
                  <p>手机号：{{ item.mobilePhone }}</p>
                </div>
                <div class="form_Department_delete" @click="deleteDepartment(item,index)"><i class="el-icon-close" /></div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <DialogFooter slot="footer" :ischecked="false" cancelbut="取消" handleoklbut="确定" @handleNo="handleNo" @handleOk="handleOk" />
    </el-dialog>
  </div>
    <!-- <ChoiceUser identification="type02" flag="1" :setselection="setselection01" @returnData="returnData" /> -->
</template>

<script>
import DepartmentTree from '@/components/DepartmentTree'
import { sysUserslist, getsysUsers, getselectList } from '@/api/Common'
import ChoiceUser from '@/components/ChoiceUser'
export default {
  name: 'OnlineInstruction',
  props: ['taskid'],
  data() {
    return {
      input2: '',
      reverse: false,
      TransactionList: [], // 办理list
      activities: [{
        content: '活动按期开始',
        timestamp: '2018-04-15'
      }, {
        content: '通过审核',
        timestamp: '2018-04-13'
      }, {
        content: '创建成功',
        timestamp: '2018-04-11'
      }],
      setselection01: '',
      type01: [],
      DialogVisible: false,
      search: '', // 搜索的内容
      listShow: true,
      move: [],
      loading: false,
      pages: {
        pageNum: 1,
        pageSize: 20,
        total: 0
      },
      Selection: [], // 选中的
      Module: {}
    }
  },
  components: {
    // ChoiceUser,
    DepartmentTree
  },
  mounted() {
    // this.getListByTaskIdList()
  },
  methods: {
    // 获取领导关注记录
    /* getListByTaskIdList() {
      const params = {
        taskId: this.taskid
      }
      Transaction(params).then(res => {
        if (res.code === 200) {
          console.log(res.data)
          this.TransactionList = res.data
        }
      })
    } */
    // 打开DialogVisible
    openDialogVisible() {
      this.DialogVisible = true
      this.getList()
    },
    // 人员信息
    getList(val) {
      this.move = []
      this.loading = true
      this.Module = val
      const params = {
        flag: '1',
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        deptId: val.id || 'ROOT',
        trueName: this.search
      }
      getselectList(params).then((res) => {
        this.loading = false
        this.pages.total = res.total
        this.pages.pageNum = 1
        res.data.forEach(item => {
          item.isok = false
        })
        this.move = res.data
      }).catch(() => {
        this.loading = false
      })
    },
    // 全选
    Allelection() {
      this.move.forEach(item => {
        item.isok = true
        this.Selection.push(item)
      })
    },
    // 选中
    clickDepartment(index) {
      this.move[index].isok = !this.move[index].isok
      let userId = this.move[index].userId
      if (this.move[index].isok) {
        this.Selection.push(this.move[index])
      } else {
        for (let i in this.Selection) {
          if (userId === this.Selection[i].userId) {
            this.Selection.splice(i, 1)
          }
        }
      }
    },
    // 删除已选中
    deleteDepartment(item, index, isdelete) {
      const move = item
      move.isok = !move.isok
      this.Selection.splice(index, 1)
      this.move.map((item01, index01) => {
        if (item01.userId === move.userId) {
          this.move.splice(index01, 1, move)
        }
      })

      if (isdelete) {
        this.onSelection.splice(index, 1)
        this.onSelectionString.splice(index, 1)
        this.handleOk()// 回调数据
      }
    },
    handleCurrentChange(val) {
      this.pages.pageNum = val
      this.getList(this.Module)
    },
    handleSizeChange(val) {
      this.pages.pageNum = 1
      this.pages.pageSize = val
      this.getList(this.Module)
    },
    // 不保存选择
    handleNo() {
      const onSelection = JSON.parse(JSON.stringify(this.onSelection))
      const onSelectionString = JSON.parse(JSON.stringify(this.onSelectionString))
      this.Selection = onSelection
      const thismove = []
      this.move.map((item, index) => {
        thismove.push(item)
        if (this.move.length - 1 === index) {
          this.move = thismove
        }
      })
      this.DialogVisible = false
    },
    // 保存选择
    handleOk() {
      const Selection = JSON.parse(JSON.stringify(this.Selection))
      this.onSelection = Selection
      this.$emit('returnData', this.Selection, this.identification)
      this.DialogVisible = false
    },
    /**
     * 获取选择人员/单位
     * */
    returnData(val, stats) {
      const taskId = this.thisform.taskRecord.taskId || ''
      this[stats] = []
      switch (stats) {
        case 'type01':
          val.map(res => {
            this[stats].push({
              rpUserType: '3',
              type: '0',
              taskId: taskId,
              rpUserId: res.userId,
              rpUserName: res.trueName
            })
          })
          break
        case 'type02':
          val.map(res => {
            this[stats].push({
              rpUserType: '2',
              type: '0',
              taskId: taskId,
              rpUserId: res.userId,
              rpUserName: res.trueName
            })
          })
          break
        case 'type03':
          val.map(res => {
            this[stats].push({
              rpUserType: '0',
              type: '1',
              taskId: taskId,
              rpUserId: res.departmentid,
              rpUserName: res.deptname
            })
          })
          break
        case 'type04':
          val.map(res => {
            this[stats].push({
              rpUserType: '1',
              type: '1',
              taskId: taskId,
              rpUserId: res.departmentid,
              rpUserName: res.deptname
            })
          })
          break
        case 'type05':
          val.map(res => {
            this[stats].push({
              rpUserType: '7',
              type: '1',
              taskId: taskId,
              rpUserId: res.departmentid,
              rpUserName: res.deptname
            })
          })
          break
        default:
          return false
      }
    }
  }
}
</script>

<style lang='scss' scoped>
/deep/.el-input--medium .el-input__inner{
      height: 90px;
}
/deep/.el-input-group__append{
  color: #fff;
  background: #409EFF;
}
/deep/.el-timeline {
  padding: 0;
}
.from-serach {
  margin-bottom: 0;
  margin-left: 20px;
}
.written{
      height: 100%;
    flex: 1;
    background: #409EFF;
    line-height: 80px;
    text-align: center;
    color: #fff;
}
.form_Department_main {
  .el-input--mini .el-input__inner{
    height: 22px;
    line-height: 22px;
  }
}
.form_Department_cont{
  height: 100%;
  display: flex;
  border-top: 1px solid #ddd;
  .form_Department_left{
    width: 195px;
    height: 100%;
    .DepartmentTree{
      padding: 10px;
      overflow: auto;
    }
  }
  .form_Department_center{
    flex: 1;
    height: 100%;
    border: 1px solid #ddd;
    border-top: 0;
    border-bottom: 0;
    position: relative;
    .form_Department_search{
      display: flex;
      align-items: center;
      i{
        margin: 0 5px 0 10px;
      }
      input{
        flex: 1;
        height: 100%;
        line-height: 30px;
        border: 0;
        border-radius: 0;
        outline: none;
        color: #343434;
      }
      .Allelection{
        padding: 5px 10px;
        border-left: 1px solid #ddd;
        cursor: pointer;
      }
      .Allelection:active{
        background: rgba(0,0,0,0.05);
      }
    }
    .form_Department_content{
      height: calc(100% - 67px);
      overflow-y: auto;
      border-bottom: 1px solid #ddd;
      .form_Department_list{
        padding: 10px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        li{
          width: calc(50% - 5px);
          height: 66px;
          border: 1px solid #e0e0e0;
          border-radius: 2px;
          cursor: pointer;
          overflow: hidden;
          position: relative;
          margin-bottom: 8px;
          .form_Department_list_txt{
            padding: 5px 20px 5px 8px;
            overflow-y: auto;
            font-size: 12px;
            line-height: 20px;
            color: #2d2d2d;
            p{
              margin: 0;
            }
          }
          .form_Department_delete{
            display: none;
            position: absolute;
            top: 0;
            right: 0;
            border-top: 11px solid #f56c6c;
            border-right: 11px solid #f56c6c;
            border-left: 11px solid transparent;
            border-bottom: 11px solid transparent;
            i{
              position: absolute;
              top: -10px;
              right: -10px;
              font-size: 12px;
              color: #fff;
            }
          }
        }
        li:hover,
        .form_Department_list_on{
          border-color: #f56c6c;
          .form_Department_delete{
            display: block;
          }
        }
      }
    }
    .pagination{
      position: inherit;
      display: flex;
      align-items: center;
      height: 36px;
      bottom: 0 !important;
    }
  }
  .form_Department_right{
    width: 235px;
    height: 100%;
    .form_Department_search{
      color: #2d2d2d;
      padding: 0 10px;
      display: flex;
      align-items: center;
    }
    .form_Department_list{
      height: 100%;
      overflow-y: auto;
      padding: 10px 30px 10px 10px;
      li{
        width: 100%;
        height: 66px;
        border: 1px solid #e0e0e0;
        border-radius: 2px;
        overflow: hidden;
        position: relative;
        margin-bottom: 8px;
        .form_Department_list_txt{
          padding: 5px 20px 5px 8px;
          overflow-y: auto;
          font-size: 12px;
          line-height: 20px;
          color: #2d2d2d;
          p{
            margin: 0;
          }
        }
        .form_Department_delete{
          position: absolute;
          cursor: pointer;
          top: 0;
          right: 0;
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          i{
            font-size: 12px;
            color: #797979;
          }
        }
      }
    }
  }
  .form_Department_search{
    height: 31px;
    border-bottom: 1px solid #ddd;
  }
  .form_Department_content{
    height: calc(100% - 31px);
  }
}
</style>

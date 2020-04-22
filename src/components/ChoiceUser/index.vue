<template>
  <div>
    <div class="form_Department_box">
      <!--<el-button type="primary" size="small" @click="DialogVisible = true">{{ placeholder }}</el-button>-->
      <div class="form_Department_box_cont el-input__inner" @click="DialogVisible = true">
        <span v-show="onSelection.length < 1" class="form_Department_placeholder">{{ placeholder }}</span>
        <i class="el-icon-arrow-down form_Department_box_icon" />
        <ul v-show="onSelection.length > 0" class="form_Department_nav">
          <li v-for="(item,index) in onSelection" :key="index">
            <span>{{ item.trueName }}</span>
            <i class="el-icon-error" @click.stop="deleteDepartment(item,index,true)" />
          </li>
        </ul>
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
            <div v-if="!issingle" class="Allelection" @click="Allelection()">全选</div>
          </div>
          <div class="form_Department_content">
            <ul v-if="listShow" class="form_Department_list">
              <li v-for="(item,index) in move" :key="index" :class="item.isok?'form_Department_list_on':''" @click="clickDepartment(item,index)">
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
</template>

<script>
/*
* 数据返回方法（returnData(参数，标识)）
* */
import DepartmentTree from '@/components/DepartmentTree'
import { sysUserslist, getsysUsers, getselectList } from '@/api/Common'
export default {
  name: 'Index',
  components: {
    DepartmentTree
  },
  props: {
    // 是否单选
    issingle: {
      type: Boolean,
      default: false
    },
    // 默认值，逗号拼接
    setselection: {
      type: String,
      default: ''
    },
    // 用户标识，0：所有，1：领导
    flag: {
      type: String,
      default: '0'
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    // 标识判断返回的人员类型
    identification: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      DialogVisible: false, // 弹窗开关
      onSelection: [], // 确定选中的
      onSelectionString: [], // 确定选中的
      Selection: [], // 选中的
      SelectionString: [], // 选中的
      search: '', // 搜索的内容
      pages: {
        pageNum: 1,
        pageSize: 20,
        total: 0
      },
      Module: {},
      move: [],
      listShow: true,
      loading: false
    }
  },
  watch: {
    setselection(obj) {
      this.HandleSetselection()
    }
  },
  mounted() {
    this.HandleSetselection()
  },
  methods: {
    // 不保存选择
    handleNo() {
      const onSelection = JSON.parse(JSON.stringify(this.onSelection))
      const onSelectionString = JSON.parse(JSON.stringify(this.onSelectionString))
      this.Selection = onSelection
      this.SelectionString = onSelectionString
      const thismove = []
      this.move.map((item, index) => {
        item.isok = this.SelectionString.join().indexOf(item.userId) !== -1
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
      const SelectionString = JSON.parse(JSON.stringify(this.SelectionString))
      this.onSelection = Selection
      this.onSelectionString = SelectionString
      this.$emit('returnData', this.Selection, this.identification)
      this.DialogVisible = false
    },
    // 处理已选中人员信息
    HandleSetselection() {
      this.Selection = []
      this.onSelection = []
      this.SelectionString = []
      this.onSelectionString = []
      if (this.setselection) {
        const setselectionMove = this.setselection.split(',')
        setselectionMove.map((item, index) => {
          const isend = (setselectionMove.length - 1 === index)
          this.getPerArchives(item, isend)
        })
      }
    },
    // 人员信息
    getPerArchives(id, isend) {
      const params = {
        id: id
      }
      getsysUsers(id, params).then((res) => {
        if (res.code === 200 && res.data) {
          const move = res.data.syUsers
          move.isok = true
          this.Selection.push(move)
          this.onSelection.push(move)
          this.SelectionString.push(JSON.stringify(move))
          this.onSelectionString.push(JSON.stringify(move))
          if (isend) {
            this.getList(this.Module)
          }
        } else {
          if (isend) {
            this.getList(this.Module)
          }
        }
      })
    },
    getList(val) {
      this.move = []
      this.loading = true
      this.Module = val
      const params = {
        flag: this.flag,
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        deptId: val.id || 'ROOT',
        trueName: this.search
      }
      getselectList(params).then((res) => {
        this.loading = false
        this.pages.total = res.total
        this.pages.pageNum = 1
        res.data.map((item, index) => {
          item.isok = this.SelectionString.join().indexOf(item.userId) !== -1
          this.move.push(item)
        })
      }).catch(() => {
        this.loading = false
      })
    },
    // 全选
    Allelection() {
      this.move.map((item, index) => {
        this.clickDepartment(item, index, true)
      })
    },
    // 选中
    clickDepartment(item, index, isAll) {
      const move = item
      if (isAll && move.isok) {
        return false
      }
      move.isok = !move.isok
      if (this.issingle) {
        if (move.isok) {
          if (this.Selection.length > 0) {
            this.move.map((item01, index01) => {
              if (item01.userId === this.Selection[0].userId) {
                const move01 = item01
                move01.isok = !move01.isok
              }
              if (this.move.length - 1 === index01) {
                setTimeout(() => {
                  this.Selection = []
                  this.SelectionString = []
                  this.Selection.push(move)
                  this.SelectionString.push(JSON.stringify(move))
                }, 50)
              }
            })
          } else {
            this.Selection = []
            this.SelectionString = []
            this.Selection.push(move)
            this.SelectionString.push(JSON.stringify(move))
          }
        } else {
          this.Selection = []
          this.SelectionString = []
        }
      } else {
        if (move.isok) {
          this.Selection.push(move)
          this.SelectionString.push(JSON.stringify(move))
        } else {
          this.Selection.map((item01, index01) => {
            if (item01.userId === move.userId) {
              this.Selection.splice(index01, 1)
              this.SelectionString.splice(index01, 1)
            }
          })
        }
      }
    },
    // 删除已选中
    deleteDepartment(item, index, isdelete) {
      const move = item
      move.isok = !move.isok
      this.Selection.splice(index, 1)
      this.SelectionString.splice(index, 1)
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
    }
  }
}
</script>
<style lang="scss">
  .form_Department_main {
    .el-input--mini .el-input__inner{
      height: 22px;
      line-height: 22px;
    }
  }
</style>

<style lang="scss" scoped>

  ul,li{
    list-style: none;
    padding:0;
    margin: 0;
  }

  .form_Department_box{
    width: 100%;
    display: flex;
    .form_Department_box_cont,
    .el-input__inner{
      min-height: 32px;
      line-height: 30px;
      height: auto;
      padding: 0 30px 0 0;
      position: relative;
    }
    .form_Department_placeholder{
      color: #c0c4cc;
      padding-left: 15px;
      line-height: 30px;
    }
    .form_Department_box_icon{
      position: absolute;
      color: #C0C4CC;
      font-size: 14px;
      right: 5px;
      top: 50%;
      transform: translateY(-50%);
    }
    .el-button{
      height: 32px;
      margin-right: 20px;
    }
    .form_Department_nav{
      min-height: 30px;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      li{
        height: 24px;
        line-height: 22px;
        position: relative;
        margin: 2px 0 2px 6px;
        background-color: #f4f4f5;
        border: 1px solid #e9e9eb;
        color: #909399;
        padding-right: 2px;
        border-radius: 4px;
        span{
          padding: 0 8px;
          font-size: 12px;
        }
        i{
          cursor: pointer;
        }
        i:hover,
        i:active{
          color: #409eff;
        }
      }
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

<template>
  <div>
    <el-dialog :visible.sync="centerDialogVisible" :close-on-click-modal="false" title="用例分配" width="60%" top="2vh">
      <div ref="content" class="dialog_cont">
        <el-row :gutter="10" class="heightmax">
          <el-col class="heightmax" :span="5">
            <div class="grid-content bg-purple tree-style">
              <Tree @getList="getList" />
            </div>
          </el-col>
          <el-col :span="19">
            <div class="grid-content bg-purple-light">
              <el-table
                ref="multipleTable"
                :data="rolesData"
                tooltip-effect="dark"
                row-key="usecaseId"
                border
                stripe
                style="width: 100%"
                :height="height"
                @select-all="handleSelectionChange"
                @select="onTableSelect"
              >
                <el-table-column
                  type="selection"
                  :reserve-selection="true"
                  width="55"
                />
                <el-table-column align="center" type="index" width="50" label="序号" />
                <el-table-column align="center" prop="usecaseId" label="用例编码" />
                <el-table-column align="center" prop="usecaseTitle" label="用例标题" />
                <el-table-column align="center" prop="mappingUrl" label="api映射路径" />
                <el-table-column align="center" prop="usecaseDesc" label="用例描述" />
              </el-table>
              <div ref="pagination" class="pagtion">
                <pagination
                  :page-size="pages.pageSize"
                  :total="pages.total"
                  @handleCurrentChange="handleCurrentChange"
                  @handleSizeChange="handleSizeChange"
                />
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <DialogFooter slot="footer" cancelname="centerDialogVisible" @handleOk="handleOk" />
      <!-- <span slot="footer" class="dialog-footer">
         <el-button @click="centerDialogVisible = false">取 消</el-button>
         <el-button type="primary" @click="allotRole">确 定</el-button>
       </span>-->
    </el-dialog>
  </div>
</template>
<script>
import { list } from '@/api/sysModuleUseCase'
import { allotRole, getListByRoleId } from '@/api/sysSysRole'
import Tree from '@/components/Tree'
import { listTable } from '@/utils/index'
import DialogFooter from '@/components/DialogFooter'
import Pagination from '@/components/Paginations'
import { uniqueArr } from '@/utils/index'

export default {
  name: 'Usercase',
  components: {
    Tree,
    Pagination,
    DialogFooter
  },
  props: {
    usercaseData: Object
  },
  data() {
    return {
      centerDialogVisible: false,
      loading: false,
      hackReset: true,
      pages: {
        pageNum: 1,
        pageSize: 20,
        total: 0
      },
      height: 0,
      rolesData: [],
      Module: {},
      multipleSelection: [], // 点击时选中的数据
      UserTitle: '',
      usecaseIds: '',
      defaultSelection: [] // 默认选中数据
    }
  },
  created() {
    this.getListByRoleId()
  },
  mounted() {
    listTable('height', this, 1)// 重置表格高度
  },
  methods: {
    async getList(val) {
      this.Module = val
      const params = {
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        search: { 'moduleId': val.id }
      }
      const res = await list(val.id, params)
      if (res) {
        res.data.forEach(item1 => {
          this.defaultSelection.forEach(item2 => {
            if (item1.usecaseId === item2.usecaseId) {
              this.$refs.multipleTable.toggleRowSelection(item1, true)
            }
          })
        })
        this.rolesData = res.data
        this.pages.total = res.total
        this.pages.pageNum = 1
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
    handleSelectionChange(val) {
      this.defaultSelection = val
    },
    async handleOk(type) {
      const usecaseIds = []
      let resevearry = []
      this.defaultSelection.forEach(item => {
        usecaseIds.push(item.usecaseId)
      })

      resevearry = uniqueArr(usecaseIds) // 数组去重
      this.usecaseIds = resevearry.join(',')
      console.log(resevearry)
      console.log(this.defaultSelection)
      const params = `roleId=${this.usercaseData.roleId}&usecaseIds=${this.usecaseIds}`
      const res = await allotRole(params)
      if (res) {
        this.$notify({
          title: '提示',
          message: '用例分配成功'
        })
        this.$emit('handlBtnokClick')
        type ? this.centerDialogVisible = false : this.$refs.form.resetFields()
      }
    },
    async getListByRoleId() {
      const params = `roleId=${this.usercaseData.roleId}`
      const res = await getListByRoleId(params)
      if (res) {
        this.defaultSelection = res.data
      }
    },
    onTableSelect(rows, row) {
      const selected = rows.length && rows.indexOf(row) !== -1 // 判断是否是选中状态true为选中
      if (selected) {
        this.defaultSelection.push(row)
      } else {
        this.defaultSelection.forEach((item, index) => {
          if (item.usecaseId === row.usecaseId) {
            this.defaultSelection.splice(index, 1)
          }
        })
      }
      console.log(this.defaultSelection)
    }
  }
}
</script>
<style lang="scss" scoped>
  .pagtion {
    margin-top: 15px;
  }

  .user-title {
    width: 100%;
    white-space: nowrap;
    overflow-x: scroll;
  }
</style>

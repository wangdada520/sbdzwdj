<template>
  <div>
    <el-dialog :visible.sync="centerDialogVisible" :close-on-click-modal="false" title="用例分配" width="60%" top="2vh">
      <div ref="content" class="grid-content bg-purple-light dialog_cont">
        <el-table
          ref="multipleTable"
          :data="rolesData"
          tooltip-effect="dark"
          row-key="roleId"
          border
          stripe
          style="width: 100%"
          :height="height"
          @selection-change="handleSelectionChange"
          @select="onTableSelect"
        >
          <el-table-column
            type="selection"
            :reserve-selection="true"
            width="55"
          />
          <el-table-column align="center" type="index" width="50" label="序号" />
          <el-table-column align="left" prop="roleName" width="400" label="角色名称" />
          <el-table-column align="left" prop="roleDesc" label="角色描述" />
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
      <!--<span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRole">确 定</el-button>
      </span>-->
      <DialogFooter slot="footer" cancelname="centerDialogVisible" @handleOk="handleOk" />
    </el-dialog>
  </div>
</template>
<script>
import { list } from '@/api/sysSysRole'
import { getdetials, allotRole } from '@/api/SysUserRole'
import Pagination from '@/components/Paginations'
import { listTable } from '@/utils/index'
import DialogFooter from '@/components/DialogFooter'
export default {
  name: 'Usercase',
  components: {
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
      search: {},
      multipleSelection: [], // 点击时选中的数据
      UserTitle: '',
      roleIds: '',
      defaultSelection: [] // 默认选中数据
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    listTable('height', this, 1)// 重置表格高度
  },
  methods: {
    async getList() {
      const params = {
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        search: this.search
      }
      const res = await list(params)
      if (res) {
        this.rolesData = res.data
        this.pages.total = res.total
        this.pages.pageNum = 1
        this.getdetials()
      }
    },
    handleCurrentChange(val) {
      this.pages.pageNum = val
      this.getList()
    },
    handleSizeChange(val) {
      this.pages.pageNum = 1
      this.pages.pageSize = val
      this.getList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    async handleOk(type) {
      const usecaseIds = []
      this.multipleSelection.push(this.defaultSelection)
      this.multipleSelection.forEach(item => {
        usecaseIds.push(item.roleId)
      })
      this.roleIds = usecaseIds.join(',')
      const params = `userId=${this.usercaseData.userId}&roleIds=${this.roleIds}`
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
    async getdetials() {
      this.jsondata = {
        id: this.usercaseData.userId
      }
      const res = await getdetials(this.usercaseData.userId, this.jsondata)
      if (res) {
        this.defaultSelection = res.data.sysUserRoleList
        this.toggleSelection()
      }
    },
    toggleSelection() {
      // console.log(this.rolesData)
      // console.log(this.defaultSelection)
      this.rolesData.forEach((row, index) => {
        this.defaultSelection.forEach(item => {
          if (row.roleId === item.roleId) {
            this.$refs.multipleTable.toggleRowSelection(this.rolesData[index])
          }
        })
      })
    },
    onTableSelect(rows, row) {
      const selected = rows.length && rows.indexOf(row) !== -1 // 判断是否是选中状态true为选中
      if (selected) {
        this.defaultSelection.forEach((item, index) => {
          if (item.roleId === row.roleId) {
            this.defaultSelection.push(row)
          }
        })
      } else {
        this.defaultSelection.forEach((item, index) => {
          if (item.roleId === row.roleId) {
            this.defaultSelection.splice(index, 1)
          }
        })
      }
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

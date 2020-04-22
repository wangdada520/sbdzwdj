<template>
  <div class="content">
    <el-row :gutter="20" class="heightmax">

      <el-col :span="3" style="background-color: #efeeee" class="heightmax">
        <div class="grid-content bg-purple tree-style">
          <DepartmentTree ref="childenTree" @getList="getList" />
        </div>
      </el-col>
      <el-col
        :span="21"
        style="background-color: #fff;padding-top: 10px;height:calc(100% - 52px)"
        class="global_table_box"
      >
        <!--<div style="color: #909393;padding-bottom: 5px"> 当前父节点:{{ ParentName }}</div>-->
        <div class="from-serach">
          <div class="serach">

            <el-input v-model="trueName" clearable size="mini" placeholder="请输入姓名" />
            <el-input v-model="loginName" clearable size="mini" placeholder="请输入用户登陆名" />
            <el-input v-model="mobilePhone" clearable size="mini" placeholder="请输入手机号码" />
            <div>
              <el-button size="mini" class="from-serach" @click="serach">搜索</el-button>
            </div>
          </div>
          <div>
            <el-button-group>
              <el-button
                v-show="isbuttonshow"
                size="mini"
                icon="el-icon-plus"
                @click="handleEdit"
              >
                新增
              </el-button>
            </el-button-group>
          </div>
        </div>
        <div class="grid-content bg-purple-light global_table_content">
          <el-table
            v-loading="loading"
            :data="rolesData"
            stripe
            border
            highlight-current-row
            style="width: 100%"
            height="100%"
            @row-dblclick="rowdblClick"
          >
            <el-table-column align="center" width="100" label="操作">
              <template slot-scope="scope">
                <EditDeletOpetion
                  :scope="scope"
                  :menulist="menulist"
                  @handleEdit="handleEdit"
                />
              </template>
            </el-table-column>
            <el-table-column align="center" type="index" width="50" label="序号" />
            <el-table-column align="left" prop="trueName" label="姓名" :show-overflow-tooltip="true" />
            <el-table-column align="left" prop="departmentName" label="所属部门" :show-overflow-tooltip="true" />
            <el-table-column align="left" prop="loginName" label="用户登陆名" :show-overflow-tooltip="true" />
            <el-table-column align="left" prop="mobilePhone" label="手机号码" :show-overflow-tooltip="true" />
            <el-table-column align="left" prop="email" label="邮件" :show-overflow-tooltip="true" />
            <el-table-column align="left" label="帐号状态" width="150" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.isUse"
                  v-loading="isUserloding"
                  active-color="#13ce66"
                  @change="handClickisUse(scope,scope.row.isUse)"
                />
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination">
            <pagination
              :page-size="pages.pageSize"
              :total="pages.total"
              :page.sync="pagNum"
              @handleCurrentChange="handleCurrentChange"
              @handleSizeChange="handleSizeChange"
            />
          </div>
        </div>
      </el-col>
    </el-row>
    <!--edit-->
    <Edit ref="chldenEdit" :form="form" :title="title" :module="Module" @handlBtnokClick="refresh" />
    <!--add-->
    <Add v-if="hackReset" ref="chldenAdd" :module="Module" @handlBtnokClick="refresh" />
    <!--details-->
    <Details v-if="hackDetails" ref="childenDetails" :details="Details" @closed="closed" />
    <!--用例分配-->
    <Usercase v-if="hackUsercase" ref="chldenUserCase" :usercase-data="usercasedata" @handlBtnokClick="refresh" />
  </div>
</template>

<script>
import { list, deletesysUsers, EditModule, RestPassword } from '@/api/SysUserRole'
import Edit from '@/views/system/SysUserRole/model/edit'
import Add from '@/views/system/SysUserRole/model/add'
import DepartmentTree from '@/components/DepartmentTree'
import Details from '@/views/system/SysUserRole/model/details'
import Usercase from '@/views/system/SysUserRole/model/usercase'
export default {
  name: 'SysUserRole',
  components: {
    DepartmentTree,
    Edit,
    Add,
    Details,
    Usercase
  },
  data() {
    return {
      loading: false,
      isUserloding: false,
      hackReset: false,
      hackDetails: false,
      hackUsercase: false,
      rowcell: '', // 当前选中行数据
      pagNum: 1,
      pages: {
        pageNum: 1,
        pageSize: 20,
        total: 0
      },
      trueName: '',
      loginName: '',
      mobilePhone: '',
      rolesData: [],
      search: {},
      title: '',
      parentdeptid: '',
      centerDialogVisible: false,
      form: {},
      sysModule: {},
      Details: {},
      Module: {},
      usercasedata: {},
      ParentName: '',
      isbuttonshow: false,
      menulist: [
        {
          name: '编辑',
          icon: 'el-icon-edit',
          type: 'edg',
          ishow: true
        },
        {
          name: '重置密码',
          icon: 'el-icon-refresh-right',
          type: 'resevpassword',
          ishow: true
        },
        {
          name: '分配角色',
          icon: '',
          type: 'role',
          ishow: true
        }
      ]
    }
  },
  computed: {
    condition: {
      get() {
        const params = {
          pageNum: this.pages.pageNum,
          pageSize: this.pages.pageSize,
          search: {}
        }
        if (this.parentdeptid !== 'ROOT') {
          params['search']['departmentId'] = this.parentdeptid
        }
        if (this.trueName) {
          params['search']['trueName'] = this.trueName
        }
        if (this.loginName) {
          params['search']['loginName'] = this.loginName
        }
        if (this.mobilePhone) {
          params['search']['mobilePhone'] = this.mobilePhone
        }
        return params
      },
      set(val) {
        this.parentdeptid = val
      }
    }
  },

  created() {

  },
  mounted() {

  },
  methods: {
    handleAdd() {
      this.hackReset = false
      this.$nextTick(() => {
        this.hackReset = true
        setTimeout(() => {
          this.$refs.chldenAdd.centerDialogVisible = true
        }, 0)
      })
    },
    handleEdit(row, name) {
      switch (name) {
        case 'edg':
          this.title = '编辑'
          this.form = Object.assign({}, row) // copy obj
          this.$refs.chldenEdit.centerDialogVisible = true
          break
        case 'resevpassword':
          this.handleRestpassworld(row)
          break
        case 'role':
          this.handleUserCase(row)
          break
        default:
          this.title = '新增'
          this.form = {}
          this.$refs.chldenEdit.centerDialogVisible = true
          return
      }
    },
    handleDelete(row) {
      this.loading = true
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        this.deletesysUsers(row.userId)
      }).catch(() => {
      })
      this.loading = false
    },
    handleCurrentChange(val) {
      this.pages.pageNum = val
      this.getList(this.Module)
    },
    // 密码重置
    handleRestpassworld(row) {
      this.$confirm('确定要重置密码吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        this.RestPassword(row.userId)
      }).catch(() => {
      })
    },
    async RestPassword(userId) {
      const params = `userId=${userId}`
      const res = await RestPassword(params)
      if (res) {
        this.$message('密码重置成功')
      }
    },
    handleSizeChange(val) {
      this.pages.pageSize = val
      this.getList(this.Module)
    },
    async getList(val, serach) {
      this.isbuttonshow = true
      this.loading = true
      this.ParentName = val.name
      this.Module = val
      // this.search.departmentId = val.id
      this.condition = val.id
      // console.log(this.pages.pageNum)
      if (this.title === '新增') {
        this.pagNum = 1
        this.pages.pageNum = 1
      }
      const res = await list(this.condition)
      if (res) {
        res.data.forEach(item => {
          if (item.isUse === 1) {
            item.isUse = true
          } else {
            item.isUse = false
          }
        })
        this.rolesData = res.data
        this.pages.total = res.total
        this.loading = false
      }
    },
    async deletesysUsers(id) {
      const data = {
        id: id
      }
      const res = await deletesysUsers(id, data)
      if (res) {
        this.$message('删除成功')
        this.refresh()
      }
    },
    handEditclick() {
      // this.$refs.chldenEdit.centerDialogVisible = false

    },
    handleaddOk() {
      this.$refs.chldenAdd.handleOk()
      if (this.$refs.chldenAdd.isfromsubmit) {
        this.centerDialogVisible = false
        this.refresh()
      }
    },
    refresh() {
      this.$refs.childenTree.appendCallback(this.Module)
      this.$refs.childenTree.handleNodeClick(this.Module)
    },
    serach() {
      this.pages.pageNum = 1
      this.getList(this.Module, true)
    },
    rowdblClick(row) {
      this.Details = Object.assign({}, row) // copy obj
      this.$nextTick(() => {
        this.hackDetails = true
        setTimeout(() => {
          this.$refs.childenDetails.centerDialogVisible = true
        }, 0)
      })
    },
    setCase() {
      if (!this.rowcell) {
        this.$message('请选择需要操作的数据')
      } else {
        this.handleUserCase(this.rowcell)
      }
    },
    handClickisUse(row, val) {
      const isUse = val ? 1 : 0
      this.handleOk(row.row, isUse)
    },
    handleUserCase(row) {
      this.usercasedata = Object.assign({}, row) // copy obj
      this.hackUsercase = false
      this.$nextTick(() => {
        this.hackUsercase = true
        setTimeout(() => {
          this.$refs.chldenUserCase.centerDialogVisible = true
        }, 0)
      })
    },
    async handleOk(row, isUse) {
      this.isUserloding = true
      const Jsondata = {
        userId: row.userId,
        loginName: row.loginName,
        isUse: isUse
      }
      const res = await EditModule(row.userId, Jsondata)
      if (res) {
        this.isUserloding = false
        this.refresh()
      }
    },
    closed() {
      this.hackDetails = false
    }
  }
}
</script>

<style scoped>
  .content {
    padding: 0;
    padding-right: 10px;
  }

  .tree-style {
    background-color: #fff;
  }
</style>

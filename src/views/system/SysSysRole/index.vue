<template>
  <div class="content">
    <div class="global_table_box">
      <div class="from-serach">
        <div>
          <Serach ref="fromSerach" :options="options" @serach="serach" />
        </div>
        <div>
          <el-button
            size="mini"
            icon="el-icon-plus"
            @click="handleEdit"
          >
            新增
          </el-button>
        </div>
      </div>
      <el-table
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
        <el-table-column align="left" prop="roleName" width="400" label="角色名称" :show-overflow-tooltip="true" />
        <el-table-column align="left" prop="roleDesc" label="角色描述" :show-overflow-tooltip="true" />
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

    <!--edit-->
    <Edit ref="chldenEdit" :form="form" :title="title" @handlBtnokClick="getList" />
    <!--用例分配-->
    <Usercase v-if="hackUsercase" ref="chldenUserCase" :usercase-data="usercasedata" @handlBtnokClick="getList" />
    <!--details-->
    <Details v-if="hackDetails" ref="childenDetails" :details="Details" @closed="closed" />
  </div>
</template>
<script>
import { list, deleteSysModule } from '@/api/sysSysRole'
import Edit from '@/views/system/SysSysRole/model/edit'
import Usercase from '@/views/system/SysSysRole/model/usercase'
import Details from '@/views/system/SysSysRole/model/details'
import Serach from '@/components/Serach'
import { returnValue } from '@/utils/index'
export default {
  name: 'SysSysRole',
  components: {
    Edit,
    Usercase,
    Details,
    Serach
  },
  data() {
    return {
      pagNum: 1,
      pages: {
        pageNum: 1,
        pageSize: 20,
        total: 0
      },
      form: {},
      rolesData: [],
      serachValue: '',
      title: '',
      hackReset: true,
      hackUsercase: false,
      hackDetails: false,
      usecase: true, // 显示用例操作
      usercasedata: {},
      options: [{
        value: '',
        serachvalue: 'roleName',
        label: '请输入角色名称'
      },
      {
        value: '',
        serachvalue: 'roleDesc',
        label: '请输入角色描述'
      }
      ],
      menulist: [
        {
          name: '编辑',
          icon: 'el-icon-edit',
          type: 'edg',
          ishow: true
        },
        {
          name: '删除',
          icon: 'el-icon-delete',
          type: 'deldet',
          color: 'red',
          ishow: true
        },
        {
          name: '设置用例',
          icon: '',
          type: 'setcace',
          ishow: true
        }
      ],
      Details: {}
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
        if (returnValue('roleName', this.serachValue)) {
          params['search']['roleName'] = returnValue('roleName', this.serachValue)
        }
        if (returnValue('roleDesc', this.serachValue)) {
          params['search']['roleDesc'] = returnValue('roleDesc', this.serachValue)
        }
        return params
      }
    }
  },
  created() {
    this.getList()
  },
  mounted() {
  },
  methods: {
    async getList() {
      if (this.title === '新增') {
        this.pagNum = 1
        this.pages.pageNum = 1
      }
      const res = await list(this.condition)
      if (res) {
        this.rolesData = res.data
        this.pages.total = res.total
      }
    },
    // 操作
    handleEdit(row, name) {
      switch (name) {
        case 'edg':
          this.title = '编辑'
          this.form = Object.assign({}, row) // copy obj
          this.$refs.chldenEdit.centerDialogVisible = true
          break
        case 'deldet':
          this.handleDelete(row)
          break
        case 'setcace':
          this.handleUserCase(row)
          break
        default:
          this.title = '新增'
          this.form = {}
          this.$refs.chldenEdit.centerDialogVisible = true
          return
      }
    },
    // 删除
    handleDelete(row) {
      this.loading = true
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteSysModule(row.roleId)
      }).catch(() => {
      })
      this.loading = false
    },
    async deleteSysModule(id) {
      const data = {
        id: id
      }
      const res = await deleteSysModule(id, data)
      if (res) {
        this.$message('删除成功')
        this.getList()
      }
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
    handleCurrentChange(val) {
      this.pages.pageNum = val
      this.getList()
    },
    handleSizeChange(val) {
      this.pages.pageNum = 1
      this.pages.pageSize = val
      this.getList()
    },
    rowdblClick(row) {
      this.Details = Object.assign({}, row) // copy obj
      // this.hackDetails = false
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
    serach(val) {
      this.serachValue = val
      this.pages.pageNum = 1
      this.getList()
    },
    closed() {
      this.hackDetails = false
    }
  }
}
</script>
<style lang="scss" scoped>

</style>

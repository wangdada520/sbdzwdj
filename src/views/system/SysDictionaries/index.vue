<template>
  <div class="content">
    <div class="global_table_box">
      <div class="from-serach">
        <div>
          <div class="serach">
            <div>
              <el-input v-model="dictcode" size="mini" placeholder="请输入字典编码" clearable />
            </div>
            <div>
              <el-input v-model="dictname" size="mini" placeholder="请输入字典名称" clearable />
            </div>
            <div>
              <el-button size="mini" class="from-serach" @click="serach">搜索</el-button>
            </div>
          </div>
        </div>
        <el-button-group>
          <el-button
            size="mini"
            icon="el-icon-plus"
            @click="handleEdit"
          >
            新增
          </el-button>
        </el-button-group>
      </div>
      <el-table
        v-loading="loading"
        :data="rolesData"
        stripe
        border
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
        <el-table-column align="left" prop="dictcode" width="400" label="字典编码" :show-overflow-tooltip="true" />
        <el-table-column align="left" prop="dictname" label="字典名称" :show-overflow-tooltip="true" />
        <el-table-column align="left" prop="indexnum" label="排序" :show-overflow-tooltip="true" />
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

    <!--details-->
    <Details v-if="hackDetails" ref="childenDetails" :details="Details" @closed="closed" />
    <!--edit-->
    <Edit v-if="hackEdit" ref="chldenEdit" :form="form" :title="title" @handlBtnokClick="getList" @closed="closed" />
    <!--值管理-->
    <dictvalue v-if="hackDictvalue" ref="chldenDictvalue" :dictdata="DictData" @closed="closed" />
  </div>

</template>

<script>
import { list, deleteSysDict } from '@/api/SysDictionaries'
import Details from '@/views/system/SysDictionaries/model/details'
import Edit from '@/views/system/SysDictionaries/model/edit'
import dictvalue from '@/views/system/SysDictionaries/model/dictvalue'

export default {
  name: 'SysDictionaries',
  components: {
    Details,
    Edit,
    dictvalue
  },
  data() {
    return {
      pagNum: 1,
      pages: {
        pageNum: 1,
        pageSize: 20,
        total: 0
      },
      title: '', // 新增编辑标题
      form: {},
      rolesData: [],
      hackDictvalue: false,
      hackDetails: false,
      hackEdit: false,
      loading: false,
      DictData: {},
      Details: {},
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
          name: '值管理',
          icon: 'el-icon-delete',
          type: 'price',
          ishow: true
        }
      ],
      dictname: '',
      dictcode: '',
      search: {}
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    closed() {
      this.hackDictvalue = false
      this.hackDetails = false
      this.hackEdit = false
    },
    getList(isFirstpage) {
      this.loading = true
      if (isFirstpage) {
        this.pagNum = 1
        this.pages.pageNum = 1
      }
      const params = {
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        search: this.search
      }
      list(params).then((res) => {
        this.loading = false
        this.rolesData = res.data
        this.pages.total = res.total
      }).catch(() => {
        this.loading = false
      })
    },
    serach() {
      this.search = {}
      if (String(this.dictcode)) {
        this.search.dictcode = this.dictcode
      }
      if (String(this.dictname)) {
        this.search.dictname = this.dictname
      }
      this.getList(true)
    },
    handleDictvalue(row) {
      this.DictData = Object.assign({}, row) // copy obj
      this.$nextTick(() => {
        this.hackDictvalue = true
        setTimeout(() => {
          this.$refs.chldenDictvalue.centerDialogVisible = true
        }, 0)
      })
    },
    handleCurrentChange(val) {
      this.pages.pageNum = val
      this.getList()
    },
    handleSizeChange(val) {
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
    // 删除
    handleDelete(row) {
      this.loading = true
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this.deleteSysDict(row.id)
      }).catch(() => {
      })
      this.loading = false
    },
    async deleteSysDict(id) {
      const data = {
        id: id
      }
      const res = await deleteSysDict(id, data)
      if (res) {
        this.$message('删除成功')
        this.getList()
      }
    },
    // 操作
    handleEdit(row, name) {
      switch (name) {
        case 'edg':
          this.title = '编辑'
          this.form = Object.assign({}, row) // copy obj
          this.$nextTick(() => {
            this.hackEdit = true
            setTimeout(() => {
              this.$refs.chldenEdit.centerDialogVisible = true
            })
          })
          break
        case 'deldet':
          this.handleDelete(row)
          break
        case 'price':
          this.handleDictvalue(row)
          break
        default:
          this.title = '新增'
          this.form = {}
          this.$nextTick(() => {
            this.hackEdit = true
            setTimeout(() => {
              this.$refs.chldenEdit.centerDialogVisible = true
            })
          })
          return
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

<template>
  <div>
    <el-dialog :visible.sync="centerDialogVisible" :close-on-click-modal="false" title="值管理" @closed="closed">
      <div class="dialog_cont global_table_box">
        <div class="from-serach">
          <div />
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
          ref="multipleTable"
          v-loading="loading"
          :data="rolesData"
          tooltip-effect="dark"
          row-key="usecaseId"
          border
          stripe
          style="width: 100%"
          height="100%"
        >
          <el-table-column align="center" width="100" label="操作">
            <template slot-scope="scope">
              <!--<EditDeletOpetion
                :scope="scope"
                @handleEdit="handleEdit"
                @handleDelete="handleDelete"
              />-->
              <EditDeletOpetion
                :scope="scope"
                :menulist="menulist"
                @handleEdit="handleEdit"
              />
            </template>
          </el-table-column>
          <el-table-column align="center" type="index" width="50" label="序号" />
          <el-table-column align="left" prop="value" label="字典值" />
          <el-table-column align="left" prop="description" label="字典值描述" />
          <el-table-column align="left" prop="indexnum" label="排序" />
        </el-table>
        <div class="pagtion">
          <pagination
            :page-size="pages.pageSize"
            :total="pages.total"
            :page.sync="pagNum"
            @handleCurrentChange="handleCurrentChange"
            @handleSizeChange="handleSizeChange"
          />
        </div>
      </div>
    </el-dialog>
    <!--edit-->
    <Edit ref="chldenEdit" :form="form" :module="dictdata" :title="title" @handlBtnokClick="getList" />
  </div>
</template>

<script>
import { DictvalueList, deleteSysDictvalue } from '@/api/SysDictionaries'
import Edit from '@/views/system/SysDictionaries/model/dictvalue_edit'

export default {
  name: 'Dictvalue',
  components: {
    Edit
  },
  props: {
    dictdata: Object
  },
  data() {
    return {
      pagNum: 1,
      pages: {
        pageNum: 1,
        pageSize: 20,
        total: 0
      },
      height: 0,
      form: {},
      loading: false,
      rolesData: [],
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
        }
      ],
      centerDialogVisible: false, // 弹窗
      hackReset: true, // 新增
      title: ''
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 关闭动画结束后触发
    closed() {
      this.$emit('closed')
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
        search: { 'dictid': this.dictdata.id }
      }
      DictvalueList(params).then((res) => {
        this.loading = false
        this.rolesData = res.data
        this.pages.total = res.total
      }).catch(() => {
        this.loading = false
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
    // 删除
    handleDelete(row) {
      this.loading = true
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteSysDict(row.id)
      }).catch(() => {
      })
      this.loading = false
    },
    deleteSysDict(id) {
      const data = {
        id: id
      }
      deleteSysDictvalue(id, data).then((res) => {
        this.loading = false
        this.$message('删除成功')
        this.getList()
      }).catch(() => {
        this.loading = false
      })
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
        default:
          this.title = '新增'
          this.form = {}
          this.$refs.chldenEdit.centerDialogVisible = true
          return
      }
    }
  }
}
</script>

<style scoped>
  .pagtion {
    margin-top: 15px;
  }

  .global_table_box{
    height: 100%;
  }
</style>

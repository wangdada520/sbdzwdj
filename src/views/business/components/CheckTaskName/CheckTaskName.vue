<template>
  <!-- 选择工作名称 -->
  <div>
    <div id="taskname">
      <div>
        <el-select :placeholder="placeholder" @focus="showTable" />
      </div>
      <el-dialog
        :visible.sync="DialogVisible"
        append-to-body
        :close-on-click-modal="false"
        :title="title"
        center
        @closed="closed"
      >
        <div class="search">
          <div class="input_content">
            <el-input v-model="taskName" placeholder="请输入工作名称" clearable />
          </div>
          <div class="btn_content">
            <el-button type="danger" size="small" @click="getList">搜索</el-button>
          </div>
        </div>
        <el-table v-loading="loading" :data="tableData" stripe border>
          <el-table-column align="center" label="单选" width="55" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.checked" @change="handleSelectionChange(scope.row)" />
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            prop="workNumber"
            width="200"
            label="工作编号"
            :show-overflow-tooltip="true"
          />
          <el-table-column align="left" prop="taskName" label="工作名称" :show-overflow-tooltip="true" />
        </el-table>
        <div slot="footer" class="dialog-footer">
          <pagination
            :page-size="pages.pageSize"
            :total="pages.total"
            :page.sync="pagNum"
            @handleCurrentChange="handleCurrentChange"
            @handleSizeChange="handleSizeChange"
          />
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { gettaskRecordlist } from '@/views/business/api/JobAssignment'
export default {
  props: {
    title: {
      type: String,
      default: '工作名称列表'
    },
    placeholder: {
      type: String,
      default: '请选择工作名称'
    }
  },
  data() {
    return {
      DialogVisible: false,
      taskName: '',
      pagNum: 1,
      pages: {
        pageNum: 1,
        pageSize: 20,
        total: 0
      },
      search: {},
      loading: false,
      tableData: [],
      checked: null,
      tableTaskName: ''
    }
  },
  watch: {
    taskName(val) {
      if (val === '') {
        delete this.search.taskName
      } else {
        this.search.taskName = this.taskName
      }
    }
  },
  methods: {
    getList() {
      this.loading = true
      const params = {
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        search: this.search
      }
      gettaskRecordlist(params).then(res => {
        this.loading = false
        const { data, code, total } = res
        if (code === 200) {
          this.pages.total = total
          data.forEach(item => {
            item.checked = false
          })
          this.tableData = data
        }
      })
    },
    handleSelectionChange(row) {
      console.log('wokdso')

      console.log(row)

      this.tableData.forEach(item => {
        // 排他,每次选择时把其他选项都清除
        if (item.taskId !== row.taskId) {
          item.checked = false
        }
      })
      const obj = {
        taskId: row.taskId
      }
      this.$emit('sendRow', obj)
      this.placeholder = ''
      this.tableData = []
      this.placeholder = row.taskName
      this.$emit('closeCheck')
    },
    showTable() {
      this.DialogVisible = true
      this.tableTaskName = ''
      this.workName = ''
      this.getList()
    },
    showdialog() {
      this.DialogVisible = true
    },
    handleCurrentChange(val) {
      this.pages.pageNum = val
      this.getList()
    },
    handleSizeChange(val) {
      this.pages.pageSize = val
      this.getList()
    },
    closed() {
      // 关闭结束时,清空表单
      this.$emit('closeCheck')
    }
  }
}
</script>

<style scoped>
.el-input__inner {
  height: 22px;
  line-height: 22px;
}
.form_Department_box_cont {
  min-height: 32px;
  line-height: 30px;
  height: auto;
  padding: 0 30px 0 0;
  position: relative;
}
.search {
  display: flex;
  padding: 10px 0;
}
.input_content {
  flex: 8;
}
.btn_content {
  flex: 3;
  margin-left: 20px;
}
.form_Department_box_icon {
  position: absolute;
  color: #c0c4cc;
  font-size: 14px;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
}
.text {
  position: relative;
  left: 3px;
}
</style>

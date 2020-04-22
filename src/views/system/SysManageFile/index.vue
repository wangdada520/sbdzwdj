<template>
  <div class="content">
    <div class="global_table_box">
      <div class="from-serach">
        <div>
          <div class="serach">
            <div>
              <el-input v-model="operationCode" size="mini" placeholder="请输入附件编码" clearable />
            </div>
            <div>
              <el-input v-model="operationId" size="mini" placeholder="请输入业务编码" clearable />
            </div>
            <div>
              <el-input v-model="sysFileName" size="mini" placeholder="请输入系统文件名" clearable />
            </div>
            <div>
              <el-button size="mini" class="from-serach" @click="serach">搜索</el-button>
            </div>
          </div>
        </div>
        <div />
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
        <el-table-column align="left" prop="id" label="记录编码" :show-overflow-tooltip="true" />
        <el-table-column align="left" prop="sysfilename" label="系统文件名" :show-overflow-tooltip="true" />
        <el-table-column align="left" prop="phyfilename" label="物理文件名" :show-overflow-tooltip="true" />
        <el-table-column align="left" prop="filetype" label="文件类型" :show-overflow-tooltip="true" />
        <el-table-column align="left" prop="operationcode" label="附件编码" :show-overflow-tooltip="true" />
        <el-table-column align="left" prop="operationid" label="业务编码" :show-overflow-tooltip="true" />
        <el-table-column align="left" prop="filesize" label="文件大小" :show-overflow-tooltip="true" />
        <el-table-column align="left" prop="savepath" label="保存路径" :show-overflow-tooltip="true" />
        <el-table-column align="center" width="155px" prop="createtimeStr" label="创建时间" :show-overflow-tooltip="true" />
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
  </div>

</template>

<script>
import { list } from '@/api/SysManageFile'
import Details from '@/views/system/SysManageFile/model/details'

export default {
  name: 'SysManageFile',
  components: {
    Details
  },
  data() {
    return {
      pagNum: 1,
      pages: {
        pageNum: 1,
        pageSize: 20,
        total: 0
      },
      rolesData: [],
      hackDetails: false,
      height: 0,
      Details: {},
      loading: false,
      search: {},
      operationCode: '',
      operationId: '',
      sysFileName: ''
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    closed() {
      this.hackDetails = false
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
        operationCode: this.search.operationCode || '',
        operationId: this.search.operationId || '',
        sysFileName: this.search.sysFileName || ''
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
      if (String(this.operationCode)) {
        this.search.operationCode = this.operationCode
      }
      if (String(this.operationId)) {
        this.search.operationId = this.operationId
      }
      if (String(this.sysFileName)) {
        this.search.sysFileName = this.sysFileName
      }
      this.getList(true)
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
      this.$nextTick(() => {
        this.hackDetails = true
        setTimeout(() => {
          this.$refs.childenDetails.centerDialogVisible = true
        }, 0)
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

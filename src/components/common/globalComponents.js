import Vue from 'vue'
import Times from '@/components/Times'// 选择时间
import Upload from '@/components/Upload/SingleImage'// 选择附件
import FilePreview from '@/components/FilePreview'// 详情附件查看
import DialogFooter from '@/components/DialogFooter'// 编辑按钮组
import Pagination from '@/components/Pagination'// 分页
import EditDeletOpetion from '@/components/EditDeletOpetionNew'// 列表操作按钮
import EditDeletOpetionNew from '@/components/EditDeletOpetionNew'// 列表操作按钮
import CompanyList from '@/components/CompanyList'// 搜索条件选择单位
import permission from '@/directive/permission/index' // 权限判断指令
import checkPermission from '@/utils/permission' // 权限判断函数
import DetaTab from '@/components/DetailsTab'// 详情分隔标题
function piugin() {
  Vue.component('Times', Times)
  Vue.component('Upload', Upload)
  Vue.component('FilePreview', FilePreview)
  Vue.component('DialogFooter', DialogFooter)
  Vue.component('Pagination', Pagination)
  Vue.component('EditDeletOpetion', EditDeletOpetion)
  Vue.component('EditDeletOpetionNew', EditDeletOpetionNew)
  Vue.component('DetaTab', DetaTab)
  Vue.component('CompanyList', CompanyList)
  Vue.directive('permission', permission)
  Vue.prototype.checkPermission = checkPermission
}

export default piugin

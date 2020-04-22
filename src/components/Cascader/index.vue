<template>
  <el-cascader
    v-model="CascaderModel"
    :options="options"
    :props="cascaderprops"
    :disabled="disabled"
    style="width:100%"
    @change="handleChange"
    @active-item-change="ExpandChange"
  />
</template>

<script>
import { SysArealist } from '@/api/Common'

export default {
  name: 'Cascader',
  props: {
    cascaderprops: {
      type: Object
    },
    disabled: {
      type: Boolean,
      default: false
    },
    model: {
      type: Array
    },
    native: {
      type: Boolean, // 是否为籍贯
      default: false
    }
  },
  data() {
    return {
      options: [],
      CascaderModel: ''
    }
  },
  watch: {
    model(obj) {
      if (this.model.length > 0 && this.model) {
        this.CascaderModel = this.model
        this.getSysArealist('0', '0', '', '', this.model)
      } else {
        this.getSysArealist('0', '0')
      }
    }
  },
  mounted() {
    this.$emit('input', this.CascaderModel)
    if (this.model.length > 0 && this.model) {
      this.CascaderModel = this.model
      this.getSysArealist('0', '0', '', '', this.model)
    } else {
      this.getSysArealist('0', '0')
    }
  },
  methods: {
    // 获取行政区域
    async getSysArealist(fParentid, node, index01, index02, editAll) {
      const params = {
        fParentId: fParentid
      }
      const res = await SysArealist(fParentid, params)
      if (res) {
        // 判断是否为最后一级
        if (res.data.length > 0) {
          res.data.map((item, index) => {
            if (node === '0') {
              this.options.push({
                value: item.fAreaId,
                label: item.fAreaName,
                children: []
              })
              if (editAll && item.fAreaId === editAll[0]) {
                this.getSysArealist(editAll[0], '1', index, '', editAll)
              }
            } else if (node === '1') {
              if (!this.native) {
                this.options[index01].children.push({
                  value: item.fAreaId,
                  label: item.fAreaName,
                  children: []
                })
                if (editAll && item.fAreaId === editAll[1]) {
                  this.getSysArealist(editAll[1], '2', index01, index)
                }
              } else {
                this.options[index01].children.push({
                  value: item.fAreaId,
                  label: item.fAreaName
                })
              }
            } else if (node === '2') {
              this.options[index01].children[index02].children.push({
                value: item.fAreaId,
                label: item.fAreaName
              })
            }
          })
        } else {
          if (node === '1') {
            delete this.options[index01].children
          } else if (node === '2') {
            delete this.options[index01].children[index02].children
          }
        }
      }
    },
    // 选择完成返回数据
    handleChange(value) {
      const fareanameAll = []
      const move = {
        areaIdClient: value.join(','),
        areaId: '',
        areaName: '',
        areaName01: '',
        value: value
      }
      this.options.map((item01) => {
        if (item01.value === value[0]) {
          fareanameAll.push(item01.label)
          if (value.length === 1) {
            move.areaName = fareanameAll.join('/')
            move.areaName01 = fareanameAll.join('')
            move.areaId = value[0]
            this.$emit('getCascader', move)
          } else {
            item01.children.map((item02) => {
              if (item02.value === value[1]) {
                fareanameAll.push(item02.label)
                if (value.length === 2) {
                  move.areaName = fareanameAll.join('/')
                  move.areaName01 = fareanameAll.join('')
                  move.areaId = value[1]
                  this.$emit('getCascader', move)
                } else {
                  item02.children.map((item03) => {
                    if (item03.value === value[2]) {
                      fareanameAll.push(item03.label)
                      move.areaName = fareanameAll.join('/')
                      move.areaName01 = fareanameAll.join('')
                      move.areaId = value[2]
                      this.$emit('getCascader', move)
                    }
                  })
                }
              }
            })
          }
        }
      })
    },
    // 判断下一级是否已加载
    ExpandChange(value) {
      this.options.map((item01, index01) => {
        if (value.length === 1) {
          if (item01.value === value[0]) {
            if (item01.children.length <= 0) {
              this.getSysArealist(value[0], '1', index01)
            }
          }
        } else if (value.length === 2) {
          item01.children.map((item02, index02) => {
            if (item02.value === value[1]) {
              if (item02.children.length <= 0) {
                this.getSysArealist(value[1], '2', index01, index02)
              }
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>

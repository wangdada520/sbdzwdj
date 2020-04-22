<template>
  <div class="department-cascader-root" :class="cover?'cover':''">
    <el-cascader
      ref="cascader"
      v-model="current"
      :class="cover?'cover':''"
      :size="size"
      :options="options"
      :placeholder="placeholder"
      :disabled="disabled"
      :clearable="clearable"
      :show-all-levels="showAllLevels"
      :props="props"
      @change="onChange"
      @expand-change="onExpandChange"
    />
  </div>
</template>

<script>
import { list } from '@/api/SysDepartment'
import cloneDeep from 'lodash/cloneDeep'

export default {
  name: 'DepartmentCascader',

  props: {
    placeholder: {
      type: String,
      default: '请选择单位'
    },
    size: {
      type: String,
      default: 'mini'
    },
    cover: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    expandTrigger: {
      type: String,
      default: 'click'
    },
    showAllLevels: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    checkStrictly: {
      type: Boolean,
      default: true
    },
    parameter: {
      type: [Array, String],
      default: ''
    }
  },

  data() {
    return {
      current: '',
      options: []
    }
  },

  computed: {
    props() {
      return {
        multiple: this.multiple,
        checkStrictly: this.checkStrictly,
        expandTrigger: this.expandTrigger
      }
    }
  },

  watch: {
    parameter() {
      this.current = this.parameter
    }
  },

  mounted() {
    this.init()
    this.current = this.parameter
  },

  methods: {
    async init() {
      let { data } = await list({
        pageNum: 0,
        pageSize: 5000,
        search: {}
      })
      this.options = []
      if (data.length) {
        data = data.map(item => {
          return {
            value: item.departmentid,
            label: item.deptname,
            ...item
          }
        })
        data = this.totree(data, {
          idProp: 'value',
          parentProp: 'parentdeptid',
          childrenProp: 'children'
        })
        this.options = data
      }
    },

    onChange(current) {
      const $cascader = this.$refs.cascader
      const result = $cascader.getCheckedNodes()
      const ids = result.map(item => item.value)
      const names = result.map(item => item.label)
      this.$emit('onChange', ids, names)
    },

    onExpandChange(list) {
      this.$emit('onExpandChange', list)
    },

    /**
    idProp?: string // 用于匹配的属性
    parentProp?: string // 指向父节点的属性
    childrenProp?: string // 树状结构表示子节点的属性
    open?: string | boolean // 当为布尔值时表示是否展开子节点,当为字符串时表示需要展开的节点匹配属性
    expand?: string // 展开指定节点
    selected?: string // 设置选中节点，根据每个节点的 idProp 设置 selected 属性为 true
    hasLevel?: boolean // 用于给每一个节点添加 level 属性，代表节点当前的层次，从 0 开始计算
    checked?: Array<string> // 批量设置多选框选中状态
    disabled?: Array<string> // 批量设置多选框禁用状态
    isReturnhash?: Boolean // 是否一并返回树数据的hash，设置后函数将返回 [result, hash]
    indexProp?: string // 用于排序的属性
    isSort?: Boolean // 是否根据 indexProp 进行同层次排序
    isCloneDeep?: Boolean
     */
    totree(data, params, isReturnhash = false) {
      const {
        idProp = 'id',
        parentProp = 'parent_id',
        childrenProp = 'children',
        indexProp = 'index',
        selected = '',
        checked = [],
        disabled = [],
        open = true,
        expand = '',
        hasLevel = false,
        isSort = false,
        isCloneDeep = true
      } = params || {}

      const result = []
      const hash = {}
      const len = data.length
      const hasChecked = !!checked.length
      const hasDisabled = !!disabled.length
      if (isCloneDeep) {
        data = cloneDeep(data)
      }
      for (let i = 0; i < len; i++) {
        const current = data[i]
        if (!!selected && current[idProp] === selected) {
          current.selected = true
        }
        if (hasChecked && checked.indexOf(current[idProp]) !== -1) {
          current.checked = true
        }
        if (hasDisabled && disabled.indexOf(current[idProp]) !== -1) {
          current.disabled = true
        }
        hash[current[idProp]] = current
      }

      const path = [expand]
      if (typeof open === 'string' && open !== '') {
        let parent = hash[open]
        while (parent && parent[parentProp]) {
          path.push(parent[parentProp])
          parent = hash[parent[parentProp]]
        }
      }

      for (let j = 0; j < len; j++) {
        const current = data[j]
        if (typeof open === 'string' && open !== '') {
          current.expand = path.indexOf(current[idProp]) > -1
        } else {
          current.expand = !!open
        }
        const hashParent = hash[current[parentProp]]
        if (hashParent) {
          !hashParent[childrenProp] && (hashParent[childrenProp] = [])
          hashParent[childrenProp].push(current)
        } else {
          result.push(current)
        }
      }

      if (hasLevel) {
        this.setLevel(result, { childrenProp: childrenProp })
      }

      if (isSort) {
        this.sortTree(result, { childrenProp: childrenProp, indexProp: indexProp })
      }

      if (typeof isReturnhash === 'boolean' && isReturnhash) {
        return [result, hash]
      }

      return result
    }
  },

  /**
   * 可通过树节点的 index 属性排序树节点
   * @param data
   * @param param1
   */
  sortTree(data, { childrenProp = 'children', indexProp = 'index' }) {
    const self = this
    if (!data.length) return
    data.sort((val1, val2) => {
      const val1Index = this.getAttributesByStr(val1, indexProp)
      const val2Index = this.getAttributesByStr(val2, indexProp)
      if (val1Index > val2Index) {
        return 1
      } else if (val1Index < val2Index) {
        return -1
      } else {
        return 0
      }
    })
    data.forEach(item => {
      if (item[childrenProp]) {
        self.sortTree(item[childrenProp], { childrenProp, indexProp })
      }
    })
  },

  setLevel(data, { childrenProp = 'children', count = 0 } = {}) {
    const self = this
    data.forEach(item => {
      item.level = count
      if (item[childrenProp]) {
        self.setLevel(item[childrenProp], { childrenProp, count: count + 1 })
      }
    })
  },

  /**
   * 假设 a = { b: { c: 1 } }, 可以通过 a['b.c'] 获取对应属性
   * @param data
   * @param attrStr
   */
  getAttributesByStr(data, attrStr) {
    const attrArr = attrStr.split('.')
    if (attrArr.length === 1) {
      return data[attrArr[0]]
    } else {
      const result = attrArr.reduce((pre, cur) => {
        if (!pre[cur]) {
          return {
            _error: true
          }
        }
        return pre[cur]
      }, data)
      if (result._error) {
        return undefined
      } else {
        return result
      }
    }
  }
}
</script>

<style scoped>
.department-cascader-root{
  width: max-content;
  height: max-content;
}
  .cover{
    width: 100%;
  }
</style>

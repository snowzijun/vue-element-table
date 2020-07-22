/* eslint-disable no-unused-vars */
import { Option, Select } from 'element-ui'

// import { get as getLookup } from '../../../utils/lookup'

// 是否已经加载过数据了，用于没有设置initFetchOn的情况
const hasLoadedFlag = Symbol('hasLoadedFlag')
// 如果设置了initFetchOn,则需要记录表达式的值，如果发生变化，则重新请求数据
const expressionFlag = Symbol('expressionFlag')
export default {
  inheritAttrs: false,
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  computed: {
    options() {
      const { options } = this.$attrs
      // 有时候options 是异步获取到的，所以需要设置options为函数，然后返回options的数据
      if (typeof options === 'function') {
        return options(this.$attrs)
      }
      return options
    },
    val: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    // 获取 选项VNode
    getOptionNodes() {
      const { options } = this
      return options.map(props => {
        return <Option {...{ props: props }}></Option>
      })
    }
  },

  render(h) {
    // 此处options作用是从 this.field中排除掉
    const {
      prop,
      options,
      type,
      events = {},
      clearable = false,
      ...rest
    } = this.$attrs
    return (
      <Select
        clearable={clearable}
        v-model={this.val}
        {...{
          props: rest,
          on: {
            ...events
          }
        }}
      >
        {this.getOptionNodes()}
      </Select>
    )
  }
}

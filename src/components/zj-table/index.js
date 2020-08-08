import Schema from 'async-validator'
import {
  Button,
  DatePicker,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Input,
  InputNumber,
  Link,
  Message,
  Pagination,
  Table,
  TableColumn,
  TimeSelect
} from 'element-ui'
import { throttle } from 'lodash'
import ZjSelect from './fields/select'
import './index.scss'

const tableProps = {
  defaultExpandAll: Table.props.defaultExpandAll,
  treeProps: Table.props.treeProps,
  expandRowKeys: Table.props.expandRowKeys
}

/* eslint-disable no-unused-vars */
export default {
  name: 'ZjTable',
  inheritAttrs: false,
  props: {
    ...Table.props,
    // 表格数据
    data: {
      type: Array,
      default: () => []
    },
    /**
     * 字段列信息
     *  {
     *    label: '名称',
     *    prop: '字段属性',
     *    // 表头嵌套
     *    nests: [],
     *    editable: 是否可编辑,
     *    field: {}// 编辑的字段属性,
     *    beforeEdit: (row,column,cellValue,index) => true 编辑前触发，返回true可编辑
     *  }
     *
     */
    columns: {
      type: Array,
      default: () => []
    },
    // 工具条按钮
    buttons: {
      type: Array,
      default: () => []
    },
    // 是否分页
    pagination: {
      type: Boolean,
      default: true
    },
    // 每页条数
    pageSize: {
      type: Number,
      default: 10
    },
    // 总条数
    total: {
      type: Number,
      default: 0
    },
    // 当前页码
    currentPage: {
      type: Number,
      default: 1
    },
    // 是否显示复选框
    selectable: {
      type: Boolean,
      default: true
    },
    // 是否显示序号列
    sequence: {
      type: Boolean,
      default: false
    },
    /**
     * 默认表格的高度是充满父容器的
     * 如果height 设置为 'auto',则表格高度将会根据内容自动撑起来
     */
    height: {
      type: [Number, String],
      default: 0
    },
    // 表格是否排序
    sortable: {
      type: Boolean,
      default: false
    },
    // 行唯一值
    rowKey: {
      type: String,
      default: 'id'
    }
  },
  data() {
    return {
      // 复选框选中的行
      selectRows: [],
      // 点击行选中的当前行
      currentRow: undefined,
      // 内部高度，动态计算
      innerHeight: 0,
      // 行编辑开启的行索引集合
      editRowsKey: [],
      // 行编辑的编辑数据，key值为行索引
      editRowsData: {},
      // 分页条的高度 TODO: 暂时写死，
      paginationHeight: 52,
      // 按钮区域的高度 TODO: 暂时写死
      buttonHeight: 42
    }
  },
  computed: {
    // 计算表格区域高度
    tableHeight() {
      const {
        height,
        innerHeight,
        pagination,
        buttons,
        buttonHeight,
        paginationHeight
      } = this
      if (height) {
        let customHeight = height
        if (typeof customHeight === 'string') {
          if (customHeight.endsWith('px')) {
            customHeight = parseFloat(customHeight)
          }
        }
        if (typeof customHeight === 'number') {
          return (
            customHeight -
            (pagination ? paginationHeight : 0) -
            (buttons.length ? buttonHeight : 0)
          )
        }
        return customHeight
      } else {
        return innerHeight
      }
    },
    // 计算表格容器的高度
    tableContainerHeight() {
      const { height, tableHeight } = this
      if (height) {
        if (typeof height === 'number') {
          return `${height}px`
        }
        return height
      }
      return '100%'
    }
  },
  mounted() {
    // 如果没有设置高度，则自动计算高度
    if (!this.height) {
      this.innerHeight = this.$refs.table.$el.parentElement.offsetHeight
      this._listenerResize()
    }
  },
  // 当表格所在页面存在keepalive时，需要在页面显示时重新布局表格
  activated() {
    this.doLayout()
  },
  watch: {
    'data.length': {
      handler(n, o) {
        if (n === 0 && o > 0 && this.currentPage > 1) {
          this.$_handlePageCurrentChange(this.currentPage - 1)
        }
      }
    },
    editRowsData: {
      handler(newValue) {
        const { rowKey } = this
        // 如果编辑的数据发生变化，则对外暴露edit-change事件
        this.$emit(
          'edit-change',
          this.data.map(item => {
            return newValue[item[rowKey]]
          })
        )
      },
      deep: true
    }
  },
  methods: {
    // 监听表格尺寸变化
    _listenerResize() {
      const listenerResize = throttle(() => {
        this.innerHeight = this.$refs.table.$el.parentElement.offsetHeight
      }, 200)
      window.addEventListener('resize', listenerResize)
      // 渲染完成之后立即执行一次，保证不会出现滚动条
      this.$nextTick(() => {
        listenerResize()
      })
      // 销毁时候释放监听的事件
      this.$once('hook:beforeDestroy', () => {
        window.removeEventListener('resize', listenerResize)
      })
    },
    // 渲染表格
    $_renderTable(h) {
      const { data, tableHeight, rowKey } = this
      const originTableProps = Object.keys(tableProps).reduce(
        (result, item) => {
          result[item] = this[item]
          return result
        },
        {}
      )
      const props = {
        ...originTableProps,
        ...this.$attrs
      }
      if (tableHeight && tableHeight !== 'auto') {
        props['height'] = tableHeight
      }
      console.log('tableHeight', tableHeight)
      const table = (
        <div class="zj-table__container">
          <Table
            data={data}
            highlightCurrentRow
            rowKey={rowKey}
            border
            {...{
              on: {
                ...this.$listeners,
                'selection-change': this.$_handleTableSelectionChange,
                'current-change': this.$_handleTableCurrentChange,
                'sort-change': this.$_handleSortChange,
                'row-click': this.$_handleRowClick,
                select: this.$_handleSelect
              },
              props: {
                ...props
              }
            }}
            class="zj-table__body"
            ref="table"
          >
            {this.$_renderAllColumns(h)}
          </Table>
        </div>
      )
      return table
    },
    // 获取checkbox 列
    $_getSelectionColumn(h) {
      const { selectable } = this
      return selectable
        ? [<TableColumn type="selection" width="40" fixed="left" />]
        : []
    },
    // 获取序号列
    $_getSequenceColumn(h) {
      const { sequence } = this
      if (sequence) {
        return [
          <TableColumn
            resizable={false}
            label="序号"
            width="50"
            type="index"
            fixed="left"
            align="center"
            index={index => index + 1}
          />
        ]
      }
      return []
    },
    // 渲染所有的表格列，包括序号列和复选框列
    $_renderAllColumns(h) {
      const { columns } = this

      const colNodes = [
        ...this.$_getSelectionColumn(h),
        ...this.$_getSequenceColumn(h)
      ]

      colNodes.push(...this.$_renderColumns(h, columns))

      return colNodes
    },
    // 渲染表格列
    $_renderColumns(h, columns) {
      // 整体是否排序
      let sortable = this.sortable ? 'custom' : false
      return columns
        .filter(column => {
          const { hidden } = column
          if (hidden !== undefined) {
            if (typeof hidden === 'function') {
              return !hidden({
                columns,
                column
              })
            }
            return !hidden
          }
          return true
        })
        .map(column => {
          const {
            useSlot = false,
            // 如果存在操作按钮，则actions为非空数组
            actions = [],
            // 是否可编辑列， 对于可编辑列需要动态启用编辑
            editable = false,
            // 是否有嵌套列
            nests,
            // 是否可点击
            link = false
          } = column
          let newSortable = sortable
          if (column.sortable !== undefined) {
            newSortable = column.sortable ? 'custom' : false
          }
          column = {
            ...column,
            sortable: newSortable
          }
          if (nests && nests.length) {
            // 使用嵌套列
            return this.$_renderNestColumn(h, column)
          } else if (editable) {
            // 使用编辑列
            return this.$_renderEditColumn(h, column)
          } else if (useSlot) {
            // 使用插槽列
            return this.$_renderSlotColumn(h, column)
          } else if (actions && actions.length > 0) {
            // 使用操作列
            column.sortable = false
            return this.$_renderActionColumn(h, column)
          } else if (link) {
            // 使用链接列
            return this.$_renderLinkColumn(h, column)
          } else {
            // 使用默认列
            return this.$_renderDefaultColumn(h, column)
          }
        })
    },
    // 渲染嵌套列
    $_renderNestColumn(h, column) {
      const { label, nests } = column
      return (
        <TableColumn label={label} headerAlign="center">
          {this.$_renderColumns(h, nests)}
        </TableColumn>
      )
    },
    // 渲染链接列
    $_renderLinkColumn(h, column) {
      const { events = {}, prop, ...rest } = column
      return (
        <TableColumn
          showOverflowTooltip
          {...{
            props: {
              ...rest,
              prop
            },
            on: {
              ...events
            },
            scopedSlots: {
              default: ({ row, column, $index }) => {
                const onClick = throttle(
                  () => {
                    try {
                      this.$emit('link-click', {
                        row,
                        column,
                        $index,
                        prop,
                        cellValue: row[prop]
                      })
                    } catch (e) {
                      console.error('link click error:', e.message)
                    }
                  },
                  100,
                  { trailing: false }
                )

                return (
                  <Link type="primary" onClick={onClick} class="zj-table__link">
                    {row[prop]}
                  </Link>
                )
              }
            }
          }}
        />
      )
    },
    // 渲染默认列
    $_renderDefaultColumn(h, column) {
      const { events = {}, minWidth = '100', ...rest } = column
      return (
        <TableColumn
          minWidth={minWidth}
          showOverflowTooltip
          {...{
            props: rest,
            on: {
              ...events
            }
          }}
        />
      )
    },
    // 渲染操作列
    $_renderActionColumn(h, column) {
      const {
        label,
        // 如果存在操作按钮，则actions为非空数组
        actions = [],
        events = {},
        minWidth = '150',
        fixed = 'right',
        align = 'center',
        width = 120
      } = column
      const buttonScope = this.$scopedSlots.action
      return (
        <TableColumn
          resizable={false}
          label={label}
          minWidth={minWidth}
          fixed={fixed}
          align={align}
          width={width}
          className="zj-table__actioncolumn"
          {...{
            scopedSlots: {
              default: ({ row, column, $index }) => {
                return this.$_renderButtons(
                  h,
                  actions,
                  {
                    type: 'text'
                  },
                  buttonScope,
                  [row, column, $index],
                  // 插槽的参数
                  {
                    row,
                    column,
                    $index
                  }
                )
              }
            },
            on: {
              ...events
            }
          }}
        />
      )
    },

    // 渲染插槽列
    $_renderSlotColumn(h, column) {
      const {
        prop,
        label,
        minWidth = '120',
        events = {},
        align = 'left',
        field,
        useSlot,
        ...rest
      } = column
      const columnScope = this.$scopedSlots.column
      const headerScope = this.$scopedSlots.header
      return (
        <TableColumn
          prop={prop}
          label={label}
          minWidth={minWidth}
          align={align}
          showOverflowTooltip
          {...{
            scopedSlots: {
              default: scope => {
                if (columnScope) {
                  return columnScope({
                    ...scope,
                    prop,
                    field,
                    cellValue: scope.row[prop]
                  })
                }

                return scope.row[prop]
              },
              header: scope => {
                if (headerScope) {
                  return headerScope({
                    ...scope,
                    label,
                    field,
                    prop
                  })
                }
                return scope.column.label
              }
            },
            props: rest,
            on: {
              ...events
            }
          }}
        />
      )
    },
    // 渲染编辑列
    $_renderEditColumn(h, column) {
      const { rowKey } = this
      const {
        prop,
        label,
        field = {},
        events = {},
        align = 'left',
        useSlot = false,
        beforeEdit = () => true,
        formatter,
        width
      } = column
      const rules = field.rules || []
      const columnSlotName =
        typeof useSlot === 'boolean' ? 'column' : `column-${useSlot}`
      const columnScope = this.$scopedSlots[columnSlotName]
      // 判断列是否必填，如果必填，需要添加必填样式
      const isRequired = rules.some(rule => rule.required)

      return (
        <TableColumn
          prop={prop}
          label={label}
          width={width}
          align={align}
          showOverflowTooltip
          labelClassName={isRequired ? 'zj-table__column--required' : ''}
          {...{
            scopedSlots: {
              default: scope => {
                if (
                  !this.editRowsKey.includes(scope.row[rowKey]) ||
                  !beforeEdit(
                    scope.row,
                    scope.column,
                    scope.row[prop],
                    scope.$index
                  )
                ) {
                  if (columnScope && useSlot) {
                    return columnScope({
                      ...scope,
                      prop,
                      cellValue: scope.row[prop]
                    })
                  } else if (formatter) {
                    return formatter(
                      scope.row,
                      scope.column,
                      scope.row[prop],
                      scope.$index
                    )
                  } else {
                    return scope.row[prop]
                  }
                } else {
                  return this.$_renderEditCell(h, {
                    ...field,
                    prop,
                    rowId: scope.row[rowKey]
                  })
                }
              }
            },
            on: {
              ...events
            }
          }}
        />
      )
    },
    // 编辑单元格
    $_renderEditCell(h, field) {
      const components = {
        input: Input,
        select: ZjSelect,
        date: DatePicker,
        time: TimeSelect,
        number: InputNumber
      }
      const componentType = field.componentType
      const component = components[componentType]
      if (component) {
        return this.$_renderField(h, field, component)
      } else if (componentType === 'custom') {
        // 如果自定义，可以通过component指定组件
        return this.$_renderField(h, field, field.component)
      }
      return this.$_renderField(h, field, Input)
    },
    $_renderField(h, field, Component) {
      // 编辑行的id字段
      const { rowId, events = {}, nativeEvents = {} } = field

      const getEvents = events => {
        const newEvents = {}
        Object.keys(events).forEach(key => {
          const event = events[key]
          newEvents[key] = (...rest) => {
            const args = [
              ...rest,
              {
                rowId,
                row: this.editRowsData[rowId],
                value: this.editRowsData[rowId][field.prop]
              }
            ]
            return event(...args)
          }
        })
        return newEvents
      }
      // 事件改写
      const newEvents = getEvents(events)
      const newNativeEvents = getEvents(nativeEvents)
      return (
        <Component
          size="small"
          on={newEvents}
          nativeOn={newNativeEvents}
          v-model={this.editRowsData[rowId][field.prop]}
          {...{
            attrs: field,
            props: field
          }}
        />
      )
    },
    // 渲染工具条按钮区域
    $_renderToolbarButtons(h) {
      const { buttons, selectable } = this
      // 工具条按钮
      let toolbarBtns = null
      if (buttons.length > 0) {
        console.log(buttons)
        const buttonScope = this.$scopedSlots.button
        return this.$_renderButtons(
          h,
          buttons,
          { size: 'small' },
          buttonScope,
          [selectable ? this.selectRows : this.currentRow],
          {
            rows: selectable ? this.selectRows : this.currentRow
          }
        )
      }
      return toolbarBtns
    },
    // 预处理操作按钮
    _preActionButtons(actions, ...args) {
      /**
       * 分析函数属性
       * @param {Function, String ,Boolean} prop 要分析的属性
       */
      const analyseFunProp = prop => {
        return typeof prop === 'function' ? prop(...args) : prop
      }
      return actions
        .filter(({ before = true }) => {
          return analyseFunProp(before)
        })
        .map(({ click, disabled = false, children = [], ...rest }) => {
          // 特殊处理点击事件
          const onClick =
            click &&
            throttle(() => click(...args), 100, {
              trailing: false
            })
          return {
            click: onClick || (() => ({})),
            disabled: analyseFunProp(disabled),
            children: this._preActionButtons(children, ...args),
            ...rest
          }
        })
    },
    /**
     * 渲染按钮统一处理方法
     * @param {*} h
     */
    // eslint-disable-next-line max-params
    $_renderButtons(h, buttons, props, slot, args, slotArgs) {
      const newActions = this._preActionButtons(buttons, ...args)

      return newActions.map(btn => {
        const { click, text, children, useSlot, directives = [], ...rest } = btn
        const hasChildren = children && children.length
        if (useSlot) {
          if (!slot) {
            throw new Error('请添加插槽')
          }
          return slot({
            ...btn,
            ...slotArgs
          })
        }
        const button = (
          <Button
            {...{ props: { ...rest, ...props }, directives }}
            onClick={click}
          >
            {text}
            {hasChildren ? (
              <i class="el-icon-arrow-down el-icon--right"></i>
            ) : (
              undefined
            )}
          </Button>
        )
        if (hasChildren) {
          const events = {}
          // 处理下拉事件
          const dropdownClick = command => {
            const click = events[command]
            click(...args)
          }
          return (
            <Dropdown onCommand={dropdownClick}>
              {button}
              <DropdownMenu slot="dropdown">
                {children.map(({ id, text, click, ...rest }) => {
                  if (id === undefined) {
                    throw new Error('请为按钮添加id')
                  }
                  events[id] = click
                  return (
                    <DropdownItem command={id} key={id} {...{ props: rest }}>
                      {text}
                    </DropdownItem>
                  )
                })}
              </DropdownMenu>
            </Dropdown>
          )
        } else {
          return button
        }
      })
    },

    // 渲染工具栏
    $_renderToolbar(h) {
      const buttons = this.$_renderToolbarButtons(h)
      const toolbarSlot = this.$slots.toolbar
      if (buttons || toolbarSlot) {
        return (
          <div class="zj-table__toolbar">
            <div class="zj-table__buttons">
              {buttons}
              {/** 可以将自定义内容插入工具条 */}
              {toolbarSlot}
            </div>
          </div>
        )
      }
      return null
    },
    // 渲染分页
    $_renderPage(h) {
      const { pagination, pageSize, total, currentPage } = this
      return pagination ? (
        <div class="zj-table__page">
          <Pagination
            background
            total={total}
            currentPage={currentPage}
            pageSize={pageSize}
            layout="total,sizes,prev,pager,next,jumper"
            {...{
              on: {
                'size-change': this.$_handlePageSizeChange,
                'current-change': this.$_handlePageCurrentChange
              }
            }}
          />
        </div>
      ) : null
    },
    // 表格每页条数发生变化触发
    $_handlePageSizeChange(pageSize) {
      const { total, currentPage } = this
      this.$emit('update:pageSize', pageSize)
      // 如果总页码小于当前页码，则当前页码会变化，触发handleCurrentChange
      if (Math.ceil(total / pageSize) >= currentPage) {
        this.$emit('page-change', {
          pageSize
        })
      }
    },
    // 表格页码发生变化触发
    $_handlePageCurrentChange(currentPage) {
      this.$emit('update:currentPage', currentPage)
      this.$emit('page-change', {
        currentPage
      })
    },
    // 当选择项发生变化时会触发该事件
    $_handleTableSelectionChange(selection) {
      this.selectRows = selection
      this.$emit('selection-change', selection)
    },
    $_handleSelect(selection, row) {
      this.setCurrentRow(row)
      this.$emit('select', selection, row)
    },
    $_handleRowClick(row, column, event) {
      // 行点击时 只能选中一行
      this.$refs.table.clearSelection()
      this.toggleRowSelection(row, true)
      this.$emit('row-click', row, column, event)
    },
    // 表格的当前行发生变化的时候会触发该事件
    $_handleTableCurrentChange(newRow, oldRow) {
      this.currentRow = newRow

      this.$emit('current-change', newRow, oldRow)
    },
    // 排序
    $_handleSortChange({ prop, order }) {
      if (order) {
        this.$emit('sort-change', {
          propName: prop,
          asc: order === 'ascending'
        })
      } else {
        this.$emit('sort-change', {})
      }
    },
    // 通过行索引编辑行
    startEditRow(key) {
      if (key === undefined || key === null) {
        throw new Error('请指定要编辑的行key')
      }
      const { editRowsKey } = this
      // 如果当前行未开启行编辑，再开启
      if (!editRowsKey.includes(key)) {
        const rowData = this._findDataByKey(key)
        if (!rowData) {
          throw new Error('未找到当前值对应的行数据')
        }
        const { columns } = this
        // 必须使用$set,否则新增的key不起作用
        this.$set(
          this.editRowsData,
          key,
          columns
            .filter(col => col.editable)
            .reduce(
              (res, col) => {
                res[col.prop] = rowData[col.prop]
                return res
              },
              { ...rowData }
            )
        )
        this.editRowsKey.push(key)
        return true
      }
      return false
    },
    // 通过给定的key值寻找行数据
    _findDataByKey(value) {
      const { rowKey, data } = this
      const find = (value, data) => {
        let dt
        for (let i = 0; i < data.length; i++) {
          dt = data[i]
          if (dt[rowKey] === value) {
            return dt
          } else if (dt.children) {
            dt = find(value, dt.children)
            if (dt) {
              return dt
            }
          }
        }
      }
      return find(value, data)
    },
    // 是否编辑行
    isEditRow() {
      return this.editRowsKey.length
    },
    // 停止编辑行
    endEditRow(id, callback) {
      this._validateAll(id, callback)
    },
    // 取消编辑行, 如果没有传入取消的id，则取消所有
    cancelEditRow(id) {
      if (id) {
        this.editRowsKey.splice(this.editRowsKey.indexOf(id), 1)
        delete this.editRowsData[id]
      } else {
        this.editRowsKey = []
        this.editRowsData = {}
      }
    },
    // 获取复选框选中的行
    getSelectionRows() {
      return this.selectRows
    },
    // 获取单选选中的行
    getCurrentRow() {
      return this.currentRow
    },
    // 设置当前选中的行
    setCurrentRow(row) {
      this.$refs.table.setCurrentRow(row)
    },
    // 设置当前选中的行展开
    toggleRowExpansion(row, isExpand) {
      this.$refs.table.toggleRowExpansion(row, isExpand)
    },
    // 验证编辑的行
    validateEditRows() {
      return new Promise((resolve, reject) => {
        this._validateAll((valid, params) => {
          if (valid) {
            resolve(this.getEditFieldValues())
          } else {
            reject(params)
          }
        })
      })
    },
    /**
     * 获取行编辑的数据，如果指定了要获取的行数据，则将单行数据返回，否则返回一个行数组
     * @param {string,number} id 如果指定了id，则只获取rowKey=id的行数据
     */
    getEditFieldValues(id) {
      const { rowKey } = this
      if (id) {
        return this.editRowsData[id]
      } else {
        return Object.entries(this.editRowsData).map(([key, value]) => {
          return {
            [rowKey]: key,
            ...value
          }
        })
      }
    },
    /**
     * 设置行编辑的字段数据
     * @param {string,number} id  行标识， 对应 rowKey的值
     * @param {Object} formData  字段数据
     */
    setEditFieldValues(id, formData) {
      this.editRowsData[id] = {
        ...this.editRowsData[id],
        ...formData
      }
    },
    toggleRowSelection(row, select) {
      this.$refs.table.toggleRowSelection(row, select)
    },

    // 重新布局表格
    doLayout() {
      this.$refs.table.doLayout()
      this._listenerResize()
    },
    _validateAll(id, callback) {
      if (callback === undefined) {
        callback = id
        id = undefined
      }
      const { columns, editRowsData } = this
      // 获取所有列的校验规则
      const descriptor = columns
        .filter(col => {
          if (col.editable && col.field) {
            return col.field.rules && col.field.rules.length
          }
          return false
        })
        .reduce((result, column) => {
          result[column.prop] = column.field.rules
          return result
        }, {})
      const validator = new Schema(descriptor)
      // 校验方法
      const validate = data => {
        return new Promise((resolve, reject) => {
          console.log(data, 'vilidate')
          validator.validate(data, { firstField: true }, (errors, fields) => {
            if (errors) {
              reject(errors)
            } else {
              resolve()
            }
          })
        })
      }

      const errorFun = ({ field, message }) => {
        callback(false, {
          prop: field,
          message: message
        })
      }

      const success = id => {
        let cb
        if (id !== undefined) {
          cb = callback(
            true,
            { ...this.editRowsData[id] },
            {
              ...this._findDataByKey(id)
            }
          )
        } else {
          // 多行编辑
          cb = callback(
            true,
            ...this.editRowsKey.reduce(
              (result, id) => {
                result[0].push({ ...this.editRowsData[id] })
                result[1].push({ ...this._findDataByKey(id) })
                return result
              },
              [[], []]
            )
          )
        }

        const endEdit = () => {
          if (id) {
            delete this.editRowsData[id]
            this.editRowsKey.splice(this.editRowsKey.indexOf(id), 1)
          } else {
            this.editRowsData = {}
            this.editRowsKey = []
          }
        }
        if (cb instanceof Promise) {
          cb.then(() => {
            endEdit()
          }).catch(error => {
            Message.error(error)
          })
        } else {
          endEdit()
        }
      }

      // 如果指定的校验行，那么值校验单行即可
      if (id) {
        validate(editRowsData[id])
          .then(() => {
            success(id)
          })
          .catch(errors => {
            console.error(errors, 1)
            errorFun(errors[0])
          })
      } else {
        // 校验所有行
        Promise.all(
          Object.entries(editRowsData).map(([key, data]) => {
            return validate(data)
          })
        )
          .then(() => {
            success()
          })
          .catch(errors => {
            console.error(errors, 2)
            errorFun(errors[0])
          })
      }
    }
  },

  render(h) {
    const toolbar = this.$_renderToolbar(h)
    const table = this.$_renderTable(h)
    const page = this.$_renderPage(h)

    return (
      <div class="zj-table" style={{ height: this.tableContainerHeight }}>
        {toolbar}
        {table}
        {page}
      </div>
    )
  }
}

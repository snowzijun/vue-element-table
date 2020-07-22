
### 介绍
将表格常用的功能进行了整合封装，能高效完成常规业务开发

### API

#### 表格属性

| 参数 | 说明 | 类型 | 默认值 |
-|-|-|-
| columns | 表格列,详见字段属性说明 | `Array<Object>` | `[]`
| buttons| 表格上方的按钮，详见按钮字符说明| `Array<Object>` | `[]`
| pagination | 是否启用分页  | `Boolean` | `false`
| pageSize | 分页后每页条数 | `Number` | `10`
| total | 分页后数据总条数  | `Number` | `0`
| currentPage | 分页后当前页码 | `Number` | `0`
| selectable | 表格是否显示复选框 | `Boolean` | `true`
| sequence | 表格前是否显示序号列 | `Boolean` | `false`
| height | 表格高度,只有在特定情况下使用 | `Number | String | auto`

#### 表格事件
*表格除了以下事件外，可以使用element ui 表格组件的其他所有事件*
| 事件名 | 说明 | 参数
-|-|-
| query | 有搜索字段后点击搜索按钮触发 | `formData`:输入的搜索条件
| page-change | 用户修改分页条数，页码等触发 | -
| selection-change | 用户修改复选框选中的行时触发 | `selection`: 选中的行数据
| current-change | 用户点击行时触发 | `current`: 点击的行数据
| sort-change | 在启用表头排序后排序状态发生变化触发 | -

#### 表格方法
| 方法名 | 说明 | 参数 | 返回值
-|-|-|-
| startEditRow | 开始行编辑 | `index`: 编辑的行索引 | -
| endEditRow | 结束行编辑 | `callback(valid, data, rows)`: 回调函数， valid: 行编辑验证是否成功 data: 验证成功行编辑数据，失败时为失败原因 rows: 编辑的这一行的原始数据| -
| isEditRow | 当前表格是否正在行编辑 | - | `result:Boolean`
| cancelEditRow | 取消行编辑 | - | -
| getSelectionRows | 获取复选框选中的行 | - | `rows:Array<row>` |
| getCurrentRow | 获取点击行选中的行 | - | `row:Object`
| setCurrentRow | 单行选中时设置选中的行 | `row:Object`| -
| getEditFieldValues | 获取正在编辑的行的数据 | - | `data:Object`
| setEditFieldValues | 设置正在编辑行的数据 | `data:Object` | -
| toggleRowSelection | 启用复选后切换行的选中状态 | `row: Object, select: Boolean` | -
| resetQueryFields | 重置搜索条件 | - | -
| doLayout | 重新布局表格,当表格父容器由隐藏状态变为显示时，可能表格布局会错乱 | - | -

#### 内置插槽
| 插槽 | 说明 | 参数 |
-|-|-
| column | 表格列插槽，可以自定义表格列渲染方式 | `{row,column,prop,cellValue,$index,field}`  `field`为行编辑字段信息
| header | 自定义表格表头显示方式 | `{label,prop,column, $index, field }`
| button | 自定义表头顶部按钮 | `{button, selectedRow}`  `selectedRow`为选中的表格行数据
| toolbar| 自定义顶部工具条, 工具条会放在左侧按钮与右侧搜索区域中间 | -

#### 列属性
*列属性除以下属性外，elementui 列其他属性均可使用*

| 参数 | 说明 | 类型 | 默认值 |
-|-|-|-
| label | 列名 | `String` | -
| prop | 列属性 | `String` | -
| width | 表头宽度 | `Number` | -
| sortable | 是否排序列 | `Boolean` | `false`
| formatter | 单个元格式化 | `(row,column,cellValue):String`| -
| nests | 嵌套列  | `Array<Column>` | -
| events | 单元格事件，见elementui单元格事件 | `Object<Event>` | -
| actions | 操作列，详见操作列属性 | `Array<Object> ` | -
| editable | 是否可编辑行 | `Boolean` | `false`
| field | 行编辑字符，详见行编辑字段属性 | `Object` | -
| beforeEdit | 当前单元格开启编辑时调用，返回true则开启编辑 | `(row,column,cellValue,index):Boolean`
|useSlot | 是否在当前列使用插槽，插槽名称为 `column` | `Boolean` | `false`
| hidden | 是否隐藏当前列 | `Boolean|Function` | `false`

#### 表头按钮属性
*表头按钮除以下属性外，elementui 按钮其他属性均可使用*
| 参数 | 说明 | 类型 | 默认值 |
-|-|-|-
| id | 按钮唯一标识，必填 | `String|Number` | -
| text| 按钮显示文字 | `String` | -
| icon | 按钮显示图标 | `String` | -
| click | 点击按钮事件,传入选中的行数据 | `(rows):void` | -

#### 行操作按钮属性

| 参数 | 说明 | 类型 | 默认值 |
-|-|-|-
| id | 按钮唯一标识，必填 | `String|Number` | -
| text | 按钮冒泡显示的文字 | `String` | -
| icon | 按钮图标，必填 | `String` | -
| before | 按钮渲染前调用，返回false不渲染按钮 | `(row,column,index):Boolean` | -
| click | 点击按钮事件 | `(row,column,index):void` | -

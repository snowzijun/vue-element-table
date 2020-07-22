<!--
 * @Author: 子君
 * @Date: 2020-07-22 13:19:51
 * @LastEditors: 子君
 * @LastEditTime: 2020-07-22 18:56:39
 * @Description: 行编辑
 * @FilePath: \vue-element-table\example\views\demo\row-edit.vue
-->
<template>
  <zj-table
    ref="table"
    :columns="columns"
    :data="data"
    :pagination="false"
    :selectable="selectable"
    :sequence="sequence"
  />
</template>
<script>
export default {
  data() {
    return {
      columns: Object.freeze([
        {
          label: '姓名',
          prop: 'name',
          editable: true,
          field: {
            componentType: 'input',
            rules: [
              {
                required: true,
                message: '请输入姓名'
              }
            ]
          }
        },
        {
          label: '性别',
          prop: 'sex',
          // 格式化表格,与element-ui 的表格属性相同
          formatter(row, column, cellValue) {
            return cellValue === '1' ? '男' : '女'
          },
          editable: true,
          field: {
            componentType: 'select',
            options: [
              {
                label: '男',
                value: '1'
              },
              {
                label: '女',
                value: '0'
              }
            ]
          }
        },
        {
          label: '年龄',
          prop: 'age',
          editable: true,
          field: {
            componentType: 'number'
          }
        },
        {
          label: '操作',
          actions: [
            {
              id: 'edit',
              text: '编辑',
              before: row => {
                return !this.editIds.includes(row.id)
              },
              click: this.$_handleEdit
            },
            {
              id: 'save',
              text: '保存',
              before: row => {
                return this.editIds.includes(row.id)
              },
              click: this.$_handleSave
            }
          ]
        }
      ]),
      data: [
        {
          // 行编辑必须指定rowKey字段，默认是id,如果修改为其他字段，需要给表格指定row-key="字段名"
          id: '0',
          name: '子君',
          sex: '1',
          age: 18
        },
        {
          // 行编辑必须指定rowKey字段，默认是id,如果修改为其他字段，需要给表格指定row-key="字段名"
          id: '1',
          name: '子君1',
          sex: '0',
          age: 18
        }
      ],
      // 是否显示多选框
      selectable: true,
      // 是否显示序号列
      sequence: true,
      editIds: []
    }
  },
  methods: {
    $_handleEdit(row) {
      // 通过调用 startEditRow 可以开启行编辑
      this.$refs.table.startEditRow(row.id)
      // 记录开启了行编辑的id
      this.editIds.push(row.id)
    },
    $_handleSave(row) {
      this.$refs.table.endEditRow(row.id, (valid, result, oldRow) => {
        if (valid) {
          console.log('修改之后的数据', result)
          console.log('原始数据', oldRow)
          const index = this.editIds.findIndex(item => item === row.id)
          this.editIds.splice(index, 1)
        } else {
          // 如果校验失败，则返回校验的第一个输入框的异常信息
          console.log(result)
          this.$message.error(result.message)
        }
      })
    }
  }
}
</script>

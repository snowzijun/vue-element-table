<!--
 * @Author: 子君
 * @Date: 2020-07-22 13:19:51
 * @LastEditors: 子君
 * @LastEditTime: 2020-07-22 13:39:18
 * @Description: 行编辑
 * @FilePath: \vue-element-table\example\views\demo\row-edit.vue
-->
<template>
  <zj-table
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
          prop: 'name'
        },
        {
          label: '性别',
          prop: 'sex',
          // 格式化表格,与element-ui 的表格属性相同
          formatter(row, column, cellValue) {
            return cellValue === 1 ? '男' : '女'
          }
        },
        {
          label: '年龄',
          prop: 'age'
        },
        {
          label: '操作',
          actions: [
            {
              id: 'edit',
              text: '编辑'
            },
            {
              id: 'save',
              text: '保存'
            }
          ]
        }
      ]),
      data: [
        {
          name: '子君',
          sex: 1,
          age: 18
        }
      ],
      // 是否显示多选框
      selectable: true,
      // 是否显示序号列
      sequence: true
    }
  }
}
</script>

<!--
 * @Author: 子君
 * @Date: 2020-07-21 12:41:42
 * @LastEditors: 子君
 * @LastEditTime: 2020-07-22 12:23:43
 * @Description: 文件说明
 * @FilePath: \vue-element-table\example\views\demo\base.vue
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

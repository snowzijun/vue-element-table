<template>
  <div style="height: 500px;">
    <zj-table :columns="columns" :data="data" :pagination="false" />
  </div>
</template>

<script>
export default {
  components: {},
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

<style scoped>
.app-container {
  height: 100%;
}
</style>

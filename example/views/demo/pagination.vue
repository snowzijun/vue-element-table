<!--
 * @Author: 子君
 * @Date: 2020-07-22 12:24:20
 * @LastEditors: 子君
 * @LastEditTime: 2020-07-22 19:04:29
 * @Description: 使用分页
 * @FilePath: \vue-element-table\example\views\demo\pagination.vue
-->
<template>
  <zj-table
    v-loading="loading"
    :columns="columns"
    :data="data"
    :current-page.sync="currentPage"
    :page-size.sync="pageSize"
    :total="total"
    height="auto"
    @page-change="$_handlePageChange"
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
      data: [],
      // 当前页码
      currentPage: 1,
      // 每页条数
      pageSize: 10,
      // 总条数
      total: 0,
      loading: false
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    // 加载表格数据
    loadData() {
      this.loading = true
      setTimeout(() => {
        this.total = 40
        const { currentPage, pageSize } = this
        this.data = new Array(pageSize).fill({}).map((item, index) => {
          return {
            name: `子君${currentPage + (index + 1) * 10}`,
            sex: Math.random() > 0.5 ? 1 : 0,
            age: Math.floor(Math.random() * 100)
          }
        })
        this.loading = false
      }, 1000)
    },
    $_handlePageChange() {
      // 因为上面设置属性指定了.sync,所以这两个属性会自动变化
      console.log(this.pageSize, this.currentPage)
      this.loadData()
    }
  }
}
</script>

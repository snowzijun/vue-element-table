<!--
 * @Author: 子君
 * @Date: 2020-07-22 12:44:02
 * @LastEditors: 子君
 * @LastEditTime: 2020-08-06 16:03:51
 * @Description: 使用按钮
 * @FilePath: \vue-element-table\example\views\demo\button-slot.vue
-->
<template>
  <zj-table
    v-loading="loading"
    :columns="columns"
    :data="data"
    :current-page.sync="currentPage"
    :page-size.sync="pageSize"
    :total="total"
    :buttons="buttons"
    @page-change="$_handlePageChange"
  >
    <template #button="scope">
      <template v-if="scope.id === 'slot'">
        <el-button>
          自定义顶部按钮
        </el-button>
      </template>
    </template>

    <template #action="{id}">
      <template v-if="id === 'slot'">
        <el-button type="text">
          自定义操作按钮
        </el-button>
      </template>
    </template>
  </zj-table>
</template>
<script>
export default {
  data() {
    return {
      columns: Object.freeze([
        {
          // 可以指定列的宽度，与element-ui原生用法一致
          width: 220,
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
          label: '公众号',
          prop: 'officialAccount'
        },
        // 行编辑按钮，在表格末尾出现，自动锁定右侧
        {
          width: 220,
          label: '操作',
          actions: [
            {
              id: 'follow',
              text: '关注作者',
              click: this.$_handleFollowAuthor
            },
            {
              id: 'slot',
              useSlot: true
            }
          ]
        }
      ]),
      data: [],
      // 当前页码
      currentPage: 1,
      // 每页条数
      pageSize: 10,
      // 总条数
      total: 0,
      loading: false,
      buttons: Object.freeze([
        {
          // id 必须有而且是在当前按钮数组里面是唯一的
          id: 'add',
          text: '新增',
          type: 'primary',
          icon: 'el-icon-circle-plus',
          click: this.$_handleAdd
        },
        {
          id: 'slot',
          useSlot: true
        }
      ])
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
            id: currentPage + (index + 1) * 10,
            name: `子君${currentPage + (index + 1) * 10}`,
            sex: Math.random() > 0.5 ? 1 : 0,
            age: Math.floor(Math.random() * 100),
            officialAccount: '前端有的玩'
          }
        })
        this.loading = false
      }, 1000)
    },
    $_handlePageChange() {
      // 因为上面设置属性指定了.sync,所以这两个属性会自动变化
      console.log(this.pageSize, this.currentPage)
      this.loadData()
    },
    // 新增
    $_handleAdd() {
      this.$alert('点击了新增按钮')
    }
  }
}
</script>

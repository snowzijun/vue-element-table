<!--
 * @Author: 子君
 * @Date: 2020-07-22 12:44:02
 * @LastEditors: 子君
 * @LastEditTime: 2020-08-06 16:52:48
 * @Description: 使用按钮
 * @FilePath: \vue-element-table\example\views\demo\button.vue
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
  />
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
          width: 180,
          label: '操作',
          actions: [
            {
              id: 'follow',
              text: '关注作者',
              click: this.$_handleFollowAuthor
            },
            {
              id: 'edit',
              text: '编辑',
              // 可以通过before控制按钮是否显示，比如下面年龄四十岁的才会显示编辑按钮
              before(row) {
                return row.age < 40
              },
              click: this.$_handleEdit
            },
            {
              id: 'delete',
              text: '删除',
              icon: 'el-icon-delete',
              disabled(row) {
                return row.sex === 0
              },
              // 为了拿到this,这里需要用箭头函数
              click: () => {
                this.$alert('女生被禁止删除了')
              }
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
          id: 'delete',
          text: '删除',
          // rows 是表格选中的行，如果没有选中行，则禁用删除按钮, disabled可以是一个boolean值或者函数
          disabled: rows => !rows.length,
          click: this.$_handleRemove
        },
        {
          id: 'auth',
          text: '这个按钮根据权限显示',
          // 可以通过返回 true/false来控制按钮是否显示
          before: (/** rows */) => {
            return true
          }
        },
        {
          id: 'dropdown',
          text: '下拉按钮',
          children: [
            {
              id: 'moveUp',
              text: '上移',
              icon: 'el-icon-arrow-up',
              click: () => {
                console.log('上移')
              }
            },
            {
              id: 'moveDown',
              text: '下移',
              icon: 'el-icon-arrow-down',
              disabled: rows => !rows.length,
              click: () => {
                console.log('下移')
              }
            }
          ]
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
    },
    // 顶部按钮会自动将表格所选的行传出来
    $_handleRemove(rows) {
      const ids = rows.map(({ id }) => id)
      this.$alert(`要删除的行id为${ids.join(',')}`)
    },
    // 关注作者公众号
    $_handleFollowAuthor() {
      const image = require('../../assets/qrcode.png')
      const h = this.$createElement
      this.$msgbox({
        title: '扫码关注',
        message: h('img', {
          attrs: {
            src: image
          },
          style: {
            width: '400px'
          }
        })
      })
    },
    /**
     * row 这一行的数据
     */
    $_handleEdit(row, column) {
      console.log(row, column)
      this.$alert(`点击了姓名为【${row.name}】的行上的按钮`)
    }
  }
}
</script>

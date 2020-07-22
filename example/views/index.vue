<!--
 * @Author: 子君
 * @Date: 2020-07-21 13:28:35
 * @LastEditors: 子君
 * @LastEditTime: 2020-07-22 13:26:19
 * @Description: 文件说明
 * @FilePath: \vue-element-table\example\views\index.vue
-->
<template>
  <el-container class="zj-example">
    <el-aside width="300px">
      <el-menu
        default-active="/demo/base"
        class="el-menu-vertical-demo"
        @select="$_handleSelectMenu"
      >
        <el-menu-item index="/demo/base">
          <i class="el-icon-menu"></i>
          <span slot="title">基础表格</span>
        </el-menu-item>
        <el-menu-item index="/demo/pagination">
          <i class="el-icon-document"></i>
          <span slot="title">表格分页</span>
        </el-menu-item>
        <el-menu-item index="/demo/button">
          <i class="el-icon-document"></i>
          <span slot="title">表格按钮</span>
        </el-menu-item>
        <el-menu-item index="/demo/row-edit">
          <i class="el-icon-setting"></i>
          <span slot="title">表格行编辑</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>
<script>
export default {
  methods: {
    $_handleSelectMenu(path) {
      this.$router.push(path)
    }
  }
}
</script>
<style lang="scss" scoped>
.zj-example {
  width: 100%;
  height: 100%;

  ::v-deep {
    .el-aside {
      border-right: solid 1px #e6e6e6;
    }

    .el-menu {
      border-right: none;
    }
  }
}
</style>

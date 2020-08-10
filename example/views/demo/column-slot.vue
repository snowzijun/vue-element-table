<!--
 * @Author: vkboo
 * @LastEditTime: 2020-08-08 22:50:52
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-08-08 14:32
 * @Description: 表格行插槽
 * @FilePath: \vue-element-table\example\views\demo\column-slot.vue
-->
<template>
  <zj-table ref="table" :columns="columns" :data="data" :pagination="false">
    <template #column="scope">
      <template v-if="scope.prop === 'age'">
        <span>{{ scope.cellValue }} 岁</span>
      </template>
      <template v-if="scope.prop === 'sex'">
        <span v-if="scope.cellValue === '1'" :style="{ color: '#00b1f7' }">
          男♂
        </span>
        <span v-else-if="scope.cellValue === '0'" :style="{ color: '#e90286' }">
          女♀
        </span>
      </template>
      <el-tag v-if="scope.prop === 'grade'">
        {{ scope.cellValue }}
      </el-tag>
    </template>
  </zj-table>
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
          useSlot: true
        },
        {
          label: '年龄',
          prop: 'age',
          useSlot: true
        },
        {
          label: '年级',
          prop: 'grade',
          useSlot: true
        }
      ]),
      data: [
        {
          // 行编辑必须指定rowKey字段，默认是id,如果修改为其他字段，需要给表格指定row-key="字段名"
          id: '0',
          name: '子君',
          sex: '1',
          age: 18,
          grade: '一年级'
        },
        {
          // 行编辑必须指定rowKey字段，默认是id,如果修改为其他字段，需要给表格指定row-key="字段名"
          id: '1',
          name: '子君1',
          sex: '0',
          age: 18,
          grade: '三年级'
        }
      ]
    }
  }
}
</script>

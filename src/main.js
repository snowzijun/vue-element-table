/*
 * @Author: 子君
 * @Date: 2020-07-21 12:29:49
 * @LastEditors: 子君
 * @LastEditTime: 2020-07-27 18:58:07
 * @Description: 文件说明
 * @FilePath: \vue-element-table\src\main.js
 */
import ZjTable from './components/zj-table'

export default {
  install(Vue) {
    Vue.component(ZjTable.name, ZjTable)
  },
  ZjTable
}

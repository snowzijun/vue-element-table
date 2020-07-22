/*
 * @Author: 子君
 * @Date: 2020-07-21 12:29:49
 * @LastEditors: 子君
 * @LastEditTime: 2020-07-21 13:20:38
 * @Description: 文件说明
 * @FilePath: \vue-element-table\src\main.js
 */
// 扫描所有的组件
import ZjTable from './components/zj-table'

const components = [ZjTable]

export default {
  install(Vue) {
    components.forEach(component => {
      Vue.component(component.name, component)
    })
  },
  ZjTable
}

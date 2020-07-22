/*
 * @Author: 子君
 * @Date: 2020-07-21 12:32:52
 * @LastEditors: 子君
 * @LastEditTime: 2020-07-21 13:27:43
 * @Description: 文件说明
 * @FilePath: \vue-element-table\example\main.js
 */

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vue from 'vue'
import ZjUi from '../src/main'
import App from './App.vue'
import router from './router'
Vue.config.productionTip = false
Vue.use(Element)

Vue.use(ZjUi)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

/*
 * @Author: 子君
 * @Date: 2020-06-15 10:34:38
 * @LastEditors: 子君
 * @LastEditTime: 2020-08-06 12:36:47
 * @Description: 文件说明
 * @FilePath: \vue-element-table\example\router\index.js
 */

import Vue from 'vue'
import VueRouter from 'vue-router'
// 为了首屏加载快，所以首页不使用懒加载
import Home from '../views/index'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/demo/base'
    },
    {
      path: '/demo',
      name: 'Home',
      component: Home,
      children: [
        {
          path: 'base',
          component: () => import('../views/demo/base')
        },
        {
          path: 'pagination',
          component: () => import('../views/demo/pagination')
        },
        {
          path: 'button',
          component: () => import('../views/demo/button')
        },
        {
          path: 'row-edit',
          component: () => import('../views/demo/row-edit')
        },
        {
          path: 'slot-button',
          component: () => import('../views/demo/button-slot')
        }
      ]
    }
  ],
  // 页面滚动行为
  scrollBehavior(/* to, from, savedPosition */) {
    return {
      x: 0,
      y: 0
    }
  }
})

router.beforeEach((to, from, next) => {
  next()
})

export default router

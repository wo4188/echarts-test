import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
  },

  {
    path: '/sellerpage',
    name: 'SellerPage',
    component: () =>
      import(/* webpackChunkName: "test-pages" */ '../views/TestPages/SellerPage.vue'),
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import(/* webpackChunkName: "test" */ '../components/EchartsTest.vue'),
  },
  {
    path: '*',
    redirect: '/home',
  },
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
})

export default router

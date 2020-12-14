import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import './assets/css/public.less'
// import echarts from 'echarts'
const echarts = require('echarts')
import chalk from '../public/static/theme/chalk.json'

echarts.registerTheme('chalk', chalk)
Vue.prototype.$echarts = echarts

// 后端koa项目提供服务的基础路径
axios.defaults.baseURL = 'http://localhost:3000/api/'
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

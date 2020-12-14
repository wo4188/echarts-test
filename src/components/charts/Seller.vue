  <!-- 商家销量统计的横向柱状/直方图 -->


<template>
  <div class="common-container">
    <div class="common-chart" ref="seller_chart_ref"></div>
  </div>
</template>

<script>
export default {
  name: 'Seller',
  data() {
    return {
      chartInstance: null, // echarts 实例对象
      allData: null, // 从服务器返回的该接口的全部数据
      currentPage: 1, // 当前显示页的页数编号，页数编号从1开始
      totalPage: 0, // 总页数
      timerId: null, // 定时器标识
    }
  },
  methods: {
    initChart() {
      // 初始化 echart 实例对象, init()方法会返回该实例对象，最好保存在 data 选项中
      this.chartInstance = this.$echarts.init(this.$refs.seller_chart_ref)

      // 对图表进行鼠标事件的监听
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerId) // 取消定时器
      })
      this.chartInstance.on('mouseout', () => {
        this.startInterval() // 重新启动定时器
      })
    },

    async getData() {
      // 从服务器端获取 echart图表 所需要的api数据
      const { data: result } = await this.$http.get('seller')
      this.allData = result

      this.allData.sort((a, b) => {
        return a.value - b.value // 负数，会对数组从小到大排序
      })

      // 柱状图内容分页显示(会自动循环展示每页内容)，每一页显示5个元素
      if (this.allData.length % 5 === 0) {
        this.totalPage = this.allData.length / 5
      } else {
        this.totalPage = Math.floor(this.allData.length / 5) + 1
      }

      this.updateChart()

      this.startInterval() // 每隔3秒，自动切换柱状图分页内容
    },

    updateChart() {
      // 更新 echart图表
      const start = (this.currentPage - 1) * 5
      const end = this.currentPage * 5
      const showData = this.allData.slice(start, end) // 取出分页展示的当前页面的数据

      const sellerNames = showData.map(item => item.name) // y轴上的数据
      const sellerValues = showData.map(item => item.value) // x 轴上的数据
      const option = {
        xAxis: {
          type: 'value',
        },
        yAxis: {
          type: 'category',
          data: sellerNames,
        },
        series: [
          {
            type: 'bar',
            data: sellerValues,
          },
        ],
      }
      this.chartInstance.setOption(option)
    },

    startInterval() {
      if (this.timerId) {
        clearInterval(this.timerId)
      }

      this.timerId = setInterval(() => {
        this.currentPage++
        // 边界值处理
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1
        }

        this.updateChart()
      }, 3000)
    },
  },
  mounted() {
    // 由于initChart()方法 操作了DOM元素，因此需要在 mounted() 生命周期方法中调用
    this.initChart()
    this.getData()
  },
  destroyed() {
    clearInterval(this.timerId)
  },
}
</script>

<style lang="less" scoped>
</style>
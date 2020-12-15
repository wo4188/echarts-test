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
  mounted() {
    // 由于initChart()方法 操作了DOM元素，因此需要在 mounted() 生命周期方法中调用
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    clearInterval(this.timerId)
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    initChart() {
      // 初始化 echarts 实例对象, init()方法会返回该实例对象，最好保存在 data 选项中
      this.chartInstance = this.$echarts.init(this.$refs.seller_chart_ref, 'chalk')

      // 把Echarts的图表配置项option进行拆分，方便维护
      // initOption是初始化配置option
      const initOption = {
        title: {
          text: '▎商家销售统计',
          left: 26,
          top: 26,
        },
        grid: {
          //坐标轴的相关配置
          top: '20%',
          bottom: '3%',
          left: '3%',
          right: '6%',
          containLabel: true, //grid 区域是否包含坐标轴的刻度标签，防止标签溢出容器
        },
        xAxis: {
          type: 'value',
        },
        yAxis: {
          type: 'category',
        },
        tooltip: {
          trigger: 'axis', //坐标轴触发
          axisPointer: {
            //坐标轴指示器配置项
            type: 'line',
            z: 0,
            lineStyle: {
              type: 'solid',
              color: 'rgba(91, 92, 110, 0.4)',
            },
          },
        },
        series: [
          {
            type: 'bar',
            label: {
              show: true, // 图形上的文本标签，可用于说明图形的一些数据信息，默认不显示
              position: 'right', // 默认标签显示在图形内部
            },
            itemStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 1, 1, 0, [
                {
                  offset: 0, // 0%色标的颜色
                  color: '#5052ee',
                },
                {
                  offset: 1,
                  color: '#ab6ee5',
                },
              ]),
            },
          },
        ],
      }
      this.chartInstance.setOption(initOption)

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

      // dataOption是获取数据之后的配置option
      const dataOption = {
        yAxis: {
          data: sellerNames,
        },
        series: [
          {
            data: sellerValues,
          },
        ],
      }
      this.chartInstance.setOption(dataOption)
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

    screenAdapter() {
      // 当图表容器的大小发生变化时，调用该方法，完成图表大小的自适应
      const titleFontSize = (this.$refs.seller_chart_ref.offsetWidth / 100) * 3.4 // 数值是自己试出来的
      const axisPointerWidth = (this.$refs.seller_chart_ref.offsetWidth / 100) * 3.6
      const seriesBarWidth = (this.$refs.seller_chart_ref.offsetWidth / 100) * 3.6

      // initOption是初始化配置option
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: axisPointerWidth,
            },
          },
        },
        series: [
          {
            barWidth: seriesBarWidth, // 柱状图条目宽度
            itemStyle: {
              barBorderRadius: [0, seriesBarWidth / 2, seriesBarWidth / 2, 0], //（顺时针左上，右上，右下，左下）
            },
          },
        ],
      }
      this.chartInstance.setOption(adapterOption)

      this.chartInstance.resize()
    },
  },
}
</script>

<style lang="less" scoped>
</style>
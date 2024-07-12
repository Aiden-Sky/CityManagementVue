<template>
  <div class="dashboard">

    <div class="stats">
      <div class="stat-item" v-for="(stat, index) in stats" :key="index">
        <p>{{ stat.label }}</p>
        <h2>{{ stat.value }}</h2>
      </div>
    </div>
    <div class="charts">
      <div class="chart-container" id="chart1"></div>
      <div class="chart-container" id="chart2"></div>
      <div class="chart-container" id="chart3"></div>
      <div class="chart-container" id="chart4"></div>
      <div class="chart-container" id="chart5"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'commandPage',
  data() {
    return {
      stats: [
        {label: '受理案件', value: '681,367'},
        {label: '按期处理率', value: '97.8%'},
        {label: '处理率', value: '98.4%'},
        {label: '按期结案率', value: '98.1%'}
      ]
    };
  },
  mounted() {
    this.initCharts();
  },
  methods: {
    initCharts() {
      this.initChart1();
      this.initChart2();
      this.initChart3();
      this.initChart4();
      this.initChart5();
    },
    initChart1() {
      var chart = echarts.init(document.getElementById('chart1'));
      var option = {
        // ...你的图表配置
        title: {
          text: '备区考核对比',
          left: 'center',
          textStyle: {
            color: '#fff'
          }
        },
        radar: {
          indicator: [
            {name: '1区', max: 150},
            {name: '2区', max: 150},
            {name: '3区', max: 150},
            {name: '4区', max: 150},
            {name: '5区', max: 150},
            {name: '6区', max: 150}
          ]
        },
        series: [{
          name: '备区考核对比',
          type: 'radar',
          data: [
            {
              value: [120, 110, 125, 115, 105, 130],
              name: '考核分数'
            }
          ]
        }]
      };
      chart.setOption(option);
    },
    initChart2() {
      var chart = echarts.init(document.getElementById('chart2'));
      var option = {
        // ...你的图表配置
      };
      chart.setOption(option);
    },
    initChart3() {
      var chart = echarts.init(document.getElementById('chart3'));
      var option = {
        // ...你的图表配置
      };
      chart.setOption(option);
    },
    initChart4() {
      var chart = echarts.init(document.getElementById('chart4'));
      var option = {
        // ...你的图表配置
      };
      chart.setOption(option);
    },
    initChart5() {
      var chart = echarts.init(document.getElementById('chart5'));
      var option = {
        // ...你的图表配置
      };
      chart.setOption(option);
    }
  }
};
</script>

<style scoped>
.dashboard {
  background: url('/imgs/mainBack.webp') no-repeat fixed center center;
  background-size: cover;
  padding: 20px;
  color: #fff;
  min-height: 100vh; /* 确保元素至少与视口一样高 */
  width: 100%; /* 确保元素宽度占满整个视口 */
  position: relative; /* 如果需要，为子元素定位 */
}


.stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.stat-item {
  background: rgba(0, 0, 0, 0.5);
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

.charts {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.chart-container {
  width: 45%;
  height: 400px;
  margin-bottom: 20px;
}
</style>

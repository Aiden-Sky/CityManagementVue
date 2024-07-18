<template>
  <div class="dashboard">
    <div class="stats">
      <div class="stat-item" v-for="(stat, index) in stats" :key="index">
        <p>{{ stat.label }}</p>
        <h2>{{ stat.value }}</h2>
      </div>
    </div>
    <div class="charts">
      <div class="chart-row">
        <div class="chart-container" id="chart1"></div>
        <div class="chart-container" id="chart2"></div>
      </div>
      <div class="chart-row">
        <div class="chart-container" id="chart3"></div>
        <div class="chart-container" id="chart4"></div>
      </div>
      <div class="chart-row">
        <div class="chart-container" id="chart5"></div>
      </div>
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
          ],
          splitLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.5)'
            }
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.5)'
            }
          }
        },
        series: [{
          name: '备区考核对比',
          type: 'radar',
          data: [
            {
              value: [120, 110, 125, 115, 105, 130],
              name: '考核分数'
            }
          ],
          itemStyle: {
            color: '#1f78b4'
          },
          lineStyle: {
            color: '#1f78b4'
          },
          areaStyle: {
            color: 'rgba(31, 120, 180, 0.5)'
          }
        }]
      };
      chart.setOption(option);
    },
    initChart2() {
      var chart = echarts.init(document.getElementById('chart2'));
      var option = {
        title: {
          text: '案件类型分布',
          left: 'center',
          textStyle: {
            color: '#fff'
          }
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          bottom: '0',
          textStyle: {
            color: '#fff'
          }
        },
        series: [
          {
            name: '案件类型',
            type: 'pie',
            radius: '50%',
            data: [
              {value: 1048, name: '类型1'},
              {value: 735, name: '类型2'},
              {value: 580, name: '类型3'},
              {value: 484, name: '类型4'},
              {value: 300, name: '类型5'}
            ],
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              color: '#fff'
            }
          }
        ]
      };
      chart.setOption(option);
    },
    initChart3() {
      var chart = echarts.init(document.getElementById('chart3'));
      var option = {
        title: {
          text: '案件处理时间',
          left: 'center',
          textStyle: {
            color: '#fff'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          },
          axisLabel: {
            color: '#fff'
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          },
          axisLabel: {
            color: '#fff'
          }
        },
        series: [
          {
            name: '案件数',
            type: 'bar',
            data: [120, 200, 150, 80, 70, 110, 130],
            itemStyle: {
              color: '#1f78b4'
            }
          }
        ]
      };
      chart.setOption(option);
    },
    initChart4() {
      var chart = echarts.init(document.getElementById('chart4'));
      var option = {
        title: {
          text: '月度处理情况',
          left: 'center',
          textStyle: {
            color: '#fff'
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['处理案件', '按期处理'],
          textStyle: {
            color: '#fff'
          },
          top: 30  // 将图例移到上面，避免与轴标签重叠
        },
        grid: {
          top: 70,  // 增加 grid top 的值，为图例腾出空间
          left: 50,
          right: 50,
          bottom: 70
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          },
          axisLabel: {
            color: '#fff',
            interval: 0,  // 设置标签显示的间隔，0表示所有标签都显示
            rotate: 45  // 旋转标签，避免重叠
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          },
          axisLabel: {
            color: '#fff'
          }
        },
        series: [
          {
            name: '处理案件',
            type: 'line',
            data: [120, 132, 101, 134, 90, 230, 210, 180, 230, 210, 250, 270],
            itemStyle: {
              color: '#1f78b4'
            }
          },
          {
            name: '按期处理',
            type: 'line',
            data: [110, 120, 100, 125, 85, 220, 200, 170, 220, 200, 240, 260],
            itemStyle: {
              color: '#33a02c'
            }
          }
        ]
      };
      chart.setOption(option);
    },
    initChart5() {
      var chart = echarts.init(document.getElementById('chart5'));
      var option = {
        title: {
          text: '年度处理情况',
          left: 'center',
          textStyle: {
            color: '#fff'
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['2017', '2018', '2019', '2020', '2021', '2022', '2023'],
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          },
          axisLabel: {
            color: '#fff'
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          },
          axisLabel: {
            color: '#fff'
          }
        },
        series: [
          {
            name: '处理案件',
            type: 'line',
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            itemStyle: {
              color: '#1f78b4'
            }
          },
          {
            name: '按期处理',
            type: 'line',
            data: [800, 900, 880, 910, 1270, 1300, 1290],
            itemStyle: {
              color: '#33a02c'
            }
          }
        ]
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
  min-height: 100vh;
  width: 100%;
  position: relative;
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
  flex: 1;
  margin: 0 10px;
}

.charts {
  display: flex;
  flex-direction: column;
}

.chart-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.chart-container {
  flex: 1;
  height: 400px;
  margin: 0 10px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
}
</style>

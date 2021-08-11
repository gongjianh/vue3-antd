import { onMounted } from "vue";

const InitOption = {
    title: {
        text: '最近七天日活'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: ['人数']
    },
    grid: {
        left: 20,
        right: 20,
        bottom: 20,
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: []
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name: '人数',
            type: 'line',
            data: []
        },
    ]
};
/**
 * 必须在元素挂载完成以后使用
 * @param id html id
 * @param option 
 * @returns 
 */
export function useLineChart(id: string, option = InitOption) {
    const dom = document.getElementById(id) as HTMLElement
    let myChart = echarts.init(dom);
    option && myChart.setOption(option);
    return myChart
}
export default useLineChart
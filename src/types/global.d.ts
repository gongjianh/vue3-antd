// declare const $uploadImage: any
// declare const $imgUrl: any
// declare const echarts: {
//     init(dom: HTMLElement): import('echarts/types/dist/core').EChartsType
// }

import { EChartsType } from 'echarts/types/dist/core';

declare global {
    const $uploadImage: any
    const $uploadFile: any
    const $imgUrl: any
    interface ECharts extends EChartsType { }
    const echarts: {
        init(dom: HTMLElement): ECharts
    }
}
import { onMounted, ref, Ref } from 'vue'
import { message } from 'ant-design-vue'
import { PageOption } from '@/hooks/use-pages'
import http from '@/utils/http'
type types = {
    'MANAGE_BONUS_SINGLEGROUPAMOUNT',// 分红组数
    'TRANSFER_COMMISSION_UC',//UC手续费1
    'GXJ_CONVERT_CASH_COMMISSION',//共享金转换余额手续费2
    'XFGF_CONVERT_WUC_COMMISSION',// 消费工分转WUC手续费3
    'CASH_WITHDRAW_COMMISSION',//余额提现手续费4
    'BARTER_CHAIN_BEAN_WDT_RELEASEDRATE',// 特权商品配赠的WDT恒定释放手续费5
    'BARTER_CHAIN_BEAN_FDT_RELEASEDRATE', //特权商品配赠的FDT动态释放百分比（小数）：初始默认0.0010（0.1‰）
    'UC_PV_RATE',//易货商城默认pv值：初始默认0.1
    'CASH_PV_RATE',//现金商城默认pv值：初始默认0.1
    'DIRECT_RANK_GAINED_MONTHLY',//绩效奖
    'DIRECT_AMOUNT_GAINED_MONTHLY',//感恩奖
    'TRANSFER_COMMISSION_WDT',//wdt转账手续费
    'SIGN_IN_SWITCH',// 签到开关
    'RED_PACKET_SWITCH',//红包开关
    'WGM_MALL_SWITCH',//商城开关
}
interface setParams {
    createUserId: string,
    paramValue: any
}
/**
 * 
 * @param key 常量名 'MANAGE_BONUS_SINGLEGROUPAMOUNT',// 分红组数
    'TRANSFER_COMMISSION_UC',//UC手续费
    'GXJ_CONVERT_CASH_COMMISSION',//共享金转换余额手续费
    'XFGF_CONVERT_WUC_COMMISSION',// 消费工分转WUC手续费
    'CASH_WITHDRAW_COMMISSION',//余额提现手续费
    'BARTER_CHAIN_BEAN_WDT_RELEASEDRATE',// 特权商品配赠的WDT恒定释放手续费
    'UC_PV_RATE',//易货商城默认pv值：初始默认0.1
    'CASH_PV_RATE',//现金商城默认pv值：初始默认0.1
    'DIRECT_RANK_GAINED_MONTHLY',//绩效奖
    'DIRECT_AMOUNT_GAINED_MONTHLY',//感恩奖
    'TRANSFER_COMMISSION_WDT',//wdt转账手续费
    'SIGN_IN_SWITCH',// 签到开关
    'RED_PACKET_SWITCH',//红包开关
    'WGM_MALL_SWITCH',//商城开关
 * @returns constant常量值，setConstant设置常量
 */
export function useConstant(key: keyof types, page?: Ref<PageOption>) {
    const _key = key
    const listLoading = ref(false)
    const constant = ref<number>(0)
    const paramId = ref<string>()
    const recordList = ref<any>([])
    async function getConstant() {
        const res = await http({
            url: '/web/systemParam/getSystemParam',
            params: {
                paramName: _key
            }
        })
        if (res.status == 0) {
            constant.value = res.webSystemParam?.paramValue
            paramId.value = res.webSystemParam?.paramId
        }
    }
    /**
     * 
     * @param params `{ createUserId: string, paramValue: any }`
     */
    async function setConstant(params: setParams) {
        const res = await http({
            url: '/web/systemParam/commitSystemParam',
            params: {
                paramName: _key,
                ...params,
            }
        })
        if (res.status == 0) {
            constant.value = params.paramValue
            message.success('操作成功')
        }
    }
    async function getRecordList() {
        if (!page) return console.error('需要使用历史记录，请传入 pageOption')
        listLoading.value = true
        const res = await http({
            url: '/web/systemParam/getSystemParamRecordList',
            params: {
                paramId: paramId.value,
                pageSize: page.value.pageSize,
                pageIndex: page.value.current,
            }
        })
        listLoading.value = false
        if (res.status == 0) {
            recordList.value = res.systemParamList
            page.value.total = res.count
        }
        return recordList.value
    }
    if (page) {
        page.value.pageChange = getRecordList
    }
    onMounted(() => {
        getConstant()
    })
    return {
        constant,
        setConstant,
        getRecordList,
        recordList,
        listLoading
    }
}

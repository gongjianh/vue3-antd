<template>
    <a-card size="small" style="padding: 12px;">
        <a-form layout="inline" class="table-form">
            <a-form-item label="订单号">
                <a-input placeholder="请填写" v-model:value="formData.orderNo"></a-input>
            </a-form-item>
            <a-form-item label="用户创客号">
                <a-input placeholder="请填写" v-model:value="formData.buyUserId"></a-input>
            </a-form-item>
            <a-form-item label="收货手机号">
                <a-input placeholder="请填写" v-model:value="formData.addressMobile"></a-input>
            </a-form-item>
            <a-form-item label="礼包名称">
                <a-input placeholder="请填写" v-model:value="formData.bagName"></a-input>
            </a-form-item>
            <a-form-item label="状态">
                <a-select allowClear placeholder="请选择" v-model:value="formData.receiveStatus">
                    <a-select-option value="1">发货</a-select-option>
                    <a-select-option value="0">未发货</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item class="time" label="下单时间">
                <a-range-picker showTime v-model:value="formData.time" />
            </a-form-item>
            <a-form-item label=" " :colon="false">
                <a-button type="primary" style="margin-right:12px" @click="search">搜索</a-button>
                <a-button @click="reset">重置</a-button>
            </a-form-item>
        </a-form>
        <br />
        <div>
            <a-button
                type="primary"
                @click="fahuo(selectedRowKeys)"
                :disabled="!selectedRowKeys.length"
            >批量发货</a-button>
            <span
                style="font-weight: bold;margin-left: 20px;font-size: 16px;"
            >当前已选择{{ selectedRowKeys.length }}项</span>
            <a-button style="float: right;" type="primary" :href="url">导出</a-button>
        </div>
        <br />
        <a-table
            :loading="loadingT"
            :columns="columns"
            :pagination="pageOption"
            :data-source="list"
            rowKey="receiveId"
            :row-selection="rowSelection"
        >
            <template #action="{ record }">
                <a-button
                    v-if="record.receiveStatus == 0"
                    type="link"
                    @click="fahuo(record.receiveId)"
                    size="small"
                >发货</a-button>
            </template>
        </a-table>
    </a-card>
</template>
  <script lang="ts" setup>
import { ref, createVNode, computed } from 'vue'
import { usePages } from '@/hooks'
import { columns } from './columns'
import http from '@/utils/http'
import moment from 'moment'
import { message, Modal } from 'ant-design-vue'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import { setObjToUrlParams } from '@/utils/urlUtils'
import userInfo from '@/store/userInfo'




const { pageOption } = usePages()
const list = ref([])
const loadingT = ref(false)
const formData: any = ref({})
const url = computed(() => {
    return setObjToUrlParams('/wgm-web/web/memberUserGiftBagReceive/getPropRecordExport', {
        pageIndex: pageOption.value.current,
        pageSize: pageOption.value.pageSize,
        ...formData.value,
        businessUserId: userInfo.value.userId,
        time: undefined,
        beginTime:
            formData.value.time && formData.value.time.length
                ? moment(formData.value.time[0]).format('YYYY-MM-DD HH:mm:ss')
                : undefined,
        endTime:
            formData.value.time && formData.value.time.length
                ? moment(formData.value.time[1]).format('YYYY-MM-DD HH:mm:ss')
                : undefined
    })
})
const getList = async () => {
    loadingT.value = true
    const res = await http({
        url: '/wgm-web/web/memberUserGiftBagReceive/getUserGiftBagReceiveList',
        params: {
            pageIndex: pageOption.value.current,
            pageSize: pageOption.value.pageSize,
            ...formData.value,
            businessUserId: userInfo.value.userId,
            time: undefined,
            beginTime:
                formData.value.time && formData.value.time.length
                    ? moment(formData.value.time[0]).format('YYYY-MM-DD HH:mm:ss')
                    : undefined,
            endTime:
                formData.value.time && formData.value.time.length
                    ? moment(formData.value.time[1]).format('YYYY-MM-DD HH:mm:ss')
                    : undefined
        }
    })
    loadingT.value = false
    if (res.status === 0) {
        list.value = res.webMemberUserGiftBagReceiveDTOS || []
        pageOption.value.total = res.count
    }
}
getList()
const search = () => {
    pageOption.value.current = 1
    getList()
}
const reset = () => {
    formData.value = {}
    pageOption.value.current = 1
    getList()
}
pageOption.value.pageChange = getList

const selectedRowKeys = ref([])
const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (val) => {
        selectedRowKeys.value = val
    },
    getCheckboxProps: (item) => {
        return {
            disabled: item.receiveStatus == 1
        }
    }
}


async function fahuo(data) {
    Modal.confirm({
        icon: createVNode(QuestionCircleOutlined),
        content: `您确定要发货吗？`,
        onOk: async () => {
            const res = await http({
                url: '/wgm-web/web/memberUserGiftBagReceive/updateReceiveStatus',
                params: {
                    receiveIdList: data.toString()
                }
            })
            if (res.status === 0) {
                message.success('发货成功！')
                getList()
                selectedRowKeys.value = []
            }
        }
    })
}
</script>
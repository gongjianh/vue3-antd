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
                    <a-select-option value="0">未发货</a-select-option>
                    <a-select-option value="1">已发货</a-select-option>
                    <a-select-option value="2">已签收</a-select-option>
                    <a-select-option value="3">已结算</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item class="time" label="下单时间">
                <a-range-picker showTime v-model:value="formData.time" />
            </a-form-item>
            <a-form-item label=" " :colon="false">
                <a-button type="primary" style="margin-right:12px" @click="search">搜索</a-button>
                <a-button @click="fahuo">重置</a-button>
            </a-form-item>
        </a-form>
        <br />
        <div>
            <!-- <a-button
                type="primary"
                @click="fahuo(selectedRowKeys)"
                :disabled="!selectedRowKeys.length"
            >批量发货</a-button>
            <span
                style="font-weight: bold;margin-left: 20px;font-size: 16px;"
            >当前已选择{{ selectedRowKeys.length }}项</span>-->
            <a-button type="primary" :href="url">导出</a-button>
        </div>
        <br />
        <a-table
            :loading="loadingT"
            :columns="columns"
            :pagination="pageOption"
            :data-source="list"
            rowKey="receiveId"
        >
            <template #action="{ record }">
                <a-button
                    v-if="record.receiveStatus == 0"
                    type="link"
                    @click="fahuo(record)"
                    size="small"
                >发货</a-button>
            </template>
        </a-table>
        <a-modal
            :confirmLoading="confirmLoading"
            v-model:visible="visible"
            width="400px"
            title="发货"
            @ok="handleOk"
        >
            <a-form
                ref="formRef"
                :model="formState"
                :rules="rules"
                :label-col="{ span: 6 }"
                :wrapper-col="{ span: 15 }"
            >
                <a-form-item label="快递单号" name="expressNumber">
                    <a-input placeholder="请填写" v-model:value="formState.expressNumber"></a-input>
                </a-form-item>
            </a-form>
        </a-modal>
    </a-card>
</template>
  <script lang="ts" setup>
import { ref, createVNode, computed } from 'vue'
import { useFormModal, usePages } from '@/hooks'
import { columns } from './columns'
import http from '@/utils/http'
import moment from 'moment'
import { message, Modal } from 'ant-design-vue'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import { setObjToUrlParams } from '@/utils/urlUtils'
import userInfo from '@/store/userInfo'
import { getFormSchema } from './form-schema'



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
const formRef = ref()
const confirmLoading = ref(false)
const visible = ref(false)
const formState = ref({
    expressNumber: '',
    receiveId: ''
})
const rules = {
    expressNumber: [{
        required: true,
        message: "请填写"
    }]
}
async function handleOk(item) {
    await formRef.value.validate()
    confirmLoading.value = true
    const res = await http({
        url: '/wgm-web/web/memberUserGiftBagReceive/updateReceiveStatus',
        params: {
            receiveId: formState.value.receiveId,
            expressNumber: formState.value.expressNumber
        }
    })
    confirmLoading.value = false
    if (res.status === 0) {
        visible.value = false
        message.success('发货成功！')
        getList()
    }
}

async function fahuo(item) {
    // visible.value = true
    // formState.value.receiveId = item.receiveId
    // return
    useFormModal({
        title: '发货',
        formSchema: getFormSchema(),
        handleOk: async (state) => {
            const res = await http({
                url: '/web/memberUserGiftBagReceive/updateReceiveStatus',
                params: {
                    receiveId: item.receiveId,
                    expressNumber: state.expressNumber
                }
            })
            if (res.status === 0) {
                message.success('发货成功！')
                getList()
            }
        }
    })
}
</script>
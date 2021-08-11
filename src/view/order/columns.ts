import { TableColumn } from '@/types/tableColumn'
import { Image } from "ant-design-vue";
import { h } from "vue";
export const columns: TableColumn[] = [
  {
    title: '序号',
    dataIndex: 'receiveId',
  },
  {
    title: '订单号',
    dataIndex: 'orderNo',
    customRender: ({ text, record }) => {
      return h('div', { class: 'text-auto' }, text)
    },
  },
  {
    title: '购买用户/创客号',
    dataIndex: 'buyUserName',
    customRender: ({ record }) => {
      return record.buyUserName + '/' + record.buyUserId
    }
  },
  {
    title: '收货人/手机号',
    dataIndex: 'weight',
    customRender: ({ record }) => {
      return record.receiver + '/' + record.addressMobile
    }
  },
  {
    title: '地址',
    dataIndex: 'createUserName',
    customRender: ({ record }) => {
      return record.address && record.address.replaceAll(',') + record.detailAddress
    }
  },
  {
    title: '领取礼包',
    dataIndex: 'bagName'
  },
  {
    title: '所属商家/创客号',
    dataIndex: 'msgStatus',
    customRender: ({ text, record }) => {
      return record.businessUserName + '/' + record.businessUserId
    }
  },
  {
    title: '领取时间',
    dataIndex: 'createTime',
  },
  {
    title: '状态',
    dataIndex: 'receiveStatus',
    customRender: ({ text, record }) => {
      switch (text) {
        //0待发货，1已发货，2已签收，3已结算',
        case 0: return '未发货'
        case 1: return '已发货'
        case 2: return '已签收'
        case 3: return '已结算'
        default: return ''
      }
    }
  },
  {
    title: '操作',
    dataIndex: 'action',
    slots: {
      customRender: 'action'
    }
  }
]


import { FormSchema } from "@/types/schema";
import { isnumber } from "@/utils/rules";


export const getFormSchema = (): FormSchema => ({
    style: {
        width: "400px"
    },
    formItemLayout: {
        labelCol: {
            span: 6
        },
        wrapperCol: {
            span: 15
        }
    },
    formItem: [
        {
            type: "input",
            label: "快递单号",
            field: "expressNumber",
            value: '',
            props: {
                placeholder: "请输入快递单号"
            },
            rules: [
                {
                    required: true,
                    message: "请填写"
                }
            ]
        }
    ]
})


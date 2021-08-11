
import { FormSchema } from "@/types/schema";
import { isnumber } from "@/utils/rules";


export const getFormSchema = (): FormSchema => ({
    style: {
        width: "400px"
    },
    formItemLayout: {
        labelCol: {
            span: 5
        },
        wrapperCol: {
            span: 15
        }
    },
    formItem: [
        {
            type: "input",
            label: "权重值",
            field: "weight",
            value: '',
            props: {
                placeholder: "请输入权重值"
            },
            rules: [
                {
                    required: true,
                    message: "请填写"
                }, {
                    validator: isnumber,
                    trigger: 'blur'
                }
            ]
        }
    ]
})


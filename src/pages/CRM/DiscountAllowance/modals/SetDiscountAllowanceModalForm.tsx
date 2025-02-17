import React, { useState } from "react";
import { Form, Select } from 'antd'
import NumberFormat from 'react-number-format'
import { ISetDiscountAllowance } from '../interfaces/SetDiscountAllowanceInterface'
import { IPriceList } from "@interfaces/CRM/PriceListInterface";
const { Option } = Select

export default function SetDiscountAllowanceModalForm({form, priceList,ownerId}) {
    const [changeFieldMaxDiscount, setChangeFieldMaxDiscount] = useState<boolean>(false)
    const [changeFieldMaxAddition, setChangeFieldMaxAddition] = useState<boolean>(false)

    const changeOptions = [
        <Option value={false}>Manter valor existente</Option>,
        <Option value={true}>Substituir valor existente com...</Option>
    ]
    const priceListOptions = priceList?.flatMap((pl:IPriceList) =>
        pl?.ownerId === ownerId ? (
            <Option 
                label={pl.name} 
                key={pl.priceListId} 
                value={pl.priceListId}
            >
                {pl.name}
            </Option>
        ) : []
    );
    
    const allowedValues = (values: { floatValue: any; }, max: number) => {
        const { floatValue } = values;
        
        return (
          floatValue === undefined || 
          (floatValue >= 0 && (max == undefined || floatValue <= max))
        );
      };
      
    return(
        <Form 
            form={form} 
            layout="vertical"
        >
            <Form.Item<ISetDiscountAllowance>
                label="Selecione a lista de preço" 
                name="priceList"
                rules={[{
                    required: true,
                    message: "Informe a lista de preço"
                }]}
            >
                <Select>
                    {priceListOptions}
                </Select>
            </Form.Item>
            <Form.Item<ISetDiscountAllowance> label="% desconto máximo" name="changeFieldMaxDiscount">
                <Select defaultValue={false} onChange={(e) => setChangeFieldMaxDiscount(e)}>
                    {changeOptions}
                </Select>
            </Form.Item>
            { changeFieldMaxDiscount &&
            <Form.Item<ISetDiscountAllowance> name="maxDiscount">
                <NumberFormat
                    className="ant-input"
                    decimalSeparator=","
                    decimalScale={2}
                    isAllowed={(values) => allowedValues(values, 100)}
                />
            </Form.Item>}
            <Form.Item<ISetDiscountAllowance> label="% de acréscimo máximo" name="changeFieldMaxAddition">
                <Select defaultValue={false} onChange={(e) => setChangeFieldMaxAddition(e)}>
                    {changeOptions}
                </Select>
            </Form.Item>
            {changeFieldMaxAddition &&
            <Form.Item<ISetDiscountAllowance> name="maxAddition">
                <NumberFormat
                    className="ant-input"
                    decimalSeparator=","
                    decimalScale={2}
                    isAllowed={(values) => allowedValues(values, 999)}
                />
            </Form.Item>}
        </Form>
    )
}
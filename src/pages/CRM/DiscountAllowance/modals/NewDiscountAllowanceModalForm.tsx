import React from "react";
import { Form, Select } from 'antd'
import NumberFormat from 'react-number-format'
import { FieldType } from '../interfaces/FieldTypeInterface'
import { defaultStatus } from "../../../../utils/enums";
import { NewAutoComplete } from '@components/refactored'
import { apiCRM } from '@services/api'
import { IPriceList } from "@interfaces/CRM/PriceListInterface";

const { Option } = Select

export default function NewDiscountAllowanceModalForm({form, franchiseeData,setFranchiseeData, priceList,ownerId,isFranchisor,canView}) {

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
    
    const statusOptions = defaultStatus.map(x => (
        <Option value={x.id}> <i className="fa fa-circle mr-2" style={{ color: x.color }} /> {x.name} </Option>
    ))

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
            disabled={canView}
        >
              <NewAutoComplete
                form={form}
                source={franchiseeData}
                setSource={setFranchiseeData}
                fieldName="franchisee"
                serviceApi={apiCRM}
                api={`/api/CRM/Person?isFranchisee=true&queryOperator=like&onlyMyOwnerId=${isFranchisor}&getDeletedPerson=false&getPersonDetails=false&isActive=true`}
                paramName="shortName"
                label="Participante"
                placeholder="Digite nome do participante"
                nameList="person"
                recordId="franchiseeId"
                recordDescription="shortName"
                required
                rules={[
                    { required: true, message: 'Por favor, insira o participante' },
                  ]}
              />

           
            <Form.Item<FieldType>
                label="Selecione a lista de preço" 
                name="priceList"
                rules={[{
                    required: true,
                    message: "Informe a lista de preço"
                }]}
            >
                <Select                 
                >
                    {priceListOptions}
                </Select>
            </Form.Item>
            <Form.Item<FieldType>
                label="Definir % de desconto máximo" 
                name="maxDiscount"
                rules={[{
                    required: true,
                    message: "Informe o desconto máximo"
                }]}
            >
                <NumberFormat
                    className="ant-input"
                    decimalSeparator=","
                    decimalScale={2}
                    isAllowed={(values) => allowedValues(values, 100)}
                    disabled={canView}
                />
            </Form.Item>
            <Form.Item<FieldType> 
                label="Definir % de acréscimo máximo" 
                name="maxAddition"
                rules={[{
                    required: true,
                    message: "Informe o acréscimo máximo"
                }]}
            >
                <NumberFormat
                    disabled={canView}
                    className="ant-input"
                    decimalSeparator=","
                    decimalScale={2}
                    isAllowed={(values) => allowedValues(values, 999)}
                    />
            </Form.Item>
            <Form.Item<FieldType>
                label="Status da alçada" 
                name="status"
                rules={[{
                    required: true,
                    message: "Informe o status da alçada"
                }]}
            >
                <Select>
                    {statusOptions}
                </Select>
            </Form.Item>
        </Form>
    )
}
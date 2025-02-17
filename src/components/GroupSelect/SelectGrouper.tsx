import React, { useEffect, useState } from 'react'
import { TreeSelect, Form as NewForm } from 'antd'
import { Form } from '@ant-design/compatible'
import { IChildren } from './Interface/ChildrenInterface'
import { normalizeString } from '@utils'
import { ICostCenterGrouper } from '@interfaces/Financial/Hierarchy/CostCenterHierarchyInterface'

const SelectGrouper: React.FC<IChildren> = ({
  data,
  label,
  name,
  rules,
  newForm,
  form,
  defaultValue,
  disabled,
}) => {
  const FormComponent = newForm ? NewForm : Form
  const getFieldDecorator = !newForm ? form.getFieldDecorator : null // Obter getFieldDecorator apenas se form estiver disponível
  const [processedOptions, setProcessedOptions] = useState<
    ICostCenterGrouper[]
  >([])

  const codeDescription = (costCenter: ICostCenterGrouper) => {
    const { codigo, descricao } = costCenter
    return codigo ? `${codigo} - ${descricao}` : descricao
  }

  const processOptions = (centroCusto: ICostCenterGrouper[]) => {
    return centroCusto.map(item => {
      const hasNestedCentroCusto =
        item.centroCusto && item.centroCusto.length > 0

      return {
        title: hasNestedCentroCusto ? (
          <strong>{codeDescription(item)}</strong>
        ) : (
          codeDescription(item)
        ),
        value: hasNestedCentroCusto ? item.id : item.id,
        selectable: !hasNestedCentroCusto,
        children: hasNestedCentroCusto
          ? processOptions(item.centroCusto)
          : null,
        text: codeDescription(item),
      }
    })
  }

  const filterTreeNode = (input: string, node: { text: string }) => {
    const normalizedInput = normalizeString(input)
    const titleText = normalizeString(node.text.toString())
    return titleText.includes(normalizedInput)
  }

  const CustomTreeSelect = ({
    treeData = [],
    treeDefaultExpandAll = true,
    showSearch = true,
    ...props
  }) => (
    <TreeSelect
      disabled={disabled}
      treeData={treeData}
      showSearch={showSearch}
      treeDefaultExpandAll={treeDefaultExpandAll}
      filterTreeNode={filterTreeNode}
      {...props}
    />
  )

  const CustomTreeSelectFormItem = ({
    label,
    name,
    rules,
    defaultValue,
    getFieldDecorator,
    ...props
  }) => (
    <FormComponent.Item label={label} name={name} rules={rules}>
      {!newForm ? (
        getFieldDecorator(name, {
          initialValue: defaultValue,
          rules: rules,
        })(<CustomTreeSelect {...props} />)
      ) : (
        <CustomTreeSelect {...props} />
      )}
    </FormComponent.Item>
  )

  useEffect(() => {
    setProcessedOptions(
      data ? data.flatMap((d: any) => processOptions(d.centroCusto || [])) : [],
    )
  }, [data])

  return (
    <React.Fragment>
      <CustomTreeSelectFormItem
        label={label}
        name={name}
        rules={rules}
        defaultValue={defaultValue}
        getFieldDecorator={getFieldDecorator}
        treeData={processedOptions}
      />
    </React.Fragment>
  )
}

export default SelectGrouper

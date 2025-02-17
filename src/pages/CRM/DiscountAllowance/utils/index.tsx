
import React from 'react'
import SmallTableFieldDescription from '@components/SmallTableFieldDescription'
import { saveDiscountAllowance } from '../services'

import { exportExcel } from '@utils/export'
import { defaultStatus } from '../../../../utils/enums'
import { IDiscountAllowanceColumns } from '../interfaces/DiscountAllowanceColumns'
import { IFranchiseeVendorBody } from '@interfaces/CRM/DiscountAllowance/FranchiseeVendorBodyInterface'
import { IStatus } from '@interfaces/StatusInterface'
import { IFranchiseeVendor } from '@interfaces/CRM/DiscountAllowance/FranchiseeVendorInterface'
import { ITags } from '@interfaces/TagsInterface'

export const discountAllowanceColumns = (isFranchisee: boolean) => {
  return [
    {
      title: 'Participante',
      key: 'abreviado',
      secondaryColumn: [
        {
          title: 'Razão social',
          key: 'nome',
        },
      ],
      render: (d: { abreviado: string; nome: string }) => (
        <div>
          {isFranchisee ? (
            <div>
              <p className="mb-0">{d?.abreviado}</p>
              <SmallTableFieldDescription
                label={d?.nome}
                fontStyle="italic"
                color="gray"
              />
            </div>
          ) : (
            <p className="mb-0">{d?.nome}</p>
          )}
        </div>
      ),
    },
    {
      title: 'Lista de preço',
      dataIndex: 'listaPreco',
      render: (d: number) => d,
    },
    {
      title: 'Desconto máximo',
      dataIndex: 'percentualDsctoMaximo',
      render: (d: number) => getPercentLabel(d),
    },
    {
      title: 'Acréscimo máximo',
      dataIndex: 'percentualAcrescimoMaximo',
      render: (d: number) => getPercentLabel(d),
    },
    {
      title: 'Status da alçada',
      key: 'statusDescricao',
      render: (d: string) => (
        <div>
          <i
            className="fa fa-circle mr-2"
            style={{ color: d?.status == 1 ? '#4caf50' : 'red' }}
          />{' '}
          {d?.statusDescricao}
        </div>
      ),
    },
  ]
}

export const handleSave = (
  form,
  ownerId,
  setVisibleNewDiscountAllowanceModal,
  addAnother,
  editId,
) => {
  form.validateFields().then(values => {
    const body = [
      {
        id: editId || null,
        ownerId: ownerId,
        indFranquiaVendedor: 1,
        franchiseeId: values.franchisee,
        cSellerId: 0,
        percentualDsctoMaximo: getPercentField(values.maxDiscount),
        percentualAcrescimoMaximo: getPercentField(values.maxAddition),
        listaPrecoId: values.priceList,
        status: values.status == 1 ? true : false,
      },
    ]

    saveDiscountAllowance(
      body,
      setVisibleNewDiscountAllowanceModal,
      form,
      addAnother,
    )
  })
}

export const handleCancel = (
  setVisibleNewDiscountAllowanceModal,
  setEditData,
) => {
  setEditData(null)
  setVisibleNewDiscountAllowanceModal(false)
}

export const handleUpdate = (
  form,
  ownerId,
  setVisibleNewDiscountAllowanceModal,
  selectedRow,
) => {
  form.validateFields().then(values => {
    const body: IFranchiseeVendorBody = selectedRow.map(row => {
      return {
        id: row.id === 0 ? null : row.id,
        ownerId: ownerId,
        indFranquiaVendedor: 1,
        franchiseeId: row.franchiseeId,
        cSellerId: 0,
        percentualDsctoMaximo: getPercentField(
          values.changeFieldMaxDiscount
            ? values.maxDiscount
            : row.percentualDsctoMaximo,
        ),
        percentualAcrescimoMaximo: getPercentField(
          values.changeFieldMaxAddition
            ? values.maxAddition
            : row.percentualAcrescimoMaximo,
        ),
        listaPrecoId: values.priceList,
        status: true,
      }
    })
    saveDiscountAllowance(body, setVisibleNewDiscountAllowanceModal, form)
  })
}

const getPercentField = (value: string) => {
  if (value.length > 1) {
    return Number(
      parseFloat(value.slice(0, value.length).replace(',', '.')).toFixed(2),
    )
  } else {
    return Number(parseFloat(value).toFixed(2))
  }
}

const getPercentLabel = (value: number) => {
  return String(value).replace('.', ',')
}

const findStatus = (idToFind: number) =>
  defaultStatus.find((status: IStatus) => status?.id === idToFind)

export const exportTableData = async (
  setLoadingExportData,
  tableData,
  tags,
  serverColumns,
) => {
  const nome: string = 'alcada de desconto'
  const nomeArquivo: string = 'alcada_de_desconto'
  const exportData: IFranchiseeVendor[] = tableData
  const filtros: string = tags
    .map((tag: ITags) => `${tag.fieldName}: ${tag.searchField}`)
    .join(', ')

  const columns = () => {
    const list = []
    serverColumns.forEach(d => {
      list.push({
        label: d.title,
        value: d.dataIndex || d.key,
      })
      d.secondaryColumn &&
        d.secondaryColumn.map(e => {
          list.push({
            label: e.title,
            value: e.dataIndex || e.key,
          })
        })
    })

    return list
  }

  exportData.forEach((d: IFranchiseeVendor) => {
    d.statusDescricao = findStatus(d.status)?.name
  })

  exportExcel(
    nome,
    filtros,
    columns(),
    exportData,
    nomeArquivo,
    setLoadingExportData,
  )
}

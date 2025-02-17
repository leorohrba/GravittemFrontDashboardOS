import { IPriceListColumns } from "../../../interfaces/PriceListColumns"

export const priceListColumns: IPriceListColumns[] = [
    {
        title: 'Lista de preço',
        dataIndex: 'listaPreco',
        render: (d: string) => d,
    },
    {
        title: 'Desconto máximo',
        dataIndex: 'percentualDsctoMaximo',
        render: (d: string) => d,
    },
    {
        title: 'Margem de lucro máximo',
        dataIndex: 'percentualAcrescimoMaximo',
        render: (d: string) => d,
    },
]
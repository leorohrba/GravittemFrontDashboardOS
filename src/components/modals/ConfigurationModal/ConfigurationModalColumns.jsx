import { Checkbox, Table } from 'antd'
import update from 'immutability-helper'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

const type = 'DragableBodyRow'

export default function ConfigurationModalColumns({
  columnsList,
  setColumnsList,
  keyTable,
  checkedList,
  setCheckedList,
}) {
  const [indeterminate, setIndeterminate] = useState(false)
  const [checkAll, setCheckAll] = useState(false)

  useEffect(() => {
    const checkedData = columnsList
      .filter(d => d.ativo || d.obrigatorio || d.padrao)
      .map(d => d.nomeColuna)
    setCheckedList(checkedData)
    setCheckAll(checkedData.length === columnsList.length)
    setIndeterminate(
      !!checkedData.length && checkedData.length < columnsList.length,
    )
  }, [columnsList])

  const onCheckAllChange = e => {
    const checkedData = e.target.checked
      ? columnsList.map(d => d.nomeColuna)
      : columnsList
          .filter(d => d.obrigatorio || d.padrao)
          .map(d => d.nomeColuna)
    setCheckedList(checkedData)
    setCheckAll(e.target.checked && checkedData.length === columnsList.length)
    setIndeterminate(
      !!checkedData.length && checkedData.length < columnsList.length,
    )
  }

  function handleCheckbox(e) {
    let newList = checkedList
    if (e.target.checked) {
      newList = [...checkedList, e.target.value]
    } else {
      newList = checkedList.filter(c => c !== e.target.value)
    }
    setCheckedList(newList)
    setIndeterminate(!!newList.length && newList.length < columnsList.length)
    setCheckAll(newList.length === columnsList.length)
  }

  const columns = [
    {
      title: 'Coluna',
      dataIndex: 'nomeColuna',
    },
    {
      title: (
        <Checkbox
          indeterminate={indeterminate}
          onChange={onCheckAllChange}
          checked={checkAll}
        />
      ),
      align: 'right',
      render: d => (
        <Checkbox
          value={d.nomeColuna}
          checked={checkedList.find(c => c === d.nomeColuna)}
          onChange={handleCheckbox}
          disabled={d.obrigatorio}
        />
      ),
    },
  ]

  const DragableBodyRow = ({
    index,
    record,
    moveRow,
    className,
    style,
    ...restProps
  }) => {
    const canMove = record && !record.fixed
    const ref = useRef()
    const [{ isOver, dropClassName }, drop] = useDrop({
      accept: type,
      collect: monitor => {
        const { index: dragIndex } = monitor.getItem() || {}
        if (dragIndex === index) {
          return {}
        }
        return {
          isOver: monitor.isOver(),
          dropClassName:
            dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
        }
      },
      drop: item => {
        moveRow(item.index, index)
      },
    })
    const [, drag] = useDrag({
      type,
      item: { index },
      collect: monitor => ({
        isDragging: monitor.isDragging(),
        canDrag: record && !record.fixed,
      }),
    })
    canMove && drop(drag(ref))

    return canMove ? (
      <tr
        ref={ref}
        className={`${className}${isOver ? dropClassName : ''}`}
        style={{ cursor: 'move', ...style }}
        {...restProps}
      />
    ) : (
      <tr
        ref={ref}
        style={{ cursor: 'not-allowed', ...style }}
        {...restProps}
      />
    )
  }

  const components = {
    body: {
      row: DragableBodyRow,
    },
  }

  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      const dragRow = columnsList[dragIndex]
      setColumnsList(
        update(columnsList, {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
        }),
      )
    },
    [columnsList],
  )
  return (
    <DndProvider backend={HTML5Backend}>
      <Table
        columns={columns}
        pagination={false}
        dataSource={columnsList}
        rowKey={row => row.nomeColuna}
        components={components}
        onRow={(record, index) => ({
          index,
          record,
          moveRow,
        })}
        key={keyTable}
      />
    </DndProvider>
  )
}

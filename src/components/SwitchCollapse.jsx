/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Checkbox, Collapse, List, Switch } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'

const { Panel } = Collapse

export default function SwitchCollapse({
  data,
  activedKeys,
  setActivedKeys,
  checkedValues,
  setCheckedValues,
}) {
  const handleSwitch = (changed, key) => {
    if (changed) {
      setActivedKeys([...activedKeys, key])
      const item = data.find(d => d.key === key)
      const keys = item.children.map(i => i.key)
      setCheckedValues([...checkedValues, ...keys])
    } else {
      setActivedKeys(activedKeys.filter(c => c !== key))
    }
  }

  const handleCheck = (checked, key) => {
    if (checked) {
      setCheckedValues([...checkedValues, key])
    } else {
      setCheckedValues(checkedValues.filter(c => c !== key))
    }
  }

  return (
    <Collapse
      bordered={false}
      expandIcon={({ isActive }) =>
        isActive ? (
          <React.Fragment>
            <i
              className="fa fa-minus-square-o"
              style={{
                position: 'absolute',
                color: 'gray',
                left: '20px',
                top: '12px',
                fontSize: '24px',
              }}
            />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <i
              className="fa fa-plus-square-o"
              style={{
                position: 'absolute',
                color: 'gray',
                left: '20px',
                top: '12px',
                fontSize: '24px',
              }}
            />
          </React.Fragment>
        )
      }
    >
      {data.map(d => (
        <Panel
          header={<span className="ml-4">{d.permission}</span>}
          extra={
            <span onClick={e => e.stopPropagation()}>
              <Switch size="small" onChange={e => handleSwitch(e, d.key)} />
            </span>
          }
          key={d.key}
        >
          <List
            size="small"
            dataSource={d.children}
            renderItem={item => (
              <List.Item className="justify-start">
                <Checkbox
                  className="ml-10 mr-4"
                  key={item.key}
                  checked={checkedValues.indexOf(item.key) !== -1}
                  onChange={e => handleCheck(e.target.checked, item.key)}
                  disabled={activedKeys.indexOf(d.key) === -1}
                />
                <p className="mb-0">{item.description}</p>
              </List.Item>
            )}
          />
        </Panel>
      ))}
    </Collapse>
  )
}

SwitchCollapse.propTypes = {
  activedKeys: PropTypes.array,
  checkedValues: PropTypes.array,
  data: PropTypes.array,
  setActivedKeys: PropTypes.any,
  setCheckedValues: PropTypes.any,
}

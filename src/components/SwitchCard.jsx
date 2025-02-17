import { Collapse, Switch } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'

const { Panel } = Collapse

export default function SwitchCard({ checked, setChecked, content }) {
  return (
    <Collapse
      activeKey={checked}
      onChange={e => setChecked(e)}
      expandIcon={({ isActive }) => (
        <Switch
          size="small"
          checked={isActive}
          style={{ backgroundColor: isActive && '#4CAF50' }}
        />
      )}
    >
      {content.map((c, index) => (
        <Panel
          key={index}
          header={<span className="ml-4 font-bold">{c.title}</span>}
          extra={<span>{c.extra}</span>}
        >
          {c.content}
        </Panel>
      ))}
    </Collapse>
  )
}

SwitchCard.propTypes = {
  checked: PropTypes.any,
  content: PropTypes.any,
  setChecked: PropTypes.any,
}

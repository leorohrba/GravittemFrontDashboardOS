import { Icon } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'

export default function SmallTableFieldDescription({
  color,
  fontSize,
  icon,
  label,
  theme,
  fontStyle,
  className,
}) {
  return (
    <React.Fragment>
      <Icon
        theme={theme}
        type={icon}
        className={`mr-1 ${className}`}
        style={{ color, fontSize }}
      />
      <small style={{ color, fontStyle }}>{label}</small>
    </React.Fragment>
  )
}

SmallTableFieldDescription.propTypes = {
  color: PropTypes.string,
  fontSize: PropTypes.string,
  fontStyle: PropTypes.string,
  icon: PropTypes.string,
  label: PropTypes.string,
  theme: PropTypes.string,
}

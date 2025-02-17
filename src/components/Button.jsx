import { Button as AntdButton } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'

function Button({ faIcon, buttonColor, style, children, quantity, ...rest }) {
  return (
    <AntdButton
      {...rest}
      style={
        buttonColor
          ? {
              color: buttonColor,
              border: `1px solid ${buttonColor}`,
            }
          : style
      }
    >
      {!!faIcon && <i className={`fa fa-${faIcon} fa-lg mr-2`} />}
      {children} {`${quantity > 0 ? `(${quantity})` : ''}`}
    </AntdButton>
  )
}

Button.propTypes = {
  buttonColor: PropTypes.string,
  children: PropTypes.node,
  faIcon: PropTypes.string,
  quantity: PropTypes.number,
  style: PropTypes.object,
}

export default Button

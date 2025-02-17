import { message, notification } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'

function BasicLayout({ children }) {
  message.config({
    top: 30,
    maxCount: 3,
    duration: 3,
  })
  notification.config({
    placement: 'bottomRight',
    bottom: 50,
    duration: 10,
  })
  return <div>{children}</div>
}

BasicLayout.propTypes = {
  children: PropTypes.node,
}

export default BasicLayout

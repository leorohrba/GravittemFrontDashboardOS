import { Tooltip, Typography } from 'antd'
import React, { useState } from 'react'

const { Paragraph } = Typography

const TooltipParagraph = ({ children, ellipsis, ...props }) => {
  const [truncated, setTruncated] = useState(false)

  return (
    <Tooltip title={truncated ? children : undefined}>
      <Paragraph
        {...props}
        ellipsis={{ ...ellipsis, onEllipsis: setTruncated }}
        style={{ marginBottom: 0 }}
      >
        <>{children}</>
      </Paragraph>
    </Tooltip>
  )
}

export default TooltipParagraph

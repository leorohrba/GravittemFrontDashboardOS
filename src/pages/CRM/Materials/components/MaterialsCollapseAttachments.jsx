import { handleAuthError } from '@utils'
import { Card, Spin } from 'antd'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import {apiCRM} from '@services/api'

const colorIcon = '#3182ce'

export default function MaterialsCollapseAttachments({
  extension,
  fileName,
  libraryAttachId,
  urlFile,
}) {
  const [loading, setLoading] = useState(false)

  const downloadFile = () => {
    setLoading(true)
    apiCRM({
      url: `/api/crm/downloadLibraryAttach`,
      method: 'GET',
      params: { libraryAttachId },
      responseType: 'blob', // important
    })
      .then(response => {
        setLoading(false)
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
      })
      .catch(function abort(error) {
        // handle error
        setLoading(false)
        handleAuthError(error)
      })
  }

  const iconFile = (url, fileName, extension) => {
    let result

    if (extension === '.xls' || extension === '.xlsx') {
      result = (
        <i
          className="mr-2 fa fa-file-excel-o fa-3x"
          style={{ color: colorIcon }}
        />
      )
    } else if (extension === '.doc' || extension === '.docx') {
      result = (
        <i
          className="mr-2 fa fa-file-word-o fa-3x"
          style={{ color: colorIcon }}
        />
      )
    } else if (extension === '.pdf') {
      result = (
        <i
          className="mr-2 fa fa-file-pdf-o fa-3x"
          style={{ color: colorIcon }}
        />
      )
    } else {
      result = (
        <i
          className="mr-2 fa fa-file-text-o fa-3x"
          style={{ color: colorIcon }}
        />
      )
    }

    return result
  }

  return (
    <Card
      style={{
        width: 250,
      }}
      className="mr-5"
    >
      <Spin spinning={loading}>
        <div className="flex">
          {iconFile(
            `${process.env.UMI_API_HOST}${urlFile}`,
            fileName,
            extension,
          )}
          <p className="ml-2 mt-2">
            <span
              className="linkButton"
              onClick={() => downloadFile()}
              role="button"
            >
              {fileName}
            </span>
          </p>
        </div>
      </Spin>
    </Card>
  )
}

MaterialsCollapseAttachments.propTypes = {
  extension: PropTypes.string,
  fileName: PropTypes.string,
  urlFile: PropTypes.string,
  libraryAttachId: PropTypes.number,
}

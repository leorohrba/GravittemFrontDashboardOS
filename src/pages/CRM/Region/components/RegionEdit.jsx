/* eslint-disable react-hooks/exhaustive-deps */ 
import { Form } from '@ant-design/compatible'
import { apiRegion, apiCRM } from '@services/api'
import {
  fieldsValidationToast,
  getPermissions,
  handleAuthError,
  hasPermission,
  showApiMessages,
} from '@utils'

import { Alert, message, Spin, Modal } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import router from 'umi/router'
import RegionEditFooter from './RegionEditFooter'
import RegionEditForm from './RegionEditForm'
import RegionEditHeader from './RegionEditHeader'
import RegionZipCode from './RegionZipCode/RegionZipCode'
import RegionNeighborhood from './RegionNeighborhood/RegionNeighborhood'

function RegionEdit({ regionId, setRegionId, form, isModal, readOnly }) {
  const [editData, setEditData] = useState(null)
  const [alertMessages, setAlertMessages] = useState([])
  const [ownerProfile, setOwnerProfile] = useState(null)
  const [userPermissions, setUserPermissions] = useState([])
  const [canBeUpdated, setCanBeUpdated] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [keyRegionZipCode, setKeyRegionZipCode] = useState(0)
  const [keyRegionNeighborhood, setKeyRegionNeighborhood] = useState(0)
  const [formChanged, setFormChanged] = useState(false)
  const refRegion = React.useRef()
  const ref = React.useRef()

  useEffect(() => {
    getOwnerProfile()
    if (regionId) {
      getRegion(regionId)
    } 
    else 
    {
      setLoading(false)
      if (editData == null) {
        form.resetFields()
      }
      else {
        setEditData(null)
      }
    }
  }, [])
  
  useEffect(() => {
    if (ownerProfile) {
      setPermissions()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps  
  },[ownerProfile])

  async function setPermissions() {
    let permissions = await getPermissions()
    if (readOnly || ownerProfile === 'Franchise') {
      permissions = permissions.filter(x => !(x.name === 'Include' || x.name === 'Exclude' || x.name === 'Alter'))
    }
    setUserPermissions(permissions)
  }

  async function getOwnerProfile() {
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/CRM/Owner`,
      })
      const { data } = response
      if (data.isOk) {
        setOwnerProfile(data.ownerProfile)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  useEffect(() => {
    setCanBeUpdated(hasPermission(userPermissions, 'Alter'))
  }, [userPermissions])

  useEffect(() => {
    setFormChanged(true)
  },[form.getFieldValue('name'), 
     form.getFieldValue('description'), 
     form.getFieldValue('delimitedBy'),
     form.getFieldValue('status')
    ]
  )
  
  useEffect(() => {
    form.resetFields()
    setFormChanged(false)
  }, [editData])

  useEffect(() => {
    refreshDetail(form.getFieldValue('delimitedBy'))
  }, [form.getFieldValue('delimitedBy')])
  
  const refreshDetail = (delimitedBy) => {
     if (delimitedBy === 2) {
       setKeyRegionZipCode(keyRegionZipCode + 1)
     }
     else if (delimitedBy === 3) {
       setKeyRegionNeighborhood(keyRegionNeighborhood + 1)
     }
  }

  useEffect(() => {
    if (
      !loading &&
      canBeUpdated &&
      refRegion.current 
    ) {
      try { refRegion.current.focus() } catch {}
    }
  }, [loading, canBeUpdated])

  async function getRegion(id) {
    setLoading(true)
    try {
      const response = await apiRegion({
        method: 'POST',
        url: `/api/Regiao/Select`,
        data: { regiaoId: [id] },
      })
      setLoading(false)
      const { data } = response
      if (data.isOk && data.regiao.length > 0) {
        const region = data.regiao[0]
        setEditData(region)
        refreshDetail(region.delimitadoPor)
      } else if (data.isOk && data.regiao.length === 0) {
        message.error('Região não encontrada!')
        if (!isModal) {
           router.push('/Region')
        }
      } else {
        setLoading(false)
        showApiMessages(data)
        if (!isModal) {
          router.push('/Region')
        }
      }
    } catch (error) {
      handleAuthError(error)
      if (!isModal) {
        router.push('/Region')
      }
    }
  }

  function handleSave(closeForm, createNewRegion) {
    setAlertMessages([])
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        saveRegion(closeForm, createNewRegion)
      } else if (err) {
        fieldsValidationToast(err)
      }
    })
  }

  async function saveRegion(closeForm, createNewRegion) {
    setIsSaving(true)
    setLoading(true)

    const body = {
      id: regionId,
      nome: form.getFieldValue('name'),
      descricao: form.getFieldValue('description'),
      delimitadoPor: form.getFieldValue('delimitedBy'),
      status: form.getFieldValue('status'),
    }

    try {
      const response = await apiRegion({
        method: 'POST',
        url: `/api/Regiao`,
        data: body,
        headers: { 'Content-Type': 'application/json' },
      })

      setIsSaving(false)
      setLoading(false)

      const { data } = response

      if (data.isOk) {
        message.success(
          formatMessage({
            id: 'successSave',
          }),
        )
        setFormChanged(false)

        let idGenerated = regionId

        if (data.idGerado.length > 0) {
          // eslint-disable-next-line prefer-destructuring
          idGenerated = data.idGerado[0]
          setRegionId(idGenerated)
          if (!isModal) {
            router.push(`/Region/detail/${data.idGerado[0]}`)
          }
        }
        
        if (closeForm && !isModal) {
          router.push(`/Region`)
        }
        else if (createNewRegion) {
          clearForm()
        }
        else {
          getRegion(idGenerated)
        }
      } else {
        setAlertMessages(data.notificacoes)
        showApiMessages(data)
        if (ref.current) {
          ref.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }
      }
    } catch (error) {
      setIsSaving(false)
      setLoading(false)
      handleAuthError(error)
    }
  }
  
  function clearForm() {
    if (!isModal) {
      router.push(`/Region/detail`)
    }
    setRegionId(null)
    if (editData === null) {
      form.resetFields()
    }
    else {
      setEditData(null)
    }
    setFormChanged(false)
  }
  
  const newRegion = () => {
    if (formChanged) {
      Modal.confirm({
        title: 'Deseja salvar alterações da região?',
        onOk: () => handleSave(false, true),
        cancelText: 'Não',
        okText: 'Sim',
        okButtonProps: { size: 'large' },
        cancelButtonProps: { size: 'large' },
      })
    }
    else {
      clearForm()
    }
    if (refRegion.current) {
      try { refRegion.current.focus() } catch {}
    }
  
  }

  return (
    <div className="container">
      <Spin size="large" spinning={loading}>
        <RegionEditHeader
          isSaving={isSaving}
          loading={loading}
          regionId={regionId}
          canBeUpdated={canBeUpdated}
          newRegion={newRegion}
          userPermissions={userPermissions}
          isModal={isModal}
        />

        <div ref={ref}>
          {alertMessages.map((message, index) => (
            <Alert
              type="error"
              message={message.mensagem}
              key={index}
              showIcon
              className="mb-2"
            />
          ))}
        </div>

        <RegionEditForm
          form={form}
          canBeUpdated={canBeUpdated}
          ref={refRegion}
          editData={editData}
        />
        
        {regionId && formChanged && editData?.delimitadoPor !== form.getFieldValue('delimitedBy') && form.getFieldValue('delimitedBy') !== 1 && (
          <Alert 
            type="warning" 
            message="Salve a região antes de inserir ou excluir registros na tabela abaixo!"
            showIcon
            className="mb-5"
          />
        )}
        
        {regionId && form.getFieldValue('delimitedBy') === 2 && (
          <RegionZipCode
            regionId={regionId}
            regionName={form.getFieldValue('name')}
            userPermissions={userPermissions}
            keyRegionZipCode={keyRegionZipCode}
          />
        )}          

        {regionId && form.getFieldValue('delimitedBy') === 3 && (
          <RegionNeighborhood
            regionId={regionId}
            regionName={form.getFieldValue('name')}
            userPermissions={userPermissions}
            keyRegionNeighborhood={keyRegionNeighborhood}
          />
        )}          
        
        <RegionEditFooter
          handleSave={handleSave}
          isSaving={isSaving}
          canBeUpdated={canBeUpdated}
          loading={loading}
          formChanged={formChanged}
          isModal={isModal}
        />
      </Spin>
    </div>
  )
}

RegionEdit.propTypes = {
  form: PropTypes.any,
  regionId: PropTypes.string,
  setRegionId: PropTypes.func,
  isModal: PropTypes.bool,
  readOnly: PropTypes.bool,
}

const WrappedRegionEdit = Form.create()(RegionEdit)
export default WrappedRegionEdit

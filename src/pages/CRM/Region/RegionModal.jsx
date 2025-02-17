import { Button, Modal, Row } from 'antd'
import React from 'react'
import PropTypes from 'prop-types'
import RegionEdit from './components/RegionEdit'

export default function RegionModal({
  visible,
  setVisible,
  regionId,
  setRegionId,
  readOnly
}) {
  
  return (
  <React.Fragment>  
    <Modal
      visible={visible}
      title="Regiões"
      onCancel={() => setVisible(false)}
      centered
      width="80%"
      footer={
        <Row type="flex">
          <Button
            type="secondary"
            style={{ marginLeft: 'auto' }}
            onClick={() => setVisible(false)}
          >
            Fechar
          </Button>
        </Row>
      }
    >
      {visible ? (
        <div>
         <RegionEdit
           regionId={regionId}
           setRegionId={setRegionId}
           readOnly={readOnly}
           isModal
         />
        </div>
      ) : ( <div style={{ minHeight: '1000px' }} />)}
    </Modal>
  </React.Fragment>  
  )
}

RegionModal.propTypes = {
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
  readOnly: PropTypes.bool,
  regionId: PropTypes.string,
  setRegionId: PropTypes.func,
}



import React from 'react'

import { Modal, Button } from 'antd';
import TableCreateComponent from './TableCreateComponent';

function ModelCardPopup({dataFromCard,dataInVisible,dataOk,dataCancel,showModalPass}) {
  return (
    <div>
        <Modal title="Scaffold Control System Information" style={{
            backgroundColor:'pink'
        }} visible={dataInVisible} onOk={dataOk} onCancel={dataCancel}>
      {dataFromCard.map(function(e){
          return(
              <div>
                  <p>{e.jobtitle}</p>
                  <p style={{color:'red'}}>{e.workOrderNo}</p>
                  <p>{e.requestedby}</p>

                  <p>{e.scaffoldtype}</p>
              </div>
          )
      })}
      <TableCreateComponent key={Math.floor(Math.random(1,10000)*100)} showModalPassToTable={showModalPass} dataToSendTable={dataFromCard.length>0 ? dataFromCard[0].workOrderNo:{}}/>
      </Modal>
    </div>
  )
}

export default ModelCardPopup
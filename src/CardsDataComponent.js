import React, { useEffect } from 'react'
import './CardDataComponent.css'

import { Card, Col, Row,Badge } from 'antd';
import {useState} from "react"
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Skeleton, Switch } from 'antd';
import ModelCardPopup from './ModelCardPopup';


const { Meta } = Card;

function CardsDataComponent() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [individualCardData, setIndividulCardData]=useState([])
    const [fetchDataTable, setfetchDataTable]=useState([])
    const [dataFromLoad,setDataFromLoad]=useState([])

    async function handleExportCard(){
      let data= await fetch("https://rcz-vam-1.herokuapp.com/api/getregdata?fromCollectionId=thilakraj@Collection")
      
      let dataCollect= await fetch("https://rcz-vam-1.herokuapp.com/api/getregdata?fromCollectionId=thilakraj@CollectiondayWiseRecord")
      let datas=await data.json()
      let dataCollection=await dataCollect.json();
      let finalresult=datas.map((e)=>{
        let finalcollectionresult=dataCollection.filter((t)=>{
          return e.workOrderNo==t.workId
        })
        if(finalcollectionresult.length){
            return { ...e,finalWorkProgressStatus:finalcollectionresult[finalcollectionresult.length-1].workstatus}
        }else{
          return e
        }
      })
      
      setDataFromLoad(finalresult)
    }

    useEffect(() => {
      handleExportCard()
    }, [])
    

    const showModal =async (e) => {
      setIsModalVisible(true);
      setIndividulCardData([e])
      
      let dataCollect= await fetch("https://rcz-vam-1.herokuapp.com/api/getregdata?fromCollectionId=thilakraj@CollectiondayWiseRecord")
      let dataCollection=await dataCollect.json();
      let filteredData=dataCollection.filter(v=>{
          return v.workId==e.workOrderNo
      })
      setfetchDataTable(filteredData)

    };
  
    const handleOk = () => {
      setIsModalVisible(false);
    };

    // const deleteOperation = async(emp_name) => {
    //   // setIsModalVisible(false);
    //   alert(emp_name)
    // };
  
    const handleCancel = () => {
      setIsModalVisible(false);
    };
  return (
    <div className="site-card-wrapper">
     
    <Row gutter={10}>
    {dataFromLoad.map(function(e){
        return(
          <Badge.Ribbon text={e.finalWorkProgressStatus&&e.finalWorkProgressStatus.startsWith("w")?"In-process":"Completed"} color={e.finalWorkProgressStatus&&e.finalWorkProgressStatus.startsWith("w")?"green":"red"}>
      
    
          <div className="col-1">
          <Card
          style={{
            width: 300,
            marginTop: 16,
            backgroundColor:'grey',
            color:'white'
            
          }}
          actions={[
            <SettingOutlined key="setting" />,
            <EditOutlined key="edit" onClick={function(){showModal(e)}} />,
            <EllipsisOutlined key="ellipsis" />,
            // <EditOutlined key="delete" onClick={function(){deleteOperation()}} />
            
          ]}
        >
            <Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title={e.jobtitle} 
              description={e.workOrderNo}
            />
            <h5>{e.requestedby}</h5>
            <p>{e.address}<br></br>{e.city}</p>
        
            <h6>{e.scaffoldtype}</h6>
            <li>Dismantling: {e.dateExpectedtoCompleteDismantling}</li>
        </Card>
        
        </div>
        </Badge.Ribbon>
        )
      })}
  
    </Row>
    
    <ModelCardPopup dataFromCard={individualCardData} showModalPass={fetchDataTable} dataInVisible={isModalVisible} dataOk={handleOk} dataCancel={handleCancel}/>
  </div>
  )
}

export default CardsDataComponent;
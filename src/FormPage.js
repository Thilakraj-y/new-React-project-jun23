import React from 'react'
import './App.css';
import carreerpic from "./undrawimage.svg"
import {useState} from "react"
import { Card, Col, Row } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';

// import CardsDataComponent from './CardsDataComponent';

const { Meta } = Card;



function saveFile(bytesBase64, mimeType, fileName) {
    var fileUrl = "data:" + mimeType + ";base64," + bytesBase64;
    fetch(fileUrl)
        .then(response => response.blob())
        .then(blob => {
            var link = window.document.createElement("a");
            link.href = window.URL.createObjectURL(blob, { type: mimeType });
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

function FormPage() {
    
  const [items, setItems]=useState(
    {
      requestNo : new Date().getTime(),
      workOrderNo : new Date().getTime() + "#WO", // "16634343434#WO"
      jobtitle:"",
      requestedby:"",
      collectionId : "thilakraj@Collection",
      address:"",
      zip:"",
      city:"",
      country:"",
      dateExpectedtoCompleteErection:"",
      dateExpectedtoCompleteDismantling:"",
      dimension:{
        length:"",
        width:"",
        height:"",
        volume:function(){
          return this.length * this.width * this.height
        }
      },
      scaffoldtype:"",
      materialcount:0
    }
    )

    const[collectionDataCard,setCollectionDataCard]=useState([])

    
    var data = {
      // Customize enables you to provide your own templates
      // Please review the documentation for instructions and examples
      "customize": {
          //  "template": fs.readFileSync('template.html', 'base64') // Must be base64 encoded html 
      },
      "images": {
          // The logo on top of your invoice
          "logo": "https://public.easyinvoice.cloud/img/logo_en_original.png",
          // The invoice background
          "background": "https://public.easyinvoice.cloud/img/watermark-draft.jpg"
      },
      // Your own data
      "sender": {
          "company": "Acendas pvt.ltd",
          "address": "Duraisamy Road,vadapalani",
          "zip": "600026",
          "city": "Chennai",
          "country": "India"
          //"custom1": "custom value 1",
          //"custom2": "custom value 2",
          //"custom3": "custom value 3"
      },
      // Your recipient
      "client": {
          "company": items.jobtitle,
          "address": items.address,
          "zip":items.zip,
          "city": items.city,
          "country": items.country
          // "custom1": "custom value 1",
          // "custom2": "custom value 2",
          // "custom3": "custom value 3"
      },
      "information": {
          // Invoice number
          "number": items.workOrderNo,
          // Invoice data
          "date": new Date(),
          // Invoice due date
          "due-date": new Date()
      },
      // The products you would like to see on your invoice
      // Total values are being calculated automatically
      "products": [
          {
              "quantity": items.materialcount,
              "description": items.scaffoldtype,
              "tax-rate": 1.5,
              "price": 450
          }
       
      ],
      // The message you would like to display on the bottom of your invoice
      "bottom-notice": "Kindly pay your invoice within 15 days.",
      // Settings to customize your invoice
      "settings": {
          "currency": "INR", // See documentation 'Locales and Currency' for more info. Leave empty for no currency.
          // "locale": "nl-NL", // Defaults to en-US, used for number formatting (See documentation 'Locales and Currency')
          // "tax-notation": "gst", // Defaults to 'vat'
          // "margin-top": 25, // Defaults to '25'
          // "margin-right": 25, // Defaults to '25'
          // "margin-left": 25, // Defaults to '25'
          // "margin-bottom": 25, // Defaults to '25'
          // "format": "A4", // Defaults to A4, options: A3, A4, A5, Legal, Letter, Tabloid
          // "height": "1000px", // allowed units: mm, cm, in, px
          // "width": "500px", // allowed units: mm, cm, in, px
          // "orientation": "landscape", // portrait or landscape, defaults to portrait
      },
      // Translate your invoice to your preferred language
      "translate": {
          // "invoice": "FACTUUR",  // Default to 'INVOICE'
          // "number": "Nummer", // Defaults to 'Number'
          // "date": "Datum", // Default to 'Date'
          // "due-date": "Verloopdatum", // Defaults to 'Due Date'
          // "subtotal": "Subtotaal", // Defaults to 'Subtotal'
          // "products": "Producten", // Defaults to 'Products'
          // "quantity": "Aantal", // Default to 'Quantity'
          // "price": "Prijs", // Defaults to 'Price'
          // "product-total": "Totaal", // Defaults to 'Total'
          // "total": "Totaal" // Defaults to 'Total'
      },
    };

    function handleExport(){
      easyinvoice.createInvoice(data, function (result) {
        // The response will contain a base64 encoded PDF file
        console.log('PDF base64 string: ', result.pdf);
        saveFile(result.pdf, "application/pdf", "something");
      })
    }


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
      
      setCollectionDataCard(finalresult)
    }

    

    async function handleValidationAndSendData(){
      console.log(items);
      await fetch("https://rcz-vam-1.herokuapp.com/api/addregistration",{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(items),
    })
    }

  return (
    <div className="container">
    <div className="row">
      <div className="col-5 imagewidth">
        <img className="sathish" src={carreerpic} alt="imagedarw"></img>
      </div>
      

      <div className="col formwidth">
      <form className="row g-4 newone">
        <h1>Order Form</h1>
      <div className="col-md-6">
        <label htmlFor="inputEmail4" className="form-label">Job Title</label>
        <input onChange={function(e){
          setItems({...items, jobtitle:e.target.value})
        }} type="text" className="form-control" id="inputEmail4"/>
      </div>
      <div className="col-md-6">
        <label htmlFor="inputPassword4" className="form-label">Requested_By</label>
        <input onChange={function(e){
          setItems({...items, requestedby:e.target.value})
        }} type="text" className="form-control" id="inputPassword4"/>
      </div>
      <div className="col-12">
        <label htmlFor="inputAddress" className="form-label">Address</label>
        <input onChange={function(e){
          setItems({...items, address:e.target.value})
        }} type="text" className="form-control" id="inputAddress" placeholder="1234 Main St"/>
      </div>
      <div className="col-4">
        <label htmlFor="inputAddress" className="form-label">Zip</label>
        <input onChange={function(e){
          setItems({...items, zip:e.target.value})
        }} type="text" className="form-control" id="inputAddress" />
      </div>
      <div className="col-4">
        <label htmlFor="inputAddress" className="form-label">City</label>
        <input onChange={function(e){
          setItems({...items, city:e.target.value})
        }} type="text" className="form-control" id="inputAddress"/>
      </div>
      <div className="col-4">
        <label htmlFor="inputAddress" className="form-label">country</label>
        <input onChange={function(e){
          setItems({...items, country:e.target.value})
        }} type="text" className="form-control" id="inputAddress" />
      </div>
      
      <div className="col-md-6">
        <label htmlFor="inputEmail4" className="form-label">Date Expected to Complete Erection</label>
        <input onChange={function(e){
          setItems({...items, dateExpectedtoCompleteErection:e.target.value})
        }} type="date" className="form-control" />
      </div>
      <div className="col-md-6">
        <label htmlFor="inputPassword4" className="form-label">Date Expected to Complete Dismantling</label>
        <input onChange={function(e){
          setItems({...items, dateExpectedtoCompleteDismantling:e.target.value})
        }} type="date" className="form-control" />
      </div>

      <div className="mb">
          Dimension
      </div>
      <div className="input-group mb-1 dimensionwidth">
        <span className="input-group-text" id="basic-addon1">Length</span>
        <input onChange={function(e){
          setItems({...items, dimension:{...items.dimension,length:e.target.value}})
        }} type="text" className="form-control" />
      </div>
      <div className="input-group mb-1 dimensionwidth">
        <span className="input-group-text" id="basic-addon1">Width</span>
        <input onChange={function(e){
          setItems({...items,dimension:{...items.dimension,width:e.target.value}})
        }} type="text" className="form-control" />
      </div>
      <div className="input-group mb-1 dimensionwidth">
        <span className="input-group-text" id="basic-addon1">Height</span>
        <input onChange={function(e){
          setItems({...items,dimension:{...items.dimension,height:e.target.value}})
        }} type="text" className="form-control" />
      </div>
   
      <div className="col-md-6">
        <label htmlFor="inputState" className="form-label">Scaffold Type</label>
        <select onChange={function(e){
          setItems({...items,scaffoldtype:e.target.value})
        }} id="inputState" className="form-select">
          <option selected>...Choose...</option>
          <option>Scafold_long</option>
          <option>Scafold_Medium</option>
          <option>Scafold_Short</option>
          <option>Scafold_Join</option>
        </select>
      </div>
      <div className="col-md-6">
        <label htmlFor="inputState" className="form-label">Material_Count</label>
        <select onChange={function(e){
          setItems({...items,materialcount:e.target.value})
        }} id="inputState" className="form-select">
          <option selected>...Choose...</option>
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
          <option>6</option>
        </select>
      </div>
    
    <div className="d-grid gap-2 d-md-flex justify-content-md-center">
    <button onClick={function(){
      handleValidationAndSendData();
    }} className="btn btn-outline-secondary but1"  type="button">SUBIT</button>
    <button type="button" className="btn btn-outline-secondary but2" onClick={function(){
      handleExport();
    }}>Export DATA</button>
    <button onClick={function(){
      handleExportCard();
    }} type="button" className="btn btn-outline-secondary but3">GET DATA</button>
    </div>
    </form>
      </div>
    </div>

</div>
  )
}

export default FormPage
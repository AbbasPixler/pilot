import {useEffect, useRef} from 'react';
import WebViewer from '@pdftron/webviewer'

export default function WordPreview({
  offers,
  customer,
  endCustomer,
  deviceList,
  listings,
  contact,
  companies,
  owner
})  {
  const viewer = useRef(null);
  
  useEffect(() => {
    let jsonData = {
      customer_address_name: customer ? customer['name'] : "N/A",
      customer_address_street_no: customer ? customer['streetnumber'] : "N/A",
      customer_address_postcode_city: customer ? customer['zipcode'] : "N/A",
      customer_address_country: customer ? customer['country'] : "N/A",
      customer_address_email: customer ? customer['email'] : "N/A",
      customer_number: customer ? customer['number'] : "N/A",
      offer_number: offers ? offers['offerNumber'] : "N/A",
      Date: 'Nov 5th, 2021',
      ExpiryDate: 'Dec 5th, 2021',
      QuoteNumber: '134',
      WEBSITE: 'www.pdftron.com', 
      billed_items: {
        insert_rows: [
          ['Apples', '3', '$5.00', '$15.00'],
          ['Oranges', '2', '$5.00', '$10.00'],
        ],
      },
      days: '30',
      total: '$25.00',
    };
    const callViewer = async() =>{
      try{
        await 
        WebViewer(
          {
            path: '/webviewer/lib',
            // initialDoc: 'https://siamsuitsimages.s3.ap-northeast-1.amazonaws.com/doc1.docx',
            initialDoc: '/files/doc2.docx',
            licenseKey: 'demo:1703846682138:7c9df0a70300000000d64f1957a40cbd00897bba930e1e1379b2a3096f',  // sign up to get a free trial key at https://dev.apryse.com
          },
          viewer.current,
          // document.getElementById('viewer'), // Element to mount the viewer
        )
        .then(instance => {
    
          // instance.loadDocument('/files/doc2.docx', {
          //   officeOptions: {
          //     doTemplatePrep: true 
          //   }
          // }); 
          // instance.UI.loadDocument('/files/doc2.docx', { filename: 'doc2.docx' });
    
        
          const { documentViewer } = instance.Core;
          documentViewer.addEventListener('documentLoaded', async() => {
            const doc = documentViewer.getDocument();
        
            // it is possible to extract document template keys in WebViewer
            const keys = doc.getTemplateKeys();
            const options = {};
            keys.then((value) =>{
              console.log("value: ", value)
    
               for(let x of value){
                console.log(x)
                options[x] = jsonData[x]
              }
              console.log("options: ", options)
              console.log("json: ", jsonData)
              return options
            }       
              
            ).then((val) =>{
              console.log("val: ", val)
               documentViewer.getDocument().applyTemplateValues(val);
            })
            // create an options object and add your template
            // replacement values to it
           
        
            
            // apply the template values to the currently loaded document in WebViewer
          });
        })

      }catch(err){

      }
    }
    

 
    callViewer()
      }, [customer, offers]);  
  return (
    <div className="MyComponent">
      <div className="webviewer" ref={viewer} id="viewer" style={{height: "100vh"}}></div>
    </div>
  );
};
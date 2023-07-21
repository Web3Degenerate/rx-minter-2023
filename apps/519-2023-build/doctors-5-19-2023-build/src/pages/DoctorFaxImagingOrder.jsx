import 'bootstrap/dist/css/bootstrap.css';
import "../styles/App.css"; //  import "../styles/ViewScripts.css";
import axios from 'axios'; 
import html2canvas from 'html2canvas';
//https://www.npmjs.com/package/html2canvas  => https://github.com/niklasvh/html2canvas 

// import "../styles/html2canvas.js";
// import * as htmlToImage from 'html-to-image';



import { useAddress, useContract, ConnectWallet, useOwnedNFTs, ThirdwebNftMedia, 
    useTransferNFT, useMetadata, useNFT, MediaRenderer, useContractRead } from "@thirdweb-dev/react";
    //removed MediaRenderer, Web3Button

  import React, { useState, useEffect, useRef, useContext, getContext } from 'react'
  
  import { useNavigate, Link, useParams } from 'react-router-dom'
  
  import { ethers } from 'ethers';
 
  import { addyShortner,convertBigNumberToFourDigitYear, RemedySvgPdfGenerator, formatDateFourDigitYear } from '../utils'
    //work out: dayCalculatorDoc

    // import { RemedySvgForJorgeRucker } from '../doctorSigGeorge'
    // import { RemedySvgOrderMri } from '../doctorSigGeorge/imaging' 
    // import { RemedySvgOrderRx } from '../doctorSigGeorge/rx' 

  import {RemedySvgOrderMri} from '../fax-template/imaging-order'

  import { solidityContractAddress } from '../constants'
  

    // import { FormField, CustomButton, ScriptSvgTemplate, RemedySvgPdfTemplate } from '../components';
    // import { RemedySvgPdfTemplate } from '../components';

    // import RemedySvgTemplate from '../components/RemedySvgTemplate';
    //   import { GetMedication } from '../components';

    // import { alertService } from '../services';

    // import { scriptImageTest, RemedyScriptTemplatePDF } from '../assets';

//************************************************************************************************************************** *//
// ****** TUTORIAL RAYS ON REACT IMAGE UPLAOD - MY MAN IN INDIA: https://www.youtube.com/watch?v=fFx4Pbe9dAs *************** //
//************************************************************************************************************************** *//

const DoctorFaxImagingOrder = () => {

    const { id } = useParams();

    const navigate = useNavigate(); 
 
    const { contract } = useContract(solidityContractAddress);
    const address = useAddress(); 

    console.log("contract address is: ",address)
    console.log("address is ",address)

  const { data: nft, isLoading: isLoadingNFT } = useNFT(contract, id);

    console.log("nft call using useNFT() retunred: ",nft)

    // console.log("Single nft to fax is: ",nft)

    // const { data: nfts, isLoading: loading } = useOwnedNFTs(contract, address);
    // console.log("owned NFTs from connected wallet are :",nfts)


    //************************************* Pull in Pharmacies for drop down menu ********************** */

//State for Pharmacies, initialized as []
const [pharmacy, setPharmacy] = useState([]);

// useEffect to load the pharmacies on page load:
useEffect(()=> {    
    loadSVGTemplater();
    loadViewPharmacy();
    // loadDoctors(); 
    // loadPatientByWallet();
    // loadPatientByWallet();
  
//   handleConvertClickerInternal()
}, [])

const loadSVGTemplater = () => {
    const templateSVG = RemedySvgPdfGenerator("Loading", "Loading", "Loading", "Loading", "Loading", "Loading")
    setGenerateSVGAuto(templateSVG)
}

// Make call to server to pull pharmacies:
const loadViewPharmacy = async () => {
  const result = await axios.get("https://rxminter.com/php-react/view-pharmacy.php");
  console.log(result);
  setPharmacy(result.data.records);
  
}

// const doctor_id = 1; (Doc name attribute 8.)

const [doctor, setDoctor] = useState({
    doctor_name: "",
    doctor_dea: "",
    doctor_wallet_address: "",
    doctor_npi:"",
    doctor_phone:"",
    doctor_fax: "",
    did:""
});
const {doctor_name,doctor_dea,doctor_wallet_address,doctor_npi,doctor_phone,doctor_fax,did} = doctor; 

// const loadDoctors = async () => {
    
//     setDoctor({doctor_name: "", doctor_dea: "", doctor_wallet_address: "", doctor_npi:"", id:"", doctor_phone:"", doctor_fax:""});
//     const result = await axios.get("https://rxminter.com/php-react/edit-doctor.php?id="+doctor_id);
    
//     console.log(result);
//     setDoctor(result.data);
// }

// useEffect(()=> {    
//     loadPatientByWallet();
// }, [nft])


const [patient, setPatient] = useState({
    name: "",
    wallet_address: "",
    email:"",
    dob:"",
    pt_physical_address:"",
    pt_phone:"",
    pid:""
});

const {name,wallet_address,email,dob,pt_physical_address,pt_phone,pid} = patient;
    // const loadPatientByWallet = async () => {
    //     // console.log('ID check inside loadUsers', id) 
    // //   setPharmacy({pharmacy_name: "", pharmacy_wallet: "", pharmacy_phone:"", pharmacy_fax: "", pharmacy_address:"", id:""});
    // setPatient({name: "", wallet_address: "", email: "", dob:"", pt_physical_address:"", pt_phone:"", pid:""});
    //     const wallet_address = nft?.metadata.attributes[4].value;
    //     const result = await axios.get("https://rxminter.com/php-react/patient-get-by-address.php?wallet_address="+wallet_address);
    //     // console.log("loadPharmacyByAddress fetched:", result);
    //     // setPatient(result.data.records);
    //     setPatient(result.data);
    //     // navigate('/');
    //     console.log("loadPatientByWallet patient.pt_phone is: ",patient.pt_phone)
    // }



// **************** SVG => JPEG PAGE LOGIC ****************************** //
    // const svgContainer = useRef();
    // const canvasTest = useRef();
    // const pngContainer = useRef();

    const [getImageDataUrl, setGetImageDateUrl] = useState('')
    const [generateSVGAuto, setGenerateSVGAuto] = useState('');

    const svgContainerInternal = useRef();

    const svgContainerInternalDiv = useRef();

 // **************** Pharmacy State ******************************************* //
 
//  const [rxWallet, setRxWallet] = useState({
//     tokenId: '', 
//     rxWallet: '', 
//     pharmacyName: ''
//   });

//   const inputTokenId = useRef(); 
//   const inputPharmacyWallet = useRef('');

// ****************************** GET Selected Pharmacy ******************************************************//

const [pharmacyFax, setPharmacyFax] = useState({
    pharmacy_name: "",
    pharmacy_wallet: "",
    pharmacy_phone:"",
    pharmacy_fax:"",
    pharmacy_address:"",
    id:""
});
  

const handlePharmacyChange = async (e, id) => {
  const {value, options } = e.target

  const result = await axios.get("https://rxminter.com/php-react/pharmacy-get-by-address.php?pharmacy_wallet="+e.target.value);
  setPharmacyFax(result.data);
  console.log("handlePharmacyChange server data: ",result.data)
  let getSelectedPharmacy = result.data.pharmacy_name
  const getSelectedFax = `1${result.data.pharmacy_fax.replace(/-/g, '')}`;
//   let getSelectedFax = result.data.pharmacy_fax

  setPharmacyFax({...scriptFax, pharmacy_fax: getSelectedFax });
  setScriptFax({...scriptFax, pharmacy_fax: getSelectedFax });

  setShowSubmitButton('block')
  setDisplaySelectedPharmacy(getSelectedPharmacy)

//   setRxWallet({...rxWallet,[e.target.name]: e.target.value, tokenId: tokenId, pharmacyName: options[e.target.selectedIndex].text })
  console.log("Event passed to handlePharmacyChange is ", e);
//   console.log('handlePharmacyChange just updated:', rxWallet);

  // const result = axios.get("https://rxminter.com/php-react/pharmacy-get-by-address.php?pharmacy_wallet="+rxWallet.rxWallet);
  // setPharmacyFax(result.data);
  // alert(`You have selected ${pharmacyFax.pharmacy_name} pharmacy with fax # of ${pharmacyFax.pharmacy_fax}.`)
  // const getSelectedFax = loadPharmacyByAddress(rxWallet.rxWallet)
  console.log("handlePharmacyChange pharmacyFax is now: ", pharmacyFax)

//AT BREAK (4:38pm) on Wed 6/21/23 we needed to call handleConvertClickerInteral() to update the selected fax number on scriptFax state
  handleConvertClickerInternal() 
  const dislayFaxNumber = getSelectedFax.replace(/^1/, '').replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'); // Add dashes
  alert(`You have selected ${getSelectedPharmacy} pharmacy with fax # of ${dislayFaxNumber}.`)
}

// **************************** handleSubmitToPharmacy Form Submission ******************************//

const handleSubmitTest = async (e) => { 

    e.preventDefault();
    console.log("handleSubmitTests e value:", e)


    // if (confirm(`Transfer Prescription Item #${rxWallet.tokenId} to Pharmacy: ${pharmacyFax.pharmacy_name} at address: ${rxWallet.rxWallet} for ${sig} by ${prescriber}. Okay ${pt_name}? Fax: ${pharmacyFax.pharmacy_fax} `) == true){

    if (confirm(`Transfer Imaging Order NFT #${nft?.metadata.id} to Facility: ${pharmacyFax.pharmacy_name} at wallet address: ${pharmacyFax.pharmacy_wallet} with Fax Number: ${pharmacyFax.pharmacy_fax} for Imaging Order: ${nft?.metadata.attributes[0].value} with SIG of ${nft?.metadata.description}. Click Okay to proceed or Cancel to change. `) == true){
    //   await _safeTransferFromToPharmacy({ ...rxWallet })
    sendFax()
    }

  }

// *************************** sendFax Function and State ********************************************//
//17162106152
    const [scriptFax, setScriptFax] = useState({ 
        script_image_name: "",
        script_image_location: "",
        pharmacy_fax: ""
    });

    const [options, setOptions] = useState({
        autoClose: false,
        keepAfterRouteChange: false
    });

const sendFax = () => {

try{
    // await axios.post("https://rxminter.com/srfax/Queue_Fax.php", scriptFax).then((result)=>{
    axios.post("https://rxminter.com/srfax/Staging_Queue_Fax.php", scriptFax

    ).then((result)=>{
    
    
        console.log(result);
        // setOptions(result);
        // alertService.success(`Success, The Fax Image Named ${scriptFax.script_image_name} has been sent!`, options);
        // alert(`Success, The fax image named ${scriptFax.script_image_name} has been sent!`, result);
        // alert(`Success, your script has been sent to fax number ${scriptFax.pharmacy_fax}` );
        console.log('Fax axios then clause result is: ',result)


     
        if(result.data.status == 'valid'){
            // navigate('/');
            // alert('sendFax() received result.data.status = valid')
            // setOptions(result.data)
            // setOptions(result)

            // alertService.success(`Valid, The Fax Image Named ${scriptFax.script_image_name} has been sent!`, options);
            // alert(`Valid, The Fax Image Named ${scriptFax.script_image_name} has been sent!`, options);

            const dislayFaxNumber = scriptFax.pharmacy_fax.replace(/^1/, '').replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'); // Add dashes
            
            alert(`Success, your script has been sent to fax number ${dislayFaxNumber}` );

            
            // if (confirm(`Fax Successfully Sent! Transfer Prescription Item #${nft?.metadata.id} to Pharmacy: ${pharmacyFax.pharmacy_name} at address: ${pharmacyFax.pharmacy_wallet} for ${nft?.metadata.description} for ${nft?.metadata.attributes[0].value}. Okay ${nft?.metadata.name}? Fax: ${pharmacyFax.pharmacy_fax} `) == true){
            //     _safeTransferFromToPharmacy()
            //   }
            console.log("7/8 Valid result.data is: ",result.data)
            console.log("7/8/23 Valid result is: ",result)

              // _safeTransferFromToPharmacy()
              navigate('/')

        }else{
            alert('There is a problem sending this fax script to the pharmacy. Please try again.');
            // setOptions(result.data)
            // setOptions(result)

            // alertService.error(`Error with error message of :(`, options);
            alert(`Error with error message of :(`, result);

            console.log("6/21 Invalid result.data is: ",result.data)
            console.log("6/21 Invalid result is: ",result)
        }
    }); //end of axios post call

    }catch(error){
        // setOptions(error)
        // alertService.error(`Catch Clause Error with message of ${error} :(`, options);
        alert(`Catch Clause Error with message of ${error} :(`);

        console.log("7/7 catch(error) is: ",result)
    }
}


// **************************** _safeTransferFromToPharmacy Form Submission ******************************//

const _safeTransferFromToPharmacy = async () => {
    
    try {
       
        // VERSION 12.5+ - Patient Transfer: 
                    //   let pharmacyNameOnly = rxWallet.pharmacyName.substring(0, rxWallet.pharmacyName.indexOf(" ["));
                      const data = await contract.call("transferPatientToPharmacyRoles", [address, pharmacyFax.pharmacy_wallet, pharmacyFax.pharmacy_name, id]);
                                     
                      console.log("NFT Sent to Selected Pharmacy with response:", data);
              
                      alert(`Success! Your NFT Prescription has been sent to pharmacy ${pharmacyFax.pharmacy_name} at address ${pharmacyFax.pharmacy_wallet}. If you have any further questions, please call Rx Minter's dedicated Support Team located in Palau.`);
                    //   setRxWallet({ tokenId: '', rxwallet: '', pharmacyName: '' })
                      navigate('/')      
              } catch (error) {
                      console.log("contract call failure", error)
                      alert("Your NFT Prescription has NOT been sent.  Please try again or contact Rx Minter's Support Team located in Palau.");
                      // alertService.error(`Error with error message of ${error} :(`, options);
              }
}

// ****************************** SET the SVG Script and Image Conversion Functions ********************//
useEffect(() => {
    handleConvertClickerInternal()
// },[pharmacyFax])
},[nft])



const handleConvertClickerInternal = async () => {

    // const svgElement = await RemedySvgForJorgeRucker(nft?.metadata.name, convertBigNumberToFourDigitYear(nft?.metadata.attributes[5].value), 
    //     nft?.metadata.attributes[10].value, nft?.metadata.description, nft?.metadata.attributes[0].value, nft?.metadata.attributes[2].value )

//********************************************************************************************************************************************* */
// if(nft?.metadata.attributes[8].value == 'Dr. Jorge Rucker, M.D.'){
//********************************************************************************************************************************************* */
        // const svgElement = RemedySvgPdfGenerator(remedyPatientName, remedyRxDate, remedyPtAddress, remedySig, remedyMedication, remedyQuantity)
                    // const svgElement = await RemedySvgForJorgeRucker(nft?.metadata.name, convertBigNumberToFourDigitYear(nft?.metadata.attributes[5].value), 
                    // nft?.metadata.attributes[10].value, nft?.metadata.description, nft?.metadata.attributes[0].value, remedyDisp )
             
// Imaging Order SVG **********************************************************************************************************************************************************

        //7-16-2023 decode logic
            // ethers.utils.toUtf8String(ethers.utils.RLP.decode(grabPatientName))
            let unhashedName
            let unhashedDob
            let unhashed_pt_physical_address

            if(nft?.metadata.name.startsWith('0x')) {
                unhashedName = ethers.utils.toUtf8String(ethers.utils.RLP.decode(nft?.metadata.name))
            }else{
                unhashedName = nft?.metadata.name
            }


            if(nft?.metadata.attributes[1].value.startsWith('0x')) {
                unhashedDob = formatDateFourDigitYear(ethers.utils.toUtf8String(ethers.utils.RLP.decode(nft?.metadata.attributes[1].value)))
            }else{
                unhashedDob = formatDateFourDigitYear(nft?.metadata.attributes[1].value)
            }


            if(nft?.metadata.attributes[10].value.startsWith('0x')) {
                unhashed_pt_physical_address = ethers.utils.toUtf8String(ethers.utils.RLP.decode(nft?.metadata.attributes[10].value))
            }else{
                unhashed_pt_physical_address = nft?.metadata.attributes[10].value
            }


//***********  AFTER WE HAVE PT WALLET ADDY FROM NFT ==> Get Pt phone to load from server (7/20/2023) *****************************************************************
const wallet_address = nft?.metadata.attributes[4].value;
const result = await axios.get("https://rxminter.com/php-react/patient-get-by-address.php?wallet_address="+wallet_address);
setPatient(result.data); //lags, shows up on second load/pharamcy select run
    console.log("inside svg function pt_phone is",result.data.pt_phone)

//***********  Get Pt phone to load from server (7/20/2023) *****************************************************************


//***********  AFTER WE HAVE DOCTOR NAME FROM NFT ==> Get Doctor info from server (7/21/2023) *****************************************************************
const doctor_name = nft?.metadata.attributes[8].value;
const prescribing_doc = await axios.get("https://rxminter.com/php-react/doctor-get-by-name.php?doctor_name="+doctor_name);

setDoctor(prescribing_doc.data); //lags, shows up on second load/pharamcy select run
    console.log("inside svg function doctor name is",prescribing_doc.data.doctor_name)
   
//***********  Get Pt phone to load from server (7/20/2023) *****************************************************************



const svgElement = await RemedySvgOrderMri(unhashedName, unhashedDob, 
                    nft?.metadata.attributes[0].value, nft?.metadata.attributes[9].value, unhashed_pt_physical_address, 
                    nft?.metadata.description, convertBigNumberToFourDigitYear(nft?.metadata.attributes[5].value),
                    // result.data.pt_phone, doctor.doctor_name, doctor.doctor_dea, doctor.doctor_npi, doctor.doctor_phone  )
                    result.data.pt_phone, prescribing_doc.data.doctor_name, prescribing_doc.data.doctor_dea, 
                    prescribing_doc.data.doctor_npi, prescribing_doc.data.doctor_phone  )



// END OF Imaging Order SVG **********************************************************************************************************************************************************




    //remedyPatientName, remedyDOB, remedyMedication, remedyQuantity, remedyPhysicalAddress, remedySig, remedyPrescribedDate
// Rx SVG **********************************************************************************************************************************************************
        // let remedyDisp = nft?.metadata.attributes[2].value - nft?.metadata.attributes[3].value;
        // const svgElement = await RemedySvgOrderRx(nft?.metadata.name, formatDateFourDigitYear(nft?.metadata.attributes[1].value), nft?.metadata.attributes[0].value,
        // remedyDisp, nft?.metadata.attributes[10].value, nft?.metadata.description, convertBigNumberToFourDigitYear(nft?.metadata.attributes[5].value)  )
// Rx SVG **********************************************************************************************************************************************************

        console.log("Jorge svgElement Test is ", svgElement)
        setGenerateSVGAuto(svgElement)

// }else{
    //     let remedyDisp = nft?.metadata.attributes[2].value - nft?.metadata.attributes[3].value;

    //     const svgElement = await RemedySvgPdfGenerator(nft?.metadata.name, convertBigNumberToFourDigitYear(nft?.metadata.attributes[5].value), 
    //     nft?.metadata.attributes[10].value, nft?.metadata.description, nft?.metadata.attributes[0].value, remedyDisp )

    //     console.log("Other svgElement Test is ", svgElement)
    //     setGenerateSVGAuto(svgElement)
// }//end of doc match else statement

                        // console.log("svgElement Test is ", svgElement)
                        // setGenerateSVGAuto(svgElement)
                        // return imageLocation = 'data:image/svg+xml;base64,' + btoa(svgData);

} //end of Imaging SVG generator


// const generateSVGAuto = handleConvertClickerInternal()
// const getImageAuto = autoConvertClicker()

useEffect(() => {
    autoConvertClicker()
}, [generateSVGAuto])




const autoConvertClicker = () => {
// const handleConvertClickerInternal = async (e) => {
//     e.preventDefault()
//     const canABrotherSetAnSVGMyNigga = await autoConvertClicker();

    const svgElement = svgContainerInternalDiv.current;
    // const svgElement = generateSVGAuto.current;
    console.log("Auto svgElemento es: ",svgElement)
    // const svgElement = await RemedySvgPdfGenerator("Eric Cartman", "6/20/2023", "123 Bud Liiiight Way, Houston, TX 78745", "Take PRN for pain, (2) Take when angry about Kyle, (3) Take when needed to calm anger, (4) Take bid tid blah, blah, blah, blah", "Amlodipine 100mg Tablet", "30")

    // Create a canvas element to render the SVG
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    const svgRect = svgElement.getBoundingClientRect();
    // const svgRect = {
    //     x: 108.1076431274414,
    //     y: 107.13542175292969,
    //     width: 936.0070190429688,
    //     height: 545.9896240234375,
    //     top: 107.13542175292969,
    //     right: 1044.1146621704102,
    //     bottom: 653.1250457763672,
    //     left: 108.1076431274414
    //   }; 

    // const svgRect = {
    //     "x": 85,
    //     "y": 448.9375,
    //     "width": 1056,
    //     "height": 816,
    //     "top": 448.9375,
    //     "right": 781,
    //     "bottom": 1264.9375,
    //     "left": 85
    // }

    // const svgRect = {
    //     "x": 53,
    //     "y": -909.9375,
    //     "width": 1056,
    //     "height": 816,
    //     "top": -909.9375,
    //     "right": 989,
    //     "bottom": -93.9375,
    //     "left": 53
    // }

    // const svgRect = { "x": 45.5, "y": 15.3984375, "width": 1116, "height": 816, "top": 15.3984375, "right": 1161.5, "bottom": 831.3984375, "left": 45.5 }

    console.log("svgRect is: ",svgRect)
    console.log("svgRect.width is ",svgRect.width)
    console.log("svgRect.height is ",svgRect.height)
    // canvas.width = svgRect.width;
    // canvas.height = svgRect.height;

    // canvas.width = "2112";
    // canvas.height = "1632";

    // canvas.width = svgRect.width *1.5;
    // canvas.height = svgRect.height *2;

    canvas.width = svgRect.width;
    canvas.height = svgRect.height;
    

    // Capture the SVG content as an image
     //html2canvas
     html2canvas(svgElement, { canvas }).then(canvas => {
        // Convert the canvas to an image data URL
    // const imageDataUrl = canvas.toDataURL('image/png');
        // let imageDataUrl = canvas.toDataURL('image/png');
        let imageDataUrl = canvas.toDataURL('image/jpeg');

        setGetImageDateUrl(imageDataUrl)
        // ...scriptFax, 

        setScriptFax({script_image_name: `${imageDataUrl}.jpeg`, script_image_location: imageDataUrl, pharmacy_fax: pharmacyFax.pharmacy_fax });
        console.log("Inside of autoConvertClicker SVG to JPEG fn, scriptFax is now: ",scriptFax)

        // Send the image data URL as a fax or perform further processing
        // console.log('Image data URL:', imageDataUrl);
      }).catch(error => {
        console.error('Error capturing SVG:', error);
      });
}


const [showSubmitButton, setShowSubmitButton] = useState('none')

const [displaySelectedPharmacy, setDisplaySelectedPharmacy] = useState('The Pharmacy')

  return (
    <>
    

{/* PATIENT SELECT PHARMACY ******************************************************************************* */}
<hr></hr>
{/* TRY moving selector box back to the bottom? ******************************* */}

<h2>Transfer Imaging Order</h2>

    <div className="row">

        {/* <div className="col-sm-4">

        </div> */}
        <div className="col-sm-12">

      
        <div className="card w-100">
                <div className="card-header bg-light">
                    <h5 className="card-title">Select A Facility</h5>
                    {/* <div className="text-right">
                        <Link to="/" className="btn btn-primary text-right">Go somewhere</Link>
                    </div> */}
                </div>
                <div className="card-body" style={{background:"#F0F1F2"}}>
                    
                        <br></br>
                                <p className="card-text">Select a participating facility from the drop down list below and click the green 
                                button to send your imaging order to the facility of your choice.</p>

                                <form onSubmit={e => handleSubmitTest(e)}>

                                    {/* <div className="view-scripts-card"> */}
                                    <div  style={{background:"#F0F1F2"}}>

                                            <div className="input-group-mb-3">

                                                {/* <select className="form-select" aria-label="Select A Pharmacy" name="rxWallet" value={rxWallet.value} onChange={(e) => handlePharmacyChange(e, nft.metadata.id)}  > */}
                                                <select className="form-select" aria-label="Select A Pharmacy" name="rxWallet" onChange={(e) => handlePharmacyChange(e, nft?.metadata.id)}  >
                                                   
                                                    <option selected value="none">Select a Pharmacy...</option>

                                                    {pharmacy.map((pharmacy, index) => (
                                                        <option 
                                                            value={`${pharmacy.pharmacy_wallet}`}                                                                                  
                                                            key={`${index}`}>
                                                                {pharmacy.pharmacy_name} - ({pharmacy.pharmacy_fax}) - [{addyShortner(pharmacy.pharmacy_wallet)}]
                                                        </option>                                                                            
                                                    ))}

                                                </select>     
                                            </div>

                                            {/* <button type="submit" className="btn btn-success">Submit {nft?.metadata.attributes[0].value} To Pharmacist</button>  */}
                                            

                                            <div className="row">
                                                <div className="col-md-12">  
                                                    <div style={{display: `${showSubmitButton}`}} >                                        
                                                        <button type="submit" className="btn btn-success">Send This Imaging Order To {displaySelectedPharmacy}</button>                        
                                                    </div>
                                                </div>
                                            </div>
                                    </div>
                                </form>

                </div>
                <div className="card-footer text-muted">
                    {/* Pills Left To Fill: {nft?.metadata.attributes[2].value - nft?.metadata.attributes[3].value} */}
                </div>
        </div>
    </div>
</div>

{/* *************************************************************************** */}




{/* SVG ******************************************************************************* */}
<hr></hr>
<h2>Imaging Order Preview for: {nft?.metadata.attributes[0].value}</h2>
        <hr></hr>

        {/* <div ref={svgContainerInternal} className="svg-container"> */}

        {/* <div style={{display:"none"}} >  */}

{/* style={{margin:"0px", padding:"0px"}} */}
{/* style={{width:"100.56%",height:"81.6%"}} */}
{/* style={{width:"1056em",height:"816em",viewBox:"0 0 1056 816",backgroundColor:"white"}} */}

        {/* <div style={{width:"1056px",height:"816px",backgroundColor:"white"}}> */}
        {/* <div style={{backgroundColor:"white", textAlign:"left", marginLeft:"-280px", paddingBottom:"90px", marginBottom:"90px"}}> */}

                    <div ref={svgContainerInternalDiv} >

                    {/* <div ref={svgContainerInternal} className="svg-component">  */}

                        <svg
                            ref={svgContainerInternal}
                            className="svg_box_size"
                                version="1.1"
                                id="svg662"
                                width="1056"
                                height="816"
                                viewBox="0 0 1056 816"
                                xlink="http://www.w3.org/1999/xlink"
                                xmlns="http://www.w3.org/2000/svg"
                                svg="http://www.w3.org/2000/svg"
                        >

                                {generateSVGAuto}   

                        </svg>  
                                                            
                    </div>  
        {/* </div> */}


{/* IMAGE ******************************************************************************* */}
        {/* <div className="svg-container"> */}
            {/* <img src={getImageDataUrl} style={{width:"844px", height:"601.770px"}}/> */}

            <hr></hr>
            {/* <h5>Image Conversion:</h5> */}
            {/* <button onClick={autoConvertClicker} className="btn btn-success">Convert To Jpeg</button> */}

            {/* <img src={getImageDataUrl} style={{width:"844px", height:"601.770px"}} /> */}


        <div style={{visibility:"hidden"}} >  
                {/* <div style={{width:"844px", height:"601.770px"}} >   */}
            {/* <div style={{width:"20vw", height:"10vh"}} >   */}

        

        <img src={getImageDataUrl} style={{backgroundColor:"white"}} />
       
        </div>                         


 

        {/* </div> */}
        {/* </div> */}




    </>
  )
}
export default DoctorFaxImagingOrder
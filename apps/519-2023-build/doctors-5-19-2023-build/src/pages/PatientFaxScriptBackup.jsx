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
 
  // - AUG 18 2023 - REMEDY Base template from utils: RemedySvgPdfGenerator
  import { addyShortner,convertBigNumberToFourDigitYear, formatDateFourDigitYear } from '../utils'
    //work out: dayCalculatorDoc

    // import { RemedySvgForJorgeRucker } from '../doctorSigGeorge'
        // import { RemedySvgOrderMri } from '../doctorSigGeorge/imaging' 
    import { RemedySvgOrderRx } from '../fax-template/prescription' 




  import { solidityContractAddress } from '../constants'
  

    // import { FormField, CustomButton, ScriptSvgTemplate, RemedySvgPdfTemplate } from '../components';
    // import { RemedySvgPdfTemplate } from '../components';  //============================COMMENTED OUT ON TRANSFER

    // import RemedySvgTemplate from '../components/RemedySvgTemplate';
    //   import { GetMedication } from '../components';

    // import { alertService } from '../services';

    // import { scriptImageTest, RemedyScriptTemplatePDF } from '../assets';

//************************************************************************************************************************** *//
// ****** TUTORIAL RAYS ON REACT IMAGE UPLAOD - MY MAN IN INDIA: https://www.youtube.com/watch?v=fFx4Pbe9dAs *************** //
//************************************************************************************************************************** *//

const PatientFaxScript = () => {

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
//   handleConvertClickerInternal()
}, [])

const loadSVGTemplater = () => {
    // const templateSVG = RemedySvgPdfGenerator("Loading", "Loading", "Loading", "Loading", "Loading", "Loading")
    const templateSVG = RemedySvgOrderRx("Loading", "Loading", "Loading", "Loading",
    "Loading", "Loading", "Loading", "Loading",
    "Loading", "Loading", "Loading", "Loading",
    "Loading", "Loading", "Loading", "Loading",)
    setGenerateSVGAuto(templateSVG)
}

// Make call to server to pull pharmacies:
const loadViewPharmacy = async () => {
  const result = await axios.get("https://rxminter.com/php-react/view-pharmacy.php");
  console.log(result);
  setPharmacy(result.data.records);
  
}

// const doctor_id = 1;
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

  setPharmacyFax({pharmacy_name:"",pharmacy_wallet:"",pharmacy_phone:"",pharmacy_fax:"",pharmacy_address:""})
//   const result = await axios.get("https://rxminter.com/php-react/pharmacy-get-by-address.php?pharmacy_wallet="+e.target.value);
  const result = await axios.get("https://rxminter.com/php-react/pharmacy-get-by-name.php?pharmacy_name="+e.target.value);
  setPharmacyFax(result.data);
  console.log("handlePharmacyChange #pharmacyByWallet server data: ",result.data)

  let getSelectedPharmacy = result.data.pharmacy_name

  const getSelectedFax = `1${result.data.pharmacy_fax.replace(/-/g, '')}`;

//   setPharmacyFax({...pharmacyFax, pharmacy_fax: getSelectedFax });
  setScriptFax({...scriptFax, pharmacy_fax: getSelectedFax });
  console.log("handlePharmacyChange set #pharmacy_fax to ",getSelectedFax)

  setShowSubmitButton('block')
  setDisplaySelectedPharmacy(getSelectedPharmacy)

//   setRxWallet({...rxWallet,[e.target.name]: e.target.value, tokenId: tokenId, pharmacyName: options[e.target.selectedIndex].text })
  console.log("Event passed to handlePharmacyChange is ", e);
//   console.log('handlePharmacyChange just updated:', rxWallet);

  // const result = axios.get("https://rxminter.com/php-react/pharmacy-get-by-address.php?pharmacy_wallet="+rxWallet.rxWallet);
  // setPharmacyFax(result.data);
  // alert(`You have selected ${pharmacyFax.pharmacy_name} pharmacy with fax # of ${pharmacyFax.pharmacy_fax}.`)
  // const getSelectedFax = loadPharmacyByAddress(rxWallet.rxWallet)
  console.log("handlePharmacyChange #pharmacyFax is now: ", pharmacyFax)
  console.log("setScriptFax inside handlePharmacyChange is ",scriptFax.pharmacy_fax)

//AT BREAK (4:38pm) on Wed 6/21/23 we needed to call handleConvertClickerInteral() to update the selected fax number on scriptFax state
  handleConvertClickerInternal() //call OUTSIDE fn

  const dislayFaxNumber = getSelectedFax.replace(/^1/, '').replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'); // Add dashes
  alert(`You have selected ${getSelectedPharmacy} pharmacy with fax # of ${dislayFaxNumber}.`)
}

// **************************** handleSubmitToPharmacy Form Submission ******************************//

const handleSubmitTest = async (e) => { 

    e.preventDefault();
    console.log("handleSubmitTests e value:", e)


    // if (confirm(`Transfer Prescription Item #${rxWallet.tokenId} to Pharmacy: ${pharmacyFax.pharmacy_name} at address: ${rxWallet.rxWallet} for ${sig} by ${prescriber}. Okay ${pt_name}? Fax: ${pharmacyFax.pharmacy_fax} `) == true){
  const dislayFaxNumber = pharmacyFax.pharmacy_fax.replace(/^1/, '').replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'); // Add dashes
    console.log("Pharmacy Fax number in handleSubmitTest is ", pharmacyFax.pharmacy_fax)

        const checkSelectedFax = `1${pharmacyFax.pharmacy_fax.replace(/-/g, '')}`;
        //   setPharmacyFax({...pharmacyFax, pharmacy_fax: getSelectedFax });
        setScriptFax({...scriptFax, pharmacy_fax: checkSelectedFax });
    console.log("setScriptFax inside handlePharmacyChange is ",scriptFax.pharmacy_fax)


    let unhashedName

        if(nft?.metadata.name.startsWith('0x')) {
            unhashedName = ethers.utils.toUtf8String(ethers.utils.RLP.decode(nft?.metadata.name))
        }else{
            unhashedName = nft?.metadata.name
        }

    // if (confirm(`Transfer Prescription Item #${nft?.metadata.id} to Pharmacy: ${pharmacyFax.pharmacy_name} at Fax Number ${pharmacyFax.pharmacy_fax} (with pharmacy wallet address: ${pharmacyFax.pharmacy_wallet}) for patient ${unhashedName} with SIG of ${nft?.metadata.description} for medication ${nft?.metadata.attributes[0].value}. Do you wish to Proceed?`) == true){
    // //   await _transferPharmacyToPatient({ ...rxWallet })
    // sendFax()
    // }

    if(address == nft?.owner){
        if (confirm(`You are now faxing an Image of Prescription ID# ${nft?.metadata.id} to Pharmacy: ${pharmacyFax.pharmacy_name} at Fax Number ${pharmacyFax.pharmacy_fax} for patient ${unhashedName} with SIG of ${nft?.metadata.description} for medication ${nft?.metadata.attributes[0].value}. Do you wish to Proceed?`) == true){
            //   await _safeTransferFromToPharmacy({ ...rxWallet })
            sendFax()
        }else{
            _transferPharmacyToPatient(); 
        }
    }else{
        alert('sorry homes, you do not own this shit!')
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

            // alert(`Success, your script has been sent to fax number ${scriptFax.pharmacy_fax}` );
            alert(`Success, your script has been sent to fax number ${pharmacyFax.pharmacy_fax}` );
       

            
            // if (confirm(`Fax Successfully Sent! Transfer Prescription Item #${nft?.metadata.id} to Pharmacy: ${pharmacyFax.pharmacy_name} at address: ${pharmacyFax.pharmacy_wallet} for ${nft?.metadata.description} for ${nft?.metadata.attributes[0].value}. Okay ${nft?.metadata.name}? Fax: ${pharmacyFax.pharmacy_fax} `) == true){
            //     _transferPharmacyToPatient()
            //   }
            console.log("7/8 Valid result.data is: ",result.data)
            console.log("7/8/23 Valid result is: ",result)

// SUCCESSFUL FAX SENT - CALLS SAFE TRANSFER FROM PATIENT TO PHARMACY **********************************
// FOR NOW - FORWARD BACK TO PATIENT HOME AGE
            navigate('/')
// _transferPharmacyToPatient()
// SUCCESSFUL FAX SENT - CALLS SAFE TRANSFER FROM PATIENT TO PHARMACY **********************************

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


// **************************** _transferPharmacyToPatient Form Submission ******************************//

const _transferPharmacyToPatient = async () => {
    if (confirm(`Please confirm that you want to transfer this NFT Prescription ID#: ${id} to Pharmacy: ${pharmacyFax.pharmacy_name}, to their wallet address of:
    ${pharmacyFax.pharmacy_wallet}. `) == true){ 
            try {
            
                // VERSION 12.5+ - Patient Transfer: 
                            //   let pharmacyNameOnly = rxWallet.pharmacyName.substring(0, rxWallet.pharmacyName.indexOf(" ["));
                                                                                                                                    //check if pharma name a parameter
                            //   const data = await contract.call("transferPatientToPharmacyRoles", [address, pharmacyFax.pharmacy_wallet, pharmacyFax.pharmacy_name, id]);

                            const data = await contract.call("transferPharmacyToPatient", [address, pharmacyFax.pharmacy_wallet, id]);
                                            
                            console.log("NFT Transferred (without Roles) via _transferPharmacyToPatient to Selected Pharmacy with response:", data);
                    
                            alert(`Success! Your NFT Prescription has been transferred to pharmacy ${pharmacyFax.pharmacy_name} at their wallet address of ${pharmacyFax.pharmacy_wallet}. If you have any further questions, please call Rx Minter's dedicated Support Team located in Palau.`);

                            //   setRxWallet({ tokenId: '', rxwallet: '', pharmacyName: '' })
                            navigate('/')      
                    } catch (error) {
                            console.log("contract call failure", error)
                            alert("Your NFT Prescription has NOT been sent.  Please try again or contact Rx Minter's Support Team located in Palau.");
                            // alertService.error(`Error with error message of ${error} :(`, options);
                    }
    }
}

// ****************************** SET the SVG Script and Image Conversion Functions ********************//
useEffect(() => {
    handleConvertClickerInternal()
// },[pharmacyFax])
},[nft])

const [patient, setPatient] = useState({
    name: "",
    wallet_address: "",
    email:"",
    dob:"",
    pt_physical_address:"",
    pt_phone:"",
    pt_primary_insurance:"",
    pt_primary_id:"",
    pt_secondary_insurance:"",
    pt_secondary_id:"",
    pid:""
});

const {name,wallet_address,email,dob,pt_physical_address,pt_phone,pid,pt_primary_insurance,pt_primary_id,pt_secondary_insurance,pt_secondary_id} = patient;





const handleConvertClickerInternal = async () => {

    // const svgElement = await RemedySvgForJorgeRucker(nft?.metadata.name, convertBigNumberToFourDigitYear(nft?.metadata.attributes[5].value), 
    //     nft?.metadata.attributes[10].value, nft?.metadata.description, nft?.metadata.attributes[0].value, nft?.metadata.attributes[2].value )

//******************************************************************************************************************************************************** */
// if(nft?.metadata.attributes[8].value != 'Dr. Jorge Rucker, M.D.'){
//******************************************************************************************************************************************************** */

                // const svgElement = RemedySvgPdfGenerator(remedyPatientName, remedyRxDate, remedyPtAddress, remedySig, remedyMedication, remedyQuantity)


                    // const svgElement = await RemedySvgForJorgeRucker(nft?.metadata.name, convertBigNumberToFourDigitYear(nft?.metadata.attributes[5].value), 
                    // nft?.metadata.attributes[10].value, nft?.metadata.description, nft?.metadata.attributes[0].value, remedyDisp )

//const svgElement = await RemedySvgOrderMri(nft?.metadata.name, formatDateFourDigitYear(nft?.metadata.attributes[1].value), nft?.metadata.attributes[0].value,
//nft?.metadata.attributes[9].value, nft?.metadata.attributes[10].value, nft?.metadata.description, convertBigNumberToFourDigitYear(nft?.metadata.attributes[5].value)  )
 


// #SCRIPT Order SVG **********************************************************************************************************************************************************

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



// *** Update Sun 8/13/23 Patient Primary Secondary insurance
// setPrimaryInsurance(result.data.pt_primary_insurance)
// setPrimaryId(result.data.pt_primary_id)
// setSecondaryInsurance(result.data.pt_secondary_insurance)
// setSecondaryId(result.data.pt_secondary_id)

let primaryInsurance = result.data.pt_primary_insurance
let primaryId = result.data.pt_primary_id
let secondaryInsurance = `Secondary Insurance: ${result.data.pt_secondary_insurance}`
let secondaryId = `Secondary Id #: ${result.data.pt_secondary_id}`

//***********  Get Pt phone to load from server (7/20/2023) *****************************************************************


//***********  AFTER WE HAVE DOCTOR NAME FROM NFT ==> Get Doctor info from server (7/21/2023) *****************************************************************
const doctor_name = nft?.metadata.attributes[8].value;
const prescribing_doc = await axios.get("https://rxminter.com/php-react/doctor-get-by-name.php?doctor_name="+doctor_name);

setDoctor(prescribing_doc.data); //lags, shows up on second load/pharamcy select run
    console.log("inside svg function doctor name is",prescribing_doc.data.doctor_name)
   
//***********  Get Pt phone to load from server (7/20/2023) *****************************************************************



    //remedyPatientName, remedyDOB, remedyMedication, remedyQuantity, remedyPhysicalAddress, remedySig, remedyPrescribedDate
        let remedyDisp = nft?.metadata.attributes[2].value - nft?.metadata.attributes[3].value;

        const svgElement = await RemedySvgOrderRx(unhashedName, unhashedDob, nft?.metadata.attributes[0].value,
        remedyDisp, unhashed_pt_physical_address, nft?.metadata.description, convertBigNumberToFourDigitYear(nft?.metadata.attributes[5].value),
        // result.data.pt_phone, doctor.doctor_name, doctor.doctor_dea, doctor.doctor_npi, doctor.doctor_phone  )
        result.data.pt_phone, prescribing_doc.data.doctor_name, prescribing_doc.data.doctor_dea, 
        prescribing_doc.data.doctor_npi, prescribing_doc.data.doctor_phone, primaryInsurance, primaryId, secondaryInsurance, secondaryId )


        console.log("Jorge svgElement Test is ", svgElement)
        setGenerateSVGAuto(svgElement)

    // END OF #SCRIPT Order SVG **********************************************************************************************************************************************************
// }else{
    //     let remedyDisp = nft?.metadata.attributes[2].value - nft?.metadata.attributes[3].value;

    //     const svgElement = await RemedySvgPdfGenerator(nft?.metadata.name, convertBigNumberToFourDigitYear(nft?.metadata.attributes[5].value), 
    //     nft?.metadata.attributes[10].value, nft?.metadata.description, nft?.metadata.attributes[0].value, remedyDisp )

    //     console.log("Other svgElement Test is ", svgElement)
    //     setGenerateSVGAuto(svgElement)
// }//end of Dr. Jorge Check

    // console.log("svgElement Test is ", svgElement)
    // setGenerateSVGAuto(svgElement)
    // return imageLocation = 'data:image/svg+xml;base64,' + btoa(svgData);

} //end of Jorge svg generator


// const generateSVGAuto = handleConvertClickerInternal()
// const getImageAuto = autoConvertClicker()

useEffect(() => {
    // autoConvertClicker()
    autoConvertClickervTwo()
}, [generateSVGAuto])


const autoConvertClickervTwo = async () => {
    const svgElement = svgContainerInternalDiv.current;
    const canvas = await html2canvas(svgElement);
    // const data = canvas.toDataURL('image/jpg');

                        //     let {width, height} = svgElement.getBox(); 
                        //     let clonedSvgElement = svgElement.cloneNode(true);
                        //     let outerHTML = clonedSvgElement.outerHTML,
                        //   blob = new Blob([outerHTML],{type:'image/svg+xml;charset=utf-8'});
                        //   let URL = window.URL || window.webkitURL || window;
                        //   let blobURL = URL.createObjectURL(blob);

                        //   let canvas = document.createElement('canvas');
                        
                        //   canvas.width = width;
                        
                        //   canvas.height = height;
                        //   let context = canvas.getContext('2d');
                        //   // draw image in canvas starting left-0 , top - 0  
                        //   context.drawImage(image, 0, 0, width, height );

                        //   image.src = blobURL;

  let imageDataUrl = canvas.toDataURL('image/jpeg');
//   const data = canvas.toDataURL('image/jpg');

  setGetImageDateUrl(imageDataUrl)
  // ...scriptFax, 

  let checkSelectedFax = `1${pharmacyFax.pharmacy_fax.replace(/-/g, '')}`;

  //   setPharmacyFax({...pharmacyFax, pharmacy_fax: getSelectedFax });
  //   setScriptFax({...scriptFax, pharmacy_fax: checkSelectedFax });
  setScriptFax({script_image_name: `${imageDataUrl}.jpeg`, script_image_location: imageDataUrl, pharmacy_fax: checkSelectedFax });
  console.log("Inside of autoConvertClickervTwo SVG to JPEG fn, scriptFax is now: ",scriptFax)


}


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
    console.log("#Yolo, const canvas = document.createElement(canvas) is ",canvas)
    const context = canvas.getContext('2d');
    console.log("#Yolo, unused? const context = canvas.getContext(2d) is ",context)


    const svgRectOriginal = svgElement.getBoundingClientRect();

//8/17/23  (10:53 pm CST @ Epoch Vy Day): ChatGPT hardcode DOMRect width (1296) and height (816) even though height already working
// const svgRect = new DOMRect(
//     // svgRectOriginal.x,
//     85,
//     // svgRectOriginal.y,
//     448.9375,
//     // 1296, // Set the width to 1296
//     1056,
//     // svgRectOriginal.width,
//     // svgRectOriginal.height,
//     816,
//     // 816,
//     // svgRectOriginal.top,
//     448.9375,
//     // svgRectOriginal.right,
//     781,
//     // svgRectOriginal.bottom,
//     1264.9375,
//     // svgRectOriginal.left
//     85

//     //     "bottom": 1264.9375,
//     //     "left": 85
// );

    // const svgRect = { "x": 45.5, "y": 15.3984375, "width": 1116, "height": 816, 
    //"top": 15.3984375, "right": 1161.5, "bottom": 831.3984375, "left": 45.5 }

// const svgRect = new DOMRect(
//     // svgRectOriginal.x,
//     45.5,
//     // svgRectOriginal.y,
//     15.3984375,
//     // 1296, // Set the width to 1296
//     1116,
//     // svgRectOriginal.width,
//     // svgRectOriginal.height,
//     816,
//     // 816,
//     // svgRectOriginal.top,
//     15.3984375,
//     // svgRectOriginal.right,
//     1161.5,
//     // svgRectOriginal.bottom,
//     831.3984375,
//     // svgRectOriginal.left
//     45.5

//     //     "bottom": 1264.9375,
//     //     "left": 85
// );



const svgRect = new DOMRect(
    svgRectOriginal.x,
    svgRectOriginal.y,
    1056, // Set the width to 1056
    svgRectOriginal.height,
    svgRectOriginal.top,
    svgRectOriginal.right,
    svgRectOriginal.bottom,
    svgRectOriginal.left
);

console.log("Modified DOMRect ChatGPT Test is ",svgRect);





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
    //     // "width": 1800,
    //     "width": 1056,

    //     // "height": 1416,
    //     "height": 816,

    //     "top": 448.9375,
    //     "right": 781,
    //     "bottom": 1264.9375,
    //     "left": 85
    // }

    // const svgRect = { "x": 45.5, "y": 15.3984375, "width": 1116, "height": 816, "top": 15.3984375, "right": 1161.5, "bottom": 831.3984375, "left": 45.5 }

    console.log("svgRect is: ",svgRect)
    // canvas.width = svgRect.width;
    // canvas.height = svgRect.height;


//8/17/23 YOLO Test:
    // svgRect.width = 1296;
    // svgRect.height = 816;
    console.log("svgRect.width is now ",svgRect.width)
    console.log("svgRect Height is now ",svgRect.height)

    // canvas.width = svgRect.width*1.5;
    // canvas.height = svgRect.height*1.5;


    canvas.width = svgRect.width;
    canvas.height = svgRect.height;
//8/17/23 YOLO Test
    // canvas.width = 1296;
    // canvas.height = 816;

    console.log("Canvas.width is now ",canvas.width)
    console.log("Canvas Height is now ",canvas.height)
    // console.log("Canvas y is now ",canvas.y)




    // Capture the SVG content as an image
     //html2canvas
     html2canvas(svgElement, { canvas }).then(canvas => {
        // Convert the canvas to an image data URL
    // const imageDataUrl = canvas.toDataURL('image/png');
        // let imageDataUrl = canvas.toDataURL('image/png');
        let imageDataUrl = canvas.toDataURL('image/jpeg');

        setGetImageDateUrl(imageDataUrl)
        // ...scriptFax, 

        let checkSelectedFax = `1${pharmacyFax.pharmacy_fax.replace(/-/g, '')}`;

        //   setPharmacyFax({...pharmacyFax, pharmacy_fax: getSelectedFax });
        //   setScriptFax({...scriptFax, pharmacy_fax: checkSelectedFax });
        setScriptFax({script_image_name: `${imageDataUrl}.jpeg`, script_image_location: imageDataUrl, pharmacy_fax: checkSelectedFax });
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

<div className="container d-flex justify-content-center align-items-center">
    <h2 className="display-3">Transfer Script</h2>
</div>
    <div className={isLoadingNFT ? 'd-none' : ''} >
                <div className="row">

                    {/* <div className="col-sm-4">

                    </div> */}
                    <div className="col-sm-12">

                
                    <div className="card w-100">
                            <div className="card-header bg-light">
                                <h5 className="card-title">Select A Pharmacy</h5>
                                {/* <div className="text-right">
                                    <Link to="/" className="btn btn-primary text-right">Go somewhere</Link>
                                </div> */}
                            </div>
                            <div className="card-body" style={{background:"#F0F1F2"}}>
                                
                                    <br></br>
                                        {address == nft?.owner ? (
                                            <p className="card-text">Select a participating pharmacy from the drop down list below and click the green 
                                            button to send your script to the pharmacy of your choice.</p>
                                        ) : (
                                            <p className="card-text" style={{color:"red"}}>
                                                You may fax this NFT script to a pharmacy from the list below on behalf of&nbsp;
                                                {nft?.metadata.name.startsWith('0x') ? (
                                                      ethers.utils.toUtf8String(ethers.utils.RLP.decode(nft?.metadata.name))
                                                  ) : (
                                                      nft?.metadata.name
                                                  ) }.

                                                 
                                                However, only the patient may transfer this NFT to a pharmacy by connecting their wallet ({addyShortner(nft?.owner)}) to the&nbsp;
                                                <a href={`https://patients.rxminter.com`} target="_blank">Rx Minter Patient Portal dApp</a>.
                                            
                                            </p>
                                        )}
                                            <form onSubmit={e => handleSubmitTest(e)}>

                                                {/* <div className="view-scripts-card"> */}
                                                <div  style={{background:"#F0F1F2"}}>

                                                        <div className="input-group-mb-3">

                                                            {/* <select className="form-select" aria-label="Select A Pharmacy" name="rxWallet" value={rxWallet.value} onChange={(e) => handlePharmacyChange(e, nft.metadata.id)}  > */}
                                                            <select className="form-select" aria-label="Select A Pharmacy" name="rxWallet" onChange={(e) => handlePharmacyChange(e, nft?.metadata.id)}  >
                                                            
                                                                <option selected value="none">Select a Pharmacy...</option>

                                                                {pharmacy.map((pharmacy, index) => (
                                                                    <option 
                                                                        value={`${pharmacy.pharmacy_name}`}                                                                                  
                                                                        key={`${index}`}>
                                                                            {pharmacy.pharmacy_name} - ({pharmacy.pharmacy_fax}) - [{addyShortner(pharmacy.pharmacy_wallet)}]
                                                                    </option>                                                                            
                                                                ))}

                                                            </select>     
                                                        </div>

                                                        {/* <button type="submit" className="btn btn-success">Submit {nft?.metadata.attributes[0].value} To Pharmacist</button>  */}
                                                        

                                                        <div className="row">
                                                            <div className="col-md-12">  
                                                                {address == nft?.owner ? (
                                                                    <div style={{display: `${showSubmitButton}`}} >                                        
                                                                        <button type="submit" className="btn btn-success">Transfer Your NFT Script To {displaySelectedPharmacy}</button>                        
                                                                    </div>
                                                                ) : (
                                                                    <div style={{display: `${showSubmitButton}`}} >                                        
                                                                        <button type="submit" className="btn btn-danger">Fax This NFT Script To {displaySelectedPharmacy}</button>                        
                                                                    </div>
                                                                )}

                                                            </div>
                                                        </div>
                                                </div>
                                            </form>

                                </div>
                                <div className="card-footer text-muted">
                                    Pills Left To Fill: {nft?.metadata.attributes[2].value - nft?.metadata.attributes[3].value}
                                </div>
                        </div>
                    </div>
                </div>
    </div>  {/* isLoadingNFT closing div */}

{/* *************************************************************************** */}




{/* SVG ******************************************************************************* */}
                        {isLoadingNFT && ( 
                            // <>
                            <h5 className="display-3">Your NFT Prescription is Loading...</h5>
                            // </>
                        )}

                    {/* <div ref={svgContainerInternal} className="svg-container"> */}
                                                                        {/* d-none class display=none */}
                <div ref={svgContainerInternalDiv} className={isLoadingNFT ? 'd-none' : 'w-100'} >
                    <hr></hr>
                    <h2>Script Preview for Medication {nft?.metadata.attributes[0].value}</h2>
                    <hr></hr>
                    

                                            {/* <div ref={svgContainerInternal} className="svg-component">           */}

                                            {/* ref={svgContainerInternal} */}
                                                {/* className="svg_box_size" */}
                                            {/* <svg
                                                version="1.1"
                                                id="svg662"
                                                width="1056"
                                                height="816"
                                                viewBox="0 0 1056 816"
                                                xlink="http://www.w3.org/1999/xlink"
                                                xmlns="http://www.w3.org/2000/svg"
                                                svg="http://www.w3.org/2000/svg"
                                            > */}
                 
                            {generateSVGAuto}   
        

                    {/* </svg> */}
           
                </div>  
    
{/* IMAGE ******************************************************************************* */}
        {/* <div className="svg-container"> */}
            {/* <img src={getImageDataUrl} style={{width:"844px", height:"601.770px"}}/> */}

            <hr></hr>
            {/* <h5>Image Conversion:</h5> */}
            {/* <button onClick={autoConvertClicker} className="btn btn-success">Convert To Jpeg</button> */}

            {/* <img src={getImageDataUrl} style={{width:"844px", height:"601.770px"}} /> */}


        <div style={{visibility:"hidden"}} >  
            {/* <img src={getImageDataUrl} style={{backgroundColor:"white"}} /> */}
            <img src={getImageDataUrl} />

        </div>                                


 

        {/* </div> */}
        {/* </div> */}




    </>
  )
}
export default PatientFaxScript
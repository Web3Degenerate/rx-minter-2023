import 'bootstrap/dist/css/bootstrap.css';
import "../styles/App.css";
import axios from 'axios'; 
import html2canvas from 'html2canvas'; //https://www.npmjs.com/package/html2canvas  => https://github.com/niklasvh/html2canvas 

import { useAddress, useContract, ConnectWallet, useOwnedNFTs, useNFT } from "@thirdweb-dev/react";

import React, { useState, useEffect, useRef, useContext, getContext } from 'react'
  
import { useNavigate, Link, useParams } from 'react-router-dom'
  
import { ethers } from 'ethers';
 
// - AUG 18 2023 - REMEDY Base template from utils: RemedySvgPdfGenerator
import { addyShortner,convertBigNumberToFourDigitYear, formatDateFourDigitYear } from '../utils'
import { solidityContractAddress } from '../constants'

import { RemedySvgOrderRx } from '../fax-template/prescription' 

//************************************************************************************************************************** *//
// ****** TUTORIAL RAYS ON REACT IMAGE UPLAOD - MY MAN IN INDIA: https://www.youtube.com/watch?v=fFx4Pbe9dAs *************** //
//************************************************************************************************************************** *//

const PatientFaxScript = () => {

    const { id } = useParams();

    const navigate = useNavigate(); 
 
    const { contract } = useContract(solidityContractAddress);
    const address = useAddress(); 

        console.log("contract address is: ",contract)
        console.log("address is ",address)

  const { data: nft, isLoading: isLoadingNFT } = useNFT(contract, id);

    console.log("nft call using useNFT() retunred: ",nft)

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

// **************** SVG => JPEG PAGE LOGIC ****************************** //
    const [getImageDataUrl, setGetImageDateUrl] = useState('')
    const [generateSVGAuto, setGenerateSVGAuto] = useState('');

    const svgContainerInternal = useRef();

    const svgContainerInternalDiv = useRef();

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

const handleSubmitToPharmacy = async (e) => { 

    e.preventDefault();
    console.log("handleSubmitToPharmacy e value is:", e)


    // if (confirm(`Transfer Prescription Item #${rxWallet.tokenId} to Pharmacy: ${pharmacyFax.pharmacy_name} at address: ${rxWallet.rxWallet} for ${sig} by ${prescriber}. Okay ${pt_name}? Fax: ${pharmacyFax.pharmacy_fax} `) == true){
  const dislayFaxNumber = pharmacyFax.pharmacy_fax.replace(/^1/, '').replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'); // Add dashes
    console.log("Pharmacy Fax number in handleSubmitToPharmacy is ", pharmacyFax.pharmacy_fax)

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
        if (confirm(`${unhashedName}, you are now faxing an Image of your prescription for medication ${nft?.metadata.attributes[0].value} (Rx Token ID#${nft?.metadata.id}) to ${pharmacyFax.pharmacy_name} at Fax Number ${pharmacyFax.pharmacy_fax}. Do you wish to Proceed?`) == true){
            //   await _safeTransferFromToPharmacy({ ...rxWallet })
            sendFaxAndTransferNft()
        }
    }else{
        if (confirm(`You are now faxing an Image of Prescription ID# ${nft?.metadata.id} to Pharmacy: ${pharmacyFax.pharmacy_name} at Fax Number ${pharmacyFax.pharmacy_fax} for patient ${unhashedName} with SIG of ${nft?.metadata.description} for medication ${nft?.metadata.attributes[0].value}. Do you wish to Proceed?`) == true){
            //   await _safeTransferFromToPharmacy({ ...rxWallet })
            sendFax()
        }
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

// 8/18/23 - NON-OWNER FAX SCRIPT ONLY
const sendFax = () => {

try{
    // await axios.post("https://rxminter.com/srfax/Queue_Fax.php", scriptFax).then((result)=>{
    axios.post("https://rxminter.com/srfax/Staging_Queue_Fax.php", scriptFax

    ).then((result)=>{
        console.log('Fax axios then clause result is: ',result)
  
        if(result.data.status == 'valid'){
            alert(`Success, the prescription for ${nft?.metadata.name} has been sent to ${pharmacy.pharmacy_name} at fax number ${pharmacyFax.pharmacy_fax}.` );
       
            console.log("7/8 Valid result.data is: ",result.data)
            console.log("7/8/23 Valid result is: ",result)

// SUCCESSFUL FAX SENT FOR NON-OWNER. NAVIGATE BACK TO HOME **********************************
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

//****************************** 8/18/2023 - OWNER ONLY TRANSFER NFT TO PHARMACY WALLET AFTER FAX */

const sendFaxAndTransferNft = () => {
    if (confirm(`Hit Cancel to skip fax for testing`) == true){ 

                try{
                    // await axios.post("https://rxminter.com/srfax/Queue_Fax.php", scriptFax).then((result)=>{
                    axios.post("https://rxminter.com/srfax/Staging_Queue_Fax.php", scriptFax
                
                    ).then((result)=>{
                        console.log('Fax axios then clause result is: ',result)
                
                        if(result.data.status == 'valid'){
                            alert(`Success, your script has been sent to fax number ${pharmacyFax.pharmacy_fax}` );
                    
                            console.log("7/8 Valid result.data is: ",result.data)
                            console.log("7/8/23 Valid result is: ",result)
                
                // SUCCESSFUL FAX SENT FOR NON-OWNER. NAVIGATE BACK TO HOME **********************************
                            // navigate('/')
                            _transferPharmacyToPatient();

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
        }else{
            _transferPharmacyToPatient();
        }
    }

// **************************** _transferPharmacyToPatient Form Submission ******************************//

const _transferPharmacyToPatient = async () => {
    if (confirm(`The next step is to transfer your NFT prescription for ${nft?.metadata.attributes[0].value} (Rx Token ID#${id}) to ${pharmacyFax.pharmacy_name} at their public wallet address of:
    ${pharmacyFax.pharmacy_wallet}. 
    Press 'OK' to complete your refill request.`) == true){ 
            try {
            
                // VERSION 12.5+ - Patient Transfer: 
                            //   let pharmacyNameOnly = rxWallet.pharmacyName.substring(0, rxWallet.pharmacyName.indexOf(" ["));                                                                                                                                    //check if pharma name a parameter
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


useEffect(() => {
    autoConvertClickerVersionTwo()
}, [generateSVGAuto])

    //Solution from: https://www.robinwieruch.de/react-component-to-image/
    const autoConvertClickerVersionTwo = async () => {
        const svgElement = svgContainerInternalDiv.current;
        const canvas = await html2canvas(svgElement);

    let imageDataUrl = canvas.toDataURL('image/jpeg');

    setGetImageDateUrl(imageDataUrl)

    let checkSelectedFax = `1${pharmacyFax.pharmacy_fax.replace(/-/g, '')}`;

    setScriptFax({script_image_name: `${imageDataUrl}.jpeg`, script_image_location: imageDataUrl, pharmacy_fax: checkSelectedFax });
    console.log("Inside of autoConvertClickerVersionTwo SVG to JPEG fn, scriptFax is now: ",scriptFax)

    }


    const [showSubmitButton, setShowSubmitButton] = useState('none')
    const [displaySelectedPharmacy, setDisplaySelectedPharmacy] = useState('The Pharmacy')

  return (
    <>

{/* PATIENT SELECT PHARMACY ******************************************************************************* */}
<hr></hr>

<div className="container d-flex justify-content-center align-items-center">
    <h2 className="display-3">Transfer Script</h2>
</div>
    <div className={isLoadingNFT ? 'd-none' : ''} >
                <div className="row">

                    <div className="col-sm-12">

                
                    <div className="card w-100">
                            <div className="card-header bg-light">
                                <h5 className="card-title">Select A Pharmacy</h5>
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

                                                 
<br></br>However, only the patient may transfer this NFT to a pharmacy by connecting their wallet ({addyShortner(nft?.owner)}) to the&nbsp;
<br></br><a href={`https://patients.rxminter.com`} target="_blank">Rx Minter Patient Portal dApp</a>.
                                            
                                            </p>
                                        )}
                                            <form onSubmit={e => handleSubmitToPharmacy(e)}>

                                                <div  style={{background:"#F0F1F2"}}>

                                                        <div className="input-group-mb-3">

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
                            <h5 className="display-3">Your NFT Prescription is Loading...</h5>              
                        )}


                <div ref={svgContainerInternalDiv} className={isLoadingNFT ? 'd-none' : 'w-100'} >
                    <hr></hr>
                    <h2>Script Preview for Medication {nft?.metadata.attributes[0].value}</h2>
                    <hr></hr>
                                
                            {generateSVGAuto}   
          
                </div>  
    
{/* IMAGE ******************************************************************************* */}

        <div style={{visibility:"hidden"}} >  
            <img src={getImageDataUrl} />
        </div>                                

    </>
  )
}
export default PatientFaxScript
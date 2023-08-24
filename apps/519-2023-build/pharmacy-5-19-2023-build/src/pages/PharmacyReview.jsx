import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { Link, useNavigate, useParams } from "react-router-dom";

// import "../styles/ViewScripts.css";
import "../styles/App.css";
// import 'bootstrap/dist/css/bootstrap.css';
// import "../styles/App.css";

import { useAddress, useContract, ConnectWallet, useOwnedNFTs, ThirdwebNftMedia, 
    useTransferNFT, useMetadata, useNFT, MediaRenderer, useContractRead } from "@thirdweb-dev/react";

    import { addyShortner, formatDateFourDigitYear, formatDateTwoDigitYear, convertBigNumberToTwoDigitYear, convertBigNumberToFourDigitYear, convertBigNumberToRawString } from '../utils'
    import { solidityContractAddress } from '../constants'
  
  import { ethers } from 'ethers';



const PharmacyReview = () => {

    let navigate = useNavigate();

    // From Part 4 (9:01): https://youtu.be/6DUx-WUsJro?t=541
    const { id } = useParams();

    // const { contract } = useContract("0xE0a73cAEb01ABdee510993F2d6a525b9948B49dF"); // 11.0 - Fixed spacing SVG issue.  
    // const { contract } = useContract("0x92525216C74e3B5819e487Bef564e12845BafdB2"); // 11.5 - Fix SVG uint, Events, Roles (5/20/23)
    // const { contract } = useContract("0x135B8F385f8FaE5ab558d2D2A7A5d33a99184485"); // 11.7 - Improved metadata and function callls (5/21/23)
    const { contract } = useContract(solidityContractAddress); // 12.4 -  (5/29/23)


    const tokenId = id;
    const { data: nftz } = useNFT(contract, tokenId);

    console.log("nftz from useNFT() is:", nftz)

    // useEffect(()=> {    
        // loadEditPharmacy(); 
        // loadMedications();
    //     getDob();
    //   }, [])
      
    const [getDober,setGetDober] = useState('')
      // Your NFT collection contract address
    //   const contractAddress = "0x135B8F385f8FaE5ab558d2D2A7A5d33a99184485";
   
      const getDob = async (tokenId) => {   
        try{       
                const data = await contract.call("getDob", [tokenId]);

                console.log("getDob fn call returned:", data);
                // setGetDober(data.toString())
                setGetDober(data)
        } catch (error) {
                console.log("Unable to fetch getDob", error)
        }
       
      }

 //*****************************  Get Medication String From congtract 'getMedication' function  ******************************************************************* */
    const [getMedication, setGetMedication] = useState([])
    const getMedicationString = async (id) => {
        try{
            
            const data = await contract.call("getMedication", [id]);
                console.log("getMedication fn call returned:", data);
                // setGetDober(data.toString())
                setGetMedication(data)
        } catch (error) {
            console.log("Error from getMedication K Call:", error)
        }
    }
      
      getMedicationString(id);
 //***************************************************************************************************** */
      
      const address = useAddress(); 

      const { data: nfts } = useOwnedNFTs(contract, address);
      console.log(nfts)

// Fill && Send Buttons:
    const [showSendButton,setShowSendButton] = useState('none')
    const [showFillButton,setShowFillButton] = useState('block')
    

// ******************** TRANSFER BACK TO PATIENT ***************************************** //


const [rxWallet, setRxWallet] = useState({
    tokenId: '', 
    rxWallet: ''
  });

  const inputTokenId = useRef(); 
  const inputPharmacyWallet = useRef('');




  //probably won't use:
  const handleChange=(e, id)=>{
    setRxWallet({...rxWallet,[e.target.name]: e.target.value, tokenId: id })
    // console.log(e);
    console.log('handleChange just updated:',rxWallet);
}


const handleSubmitTransferToPatient = async (e) => { 

    e.preventDefault();
  
    console.log("handleSubmitTransferToPatient event value:", e)
    // alert(`Transfer Token with id ${rxWallet.tokenId} to ${rxWallet.rxWallet} `)
    
    // if (confirm(`Transfer Prescription Item #${rxWallet.tokenId} to Pharmacy: ${rxWallet.rxWallet} `) == true){
    //   await _safeTransferFromToPharmacy({ ...rxWallet })
    // }
  
    // let tokenId_Ref = inputTokenId.current.value;
  
    // if (confirm(`Process Rx Fulfillment for Prescription NFT # ${tokenId_Ref} `) == true){
    // if (confirm(`Process Rx Fulfillment for Prescription NFT # ${rxWallet.tokenId} `) == true){  
    if (confirm(`Press OK to Send this Prescription NFT #${id} to Patient ${nftz?.metadata.name}`) == true){          
      await transferPharmacyToPatient()
    }
      
  }


//   const transferPharmacyToPatient = async (rxWallet) => {  
  const transferPharmacyToPatient = async () => {
      try {
   
  //********************* ORIGINAL PHARMACY SELECT TRANSFER IN VERSION 1 ************************************************** */
  
  // VERSION 11.0 PATIENT TRANSFER:
                // const data = await contract.call("safeTransferFrom", [address, nftz?.metadata.patientaddress, id]);
                const data = await contract.call("transferPharmacyToPatientRoles", [address, nftz?.metadata.attributes[4].value, id]);
                
  // VERSION 11.2 PATIENT TRANSFER
                // const data = await contract.call("transferPharmacyToPatient", [address, rxWallet.rxWallet, rxWallet.tokenId]);
            
                console.log("NFT Sent to Selected Pharmacy with response:", data);
        

                let showPatientName = patient.name;
                // if(nftz?.metadata.name.startsWith('0x')) { 
                //     let showPatientName = ethers.utils.toUtf8String(ethers.utils.RLP.decode(nftz?.metadata.name));
                // }else{
                //     let showPatientName = nftz?.metadata.name;
                // }


                alert(`Success! The NFT Prescription has been filled and sent back to patient ${showPatientName} at address ${addyShortner(nftz?.metadata.attributes[4].value)}. If you have any further questions, please email Rx Minter's dedicated Support Team at support@rxminter.com.`);
                // setRxWallet({ tokenId: '', rxwallet: '' })
                navigate('/');
  
  //********************* --END OF -- ORIGINAL PHARMACY SELECT TRANSFER IN VERSION 1 ************************************************** */
  

                // setTestNet(sendRx.receipt.transactionHash);
        
                // let getTokenUri = sendRx.receipt.logs[0].topics[3].slice(-2);
                // let getOpenSeaURL = `${contractAddress}/${getTokenUri}`;
        
                // setOpenSeaURL(getOpenSeaURL)
                // setSuccess('block')
               
        } catch (error) {
                console.log("contract call failure", error)
                alert("The NFT Prescription has NOT been sent back to the patient.  Please try again or contact Rx Minter's Support Team located in Palau.");
                // alertService.error(`Error with error message of ${error} :(`, options);
        }
  
  
  }



  // ******************** UPDATE QTY FILLED AND DATE ***************************************** //

  const inputDateFilled = useRef()
  const inputPillsFilled = useRef()
  //8/17/2023 bastrop added: 
  const inputDaysManual = useRef()
  const inputRefillDateManual = useRef()

//   const [gdPillsFilled, setGDPillsFilled] = useState(nftz?.metadata.attributes[2].value);
// const handleGDPillsFilled = (e) => {
//     e.preventDefault();
//     setGDPillsFilled(e.target.value);

// }

  const handleSubmitUpdateFilled = async (e) => { 
    e.preventDefault();  
        console.log("handleSubmitUpdateFilled submit event value:", e)

        let showPillsFilled = inputPillsFilled.current.value;
        // let showPillsFilled = gdPillsFilled;
        // let displayPillsFilled = nftz?.metadata.attributes[2].value;
        // let showPillsFilled = e.target.value;

        let displayDateFilled = formatDateCard(inputDateFilled.current.value);
        // let displayNextRefillDate = formatDateCard(manualRefillDate);
//Sun 8/20/2023 Update: 
        let showNextFillDate = convertBigNumberToFourDigitYear(nftz?.metadata.attributes[7].value);
        
        let showGDPatientName = patient.name;
        // if (nftz?.metadata.name.startsWith('0x') ) {
        //     let displayPatientName = ethers.utils.toUtf8String(ethers.utils.RLP.decode(nftz?.metadata.name))
        // }else{
        //     let displayPatientName = nftz?.metadata.name
        // }
        
        
    // if (confirm(`Would you like to Proceed Filling Prescription NFT #${id} for ${displayPatientName} on ${displayDateFilled} for medication ${getMedication} in the quantity of ${showPillsFilled} with a next available refill date of ${showNextFillDate}?`) == true){  
    // if (confirm(`Would you like to Proceed Filling Prescription NFT #${id} for ${showGDPatientName} on ${displayDateFilled} for medication ${nftz?.metadata.attributes[0].value} in the quantity of ${showPillsFilled} with a next available refill date of ${showNextFillDate}?`) == true){  
    if (confirm(`Would you like to Proceed Filling Prescription NFT #${id} for ${showGDPatientName} on ${displayDateFilled} for medication ${nftz?.metadata.attributes[0].value} in the quantity of ${showPillsFilled}?`) == true){ 
        await updateScriptQuantityAndDates()
    }
      
  }

// **************************** CHAT GPT HELPER FUNCTION FOR OUR DATE STRING IN v.11.5 ************************************
    const formatDateCard = (dateValue) => {
        // Assuming string from the input field dateValue = '2023-05-19';
            // let dateValue = String(date);
        // Split the date value by the hyphen
            const [year, month, day] = dateValue.split('-');
        // Create a new Date object using the extracted values
            const formattedDate = new Date(year, month - 1, day);
        // Format the date as mm/dd/YY
            const formattedDateString = `${formattedDate.getMonth() + 1}/${formattedDate.getDate()}/${formattedDate.getFullYear().toString().slice(-2)}`;
            return formattedDateString; // Output: 05/19/23
    }

   const getNextFillDate = (dateValue) => {
    // Assuming dateValue = '2023-05-19';
        // Create a new Date object using the date value
        const originalDate = new Date(dateValue);
        // Add 30 days to the original date
        const modifiedDate = new Date(originalDate.getTime() + (30 * 24 * 60 * 60 * 1000));
        // Format the modified date as YYYY-mm-dd
        const modifiedDateString = modifiedDate.toISOString().split('T')[0];
        return formatDateCard(modifiedDateString);
   }




    const updateScriptQuantityAndDates = async () => {
        // const _safeTransferFromToPharmacy = async () => { 
        // alert(`Transfer Token with id ${rxWallet.tokenId} to ${rxWallet.rxWallet} `)
  
    try {
        
            let pills_filled_Ref = inputPillsFilled.current.value;
            
            // let date_filled_Ref = formatDateCard(inputDateFilled.current.value);
            let date_filled_Ref = new Date(inputDateFilled.current.value).getTime();
            


        // let diplayPillsFilled = inputPillsFilled.current.value;
        // let displayDateFilled = formatDateCard(inputDateFilled.current.value);
        // let displayNextRefillDate = 
//- FRIDAY AUGUST 18 2023 BASTROP CHANGE NEXT REFILL DATE TO MANUAL CHANGE: ************************************************
        // let date_next_fill_Ref = formatDateCard(manualRefillDate);
        let date_next_fill_Ref = nftz?.metadata.attributes[7].value;
// let date_next_fill_Ref = getNextFillDate(inputDateFilled.current.value);
//- END OF FRIDAY AUGUST 18 2023 BASTROP CHANGE NEXT REFILL DATE TO MANUAL CHANGE: ************************************
        let pharmacyAddressString = address.toString()
    
            // const data = await contract.call("updateScriptQuantityAndDates", [tokenId, pills_filled_Ref, date_filled_Ref, date_next_fill_Ref]);
            const data = await contract.call("updateScriptQuantityAndDatesRoles", [tokenId, pills_filled_Ref, date_filled_Ref,
                date_filled_Ref, date_next_fill_Ref, pharmacyAddressString, nftz?.metadata.attributes[4].value]);

     
            console.log("RX NFT Has Been Filled As Follows:", data);


            let show_date_filled_Ref = formatDateFourDigitYear(inputDateFilled.current.value);
            let show_date_next_fill_Ref = convertBigNumberToFourDigitYear(nftz?.metadata.attributes[7].value);

  
            // alert(`Success! Quantity of ${pills_filled_Ref} pills on ${date_filled_Ref} has been recorded. Next refill date is ${date_next_fill_Ref}.`);
            // Next refill date is ${show_date_next_fill_Ref}.
            alert(`Success! Medication ${nftz?.metadata.attributes[0].value} with a quantity of ${pills_filled_Ref} filled on ${show_date_filled_Ref} has been recorded. Press 'Okay' and approve the transaction in your wallet to send this prescription NFT back to the patient and complete today's transaction.`);
            await transferPharmacyToPatient();

            // if (confirm(`Success! Quantity of ${pills_filled_Ref} pills filled on ${show_date_filled_Ref} has been recorded. Next refill date is ${show_date_next_fill_Ref}.`) == true){  
            //     await transferPharmacyToPatient()
            //   }

//Mon 8/21/2023 - Remove hide/show send. 
            // setShowSendButton("block")
            // setShowFillButton('none')
                     
    } catch (error) {
            console.log("contract call failure", error)
            alert("CONTRACT CALL FAILURE. REASON: You must have a Pharmacy Role to update this NFT.");
    }
   
  }

  



// **************************** CHAT GPT HELPER FUNCTION FOR OUR DATE STRING IN v.11.5 ************************************
   const displayDateCard = (date) => {
    getDob(tokenId);
    // Assuming the date value is received as a string from the input field dateValue = '2023-05-19';
        let dateValue = String(date);
    // Split the date value by the hyphen
        const [year, month, day] = dateValue.split('-');
    // Create a new Date object using the extracted values
        const formattedDate = new Date(year, month - 1, day);
    // Format the date as mm/dd/YY
        const formattedDateString = `${formattedDate.getMonth() + 1}/${formattedDate.getDate()}/${formattedDate.getFullYear().toString()}`;
        return formattedDateString; // Output: 05/19/23
}

  const [showFinishedWorking, setShowFinishedWorking] = useState('none')
   
//   const handleContinueWorking = (e) => {
//     e.preventDefault();  
//     setShowFillButton('block')
//     setShowSendButton('none')
//     setShowFinishedWorking('block')
//     inputPillsFilled.current.value = '';
//     inputDateFilled.current.value = currentDate;
//   }

//   const handleTestManualDate = (e) => {
//     e.preventDefault()
//     console.log('#Manually using new date picker set manualRefillDate as ',manualRefillDate)
//   }

//   const handleFinishedWorking = (e) => {
//     e.preventDefault();
//     setShowFillButton('none')
//     setShowSendButton('block')
//     setShowFinishedWorking('none')
//   }

//Changed Sunday 8/20/2023 - 
//   let currentDate = new Date().toJSON().slice(0, 10);

  const getTodayPSTDate = () => {
    let currentFilterDate = new Date();
  
    let optionsFilter = {
      timeZone: 'America/Los_Angeles',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
  
    let pstDate = currentFilterDate.toLocaleString('en-US', optionsFilter).split(', ')[0];
  
    let parts = pstDate.split('/'); // Split the date string by '/'
  
    // Format the date components into YYYY-MM-DD format
    const formattedFilterDate = `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
    return formattedFilterDate;
  }
  
  let currentDate = getTodayPSTDate();




//Friday Aug 18 2023 (Epoch) - Get Patient (Web 2.0) Insurance and Phone Number by wallet_address

useEffect(() => {
    loadPatientByWallet()
// },[pharmacyFax])
},[nftz])

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

//***********  AFTER WE HAVE PT WALLET ADDY FROM NFT ==> Get Pt phone to load from server (7/20/2023) *****************************************************************
    const loadPatientByWallet = async () => {
        const wallet_address = nftz?.metadata.attributes[4].value;
        const result = await axios.get("https://rxminter.com/php-react/patient-get-by-address.php?wallet_address="+wallet_address);
        setPatient(result.data); //lags, shows up on second load/pharamcy select run
            console.log("inside loadPatientByWallet pt_phone is",result.data.pt_phone)



        // *** Update Sun 8/13/23 Patient Primary Secondary insurance
        let primaryInsurance = result.data.pt_primary_insurance
        let primaryId = result.data.pt_primary_id
        let secondaryInsurance = `Secondary Insurance: ${result.data.pt_secondary_insurance}`
        let secondaryId = `Secondary Id #: ${result.data.pt_secondary_id}`
    }
//***********  Get Pt phone to load from server (7/20/2023) *****************************************************************
//END OF: Friday Aug 18 2023 (Epoch) - Get Patient (Web 2.0) Insurance and Phone Number by wallet_address


  const [daysToRefill, setDaysToRefill] = useState(0);
  const [manualRefillDate, setManualRefillDate] = useState(null);

  const calculateNextRefillDate = () => {
    const nextRefillDate = new Date(fillDate);
    nextRefillDate.setDate(nextRefillDate.getDate() + daysToRefill);
    return nextRefillDate;
  };

  const handleDaysToRefillChange = (event) => {
    setDaysToRefill(parseInt(event.target.value, 10));
    // Automatically calculate manual refill date
    const calculatedRefillDate = calculateNextRefillDate();
    setManualRefillDate(calculatedRefillDate);
    console.log('handleDaysToRefillChange set manualRefillDate as ',manualRefillDate)
  };

  const handleDateFieldFour = (e) => {
    setManualRefillDate(e.target.value);
    console.log('manualRefillDate is now ', manualRefillDate)
    
}


  return (
<>
        <div className="justify-content-center text-center">
            <h1 style={{color:"black"}}>Manage Prescription for&nbsp;
                    {nftz?.metadata.name.startsWith('0x') ? (
                        ethers.utils.toUtf8String(ethers.utils.RLP.decode(nftz?.metadata.name))
                    ) : ( 
                        nftz?.metadata.name
                    )}
            
            </h1>
            <h5 style={{color:"black"}}>Rx Token ID#{id} - {nftz?.metadata.attributes[0].value}</h5>
        </div>

<div className="container-fluid">
<div className="row">
    <div className="col-sm-2">
    </div>
    <div className="col-sm-8">
        
<div className="align-items-center">
    <div className="card text-center" style={{width:"40rem"}}>
        <div className="card-header">
           <b className="display-6 card-title"> Patient Information</b>
        </div>
        <div className="card-body" style={{paddingTop:"-50px",martinTop:"-50px"}}>

        <div className="row">
            <div className="col">
                {/* <div class="col-md"> */}
                    {/* <b className="card-text" style={{fontSize:"20px"}}><b>Name: </b> */}
                    <b className="card-text"><b>Name: </b>
                    <span className="input-style">
                        {nftz?.metadata.name.startsWith('0x') ? (
                            ethers.utils.toUtf8String(ethers.utils.RLP.decode(nftz?.metadata.name))
                        ) : ( 
                            nftz?.metadata.name
                        )}
                    </span>
                    </b>&nbsp;
                {/* </div> */}
                {/* <div class="col-md">  */}
                    &nbsp;<b className="card-text"><b>DOB: &nbsp;</b><span className="input-style">
                            {nftz?.metadata.attributes[1].value.startsWith('0x') ? (
                                formatDateFourDigitYear(ethers.utils.toUtf8String(ethers.utils.RLP.decode(nftz?.metadata.attributes[1].value)))
                            ) : ( 
                        
                                formatDateFourDigitYear(nftz?.metadata.attributes[1].value)
                            )}
                        </span></b>&nbsp; 
                {/* </div> */}
                {/* <div class="col-md"> */}
                    &nbsp;<b className="card-text"><b>Phone: </b> <span className="input-style">{patient.pt_phone}</span></b>
                {/* </div> */}
<hr></hr>
            </div>
        </div> 
        <div className="row">
            <div className="col">
              
                    <b className="card-text "><b>Primary Insurance: </b><span className="input-style">{patient.pt_primary_insurance ? patient.pt_primary_insurance : "N/A"}</span></b>&nbsp;          
                    &nbsp;<b className="card-text" ><b>Insurance ID#: </b><span className="input-style">{patient.pt_primary_id ? patient.pt_primary_id : "N/A"}</span></b>&nbsp;              
        <hr></hr>
                <b className="card-text "><b>Secondary Insurance: </b><span className="input-style">{patient.pt_secondary_insurance ? patient.pt_secondary_insurance : "N/A"}</span></b>&nbsp;          
                &nbsp;<b className="card-text" ><b>Insurance ID#: </b><span className="input-style">{patient.pt_secondary_id ? patient.pt_secondary_id : "N/A"}</span></b>&nbsp; 
  
            </div>
        </div>

        </div>
    </div>
</div>
        {/* <div className="card-footer text-muted">
            
        </div> */}



<div className="align-items-center">
    <div className="card text-center" style={{width:"40rem"}}>
        <div className="card-header">
           <b className="display-6 card-title">Medication</b>
        </div>
        {/* <div className="card-body" style={{paddingTop:"-50px",martinTop:"-50px"}}> */}
        <div className="card-body">

        <div className="row">
            <div className="col">

                    <b className="card-text"><b>Medication: </b>
                    <span className="input-style">
                    {nftz?.metadata.attributes[0].value}
                    </span>
                    </b>&nbsp;

                    &nbsp;<b className="card-text"><b>Date Prescribed: &nbsp;</b><span className="input-style">
                    {convertBigNumberToFourDigitYear(nftz?.metadata.attributes[5].value)}
                        </span></b>&nbsp;
  
            </div>
        </div> 
<hr></hr>
        <div className="row">
            <div className="col">
              
                    <b className="card-text "><b>Quantity Prescribed: </b><span className="input-style">{nftz?.metadata.attributes[2].value}</span></b>&nbsp;          
                    &nbsp;<b className="card-text" ><b>Quantity Filled: </b><span className="input-style">{nftz?.metadata.attributes[3].value}</span></b>&nbsp;              
                &nbsp;<b className="card-text" ><b>Quantity Remaining: </b><span className="input-style">{nftz?.metadata.attributes[2].value - nftz?.metadata.attributes[3].value}</span></b>&nbsp; 
        <hr></hr>
                {/* <b className="card-text "><b>Secondary Insurance: </b><span className="input-style">{patient.pt_secondary_insurance}</span></b>&nbsp;           */}
  
            </div>
        </div>


        <div className="form-group row">
                                <label className="col-sm-2 col-form-label"><b>SIG:</b></label>

                                <div className="col-sm-10">
                                    <div className="input-group m-b">
                                        <textarea className="form-control" id="bp_note" name="bp_note" rows="3" value={nftz?.metadata.description} disabled></textarea>
                                    </div>
                                </div> 
                    </div>





        </div>
    </div>
</div>
        {/* <div className="card-footer text-muted">
            
        </div> */}

<br></br>


<div className="align-items-center">
    <div className="card text-center" style={{width:"40rem"}}>
        <div className="card-header text-white bg-primary mb-3">
           <b className="display-6 card-title">Process Prescription</b>
        </div>
        {/* <div className="card-body" style={{paddingTop:"-50px",martinTop:"-50px"}}> */}
        <div className="card-body">

        
        <form onSubmit={e => handleSubmitUpdateFilled(e)}>  
                                            <div className="row">
                                                    <div className="col-6">
                                                        <label><b>Quantity Filled:</b></label>
                                                        <input type="number" name="quantityFilled" className="form-control text-center" 
                                                            max={nftz?.metadata.attributes[2].value - nftz?.metadata.attributes[3].value}                                                 
                                                            defaultValue={nftz?.metadata.attributes[2].value}
                                                            // onChange={(e) => handleGDPillsFilled(e)}
                                                            ref={inputPillsFilled}
                                                        />
                                                    </div>

                                                    <div className="col-6">
                                                        <label><b>Date Filled:</b></label>
                                                        <input type="date" name="dateFilled" className="form-control text-center" defaultValue={currentDate} ref={inputDateFilled} />

                                                    </div>
                                            </div>
                                            {/* <hr></hr>
                                            <i>Enter the refill date for this medication:</i>
                                            <div className="row">

                                                    <div className="col-6 text-right" stlye={{textAlign:"right"}}>
                                                        <label className="text-right">Next Refill Date:</label>
                                                    </div>

                                                    <div className="col-6">                                 
                                                        <input type="date" name="manualRefillDate" className="form-control" 
                                                        onChange={(e) => handleDateFieldFour(e)} />                                                   
                                                    </div>
                                            </div> */}
                                                        {/* ref={inputRefillDateManual} */}
                                        <br></br>

                                                <div className="text-center">                                             
                                                    <button type="submit" className="btn btn-primary">Fill {nftz?.metadata.attributes[0].value}</button>
                                                </div>

                                                {/* <div className="text-center" style={{display:`${showFillButton}`}}>                                             
                                                    <button type="submit" className="btn btn-primary">Fill {nftz?.metadata.attributes[0].value}</button>
                                                </div>

                                                <div className="card-footer text-center" style={{display:`${showFinishedWorking}`}}> 
                                                    <button className="btn btn-danger" onClick={(e) => handleFinishedWorking(e)}>Cancel Edit and Send Rx</button>
                                                </div> */}
                                </form>

        </div>
    </div>
</div>
        {/* <div className="card-footer text-muted">
            
        </div> */}



    </div> {/* closing middle div col-8 */}
    <div className="col-sm-2">

    </div>
</div> {/* closing global 'row' container div */}
</div> {/* closing container-fluid div */}

<br></br>
<br></br>
<br></br>



        
</>
    



  )
}
export default PharmacyReview
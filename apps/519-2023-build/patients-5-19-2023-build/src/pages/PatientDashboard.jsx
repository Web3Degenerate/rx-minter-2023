import React, { useState, useEffect, useRef} from 'react' 

import { useAddress, useContract, ConnectWallet, useOwnedNFTs, ThirdwebNftMedia, 
    useTransferNFT, useMetadata, useNFT } from "@thirdweb-dev/react";

    import "../styles/ViewScripts.css";
    // import 'bootstrap/dist/css/bootstrap.css';

    
    import { useNavigate, Link } from 'react-router-dom'
       
    import axios from 'axios';  
    import { errors, ethers } from 'ethers';  

    import { logoPalau } from '../assets'
    import { ErrorDescription } from '@ethersproject/abi/lib/interface';

    import { addyShortner, formatDateTwoDigitYear, formatDateFourDigitYear, convertBigNumberToTwoDigitYear, convertBigNumberToFourDigitYear } from '../utils'
    import { solidityContractAddress } from '../constants'

// import { PatientDashboard } from '.';

const PatientDashboard = () => {


    // const getCurrentContractAddress = async () => {
    //   const result = await axios.get("https://rxminter.com/php-react/constants.php?id=1");
    //   return result.data.contract_address; // 12.6 - Event index / Fixed Metadata Doctors / DEA (6/4/23)
    // }

    // const solidityContractAddress = getCurrentContractAddress();
    
    // const { contract } = useContract("0xE0a73cAEb01ABdee510993F2d6a525b9948B49dF"); // 11.0 - Fixed spacing SVG issue.
    //  const { contract } = useContract("0x684E9cA3BDf984769531Af2778957815EB096e01"); // 11.1 - Testing Pharmacy Update
    // const { contract } = useContract("0x135B8F385f8FaE5ab558d2D2A7A5d33a99184485"); // 11.7 - Improved metadata and function callls (5/21/23)
    const { contract } = useContract(solidityContractAddress); // 13.1- Improved metadata and function callls (5/23/23)


     
     // Your NFT collection contract address
    //  const contractAddress = "0xE0a73cAEb01ABdee510993F2d6a525b9948B49dF"; // v11.0
    //  const contractAddress = "0x684E9cA3BDf984769531Af2778957815EB096e01";
    // const contractAddress = "0x135B8F385f8FaE5ab558d2D2A7A5d33a99184485"; //v11.7

    
    const address = useAddress(); 
    // const address = '0xfa1B88F6a4Efa3Fc139492DC1B9cc5A3d66fDDC9'
    // const address = "0xE3cEA19e68430563f71C591390358e54d1fa857a";

    // const addyShortner = (address) => {
    //  let tempAddy = String(address);
    //    // String(address).substring(0, 6) + "..." + String(address).substring(address.length - 4);
    //    const tinyAddy = tempAddy.substring(0, 6) + "..." + tempAddy.substring(37)
    //    return tinyAddy;
    // }

    // const getDob = async (tokenId) => {   
    //   try{       
    //           const dataDob = await contract.call("getDob", [tokenId]);

    //           console.log("getDob fn call returned:", dadataDobta);
    //           // setGetDober(data.toString())
    //           // setGetDober(data)
    //           return dataDob;
    //   } catch (error) {
    //           console.log("Unable to fetch getDob", error)
    //   }
    // }

    // const getMedicationString = async (tokenId) => {
    //   try{
          
    //       const dataMedication = await contract.call("getMedication", [tokenId]);
    //           console.log("getMedication fn call returned:", dataMedication);
    //           // setGetDober(data.toString())
    //           // setGetMedication(data)
    //           return dataMedication
    //   } catch (error) {
    //       console.log("Error from getMedication K Call:", error)
    //   }
    // }

 //docs erc-721
 // ERC721 - docs: 
//  const { mutateAsync } = useTransferNFT(contract)

//docs useMetadata
//  const { data } = useMetadata(contract)


// (~16th min to -16:30) - map over nfts in return stmt that we grab here (metadata.nft)  https://youtu.be/cKc8JVl_u30?t=990
 const { data: nfts, isLoading: loading } = useOwnedNFTs(contract, address);
 console.log("Owned NFTS are:", nfts)
 console.log("contract is:",contract)


// Contract must be an ERC-721 or ERC-1155 contract
//  const {
//    mutateAsync: transferNFT,
//    // isLoading,
//    // error,
//  } = useTransferNFT(contract); 

    // *************************************** Accordion Update From The Tech Team: https://www.youtube.com/watch?v=bGpZrr32ECw

    const [selectedNFT, setSelectedNFT] = useState(null); 

    const toggleNFT = (item) => {
        if (selectedNFT == item){
            return setSelectedNFT(null);
        }
        setSelectedNFT(item);
    }

//************************************* Pull in Pharmacies for drop down menu ********************** */

//State for Pharmacies, initialized as []
const [pharmacy, setPharmacy] = useState([]);


// useEffect to load the pharmacies on page load:
useEffect(()=> {    
    // loadEditPharmacy(); 
    // loadMedications();
    loadViewPharmacy();
  }, [])
  
  // Make call to server to pull pharmacies:
  const loadViewPharmacy = async () => {
    const result = await axios.get("https://rxminter.com/php-react/view-pharmacy.php");
    console.log(result);
    setPharmacy(result.data.records);
  }
  
  
  // set pharmacy
  const {pharmacy_name,pharmacy_wallet,pharmacy_phone,pharmacy_fax,pharmacy_address} = pharmacy; 

  // Transfer NFT to Pharmacy
  const [rxWallet, setRxWallet] = useState({
    tokenId: '', 
    rxWallet: ''
  });

  const inputTokenId = useRef(); 
  const inputPharmacyWallet = useRef('');

  const inputPillsFilled = useRef();
  const inputDateFilled = useRef();
  const inputDateNextFill = useRef();
  // const inputTokenId = useRef();


  const handleChange=(e, id)=>{
    // setRxWallet({...rxWallet,[e.target.name]: e.target.value, tokenId: id })
    // console.log('handleChange just updated:',rxWallet);

    const {value, options } = e.target
    setRxWallet({...rxWallet,[e.target.name]: e.target.value, tokenId: id, pharmacyName: options[e.target.selectedIndex].text })
    console.log("Event passed to handleChange is ", e);
    console.log('handleChange just updated:', rxWallet);
}


const handleSubmitTest = async (e) => { 

    e.preventDefault();
    console.log("handleSubmitTests e value:", e)
    
    // if (confirm(`Transfer Prescription Item #${rxWallet.tokenId} to Pharmacy: ${rxWallet.rxWallet} `) == true){
    //     await _safeTransferFromToPharmacy({ ...rxWallet })
    // }

    let pharmacyNameOnly = rxWallet.pharmacyName.substring(0, rxWallet.pharmacyName.indexOf(" ["));
    if (confirm(`Transfer Prescription Item #${rxWallet.tokenId} to Pharmacy: ${pharmacyNameOnly} at address: ${rxWallet.rxWallet} `) == true){
      await _safeTransferFromToPharmacy({ ...rxWallet })
    }

}

  const _safeTransferFromToPharmacy = async (rxWallet) => {
    // const _safeTransferFromToPharmacy = async () => { 
      // alert(`Transfer Token with id ${rxWallet.tokenId} to ${rxWallet.rxWallet} `)
  
        try {
        
              // const data = await contract.call("safeTransferFrom", [address, rxWallet.rxWallet, rxWallet.tokenId]);
              // const data = await contract.call("transferPatientToPharmacy", [address, rxWallet.rxWallet, rxWallet.tokenId]);

              // const data = await contract.call("transferPatientToPharmacyRoles", [address, rxWallet.rxWallet, rxWallet.tokenId]);
  // VERSION 12.6 - Patient Transfer: 
              let pharmacyNameOnly = rxWallet.pharmacyName.substring(0, rxWallet.pharmacyName.indexOf(" ["));
              const data = await contract.call("transferPatientToPharmacyRoles", [address, rxWallet.rxWallet, pharmacyNameOnly, rxWallet.tokenId]);
              
          
              console.log("NFT Sent to Selected Pharmacy with response:", data);
      
              alert(`Success! Your NFT Prescription #${rxWallet.tokenId} has been sent to your pharmacy at address ${rxWallet.rxWallet}. If you have any further questions, please call Rx Minter's dedicated Support Team located in Palau.`);
              setRxWallet({ tokenId: '', rxwallet: '' })
              
        } catch (error) {
                console.log("contract call failure", error)
                alert("CONTRACT CALL FAILURE. REASON: You must have a Patient Role to send this NFT.");
        }

  }

  // Add Patient Role - Added 5/22/23 
    const [patientRole, setPatientRole] = useState("")

    const getPatientRoleString = async () => {
        try{
            const dataPatientRole = await contract.call("hasRolePatientString", [wallet_address]);
            setPatientRole(dataPatientRole)
            console.log('getPatientRoleString returned: ', dataPatientRole)
        }catch(err){
            console.error("contract call failure", err);
        }
    }


//Grab Patient name from nfts if exist:
let displayPatientName
let convertPatientName
let grabPatientName

  if(nfts){
    nfts.map((nft) => (   
        grabPatientName = nft.metadata.name
    ))
    if(grabPatientName.startsWith('0x')){
        convertPatientName = ethers.utils.toUtf8String(ethers.utils.RLP.decode(grabPatientName));
        displayPatientName = `(for ${convertPatientName})`
      }else{
        displayPatientName = `(for ${grabPatientName})`
      }
  }




//loading / no nfts found
let showLoading
let showAfterLoading
  if (loading) {
    showLoading = "block"
    showAfterLoading = "none"
  }else{
    showLoading = "none"
    showAfterLoading = "block"
  }

let sessionsColor
  if (address) {
    sessionsColor = "white"
  } else {
    sessionsColor = "#1E1D22"
  }


return (

    <>
      <div className="view-scripts-container">
                 
{/* ########################################################################################################################################################## */}



{/* ########################################################################################################################################################## */}


        {address ? (
            <>
                    {/* <div className="connect">
                            <ConnectWallet dropdownPosition={{
                            align: 'center',
                            side: 'bottom'
                            }} />
                    </div>    */}

                    <h3 className="display-8" style={{color:"white" }}>Manage NFT Scripts {displayPatientName}</h3>
                    <h5 style={{color:"white" }}>You're connected with address: {addyShortner(address)}</h5>

                    <hr></hr>
            </>
    ) : (
        <div className="login-wrapper">
            <div className="box_size_success text-center" style={{ background:"#D4EDDA" }}>
                    <br></br>

                
                            {/* <img src="https://i.imgur.com/DJVCVvZ.png" className="image--cover" /> */}
                            <img src={logoPalau} className="image--cover" />

                            <h3 className="text-justify text-center" style={{color:"#74A27F"}}>
                                Click the <b>'Connect'</b> button below to Manage your NFT Scripts.                     
                            </h3>
                                                    
                            <div className="connect text-center">
                                    <ConnectWallet dropdownPosition={{
                                        align: 'center',
                                        side: 'bottom'
                                    }} />
                            </div> 
                    

                    <hr></hr>
                    <b className="text-justify text-center" style={{color:"#74A27F"}}>
                        <a href={`https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en-US`} target="_blank">
                                Don't have a wallet? Click Here to Create a MetaMask Wallet!
                        </a>
                    </b>
                    <hr></hr>
            </div>
        </div>
    ) }

   

{/* ########################################################################################################################################################## */}


{/* <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaW5ZTWluIG1lZXQiIHZpZXdCb3g9IjAgMCAzNTAgMzUwIj48c3R5bGU+LmJhc2UgeyBmaWxsOiBibGFjazsgZm9udC1mYW1pbHk6IHNlcmlmOyBmb250LXNpemU6IDE0cHg7IH08L3N0eWxlPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNFOEY1NTkiIC8+PHRleHQgeD0iMTAiIHk9IjIwIiBjbGFzcz0iYmFzZSI+UXR5IFByZXNjcmliZWQ6IDM4IHwgUXR5IEZpbGxlZDogMCB8IFF0eSBMZWZ0OiAzODwvdGV4dD48dGV4dCB4PSIxMCIgeT0iNDAiIGNsYXNzPSJiYXNlIj5NZWRpY2F0aW9uOiBBbWxvZGlwaW5lIDUgbWcgfCBSeCBJdGVtICMxPC90ZXh0Pjx0ZXh0IHg9IjEwIiB5PSI2MCIgY2xhc3M9ImJhc2UiPkRhdGUgUHJlc2NyaWJlZDogMjAyMy0wNS0xNCB8IERhdGUgRmlsbGVkOiAgfCBOZXh0IFJlZmlsbCBEYXRlOiA8L3RleHQ+PC9zdmc+" className="image-cover" /> */}

    <div className="wrapper">
        <div className="accordion">
          <div className="view-scripts-cards">

                {/* {nfts?.filter((nft) => {
                  return nft.metadata.id.toString() === '25'
                }
                ).map((nft) => ( */}

  {address && (
        <div style={{display:`${showLoading}`}}>
            <h3 style={{color:"white"}}>Loading NFT Scripts...</h3>
        </div>
  )}
        <div style={{display:`${showAfterLoading}`}}>
              {nfts?.length > 0 ? 
                nfts.filter(nft => nft.metadata.attributes[2].value > 0).map((nft) => (


        // {nfts?.map((nft) => (
          
          <div className="item">  
            {nft.metadata.attributes[2].value - nft.metadata.attributes[3].value !== 0 ? (
              <div className="title" onClick={() => toggleNFT(nft.metadata.id)}> 
                <h4>{nft.metadata.attributes[0].value} - {convertBigNumberToFourDigitYear(nft.metadata.attributes[5].value)}  </h4>
                <span>{selectedNFT == nft.metadata.id ? ' [ - ]' : ' [ + ]'}</span>
              </div>
            ) : (
                <div className="title-filled" onClick={() => toggleNFT(nft.metadata.id)}> 
                <h4>{nft.metadata.attributes[0].value} - {convertBigNumberToFourDigitYear(nft.metadata.attributes[5].value)}  </h4>
                  <span>{selectedNFT == nft.metadata.id ? ' [ - ]' : ' [ + ]'}</span>
                </div>
            )}
              
            <div className={selectedNFT == nft.metadata.id ? 'contento show' : 'contento'}>
                  <div key={nft.metadata.id.toString()} className="view-scripts-card">

                    

                          <ThirdwebNftMedia metadata={nft.metadata} 
                            className="view-scripts-image"
                          /> 

                          {/* <MediaRenderer                               
                            // src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaW5ZTWluIG1lZXQiIHZpZXdCb3g9IjAgMCAzNTAgMzUwIj48c3R5bGU+LmJhc2UgeyBmaWxsOiBibGFjazsgZm9udC1mYW1pbHk6IHNlcmlmOyBmb250LXNpemU6IDE0cHg7IH08L3N0eWxlPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNFOEY1NTkiIC8+PHRleHQgeD0iMTAiIHk9IjIwIiBjbGFzcz0iYmFzZSI+UXR5IFByZXNjcmliZWQ6IDM4IHwgUXR5IEZpbGxlZDogMCB8IFF0eSBMZWZ0OiAzODwvdGV4dD48dGV4dCB4PSIxMCIgeT0iNDAiIGNsYXNzPSJiYXNlIj5NZWRpY2F0aW9uOiBBbWxvZGlwaW5lIDUgbWcgfCBSeCBJdGVtICMxPC90ZXh0Pjx0ZXh0IHg9IjEwIiB5PSI2MCIgY2xhc3M9ImJhc2UiPkRhdGUgUHJlc2NyaWJlZDogMjAyMy0wNS0xNCB8IERhdGUgRmlsbGVkOiAgfCBOZXh0IFJlZmlsbCBEYXRlOiA8L3RleHQ+PC9zdmc+"
                            // src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaW5ZTWluIG1lZXQiIHZpZXdCb3g9IjAgMCAzNTAgMzUwIj48c3R5bGU+LmJhc2UgeyBmaWxsOiBibGFjazsgZm9udC1mYW1pbHk6IHNlcmlmOyBmb250LXNpemU6IDE0cHg7IH08L3N0eWxlPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNFOEY1NTkiIC8+PHRleHQgeD0iMTAiIHk9IjIwIiBjbGFzcz0iYmFzZSI+UXR5IFByZXNjcmliZWQ6IDM4IHwgUXR5IEZpbGxlZDogMTYgfCBRdHkgTGVmdDogMjI8L3RleHQ+PHRleHQgeD0iMTAiIHk9IjQwIiBjbGFzcz0iYmFzZSI+TWVkaWNhdGlvbjogQW1sb2RpcGluZSA1IG1nIHwgUnggSXRlbSAjMTwvdGV4dD48dGV4dCB4PSIxMCIgeT0iNjAiIGNsYXNzPSJiYXNlIj5EYXRlIFByZXNjcmliZWQ6IDIwMjMtMDUtMTQgfCBEYXRlIEZpbGxlZDogMjAyMy0wNS0yMCB8IE5leHQgUmVmaWxsIERhdGU6IDIwMjMtMDYtMjA8L3RleHQ+PC9zdmc+"
                            // metadata={nft.metadata}
                            // className="view-scripts-image"
                          > */}

                              <p><b>Patient:</b> {nft.metadata.name.startsWith('0x') ? (
                                                      ethers.utils.toUtf8String(ethers.utils.RLP.decode(nft.metadata.name))
                                                  ) : (
                                                      nft.metadata.name
                                                  ) } | 
                                   <b> DOB:</b> {nft.metadata.attributes[1].value.startsWith('0x') ? (
                                                      formatDateTwoDigitYear(ethers.utils.toUtf8String(ethers.utils.RLP.decode(nft.metadata.attributes[1].value)))
                                                  ) : (
                                                      formatDateTwoDigitYear(nft.metadata.attributes[1].value)
                                                  )
                                                }
                              </p>
                              {/* <p><b>DOB:</b> {nft.metadata.dob}</p> */}
                              {/* <p><b>DOB:</b> {getDob(nft.metadata.id.toString())}</p> */}
                              <p className="hyphens"><b>Medication:</b> {nft.metadata.attributes[0].value}</p>
                              <p className="hyphens"><b>SIG:</b> {nft.metadata.description}</p>
                              {/* <p><b>Medication</b> {nft.metadata.medication}</p> */}
                              {/* <p><b>Medication:</b>{getMedicationString(nft.metadata.id.toString())}</p> */}
                              {/* <p><b>Medication:</b>{getMedicationString(nft.metadata.id)}</p> */}
                              {/* <p><b>Medication:</b>{getMedicationString(nft.metadata.id)}</p> */}

                              <p><b>Qty:</b> {nft.metadata.attributes[2].value} | <b>Date Prescribed:</b> {convertBigNumberToFourDigitYear(nft.metadata.attributes[5].value)}</p>
                    {nft.metadata.attributes[3].value != 0 && 
                              <p><b>Qty Filled:</b> {nft.metadata.attributes[3].value} | <b>Last Filled:</b> {convertBigNumberToFourDigitYear(nft.metadata.attributes[6].value)}</p>
                    }

                    {/* {nft.metadata.attributes[2].value - nft.metadata.attributes[3].value == 0 && 
                              <p><b>Qty Filled:</b> {nft.metadata.attributes[3].value} | <b>Date Filled:</b> {nft.metadata.attributes[6].value}</p>
                    } */}
                    

                              {/* <p><b>Date Prescribed:</b> {nft.metadata.dateprescribed}</p>                            
                              <p><b>Quantity Prescribed:</b> {nft.metadata.quantity} </p>
                              <p className="text-left"><b>Quantity Filled:</b> {nft.metadata.quantityfilled}</p> */}

{/* ****************************************************************************************************** */}
    {nft.metadata.attributes[2].value - nft.metadata.attributes[3].value !== 0 ? (
        <>          

          <div className="view-scripts-card">


                {/* <form onSubmit={e => handleSubmitTest(e)}>

                            <div className="view-scripts-card">
                    
                                    <div className="input-group-mb-3">

                                          <select className="form-select" aria-label="Select A Medication" name="rxWallet" value={rxWallet.value} onChange={(e) => handleChange(e, nft.metadata.id)}  >
                                              <option selected value="none">Select a Pharmacy...</option>

                                              {pharmacy.map((pharmacy, index) => (
                                                  <option 
                                                      value={`${pharmacy.pharmacy_wallet}`}                                                                                  
                                                      key={`${index}`}>
                                                          {pharmacy.pharmacy_name} [{addyShortner(pharmacy.pharmacy_wallet)}]
                                                  </option>                                                                            
                                              ))}

                                          </select>     
                                    </div>

                                        <input type="hidden" name="tokenIdInput" value={nft.metadata.id} ref={inputTokenId}></input>
                                    
                                    <div className="row">
                                      <div className="col-md-12">
                                      
                                          <button type="submit" className="btn btn-success">Submit {nft.metadata.medication} To Pharmacist</button>

                                      </div>
                                  </div>
                            </div>
                      </form> */}

              <Link className="btn btn-primary" to={`/patient-fax-script/${nft.metadata.id}`}>Send {nft.metadata.attributes[0].value} To A Pharmacy</Link>

              </div>

            </>
            ) : (

              <div className="view-scripts-card">

                    <div className="input-group-mb-3">
                        <p><b style={{color:"white"}}>Medication Filled: {nft.metadata.attributes[6].value}</b></p>
                        <b style={{color:"white"}}>Next Fill Date: {nft.metadata.attributes[7].value}</b>
                    </div>
                    
                    
                    <div className="row">
                        <div className="col-md-12">                                    
                          {/* <button className="btn btn-light" disabled>{nft.metadata.attributes[0].value} Filled: {formatDateTwoDigitYear(nft.metadata.attributes[6].value)}</button>                                      */}
                        </div>
                    </div>
              </div>

            )}
{/* ****************************************************************************************************** */}
                
                              <p className="hyphens"><b style={{color:"white"}}>   
                                Quantity Filled: {nft.metadata.attributes[3].value}/{nft.metadata.attributes[2].value}  
                              </b></p>
              </div> 
        </div>
      </div> 
                    )) : (
                      
                      <>
                        <div className="text-center">
                          <h3 style={{color:`${sessionsColor}`}}>No NFT Scripts found for Address:</h3>
                          <h5 style={{color:"white"}}>{address}</h5>
                          <h5 style={{color:`${sessionsColor}`}}>Please contact your doctors office if you need further assistance.</h5>
                        </div>
                      </>
                  )}
            </div>{/* closing div for show scripts or no scripts message based on loading */}
          </div>{/* closing div for view-scripts-cards */}
      </div> {/* closing div for accordion */}
    </div> {/* closing div for wrapper */}
          





 </div> {/* closing div for wrapper  view-scripts-container*/}

</>

)
}
export default PatientDashboard
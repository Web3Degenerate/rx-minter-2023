import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAddress, useContract, ConnectWallet, useOwnedNFTs, ThirdwebNftMedia, 
    useTransferNFT, useMetadata, useNFT, MediaRenderer, useContractRead, useContractEvents } from "@thirdweb-dev/react";

import { addyShortner, formatDateFourDigitYear, formatDateTwoDigitYear, convertBigNumberToTwoDigitYear, convertBigNumberToFourDigitYear, convertBigNumberToRawString } from '../utils'
import { solidityContractAddress } from '../constants'

import 'bootstrap/dist/css/bootstrap.css';
import "../styles/App.css";
  
  import { ethers } from 'ethers';

const PharmacyHistory = () => {

    // const address = useAddress();
    const address = "0xEc556927470AEa02dCA8e59c682E7BD5f565D4aE"

    const { contract } = useContract(solidityContractAddress);

    const { data: fillEvents, isLoading: isLoadingFillEvents } = useContractEvents(
        contract,
        "UpdateScriptQuantityAndDatesEvent"
        // {
            // queryFilter: {
            //         filters: {
            //             pharmacy_address: address
            //         },
            //     order: "desc",
            // }
        // }
    )

    console.log("UpdateScriptQuantityAndDatesEvents found are ",fillEvents)

//Get Patient by address
const loadPatient = async (wallet_address) => {
    const result = await axios.get("https://rxminter.com/php-react/patient-get-by-address.php?wallet_address="+wallet_address);
    console.log("loadPatient returned", result)
    let patientName = result.data.name;
    return patientName;
}


const [patientData, setPatientData] = useState([]);
const [testPatientData, setTestPatientData] = useState([]);


useEffect(() => {
    async function fetchPatientNames() {
      const patientNames = await Promise.all(fillEvents.map(eventz => loadPatient(eventz.data.patient_address)));
      setPatientData(patientNames);
      setTestPatientData(patientNames);
    }
    fetchPatientNames();
    console.log("patientData is ",patientData)
    console.log("patientData is of type",typeof(patientData))
    console.log("testPatientData is ",testPatientData)
  }, [fillEvents]);


//Current PST Date
    const currentDate = new Date();
    const options = {
        timeZone: 'America/Los_Angeles',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    };
    const pstDate = currentDate.toLocaleString('en-US', options).split(', ')[0];

    //from: https://www.youtube.com/watch?v=xAqCEBFGdYk
    const [search, setSearch] = useState('');


    // Filter users based on search query
    const [searchQuery, setSearchQuery] = useState('');
    // const filteredUsers = fillEvents.filter(eventz =>
    //     // patientData[users.indexOf(user)].toLowerCase().includes(searchQuery.toLowerCase())
    //     patientData[fillEvents.indexOf(eventz)].toLowerCase().includes(searchQuery.toLowerCase())
    // );

    // const filteredUserNames = patientData.filter(userName =>
    //     userName.toLowerCase().includes(searchQuery.toLowerCase())
    //   );



  return (
 <>   
 
        <>
                <h3>Pharmacy History</h3>
             {/* <h5>Current Date in PST is {pstDate}</h5> */}

            <div className="row">
                <div className="col-md-12 text-center">
                    <div className="input-group mb-3">
                        <input type="search" className="form-control" placeholder="Search For A Patient, Medication name or Prescribing Doctor..." ariaLabel="Recipient's username" ariaDescribedby="basic-addon2"
                        onChange={(e) => setSearch(e.target.value.toLowerCase())}></input>
                        {/* <div className="input-group-append">
                            <button className="btn btn-outline-secondary" type="button">Search</button>
                        </div> */}
                    </div>        
                </div>
            </div>
                <table className="table table-striped table-dark">
                        <thead>          
                            <tr>
                                <th style={{display: "none"}}>Key</th>

                                <th>Date Filled</th>

                                <th>Medication</th>

                                <th>Qty Filled</th>
                                                
                                <th>Qty Prescribed</th>    

                                <th>Qty Left</th>  

                                {/* <th>Next Refill</th> */}

                                <th>Patient</th>

                                <th>Doctor</th>

                                <th>DEA #</th>

                                <th>Rx #</th>
                            </tr> 
                        </thead>
            <tbody className="table-striped">
                
                {/* {nfts?.filter((nft) => {
                  return nft.metadata.id.toString() === '25'
                }
                ).map((nft) => ( */}
     {isLoadingFillEvents ? (
            <tr>
                <td colSpan="10" className="text-center">
                    <h5 style={{color:"white"}}>Loading table. Please wait...</h5>
                </td>
            </tr>
        ) : (
           
                fillEvents?.filter((eventz) => {
                    return search.toLowerCase() === '' ? eventz : patientData.some(str => str.toLowerCase().includes(search)) || eventz.data.doctor_name.toLowerCase().includes(search) || eventz.data.medication_name.toLowerCase().includes(search)
                 }
     
                 ).map((eventz, index) => (
                    eventz.data.pharmacy_name == address ? (
                      
                                <tr key={`${index}`}>
                                    <td style={{display: "none"}}>{index+1}</td>

                                    <td>{convertBigNumberToFourDigitYear(eventz.data.date_filled)}</td>

                                    {/* <td>{nftz.metadata.attributes[0].value}</td> */}

                                    <td>{eventz.data.medication_name}</td>

                                    <td>{(eventz.data.quantity_filled_today).toNumber()}</td>

                                    <td>{(eventz.data.quantity_prescribed).toNumber()}</td>

                                    <td>{(eventz.data.quantity_unfilled).toNumber()}</td>

                                    {/* <td>{convertBigNumberToFourDigitYear(eventz.data.next_available_fill_date)}</td> */}

                                    {/* <td>{eventz.data.pharmacy_name} {addyShortner(eventz.data.pharmacy_address)}</td> */}

                                    <td>{patientData[index]}</td>
                                    {/* {patientData[users.indexOf(user)]} */}
                                    {/* <td>{patientData[eventz.indexOf(user)]}</td> */}
                                    {/* <td>{patientData[patientNames.indexOf(eventz)]}</td> */}
                                    {/* <td>{patientData.indexOf(patientData[index])}</td> */}
                                    

                                    <td>{eventz.data.doctor_name}</td>

                                    <td>{eventz.data.doctor_dea}</td>

                                    <td>{eventz.data.script_token_number.toNumber()}</td>
                                    
                                </tr>
           
                             ) : (
                            eventz.data.script_token_number == 52 &&
                                <tr>
                                    <td colSpan="10" className="text-center">
                                        <h5 style={{color:"white"}}>No Previous Transactions Found.</h5>
                                    </td>
                                </tr>

                             )))  
                   
            )}
                        </tbody>
                    </table>
        </>
    

</>



  )
}

export default PharmacyHistory
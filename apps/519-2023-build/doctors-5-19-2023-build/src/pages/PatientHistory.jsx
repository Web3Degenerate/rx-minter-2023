import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAddress, useContract, useContractWrite, ConnectWallet, useOwnedNFTs } from "@thirdweb-dev/react";
// (~16th min to -16:30) - map over nfts in return stmt that we grab here (metadata.nft)  https://youtu.be/cKc8JVl_u30?t=990
// import { useAddress, useContract, ConnectWallet, useOwnedNFTs, ThirdwebNftMedia, 
//     useTransferNFT, useMetadata, useNFT, MediaRenderer, useContractRead } from "@thirdweb-dev/react";


import { addyShortner, formatDateTwoDigitYear, formatDateFourDigitYear, convertBigNumberToTwoDigitYear } from '../utils'
import { solidityContractAddress } from '../constants'

import { ethers } from 'ethers';

import { GuestLogin } from '../components'

import 'bootstrap/dist/css/bootstrap.css';
import "../styles/App.css";

const PatientHistory = () => {

let navigate = useNavigate();


// From Part 4 (9:01): https://youtu.be/6DUx-WUsJro?t=541
    const { id } = useParams();

    const { contract } = useContract(solidityContractAddress)
  



  // console.log('id check', id);

  // Add state (8:06): https://www.youtube.com/watch?v=Ovr1ewUIrpU&t
      const [patient, setPatient] = useState({
          name: "",
          wallet_address: "",
          dob: "",
          email:"",
          pid:"",
          pt_physical_address:"",
          pt_phone: "",
          pt_primary_insurance:"",
          pt_primary_id:"",
          pt_secondary_insurance:"",
          pt_secondary_id:"",
      });

    useEffect(()=> {    
        loadUser(); 
        // loadMedications();
        // loadPatients();
        // getPatientRoleString();
    }, [])



      // const [name,wallet_address,email] = patient; // patient is not iterable nasty error
      const {name,wallet_address,email,dob,pt_physical_address,pt_phone,pid,pt_primary_insurance,pt_primary_id,pt_secondary_insurance,pt_secondary_id} = patient; 

  const address = useAddress(); 
  const audit_address = patient.wallet_address;
  console.log("Audit address:", audit_address)

  const { data: nfts, isLoading: loading } = useOwnedNFTs(contract, audit_address);
  console.log(nfts)
 

      // const loadUsers = async (id) => {  //id was not being passed in when passed in as a parameter (14:45) pt 4.
      const loadUser = async () => {
          // console.log('ID check inside loadUsers', id) 
        //   setPatient({name: "", wallet_address: "", dob: "", email:"", id:""});
            console.log("id inside loadUser() is:", id)
          const result = await axios.get("https://rxminter.com/php-react/edit.php?id="+id);
          console.log(result);
          // setPatient(result.data.records);
          setPatient(result.data);
          // navigate('/');
      }


    //   const loadPatients = async () => {
    //     setPatient([]);   
    //     const result = await axios.get("https://rxminter.com/php-react/view.php");
    //     console.log(result);
    //     setPatients(result.data.records);
    // }




//from: https://www.youtube.com/watch?v=xAqCEBFGdYk
const [search, setSearch] = useState('');
// console.log(search);


  return (

    
    <>

{address ? (
    <>
      
        <div className="row">
            <div className="col-md-12 text-center">
                <h1>Cures 3.0 Rx NFT History For: {patient.name}</h1>
                <h5>With Verified Wallet Address: {patient.wallet_address}</h5>
            </div>
        </div>

    
        <div className="row">
            <div className="col-md-12 text-center">
                <div className="input-group mb-3">
                    <input type="search" className="form-control" placeholder="Search For Patient" aria-label="Recipient's username" aria-describedby="basic-addon2"
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

                    <th>Patient</th>

                    <th>DOB</th>
                    
                    {/* <th>Wallet Address</th> */}
                    
                    <th>Medication</th>                  

                    <th>Qty</th>

                    <th>Qty Filled</th>
                   
                    <th>Prescribing Doctor</th>

                    <th>DEA #</th>

                    <th>Rx #</th>
                </tr> 
            </thead>
            <tbody className="table-striped">
             {/* <tr key={`${index}`}> */}
             {/* {nfts?.map((nft, index) => ( */}

        {nfts?.length > 0 ? 
 
            nfts?.filter((nft) => {
               return search.toLowerCase() === '' ? nft : nft.metadata.name.toLowerCase().includes(search) || nft.metadata.attributes[0].value.toLowerCase().includes(search)
            }

            ).filter(nft => nft.metadata.attributes[2].value > 0).map((nft, index) => (

                <>
                    <tr key={`${index}`}>
                        <td style={{display: "none"}}>{index+1}</td>

                        {nft.metadata.attributes[6].value != 0 ? (                       
                            <td className="text-center"><Link className="btn btn-primary" to={`/prescription-history/${nft.metadata.id}`}>{convertBigNumberToTwoDigitYear(nft.metadata.attributes[11].value)}</Link></td>
                        ) : (
                            <td className="text-center">"N/A"</td>
                        )}

                        <td>
                            {nft?.metadata.name.startsWith('0x') ? (
                                ethers.utils.toUtf8String(ethers.utils.RLP.decode(nft?.metadata.name))
                            ) : ( 
                                nft.metadata.name
                            )}
                        </td>

                        <td>
                            {nft?.metadata.attributes[1].value.startsWith('0x') ? (
                                formatDateFourDigitYear(ethers.utils.toUtf8String(ethers.utils.RLP.decode(nft?.metadata.attributes[1].value)))
                            ) : ( 
                        
                                formatDateFourDigitYear(nft?.metadata.attributes[1].value)
                            )}
                            
                        </td>
                        
                        {/* <td>{patient.wallet_address.slice(0,5)}...{patient.wallet_address.slice(37)}</td> */}

                        <td>{nft.metadata.attributes[0].value}</td>
                        

                        <td>{nft.metadata.attributes[2].value}</td>

                        <td className="text-center">{nft.metadata.attributes[3].value}</td>

                        
                        <td className="text-center">{nft.metadata.attributes[8].value}</td>

                        <td className="text-center">{nft.metadata.attributes[9].value}</td>
                  
                        <td>{nft.metadata.id}</td>
                    </tr>
           

            </>
                )) : (
                        <tr>
                              <td colSpan="9" className="text-center">
                                  <h5 style={{color:"white"}}>No Script History Found For {patient.name}</h5>
                              </td>
                        </tr>
                )}
            </tbody>
        </table>
    </>
        ) : (
            <>
                 <GuestLogin />   

            </>
        )}

    {/* </div> */}
    
</>





  )
}
export default PatientHistory
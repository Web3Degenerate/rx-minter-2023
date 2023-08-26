import { useAddress, useContract, ConnectWallet, useOwnedNFTs, ThirdwebNftMedia, 
    useTransferNFT, useMetadata, useNFT, useContractRead } from "@thirdweb-dev/react";
    //removed MediaRenderer, Web3Button

// import { useAddress, useContract, ConnectWallet } from "@thirdweb-dev/react";
  
//   import "../styles/ViewScripts.css";
  import 'bootstrap/dist/css/bootstrap.css';
  import "../styles/App.css";

  import React, { useState, useEffect, useRef} from 'react' 
  import { useNavigate, Link } from 'react-router-dom'
  import axios from 'axios';
  import { ethers } from 'ethers';

  import { addyShortner, convertBigNumberToTwoDigitYear, convertBigNumberToFourDigitYear, 
    convertBigNumberToRawString, formatDateFourDigitYear, formatDateTwoDigitYear, decodePatientName } from '../utils'
  import { solidityContractAddress } from '../constants'

  import { logoPalau } from '../assets'

  

const PharmacyDashboard = () => {

    //  const { contract } = useContract("0xE0a73cAEb01ABdee510993F2d6a525b9948B49dF"); // 11.0 - Fixed spacing SVG issue. 
    // const { contract } = useContract("0xE0a73cAEb01ABdee510993F2d6a525b9948B49dF"); // 11.0 - Fixed spacing SVG issue.  
    // const { pharmacyContract } = useContract("0x684E9cA3BDf984769531Af2778957815EB096e01"); // 11.1 - Testing Pharmacy Update
    // const { contract } = useContract("0x135B8F385f8FaE5ab558d2D2A7A5d33a99184485"); // 11.7 (1 jake ottenger last used) - Fixed spacing SVG issue.  
    // const { contract } = useContract(solidityContractAddress); // 11.7 (1 jake ottenger last used) - Fixed spacing SVG issue.  
    const { contract } = useContract(solidityContractAddress);

    

    // Your NFT collection contract address
    // const contractAddress = "0x135B8F385f8FaE5ab558d2D2A7A5d33a99184485";
    // const pharmacyContractAddress = "0x684E9cA3BDf984769531Af2778957815EB096e01";

    //Get Current User's Addy: 
    const address = useAddress(); 
    // const address = "0xEc556927470AEa02dCA8e59c682E7BD5f565D4aE"
    //  const address = '0xE3cEA19e68430563f71C591390358e54d1fa857a'

    // const addyShortner = (address) => {
    //     let tempAddy = String(address);
    //     // String(address).substring(0, 6) + "..." + String(address).substring(address.length - 4);
    //     const tinyAddy = tempAddy.substring(0, 6) + "..." + tempAddy.substring(37)
    //     return tinyAddy;
    // }

    const { data: nfts, isLoading: isLoadingNFT } = useOwnedNFTs(contract, address);
    console.log("Pharmacy owned nfts:", nfts)

    //from: https://www.youtube.com/watch?v=xAqCEBFGdYk
    const [search, setSearch] = useState('');

    // const decodePatientName = (name) => {
    //     if (name.startsWith('0x') ) {
    //        return ethers.utils.toUtf8String(ethers.utils.RLP.decode(name))
    //       }else{
    //         return nft.metadata.name
    //     }
    // }

//**************************************** -- RETURN -- ************************************* */
return (

<>

{address ? (
    <>
                            {/* <div className="connect text-center">
                                    <ConnectWallet dropdownPosition={{
                                        align: 'center',
                                        side: 'bottom'
                                    }} />
                            </div>  */}

                <div className="row">
                    <div className="col-md-12 text-center">
                        <h1>Pharmacy Dashboard</h1>
                    </div>
                </div>


                {/* <div className="row">   */}
                        <div className="col-md-12 text-center">
                            <b>Pharmacy Address: {addyShortner(address)}</b>  
                        </div>
                {/* </div> */}
        
      



        
        <div className="row">
            <div className="col-md-12 text-center">
                <div className="input-group mb-3">
                    <input type="search" className="form-control" placeholder="Search For A Patient or Medication Name..." aria-label="Recipient's username" aria-describedby="basic-addon2"
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
                    <th>Patient</th>
                    
                    {/* <th>Wallet Address</th> */}
                    
                    <th className="text-center">Medication</th>
 
                    <th className="text-center">Quantity Prescribed</th>

                    <th className="text-center">Quantity Filled</th>

                    <th>Date Prescribed</th>
                    
                    <th>Manage</th>

                    {/* <th>Delete</th> */}
                </tr> 
            </thead>
            <tbody className="table-striped">
             {/* <tr key={`${index}`}> */}


{/* Later Versions */}
{/* || nft.metadata.wallet_address.toLowerCase().includes(search) */}
{/* <td>{nft.metadata.wallet_address.slice(0,5)}...{nft.metadata.wallet_address.slice(37)}</td> */}
            {/* {patient.filter((patient) => { */}

{isLoadingNFT ? (
            <tr>
            <td colSpan="7" className="text-center">
                <h5 style={{color:"white"}}>Checking for NFT Prescriptions. Please wait...</h5>
            </td>
            </tr>
    ) : (
    nfts?.length > 0 ?
            nfts?.filter((nft) => {
               return search.toLowerCase() === '' ? nft : decodePatientName(nft.metadata.name).toLowerCase().includes(search) || nft.metadata.attributes[0].value.toLowerCase().includes(search)
            }

            ).map((nft, index) => (
        <>
                    <tr key={`${index}`}>
                        <td style={{display:"none"}}>{index+1}</td>

                        <td>
                            {decodePatientName(nft.metadata.name)}
                        </td>
 
                        <td>{nft.metadata.attributes[0].value}</td>

                        <td className="text-center">{nft.metadata.attributes[2].value}</td>

                        <td className="text-center">{nft.metadata.attributes[3].value}</td>

                        <td>
                        {convertBigNumberToFourDigitYear(nft?.metadata.attributes[5].value)}
                        </td>

                        <td><Link className="btn btn-primary" to={`/pharmacy-review-nft/${nft.metadata.id}`}>Manage Rx</Link></td>
                    
                    </tr>
    </>
    )) : (
                        <tr>
                              <td colSpan="7" className="text-center">
                                  <h5 style={{color:"white"}}>There are no NFT Prescriptions For Your Review</h5>
                              </td>
                        </tr>
        ) )}
            </tbody>
        </table>
    </>
        ) : (
            <>
                    
                    <div className="box_size_login text-center" style={{background:"#444943"}}>

                    <img src={logoPalau} className="image--cover" />

                    <h2 style={{color:"white"}}>Pharmacy Login</h2>

                    <h3 className="text-justify text-center" style={{color:"#74A27F"}}>
                        Click the <b>'Connect'</b> button below to Manage patient NFT Scripts.                     
                    </h3>

                            <div className="connect text-center">
                                    <ConnectWallet dropdownPosition={{
                                        align: 'center',
                                        side: 'bottom'
                                    }} />
                            </div>                   

                    </div>
            </>
        )}

    {/* </div> */}
    
</>



  )
}
export default PharmacyDashboard
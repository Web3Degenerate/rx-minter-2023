import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAddress, useContract, useContractWrite,  } from "@thirdweb-dev/react";


import { addyShortner } from '../utils'
import { solidityContractAddress } from '../constants'

import 'bootstrap/dist/css/bootstrap.css';
import "../styles/App.css";

import "../styles/Overlay.css";
import { GuestLogin } from '../components';


const EditPatient = () => {

  let navigate = useNavigate();
//   const { contract } = useContract("0x135B8F385f8FaE5ab558d2D2A7A5d33a99184485"); // 11.7 - Improved metadata and function callls (5/21/23)
//   const { contract } = useContract("0xE5960C2422B192a54988D0b7d7cD6d3f8A3a7794"); // 12.1 - Improved metadata and hasPatientRole (5/23/23)
  
    const { contract } = useContract(solidityContractAddress)
  
  const address = useAddress(); 

// From Part 4 (9:01): https://youtu.be/6DUx-WUsJro?t=541
  const { id } = useParams();

  // console.log('id check', id);

  // Add state (8:06): https://www.youtube.com/watch?v=Ovr1ewUIrpU&t
      const [patient, setPatient] = useState({
          name: "",
          wallet_address: "",
          dob: "",
          email:"",
          id:"",
          pt_physical_address:"",
          pt_phone: "",
          pt_primary_insurance:"",
          pt_primary_id:"",
          pt_secondary_insurance:"",
          pt_secondary_id:"",
      });


  
      const [medication, setMedication] = useState([]);
      const [patients, setPatients] = useState([]);
      // const [medication, setMedication] = useState({
      //     name: "",
      //     sig: "",
      //     strength:"",
      //     quantity:""
      // });

    useEffect(()=> {    
        loadPatient(); 
        // loadMedications();
        // loadPatients();
        // getPatientRoleString();
    }, [])



      // const [name,wallet_address,email] = patient; // patient is not iterable nasty error
      const {name,wallet_address,dob,email,pt_physical_address,pt_phone,pt_primary_insurance,pt_primary_id,pt_secondary_insurance,pt_secondary_id} = patient; 
  
      const handleChange=(e)=>{
          setPatient({...patient,[e.target.name]: e.target.value })
          // console.log(e);
          console.log("Patient in handleChange: ",patient);
      }

      const [solidityPhoneNumber, setSolidityPhoneNumber] = useState('')
      const [webPhoneNumber,setWebPhoneNumber] = useState('')
      const handlePhoneChange=(e)=>{
        // console.log(e);
        const input = e.target.value;
        // Remove all non-digit characters from the input
        const digitsOnly = input.replace(/\D/g, '');

        // Apply the desired formatting using regular expressions
        const formattedNumber = digitsOnly.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
        const rawNumber = `1${formattedNumber.replace(/-/g, '')}`;
        setSolidityPhoneNumber(rawNumber)

        const webNumber = rawNumber.replace(/^1/, '') // Remove leading '1'
                         .replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'); // Add dashes

        setWebPhoneNumber(webNumber)

        // const formattedNumber = formatPhoneNumber(input);

        setPatient({...patient,[e.target.name]: formattedNumber })

        console.log("Phone in handlePhoneChange with formattedNumber: ",patient.pt_phone);
        console.log("Patient Object in handlePhoneChange: ",patient);
    }
      

// Wed 8/16/2023 - Testing out onBlur with ChatGPT at AUS
    const [errorMessage, setErrorMessage ] = useState('')
    const [errorMessageInput, setErrorMessageInput ] = useState('')

    const updateForm = async (e) => {
          e.preventDefault(); 
  
          console.log("Patient in updateForm: ",patient);
  
        //   await axios.post("https://rxminter.com/php-react/update.php", patient).then((result)=>{
        //       console.log(result);
        //       if(result.data.status =='valid'){   
        //         alert(`Success! Your changes to Patient ${name} has been saved! Click OK to return to the Patient Dashboard.`)                
        //         navigate('/');
        //       }else{
        //           alert('There is a problem saving this patient to the database. Please try again.');
        //       }
        //   });

          try {
            const result = await axios.post("https://rxminter.com/php-react/update-patient-chatgpt.php", patient);       
                console.log(result.data);
            if (result.data.status === 'valid') {
                setIsRedBorder(false);
                alert(`Success! Your changes to Patient ${name} has been saved! Click OK to return to the Patient Dashboard.`)
                navigate('/');
            } else if (result.data.status === 'invalid' && result.data.message) {
              setErrorMessage(result.data.message); // Display the error message from the server
            } else {
              setErrorMessage('There is a problem saving this patient to the database. Please try again.');
            }
          } catch (error) {
            console.log('Try Catch Error in submitForm when trying to save new pharmacy/facility was: ', error);
          }
      }

//Added Thu 8/17/2023 from chatGPT and Brad @ LearnWebCode: https://youtu.be/70fadMRqnBo?t=3090
      const [isRedBorder, setIsRedBorder] = useState(false); // Initialize to false
      const walletInputRef = useRef(null);
  
      const handleErrorButton = (e) => {
          e.preventDefault(); 
//8/17 - don't need errorMessage, hold wallet_address as duplicate. displaying wallet_address updates as user types
        //   setErrorMessageInput(errorMessage);
          setErrorMessageInput(wallet_address);
          setErrorMessage('');
          setIsRedBorder(true);
        //   setPatient({...patient,wallet_address: wallet_address })
//8/17/23 - scrapped the idea of loading original wallet address. 
        // setPatient({...patient,wallet_address: originalWallet });
        // loadPatientWalletOnly();  
          walletInputRef.current.focus();
  
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

        console.log('patient address just outside of getPatientRoleString() is:', wallet_address)
    getPatientRoleString();

    const { mutateAsync: addPatient } = useContractWrite(contract, "addPatient")

    const addPatientRole = async (e) => {
        e.preventDefault();
      try {
        const data = await addPatient({ args: [wallet_address] });
            console.info("contract call successs", data);
            // setPatientRole(data) receipt.events[0].args.tokenId;
            console.log("Target Receipt Transaction:", data.receipt.events[0].getTransaction)
            console.log("Target Receipt Status:", data.receipt.status)
            // setPatientRole("Patient Role Assigned")
        
        getPatientRoleString();

      } catch (err) {
        console.error("contract call failure", err);
      }
    }

    const removePatientRole = async (e) => {
        e.preventDefault()
        try{
            const dataRemovePatient = await contract.call("removePatient", [wallet_address]);
            console.log('getPatientRoleString returned: ', dataRemovePatient)
            
            getPatientRoleString();
        }catch(err){
            console.error("contract call failure", err);
        }
    }
  

    const [originalWallet,setOriginalWallet] = useState('')
      // const loadUsers = async (id) => {  //id was not being passed in when passed in as a parameter (14:45) pt 4.
      const loadPatient = async () => {
          // console.log('ID check inside loadUsers', id) 
          setPatient({name: "", wallet_address: "", dob: "", email:"", id:"", pt_physical_address:"", pt_phone:"",
        pt_primary_insurance:"",pt_primary_id:"",pt_secondary_insurance:"",pt_secondary_id:""});
          const result = await axios.get("https://rxminter.com/php-react/edit.php?id="+id);
          console.log(result);
          // setPatient(result.data.records);
          setPatient(result.data);
          setOriginalWallet(result.data.wallet_address);
          // navigate('/');
      }

//#YOLO Thu 8/17/2023 - Load single patient, but only update the wallet_address to the original value on edit page
        const loadPatientWalletOnly = async () => {
            setPatient({...patient,wallet_address: ''});
            const result = await axios.get("https://rxminter.com/php-react/edit.php?id="+id);
                console.log("Single Patient called from 8/17/2023 loadPatientWalletOnly is ",result);
            // setPatient(result.data.records);
            // setPatient(result.data);
            setPatient({...patient,wallet_address: result.data.wallet_address});
            // navigate('/');
        }


// 5:10pm R 5/4/23: Load all medications: 
      const loadMedications = async () => {
        setMedication([]);   
        const result = await axios.get("https://rxminter.com/php-react/viewmeds.php");
        console.log(result);
        setMedication(result.data.meds);
        // navigate('/');
      }



    //   const loadPatients = async () => {
    //     setPatient([]);   
    //     const result = await axios.get("https://rxminter.com/php-react/view.php");
    //     console.log(result);
    //     setPatients(result.data.records);
    // }


    const handleKeyDown = (event) => {
      if (event.keyCode === 13){
        event.preventDefault();
      }
    }
    

  return (

   <> 

<>

    {address ? (
        <>



    <form onSubmit={e => updateForm(e)}>
            <div className="nft_box_size">
                    <div className="row">
                            <div className="col-md-12 text-center">
                            <h1> Edit Patient:</h1> 
                            <h3 className="display-3">{name}</h3>

                                {/* <h1>Edit Patient: {name} - {addyShortner(wallet_address)}</h1>  */}
                                {/* <h5>Solidity Phone Number: {solidityPhoneNumber}</h5>    */}
                                {/* <h5>Web Phone Number is: {webPhoneNumber}</h5>            */}
                            </div>
                    </div>

<div className={errorMessage ? 'main-ui blurred' : ''}>

                <div className="box_size_new_form">
                        <div className="row" >
                                <div className="col-md-3">Patient Name:</div>
                                <div className="col-md-9">
                                    <input type="text" name="name" className="form-control" value={name} onChange={(e) => handleChange(e)} required />   
                                </div>
                        </div>

    {errorMessageInput && (                         
        <div className="alert alert-danger">
        <p className="display-8" style={{color:"red"}}>
            Wallet Address {errorMessageInput} is a duplicate address. 
        </p>
        <p className="display-8" style={{color:"red"}}>
            Wallet Address {originalWallet} was previously saved to {name}. 
        </p>
        </div>          
    )}


                    <div className={isRedBorder ? 'red-border' : ''}>
                            <div className="row">
                                    <div className="col-md-3">Wallet:</div>
                                    <div className="col-md-9">
                                        <textarea name="wallet_address" className="form-control" value={wallet_address} 
                                        onChange={(e) => handleChange(e)} onKeyDown={handleKeyDown} ref={walletInputRef} rows="2" required />   
                                    </div>
                            </div>
                    </div>

                            <div className="row">
                                    <div className="col-md-3">DOB:</div>
                                    <div className="col-md-9">
                                      {/* <input type="text" name="email" className="form-control" value={email} onChange={(e) => handleChange(e)} />
                                      <input type="date" name="dob" className="form-control" value="1969-06-09" onChange={(e) => handleChange(e)} /> */}
                                        <input type="date" name="dob" className="form-control" value={dob} onChange={(e) => handleChange(e)} required />   
                                    </div>
                            </div>

                            <div className="row">
                                    <div className="col-md-3">Phone:</div>
                                    <div className="col-md-9">
                                        <input type="text" name="pt_phone" className="form-control" value={pt_phone} onChange={(e) => handlePhoneChange(e)} required maxLength={12} />   
                                    </div>
                            </div>


                            <div className="row">
                                    <div className="col-md-3">Email Address:</div>
                                    <div className="col-md-9">
                                        <input type="text" name="email" className="form-control" value={email} onChange={(e) => handleChange(e)} placeholder="(Optional)" />   
                                    </div>
                            </div>

                            <div className="row">
                                    <div className="col-md-3">Address:</div>
                                    <div className="col-md-9">
                                        <textarea name="pt_physical_address" className="form-control" value={pt_physical_address} onChange={(e) => handleChange(e)} 
                                        onKeyDown={handleKeyDown} rows="2" required />   
                                    </div>
                            </div>   

                            <div className="row">
                                    <div className="col-md-3">Primary Insurance:</div>
                                    <div className="col-md-9">
                                        <input type="text" name="pt_primary_insurance" className="form-control" value={pt_primary_insurance} onChange={(e) => handleChange(e)}  />   
                                    </div>
                            </div>   

                            <div className="row">
                                    <div className="col-md-3">Primary ID#:</div>
                                    <div className="col-md-9">
                                        <input type="text" name="pt_primary_id" className="form-control" value={pt_primary_id} onChange={(e) => handleChange(e)}  />   
                                    </div>
                            </div>     

                            <div className="row">
                                    <div className="col-md-3">Secondary Insurance:</div>
                                    <div className="col-md-9">
                                        <input type="text" name="pt_secondary_insurance" className="form-control" value={pt_secondary_insurance} onChange={(e) => handleChange(e)}  />   
                                    </div>
                            </div>   

                            <div className="row">
                                    <div className="col-md-3">Secondary ID#:</div>
                                    <div className="col-md-9">
                                        <input type="text" name="pt_secondary_id" className="form-control" value={pt_secondary_id} onChange={(e) => handleChange(e)}  />   
                                    </div>
                            </div>                         

                            {/* <div className="row">
                                    <div className="col-md-6">Select Patient Email Test:</div>
                                    
                                    <select className="form-select" aria-label="Default select example" name="email" onChange={(e) => handleChange(e)}>
                                        <option selected>{email}</option>

                                        {patients.map((patient, index) => (
                                                <option value={`${patient.email}`} key={`${index}`}>{patient.email}</option>          
                                        ))}

                                    </select>
                            </div> */}

                       
                            <div className="row">
                                <div className="col-md-12 text-center">
                                    {/* <input type="submit" name="submit" value="Add Patient" className="btn btn-warning" /> */}
                                    {/* <button type="submit" className="btn btn-warning" >Save Changes</button> */}
                                    <button type="submit" className="btn btn-warning btn-lg btn-block container" style={{borderRadius:"12px"}} > Save Changes</button>

                                </div>
                            </div>
                    </div>

        </div> {/* Closing Blur Div */} 

        {errorMessage && ( 
               
               <div className="overlay overlay--visible">
                   <div className="overlay-inner">
                       <p className="end-message" style={{color:"red"}}><b>Error:</b> {errorMessage}</p>
                       <button className="reset-button" onClick={e => handleErrorButton(e)}>Okay</button>
                   </div>      
               </div>  
          
       )}             


    </div>
</form>


    <hr></hr>


            {patientRole != "Patient Role Assigned" ? (
                <>
                        <div className="nft_box_size">
                            <div className="row">
                                <div className="col-md-12 text-center">
                                    <h2>Manage Role: <b style={{color:"red"}}>{patientRole}</b></h2>                                       
                                </div>
                            </div>
                        </div>
                    

                        <div className="box_size">
                                <div className="text-center">
                                    <button onClick={(e) => addPatientRole(e)} className="btn btn-success">Add Patient Role to {name}</button>
                                </div>
                        </div>
                </>

            ) : (

                <>
                        <div className="nft_box_size">
                            <div className="row">
                                <div className="col-md-12 text-center">
                                    <h2>Manage Role: <b style={{color:"green"}}>{patientRole}</b></h2>                                       
                                </div>
                            </div>
                        </div>
                    

                        
                        <div className="text-center">
                            <button onClick={(e) => removePatientRole(e)} className="btn btn-danger">Remove Patient Role for {name}</button>
                        </div>
                </>                
            )}

    
    </>
        
        ) : (
            <GuestLogin />
        )}
    </>
</>
  )
}
export default EditPatient
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link, useNavigate, useParams } from "react-router-dom";

import { useAddress, useContract, useContractWrite,  } from "@thirdweb-dev/react";

import { addyShortner } from '../utils'
import { solidityContractAddress } from '../constants'

import 'bootstrap/dist/css/bootstrap.css';
import "../styles/App.css";



const EditDoctor = () => {

  let navigate = useNavigate();
//   const { contract } = useContract("0x135B8F385f8FaE5ab558d2D2A7A5d33a99184485"); // 11.7 - Improved metadata and function callls (5/21/23)
//   const { contract } = useContract("0xE5960C2422B192a54988D0b7d7cD6d3f8A3a7794"); // 12.1 - Improved metadata and hasPatientRole (5/23/23)
  
    const { contract } = useContract(solidityContractAddress)
  
  const address = useAddress(); 

// From Part 4 (9:01): https://youtu.be/6DUx-WUsJro?t=541
//   const { id } = useParams();
const doctor_id = 1;


  // console.log('id check', id);

  // Add state (8:06): https://www.youtube.com/watch?v=Ovr1ewUIrpU&t
      const [doctor, setDoctor] = useState({
          doctor_name: "",
          doctor_dea: "",
          doctor_wallet_address: "",
          doctor_npi:"",
          doctor_phone:"",
          doctor_fax: "",
          id:doctor_id
      });

      
  
    //   const [medication, setMedication] = useState([]);
    //   const [patients, setPatients] = useState([]);
      // const [medication, setMedication] = useState({
      //     name: "",
      //     sig: "",
      //     strength:"",
      //     quantity:""
      // });

    useEffect(()=> {    
        loadDoctors(); 
        // loadMedications();
        // loadPatients();
        // getPatientRoleString();
    }, [])



      // const [name,wallet_address,email] = patient; // patient is not iterable nasty error
      const {doctor_name,doctor_dea,doctor_wallet_address,doctor_npi,doctor_phone,doctor_fax,id} = doctor; 
  
      const handleChange=(e)=>{
          setDoctor({...doctor,[e.target.name]: e.target.value })
          // console.log(e);
          console.log("Doctor in handleChange: ",doctor);
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

        setDoctor({...doctor,[e.target.name]: formattedNumber })

        console.log("Phone in handlePhoneChange with formattedNumber: ",doctor.doctor_phone);
        console.log("Doctor Object in handlePhoneChange: ",doctor);
    }
      
  
      const updateForm = async (e) => {
          e.preventDefault(); 
  
          console.log("Doctor in updateForm: ",doctor);
  
          await axios.post("https://rxminter.com/php-react/update-doctor.php", doctor).then((result)=>{
              console.log(result);
  
           
              if(result.data.status =='valid'){
                  alert(`Success! Doctor ${doctor_name} with DEA# ${doctor_dea}, NPI# ${doctor_npi}, phone number ${doctor_phone} has been added! Click OK to return to the Patient Dashboard.`)
                  navigate('/');
              }else{
                  alert('There is a problem saving this doctor to the database. Please try again.');
              }
          });
      }

 
// Add Patient Role - Added 5/22/23 
    // const [patientRole, setPatientRole] = useState("")

    // const getPatientRoleString = async () => {
    //     try{
    //         const dataPatientRole = await contract.call("hasRolePatientString", [wallet_address]);
    //         setPatientRole(dataPatientRole)
    //         console.log('getPatientRoleString returned: ', dataPatientRole)
    //     }catch(err){
    //         console.error("contract call failure", err);
    //     }
    // }

    //     console.log('patient address just outside of getPatientRoleString() is:', wallet_address)
    // getPatientRoleString();

    // const { mutateAsync: addPatient } = useContractWrite(contract, "addPatient")

    // const addPatientRole = async (e) => {
    //     e.preventDefault();
    //   try {
    //     const data = await addPatient({ args: [wallet_address] });
    //         console.info("contract call successs", data);
    //         // setPatientRole(data) receipt.events[0].args.tokenId;
    //         console.log("Target Receipt Transaction:", data.receipt.events[0].getTransaction)
    //         console.log("Target Receipt Status:", data.receipt.status)
    //         // setPatientRole("Patient Role Assigned")
        
    //     getPatientRoleString();

    //   } catch (err) {
    //     console.error("contract call failure", err);
    //   }
    // }

    // const removePatientRole = async (e) => {
    //     e.preventDefault()
    //     try{
    //         const dataRemovePatient = await contract.call("removePatient", [wallet_address]);
    //         console.log('getPatientRoleString returned: ', dataRemovePatient)
            
    //         getPatientRoleString();
    //     }catch(err){
    //         console.error("contract call failure", err);
    //     }
    // }
  


      // const loadUsers = async (id) => {  //id was not being passed in when passed in as a parameter (14:45) pt 4.
      const loadDoctors = async () => {
          // console.log('ID check inside loadUsers', id) 
          setDoctor({doctor_name: "", doctor_dea: "", doctor_wallet_address: "", doctor_npi:"", id:"", doctor_phone:"", doctor_fax:""});
          const result = await axios.get("https://rxminter.com/php-react/edit-doctor.php?id="+doctor_id);
          console.log(result);
          // setPatient(result.data.records);
          setDoctor(result.data);
          // navigate('/');
      }




    const handleKeyDown = (event) => {
      if (event.keyCode === 13){
        event.preventDefault();
      }
    }
    

  return (

   <> 
        <form onSubmit={e => updateForm(e)}>
              <div className="nft_box_size">
                        <div className="row">
                            <div className="col-md-12 text-center">
                                <h1>Edit Doctor: <br></br> {doctor_name} </h1> 
                                {/* <h5>Solidity Phone Number: {solidityPhoneNumber}</h5>    */}
                                {/* <h5>Web Phone Number is: {webPhoneNumber}</h5>                              */}
                            </div>
                        </div>

                <div className="box_size_patient">
                        <div className="row" >
                                <div className="col-md-3">Doctor Name:</div>
                                <div className="col-md-9">
                                    <input type="text" name="doctor_name" className="form-control" value={doctor_name} onChange={(e) => handleChange(e)} required />   
                                </div>
                        </div>



                            <div className="row">
                                    <div className="col-md-2">Wallet:</div>
                                    <div className="col-md-10">
                                        <textarea name="doctor_wallet_address" className="form-control" value={doctor_wallet_address} onChange={(e) => handleChange(e)} onKeyDown={handleKeyDown} rows="2" required />   
                                    </div>
                            </div>

                            <div className="row" >
                                <div className="col-md-3">DEA #:</div>
                                <div className="col-md-9">
                                    <input type="text" name="doctor_dea" className="form-control" value={doctor_dea} onChange={(e) => handleChange(e)} required />   
                                </div>
                            </div>

                            <div className="row" >
                                    <div className="col-md-3">NPI #:</div>
                                    <div className="col-md-9">
                                        <input type="text" name="doctor_npi" className="form-control" value={doctor_npi} onChange={(e) => handleChange(e)} required />   
                                    </div>
                            </div>

                            <div className="row">
                                    <div className="col-md-3">Phone:</div>
                                    <div className="col-md-9">
                                        <input type="text" name="doctor_phone" className="form-control" value={doctor_phone} onChange={(e) => handlePhoneChange(e)} required maxLength={12} />   
                                    </div>
                            </div>



 
                       {/*     <div className="row">
                                    <div className="col-md-3">Address:</div>
                                    <div className="col-md-9">
                                        <textarea name="pt_physical_address" className="form-control" value={pt_physical_address} onChange={(e) => handleChange(e)} 
                                        onKeyDown={handleKeyDown} rows="2" required />   
                                    </div>
                            </div>                */}

                        
                            <div className="row">
                                <div className="col-md-12 text-center">
                                    {/* <input type="submit" name="submit" value="Add Patient" className="btn btn-warning" /> */}
                                    {/* <button type="submit" className="btn btn-warning" >Save Changes</button> */}
                                    <button type="submit" className="btn btn-warning btn-lg btn-block container" style={{borderRadius:"12px"}} > Save Changes</button>

                                </div>
                            </div>
                    </div>
                </div>
        </form>


    <hr></hr>



    
</>

  )
}
export default EditDoctor
import "../styles/App.css";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { addyShortner, formatDateFourDigitYear, formatDateTwoDigitYear, formatDateTwoDigit, 
    convertBigNumberToTwoDigitYear, convertBigNumberToFourDigitYear } from '../utils'

import "../styles/App.css";

const AddPatient = () => {
// export default function AddPatient() {

    let navigate = useNavigate(); 

// Add state (8:06): https://www.youtube.com/watch?v=Ovr1ewUIrpU&t
    const [patient, setPatient] = useState({
        name: "",
        wallet_address: "",
        email:"",
        dob:"",
        pt_physical_address:"",
        pt_phone:""
    });

    // const [name,wallet_address,email] = patient; // patient is not iterable nasty error
    const {name,wallet_address,email,dob,pt_physical_address,pt_phone} = patient; 

    const handleChange=(e)=>{
        setPatient({...patient,[e.target.name]: e.target.value })
        // console.log(e);
        console.log(patient);
    }


    const handlePhoneChange=(e)=>{
        // console.log(e);
        const input = e.target.value;
        // Remove all non-digit characters from the input
        const digitsOnly = input.replace(/\D/g, '');

        // Apply the desired formatting using regular expressions
        const formattedNumber = digitsOnly.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
        
//For testing, if given user version (716-123-4567) return raw number without dashes (7161234567)
        // const rawNumber = `${formattedNumber.replace(/-/g, '')}`;

//For testing, if given rawNumber (7161234567) return user version (716-123-4567):
        // const webNumber = rawNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'); // Add dashes


        setPatient({...patient,[e.target.name]: formattedNumber })

        console.log("pt_phone in handlePhoneChange with formattedNumber: ",patient.pt_phone);
        console.log("pharmacy Object in handlePhoneChange: ",patient);
}



    const submitForm = async (e) => {
        e.preventDefault(); 

        console.log(patient);

        // https://rxminter.com/php-react/phpmysql-student-crud/insert.php
        await axios.post("https://rxminter.com/php-react/insert.php", patient).then((result)=>{
            console.log(result);

            // navigate('/');
            if(result.data.status =='valid'){
                alert(`Success! Patient ${patient.name} with phone number${patient.pt_phone}, home address of ${patient.pt_physical_address} and wallet address of ${addyShortner(patient.wallet_address)} has been added!`)
                navigate('/');
            }else{
                alert('There is a problem saving this patient to the database. Please try again.');
            }
        });

    }

    const handleKeyDown = (event) => {
        if (event.keyCode === 13) {
          event.preventDefault();
        }
      }

  return (
<>
<div className="container-fluid">
        <div className="row">
            <div className="col-md-12 text-center">
                <h1>Add Patient</h1>
                        
            </div>
        </div>

    <form onSubmit={e => submitForm(e)}>
        <div className="nft_box_size">

                    <div className="box_size_new_form">
                            <div className="row">
                                    <div className="col-md-3">Patient Name:</div>
                                    <div className="col-md-9">
                                        <input type="text" name="name" className="form-control" value={name} onChange={(e) => handleChange(e)} required />   
                                    </div>
                            </div>

                            <div className="row">
                                    <div className="col-md-3">DOB:</div>
                                    <div className="col-md-4 float-left">
                                      {/* <input type="text" name="email" className="form-control" value={email} onChange={(e) => handleChange(e)} />
                                      <input type="date" name="dob" className="form-control" value="1969-06-09" onChange={(e) => handleChange(e)} /> */}
                                        <input type="date" name="dob" className="form-control" value={dob} onChange={(e) => handleChange(e)} required />   
                                    </div>
                            </div>

                            {/* <div className="row">
                                    <div className="col-md-6">Patient Name:</div>
                                    <select className="form-select" aria-label="Default select example" name="name" value={name} onChange={e => handleChange(e)}>
                                        <option selected>Open this select menu</option>
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                    </select>
                            </div> */}

                            <div className="row">
                                    <div className="col-md-3">Wallet Address:</div>
                                    <div className="col-md-9">
                                        <input type="text" name="wallet_address" className="form-control" value={wallet_address} onChange={(e) => handleChange(e)} required />   
                                    </div>
                            </div>

                            <div className="row">
                                    <div className="col-md-3">Phone:</div>
                                    <div className="col-md-9">
                                        <input type="text" name="pt_phone" className="form-control" value={pt_phone} onChange={(e) => handlePhoneChange(e)} 
                                        required maxLength={12} />   
                                    </div>
                            </div>

                            <div className="row">
                                    <div className="col-md-3">Email: <i>(Optional)</i></div>
                                    <div className="col-md-9">
                                        <input type="text" name="email" className="form-control" value={email} onChange={(e) => handleChange(e)} />   
                                    </div>
                            </div>

                            <div className="row">
                                    <div className="col-md-3">Physical Address</div>
                                    <div className="col-md-9">
                                    <textarea name="pt_physical_address" className="form-control" value={pt_physical_address}
                                     onChange={(e) => handleChange(e)} rows="2" onKeyDown={handleKeyDown} required />                                          
                                    </div>
                            </div>


                        
                            <div className="row">
                                <div className="col-md-12">
                                    {/* <input type="submit" name="submit" value="Add Patient" className="btn btn-warning" /> */}
                                    <button type="submit" className="btn btn-warning btn-lg btn-block container" style={{borderRadius:"12px"}} >Add Patient</button>

                                </div>
                            </div>
                    </div>
            </div>
        </form>
    </div>                       
    </>
  )
}
export default AddPatient
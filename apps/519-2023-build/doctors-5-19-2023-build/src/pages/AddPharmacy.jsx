import "../styles/App.css";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import "../styles/App.css";

const AddPharmacy = () => {
// export default function AddPatient() {

    let navigate = useNavigate(); 

// Add state (8:06): https://www.youtube.com/watch?v=Ovr1ewUIrpU&t
    const [pharmacy, setPharmacy] = useState({
        pharmacy_name: "",
        pharmacy_wallet: "",
        pharmacy_phone:"",
        pharmacy_fax:"",
        pharmacy_physical_address:""
    });

    // const [name,wallet_address,email] = patient; // patient is not iterable nasty error
    const {pharmacy_name,pharmacy_wallet,pharmacy_phone,pharmacy_fax,pharmacy_physical_address} = pharmacy; 

    const handleChange=(e)=>{
        setPharmacy({...pharmacy,[e.target.name]: e.target.value })
        // console.log(e);
        console.log(pharmacy);
    }

    const submitForm = async (e) => {
        e.preventDefault(); 

        console.log(pharmacy);

        // https://rxminter.com/php-react/phpmysql-student-crud/insert.php
        await axios.post("https://rxminter.com/php-react/insert-pharmacy.php", pharmacy).then((result)=>{
            console.log(result);

            // navigate('/');
            if(result.data.status =='valid'){
                alert(`Success! Pharmacy/Facility ${pharmacy.pharmacy_name} with Fax Number ${pharmacy.pharmacy_fax} and wallet address ${pharmacy.pharmacy_wallet} has been Added!`)
                navigate('/pharmacy-list');
            }else{
                alert('There is a problem saving this pharmacy to the database. Please try again.');
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
                <h1>Add A Pharmacy or Facility</h1>
                        
            </div>
        </div>

        <form onSubmit={e => submitForm(e)}>
        {/* <form onSubmit={submitForm}> */}
                    <div className="box_size_new_form">
                            <div className="row">
                                    <div className="col-md-3">Facility Name:</div>
                                    <div className="col-md-9">
                                        <input type="text" name="pharmacy_name" className="form-control" value={pharmacy_name} onChange={(e) => handleChange(e)} required />   
                                    </div>
                            </div>

                            {/* <div className="row">
                                    <div className="col-md-3">DOB:</div>
                                    <div className="col-md-4 float-left">
                                        <input type="date" name="dob" className="form-control" value={dob} onChange={(e) => handleChange(e)} />   
                                    </div>
                            </div> */}

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
                                    <div className="col-md-3">Facility Wallet:</div>
                                    <div className="col-md-9">
                                        <input type="text" name="pharmacy_wallet" className="form-control" value={pharmacy_wallet} onChange={(e) => handleChange(e)} required />   
                                    </div>
                            </div>

                            <div className="row">
                                    <div className="col-md-3">Phone:</div>
                                    <div className="col-md-9">
                                        <input type="text" name="pharmacy_phone" className="form-control" value={pharmacy_phone} onChange={(e) => handleChange(e)} required />   
                                    </div>
                            </div>

                            <div className="row">
                                    <div className="col-md-3">Fax:</div>
                                    <div className="col-md-9">
                                        <input type="text" name="pharmacy_fax" className="form-control" value={pharmacy_fax} onChange={(e) => handleChange(e)} required/>   
                                    </div>
                            </div>

                            <div className="row">
                                    <div className="col-md-3">Facility Address:</div>
                                    <div className="col-md-9">
                                    <textarea name="pharmacy_physical_address" className="form-control" value={pharmacy_physical_address}
                                     onChange={(e) => handleChange(e)} rows="2" onKeyDown={handleKeyDown} required />                                          
                                    </div>
                            </div>


                        
                            <div className="row">
                                <div className="col-md-12">
                                    {/* <input type="submit" name="submit" value="Add Patient" className="btn btn-warning" /> */}
                                    <button type="submit" className="btn btn-warning btn-lg btn-block container" style={{borderRadius:"12px"}} >Add Pharmacy/Facility</button>

                                </div>
                            </div>
                    </div>
        </form>
    </div>                       
    </>
  )
}
export default AddPharmacy
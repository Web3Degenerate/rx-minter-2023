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

//Pharmacy Phone Number Handler -- 
    const [solidityPhoneNumber, setSolidityPhoneNumber] = useState('')
    const [webPhoneNumber,setWebPhoneNumber] = useState('')

    const handlePhoneChange=(e)=>{
            // console.log(e);
            const input = e.target.value;
            // Remove all non-digit characters from the input
            const digitsOnly = input.replace(/\D/g, '');

            // Apply the desired formatting using regular expressions
            const formattedNumber = digitsOnly.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');

        //For testing, return version with just digits and remove the dash: 
                        const rawNumber = `${formattedNumber.replace(/-/g, '')}`;
                        setSolidityPhoneNumber(rawNumber)

                        const webNumber = rawNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'); // Add dashes
                                        
                        setWebPhoneNumber(webNumber)



            setPharmacy({...pharmacy,[e.target.name]: formattedNumber })

            console.log("Phone in handlePhoneChange with formattedNumber: ",pharmacy.pharmacy_phone);
            console.log("pharmacy Object in handlePhoneChange: ",pharmacy);
    }

// Pharmacy FAX 

        const [solidityFaxNumber, setSolidityFaxNumber] = useState('')
        const [webFaxNumber,setWebFaxNumber] = useState('')

    const handleFaxChange=(e)=>{
            // console.log(e);
            const input = e.target.value;
            // Remove all non-digit characters from the input
            const digitsOnly = input.replace(/\D/g, '');

            // Apply the desired formatting using regular expressions
            const formattedFax = digitsOnly.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');

                    //Just for testing:
                            const rawFax = `1${formattedFax.replace(/-/g, '')}`;
                            setSolidityFaxNumber(rawFax)

                            const webFax = rawFax.replace(/^1/, '') // Remove leading '1'
                                            .replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'); // Add dashes

                            setWebFaxNumber(webFax)

            // const formattedFax = formatPhoneNumber(input);

            setPharmacy({...pharmacy,[e.target.name]: formattedFax })

            console.log("Phone in handleFaxChange with formattedFax: ",pharmacy.pharmacy_fax);
            console.log("Pharmacy Object in handlePhoneChange: ",pharmacy);
    }

    const [errorMessage, setErrorMessage ] = useState('')


 //Original Indian Version: 
    // const submitForm = async (e) => {
    //     e.preventDefault(); 

    //     console.log(pharmacy);

    //         try {
    //                 await axios.post("https://rxminter.com/php-react/insert-pharmacy.php", pharmacy).then((result)=>{       
    //                         console.log(result);
    //                         if(result.data.status =='valid'){
    //                             alert(`Success! Pharmacy/Facility ${pharmacy.pharmacy_name} with Fax Number ${pharmacy.pharmacy_fax} and wallet address ${pharmacy.pharmacy_wallet} has been Added!`)
    //                             navigate('/pharmacy-list');
    //                         }else{
    //                             alert('There is a problem saving this pharmacy to the database. Please try again.');
    //                         }
    //                 });

    //         } catch (error) {
    //             console.log('Try Catch Block Error in submitForm when trying to save new pharmacy/facility was: ',error)
    //             setErrorMessage(error)
    //         }

    // }


// Chat GPT
const submitForm = async (e) => {
    e.preventDefault();
    console.log(pharmacy);
  
    try {
      const result = await axios.post("https://rxminter.com/php-react/insert-pharmacy-chatgpt.php", pharmacy);
  
      console.log(result.data);
      if (result.data.status === 'valid') {
        alert(`Success! Pharmacy/Facility ${pharmacy.pharmacy_name} with Fax Number ${pharmacy.pharmacy_fax} has been Added!`)
        navigate('/pharmacy-list');
      } else if (result.data.status === 'invalid' && result.data.message) {
        setErrorMessage(result.data.message); // Display the error message from the server
      } else {
        setErrorMessage('There is a problem saving this pharmacy to the database. Please try again.');
      }
    } catch (error) {
      console.log('Try Catch Error in submitForm when trying to save new pharmacy/facility was: ', error);
    }
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

            {errorMessage && (
                <div>
                <h5 className="display-5" style={{color:"red"}}>Error: {errorMessage}</h5>
                </div>
            )}


                <h1>Add A Pharmacy or Facility</h1>
                {/* <h5>Phone: {solidityPhoneNumber} Web Phone: {webPhoneNumber}</h5>  */}
                {/* <h5>Fax: {solidityFaxNumber} Web Fax: {webFaxNumber}</h5>  */}
                        
            </div>
        </div>

    <form onSubmit={e => submitForm(e)}>
        <div className="nft_box_size">
                    <div className="box_size_new_form">
                            <div className="row">
                                    <div className="col-md-3">Facility Name:
                                    <br></br>
                                    <i style={{color:"red"}}>required</i>
                                    </div>
                                    <div className="col-md-9">
                                        <input type="text" name="pharmacy_name" className="form-control" value={pharmacy_name} onChange={(e) => handleChange(e)} 
                                        required />   
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
                                    <div className="col-md-3">Facility Wallet:
                                    <br></br>
                                    <i style={{color:"gray"}}>optional</i>
                                    </div>
                                    <div className="col-md-9">
                                        <input type="text" name="pharmacy_wallet" className="form-control" value={pharmacy_wallet} onChange={(e) => handleChange(e)}
                                         />   
                                    </div>
                            </div>

                            <div className="row">
                                    <div className="col-md-3">Phone:
                                    <br></br>
                                    <i style={{color:"gray"}}>optional</i>
                                    </div>
                                    <div className="col-md-9">
                                        <input type="text" name="pharmacy_phone" className="form-control" value={pharmacy_phone} onChange={(e) => handlePhoneChange(e)} 
                                        maxLength={12}  />   
                                    </div>
                            </div>

                            <div className="row">
                                    <div className="col-md-3">Fax:
                                    <br></br>
                                    <i style={{color:"red"}}>required</i>
                                    </div>
                                    <div className="col-md-9">
                                        <input type="text" name="pharmacy_fax" className="form-control" value={pharmacy_fax} onChange={(e) => handleFaxChange(e)} 
                                        required maxLength={12}  />   
                                    </div>
                            </div>

                            <div className="row">
                                    <div className="col-md-3">Address:
                                    <br></br>
                                    <i style={{color:"gray"}}>optional</i>
                                    </div>
                                    <div className="col-md-9">
                                    <textarea name="pharmacy_physical_address" className="form-control" value={pharmacy_physical_address}
                                     onChange={(e) => handleChange(e)} rows="2" onKeyDown={handleKeyDown}  />                                          
                                    </div>
                            </div>


                        
                            <div className="row">
                                <div className="col-md-12">
                                    {/* <input type="submit" name="submit" value="Add Patient" className="btn btn-warning" /> */}
                                    <button type="submit" className="btn btn-warning btn-lg btn-block container" style={{borderRadius:"12px"}} >Add Pharmacy/Facility</button>

                                </div>
                            </div>
                    </div>
            </div>
        </form>
</div>                       
</>
  )
}
export default AddPharmacy
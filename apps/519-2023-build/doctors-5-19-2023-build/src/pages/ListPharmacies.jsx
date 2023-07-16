import React, { useState, useEffect } from "react"; 
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.css';
import "../styles/App.css";

const ListPharmacies = () => {
// export default function Home() {

    let navigate = useNavigate();

    
    const [pharmacy, setPharmacy] = useState([]);
    
    useEffect(()=> {    
        loadViewPharmacy(); 
    }, [])

    const loadViewPharmacy = async () => {
        setPharmacy([]);   
        const result = await axios.get("https://rxminter.com/php-react/view-pharmacy.php");
        console.log(result);
        setPharmacy(result.data.records);
        // navigate('/');
    }    


//from: https://www.youtube.com/watch?v=xAqCEBFGdYk
    const [search, setSearch] = useState('');
    // console.log(search);

  return (
    <>
    {/* <main className="white-container"> */}
        
        <div className="row">
            <div className="col-md-12 text-center">
                <h1>Pharmacy Dashboard</h1>
            </div>
        </div>

        <div className="row">
                <div className="col-md-2">
                </div>

                <div className="col-md-8 text-center">
                    <Link to="/add-pharmacy" className="btn btn-primary btn-lg btn-block container" style={{borderRadius:"12px"}}>
                        Add A Pharmacy or Facility
                    </Link>
                </div>
        </div>

        
        <div className="row">
            <div className="col-md-12 text-center">
                <div className="input-group mb-3">
                    <input type="search" className="form-control" placeholder="Search For Pharmacy" aria-label="Recipient's username" aria-describedby="basic-addon2"
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
                    <th className="text-center">Pharmacy / Facility </th>

                    <th className="text-center">Fax Number</th>
                    
                    <th className="text-center">Wallet Address</th>
            
                    {/* <th>Scripts</th> */}
                    
                    <th className="align-middle text-center">Edit</th>

                    {/* <th>Delete</th> */}
                </tr> 
            </thead>
            <tbody className="table-striped">
             {/* <tr key={`${index}`}> */}

            {pharmacy.filter((pharmacy) => {
               return search.toLowerCase() === '' ? pharmacy : pharmacy.pharmacy_name.toLowerCase().includes(search) 
               || pharmacy.pharmacy_wallet.toLowerCase().includes(search)
               || pharmacy.pharmacy_fax.includes(search)

            }

            ).map((pharmacy, index) => (
                    <tr key={`${index}`}>
                        <td style={{display: "none"}}>{index+1}</td>

                        <td className="align-middle text-center">{pharmacy.pharmacy_name}</td>

                        <td className="text-center">{pharmacy.pharmacy_fax}</td>
                        
                        <td className="text-center">{pharmacy.pharmacy_wallet.slice(0,5)}...{pharmacy.pharmacy_wallet.slice(37)}</td>


                        <td className="text-center"><Link className="btn btn-warning" to={`/edit-pharmacy/${pharmacy.id}`}>Edit Pharmacy Info</Link></td>

                    </tr>
                ))}
            </tbody>
        </table>

    
    </>
  )
}
export default ListPharmacies
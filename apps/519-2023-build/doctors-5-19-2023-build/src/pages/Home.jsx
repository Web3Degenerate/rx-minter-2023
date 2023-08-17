    import React, { useState, useEffect } from "react";
    import axios from 'axios';
    import { Link, useNavigate } from "react-router-dom";

    import 'bootstrap/dist/css/bootstrap.css';
    import "../styles/App.css";

    import { useAddress, useContract, ConnectWallet } from "@thirdweb-dev/react";
        //removed: useOwnedNFTs, ThirdwebNftMedia, Web3Button, useTransferNFT, MediaRenderer, useMetadata

    import { solidityContractAddress } from '../constants'

    import { addyShortner, formatDateFourDigitYear, formatDateTwoDigitYear, formatDateTwoDigit, 
      convertNumberDateToRawString, convertNumberDateToFourDigitString, convertNumberDateToTwoDigitString,
      convertBigNumberToFourDigitYear, convertBigNumberToTwoDigitYear } from '../utils'

    import { GuestLogin } from '../components'
    
const Home = () => {
// export default function Home() {


//*************************************************************************************** */
  const { contract } = useContract(solidityContractAddress);
 
  const address = useAddress(); 


//******************************************************************************************* */
    let navigate = useNavigate();

    const [patient, setPatient] = useState([]);
        
    useEffect(()=> {    
        loadUsers();     
    }, [])
 
    const loadUsers = async () => {
        setPatient([]);   
        const result = await axios.get("https://rxminter.com/php-react/view.php");
        console.log(result);
        setPatient(result.data.records);
        navigate('/');
    }

    const deleteUser = (id) => {
        axios.delete("https://rxminter.com/php-react/delete.php", { data: { id: id} }).then((result)=>{ 
            // window.location.reload(true);
            loadUsers();
            // navigate('/');
        }).catch(() => {
            alert('Error, unable to delete patient');
        });
    }

//from: https://www.youtube.com/watch?v=xAqCEBFGdYk
    const [search, setSearch] = useState('');



  return (
      <>

      {address ? (
          <>
                        
              
              <div className="row">
                  <div className="col-md-12 text-center">
                      <h1>Patient Population Dashboard</h1>
                  </div>
              </div>


                <div className="row">
                    <div className="col-md-2">
                    </div>

                    <div className="col-md-8 text-center">
                        <Link to="/add-patient" className="btn btn-primary btn-lg btn-block container" style={{borderRadius:"12px"}}
                        >Add A Patient</Link>
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
                          <th>Patient</th>
                          
                          <th>Wallet Address</th>
                          
                          <th>Imaging Orders</th>

                          <th>Write Scripts</th>
                          
                          <th>Edit</th>

                          {/* <th>Delete</th> */}
                      </tr> 
                  </thead>
                  <tbody className="table-striped">
                  {/* <tr key={`${index}`}> */}

                  {patient?.filter((patient) => {
                    return search.toLowerCase() === '' ? patient : patient.name.toLowerCase().includes(search) || patient.wallet_address.toLowerCase().includes(search)
                  }

                  ).map((patient, index) => (
                          <tr key={`${index}`}>
                              <td style={{display: "none"}}>{index+1}</td>

                              <td><Link className="btn btn-outline-light"  to={`/patient-history/${patient.id}`}>{patient.name}</Link></td>
                              
                              <td>{patient.wallet_address.slice(0,5)}...{patient.wallet_address.slice(37)}</td>

                              <td><Link className="btn btn-primary" to={`/mint-imaging-order/${patient.id}`}>Imaging</Link></td>

                              <td><Link className="btn btn-primary" to={`/mint-script/${patient.id}`}>Prescriptions</Link></td>

                              <td><Link className="btn btn-warning" to={`/edit-patient/${patient.id}`}>Edit</Link></td>

                              {/* <td><Link className="btn btn-danger" to="" onClick={() => deleteUser(patient.id)}>Delete</Link></td> */}
                          </tr>
                      ))}
                  </tbody>
              </table>
          </>
              ) : (
                    <GuestLogin />
              )}

          {/* </div> */}
          
      </>

  )
}
export default Home
import React from 'react'
import {Link, NavLink } from "react-router-dom";

import { useAddress, useContract, ConnectWallet } from "@thirdweb-dev/react";

import { logoPalau, logoDoctorPc } from '../assets';

import "../styles/App.css";

import 'bootstrap/dist/css/bootstrap.css';

const Navbar = () => {

  const address = useAddress(); 

  const addyShortner = (address) => {
    let tempAddy = String(address);
      // String(address).substring(0, 6) + "..." + String(address).substring(address.length - 4);
      const tinyAddy = tempAddy.substring(0, 6) + "..." + tempAddy.substring(37)
      return tinyAddy;
   }

  return (
    // <nav class="navbar navbar-expand-lg bg-light">
    // <nav class="navbar navbar-expand-lg bg-primary">
    // <nav class="navbar navbar-expand-lg navbar-light bg-light">
    //     <div class="container-fluid">
    //         <a class="navbar-brand" href="#">Navbar</a>
    //         <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
    //         {/* <button class="navbar-toggler" type="button" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation"> */}
    //         <span class="navbar-toggler-icon"></span>
    //         </button>
    //         <div class="collapse navbar-collapse" id="navbarNav">
    //         {/* <div id="navbarNav"> */}
    //         <ul class="navbar-nav">
    //             <li class="nav-item">
    //                 <Link class="nav-link" to="/">Home</Link>
    //               {/* <a class="nav-link active" aria-current="page" href="#">Home</a> */}
    //             </li>
    //             <li class="nav-item">
    //               <Link class="nav-link" to="/add-patient">Add Patient</Link>
    //             </li>
    //             <li class="nav-item">
    //               <Link class="nav-link" to="/edit-patient/:id">Edit Patient</Link>
    //             </li>
    //             <li class="nav-item">
    //             <a class="nav-link disabled">Disabled</a>
    //             </li>
    //         </ul>
    //         </div>
    //     </div>
    // </nav> 
  //Light top
    // <nav className="navbar sticky-top navbar-light bg-light">
        // <div className="container-fluid">
        // <Link className="nav-brand" to="/">Home</Link>
        //  <Link className="nav-link" to="/add-script">Write Rx</Link>

      

<nav className="navbar sticky-top navbar-expand-lg navbar-dark bg-dark">
  <div className="container">
    {/* <a class="navbar-brand" href="#">Sticky top</a> 
        Took out /add-script route from the old direct access to teh form
    */}
    {/* <ul className="navbar-nav mr-auto mt-2 mt-lg-0"> */}

   {address ? ( 
    <>
        <ul className="nav navbar-nav">
        <li className="nav-item" style={{margin:"5px"}}>
        <Link className="navbar-brand" to="/edit-doctor">
            <img src={logoDoctorPc} width="100" height="100" className="d-inline-block align-top image--doctor--navbar" alt=""></img>
            <br></br>
            <small style={{marginTop:"-50px",paddingTop:"-30px"}}>Profile</small>
          </Link>
          </li>

          <li className="nav-item" style={{margin:"5px"}}>
                <Link className="navbar-brand btn btn-success" to="/">Patient Dashboard</Link>
            </li>

              {/* <li className="nav-item" style={{margin:"5px"}}>
                <Link className="navbar-brand btn btn-primary" to="/edit-patient">Edit Patient</Link>
              </li> */}

            {/* <li className="nav-item">
              <Link className="navbar-brand btn btn-primary" to="/edit-patient/:id">Edit Patient</Link>
              </li> */}
          <li className="nav-item" style={{margin:"5px"}}>
              <Link className="navbar-brand btn btn-primary" to="/pharmacy-list">Facility Dashboard</Link>
          </li>

          {/* <li className="nav-item" style={{margin:"5px"}}>
              <Link className="navbar-brand btn btn-primary" to="/pharmacy-dashboard">Pharmacy View</Link>
          </li> */}

          
        </ul>
            <div className="nav-item text-right" style={{margin:"5px"}}>
                {/* <ConnectWallet dropdownPosition={{ align: 'right', btnTitle: 'Connect To Rx Minter' }} /> */}
                                    
                  {/* <Link className="navbar-brand btn btn-secondary" to="/view-script"> {addyShortner(address)} </Link> */}
                  {/* <button className="navbar-brand btn btn-secondary"> {addyShortner(address)} </button> */}
                  <ConnectWallet dropdownPosition={{
                      align: 'center',
                      side: 'bottom'
                  }} />

            </div>
</>
        ) : (
          <>
              <ul className="nav navbar-nav">
            
                
              </ul>
              <div className="nav-item text-right" style={{margin:"5px"}}>
                      <ConnectWallet dropdownPosition={{
                          align: 'center',
                          side: 'bottom'
                      }} />
                </div>
            </>

        )}
  </div>
</nav>

  )
}
export default Navbar
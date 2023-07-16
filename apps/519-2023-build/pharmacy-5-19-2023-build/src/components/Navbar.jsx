// import { resolveContractUriFromAddress } from "@thirdweb-dev/sdk";

// resolveContractUriFromAddress
import React from 'react'
import {Link, NavLink } from "react-router-dom";

import { useAddress, ConnectWallet } from "@thirdweb-dev/react";

import { addyShortner } from '../utils'

import { logoPalau } from '../assets'

import 'bootstrap/dist/css/bootstrap.css';

const Navbar = () => {

  const address = useAddress(); 



  return (
    <nav className="navbar sticky-top navbar-expand-lg navbar-dark bg-dark">
  <div className="container">

      {address ? (

          <Link className="navbar-brand" to="/">
            <img src={logoPalau} width="30" height="30" className="d-inline-block align-top image--cover--navbar" alt=""></img>
             Pharmacy Dashboard <small className="text-muted">({addyShortner(address)})</small>
          </Link>
     
      ):(
        <Link className="navbar-brand" to="/">
          <img src={logoPalau} width="30" height="30" className="d-inline-block align-top image--cover--navbar" alt=""></img>
          Rx Minter Pharmacy Portal Login 
        </Link>        
          
      )}

   
    {/* <ul className="navbar-nav mr-auto mt-2 mt-lg-0"> */}

   {address ? ( 
        <ul className="nav navbar-nav">

            <li className="nav-item" style={{margin:"5px"}}>
                {/* <Link className="navbar-brand btn btn-success" to="/">Patient Portal</Link> */}
                <ConnectWallet dropdownPosition={{
                                        align: 'center',
                                        side: 'bottom'
                                    }} />
            </li>

              {/* <li className="nav-item" style={{margin:"5px"}}>
                <Link className="navbar-brand btn btn-primary" to="/add-patient">Add Patient</Link>
              </li> */}

            {/* <li className="nav-item">
              <Link className="navbar-brand btn btn-primary" to="/edit-patient/:id">Edit Patient</Link>
              </li> */}

            {/* <li className="nav-item" style={{margin:"5px"}}>
              <Link className="navbar-brand btn btn-primary" to="/pharmacy-list">Edit Pharmacy</Link>
          </li> */}

            {/* <li className="nav-item" style={{margin:"5px"}}>
              <Link className="navbar-brand btn btn-primary" to="/view-script">Scripts For {addyShortner(address)} </Link>
            </li> */}

        </ul>
        ) : (
          <p>please connect su billete</p>
        )}
  </div>
</nav>

  )
}
export default Navbar
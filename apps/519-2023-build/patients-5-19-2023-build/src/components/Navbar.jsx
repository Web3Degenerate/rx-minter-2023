// import { resolveContractUriFromAddress } from "@thirdweb-dev/sdk";

// resolveContractUriFromAddress
import React from 'react'
import {Link, NavLink } from "react-router-dom";

import { useAddress } from "@thirdweb-dev/react";

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
    <nav className="navbar sticky-top navbar-expand-lg navbar-dark bg-dark">
  <div className="container">
    {/* <a class="navbar-brand" href="#">Sticky top</a> 
        Took out /add-script route from the old direct access to teh form
    */}
    {/* <ul className="navbar-nav mr-auto mt-2 mt-lg-0"> */}

   {address ? ( 
        <ul className="nav navbar-nav">

            <li className="nav-item" style={{margin:"5px"}}>
                <Link className="navbar-brand btn btn-success" to="/">Patient Portal</Link>
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
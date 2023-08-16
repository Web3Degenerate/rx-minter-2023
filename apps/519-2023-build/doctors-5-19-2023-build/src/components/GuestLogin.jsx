import { logoPalau } from '../assets'
import 'bootstrap/dist/css/bootstrap.css';
import "../styles/App.css";

import { ConnectWallet } from "@thirdweb-dev/react";

const GuestLogin = () => {
  return (
        <div className="login-wrapper">
          <div className="box_size_success text-center" style={{ background:"#D4EDDA" }}>
          <br></br>

                  <h2 className="display-6">Rx Minter Doctor Portal</h2>

                  {/* <img src="https://i.imgur.com/DJVCVvZ.png" className="image--cover" /> */}
                  <img src={logoPalau} className="image--cover" />

                  <h3 className="text-justify text-center" style={{color:"#74A27F"}}>
                      Click the <b>'Connect'</b> button below to Manage your Patients' NFT Scripts and Imaging Orders.                     
                  </h3>
                                          
                  <div className="connect text-center">
                          <ConnectWallet dropdownPosition={{
                              align: 'center',
                              side: 'bottom'
                          }} />
                  </div> 
                  


          

                  <hr></hr>
                  <b className="text-justify text-center" style={{color:"#74A27F"}}>
                      <a href={`https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en-US`} target="_blank">
                              Don't have a wallet? Click Here to Create a MetaMask Wallet!
                      </a>
                  </b>
                  <hr></hr>
          </div>
    </div>
  )
}
export default GuestLogin
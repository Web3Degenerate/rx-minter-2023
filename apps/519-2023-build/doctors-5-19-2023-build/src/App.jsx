import { Route, Routes } from 'react-router-dom'
import { Navbar } from './components';
import { CreateScript, CreateImagingOrder, EditPatient, Home, EditPharmacy, 
  PatientHistory, TokenHistory, DoctorFaxImagingOrder, ListPharmacies, AddPatient, AddPharmacy, EditDoctor, PatientFaxScript } from './pages';

import 'bootstrap/dist/css/bootstrap.min.css';



import { useAddress, useContract, ConnectWallet } from "@thirdweb-dev/react";

// import "./styles/Home.css";

export default function App() {
  return (
    <>
      <Navbar />
        <main className="container">
            
            <div>
     
                <Routes>
  
                {/* main app container */}
                    {/* <div className="jumbotron p-4">
                        <div className="container text-center"> */}
  
                              
                                <Route path="/" element={ <Home /> } />
  
                                {/* <Route path="/patient-list" element={ <ListPatients /> } /> */}
  
                                <Route path="/add-patient" element={ <AddPatient /> } />
                                <Route path="/edit-patient/:id" element={ <EditPatient /> } />

                                <Route path="/edit-doctor" element={ <EditDoctor /> } />
  
                                <Route path="/mint-script/:id" element={ <CreateScript /> } /> 
                                <Route path="/fax-prescription/:id" element={ <PatientFaxScript /> } />

                                <Route path="/mint-imaging-order/:id" element={ <CreateImagingOrder /> } />                                          
                                <Route path="/fax-imaging-order/:id" element={ <DoctorFaxImagingOrder /> } />

  
                                <Route path="/pharmacy-list" element={ <ListPharmacies /> } />
                                <Route path="/edit-pharmacy/:id" element={ <EditPharmacy /> } /> 
                                <Route path="/add-pharmacy" element={ <AddPharmacy /> } />

                                
                                <Route path="/patient-history/:id" element={ <PatientHistory /> } />
  
                                <Route path="/prescription-history/:id" element={ <TokenHistory /> } />

  
                </Routes>
            </div>
  
        </main>
  </>
  
    )
  }
  
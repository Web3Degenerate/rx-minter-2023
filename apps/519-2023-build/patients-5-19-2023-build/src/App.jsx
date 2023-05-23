import { ConnectWallet } from "@thirdweb-dev/react";
// import "./styles/Home.css";

import { Route, Routes } from 'react-router-dom'
import { Navbar } from './components';
import { PatientDashboard } from './pages';

import 'bootstrap/dist/css/bootstrap.min.css';


export default function Home() {
// export default function App() {
  return (

    <>
    <Navbar />
      <main className="container">
          
          <div>
   
              <Routes>

                              <Route path="/" element={ <PatientDashboard /> } />

                              {/* <Route path="/add-patient" element={ <AddPatient /> } /> */}

                              {/* <Route path="/edit-patient/:id" element={ <EditPatient /> } /> */}

                              {/* <Route path="/mint-script/:id" element={ <CreateScript /> } />  */}

                              {/* <Route path="/view-script" element={ <ViewScripts /> } />  */}

                              {/* <Route path="/pharmacy-list" element={ <ListPharmacies /> } /> */}

                              {/* <Route path="/edit-pharmacy/:id" element={ <EditPharmacy /> } /> */}

                              {/* <Route path="/pharmacy-review-nft/:id" element={ <PharmacyReview /> } /> */}

              </Routes>
          </div>

      </main>
</>

  );
}

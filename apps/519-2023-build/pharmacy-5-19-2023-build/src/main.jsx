// import React from "react";
import React, { Component } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ThirdwebProvider } from "@thirdweb-dev/react";
// import "./styles/globals.css";

import { BrowserRouter as Router } from 'react-router-dom';



// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
const activeChain = "mumbai";
// const fuckTurdWeb = "https:/ipfs-2.thirdwebcdn.com/ipfs";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <ThirdwebProvider activeChain={activeChain}>
        <Router>      
            <App />          
        </Router>
    </ThirdwebProvider>
  </React.StrictMode>
);

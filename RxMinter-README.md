# Thirdweb Rx Minter Contract

## App - Build dist folder with `npm run build --base=/client/`

## App - Update Version with `npm thirdweb install`

1. run `npx thirdweb@latest create --app`

2. Install Dependencies

- npm i react-router-dom

- npm i axios

- If installing [bootstrap on a Vite project follow this article]():

  - > npm i --save bootstrap @popperjs/core
    - > npm i --save-dev sass (_skip_)

- Install html2canvas and `react-html2canvas`

  - NOT npm i html2canvas
  - npm install html2canvas react-html2canvas (_per chatgpt_)

  - Seems like you need to have the svg wrapped in some container: https://stackoverflow.com/questions/65632240/uncaught-in-promise-unable-to-find-element-in-cloned-iframe-2460

# npm run build --base=/client/

## App Compile Error (doctors.rxminter.com on Fri 7/21/23) - public path issue

`npm run build --base=/client/`

**Source**: https://axellarsson.com/blog/expected-javascript-module-script-server-response-mimetype-text-html/
**Docs**: https://vitejs.dev/guide/build.html#public-base-path

---

## Updating SDK issue

### - On Fri 7/21/23, SF Jorge was unable to access his owned NFT on the patients.rxminter.com build but not doctors.rxminter.com

- Per the ThirdWeb **Discord**

`We've received reports from our community that Google Safe Browsing has flagged our IPFS gateway domains (thirdwebstorage.com) as potentially deceptive.`

`We recommend that you update the SDK to the latest version (@thirdweb-dev/sdk@3.10.29, @thirdweb-dev/react@3.14.9) by running npx thirdweb install in your project.`

Run **npx thirdweb install** in your project. (_Note from Devin on 7/10/23_)

---

## GuestLogin Component

- With Thirdweb's `ConnectWallet` and `useAddress` wrap all protected pages:

```js
import { ConnectWallet, useAddress } from "@thirdweb-dev/react"
import { GuestLogin } from "../components"

const address = useAddress()

return <>{address ? <>{/* Page JSX code */}</> : <GuestLogin />}</>
```

### Change Log (8/17/2023)

1. Doctors Build - **CreateScripts.jsx**

**Error** - Qty = 1. Days Supply = 15.

`contract call failure Error: underflow [ See: https://links.ethers.org/v5-errors-NUMERIC_FAULT-underflow ] (fault="underflow", operation="BigNumber.from", value=0.06666666666666667, code=NUMERIC_FAULT, version=bignumber/5.7.0)`

---

---

## Solidity Contracts:

1. install with

   - > npx thirdweb@latest create --contract

2. Install project dependencies:

- [React Router Dom](https://www.npmjs.com/package/react-router-dom)

  - > npm i react-router-dom

- [Axios](https://www.npmjs.com/package/axios)
  - > npm i axios

**message**

```js
Inside that directory, you can run several commands:

  yarn build
    Compiles your contracts and detects thirdweb extensions implemented on them.

  yarn deploy
    Deploys your contracts with the thirdweb deploy flow.

  yarn publish
    Publishes your contracts with the thirdweb publish flow.



```

2. x

## Solidity Compile Errors

`CompilerError: Stack too deep when compiling inline assembly: Variable value0 is 3 slot(s) too deep inside the stack.`

Reducing the size of the Scripts Struct from 15 down to 11 seemed to do the trick.
Based on [this Stack article suggesting to reduce the Struct size](https://ethereum.stackexchange.com/questions/144578/stack-too-deep-when-compiling-inline-assembly-variable-headstart)

```js
        Script memory _rx = Script({
            // patient_wallet = _patient_wallet
            patient_address: _patient_address,
            name: _name,
            description: _description,
            medication: _medication,
            dob: _dob,
            quantity: _quantity,
            quantityFilled: 0, // assume quantity filled always zero when script written.
            rxId: rx_tokenCounter,
            datePrescribed: _datePrescribed, // string datePrescribed;
            // dateRxStart: _dateRxStart, // uint256 dateRxStart;
            dateFilled: '', // string dateFilled;
            // dateRxEnd: 0, // uint256 dateRxEnd;
            dateNextFill: ''  // string dateNextFill (daysLeft);
            // dateRxNext: 0 // uint256 dateRxNext;

            // npi: _npi,
            // dea: _dea
        });

```

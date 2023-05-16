# Thirdweb Rx Minter Contract

1. install with

    - > npx thirdweb@latest create --contract

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
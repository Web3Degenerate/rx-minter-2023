// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC721Base.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
// import "@thirdweb-dev/contracts/extension/Permissions.sol";

// ** Version 11.8 **  //
contract RxNftMinter is ERC721Base {
    uint256 private rx_tokenCounter;

    constructor( 
        string memory _name,
        string memory _symbol,
        address _royaltyRecipient,
        uint128 _royaltyBps
    )
         ERC721Base(_name, _symbol, _royaltyRecipient, _royaltyBps)
    {
        rx_tokenCounter = 0;
        add(admins, msg.sender);
    }


    struct Script {
        address patient_address;
        string name;
        string description;
        string medication;
        string dob;
        uint256 quantity;
        uint256 quantityFilled;
        uint256 rxId;
        string datePrescribed;
        string dateFilled;
        string dateNextFill;
    }

    mapping(uint256 => Script) public scripts;

    Script[] allScripts;

// ***********v.11.7*************************************
    struct Receipt {
        string patient_wallet_string;
        uint256 rxId;
    }

    mapping(uint256 => Receipt) public receipts;

    Receipt[] allReceipts;
// ********************************************************

    event ScriptWritten (
        address indexed patient_wallet,
        string patient_name,
        string medication,
        uint256 quantity,
        uint256 quantityFilled,
        string datePrescribed,
        uint256 dateRxStart,
        uint256 indexed script_token_number
    );

    event ScriptSentToPt (
        address indexed patient_wallet,
        address indexed doctor_wallet,
        uint256 indexed script_token_number
    );



    event UpdateScriptQuantityAndDatesEvent(            
            uint256 quantity_prescribed,
            uint256 indexed quantity_filled,
            uint256 quantity_filled_today,
            uint256 quantity_unfilled,
            string date_filled,
            string next_available_fill_date,
            uint256 script_token_number,
            address indexed pharmacy_address,
            address indexed patient_address
        );


    event PatientTransferToPharmacy(
        address indexed patient_address,
        address indexed pharmacy_address,
        uint256 indexed script_token_number
    );

    event PharmacyTransferToPatient(
        address indexed pharmacy_address,
        address indexed patient_address,
        uint256 indexed script_token_number
    );


// ** Roles **
    struct Role {
        mapping(address => bool) bearer;
    }

    Role private patients;
    Role private pharmacies;
    Role private doctors;
    Role private admins;

    function add(Role storage _role, address _account) internal {
        require(!has(_role, _account), "Roles: Account already has this role");
        _role.bearer[_account] = true;
    }

    function remove(Role storage _role, address _account) internal {
        require(has(_role, _account), "Roles: Unable to remove because Account does NOT currently have this role");
        _role.bearer[_account] = false;
    }

//Check if account HAS Role:
    function has(
        Role storage _role,
        address _account
    ) internal view returns (bool) {
        require(_account != address(0), "Roles: Account is the zero address");
        return _role.bearer[_account];
    }


// ** Set Modifiers **
    modifier onlyPatient() {
        // require(patients.has(patients, address) == true, "Must have patient role.");
        require(has(patients, msg.sender) == true, "Must have patient role.");
        _;
    }

    modifier onlyPharmacy() {
        require(has(pharmacies, msg.sender) == true, "Must have Pharmacy role.");     
        _;
    }

    modifier onlyDoctor() {
        require(has(doctors, msg.sender) == true, "Must have Doctor role.");
        _;
    }

    modifier onlyAdmin() {
        require(has(admins, msg.sender) == true, "Must have Admin role.");
        _;
    }


    function addPatient(address _newPatient) external onlyAdmin {
        add(patients, _newPatient);
    }

    function addPharmacy(address _newPharmacy) external onlyAdmin {
        add(pharmacies, _newPharmacy);
    }

    function addDoctor(address _newDoctor) external onlyAdmin {
        add(doctors, _newDoctor);
    }

    function addAdmin(address _newAdmin) external onlyAdmin {
        add(admins, _newAdmin);
    }

// Remove Roles
    function removePatient(address _oldPatient) external onlyAdmin {
        remove(patients, _oldPatient);
    }

    function removePharmacy(address _oldPharmacy) external onlyAdmin {
        remove(pharmacies, _oldPharmacy);
    }

    function removeDoctor(address _oldDoctor) external onlyAdmin {
        remove(doctors, _oldDoctor);
    }



// Check Roles
    function hasRolePatient(address _potentialPatient) public view returns (bool) {
        return has(patients, _potentialPatient);
    }

    function hasRolePatientString(address _potentialPatient) public view returns (string memory) {
        if (has(patients, _potentialPatient) == true){
            return "Patient Role Assigned";
        }else{
            return "Patient Role NOT Assigned";
        }
    }

    function hasRolePharmacy(address _potentialPharmacy) public view returns (bool) {
        return has(pharmacies, _potentialPharmacy);
    }


    function hasRolePharmacyString(address _potentialPharmacy) public view returns (string memory) {
        if (has(pharmacies, _potentialPharmacy) == true){
            return "Pharmacy Role Assigned";
        }else{
            return "Pharmacy Role NOT Assigned";
        }
    }

    function hasRoleDoctor(address _potentialDoctor) public view returns (bool) {
        return has(doctors, _potentialDoctor);
    }


    function hasRoleDoctorString(address _potentialDoctor) public view returns (string memory) {
        if (has(doctors, _potentialDoctor) == true){
            return "Doctor Role Assigned";
        }else{
            return "Doctor Role NOT Assigned";
        }
    }

    function hasRoleAdmin(address _potentialAdmin) public view returns (bool) {
        return has(admins, _potentialAdmin);
    }

    function hasRoleAdminString(address _potentialAdmin) public view returns (string memory) {
        if (has(admins, _potentialAdmin) == true){
            return "Admin Role Assigned";
        }else{
            return "Admin Role NOT Assigned";
        }
    }



    function _createScript(
        string memory _patient_wallet_string,
        address _patient_address,
        string memory _name,
        string memory _description,
        string memory _medication,
        string memory _dob,
        // string memory _quantity,
        uint256 _quantity,
        // uint256 _quantityPrescribed,
            // string memory _npi,
            // string memory _dea
        string memory _datePrescribed,
        uint256 _dateRxStart
        // string memory _dateFilled,
        // uint256 _dateRxEnd,
        // string memory _dateNextFill,
        // uint256 _dateRxNext
    )
    public returns (uint256) {

        Script memory _rx = Script({
            // patient_wallet: _patient_wallet,
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
            dateFilled: 'N/A', // string dateFilled;
            // dateRxEnd: 0, // uint256 dateRxEnd;
            dateNextFill: 'N/A'  // string dateNextFill (daysLeft);
            // dateRxNext: 0 // uint256 dateRxNext;
            // dea: _dea
        });

        allScripts.push(_rx);

// ***** v11.7 ***************
        Receipt memory _receipt = Receipt({
            patient_wallet_string: _patient_wallet_string,
            rxId: rx_tokenCounter
        });

        allReceipts.push(_receipt);
// ***** v11.7 ***************

        
        emit ScriptWritten(
            //_patient_wallet, //address ("string")   
            _patient_address, //address ('string') declared as 'address' in _createScript
            _name, //string
            _medication, //string
            _quantity, //uint256
            0,  //quantityFilled uint256
            _datePrescribed, // string date
            _dateRxStart, // uint256 date
            rx_tokenCounter // uint256 tokenId
        );

        // _transfer(address(0), _rx.patient_wallet, _rx.rxId);
        // emit Transfer(address(0), _rx.patient_wallet, _rx.rxId);
        // mintRx(_rx.patient_wallet, _rx.rxId);
        // mintRx(_patient_address, rx_tokenCounter);

        return _rx.rxId;
    }



    function mintRx(address _to ) public { 
        _safeMint(_to, 1);

        emit ScriptSentToPt(
            _to,
            msg.sender,
            rx_tokenCounter
        );

        rx_tokenCounter += 1;
    }


    function transferPatientToPharmacy(address _from, address _to, uint256 tokenId) public {
        safeTransferFrom(_from, _to, tokenId);
        emit PatientTransferToPharmacy (
            _from,
            _to,
            tokenId 
        );
    }

    function transferPatientToPharmacyRoles(address _from, address _to, uint256 tokenId) public onlyPatient {
        safeTransferFrom(_from, _to, tokenId);
        emit PatientTransferToPharmacy (
            _from,
            _to,
            tokenId 
        );
    }

 
    function transferPharmacyToPatient(address _from, address _to, uint256 tokenId) public {
        safeTransferFrom(_from, _to, tokenId);
        emit PharmacyTransferToPatient (
            _from,
            _to,
            tokenId 
        );
    }   

    function transferPharmacyToPatientRoles(address _from, address _to, uint256 tokenId) public onlyPharmacy {
        safeTransferFrom(_from, _to, tokenId);
        emit PharmacyTransferToPatient (
            _from,
            _to,
            tokenId 
        );
    }     
    


    //*********************************************************************************************************** */

    function _baseURI() internal pure override returns (string memory) {
        return "data:application/json;base64,";
    }


    function tokenSVGImageURI(uint256 tokenId) public view returns (string memory) {

        string[7] memory parts;

        parts[0] = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: black; font-family: serif; font-size: 14px; }</style><rect width="100%" height="100%" fill="#E8F559" /><text x="10" y="20" class="base">';
                   
        // parts[1] = getPatientInfo(tokenId);
        parts[1] = getQuantityInfo(tokenId);        
       
        parts[2] = '</text><text x="10" y="40" class="base">';

        parts[3] = getMedicationInfo(tokenId);

        parts[4] = '</text><text x="10" y="60" class="base">';

        parts[5] = getDateInfo(tokenId);

        parts[6] = "</text></svg>";

        // string memory output = string(
        string memory output = string(
            abi.encodePacked(
                parts[0],
                parts[1],
                parts[2],
                parts[3],
                parts[4],
                parts[5],
                parts[6]
            )
        );

        return string(abi.encodePacked("data:image/svg+xml;base64,", Base64.encode(bytes(output))));                  
                                       
    }


    function jsonMetaDataOne(uint256 tokenId) public view returns (string memory) {
        string memory json_uno = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name":"',
                        getPatientName(tokenId),
                        '","description":"',
                        getSig(tokenId),
                        // '",',
                        '","medication":"',
                        getMedication(tokenId),
                        '","dob":"',
                        getDob(tokenId),
                        // '",',
                        '","quantity":"',
                        getQuantity(tokenId),
                        // '",',
                        '","quantityfilled":"',
                        getQuantityFilled(tokenId),
                        '","patientaddress":"',
                        getAddressString(tokenId)
                        // '","dateprescribed":"',
                        // getDatePrescribed(tokenId),
                        // '",',
                        // '", "image": "data:image/svg+xml;base64,',
                        // Base64.encode(bytes(output)),
                        // '", "image":"',
                        // tokenSVGImageURI(tokenId),
            // '"}'
                        // '",',
                        // '"attributes": [{"trait_type": "npi", "value": "01010101"},{"trait_type": "state", "value": "CA"},{"trait_type": "expiration", "value": "06/06/2023"}]}'
                        // '"attributes":',
                        // jsonAttributes,
                        // "}"
                    )
                )
            )
        );
        // return
        //    output = string(abi.encodePacked(_baseURI(),));
        
        // string memory output = string(abi.encodePacked("data:application/json;base64,", json));
            
        return json_uno;
    }





    function jsonMetaDataTwo(uint256 tokenId) public view returns (string memory) {
        string memory json_dos = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        // '{"name":"',
                        // getPatientName(tokenId),
                        '","dateprescribed":"',
                        getDatePrescribed(tokenId),
                        // '",',
                        '","datefilled":"',
                        getDateFilled(tokenId),
                        '","datenextfill":"',
                        getDateNextFill(tokenId),
                        // '",',
                        // '","quantity":"',
                        // getQuantity(tokenId),
                        // '",',
                        // '","quantityfilled":"',
                        // getQuantityFilled(tokenId),
                        // '","patientaddress":"',
                        // getAddressString(tokenId),
                        // '","dateprescribed":"',
                        // getDatePrescribed(tokenId),
                        // '",',
                        // '", "image": "data:image/svg+xml;base64,',
                        // Base64.encode(bytes(output)),
                        '", "image":"',
                        tokenSVGImageURI(tokenId),
                        '"}'
                        // '",',
                        // '"attributes": [{"trait_type": "npi", "value": "01010101"},{"trait_type": "state", "value": "CA"},{"trait_type": "expiration", "value": "06/06/2023"}]}'
                        // '"attributes":',
                        // jsonAttributes,
                        // "}"
                    )
                )
            )
        );
                // return
                //    output = string(abi.encodePacked(_baseURI(),));

        // string memory output = string(abi.encodePacked("data:application/json;base64,", json));
        // return output;
        return json_dos;
    }


// (5/23/23) - New tokenURI yolo attempt:
    function tokenURI(uint256 tokenId) public view override returns (string memory) {

        string memory json_one = jsonMetaDataOne(tokenId);
        string memory json_two = jsonMetaDataTwo(tokenId);

        string memory output = string(abi.encodePacked("data:application/json;base64,", json_one, json_two));
        // string memory output = string(abi.encodePacked(jsonMetaDataOne(tokenId), jsonMetaDataTwo(tokenId)));
            
        return output;
    }


// (5/23/23) - Last Working tokenURI function intact ***********************************************
    // function tokenURI(
    //     uint256 tokenId
    // ) public view override returns (string memory) {
       
    //     string memory json = Base64.encode(
    //         bytes(
    //             string(
    //                 abi.encodePacked(
    //                     '{"name":"',
    //                     getPatientName(tokenId),
    //                     '","description":"',
    //                     getSig(tokenId),
    //                     // '",',
    //                     // '","medication":"',
    //                     // getMedication(tokenId),
    //                     // '",',
    //                     '","quantity":"',
    //                     getQuantity(tokenId),
    //                     // '",',
    //                     '","quantityfilled":"',
    //                     getQuantityFilled(tokenId),
    //                     '","patientaddress":"',
    //                     getAddressString(tokenId),
    //                     '","dateprescribed":"',
    //                     getDatePrescribed(tokenId),
    //                     // '",',
    //                     // '", "image": "data:image/svg+xml;base64,',
    //                     // Base64.encode(bytes(output)),
    //                     '", "image":"',
    //                     tokenSVGImageURI(tokenId),
    //                     '"}'
    //                     // '",',
    //                     // '"attributes": [{"trait_type": "npi", "value": "01010101"},{"trait_type": "state", "value": "CA"},{"trait_type": "expiration", "value": "06/06/2023"}]}'
    //                     // '"attributes":',
    //                     // jsonAttributes,
    //                     // "}"
    //                 )
    //             )
    //         )
    //     );
    //         // return
    //         //    output = string(abi.encodePacked(_baseURI(),));
    //     string memory output = string(abi.encodePacked("data:application/json;base64,", json));
            
    //     return output;
    // } //end of tokenURI or generateSVG
// (5/23/23) - Last Working tokenURI function intact ***********************************************


    function updateScriptQuantityAndDates(uint256 tokenId, uint256 _pillsFilled, string memory _dateFilled, string memory _dateNextFill) public {
        Script storage rx = allScripts[tokenId];
        rx.quantityFilled += _pillsFilled;
        rx.dateFilled = _dateFilled;
        rx.dateNextFill = _dateNextFill;
        getQuantityInfo(tokenId);

        emit UpdateScriptQuantityAndDatesEvent(
            // toString(rx.quantityFilled += _pillsFilled), // 15 + 0 to string
            // string(abi.encodePacked("Total Filled: ", rx.quantityFilled, "/", rx.quantity)),
            rx.quantity,
            rx.quantityFilled,
            _pillsFilled,
            rx.quantity - rx.quantityFilled,
            _dateFilled,
            _dateNextFill,
            tokenId,
            msg.sender,
            rx.patient_address
            // rx.patient_wallet
        );
    }


    function updateScriptQuantityAndDatesRoles(uint256 tokenId, uint256 _pillsFilled, string memory _dateFilled, string memory _dateNextFill) 
        public onlyPharmacy {
            Script storage rx = allScripts[tokenId];
            require(rx.quantityFilled + _pillsFilled <= rx.quantity, "Pills Filled must be less than or equal to Pills Prescribed");
            rx.quantityFilled += _pillsFilled;
            // updateScriptQuantityRoles(tokenId, _pillsFilled);
            rx.dateFilled = _dateFilled;
            rx.dateNextFill = _dateNextFill;
            getQuantityInfo(tokenId);
            getDateInfo(tokenId);
        
            emit UpdateScriptQuantityAndDatesEvent(
                rx.quantity,
                rx.quantityFilled,
                _pillsFilled,
                rx.quantity - rx.quantityFilled,
                _dateFilled,
                _dateNextFill,
                tokenId,
                msg.sender,
                rx.patient_address
            );
        }


// **********  JUST QUANTITY FILLED  ********************************************************************************** //
    function updateScriptQuantity(uint256 tokenId, uint256 _pillsFilled) public returns (uint256) {
        Script storage rx = allScripts[tokenId];
        // require(pillsFilled <= rx.quantity, "Pills Filled must be less than or equal to Pills Prescribed");
        // return rx.quantity -= pillsFilled;
        require(rx.quantityFilled + _pillsFilled <= rx.quantity, "Pills Filled must be less than or equal to Pills Prescribed");
        return rx.quantityFilled += _pillsFilled;
    }

    function updateScriptQuantityRoles(uint256 tokenId, uint256 _pillsFilled) public onlyPharmacy returns (uint256) {
        Script storage rx = allScripts[tokenId];
        require(rx.quantityFilled + _pillsFilled <= rx.quantity, "Pills Filled must be less than or equal to Pills Prescribed");
        return rx.quantityFilled += _pillsFilled;
    }


// ******** JUST Fill DATES ****************************************************************************************** //
    function updateScriptDates(uint256 tokenId, string memory _dateFilled, string memory _dateNextFill) public
    // returns (string memory) {
    {
        Script storage rx = allScripts[tokenId];
        rx.dateFilled = _dateFilled;
        rx.dateNextFill = _dateNextFill;
        getDateInfo(tokenId);
    }

    function updateScriptDatesRoles(uint256 tokenId, string memory _dateFilled, string memory _dateNextFill) 
    public onlyPharmacy
    {
        Script storage rx = allScripts[tokenId];
        rx.dateFilled = _dateFilled;
        rx.dateNextFill = _dateNextFill;
        getDateInfo(tokenId);
    }


            // dateFilled: '', // string dateFilled;
            // dateRxEnd: 0, // uint256 dateRxEnd;
            // dateNextFill: '',  // string dateNextFill (daysLeft);
            // dateRxNext: 0 // uint256 dateRxNext;

    function getPatientInfo(
        uint256 tokenId
    ) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
        return string(abi.encodePacked("Pt: ", rx.name, " - DOB: ", rx.dob));
            // string(abi.encodePacked("Patient: ", rx.patient_wallet, " - DOB: ", rx.dob));
            
    }

    function getMedicationInfo(
        uint256 tokenId
    ) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
        return
            string(
                abi.encodePacked(
                    "Medication: ",
                    rx.medication,
                    " | Rx NFT #",
                    toString(tokenId)
                )
            );
    }


    function getQuantityInfo(uint256 tokenId) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
                return
            string(
                abi.encodePacked(
                    "Qty Prescribed: ",
                    toString(rx.quantity),                   
                    " | Qty Filled: ",
                    toString(rx.quantityFilled),
                     " | Qty Left: ",
                    toString(rx.quantity - rx.quantityFilled) 
                )
            );
    }

    function getDateInfo(uint256 tokenId) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
        return             
            string(
                abi.encodePacked(
                    "Rx Date: ",
                    rx.datePrescribed,
                    " | Filled: ",
                    rx.dateFilled,
                     " | Next Fill: ",
                     rx.dateNextFill
                    // rx.daysLeft
                    // rx.dateRxNext - block.timestamp
                )
            );
    } 

//getDescriptionInfo()****************************************************
    // function getDescriptionInfo(
    //     uint256 tokenId
    // ) public view returns (string memory) {
    //     Script storage rx = allScripts[tokenId];
    //     return
    //         string(
    //             abi.encodePacked(
    //                 "NPI#: ",
    //                 rx.npi,
    //                 "| DEA#: ",
    //                 rx.dea,
    //                 "| Item #",
    //                 toString(tokenId)
    //             )
    //         );
    // }

    function getAddressInfo(
        uint256 tokenId
    ) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
        return string(abi.encodePacked("Pt Address: ", rx.patient_address));
    }

    function getAddress(uint256 tokenId) public view returns (address) {
        Script storage rx = allScripts[tokenId];
        return rx.patient_address;
    }

    function getAddressString(uint256 tokenId) public view returns (string memory) {
        Receipt storage rec = allReceipts[tokenId];
        return rec.patient_wallet_string;
    }

    function getPatientName(
        uint256 tokenId
    ) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
        return rx.name;
    }

    function getSig(uint256 tokenId) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
        return rx.description;
    }

    function getMedication(
        uint256 tokenId
    ) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
        return rx.medication;
    }

    // function getQuantity(uint256 tokenId) public view returns (string memory) {
    //ERROR: Return argument type (string memory) type uint256 (new quantity) not implicitly convertible to expected type (type of first return variable) string memory
    function getQuantity(uint256 tokenId) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
        return toString(rx.quantity);
    }

    function getQuantityFilled(uint256 tokenId) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
        return toString(rx.quantityFilled);
    }

    function getQuantityUnfilled(uint256 tokenId) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
        return toString(rx.quantity - rx.quantityFilled);
    }

    

    function getDob(uint256 tokenId) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
        return rx.dob;
    }



    function getDatePrescribed(uint256 tokenId) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
        return rx.datePrescribed;
    }

    function getDateFilled(uint256 tokenId) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
        return rx.dateFilled;
    }

    function getDateNextFill(uint256 tokenId) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
        return rx.dateNextFill;
    }



    function toString(uint256 value) public pure returns (string memory) {
        // Inspired by OraclizeAPI's implementation - MIT license
        // https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
} //end of contract

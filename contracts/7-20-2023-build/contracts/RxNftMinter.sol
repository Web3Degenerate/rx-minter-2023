// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC721Base.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
// import "@thirdweb-dev/contracts/extension/Permissions.sol";

import "./HelperFunctions.sol";
// import "./RxRoles.sol";

// ** Version 12.4 **  //
contract RxNftMinter is ERC721Base, HelperFunctions  {
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


//6/9/23, v.12.7 prep, removed  uint256 dateRxStart from ScriptWritten Event and changed _address indexed patient_wallet_ to string
// address indexed patient_wallet,
    // event ScriptWritten (
    //     bytes indexed patient_wallet,
    //     string patient_name,
    //     string medication,
    //     uint256 quantity,
    //     uint256 quantityFilled,
    //     uint256 datePrescribed,
    //     uint256 indexed script_token_number
    // );

    // event ScriptSentToPt (
    //     address indexed patient_wallet,
    //     address indexed doctor_wallet,
    //     uint256 indexed script_token_number
    // );


// add uint256 'string script_status' or 'bool active'
            // string script_status,
            // bool complete 
// 6/9/23, v12.7 prep, changed 'address indexed patient_address' to string

    event UpdateScriptQuantityAndDatesEvent(
            string pharmacy_name,
            string doctor_name,
            string doctor_dea,
            string medication_name,            
            uint256 quantity_prescribed,
            uint256 quantity_filled,
            uint256 quantity_filled_today,
            uint256 quantity_unfilled,
            uint256 date_filled,
            uint256 next_available_fill_date,
            uint256 indexed script_token_number,
            address pharmacy_address,
            address indexed patient_address
        );


// Text message confirmation to patient:
    // event PatientTransferToPharmacy(
    //     address indexed patient_address,
    //     address indexed pharmacy_address,
    //     string pharmacy_name,
    //     string patient_name,
    //     string medication_name,
    //     string doctor_name,
    //     string doctor_dea,
    //     uint256 indexed script_token_number
    // );

    // event PharmacyTransferToPatient(
    //     address indexed pharmacy_address,
    //     address indexed patient_address,
    //     uint256 indexed script_token_number
    // );





    function _createScript(
        // string memory _patient_wallet_string,
        // address _patient_address,
        // bytes calldata _patient_wallet_string, https://ethereum.stackexchange.com/questions/74442/when-should-i-use-calldata-and-when-should-i-use-memory
        // string memory _patient_wallet_string,
        // bytes memory _patient_wallet_address,
        string memory _patient_wallet_address,
        string memory _patient_name,
        string memory _sig_description,
        string memory _medication,
        string memory _dob,
    string memory _patient_physical_address,
    uint8 _pt_phone,
                // string memory _quantity,
        uint256 _quantity,
                // uint256 _quantityPrescribed,
                // string memory _npi,
    string memory _doctor_name,
    string memory _doctor_dea,
        
        uint256 _date_prescribed,
                    // uint256 _dateRxStart, 
        uint256 _per_diem_max,
        uint256 _date_next_fill

    )
    public returns (uint256) {

        Script memory _rx = Script({
            // patient_wallet: _patient_wallet,
            patient_wallet_address: _patient_wallet_address,
            patient_name: _patient_name,
            sig_description: _sig_description,
            medication: _medication,
            dob: _dob,
            patient_physical_address: _patient_physical_address,
            per_diem_max: _per_diem_max,
            rxId: rx_tokenCounter,
            date_prescribed: _date_prescribed, // string datePrescribed;
            doctor_name: _doctor_name,
            doctor_dea: _doctor_dea
        });

        allScripts.push(_rx);


        _createAuditTracker(_quantity, _date_next_fill);

        _createPatientInfo(_pt_phone);




        return _rx.rxId;
    }




    function _createAuditTracker(
        uint256 _quantity,
        uint256 _date_next_fill
        // uint256 rx_tokenCounter
    ) public {

        Audit memory _audit = Audit({
            date_first_filled: 0,
            date_last_filled: 0,
            date_next_fill_doctor: _date_next_fill,
            date_next_fill_pharmacy: _date_next_fill,
            quantity: _quantity,
            quantity_filled: 0,
            rxId: rx_tokenCounter
        });

        allAudits.push(_audit);
    }


    
    function _createPatientInfo(
        uint8 _pt_phone
    ) public {

        Patient memory _pt = Patient({
            pt_phone: _pt_phone,
            rxId: rx_tokenCounter
        });

        allPatients.push(_pt);
    }


    function mintRx(address _to ) public { 
        _safeMint(_to, 1);

        // emit ScriptSentToPt(
        //     _to,
        //     msg.sender,
        //     rx_tokenCounter
        // );

        rx_tokenCounter += 1;
    }



    // function transferPatientToPharmacy(address _from, address _to, string memory _pharmacyName, uint256 tokenId) public {
    //     safeTransferFrom(_from, _to, tokenId);

    //     emit PatientTransferToPharmacy (
    //         _from,
    //         _to,
    //         _pharmacyName,
    //         getPatientName(tokenId),
    //         getMedication(tokenId),
    //         getDoctor(tokenId),
    //         getDoctorDea(tokenId),
    //         tokenId 
    //     );
    // }

    function transferPatientToPharmacyRoles(address _from, address _to, string memory _pharmacyName, uint256 tokenId) public onlyPatient {
        safeTransferFrom(_from, _to, tokenId);

        // emit PatientTransferToPharmacy (
        //     _from,
        //     _to,
        //     _pharmacyName,
        //     getPatientName(tokenId),
        //     getMedication(tokenId),
        //     getDoctor(tokenId),
        //     getDoctorDea(tokenId),
        //     tokenId 
        // );
    }

 
    function transferPharmacyToPatient(address _from, address _to, uint256 tokenId) public {
        safeTransferFrom(_from, _to, tokenId);
        // emit PharmacyTransferToPatient (
        //     _from,
        //     _to,
        //     tokenId 
        // );
    }   

    function transferPharmacyToPatientRoles(address _from, address _to, uint256 tokenId) public onlyPharmacy {
        safeTransferFrom(_from, _to, tokenId);
        // emit PharmacyTransferToPatient (
        //     _from,
        //     _to,
        //     tokenId 
        // );
    }     
    


    //*********************************************************************************************************** */

    function _baseURI() internal pure override returns (string memory) {
        return "data:application/json;base64,";
    }


    function tokenSVGImageURI(uint256 tokenId) public view returns (string memory) {

        string[7] memory parts;

        parts[0] = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: black; font-family: serif; font-size: 14px; }</style><rect width="100%" height="100%" fill="#E8F559" /><text x="10" y="20" class="base">';
                   
        // parts[1] = getPatientInfo(tokenId);
        parts[1] = getMedicationInfo(tokenId);        
       
        parts[2] = '</text><text x="10" y="40" class="base">';

        parts[3] = getQuantityInfo(tokenId);

        parts[4] = '</text><text x="10" y="60" class="base">';

        parts[5] = getDoctorInfo(tokenId);

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
        string memory json_one = 
        // Base64.encode(
        //     bytes(
                string(
                    abi.encodePacked(
                        '{"name":"',
                        getPatientName(tokenId),
                        '","description":"',
                        getSig(tokenId),
                        // '",',
                // '","medication":"',
                // getMedication(tokenId),
                // '","dob":"',
                // getDob(tokenId),
                        // '",',
                // '","quantity":"',
                // getQuantity(tokenId),
                // // '",',
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
                // '"}'
                        '",'

                        // '"attributes": [{"trait_type": "npi", "value": "01010101"},{"trait_type": "state", "value": "CA"},{"trait_type": "expiration", "value": "06/06/2023"}]}'
                        // '"attributes":',
                        // jsonAttributes,
                        // "}"
                    )
                );
        //     )
        // );
        // return
        //    output = string(abi.encodePacked(_baseURI(),));
        
        // string memory output = string(abi.encodePacked("data:application/json;base64,", json));
            
        return json_one;
    }





    function jsonMetaDataTwo(uint256 tokenId) public view returns (string memory) {
        string memory json_two = 
        // Base64.encode(
        //     bytes(
                string(
                    abi.encodePacked(
                        // '{"name":"',
                        // getPatientName(tokenId),
                // '","dateprescribed":"',
                // getDatePrescribed(tokenId),
                // // '",',
                // '","datefilled":"',
                // getDateFilled(tokenId),
                // '","datenextfill":"',
                // getDateNextFill(tokenId),
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
                // '", "image":"',
                // tokenSVGImageURI(tokenId),
                // '"}'
                // '",',
                        '"attributes":[{"trait_type":"medication","value":"',getMedication(tokenId),
                        '"},{"trait_type":"dob","value":"',getDob(tokenId),
                        '"},{"trait_type":"quantity","value":"',getQuantity(tokenId),
                         '"},{"trait_type":"quantity-filled","value":"',getQuantityFilled(tokenId),
                        '"},{"trait_type":"patient-wallet-address","value":"',getPatientWalletAddress(tokenId),
                        '"},'
                        // '"},{"trait_type": "dateprescribed", "value": "',getDatePrescribed(tokenId),                                               
                        // '"},{"trait_type": "datefilled", "value": "',getDatePrescribed(tokenId),'"}]}'
                            // '"attributes":',
                            // jsonAttributes,
                            // "}"
                    )
                );
        //   )
        // );
                // return
                //    output = string(abi.encodePacked(_baseURI(),));

        // string memory output = string(abi.encodePacked("data:application/json;base64,", json));
        // return output;
        return json_two;
    }


        function jsonMetaDataThree(uint256 tokenId) public view returns (string memory) {
        string memory json_three = 
        // Base64.encode(
        //     bytes(
                string(
                    abi.encodePacked(
                        // '{"name":"',
                        // getPatientName(tokenId),
                // '","dateprescribed":"',
                // getDatePrescribed(tokenId),
                // // '",',
                // '","datefilled":"',
                // getDateFilled(tokenId),
                // '","datenextfill":"',
                // getDateNextFill(tokenId),
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
                // '", "image":"',
                // tokenSVGImageURI(tokenId),
                // '"}'
                // '",',
                        // '"attributes": [{"trait_type": "medication", "value": "',getMedication(tokenId),
                        // '"},{"trait_type": "dob", "value": "',getDob(tokenId),
                        // '"},{"trait_type": "quantity", "value": "',getQuantity(tokenId),
                        //  '"},{"trait_type": "quantityfilled", "value": "',getQuantityFilled(tokenId),
                        // '"},{"trait_type": "patientaddress", "value": "',getAddressString(tokenId),
          
                      
                        // '"},{"trait_type":"dateprescribed","value":"',getDatePrescribed(tokenId),
                        '{"trait_type":"date-prescribed","value":"',getDatePrescribed(tokenId),
                        '"},{"trait_type":"date-first-filled","value":"',getDateFirstFilled(tokenId),
                        '"},{"trait_type":"next-fill-date","value":"',getDateNextFillDynamic(tokenId),
                         '"},'
                        // '"},{"trait_type":"datenextfill","value":"',getDateNextFill(tokenId),'"}]}'
                        // '"attributes":',
                        // jsonAttributes,
                        // "}"
                        // '",'
                    )
                );
        //     )
        // );
                // return
                //    output = string(abi.encodePacked(_baseURI(),));

        // string memory output = string(abi.encodePacked("data:application/json;base64,", json));
        // return output;
        return json_three;
    }


        function jsonMetaDataFour(uint256 tokenId) public view returns (string memory) {
        string memory json_four = 
        // Base64.encode(
        //     bytes(
                string(
                    abi.encodePacked(
                    
                        // '"},{"trait_type":"dateprescribed","value":"',getDatePrescribed(tokenId),
                        '{"trait_type":"doctor","value":"',getDoctor(tokenId),
                        '"},{"trait_type":"doctor-dea","value":"',getDoctorDea(tokenId),
                        '"},{"trait_type":"pt-physical-address","value":"',getPatientPhysicalAddress(tokenId)
                        // '"},{"trait_type":"datenextfill","value":"',getDateNextFill(tokenId),'"}]}'
                        // '"attributes":',
                        // jsonAttributes,
                        // "}"
                        // '",'
                    )
                );
        //     )
        // );
                // return
                //    output = string(abi.encodePacked(_baseURI(),));

        // string memory output = string(abi.encodePacked("data:application/json;base64,", json));
        // return output;
        return json_four;
    }


            function jsonMetaDataFive(uint256 tokenId) public view returns (string memory) {
        string memory json_four = 
        // Base64.encode(
        //     bytes(
                string(
                    abi.encodePacked(
                        // '{"name":"',
                        // getPatientName(tokenId),
                // '","dateprescribed":"',
                // getDatePrescribed(tokenId),
                // // '",',
                // '","datefilled":"',
                // getDateFilled(tokenId),
                // '","datenextfill":"',
                // getDateNextFill(tokenId),
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
                // '", "image":"',
                // tokenSVGImageURI(tokenId),
                // '"}'
                // '",',
                        // '"attributes": [{"trait_type": "medication", "value": "',getMedication(tokenId),
                        // '"},{"trait_type": "dob", "value": "',getDob(tokenId),
                        // '"},{"trait_type": "quantity", "value": "',getQuantity(tokenId),
                        //  '"},{"trait_type": "quantityfilled", "value": "',getQuantityFilled(tokenId),
                        // '"},{"trait_type": "patientaddress", "value": "',getAddressString(tokenId),

      
   
   
  

                        // '"},{"trait_type":"dateprescribed","value":"',getDatePrescribed(tokenId),
                        '"},{"trait_type":"date-last-filled","value":"',getDateLastFilled(tokenId),
                        '"},{"trait_type":"next-fill-date-doctor","value":"',getDateNextFillDoctor(tokenId),
                        '"},{"trait_type":"next-fill-date-pharmacy","value":"',getDateNextFillPharmacy(tokenId),  
                        '"},{"trait_type":"per-diem-max","value":"',getPerDiemMax(tokenId),                      
                        '"},{"trait_type":"patient-phone","value":"',getPtPhone(tokenId),'"}]}'
                        // '"attributes":',
                        // jsonAttributes,
                        // "}"
                    )
                );
        //     )
        // );
                // return
                //    output = string(abi.encodePacked(_baseURI(),));

        // string memory output = string(abi.encodePacked("data:application/json;base64,", json));
        // return output;
        return json_four;
    }


// (5/23/23) - New tokenURI yolo attempt:
    function tokenURI(uint256 tokenId) public view override returns (string memory) {

        // string memory json_one = jsonMetaDataOne(tokenId);
        // string memory json_two = jsonMetaDataTwo(tokenId);
        // string memory json_three = jsonMetaDataThree(tokenId);

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        jsonMetaDataOne(tokenId),
                        jsonMetaDataTwo(tokenId),
                        jsonMetaDataThree(tokenId),
                        jsonMetaDataFour(tokenId), 
                        jsonMetaDataFive(tokenId)
                    )
                )
            )
        );

        // string memory output = string(abi.encodePacked("data:application/json;base64,", json_one, json_two));

        // string memory output = string(abi.encodePacked("data:application/json;base64,", json_one, json_two, json_three));

        string memory output = string(abi.encodePacked(_baseURI(), json));


        // string memory output = string(abi.encodePacked(_baseURI(), jsonMetaDataOne(tokenId), jsonMetaDataTwo(tokenId)));
            
        return output;
    }


// *********************************  6/9/23 v.12.7 Prep Removed updateScriptQuantityAndDates without Roles ***************************************


    function updateScriptQuantityAndDatesRoles(
        uint256 tokenId, 
        uint256 _pillsFilled, 
        uint256 _date_first_filled, //original
        uint256 _date_last_filled, //current fill pass to event
        uint256 _date_next_fill_pharmacy,
        string memory _pharmacy_name,
        address _patient_wallet_address_from_metadata
        ) 
        public onlyPharmacy {
            Audit storage rx = allAudits[tokenId];
            require(rx.quantity_filled + _pillsFilled <= rx.quantity, "Pills Filled must be less than or equal to Pills Prescribed");
            rx.quantity_filled += _pillsFilled;
            // updateScriptQuantityRoles(tokenId, _pillsFilled);
            rx.date_first_filled = _date_first_filled;
            rx.date_last_filled = _date_last_filled;
            rx.date_next_fill_pharmacy = _date_next_fill_pharmacy;
            // getQuantityInfo(tokenId);
            // getDateInfo(tokenId);
        
            emit UpdateScriptQuantityAndDatesEvent(
                _pharmacy_name,
                getDoctor(tokenId),   
                getDoctorDea(tokenId),
                getMedication(tokenId),
                rx.quantity,
                rx.quantity_filled,
                _pillsFilled,           
                rx.quantity - rx.quantity_filled,
                _date_last_filled,
                _date_next_fill_pharmacy,
                tokenId,
                msg.sender,
                _patient_wallet_address_from_metadata
                // rx.patient_wallet_address
                // getPatientWalletAddress(tokenId)
                // rx.patient_address
                // getScriptStatusString(tokenId),
                // getScriptStatus(tokenId)             
            );
        }


// Pharmacy Fills 
    // function _pharmacyFillScript(
    //     string memory _date_filled,
    //     string memory _date_filled_formatted,
    //     string memory _date_current_fill,
    //     string memory _date_current_fill_formatted,
    //                                 // string memory _date_next_fill,
    //                                 // string memory _date_next_fill_formatted,
    //     string memory _script_status,
    //     uint256 tokenId
    //                                 // bool _active
    //                                 // uint256 _fill_id,
    //                                 // string memory _fill_date

    //                                 // uint256 rx_tokenCounter
    // ) public {

    //                                 // getScriptStatus(tokenId);

    //     PharmacyFills memory _fill = PharmacyFills({
    //         date_original_filled: _date_filled,
    //         date_original_filled_formatted: _date_filled_formatted,
    //         date_current_fill: _date_current_fill,
    //         date_current_fill_formatted: _date_current_fill_formatted,
    //         script_status: _script_status,
    //         rxId: tokenId
    //     });

    //     allPharmacyFills.push(_fill);

    //                                 // PharmacyFills storage _fill = fills[rx_tokenCounter];

    //                                 // // PharmacyFills memory _fill = PharmacyFills({
    //                                 //     _fill.date_current_fill = _current_fill_date;
    //                                 //     _fill.date_next_fill = _date_next_fill;
    //                                 //     _fill.script_status = _script_status;
    //                                 //     _fill.active = _active;
    //                                 //     // fill_date: _fill.fill_date.push(_current_fill_date),
    //                                 //     _fill.rxId = getTokenCount();
    //                                 //     // patient_physical_address: _patient_physical_address,
    //                                 //     // rxId: getTokenCount()
    //                                 // // });

    //                                 // // allPharmacyFills.push(_fill);
    // }


// **********  JUST QUANTITY FILLED  ********************************************************************************** //
    // function updateScriptQuantity(uint256 tokenId, uint256 _pillsFilled) public returns (uint256) {
    //     Script storage rx = allScripts[tokenId];
    //     // require(pillsFilled <= rx.quantity, "Pills Filled must be less than or equal to Pills Prescribed");
    //     // return rx.quantity -= pillsFilled;
    //     require(rx.quantityFilled + _pillsFilled <= rx.quantity, "Pills Filled must be less than or equal to Pills Prescribed");
    //     return rx.quantityFilled += _pillsFilled;
    // }

    // function updateScriptQuantityRoles(uint256 tokenId, uint256 _pillsFilled) public onlyPharmacy returns (uint256) {
    //     Script storage rx = allScripts[tokenId];
    //     require(rx.quantityFilled + _pillsFilled <= rx.quantity, "Pills Filled must be less than or equal to Pills Prescribed");
    //     return rx.quantityFilled += _pillsFilled;
    // }


// ******** JUST Fill DATES ****************************************************************************************** //
    // function updateScriptDates(uint256 tokenId, string memory _dateFilled, string memory _dateNextFill) public
    // // returns (string memory) {
    // {
    //     Script storage rx = allScripts[tokenId];
    //     rx.dateFilled = _dateFilled;
    //     rx.dateNextFill = _dateNextFill;
    //     getDateInfo(tokenId);
    // }

    // function updateScriptDatesRoles(uint256 tokenId, string memory _dateFilled, string memory _dateNextFill) 
    // public onlyPharmacy
    // {
    //     Script storage rx = allScripts[tokenId];
    //     rx.dateFilled = _dateFilled;
    //     rx.dateNextFill = _dateNextFill;
    //     getDateInfo(tokenId);
    // }


            // dateFilled: '', // string dateFilled;
            // dateRxEnd: 0, // uint256 dateRxEnd;
            // dateNextFill: '',  // string dateNextFill (daysLeft);
            // dateRxNext: 0 // uint256 dateRxNext;

    // function getPatientInfo(
    //     uint256 tokenId
    // ) public view returns (string memory) {
    //     Script storage rx = allScripts[tokenId];
    //     return string(abi.encodePacked("Pt: ", rx.patient_name, " - DOB: ", rx.dob));
    //         // string(abi.encodePacked("Patient: ", rx.patient_wallet, " - DOB: ", rx.dob));        
    // }

    function getDoctorInfo(
        uint256 tokenId
    ) public view returns (string memory) {
        return string(abi.encodePacked("Prescriber: ", getDoctor(tokenId)));
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
        return
            string(
                abi.encodePacked(
                    "Qty Prescribed: ",
                    getQuantity(tokenId),                   
                    " | Qty Filled: ",
                    getQuantityFilled(tokenId),
                     " | Qty Left: ",
                    getQuantityUnfilled(tokenId) 
                )
            );
    }

    // function getDateInfo(uint256 tokenId) public view returns (string memory) {
    //     // Script storage rx = allScripts[tokenId];
    //     return             
    //         string(
    //             abi.encodePacked(
    //                 "Start: ",
    //                 getDatePrescribedFormatted(tokenId),
    //                 // rx.datePrescribed,
    //                 " | Filled: ",
    //                 getLastDateFilledUpdate(tokenId),
    //                 // rx.dateFilled,
    //                  " | Next Refill: ",
    //                  getDateNextFillFormatted(tokenId)
    //                 //  rx.dateNextFill
    //                 // rx.daysLeft
    //                 // rx.dateRxNext - block.timestamp
    //             )
    //         );
    // } 

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

    // function getAddressInfo(
    //     uint256 tokenId
    // ) public view returns (string memory) {
    //     Script storage rx = allScripts[tokenId];
    //     return string(abi.encodePacked("Pt Address: ", rx.patient_wallet_address));
    // }


// ******************** GET INDIVIDUAL VALUES W/O FORMATTING *****************************************************//

    function getTokenCount() public view returns (uint256) {
        return rx_tokenCounter;
    }






} //end of contract
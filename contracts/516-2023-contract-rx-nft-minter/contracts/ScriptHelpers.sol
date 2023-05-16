// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
 
 
 contract ScriptHelpers {


    struct Script {
        // string patient_wallet;
        address patient_address;
        string name;
        string description;
        string medication;
        string dob;
        // string quantity;
        uint256 quantity;
        uint256 quantityFilled;
        // SUNDAY PASS ENDS HERE
        uint256 rxId;
        //POST SUNDAY 5/7/23 ADDITION:
        // string npi;
        // string dea;

        string datePrescribed;
        // uint256 dateRxStart;
        string dateFilled;
        // uint256 dateRxEnd;
        string dateNextFill;
        // uint256 dateRxNext;
    }

    mapping(uint256 => Script) public scripts;

    Script[] allScripts;


     event ScriptWritten (
        address indexed patient_address,
        string patient_name,
        string medication,
        uint256 quantity,
        uint256 quantityFilled,
        string datePrescribed,
        uint256 dateRxStart,
        uint256 indexed script_token_number
    );

    event ScriptSentToPt (
        address indexed patient_address,
        address indexed doctor_wallet,
        uint256 indexed script_token_number
    );



    event UpdateScriptQuantityAndDatesEvent(
            string quantity_update,
            uint256 quantity_prescribed,
            uint256 indexed quantity_filled,
            uint256 quantity_filled_today,
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

    function updateScriptQuantityAndDates(uint256 tokenId, uint256 _pillsFilled, string memory _dateFilled, string memory _dateNextFill) public {
        Script storage rx = allScripts[tokenId];
        rx.quantityFilled += _pillsFilled;
        rx.dateFilled = _dateFilled;
        rx.dateNextFill = _dateNextFill;
        getQuantityInfo(tokenId);

        emit UpdateScriptQuantityAndDatesEvent(
            // toString(rx.quantityFilled += _pillsFilled), // 15 + 0 to string
            string(abi.encodePacked("Total Filled: ", rx.quantityFilled, "/", rx.quantity)),
            rx.quantity,
            rx.quantityFilled,
            _pillsFilled,
            _dateFilled,
            _dateNextFill,
            tokenId,
            msg.sender,
            rx.patient_address
            // rx.patient_wallet
        );
    }


    // function updateScriptQuantityAndDatesExplicit(uint256 tokenId, uint256 pillsFilled, string memory _dateFilled, string memory _dateNextFill) public {
    //     Script storage rx = allScripts[tokenId];
    //     rx.quantityFilled += pillsFilled;
    //     rx.dateFilled = _dateFilled;
    //     rx.dateNextFill = _dateNextFill;
    //     getQuantityInfo(tokenId);
    //     tokenURI(tokenId);
    // }


                                                    // ) public onlyPharmacy returns (uint256) {
    function updateScriptQuantity(uint256 tokenId, uint256 pillsFilled) public returns (uint256) {
        Script storage rx = allScripts[tokenId];
        // require(pillsFilled <= rx.quantity, "Pills Filled must be less than or equal to Pills Prescribed");
        // return rx.quantity -= pillsFilled;
        require(rx.quantityFilled + pillsFilled <= rx.quantity, "Pills Filled must be less than or equal to Pills Prescribed");
        return rx.quantityFilled += pillsFilled;
    }

    // function updateScriptQuantityExplicit(uint256 tokenId, uint256 pillsFilled) public {
    //     Script storage rx = allScripts[tokenId];
    //     // require(pillsFilled <= rx.quantity, "Pills Filled must be less than or equal to Pills Prescribed");
    //     // rx.quantity -= pillsFilled;
    //     rx.quantityFilled += pillsFilled;
    //     tokenURI(tokenId);
    // }

    function updateScriptDates(uint256 tokenId, string memory _dateFilled, string memory _dateNextFill) public
    // returns (string memory) {
    {
        Script storage rx = allScripts[tokenId];
        rx.dateFilled = _dateFilled;
        rx.dateNextFill = _dateNextFill;
        getQuantityInfo(tokenId);
    }

    // function updateScriptDatesExplicit(uint256 tokenId, string memory _dateFilled, string memory _dateNextFill) public
    // // returns (string memory) {
    // {
    //     Script storage rx = allScripts[tokenId];
    //     rx.dateFilled = _dateFilled;
    //     rx.dateNextFill = _dateNextFill;
    //     getQuantityInfo(tokenId);
    //     tokenURI(tokenId);
    // }


            // dateFilled: '', // string dateFilled;
            // dateRxEnd: 0, // uint256 dateRxEnd;
            // dateNextFill: '',  // string dateNextFill (daysLeft);
            // dateRxNext: 0 // uint256 dateRxNext;

    function getPatientInfo(
        uint256 tokenId
    ) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
        return
            // string(abi.encodePacked("Patient: ", rx.patient_wallet, " - DOB: ", rx.dob));
            // string(abi.encodePacked("Pt: ", rx.patient_wallet));
            string(abi.encodePacked("Pt: ", rx.patient_address));
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
                    " | Rx Item #",
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
                    "Date Prescribed: ",
                    rx.datePrescribed,
                    " | Date Filled: ",
                    rx.dateFilled,
                     " | Next Refill Date: ",
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
        // return string(abi.encodePacked("Pt Address: ", rx.patient_wallet));
        return string(abi.encodePacked("Pt: ", rx.patient_address));
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
    function getQuantity(uint256 tokenId) public view returns (uint256) {
        Script storage rx = allScripts[tokenId];
        return rx.quantity;
    }

    function getDob(uint256 tokenId) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
        return rx.dob;
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

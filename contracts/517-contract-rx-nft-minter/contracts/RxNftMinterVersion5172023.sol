// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC721Base.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract RxNftMinterVersion5172023 is ERC721Base {

    uint256 private rx_tokenCounter;

      constructor(
        string memory _name,
        string memory _symbol,
        address _royaltyRecipient,
        uint128 _royaltyBps
    )
        ERC721Base(
            _name,
            _symbol,
            _royaltyRecipient,
            _royaltyBps
        )
    {
        rx_tokenCounter = 0;
    }



// Struct and Events: 
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


    function _createScript(
        address _patient_address,
        string memory _name,
        string memory _description,
        string memory _medication,
        string memory _dob,
        uint256 _quantity,
        string memory _datePrescribed,
        uint256 _dateRxStart  
    )
        public
        returns (
            uint256
        )
    {
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
            dateFilled: 'N/A', // string dateFilled;
            // dateRxEnd: 0, // uint256 dateRxEnd;
            dateNextFill: 'N/A'  // string dateNextFill (daysLeft);
            // dateRxNext: 0 // uint256 dateRxNext;

        });

        allScripts.push(_rx);

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

        return _rx.rxId;
    }

    function mintRx(address _to) public {
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
    
    function transferPharmacyToPatient(address _from, address _to, uint256 tokenId) public {

        safeTransferFrom(_from, _to, tokenId);

        emit PharmacyTransferToPatient (
            _from,
            _to,
            tokenId 
        );
    }   

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        // Script storage rx = allScripts[tokenId];

        string[7] memory parts;

        parts[
            0
        ] = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: black; font-family: serif; font-size: 14px; }</style><rect width="100%" height="100%" fill="#E8F559" /><text x="10" y="20" class="base">';

        // parts[1] = getPatientInfo(tokenId);
        parts[1] = getMedicationInfo(tokenId);       
       
        parts[2] = '</text><text x="10" y="40" class="base">';

        parts[3] = getQuantityInfo(tokenId);

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

        
        // string memory json = solidityIsGay(tokenId, output);
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name":"',
                        getPatientName(tokenId),
                        '","description":"',
                        getMedication(tokenId),
                        // getSig(tokenId),
                        // '","dob":"',
                        // getDob(tokenId),                        
                        // '",',
                        // '","medication":"',
                        // getMedication(tokenId),
                        // '",',
                        // '","quantity":"',
                        // getQuantity(tokenId),
                        // '","quantity-filled":"',
                        // getQuantityFilled(tokenId),
                        // '","quantity-unfilled":"',
                        // getQuantityLeft(tokenId),
                        // '","date-prescribed":"',
                        // getDatePrescribed(tokenId),
                        // '","date-filled":"',
                        // getDateFilled(tokenId),
                        // '","date-next-fill":"',
                        // getDateNextFill(tokenId),                        
                        // '",',
                        '", "image": "data:image/svg+xml;base64,',
                        Base64.encode(bytes(output)),
                        '"}'
                        '",',
                        '"attributes": [{"trait_type": "date-prescribed", "value": "',getDatePrescribed(tokenId),
                        '",{"trait_type": "date-filled", "value": "',getDateFilled(tokenId),
                        '",{"trait_type": "quantity", "value": "',getQuantity(tokenId),
                        '",{"trait_type": "quantity-filled", "value": "',getQuantityFilled(tokenId),
                        '"},{"trait_type": "date-next-fill", "value": "06/20/2023"}]}'
                        // '"attributes":',
                        // jsonAttributes,
                        // "}"
                    )
                )
            )
        );

        // return
        //    output = string(abi.encodePacked(_baseURI(),));
        output = string(
            // abi.encodePacked("data:application/json;base64,", json)
            abi.encodePacked("data:application/json;base64,", json)
        );

        return output;
    } //end of tokenURI or generateSVG


    // function solidityIsGay(uint256 tokenId, string memory output) public view returns (string memory) {

    //     string memory json = Base64.encode(
    //         bytes(
    //             string(
    //                 abi.encodePacked(
    //                     '{"name":"',
    //                     getPatientName(tokenId),
    //                     '","description":"',
    //                     getMedication(tokenId),
    //                     // getSig(tokenId),
    //                     // '","dob":"',
    //                     // getDob(tokenId),                        
    //                     // '",',
    //                     // '","medication":"',
    //                     // getMedication(tokenId),
    //                     // '",',
    //                     // '","quantity":"',
    //                     // getQuantity(tokenId),
    //                     // '","quantity-filled":"',
    //                     // getQuantityFilled(tokenId),
    //                     // '","quantity-unfilled":"',
    //                     // getQuantityLeft(tokenId),
    //                     // '","date-prescribed":"',
    //                     // getDatePrescribed(tokenId),
    //                     // '","date-filled":"',
    //                     // getDateFilled(tokenId),
    //                     // '","date-next-fill":"',
    //                     // getDateNextFill(tokenId),                        
    //                     // '",',
    //                     '", "image": "data:image/svg+xml;base64,',
    //                     Base64.encode(bytes(output)),
    //                     '"}'
    //                     '",',
    //                     '"attributes": [{"trait_type": "date-prescribed", "value": "',getDatePrescribed(tokenId),
    //                     '",{"trait_type": "date-filled", "value": "',getDateFilled(tokenId),
    //                     '",{"trait_type": "quantity", "value": "',getQuantity(tokenId),
    //                     '",{"trait_type": "quantity-filled", "value": "',getQuantityFilled(tokenId),
    //                     '"},{"trait_type": "date-next-fill", "value": "06/20/2023"}]}'
    //                     // '"attributes":',
    //                     // jsonAttributes,
    //                     // "}"
    //                 )
    //             )
    //         )
    //     );
    //     return json;
    // }


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
                    "Date: ",
                    rx.datePrescribed,
                    " | Filled: ",
                    rx.dateFilled,
                     " | Next: ",
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
    function getQuantity(uint256 tokenId) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
        return toString(rx.quantity);
    }

    function getQuantityFilled(uint256 tokenId) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
        return toString(rx.quantityFilled);
    }

    function getQuantityLeft(uint256 tokenId) public view returns (string memory) {
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
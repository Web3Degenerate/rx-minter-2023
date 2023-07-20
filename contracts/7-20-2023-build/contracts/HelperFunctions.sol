// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HelperFunctions {


// 6/9/23 v.12.7 prep error "Stack too deep, try removing local variables", changed patient_address from address to string and removed it as param in _createScripts
// address patient_address;
// bytes patient_wallet_address;
    struct Script {
        string patient_wallet_address;
            string patient_name;
            string sig_description;
            string medication;
            string dob;
    string patient_physical_address;
    uint256 per_diem_max;
            uint256 rxId;
        uint256 date_prescribed;
    string doctor_name;
    string doctor_dea;
    }

    mapping(uint256 => Script) public scripts;
    Script[] allScripts;


    struct Patient {
        uint8 pt_phone;  
        uint256 rxId;
    }

    mapping(uint256 => Patient) public patientz;
    Patient[] allPatients;


// ***********v.12.7*************************************
// struct Receipt changed to Audit / audits / allAudits
    struct Audit {       
        uint256 date_first_filled; //uint256 date_filled;
        uint256 date_last_filled;
uint256 date_next_fill_doctor; //uint256 date_next_fill;
    uint256 date_next_fill_pharmacy;
uint256 quantity;
        uint256 quantity_filled;
        uint256 rxId;
    }

    mapping(uint256 => Audit) public audits;

    Audit[] allAudits;
// ********************************************************

// ***********v.12.7*************************************
        // string date_last_filled;
        // string date_last_filled_formatted;
    // struct Utils {
    //     string date_prescribed_formatted;
    //     string date_last_filled_formatted;
        
    //     string date_next_fill;
    //     string date_next_fill_formatted;

    //     uint256 per_diem_max;

    //     string script_status;      
    //     uint256 rxId;
    // }

    // mapping(uint256 => UtilsStorage) public utils;

    // UtilsStorage[] allUtilsStorage;
// ********************************************************



// ***********v.12.7*************************************

        // bool active;
        // string[] fill_date; 
        // uint256 rxId;

// string date_next_fill_formatted;

    // struct PharmacyFills {
    //     string date_original_filled;
    //     string date_original_filled_formatted;
    //     string date_current_fill;
    //     string date_current_fill_formatted;     
    //     string script_status;
    //     uint256 rxId;
    // }

    // mapping(uint256 => PharmacyFills) public fills;

    // PharmacyFills[] allPharmacyFills;
// ********************************************************

//https://stackoverflow.com/questions/71893290/convert-bytes3-to-string-in-solidity

    function getPatientWalletAddress(uint256 tokenId) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
        return rx.patient_wallet_address;
        // return string(abi.encodePacked(rx.patient_wallet_address));
    }

    function getPatientName(uint256 tokenId) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
        return rx.patient_name;
    }

    // function getPatientName(uint256 tokenId) public view returns (string memory) {
    //     Script storage rx = allScripts[tokenId];
    //     return string(abi.encodePacked(rx.patient_name));
    // }

    function getSig(uint256 tokenId) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
        return rx.sig_description;
    }

    // function getSig(uint256 tokenId) public view returns (string memory) {
    //     Script storage rx = allScripts[tokenId];
    //     return string(abi.encodePacked(rx.sig_description));
    // }


    function getMedication(uint256 tokenId) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
        return rx.medication;
    }

    // function getMedication(uint256 tokenId) public view returns (string memory) {
    //     Script storage rx = allScripts[tokenId];
    //     return string(abi.encodePacked(rx.medication));
    // }

    function getDob(uint256 tokenId) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
        return rx.dob;
    }

    // function getDob(uint256 tokenId) public view returns (string memory) {
    //     Script storage rx = allScripts[tokenId];
    //     return string(abi.encodePacked(rx.dob));
    // }


    function getQuantity(uint256 tokenId) public view returns (string memory) {
        Audit storage rx = allAudits[tokenId];
        return toString(rx.quantity);
    }

    function getQuantityFilled(uint256 tokenId) public view returns (string memory) {
        Audit storage rx = allAudits[tokenId];
        return toString(rx.quantity_filled);
    }

    function getQuantityUnfilled(uint256 tokenId) public view returns (string memory) {
        Audit storage rx = allAudits[tokenId];
        return toString(rx.quantity - rx.quantity_filled);
    }


    function getDatePrescribed(uint256 tokenId) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
        return toString(rx.date_prescribed);
    }

    function getDateFirstFilled(uint256 tokenId) public view returns (string memory) {
        Audit storage rx = allAudits[tokenId];
        return toString(rx.date_first_filled);
    }

    function getDateLastFilled(uint256 tokenId) public view returns (string memory) {
        Audit storage rx = allAudits[tokenId];
        return toString(rx.date_last_filled);
    }


    function getDateNextFillDynamic(uint256 tokenId) public view returns (string memory) {
        Audit storage rx = allAudits[tokenId];
        if (rx.date_next_fill_doctor > rx.date_next_fill_pharmacy){
            return toString(rx.date_next_fill_doctor);
        }else{
            return toString(rx.date_next_fill_pharmacy);
        }
    }

    function getDateNextFillDoctor(uint256 tokenId) public view returns (string memory) {
        Audit storage rx = allAudits[tokenId];
        return toString(rx.date_next_fill_doctor);
    }

    function getDateNextFillPharmacy(uint256 tokenId) public view returns (string memory) {
        Audit storage rx = allAudits[tokenId];
        return toString(rx.date_next_fill_pharmacy);
    }

    // uint256 date_next_fill_doctor; //uint256 date_next_fill;
    // uint256 date_next_fill_pharmacy;

    function getScriptStatus(uint256 tokenId) public view returns (bool) {
        // UtilsStorage storage util = allUtilsStorage[tokenId];
        Audit storage rx = allAudits[tokenId];
        return rx.quantity - rx.quantity_filled == 0;
    }


    function getDoctor(uint256 tokenId) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
        // return string(abi.encodePacked(rx.doctor_name));
        return rx.doctor_name;
    }

    function getDoctorDea(uint256 tokenId) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
        // return string(abi.encodePacked(rx.doctor_dea));
        return rx.doctor_dea;
    }

    function getPatientPhysicalAddress(uint256 tokenId) public view returns (string memory) {
        Script storage rx = allScripts[tokenId];
        // return string(abi.encodePacked(rx.patient_physical_address));
        return rx.patient_physical_address;
    }


    function getPerDiemMax(uint256 tokenId) public view returns (string memory) {
        Script storage util = allScripts[tokenId];
        return toString(util.per_diem_max);  
    } 


 //new v13.2 (7.20.23 Epoch) Testing Patient Struct
     function getPtPhone(uint256 tokenId) public view returns (string memory) {
        Patient storage pt = allPatients[tokenId];
        return toString(pt.pt_phone);
    }   

//new v.12.7 patient_address stored as bytes:
    // function getAddressFromBytesToString(uint256 tokenId) public view returns (string memory) {
    //     Script storage rx = allScripts[tokenId];
    //     return string(abi.encodePacked(rx.patient_address));
    // }


// *********************** RECEIPT Struct functions ********************************* //

    // function getAddressString(uint256 tokenId) public view returns (string memory) {
    //     Receipt storage rec = allReceipts[tokenId];
    //     return rec.patient_wallet_string;
    // }




// *********************** PHARMACY FILLS Struct Functions ********************************* //
// LAST Date filled:
    // function getDateCurrentFill(uint256 tokenId) public view returns (string memory) {
    //     // UtilsStorage storage util = allUtilsStorage[tokenId];
    //     PharmacyFills storage fill = allPharmacyFills[tokenId];
    //     return fill.date_current_fill;
    // }

//6/9/23 v.12.7 prep, stack too deep trouble shooting. Only 1 of 1. 
    // function setDateCurrentFill(uint256 tokenId, string memory _dateLastFilled) public {
    //     // UtilsStorage storage util = allUtilsStorage[tokenId];
    //     PharmacyFills storage fill = allPharmacyFills[tokenId];
    //     fill.date_current_fill = _dateLastFilled;
    // }

    // function getDateCurrentFillFormatted(uint256 tokenId) public view returns (string memory) {
    //     // UtilsStorage storage util = allUtilsStorage[tokenId];
    //     PharmacyFills storage fill = allPharmacyFills[tokenId];
    //     return fill.date_current_fill_formatted;
    // }

//6/9/23 v.12.7 prep, stack too deep trouble shooting. Only 1 of 1. 
    // function setDateLastFilledFormatted(uint256 tokenId, string memory _dateLastFilledFormatted) public {
    //     // UtilsStorage storage util = allUtilsStorage[tokenId];
    //     PharmacyFills storage fill = allPharmacyFills[tokenId];
    //     fill.date_current_fill_formatted = _dateLastFilledFormatted;
    // }


// *********************** UTILS Struct Functions ********************************* //



    // function getDatePrescribedFormatted(uint256 tokenId) public view returns (string memory) {
    //     UtilsStorage storage util = allUtilsStorage[tokenId];
    //     return util.date_prescribed_formatted;
    // } 




//6/9/23 12.7 prep 
    // function setScriptStatus(uint256 tokenId, string memory _script_status_update) public {
    //     UtilsStorage storage util = allUtilsStorage[tokenId];
    //     util.script_status = _script_status_update;
    // }

//     function getScriptStatusString(uint256 tokenId) public view returns (string memory) {
//         UtilsStorage storage util = allUtilsStorage[tokenId];
//         return util.script_status;
//     }

// // NEXT fill date Formattted: used by SVG getDateInfo() function:
//     function getDateNextFillFormatted(uint256 tokenId) public view returns (string memory) {
//         UtilsStorage storage util = allUtilsStorage[tokenId];
//         return util.date_next_fill_formatted;
//     }

//     function setDateNextFillFormatted(uint256 tokenId, string memory _dateNextFillFormatted) public {
//         UtilsStorage storage util = allUtilsStorage[tokenId];
//         util.date_next_fill_formatted = _dateNextFillFormatted;
//     }


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


} //end of GetterFunctions contract
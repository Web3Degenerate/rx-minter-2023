// import { ethers } from 'ethers';
// import { useAddress, useContract, ConnectWallet, useOwnedNFTs, ThirdwebNftMedia, 
//     useTransferNFT, useMetadata, useNFT, useContractRead } from "@thirdweb-dev/react";
// import { solidityContractAddress } from '../constants';

export const addyShortner = (address) => {
    let stringAddy = String(address);
    const shortenedAddy = stringAddy.substring(0, 6) + "..." + stringAddy.substring(37)
    return shortenedAddy;
}

export const formatDateTwoDigitYear = (date) => {
    // Assuming the date value is received as a string from the input field dateValue = '2023-05-19';
    let dateValue = String(date);

    // Split the date value by the hyphen
    const [year, month, day] = dateValue.split('-');

    // Create a new Date object using the extracted values
    const formattedDate = new Date(year, month - 1, day);

    // Format the date as mm/dd/YY
    const formattedDateString = `${formattedDate.getMonth() + 1}/${formattedDate.getDate()}/${formattedDate.getFullYear().toString().slice(-2)}`;
    return formattedDateString; // Output: 05/19/23
   }

   export const formatDateFourDigitYear = (date) => {
    // Assuming the date value is received as a string from the input field dateValue = '2023-05-19';
    let dateValue = String(date);

    // Split the date value by the hyphen
    const [year, month, day] = dateValue.split('-');

    // Create a new Date object using the extracted values
    const formattedDate = new Date(year, month - 1, day);

    // Format the date as mm/dd/YY
    const formattedDateString = `${formattedDate.getMonth() + 1}/${formattedDate.getDate()}/${formattedDate.getFullYear()}`;
    return formattedDateString; // Output: 05/19/23
   }

// CONVERT BIG NUMBER to RAW Date, Four Digit Year and Two Digit Year: 
// Converts BigNumber dates to (1) raw string, (2) four digit year, (3) two digit year.
export const convertBigNumberToRawString = (bigNumberDate) => {
    let dateNumber = Number(bigNumberDate);
    var date = new Date(dateNumber);
    
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var day = String(date.getDate()+1).padStart(2, '0');
    
    var dateString = year + '-' + month + '-' + day;
    return dateString;
}
    
export const convertBigNumberToFourDigitYear = (bigNumberDate) => {
    let dateNumber = Number(bigNumberDate);
    var date = new Date(dateNumber);
    
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var day = String(date.getDate()+1).padStart(2, '0');
    
    var dateString = year + '-' + month + '-' + day;
    return formatDateFourDigitYear(dateString);
}
    
export const convertBigNumberToTwoDigitYear = (bigNumberDate) => {
    let dateNumber = Number(bigNumberDate);
    var date = new Date(dateNumber);
    
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var day = String(date.getDate()+1).padStart(2, '0');
    
    var dateString = year + '-' + month + '-' + day;
    return formatDateTwoDigitYear(dateString);
}



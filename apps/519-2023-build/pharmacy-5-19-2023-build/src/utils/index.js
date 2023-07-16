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
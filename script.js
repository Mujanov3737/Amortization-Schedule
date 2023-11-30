// Wrapping the element targetting code in this event listen to wait for the HTML to load before exeuting
document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("loan-form");

    // Event listener will fire when the user presses the submit button
    form.addEventListener("submit", function(event) {
        event.preventDefault();

        // Storing the user inputs, parsing the inputs as floats
        const loanAmount = parseFloat(document.getElementById("loan-amount").value);
        const loanLength = parseFloat(document.getElementById("loan-length").value);
        const loanRate = parseFloat(document.getElementById("loan-rate").value);

        const table = tableCalc(loanAmount, loanRate, loanLength);
        
        // Creating the html table with data from tableCalc result
        function populateTable(table) {
            // Selecting the body portion of the table to populate
            const tableBody = document.querySelector("#mortgage-table tbody");

            // Iterate through each object in the array and perform operations
            table.forEach(function(row) {
                // Add new row to html table
                const newRow = tableBody.insertRow();
                // Populate new row with cells from calculated array of objects
                newRow.insertCell(0).textContent = row.month;
                newRow.insertCell(1).textContent = row.balance.toFixed(2);
                newRow.insertCell(2).textContent = row.principalAmount.toFixed(2);
                newRow.insertCell(3).textContent = row.interestAmount.toFixed(2);
                newRow.insertCell(4).textContent = row.monthlyPayment.toFixed(2);
                newRow.insertCell(5).textContent = row.totalInterest.toFixed(2);
                newRow.insertCell(6).textContent = row.totalPaid.toFixed(2);
            });
        }

        // Call function to create table when submit is pressed
        populateTable(table);
    });
});

// Helper function for rate -> decimal format
function convertRateToDecimal(rate) {
    return rate / 100;
}

// Takes in main parameters from user input to calculate and return monthly mortgage payment
function monthlyPaymentCalc(principal, lengthYears, rateYearly) {

    const rateMonthly = convertRateToDecimal(rateYearly) / 12;  // Converting percentage input to both decimal and monthly
    const lengthMonths = lengthYears * 12;

    // Primary mortgage payment calculation formula
    // Note: we won't truncate this calculation in data form, only when displayed in the UI
    const monthlyPayment = principal * (rateMonthly * Math.pow(1+rateMonthly, lengthMonths)) /
    (Math.pow((1+rateMonthly), lengthMonths) - 1);

    return monthlyPayment;
}

function tableCalc(loanAmount, loanRate, loanLength) {
    // Storing input arguments
    let initialAmount = loanAmount;
    let rateYearly = loanRate;
    let lengthYears = loanLength;

    // Storing monthly payment calculation
    const monthlyPayment = monthlyPaymentCalc(initialAmount, lengthYears, rateYearly);

    const rateMonthly = convertRateToDecimal(rateYearly) / 12;
    let payments = lengthYears * 12;    // How many monthly payments there will be
    let balance = initialAmount;        // Tracking loan balance remaining
    let totalInterest = 0;              // Tracking total interest and cumulative paid
    let totalPaid = 0;

    const mortgageTable = [];   // Storing each calculation in an array for use in generating table

    // Iterating for the number of monthly payments required to pay off loan
    for(let month = 1; month <= payments; month++) {
        const interestAmount = balance * rateMonthly;   // Interest will go down the more the loan is paid off
        const principalAmount = monthlyPayment - interestAmount; // Principal is the monthly payment before interest

        // Total interest paid and total cumulative paid over the course of the entire loan
        totalInterest = totalInterest + interestAmount;
        totalPaid = totalPaid + monthlyPayment;

        // Subtracting balance from principal paid
        balance = balance - principalAmount;

        // Adding this iteration of values as an object to the table array
        mortgageTable.push({
            month,
            balance,
            principalAmount,
            interestAmount,
            monthlyPayment,
            totalInterest,
            totalPaid
        })
    }

    return mortgageTable;
}
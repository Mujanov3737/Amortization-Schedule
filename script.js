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

        // Logging form inputs to confirm they are captured properly
        console.log("Loan Amount: " + loanAmount);
        console.log("Loan Length (Years): " + loanLength);
        console.log("Loan Rate: " + loanRate);
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

function tableCalc() {
    // Basic test inputs
    let initialAmount = 160000;
    let rateYearly = 3.5;
    let lengthYears = 15;

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

function main() {
}

// Entry Point
main();
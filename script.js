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

// Iterates through array to display all the object values in console
// Using string interpolation and "toFixed" to truncate values to the hundreths
function displayTable(table) {
    for(const row of table) {
        console.log(`${row.month}
            ${row.balance.toFixed(2)}
            ${row.principalAmount.toFixed(2)}
            ${row.interestAmount.toFixed(2)}
            ${row.monthlyPayment.toFixed(2)}
            ${row.totalInterest.toFixed(2)}
            ${row.totalPaid.toFixed(2)}`);
    }
}

function main() {
    const table = tableCalc();
    displayTable(table);
}

// Entry Point
main();
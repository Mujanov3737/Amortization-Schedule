// Takes in main parameters from user input to calculate and return monthly mortgage payment
function monthlyPaymentCalc(principal, lengthYears, rateYearly) {

    const rateMonthly = (rateYearly / 100) / 12;  // Converting percentage input to both decimal and monthly
    const lengthMonths = lengthYears * 12;

    // Primary mortgage payment calculation formula
    // Note: we won't truncate this calculation in data form, only when displayed in the UI
    const monthlyPayment = principal * (rateMonthly * Math.pow(1+rateMonthly, lengthMonths)) /
    (Math.pow((1+rateMonthly), lengthMonths) - 1);

    return monthlyPayment;
}

function main() {
    // Basic test inputs
    let initialAmount = 160000;
    let rateMonthly = 3.5;
    let lengthYears = 15;

    // Checking to see if the payment calculation works correctly
    const monthlyPayment = monthlyPaymentCalc(initialAmount, lengthYears, rateMonthly);
    alert(`Your monthly payment is ${monthlyPayment}`);
}

// Entry Point
main();
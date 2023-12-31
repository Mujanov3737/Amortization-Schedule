// Wrapping the element targetting code in this eventlistenr to wait for the HTML to load before exeuting
document.addEventListener("DOMContentLoaded", function() {

    let isSubmitted = false;

    // Helper function for targetting DOM elements and storing into an object
    function getDomElements() {
        return {
            tableBody: document.querySelector("#mortgage-table tbody"),
            form: document.getElementById("loan-form"),
            clearBtn: document.getElementById("clear-btn"),
            submitBtn: document.getElementById("submit"),
            interestText: document.getElementById("interest-text"),
            monthlyPaymentText: document.getElementById("monthly-payment-text"),
            dateText: document.getElementById("date-text"),
            headlineContainer: document.querySelector(".headline-container"),
            chart: document.getElementById('mortgage-chart')
        };
    }

    // Storing the DOM element targets into variables
    const { tableBody, 
            form, 
            clearBtn, 
            submitBtn, 
            interestText, 
            monthlyPaymentText, 
            dateText, 
            headlineContainer, 
            chart } = getDomElements();

    // Using Chart.JS to present a graphical version of the data
    // Constructing a new line chart
    const mortgageChart = createChart(chart);
    
    // Event listener will fire when the user presses the submit button
    form.addEventListener("submit", function(event) {
        event.preventDefault();

        // Wrapping submit code in if statement to hide elements depending on submission status
        if(!isSubmitted) {
            // Passing DOM elements into this function for processing
            processFormSubmission(tableBody, 
                chart, 
                headlineContainer, 
                submitBtn, 
                interestText, 
                monthlyPaymentText, 
                dateText, 
                mortgageChart);

            isSubmitted = true;
        }
    });

    // Event listener for clear button
    clearBtn.addEventListener("click", function(event) {   
        event.preventDefault();
        // Clearing UI after clear button is pressed
        resetUI(tableBody, chart, headlineContainer, submitBtn);
        // After the clear, flag the submission as false again
        isSubmitted = false;
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

// Primary calculation function for generating the core amortization schedule data and storing into an array
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
    let totalPrincipal = 0;
    let totalPaid = 0;
    let date = new Date();

    const mortgageTable = [];   // Storing each calculation in an array for use in generating table

    // Iterating for the number of monthly payments required to pay off loan
    for(let month = 1; month <= payments; month++) {
        const interestAmount = balance * rateMonthly;   // Interest will go down the more the loan is paid off
        const principalAmount = monthlyPayment - interestAmount; // Principal is the monthly payment before interest

        // Total interest, principal, and total cumulative paid over the course of the entire loan
        totalInterest = totalInterest + interestAmount;
        totalPrincipal = totalPrincipal + principalAmount;
        totalPaid = totalPaid + monthlyPayment;

        // Subtracting balance from principal paid
        balance = balance - principalAmount;

        // Add 1 month to the date
        date.setMonth(date.getMonth() + 1);
        formattedDate = formatDate(date);

        // Adding this iteration of values as an object to the table array
        mortgageTable.push({
            month,
            formattedDate,
            balance,
            principalAmount,
            interestAmount,
            monthlyPayment,
            totalPrincipal,
            totalInterest,
            totalPaid
        })
    }

    return mortgageTable;
}

// Updating the chart to reflect submitted calculations
function updateChart(chart, data) {

    // Iterating over each object in the data array and mapping the values to a separate array
    const labels = data.map(item => item.month);
    const principalAmount = data.map(item => item.principalAmount);
    const interestAmount = data.map(item => item.interestAmount);
    const monthlyPayment = data.map(item => item.monthlyPayment);

    // Passing data to chart object
    chart.data.labels = labels;
    chart.data.datasets[0].data = principalAmount;
    chart.data.datasets[1].data = interestAmount;
    chart.data.datasets[2].data = monthlyPayment;
    chart.update();
}

// Formats date objects in a more readable way
function formatDate(date) {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    return `${month}/${day}/${year}`;
}

// Creating the html table with data from tableCalc result
function populateTable(table, tableBody) {
    // Iterate through each object in the array and perform operations
    table.forEach(function(row) {
        // Add new row to html table
        const newRow = tableBody.insertRow();
        // Populate new row with cells from calculated array of objects
        newRow.insertCell(0).textContent = row.month;
        newRow.insertCell(1).textContent = row.formattedDate;
        newRow.insertCell(2).textContent = row.balance.toFixed(2);
        newRow.insertCell(3).textContent = row.principalAmount.toFixed(2);
        newRow.insertCell(4).textContent = row.interestAmount.toFixed(2);
        newRow.insertCell(5).textContent = row.monthlyPayment.toFixed(2);
        newRow.insertCell(6).textContent = row.totalPrincipal.toFixed(2);
        newRow.insertCell(7).textContent = row.totalInterest.toFixed(2);
        newRow.insertCell(8).textContent = row.totalPaid.toFixed(2);
    });
}

// Iterating over the collection to return an array that has the data needed for the chart
function populateChartData(table) {
    // Storing relevant data as an object for each iteration to be used in chart
    return table.map(row => ({
        month: row.month,
        principalAmount: row.principalAmount,
        interestAmount: row.interestAmount,
        monthlyPayment: row.monthlyPayment
    }));
}

// Updates the view with the calculated submission data
function processFormSubmission(tableBody, chart, headlineContainer, submitBtn, interestText, monthlyPaymentText, dateText, mortgageChart) {
    // Hide the submit button and disable the hidden attribute on the chart and headlines
    hideElement(submitBtn);
    showElement(chart);
    showElement(headlineContainer);

    // Storing the user inputs, parsing the inputs as floats
    const loanAmount = parseFloat(document.getElementById("loan-amount").value);
    const loanLength = parseFloat(document.getElementById("loan-length").value);
    const loanRate = parseFloat(document.getElementById("loan-rate").value);

    const table = tableCalc(loanAmount, loanRate, loanLength);
    populateTable(table, tableBody); // Generate Table
    updateChart(mortgageChart, populateChartData(table));   // Updating chart with table information

    // Accessing the object for the last month
    const lastMonthData = table[table.length - 1];  
    updateHeadline(interestText, monthlyPaymentText, dateText, lastMonthData);
}

// Clears parts of the view
function resetUI(tableBody, chart, headlineContainer, submitBtn) {
    // Clearing table 
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }
    // Making submit button visible again and hiding the headlines and chart
    submitBtn.classList.remove("hidden");
    chart.classList.add("hidden");
    headlineContainer.classList.add("hidden");
}

// Helper functions
function showElement(element) {
    if (element) {
        element.classList.remove("hidden");
    }
}

function hideElement(element) {
    if (element) {
        element.classList.add("hidden");
    }
}

// Uses data from the last object in the main table array to update the headline text in the view
function updateHeadline(interestText, monthlypaymentText, dateText, lastMonthData) {
    // Setting headline HTML to corresponding object info from the last month 
    interestText.textContent = lastMonthData.totalInterest.toFixed(2);
    monthlypaymentText.textContent = lastMonthData.monthlyPayment.toFixed(2);
    dateText.textContent = lastMonthData.formattedDate;
}

// This function passes in the context for the canvas and creates a chart
function createChart(chart) {
    const mortgageChart = new Chart(chart, {
        type: 'line',
        data:{
            labels:[],
            datasets: [{ 
                data: [],
                label: 'Principal Payment',
                borderColor: "red",
                hoverBorderWidth: 3,
                hoverBorderColor: '#000',
                fill: false
              },
              {
                data: [],
                label: 'Interest Payment',
                borderColor: "blue",
                hoverBorderWidth: 3,
                hoverBorderColor: '#000',
                fill: false
              },
              {
                data: [],
                label: 'Monthly Payment',
                borderColor: "green",
                hoverBorderWidth: 3,
                hoverBorderColor: '#000',
                fill: false
              }
            ]
        },
        options:{
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Amount'
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Months'
                    }
                  }
            },
            plugins:{
                title:{
                    display:true,
                    text:'Mortgage Loan Chart',
                    font: {
                        size: 20,
                        family: 'sans-serif'
                    }
                }
            }
        }
    });

    return mortgageChart;
}
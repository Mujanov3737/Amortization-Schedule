// Wrapping the element targetting code in this event listen to wait for the HTML to load before exeuting
document.addEventListener("DOMContentLoaded", function() {

    // Targetting elements
    const tableBody = document.querySelector("#mortgage-table tbody");
    const form = document.getElementById("loan-form");
    const clearBtn = document.getElementById("clear-btn");
    const submitBtn = document.getElementById("submit");

    let isSubmitted = false;

    // Using Chart.JS to present a graphical version of the data
    // Selecting context for the chart and constructing a new line chart
    const chart = document.getElementById('mortgage-chart');
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

    // Event listener will fire when the user presses the submit button
    form.addEventListener("submit", function(event) {
        event.preventDefault();

        // Wrapping submit code in if statement to hide button after submission occurs
        if(!isSubmitted) {
            isSubmitted = true;
            submitBtn.classList.add("hidden");
            chart.classList.remove("hidden");   // Show the chart after submission

            // Storing the user inputs, parsing the inputs as floats
            const loanAmount = parseFloat(document.getElementById("loan-amount").value);
            const loanLength = parseFloat(document.getElementById("loan-length").value);
            const loanRate = parseFloat(document.getElementById("loan-rate").value);

            const table = tableCalc(loanAmount, loanRate, loanLength);

            // Array to hold chart data
            let chartData = [];
        
            // Creating the html table with data from tableCalc result
            function populateTable(table) {
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

                    // Storing relevant data as an object for each iteration to be used in chart
                    chartData.push({
                        month: row.month,
                        principalAmount: row.principalAmount,
                        interestAmount: row.interestAmount,
                        monthlyPayment: row.monthlyPayment
                    });
                });

                // Updating chart with table information
                updateChart(mortgageChart, chartData);
            }
            // Call function to create table when submit is pressed
            populateTable(table);
        }
    });

    // Event listener for clear button
    clearBtn.addEventListener("click", function(event) {   
        event.preventDefault();
        // Iterating through table body and removing children of element  
        while (tableBody.firstChild) {
            tableBody.removeChild(tableBody.firstChild);
        }
        // After the clear, make the submit button visible again
        isSubmitted = false;
        submitBtn.classList.remove("hidden");
        chart.classList.add("hidden");  // Hide the table until new data is generated
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
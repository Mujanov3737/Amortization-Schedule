# Amortization-Schedule
## Purpose
An amortization schedule is a way to track how much money one pays in principal and interest over time when paying off a debt. This application is a simple webpage that takes in total loan amount, length of the loan, and the loan's interest rate in order to calculate and generate a table/chart to display monthly expenses for a home loan. The project is built using HTML, CSS, and Javascript. HTML defines the structure of the page, including the form, table, and chart. CSS is used to style these elements in a more visually appealing and accesible way. The Javascript script file handles all the calculations of the data entered by the user, as well as manipulates the DOM in a way that provides a more user friendly experience.

Here is some more information on amortization: https://www.investopedia.com/terms/a/amortization.asp
## Running the Project
In order to run the project, it can be downloaded as a zip or cloned. The style, script, and index files must be included in the same directory before running. Afterwards, the HTML index file can be opened in a web-browser to be parsed. The script and style files are linked externally in the HTML.

An alternative option is to use an IDE extension such as Live Server in VSCode or Atom Live Server in Atom, which allows for a development localhost server to be conviniently started from the IDE. VSCode and LiveServer were used entirely during the development of this project.
Also note that **chart.js** is used to create the chart within the webpage. It is loaded using a CDN in the HTML using a script element. You can find more information about chart.js here: https://www.chartjs.org/docs/latest/
## Project in Action
The user is presented with a form to input the loan amount, loan length in years, and a loan rate.
![image](https://github.com/Mujanov3737/Amortization-Schedule/assets/75598761/87afef42-ea61-4ffb-88e5-5ab784470fd2)
***
Upon entering this information and selecting submit, the table will be populated, chart will be generated, and some select important data will be displayed as a headline.
![mort_1](https://github.com/Mujanov3737/Amortization-Schedule/assets/75598761/7afc94a3-0da7-4fea-a7b0-9b333fa63dff)
***
The chart section displays the principal payment and interest payment for each month in a line chart. This way, the user can see how their interest payments decrease over time, while principal payments increase. These payments can be compared to the total monthly payment amount present in the chart as well.

![image](https://github.com/Mujanov3737/Amortization-Schedule/assets/75598761/8fe52fd9-83c7-4000-91b7-ce46a300a46a)
***
Below the chart is some important information as a headline, including how much total interest the user will pay by the end of the loan payment, the monthly payment, and the date the loan will be paid off(placeholder date)
![image](https://github.com/Mujanov3737/Amortization-Schedule/assets/75598761/b6bbdc86-b27d-4922-afeb-0ee1901c5173)
***
The user can now scroll to view the entire loan table that has contains various calculations on a month to month basis, from the total balance, to the total paid amount.
![image](https://github.com/Mujanov3737/Amortization-Schedule/assets/75598761/1d7eefbc-7f06-4b8e-ba45-ed635b31022a)
***
If the user wishes to submit another calculation, they can do so by first selecting the 'clear' button in the form, which is reset the data.
![mort_2](https://github.com/Mujanov3737/Amortization-Schedule/assets/75598761/26b87937-bc39-47a3-9dae-1cdb6b77fe27)



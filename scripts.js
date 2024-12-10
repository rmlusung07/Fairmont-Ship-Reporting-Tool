document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('toggle');
    const body = document.body;

    toggle.addEventListener('change', function() {
        body.classList.toggle('dark-mode', this.checked);
    });

    document.getElementById('NoonReport').style.display = 'block';

    const reportButtons = document.querySelectorAll('nav button');
    reportButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            openReport(event, button.getAttribute('onclick').split("'")[1]);
        });
    });

    resetTabContent('NoonReport');

    // Call the function to add custom validation for select elements
    addCustomValidationForSelectElements();

    // Restore drafts for all report sections
    restoreAllDrafts();
 
    // Handle dynamic form change noon section
    const reportTypeSelect = document.getElementById('noon-voyage-details-report-type');
    reportTypeSelect.addEventListener('change', function() {
        handleReportTypeChange(this.value);
    });

    //Handle dynamic form change departure section
    const departureTypeSelect = document.getElementById('departure-voyage-details-departure-type');
    const cospLabelDeparture = document.querySelector('label[for="departure-voyage-details-date-time"]');

    departureTypeSelect.addEventListener('change', function () {
        if (this.value === 'At Berth') {
            cospLabelDeparture.textContent = 'SBE Date/Time (LT):';
        } else if (this.value === 'Pilot Station') {
            cospLabelDeparture.textContent = 'COSP Date/Time (LT):';
        }
    });

    // Handle dynamic form change arrival section

    const arrivalTypeSelect = document.getElementById('arrival-voyage-details-arrival-type');
    const cospLabeArrival = document.querySelector('label[for="arrival-voyage-details-date-time"]');
    const berthSections = document.querySelectorAll('.berth-section');

    arrivalTypeSelect.addEventListener('change', function () {
        if (this.value === 'At Berth') {
            berthSections.forEach(section => {
                section.style.display = 'none';
                cospLabeArrival.textContent = 'FWE Date/Time (LT) :';
            });
        } else if (this.value === 'Pilot Station') {
            berthSections.forEach(section => {
                section.style.display = 'block';
                cospLabeArrival.textContent = 'EOSP Date/Time (LT) :';
            });
        }
    });

    // // Add the port search functionality for Crew Monitoring Plan Report fields
    // setupPortSearch('crew-monitoring-plan-port-1', 'crew-monitoring-plan-port-results-1');

    // // Add the port search functionality for Noon Report fields
    // setupPortSearch('noon-voyage-details-port', 'noon-voyage-details-port-results');
    // setupPortSearch('noon-voyage-itinerary-port', 'noon-voyage-itinerary-port-results');
    // setupPortSearch('noon-details-since-last-report-next-port', 'noon-details-since-last-report-next-port-results');

    // // Add the port search functionality for Departure Report fields
    // setupPortSearch('departure-voyage-details-departure-port', 'departure-voyage-details-departure-port-results');
    // setupPortSearch('departure-details-since-last-report-next-port', 'departure-details-since-last-report-next-port-results');
    // setupPortSearch('departure-voyage-itinerary-port', 'departure-voyage-itinerary-port-results');

    // // Add the port search functionality for Arrival, Bunkering and All fast Report fields
    // setupPortSearch('arrival-voyage-details-port', 'arrival-voyage-details-port-results');
    // setupPortSearch('bunkering-details-bunkering-port', 'bunkering-details-bunkering-port-results');
    // setupPortSearch('allfast-voyage-details-port', 'allfast-voyage-details-port-results');

    // // Add the port search functionality for Weekly Schedule Report fields
    // setupPortSearch('weekly-schedule-details-port-1', 'weekly-schedule-details-port-1-results');

    // Attach validation for latitude and longitude fields
    const latitudeFields = [
        'noon-voyage-details-latitude',
        'departure-voyage-details-latitude',
        'arrival-voyage-details-latitude',
        'bunkering-voyage-details-latitude',
        'allfast-voyage-details-latitude'
    ];

    const longitudeFields = [
        'noon-voyage-details-longitude',
        'departure-voyage-details-longitude',
        'arrival-voyage-details-longitude',
        'bunkering-voyage-details-longitude',
        'allfast-voyage-details-longitude'
    ];

    latitudeFields.forEach(id => {
        const field = document.getElementById(id);
        if (field) {
            field.addEventListener('blur', function() {
                validateAndFormatLatLong(field, 'latitude');
            });
        }
    });
    
    longitudeFields.forEach(id => {
        const field = document.getElementById(id);
        if (field) {
            field.addEventListener('blur', function() {
                validateAndFormatLatLong(field, 'longitude');
            });
        }
    });
    
});

// Function to add custom validation for select elements
function addCustomValidationForSelectElements() {
    const selectElements = document.querySelectorAll('select[required]');
    selectElements.forEach(select => {
        select.addEventListener('change', function() {
            if (this.value === '') {
                alert('Please choose another option');
            }
        });
    });
}

function handleReportTypeChange(reportSection) {
    const sections = document.querySelectorAll('.dynamic-section');
    sections.forEach(section => section.style.display = 'none');
    
    if (reportSection === 'At Sea') {
        document.getElementById('at-sea-section').style.display = 'block';
    } else if (reportSection === 'In Port') {
        document.getElementById('in-port-section').style.display = 'block';
    } else if (reportSection === 'At Anchorage') {
        document.getElementById('at-anchorage-section').style.display = 'block';
    }
}

async function exportToExcel(reportId) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(`${reportId} Report`);

    // Default styles
    const boldStyle = { bold: true };

    // Define headers (if necessary in the future)
    sheet.columns = [
        { header: 'Field Name', key: 'field', width: 25 },
        { header: 'Value', key: 'value', width: 30 }
    ];

    // Gather data from the form
    const form = document.querySelector(`#${reportId} form`);
    const fieldsets = form.querySelectorAll('fieldset');

    let rowIndex = 1;

    fieldsets.forEach(fieldset => {
        // Add legend as a bold header
        const legend = fieldset.querySelector('legend');
        if (legend) {
            sheet.mergeCells(`A${rowIndex}:B${rowIndex}`); // Merge cells for the legend
            sheet.getCell(`A${rowIndex}`).value = legend.textContent.trim();
            sheet.getCell(`A${rowIndex}`).font = boldStyle;
            sheet.getCell(`A${rowIndex}`).alignment = { vertical: 'middle', horizontal: 'left' };
            rowIndex++;
        }

        // Handle "Remarks" field dynamically
        const remarksField = Array.from(fieldset.querySelectorAll('textarea')).find(
            textarea => textarea.name.endsWith('remarks')
        ); // Dynamically detect "Remarks" field based on name attribute
        if (remarksField) {
            const remarksText = remarksField.value || '';
    
            // Merge a block of cells for the remarks field
            const startCell = `A${rowIndex}`;
            const endCell = `F${rowIndex + 9}`; // 10 rows by 6 columns for a balanced size
            sheet.mergeCells(`${startCell}:${endCell}`);
            const cell = sheet.getCell(startCell);
            cell.value = remarksText;
            cell.alignment = { wrapText: true, vertical: 'top', horizontal: 'left' };
            cell.font = { size: 12 };
    
            rowIndex += 10; // Move down 10 rows after remarks
        }

        // Collect IDs of inputs that are part of tables
        const tableInputs = Array.from(fieldset.querySelectorAll('table td input, table td select')).map(input => input.id);

        // Add inputs and labels that are not part of tables
        const inputs = Array.from(fieldset.querySelectorAll('input, select')).filter(input => {
            // Include only visible fields
            const style = window.getComputedStyle(input);
            return style.display !== 'none' && style.visibility !== 'hidden' && input.offsetParent !== null;
        });

        inputs.forEach(input => {
            if (!tableInputs.includes(input.id)) { // Exclude inputs within tables
                const label = fieldset.querySelector(`label[for="${input.id}"]`);
                const labelText = label ? label.textContent.trim() : input.name || input.id;

                // Dynamically detect "Master's Name" field
                const isMasterNameField = input.id.endsWith('master-name');
                const fieldLabel = isMasterNameField ? "Master's Name" : labelText;
                const fieldValue = input.value || '';

                sheet.addRow({ field: fieldLabel, value: fieldValue });
                rowIndex++;
            }
        });

        // Add a blank row after the inputs for spacing
        rowIndex++;

        // Handle tables in the fieldset
        const tables = fieldset.querySelectorAll('table');
        tables.forEach(table => {
            const thead = table.querySelector('thead');
            const tbody = table.querySelector('tbody');
        
            let headerRowIndex = rowIndex; // Start writing headers from the current rowIndex
        
            // Process table headers (thead)
            if (thead) {
                const headerMatrix = []; // To track the placement of headers
                const headerRows = thead.querySelectorAll('tr');
        
                headerRows.forEach((row, rowIdx) => {
                    let colIndex = 1;
        
                    row.querySelectorAll('th').forEach(th => {
                        const text = th.textContent.trim();
                        if (text.toLowerCase() === "action") return; // Skip the "Action" column
        
                        // Find the next available column in the matrix
                        while (headerMatrix[rowIdx]?.[colIndex]) {
                            colIndex++;
                        }
        
                        const colspan = parseInt(th.getAttribute('colspan') || 1, 10);
                        const rowspan = parseInt(th.getAttribute('rowspan') || 1, 10);
        
                        // Add the header text to the cell
                        const cell = sheet.getCell(headerRowIndex + rowIdx, colIndex);
                        cell.value = text;
                        cell.font = boldStyle;
                        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        
                        // Merge cells if colspan or rowspan is present
                        if (colspan > 1 || rowspan > 1) {
                            const endCol = colIndex + colspan - 1;
                            const endRow = headerRowIndex + rowIdx + rowspan - 1;
                            sheet.mergeCells(headerRowIndex + rowIdx, colIndex, endRow, endCol);
                        }
        
                        // Update the matrix to mark the cells occupied by this header
                        for (let r = 0; r < rowspan; r++) {
                            for (let c = 0; c < colspan; c++) {
                                if (!headerMatrix[rowIdx + r]) {
                                    headerMatrix[rowIdx + r] = [];
                                }
                                headerMatrix[rowIdx + r][colIndex + c] = true;
                            }
                        }
        
                        // Move to the next available column
                        colIndex += colspan;
                    });
                });
        
                // Update rowIndex to account for the number of header rows
                rowIndex += headerRows.length;
            }
        
            // Process table body (tbody)
            if (tbody) {
                const rows = tbody.querySelectorAll('tr');
                rows.forEach(row => {
                    const cells = Array.from(row.querySelectorAll('td')).map((td, index) => {
                        const headerText = table.querySelector(`thead th:nth-child(${index + 1})`)?.textContent.trim();
                        if (headerText?.toLowerCase() === "action") return null; // Skip the "Action" column
        
                        const input = td.querySelector('input');
                        const select = td.querySelector('select');
                        if (input) return input.value.trim();
                        if (select) return select.options[select.selectedIndex].text.trim();
                        return td.textContent.trim(); // Fallback to textContent
                    });
        
                    // Filter out null values from skipped columns
                    const filteredCells = cells.filter(cell => cell !== null);
        
                    // Write the row data to the sheet
                    sheet.addRow(filteredCells);
                    rowIndex++;
                });
            }
        
            // Add a blank row after the table for spacing
            rowIndex++;
        });
        
    });

    // Auto-adjust column widths with specific handling for the Remarks field
    sheet.columns.forEach((column, colIndex) => {
        let maxLength = 0;

        column.eachCell({ includeEmpty: true }, cell => {
            if (cell.value) {
                const valueLength = cell.value.toString().length;
                if (valueLength > maxLength) {
                    maxLength = valueLength;
                }
            }
        });

        // Limit the maximum width for all columns to ensure readability
        if (column.values.some(value => typeof value === 'string' && value.includes('Remarks'))) {
            column.width = Math.min(maxLength + 2, 38); // Limit Remarks columns to a max of 38
        } else {
            column.width = Math.min(maxLength + 2, 18); // Limit all other columns to a max of 30
        }
    });

    // Trigger the download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${reportId}_Export.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


function clearAllTableSets(totalSets) {
    for (let i = 1; i <= totalSets; i++) {
        removeTableSet(i);
    }
}

// Function to clear form fields
function clearFormFields(reportId) {
    const form = document.querySelector(`#${reportId} form`);
    form.reset();

    const selectElements = form.querySelectorAll('select');
    selectElements.forEach(select => {
        select.selectedIndex = 0;
    });
}

function clearFields(reportId) {
    const form = document.querySelector(`#${reportId} form`);

    // Clear the form fields after exporting the data
    clearFormFields(reportId);

    // Clear saved local storage
    localStorage.clear();

    // Reset the display for sections
    document.querySelectorAll('.at-sea-section').forEach(function(element) {
        element.style.display = 'flex';
    });
    document.querySelectorAll('.at-sea-section-fieldset').forEach(function(element) {
        element.style.display = 'block';
    });
    document.querySelectorAll('.in-port-section').forEach(function(element) {
        element.style.display = 'flex';
    });

    // *** Clear rows in the All Fast ROBs table ***
    if (reportId === 'AllFast') { // Ensure this only applies to the All Fast report
        var allFastRobTable = document.getElementById('allFastRobTableBody');  // Replace with your actual table body ID for All Fast ROBs
        if (allFastRobTable) {
            var allFastRows = allFastRobTable.getElementsByTagName('tr');
            var allFastRowCount = allFastRows.length;
            
            // Loop to remove rows except for the first one
            for (var x = allFastRowCount - 1; x > 0; x--) {
                allFastRobTable.removeChild(allFastRows[x]);
            }
        }
    }

    // *** Clear rows in the ROB Details table for the Noon report ***
    if (reportId === 'NoonReport') { // Ensure this only applies to the Noon report
        var noonRobTable = document.getElementById('robDetailsTableBody');  // Replace with your actual table body ID for ROB Details in Noon report
        if (noonRobTable) {
            var noonRobRows = noonRobTable.getElementsByTagName('tr');
            var noonRobRowCount = noonRobRows.length;
            
            // Loop to remove rows except for the first one
            for (var y = noonRobRowCount - 1; y > 0; y--) {
                noonRobTable.removeChild(noonRobRows[y]);
            }
        }
    }
}


function openReport(evt, reportName) {
    const reportSections = document.querySelectorAll(".report-section");
    const reportButtons = document.querySelectorAll('nav button');

    reportSections.forEach(section => section.style.display = "none");
    reportButtons.forEach(button => button.classList.remove("active"));

    document.getElementById(reportName).style.display = "block";
    evt.currentTarget.classList.add("active");

    resetTabContent(reportName);
}

function resetTabContent(reportName) {
    const tabcontent = document.querySelectorAll(`#${reportName} .tab-content`);
    const tablinks = document.querySelectorAll(`#${reportName} .w3-button`);

    tabcontent.forEach(content => content.style.display = "none");
    tablinks.forEach(link => link.classList.remove("w3-theme"));

    const hsfoTab = document.querySelector(`#${reportName} .tab-content.hsfo`);
    const hsfoButton = document.querySelector(`#${reportName} .w3-button.hsfo`);

    if (hsfoTab) hsfoTab.style.display = "block";
    if (hsfoButton) hsfoButton.classList.add("w3-theme");
}

// // Function to switch between port tabs
// function openPortTab(event, portId) {
//     // Hide all port tabs
//     const allPortTabs = document.querySelectorAll('.port-tab-content');
//     allPortTabs.forEach(tab => {
//         tab.style.display = 'none';
//     });

//     // Remove 'active' class from all buttons
//     const allButtons = document.querySelectorAll('.tab-link');
//     allButtons.forEach(button => {
//         button.classList.remove('active');
//     });

//     // Show the selected port tab
//     const selectedTab = document.getElementById(portId);
//     if (selectedTab) {
//         selectedTab.style.display = 'flex';
//     }

//     // Add 'active' class to the clicked button
//     event.currentTarget.classList.add('active');
// }

// // Show Port 1 by default on page load
// openPortTab({ currentTarget: document.querySelector('.tab-link.active') }, 'Port1');

// JavaScript function to dynamically add rows to the Port of Call table
function addRowPortOfCall() {
    const table = document.getElementById('portOfCallTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    for (let i = 0; i < 13; i++) {
        const newCell = newRow.insertCell(i);
        const input = document.createElement('input');
        input.type = 'text';
        newCell.appendChild(input);
    }
}

// Set up event listeners only once when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const robNavButtons = document.querySelectorAll('.w3-bar-item.w3-button');

    robNavButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove the 'active' class from all buttons
            robNavButtons.forEach(btn => btn.classList.remove('active'));

            // Add the 'active' class to the clicked button
            this.classList.add('active');
        });
    });
});

function openTab(evt, tabName) {
    evt.preventDefault();
    const form = evt.target.closest('form');
    const elements = form.elements;

    Array.from(elements).forEach(element => {
        element.setAttribute('data-required', element.required);
        element.required = false;
    });

    document.querySelectorAll(".tab-content").forEach(content => content.style.display = "none");
    document.querySelectorAll(".w3-button").forEach(link => link.classList.remove("w3-theme"));

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.classList.add("w3-theme");

    setTimeout(() => {
        Array.from(elements).forEach(element => {
            element.required = element.getAttribute('data-required') === 'true';
        });
    }, 0);

    evt.target.blur();
}

let crewCounter = 2;

function openTabCrew(evt, tabName) {
    evt.preventDefault();
    const form = evt.target.closest('form');
    const elements = form.elements;

    // Temporarily remove the 'required' attribute to avoid form validation issues
    Array.from(elements).forEach(element => {
        element.setAttribute('data-required', element.required);
        element.required = false;
    });

    // Hide all tabs and remove the active class from all buttons
    document.querySelectorAll(".crew-tab-content").forEach(content => {
        content.style.display = "none";
        content.removeAttribute('data-active'); // Remove the active status
    });
    document.querySelectorAll(".w3-bar-item").forEach(link => link.classList.remove("w3-theme"));

    // Show the selected tab and add active class to the clicked button
    const activeTab = document.getElementById(tabName);
    activeTab.style.display = "block";
    activeTab.setAttribute('data-active', 'true'); // Set the active status

    evt.currentTarget.classList.add("w3-theme");

    // Restore the 'required' attributes after a short delay
    setTimeout(() => {
        Array.from(elements).forEach(element => {
            element.required = element.getAttribute('data-required') === 'true';
        });
    }, 0);

    console.log("Switched to tab:", tabName); // Debugging
}


// Declare separate counters for each tab
let onboardCrewCounter = 2;   // Counter for "On Board Crew"
let crewChangeDataCounter = 2; // Counter for "Crew Change Data"

function addCrewFieldset() {
    // Find the tab that has the data-active attribute set to "true"
    const activeTab = document.querySelector('.crew-tab-content[data-active="true"]');
    const activeTabId = activeTab.id; // Get the ID of the active tab
    console.log("Active Tab ID:", activeTabId); // Debugging

    let newFieldsetContent = '';
    let crewCounter;

    // Use the appropriate counter for each tab
    if (activeTabId === 'OnBoardCrew') {
        crewCounter = onboardCrewCounter; // Use On Board Crew counter
        newFieldsetContent = `
            <fieldset>
                <legend>On Board Crew Data ${crewCounter}</legend>
                <div class="four-columns">
                    <div class="form-group">
                        <label for="crew-monitoring-plan-crew-no-${crewCounter}">No</label>
                        <input type="number" id="crew-monitoring-plan-crew-no-${crewCounter}" name="crew-monitoring-plan-crew-no-${crewCounter}">
                    </div>
                    <div class="form-group common-select-container">
                        <label for="crew-monitoring-plan-vessel-name-${crewCounter}">Vessel Name</label>
                        <select class="common-select" id="crew-monitoring-plan-vessel-name-${crewCounter}" name="crew-monitoring-plan-vessel-name-${crewCounter}" required>
                            <option value="">Select Vessel</option>
                            <option value="Kellet Island">Kellett Island</option>
                            <option value="Trident Star">Trident Star</option>
                            <option value="Weco Laura">Weco Laura</option>
                            <option value="CMB Permeke">CMB Permeke</option>
                            <option value="Cape Magnolia">Cape Magnolia</option>
                            <option value="Andalucia">Andalucia</option>
                            <option value="Brilliant Express">Brilliant Express</option>
                            <option value="Aquarius Ace">Aquarius Ace</option>
                            <option value="City of St Petersburg">City of St.Petersburg</option>
                            <option value="City of Rotterdam">City of Rotterdam</option>
                            <option value="World Spirit">World Spirit</option>
                            <option value="United Spirit">United Spirit</option>
                            <option value="Glengyle">Glengyle</option>
                            <option value="HSL Chicago">HSL Chicago</option>
                            <option value="ETG Southern Cross">ETG Southern Cross</option>
                            <option value="Dream Sky">Dream Sky</option>
                            <option value="Infinity Sky">Infnity Sky</option>
                            <option value="Cape Acacia">Cape Acacia</option>
                            <option value="Cape Jasmine">Cape Jasmine</option>
                            <option value="CL Tomo">CL Tomo</option>
                            <option value="Maple Harvest">Maple Harvest</option>
                            <option value="World Swan II">World Swan II</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="crew-monitoring-plan-crew-surname-${crewCounter}">Crew Surname</label>
                        <input type="text" id="crew-monitoring-plan-crew-surname-${crewCounter}" name="crew-monitoring-plan-crew-surname-${crewCounter}">
                    </div>
                    <div class="form-group">
                        <label for="crew-monitoring-plan-crew-first-name-${crewCounter}">Crew First Name</label>
                        <input type="text" id="crew-monitoring-plan-crew-first-name-${crewCounter}" name="crew-monitoring-plan-crew-first-name-${crewCounter}">
                    </div>
                    <div class="form-group">
                        <label for="crew-monitoring-plan-rank-${crewCounter}">Rank</label>
                        <input type="text" id="crew-monitoring-plan-rank-${crewCounter}" name="crew-monitoring-plan-rank-${crewCounter}">
                    </div>
                    <div class="form-group">
                        <label for="crew-monitoring-plan-crew-nationality-${crewCounter}">Crew Nationality</label>
                        <input type="text" id="crew-monitoring-plan-crew-nationality-${crewCounter}" name="crew-monitoring-plan-crew-nationality-${crewCounter}">
                    </div>
                    <div class="form-group">
                        <label for="crew-monitoring-plan-joining-date-${crewCounter}">Joining Date</label>
                        <input type="date" id="crew-monitoring-plan-joining-date-${crewCounter}" name="crew-monitoring-plan-joining-date-${crewCounter}">
                    </div>
                    <div class="form-group">
                        <label for="crew-monitoring-plan-contract-completion-date-${crewCounter}">Contract Completion Date</label>
                        <input type="date" id="crew-monitoring-plan-contract-completion-date-${crewCounter}" name="crew-monitoring-plan-contract-completion-date-${crewCounter}">
                    </div>
                    <div class="form-group">
                        <label for="crew-monitoring-plan-current-date-${crewCounter}">Current Date</label>
                        <input type="date" id="crew-monitoring-plan-current-date-${crewCounter}" name="crew-monitoring-plan-current-date-${crewCounter}">
                    </div>
                    <div class="form-group">
                        <label for="crew-monitoring-plan-days-to-completion-${crewCounter}">Days to Contract Completion</label>
                        <input type="number" id="crew-monitoring-plan-days-to-completion-${crewCounter}" name="crew-monitoring-plan-days-to-completion-${crewCounter}">
                    </div>
                    <div class="form-group">
                        <label for="crew-monitoring-plan-months-on-board-${crewCounter}">No of Months On Board</label>
                        <input type="number" id="crew-monitoring-plan-months-on-board-${crewCounter}" name="crew-monitoring-plan-months-on-board-${crewCounter}">
                    </div>
                </div>
            </fieldset>`;

        onboardCrewCounter++; // Increment the On Board Crew counter for the next crew member

    } else if (activeTabId === 'CrewChangeData') {
        crewCounter = crewChangeDataCounter; // Use Crew Change Data counter
        newFieldsetContent = `
            <fieldset>
                <legend>Crew Change Data ${crewCounter}</legend>
                <div class="four-columns">
                    <div class="form-group common-select-container">
                        <label for="crew-monitoring-plan-vessel-${crewCounter}">Vessel</label>
                        <select class="common-select" id="crew-monitoring-plan-vessel-${crewCounter}" name="crew-monitoring-plan-vessel-${crewCounter}" required>
                            <option value="">Select Vessel</option>
                            <option value="Kellet Island">Kellett Island</option>
                            <option value="Trident Star">Trident Star</option>
                            <option value="Weco Laura">Weco Laura</option>
                            <option value="CMB Permeke">CMB Permeke</option>
                            <option value="Cape Magnolia">Cape Magnolia</option>
                            <option value="Andalucia">Andalucia</option>
                            <option value="Brilliant Express">Brilliant Express</option>
                            <option value="Aquarius Ace">Aquarius Ace</option>
                            <option value="City of St Petersburg">City of St.Petersburg</option>
                            <option value="City of Rotterdam">City of Rotterdam</option>
                            <option value="World Spirit">World Spirit</option>
                            <option value="United Spirit">United Spirit</option>
                            <option value="Glengyle">Glengyle</option>
                            <option value="HSL Chicago">HSL Chicago</option>
                            <option value="ETG Southern Cross">ETG Southern Cross</option>
                            <option value="Dream Sky">Dream Sky</option>
                            <option value="Infinity Sky">Infnity Sky</option>
                            <option value="Cape Acacia">Cape Acacia</option>
                            <option value="Cape Jasmine">Cape Jasmine</option>
                            <option value="CL Tomo">CL Tomo</option>
                            <option value="Maple Harvest">Maple Harvest</option>
                            <option value="World Swan II">World Swan II</option>
                        </select>
                    </div>
                    <div class="form-group port-style">
                        <label for="crew-monitoring-plan-port-${crewCounter}">Port</label>
                        <input type="text" class="crew-monitoring-plan-port" id="crew-monitoring-plan-port-${crewCounter}" name="crew-monitoring-plan-port-${crewCounter}">
                        // <div id="crew-monitoring-plan-port-results-${crewCounter}" class="crew-monitoring-plan-port-results"></div>
                    </div>
                    <div class="form-group">
                        <label for="crew-monitoring-plan-country-${crewCounter}">Country</label>
                        <input type="text" id="crew-monitoring-plan-country-${crewCounter}" name="crew-monitoring-plan-country-${crewCounter}">
                    </div>
                    <div class="form-group">
                        <label for="crew-monitoring-plan-joiners-boarding-date-${crewCounter}">Date of Joiners Boarding</label>
                        <input type="date" id="crew-monitoring-plan-joiners-boarding-date-${crewCounter}" name="crew-monitoring-plan-joiners-boarding-date-${crewCounter}">
                    </div>
                    <div class="form-group">
                        <label for="crew-monitoring-plan-offsigners-signoff-date-${crewCounter}">Date of Off-signers Sign Off</label>
                        <input type="date" id="crew-monitoring-plan-offsigners-signoff-date-${crewCounter}" name="crew-monitoring-plan-offsigners-signoff-date-${crewCounter}">
                    </div>
                    <div class="form-group">
                        <label for="crew-monitoring-plan-joiners-rank-${crewCounter}">Joiners Ranks</label>
                        <input type="text" id="crew-monitoring-plan-joiners-rank-${crewCounter}" name="crew-monitoring-plan-joiners-rank-${crewCounter}">
                    </div>
                    <div class="form-group">
                        <label for="crew-monitoring-plan-offsigners-rank-${crewCounter}">Off-Signers Ranks</label>
                        <input type="text" id="crew-monitoring-plan-offsigners-rank-${crewCounter}" name="crew-monitoring-plan-offsigners-rank-${crewCounter}">
                    </div>
                    <div class="form-group">
                        <label for="crew-monitoring-plan-total-crew-change-${crewCounter}">Total Crew Change</label>
                        <input type="number" id="crew-monitoring-plan-total-crew-change-${crewCounter}" name="crew-monitoring-plan-total-crew-change-${crewCounter}">
                    </div>
                    <div class="form-group">
                        <label for="crew-monitoring-plan-reason-for-change-${crewCounter}">Reason for Change</label>
                        <input type="text" id="crew-monitoring-plan-reason-for-change-${crewCounter}" name="crew-monitoring-plan-reason-for-change-${crewCounter}">
                    </div>
                    <div class="form-group">
                        <label for="crew-monitoring-plan-remarks-${crewCounter}">Remarks</label>
                        <textarea id="crew-monitoring-plan-remarks-${crewCounter}" name="crew-monitoring-plan-remarks-${crewCounter}" rows="4" style="height: 15px; width: 97%;"></textarea>
                    </div>
                </div>
            </fieldset>`;
          
        crewChangeDataCounter++; // Increment the Crew Change Data counter for the next crew member
        
    }

    if (newFieldsetContent) {
        // Insert the new fieldset content into the active tab
        document.getElementById(activeTabId).insertAdjacentHTML('beforeend', newFieldsetContent);

        // Add the port search functionality for Crew Monitoring Plan Report fields
        setupPortSearch('crew-monitoring-plan-port-' + crewCounter, 'crew-monitoring-plan-port-results-' + crewCounter);
    } else {
        console.log("No fieldset content generated");
    }
}

let currentStep = 1;

function navigateStep(step) {
    const steps = document.querySelectorAll('.step-content');
    const stepIndicators = document.querySelectorAll('.step'); // Assuming you have step indicators for each step
    let currentStep = document.querySelector('.step-content.active');
    let currentIndex = Array.from(steps).indexOf(currentStep);

    // Hide the current step
    currentStep.classList.remove('active');
    currentStep.style.display = 'none';
    stepIndicators[currentIndex].classList.remove('active'); // Remove active class from step indicator

    // Calculate the next step index
    let nextIndex = currentIndex + step;

    // Show the next step
    steps[nextIndex].classList.add('active');
    steps[nextIndex].style.display = 'block';
    stepIndicators[nextIndex].classList.add('active'); // Add active class to the next step indicator

    // Handle the navigation buttons
    if (nextIndex === steps.length - 1) {
        document.getElementById('finish-button').style.display = 'none'; // Hide Finish button on the last step
        document.getElementById('kpi-submit').style.display = 'inline-block'; // Show Submit button
    } else {
        document.getElementById('finish-button').style.display = 'inline-block'; // Show Finish button
        document.getElementById('kpi-submit').style.display = 'none'; // Hide Submit button
    }

    // Disable the "Previous" button on the first step
    document.querySelector('.prev-step').disabled = (nextIndex === 0);

    // Optional: If needed, adjust the stepper line logic here (e.g., changing the connector line color)
    updateStepperLines(nextIndex); // Assuming you have a function that handles line updates
}

function addRowAllFast() {
    const tableBodyAllFast = document.getElementById('allFastRobTableBody');
    const newRowAllFast = document.createElement('tr');
    newRowAllFast.innerHTML = `
        <td><input class="validate allfast-new-row" type="text" name="allfast-rob-hsfo" required></td>
        <td><input class="validate allfast-new-row" type="text" name="allfast-rob-biofuel" required></td>
        <td><input class="validate allfast-new-row" type="text" name="allfast-rob-vlsfo" required></td>
        <td><input class="validate allfast-new-row" type="text" name="allfast-rob-lsmgo" required></td>
        <td><button type="button" class="remove-button" onclick="removeRow(this)">Remove</button></td>
    `;
    tableBodyAllFast.appendChild(newRowAllFast);
}

function removeNewRowsAllFast() {
    const tableBodyAllFast = document.getElementById('allFastRobTableBody');
    const newRows = tableBodyAllFast.querySelectorAll('tr');

    // Iterate through all the rows and check if they contain any input fields with the 'allfast-new-row' class
    newRows.forEach(row => {
        const newRowInputs = row.querySelectorAll('.allfast-new-row');
        if (newRowInputs.length > 0) {
            row.remove();
        }
    });
}

let tankNumber = 1;
const maxRowsRobTank = 30;

function addRowRobDetail(button) {
    const tableBody = document.getElementById('robDetailsTableBody'); // Directly select the table body
    const rowCount = tableBody.querySelectorAll('tr').length; // Get the current number of rows

    if (rowCount >= maxRowsRobTank) { 
        alert('Maximum of 20 rows reached!'); // Alert if the limit is reached
        return; // Exit the function if the limit is reached
    }

    if (tableBody) {

        const newRowRobDetail = document.createElement('tr');
        const newTankNumber = rowCount + 1; // The next tank number should be the current count + 1

        newRowRobDetail.innerHTML = `
            <td id="noon-rob-details-tank-${newTankNumber}-number" name="noon-rob-details-tank-${newTankNumber}-number">${newTankNumber}</td>
            <td><input type="text" id="noon-rob-details-tank-${newTankNumber}-description" name="noon-rob-details-tank-${newTankNumber}-description" placeholder="Enter tank name here"></td>
            <td class="fuel-grade-select-cell">
                <select class="fuel-grade-select" id="noon-rob-details-tank-${newTankNumber}-fuel-grade" name="noon-rob-details-tank-${newTankNumber}-fuel-grade">
                    <option value="-1">Select</option>
                    <option value="hsfo">HSFO</option>
                    <option value="biofuel">BIO FUEL</option>
                    <option value="vlsfo">VLSFO</option>
                    <option value="lsmgo">LSMGO</option>
                </select>
            </td>
            <td><input class="validate" type="text" id="noon-rob-details-tank-${newTankNumber}-capacity" name="noon-rob-details-tank-${newTankNumber}-capacity" placeholder="Enter tank capacity"></td>
            <td class="unit-select-cell">
                <select class="unit-select" id="noon-rob-details-tank-${newTankNumber}-unit" name="noon-rob-details-tank-${newTankNumber}-unit">
                    <option value="MT">MT</option>
                    <option value="liters">L</option>
                    <option value="gallons">GAL</option>
                </select>
            </td>
            <td><input class="validate" type="text" id="noon-rob-details-tank-${newTankNumber}-rob" name="noon-rob-details-tank-${newTankNumber}-rob"></td>
            <td><input class="supply-date-cell" type="datetime-local" id="noon-rob-details-tank-${newTankNumber}-date-time" name="noon-rob-details-tank-${newTankNumber}-date-time"></td>
            <td><button type="button" class="remove-button" onclick="removeRow(this)">Remove</button></td>
        `;

        tableBody.appendChild(newRowRobDetail);
    }
}

const maxAgentRows = 12;

function addRowWeeklyReportAgent(button) {
    // Identify the closest table body where the button is clicked
    const tableBody = button.closest('tbody');
    const rowCount = tableBody.querySelectorAll('tr').length;

    // Check if the row count exceeds the limit
    if (rowCount >= maxAgentRows) {
        alert('Maximum of 12 rows reached for agents!');
        return;
    }

    const newRow = document.createElement('tr');
    const newRowNumber = rowCount + 1;

    newRow.innerHTML = `
        <td><input class="weekly-new-row" type="text" id="weekly-schedule-details-agent-name-${newRowNumber}" name="weekly-schedule-details-agent-name-${newRowNumber}"></td>
        <td><input class="weekly-new-row" type="text" id="weekly-schedule-details-agent-address-${newRowNumber}" name="weekly-schedule-details-agent-address-${newRowNumber}"></td>
        <td><input class="weekly-new-row" type="text" id="weekly-schedule-details-agent-pic-name-${newRowNumber}" name="weekly-schedule-details-agent-pic-name-${newRowNumber}"></td>
        <td><input class="weekly-new-row" type="text" id="weekly-schedule-details-agent-telephone-${newRowNumber}" name="weekly-schedule-details-agent-telephone-${newRowNumber}"></td>
        <td><input class="weekly-new-row" type="text" id="weekly-schedule-details-agent-mobile-${newRowNumber}" name="weekly-schedule-details-agent-mobile-${newRowNumber}"></td>
        <td><input class="weekly-new-row" type="text" id="weekly-schedule-details-agent-email-${newRowNumber}" name="weekly-schedule-details-agent-email-${newRowNumber}"></td>
        <td><button type="button" class="remove-button" onclick="removeRow(this)">Remove</button></td>
    `;

    tableBody.appendChild(newRow);
}

function removeNewRowsWeeklyReportAgent() {
    const tableBody = document.getElementById('weeklyReportAgentTableBody'); // Replace this with the correct ID if different
    const newRows = tableBody.querySelectorAll('tr');

    // Iterate through all the rows and check if they contain any input fields with the 'weekly-new-row' class
    newRows.forEach(row => {
        const newRowInputs = row.querySelectorAll('.weekly-new-row');
        if (newRowInputs.length > 0) {
            row.remove();
        }
    });
}

function removeRow(button) {
    button.closest('tr').remove();
}

const portOfCallMaxAgentRows = 12;

function addRowPortOfCallAgent(button, setNumber) {
    // Identify the closest table body where the button is clicked
    const tableBody = button.closest('tbody');
    const rowCount = tableBody.querySelectorAll('tr').length;

    // Check if the row count exceeds the limit
    if (rowCount >= portOfCallMaxAgentRows) {
        alert('Maximum of 12 rows reached for agents!');
        return;
    }

    const newRow = document.createElement('tr');
    const newRowNumber = rowCount + 1;

    newRow.innerHTML = `
        <td><input type="text" id="port-of-calls-port-of-calling-${newRowNumber}" name="port-of-calls-port-of-calling-${newRowNumber}"></td>
        <td><input type="text" id="port-of-calls-country-${newRowNumber}" name="port-of-calls-country-${newRowNumber}"></td>
        <td><input type="text" id="port-of-calls-purpose-${newRowNumber}" name="port-of-calls-purpose-${newRowNumber}"></td>
        <td><input type="text" id="port-of-calls-ata-eta-date-${newRowNumber}" name="port-of-calls-ata-eta-date-${newRowNumber}"></td>
        <td><input type="text" id="port-of-calls-ata-eta-time-${newRowNumber}" name="port-of-calls-ata-eta-time-${newRowNumber}"></td>
        <td><input type="text" id="port-of-calls-ship-information-date-${newRowNumber}" name="port-of-calls-ship-information-date-${newRowNumber}"></td>
        <td><input type="text" id="port-of-calls-ship-information-time-${newRowNumber}" name="port-of-calls-ship-information-time-${newRowNumber}"></td>
        <td><input type="text" id="port-of-calls-gmt-${newRowNumber}" name="port-of-calls-gmt-${newRowNumber}"></td>
        <td><input type="text" id="port-of-calls-duration-${newRowNumber}" name="port-of-calls-duration-${newRowNumber}"></td>
        <td><input type="text" id="port-of-calls-total-${newRowNumber}" name="port-of-calls-total-${newRowNumber}"></td>
        <td><button type="button" class="remove-button" onclick="removeRow(this)">Remove</button></td>
    `;

    tableBody.appendChild(newRow);
}


function removeNewRowsPortOfCallAgent(setNumber) {
    const tableBody = document.getElementById(`portOfCallAgentTableBody-${setNumber}`); // Replace this with the correct ID
    const newRows = tableBody.querySelectorAll('tr');

    // Iterate through all the rows and check if they contain any input fields with the 'port-of-calls-new-row' class
    newRows.forEach(row => {
        const newRowInputs = row.querySelectorAll('.port-of-calls-new-row');
        if (newRowInputs.length > 0) {
            row.remove();
        }
    });
}

let portSetNumber = 1;

function addRowWeeklyReportNewPort() {
    const tableBody = document.getElementById('weeklyReportPortTableBody');
    const maxRows = 20;
    
    // Count all the port sets (i.e., how many sets of rows have been added)
    const rowCount = document.querySelectorAll('[id^="tableSet-"]').length;

    // Check if the row count exceeds or meets the limit
    if (rowCount >= maxRows) {
        alert('You can only add up to 20 ports.');
        return; // Stop the function execution if the limit is reached
    }

    // Increment the set number to ensure unique IDs for each new set of tables
    portSetNumber++;

    const newPortFieldId = `weekly-schedule-details-port-${portSetNumber}-1`;  // Define the port input field ID
    const newResultFieldId = `weekly-schedule-details-port-${portSetNumber}-1-results`;  // Define the results div ID

    const newPortTableHTML = `
        <div id="tableSet-${portSetNumber}">
            <table id="weeklyReportTable-${portSetNumber}">
                <br />
                <thead id="weeklyReportTableHead">
                    <tr>
                        <th>PORT</th>
                        <th>ACTIVITY</th>
                        <th>ETA/ETB</th>
                        <th>ETCD</th>
                        <th>CARGO</th>
                        <th>CARGO QTY</th>
                        <th>REMARKS</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <input type="text" id="${newPortFieldId}" name="weekly-schedule-details-port-${portSetNumber}-1">
                            // <div id="${newResultFieldId}" class="weekly-port-search-results"></div>
                        </td>
                        <td class="fuel-grade-select-cell">
                            <select class="fuel-grade-select" id="weekly-schedule-details-activity-port-${portSetNumber}-1" name="weekly-schedule-details-activity-port-${portSetNumber}-1">
                                <option value="">Select</option>
                                <option value="Loading">Loading</option>
                                <option value="Bunkering">Bunkering</option>
                                <option value="Discharging">Discharging</option>
                            </select>
                        </td>
                        <td><input class="supply-date-cell" type="datetime-local" id="weekly-eta-etb-port-${portSetNumber}-1-date-time" name="weekly-eta-etb-port-${portSetNumber}-1-date-time"></td>
                        <td><input class="supply-date-cell" type="datetime-local" id="weekly-etcd-port-${portSetNumber}-1-date-time" name="weekly-etcd-port-${portSetNumber}-1-date-time"></td>
                        <td class="fuel-grade-select-cell">
                            <select class="fuel-grade-select" id="weekly-schedule-details-cargo-port-${portSetNumber}-1" name="weekly-schedule-details-cargo-port-${portSetNumber}-1">
                                <option value="">Select</option>
                                <option value="Coal">Coal</option>
                                <option value="Oil">Oil</option>
                            </select>
                        </td>
                        <td><input type="text" id="weekly-schedule-details-cargo-qty-port-${portSetNumber}-1" name="weekly-schedule-details-cargo-qty-port-${portSetNumber}-1"></td>
                        <td><input type="text" id="weekly-schedule-details-remarks-port-${portSetNumber}-1" name="weekly-schedule-details-remarks-port-${portSetNumber}-1"></td>
                    </tr>
                </tbody>
            </table>
            <br />
            <table id="weeklyReportTableAgents-${portSetNumber}">
                <thead>
                    <tr>s
                        <th>Agent's Name</th>
                        <th>Address</th>
                        <th>PIC Name</th>
                        <th>Telephone</th>
                        <th>Mobile</th>
                        <th>Email</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="weeklyReportPortTableBody">
                    <tr>
                        <td><input type="text" id="weekly-schedule-details-agent-name-${portSetNumber}-1" name="weekly-schedule-details-agent-name-${portSetNumber}-1"></td>
                        <td><input type="text" id="weekly-schedule-details-agent-address-${portSetNumber}-1" name="weekly-schedule-details-agent-address-${portSetNumber}-1"></td>
                        <td><input type="text" id="weekly-schedule-details-agent-pic-name-${portSetNumber}-1" name="weekly-schedule-details-agent-pic-name-${portSetNumber}-1"></td>
                        <td><input type="text" id="weekly-schedule-details-agent-telephone-${portSetNumber}-1" name="weekly-schedule-details-agent-telephone-${portSetNumber}-1"></td>
                        <td><input type="text" id="weekly-schedule-details-agent-mobile-${portSetNumber}-1" name="weekly-schedule-details-agent-mobile-${portSetNumber}-1"></td>
                        <td><input type="text" id="weekly-schedule-details-agent-email-${portSetNumber}-1" name="weekly-schedule-details-agent-email-${portSetNumber}-1"></td>
                        <td><button type="button" class="add-row-button" onclick="addRowWeeklyReportAgent(this)">Add Agent</button></td>
                    </tr>
                </tbody>
                <br />
            </table>
            <br />
            <button type="button" class="remove-button right-remove-button" onclick="removeTableSet(${portSetNumber})">Remove Port Set</button> 
        </div>`;

    // Append the new set of tables to the document body or a specific container
    document.getElementById('newTableContainer').insertAdjacentHTML('beforeend', newPortTableHTML);

    // Reapply the search function for the new port field after appending
    setupPortSearch(newPortFieldId, newResultFieldId);

    // Add the port search functionality for Weekly Schedule Report fields
    setupPortSearch('weekly-schedule-details-port-' + portSetNumber, 'weekly-schedule-details-port-' + portSetNumber + '-results');
}

function removeTableSet(setNumber) {
    const tableSet = document.getElementById(`tableSet-${setNumber}`);
    if (tableSet) {
        tableSet.remove();
    }
}

function addRowPortOfCallNewPort() {
    const maxRows = 50;
    
    // Count all the port sets (i.e., how many sets of rows have been added)
    const rowCount = document.querySelectorAll('[id^="portTableSet-"]').length;

    // Check if the row count exceeds or meets the limit
    if (rowCount >= maxRows) {
        alert('You can only add up to 20 ports.');
        return; // Stop the function execution if the limit is reached
    }

    // Increment the set number to ensure unique IDs for each new set of tables
    portSetNumber++;

    const newPortFieldId = `port-of-calls-port-of-calling-${portSetNumber}`;  // Define the port input field ID
    const newResultFieldId = `port-of-calls-port-of-calling-${portSetNumber}-results`;  // Define the results div ID

    const newPortTableHTML = `
        <div id="portTableSet-${portSetNumber}">
            <table id="portOfCallTable-${portSetNumber}">
                <br />
                <thead id="portOfCallTableHead">
                    <tr>
                        <th rowspan="2">Port of calling</th>
                        <th rowspan="2">Country</th>
                        <th rowspan="2">Purpose</th>
                        <th colspan="2">ATA/ETA</th>
                        <th colspan="2">Ship's Information</th>
                        <th rowspan="2">GMT</th>
                        <th rowspan="1">Duration</th>
                        <th rowspan="1">Total</th>
                        <th rowspan="2">Action</th>
                    </tr>
                    <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>(DAYS)</th>
                        <th>(DAYS)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><input type="text" id="port-of-calls-port-of-calling-${portSetNumber}" name="port-of-calls-port-of-calling-${portSetNumber}"></td>
                        <td><input type="text" id="port-of-calls-country-${portSetNumber}" name="port-of-calls-country-${portSetNumber}"></td>
                        <td><input type="text" id="port-of-calls-purpose-${portSetNumber}" name="port-of-calls-purpose-${portSetNumber}"></td>
                        <td><input type="text" id="port-of-calls-ata-eta-date-${portSetNumber}" name="port-of-calls-ata-eta-date-${portSetNumber}"></td>
                        <td><input type="text" id="port-of-calls-ata-eta-time-${portSetNumber}" name="port-of-calls-ata-eta-time-${portSetNumber}"></td>
                        <td><input type="text" id="port-of-calls-ship-information-date-${portSetNumber}" name="port-of-calls-ship-information-date-${portSetNumber}"></td>
                        <td><input type="text" id="port-of-calls-ship-information-time-${portSetNumber}" name="port-of-calls-ship-information-time-${portSetNumber}"></td>
                        <td><input type="text" id="port-of-calls-gmt-${portSetNumber}" name="port-of-calls-gmt-${portSetNumber}"></td>
                        <td><input type="text" id="port-of-calls-duration-${portSetNumber}" name="port-of-calls-duration-${portSetNumber}"></td>
                        <td><input type="text" id="port-of-calls-total-${portSetNumber}" name="port-of-calls-total-${portSetNumber}"></td>
                        <td><button type="button" class="add-row-button" onclick="addRowPortOfCallAgent(this)">Add Agent</button></td>
                    </tr>
                </tbody>
            </table>
            <br />
            <button type="button" class="remove-button right-remove-button" onclick="removePortOfCallTableSet(${portSetNumber})">Remove Port Set</button> 
        </div>`;

    // Append the new set of tables to the document body or a specific container
    document.getElementById('portOfCallNewTableContainer').insertAdjacentHTML('beforeend', newPortTableHTML);

    // Reapply the search function for the new port field after appending
    setupPortSearch(newPortFieldId, newResultFieldId);

    // Add the port search functionality for Port of Call Report fields
    setupPortSearch('port-of-calls-details-port-' + portSetNumber, 'port-of-calls-details-port-' + portSetNumber + '-results');
}

// Function to remove a port set in the Port of Call report
function removePortOfCallTableSet(setNumber) {
    const tableSet = document.getElementById(`portTableSet-${setNumber}`);
    if (tableSet) {
        tableSet.remove();
    }
}

function removeRow(button) {
    const rowToRemove = button.closest('tr');
    rowToRemove.remove(); 

    const rows = document.querySelectorAll('#robDetailsTableBody tr');
    rows.forEach((row, index) => {
        row.querySelector('td').textContent = index + 1; // Reassign the tank numbers to be sequential
    });
}


function validateNumberFields() {
    const fields = document.querySelectorAll('.validate');

    fields.forEach(field => {
        field.addEventListener('keypress', function(event) {
            if (!/[\d.]/.test(String.fromCharCode(event.which))) {
                event.preventDefault();
            }
        });

        field.addEventListener('input', function() {
            if (!/^\d*\.?\d*$/.test(this.value)) {
                this.value = this.value.slice(0, -1);
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', validateNumberFields);

// Save Draft Function
function saveDraft(reportId) {
    const form = document.querySelector(`#${reportId} form`);
    const formData = new FormData(form);
    const draft = {};
    formData.forEach((value, key) => {
        draft[key] = value;
    });
    localStorage.setItem(`draft-${reportId}`, JSON.stringify(draft));
    alert('Draft saved!');
}

// Restore Draft Function
function restoreDraft(reportId) {
    const draft = JSON.parse(localStorage.getItem(`draft-${reportId}`));
    if (draft) {
        const form = document.querySelector(`#${reportId} form`);
        Object.keys(draft).forEach(key => {
            const formElement = form.elements[key];
            if (formElement) {
                formElement.value = draft[key];
            }
        });
        alert(`Draft for ${reportId} restored!`);
    }
}

// Restore all drafts
function restoreAllDrafts() {
    const reportIds = ['NoonReport', 'DepartureReport', 'ArrivalReport', 'Bunkering', 'AllFast', 'WeeklyReport', 'CrewMonitoringPlan', 'VoyageReport', 'KPI'];
    reportIds.forEach(reportId => restoreDraft(reportId));
}


document.addEventListener('DOMContentLoaded', function() {
    const reportTypeSelect = document.getElementById('noon-voyage-details-report-type');
    reportTypeSelect.addEventListener('change', function() {
        handleReportTypeChange(this.value);
        console.log(this.value);
    });
});


// Dynamic form
function handleReportTypeChange(reportSection) {

    if (reportSection === 'At Sea') {
        document.querySelectorAll('.in-port-section').forEach(function(element) {
            element.style.display = 'none';
         });
         document.querySelectorAll('.at-sea-section').forEach(function(element) {
            element.style.display = 'flex';
         });
         document.querySelectorAll('.at-sea-section-fieldset').forEach(function(element) {
            element.style.display = 'block';
         });
    } else if (reportSection === 'In Port') {
        document.querySelectorAll('.at-sea-section').forEach(function(element) {
            element.style.display = 'none';
         });
         document.querySelectorAll('.at-sea-section-fieldset').forEach(function(element) {
            element.style.display = 'none';
         });
         document.querySelectorAll('.in-port-section').forEach(function(element) {
            element.style.display = 'flex';
         });
    } else if (reportSection === 'At Anchorage') {
        document.querySelectorAll('.in-port-section').forEach(function(element) {
            element.style.display = 'none';
         });
         document.querySelectorAll('.at-sea-section').forEach(function(element) {
            element.style.display = 'none';
         });
         document.querySelectorAll('.at-sea-section-fieldset').forEach(function(element) {
            element.style.display = 'none';
         });
    }
    else if (reportSection === 'At Drifting') {
        document.querySelectorAll('.in-port-section').forEach(function(element) {
            element.style.display = 'none';
         });
         document.querySelectorAll('.at-sea-section').forEach(function(element) {
            element.style.display = 'none';
         });
         document.querySelectorAll('.at-sea-section-fieldset').forEach(function(element) {
            element.style.display = 'none';
         });
    }
}

// Function to set up port search functionality
// function setupPortSearch(inputId, resultsId) {
//     let portList = [];
//     console.log("Hello " +inputId);
//     // Fetch the port names from the text file
//     fetch('portName.txt')
//         .then(response => response.text())
//         .then(data => {
//             portList = JSON.parse(data); // Parse the JSON data from the file
//         })
//         .catch(error => console.error('Error loading port names:', error));

//     // Search function for ports
//     function searchPorts(query) {
//         return portList.filter(port => port.toLowerCase().includes(query.toLowerCase()));
//     }

//     // Event listener for the port search box
//     document.getElementById(inputId).addEventListener('input', function() {
//         const query = this.value;
//         const results = searchPorts(query);

//         // Display results
//         const resultsContainer = document.getElementById(resultsId);
//         resultsContainer.innerHTML = '';

//         results.forEach(port => {
//             const div = document.createElement('div');
//             div.className = 'result-item';
//             div.textContent = port;
//             div.addEventListener('click', function() {
//                 // Set the search box value to the selected item
//                 document.getElementById(inputId).value = port;
//                 // Hide the dropdown list
//                 resultsContainer.style.display = 'none';
//             });
//             resultsContainer.appendChild(div);
//         });

//         // Apply the limit and make it scrollable if needed
//         if (results.length > 0) {
//             resultsContainer.style.display = 'block';
//             resultsContainer.style.maxHeight = '150px';  // Limit to about 5 items
//             resultsContainer.style.overflowY = 'auto';   // Enable scrolling
//         } else {
//             resultsContainer.style.display = 'none';
//         }
//     });

//     // Hide the results when clicking outside the search box and dropdown
//     document.addEventListener('click', function(event) {
//         const searchBox = document.getElementById(inputId);
//         const resultsContainer = document.getElementById(resultsId);
//         if (!searchBox.contains(event.target) && !resultsContainer.contains(event.target)) {
//             resultsContainer.style.display = 'none';
//         }
//     });
// }

function validateAndFormatLatLong(field, type) {
    const value = field.value.trim();
    let latLongPattern;
    
    if (type === 'latitude') {
        latLongPattern = /^(\d{1,2})\s+(\d{1,2})\s+(\d{1,2})\s+([NS])$/i;
    } else if (type === 'longitude') {
        latLongPattern = /^(\d{1,3})\s+(\d{1,2})\s+(\d{1,2})\s+([EW])$/i;
    }

    const match = value.match(latLongPattern);

    if (match) {
        const degrees = match[1];
        const minutes = match[2];
        const seconds = match[3];
        const direction = match[4].toUpperCase();

        // Ensure valid ranges
        const maxDegrees = type === 'latitude' ? 90 : 180;
        if (parseInt(degrees) > maxDegrees || parseInt(minutes) >= 60 || parseInt(seconds) >= 60) {
            field.value = '';
            return;
        }

        // Format the value
        field.value = `${degrees}° ${minutes}' ${seconds}'' ${direction}`;
    } else {
        field.value = ''; // Clear the field if the format is invalid
    }
}

// ROB Fuels Auto Computed fields
document.addEventListener('DOMContentLoaded', function() {
    const fields = [
        // HSFO Fields
        {
            propulsion: 'noon-hsfo-me-propulsion',
            aeCons: 'noon-hsfo-ae-cons',
            boilerCons: 'noon-hsfo-boiler-cons',
            incinerators: 'noon-hsfo-incinerators',
            totalCons: 'noon-hsfo-total-cons'
        },
        {
            propulsion: 'departure-hsfo-me-propulsion',
            aeCons: 'departure-hsfo-ae-cons',
            boilerCons: 'departure-hsfo-boiler-cons',
            incinerators: 'departure-hsfo-incinerators',
            totalCons: 'departure-hsfo-total-cons'
        },
        {
            propulsion: 'arrival-hsfo-me-propulsion',
            aeCons: 'arrival-hsfo-ae-cons',
            boilerCons: 'arrival-hsfo-boiler-cons',
            incinerators: 'arrival-hsfo-incinerators',
            totalCons: 'arrival-hsfo-total-cons'
        },
        // Biofuel Fields
        {
            propulsion: 'noon-biofuel-me-propulsion',
            aeCons: 'noon-biofuel-ae-cons',
            boilerCons: 'noon-biofuel-boiler-cons',
            incinerators: 'noon-biofuel-incinerators',
            totalCons: 'noon-biofuel-total-cons'
        },
        {
            propulsion: 'departure-biofuel-me-propulsion',
            aeCons: 'departure-biofuel-ae-cons',
            boilerCons: 'departure-biofuel-boiler-cons',
            incinerators: 'departure-biofuel-incinerators',
            totalCons: 'departure-biofuel-total-cons'
        },
        {
            propulsion: 'arrival-biofuel-me-propulsion',
            aeCons: 'arrival-biofuel-ae-cons',
            boilerCons: 'arrival-biofuel-boiler-cons',
            incinerators: 'arrival-biofuel-incinerators',
            totalCons: 'arrival-biofuel-total-cons'
        },
        // VLSFO Fields
        {
            propulsion: 'noon-vlsfo-me-propulsion',
            aeCons: 'noon-vlsfo-ae-cons',
            boilerCons: 'noon-vlsfo-boiler-cons',
            incinerators: 'noon-vlsfo-incinerators',
            totalCons: 'noon-vlsfo-total-cons'
        },
        {
            propulsion: 'departure-vlsfo-me-propulsion',
            aeCons: 'departure-vlsfo-ae-cons',
            boilerCons: 'departure-vlsfo-boiler-cons',
            incinerators: 'departure-vlsfo-incinerators',
            totalCons: 'departure-vlsfo-total-cons'
        },
        {
            propulsion: 'arrival-vlsfo-me-propulsion',
            aeCons: 'arrival-vlsfo-ae-cons',
            boilerCons: 'arrival-vlsfo-boiler-cons',
            incinerators: 'arrival-vlsfo-incinerators',
            totalCons: 'arrival-vlsfo-total-cons'
        },
        // LSMGO Fields
        {
            propulsion: 'noon-lsmgo-me-propulsion',
            aeCons: 'noon-lsmgo-ae-cons',
            boilerCons: 'noon-lsmgo-boiler-cons',
            incinerators: 'noon-lsmgo-incinerators',
            totalCons: 'noon-lsmgo-total-cons'
        },
        {
            propulsion: 'departure-lsmgo-me-propulsion',
            aeCons: 'departure-lsmgo-ae-cons',
            boilerCons: 'departure-lsmgo-boiler-cons',
            incinerators: 'departure-lsmgo-incinerators',
            totalCons: 'departure-lsmgo-total-cons'
        },
        {
            propulsion: 'arrival-lsmgo-me-propulsion',
            aeCons: 'arrival-lsmgo-ae-cons',
            boilerCons: 'arrival-lsmgo-boiler-cons',
            incinerators: 'arrival-lsmgo-incinerators',
            totalCons: 'arrival-lsmgo-total-cons'
        }
    ];

    function formatValue(value) {
        return value === 0 ? '' : value.toString();
    }

    function calculateTotalCons(fieldSet) {
        const propulsionField = document.getElementById(fieldSet.propulsion);
        const aeConsField = document.getElementById(fieldSet.aeCons);
        const boilerConsField = document.getElementById(fieldSet.boilerCons);
        const incineratorsField = document.getElementById(fieldSet.incinerators);
        const totalConsField = document.getElementById(fieldSet.totalCons);

        const propulsion = parseFloat(propulsionField.value) || 0;
        const aeCons = parseFloat(aeConsField.value) || 0;
        const boilerCons = parseFloat(boilerConsField.value) || 0;
        const incinerators = parseFloat(incineratorsField.value) || 0;

        const total = propulsion + aeCons + boilerCons + incinerators;
        const totalFormat = total.toFixed(3);

        // Update each field with the value as typed by the user
        propulsionField.value = formatValue(propulsionField.value);
        aeConsField.value = formatValue(aeConsField.value);
        boilerConsField.value = formatValue(boilerConsField.value);
        incineratorsField.value = formatValue(incineratorsField.value);
        totalConsField.value = formatValue(totalFormat)
    }

    fields.forEach(fieldSet => {
        document.getElementById(fieldSet.propulsion).addEventListener('input', () => calculateTotalCons(fieldSet));
        document.getElementById(fieldSet.aeCons).addEventListener('input', () => calculateTotalCons(fieldSet));
        document.getElementById(fieldSet.boilerCons).addEventListener('input', () => calculateTotalCons(fieldSet));
        document.getElementById(fieldSet.incinerators).addEventListener('input', () => calculateTotalCons(fieldSet));

        // Initial calculation in case fields are pre-filled
        calculateTotalCons(fieldSet);
    });

    function calculateNoonAverageWindForce() {
        const fields = [
            parseFloat(document.getElementById('noon-wind-force-dir-for-every-six-hours-12-18-wind-force').value) || 0,
            parseFloat(document.getElementById('noon-wind-force-dir-for-every-six-hours-18-00-wind-force').value) || 0,
            parseFloat(document.getElementById('noon-wind-force-dir-for-every-six-hours-00-06-wind-force').value) || 0,
            parseFloat(document.getElementById('noon-wind-force-dir-for-every-six-hours-06-12-wind-force').value) || 0
        ];
    
        const populatedFields = fields.filter(value => value !== 0);
        const sum = populatedFields.reduce((acc, value) => acc + value, 0);
        const average = sum / populatedFields.length;
    
        document.getElementById('noon-average-weather-wind-force').value = average.toFixed(2);
    }    

    function calculateNoonAverageSeaDS() {
        const fields = [
            parseFloat(document.getElementById('noon-wind-force-dir-for-every-six-hours-12-18-sea-ds').value) || 0,
            parseFloat(document.getElementById('noon-wind-force-dir-for-every-six-hours-18-00-sea-ds').value) || 0,
            parseFloat(document.getElementById('noon-wind-force-dir-for-every-six-hours-00-06-sea-ds').value) || 0,
            parseFloat(document.getElementById('noon-wind-force-dir-for-every-six-hours-06-12-sea-ds').value) || 0
        ];
    
        const populatedFields = fields.filter(value => value !== 0);
        const sum = populatedFields.reduce((acc, value) => acc + value, 0);
        const average = sum / populatedFields.length;
    
        document.getElementById('noon-average-weather-sea-ds').value = average.toFixed(2);
    }
    
    
    function calculateNoonAverageSwellHeight() {
        const fields = [
            parseFloat(document.getElementById('noon-wind-force-dir-for-every-six-hours-12-18-swell-height').value) || 0,
            parseFloat(document.getElementById('noon-wind-force-dir-for-every-six-hours-18-00-swell-height').value) || 0,
            parseFloat(document.getElementById('noon-wind-force-dir-for-every-six-hours-00-06-swell-height').value) || 0,
            parseFloat(document.getElementById('noon-wind-force-dir-for-every-six-hours-06-12-swell-height').value) || 0
        ];
    
        const populatedFields = fields.filter(value => value !== 0);
        const sum = populatedFields.reduce((acc, value) => acc + value, 0);
        const average = sum / populatedFields.length;
    
        document.getElementById('noon-average-weather-swell-height').value = average.toFixed(2);
    }

    function calculateNoonAverageWindSeaHeight() {
        const fields = [
            parseFloat(document.getElementById('noon-wind-force-dir-for-every-six-hours-12-18-wind-sea-height').value) || 0,
            parseFloat(document.getElementById('noon-wind-force-dir-for-every-six-hours-18-00-wind-sea-height').value) || 0,
            parseFloat(document.getElementById('noon-wind-force-dir-for-every-six-hours-00-06-wind-sea-height').value) || 0,
            parseFloat(document.getElementById('noon-wind-force-dir-for-every-six-hours-06-12-wind-sea-height').value) || 0
        ];
    
        const populatedFields = fields.filter(value => value !== 0);
        const sum = populatedFields.reduce((acc, value) => acc + value, 0);
        const average = sum / populatedFields.length;
    
        document.getElementById('noon-average-weather-wind-sea-height').value = average.toFixed(2);
    }

    // Attach event listeners for noon wind force calculation
    document.getElementById('noon-wind-force-dir-for-every-six-hours-12-18-wind-force').addEventListener('input', calculateNoonAverageWindForce);
    document.getElementById('noon-wind-force-dir-for-every-six-hours-18-00-wind-force').addEventListener('input', calculateNoonAverageWindForce);
    document.getElementById('noon-wind-force-dir-for-every-six-hours-00-06-wind-force').addEventListener('input', calculateNoonAverageWindForce);
    document.getElementById('noon-wind-force-dir-for-every-six-hours-06-12-wind-force').addEventListener('input', calculateNoonAverageWindForce);

    // Attach event listeners for noon sea DS calculation
    document.getElementById('noon-wind-force-dir-for-every-six-hours-12-18-sea-ds').addEventListener('input', calculateNoonAverageSeaDS);
    document.getElementById('noon-wind-force-dir-for-every-six-hours-18-00-sea-ds').addEventListener('input', calculateNoonAverageSeaDS);
    document.getElementById('noon-wind-force-dir-for-every-six-hours-00-06-sea-ds').addEventListener('input', calculateNoonAverageSeaDS);
    document.getElementById('noon-wind-force-dir-for-every-six-hours-06-12-sea-ds').addEventListener('input', calculateNoonAverageSeaDS);

    // Attach event listeners for noon swell height calculation
    document.getElementById('noon-wind-force-dir-for-every-six-hours-12-18-swell-height').addEventListener('input', calculateNoonAverageSwellHeight);
    document.getElementById('noon-wind-force-dir-for-every-six-hours-18-00-swell-height').addEventListener('input', calculateNoonAverageSwellHeight);
    document.getElementById('noon-wind-force-dir-for-every-six-hours-00-06-swell-height').addEventListener('input', calculateNoonAverageSwellHeight);
    document.getElementById('noon-wind-force-dir-for-every-six-hours-06-12-swell-height').addEventListener('input', calculateNoonAverageSwellHeight);

    // Attach event listeners for noon wind sea height calculation
    document.getElementById('noon-wind-force-dir-for-every-six-hours-12-18-wind-sea-height').addEventListener('input', calculateNoonAverageWindSeaHeight);
    document.getElementById('noon-wind-force-dir-for-every-six-hours-18-00-wind-sea-height').addEventListener('input', calculateNoonAverageWindSeaHeight);
    document.getElementById('noon-wind-force-dir-for-every-six-hours-00-06-wind-sea-height').addEventListener('input', calculateNoonAverageWindSeaHeight);
    document.getElementById('noon-wind-force-dir-for-every-six-hours-06-12-wind-sea-height').addEventListener('input', calculateNoonAverageWindSeaHeight);
});

function formatFieldToThreeDecimalPlaces(fieldId) {
    const field = document.getElementById(fieldId);
    
    // Function to format the value
    function formatValue() {
        let value = parseFloat(field.value);
        if (!isNaN(value) && value !== 0) {
            // Round to three decimal places and ensure the format
            field.value = value.toFixed(3);
        } else {
            field.value = ''; // Do not display anything if the field is empty
        }
    }

    // Trigger formatting when the user stops typing (debounce effect)
    let typingTimer;
    const typingDelay = 500; // Adjust the delay as needed

    field.addEventListener('input', function() {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(formatValue, typingDelay);
    });

    // Also trigger formatting when the user leaves the field
    field.addEventListener('blur', formatValue);
}

document.addEventListener('DOMContentLoaded', function() {
    // List of field IDs
    const fieldIds = [

        // HSFO Fields Noon
        'noon-hsfo-previous',
        'noon-hsfo-current',
        'noon-hsfo-me-propulsion',
        'noon-hsfo-ae-cons',
        'noon-hsfo-boiler-cons',
        'noon-hsfo-incinerators',
        'noon-hsfo-me-24',
        'noon-hsfo-ae-24',
        'noon-hsfo-total-cons',

        // HSFO Fields Departure
        'departure-hsfo-previous',
        'departure-hsfo-current',
        'departure-hsfo-me-propulsion',
        'departure-hsfo-ae-cons',
        'departure-hsfo-boiler-cons',
        'departure-hsfo-incinerators',
        'departure-hsfo-me-24',
        'departure-hsfo-ae-24',
        'departure-hsfo-total-cons',

        // HSFO Fields Arrival
        'arrival-hsfo-previous',
        'arrival-hsfo-current',
        'arrival-hsfo-me-propulsion',
        'arrival-hsfo-ae-cons',
        'arrival-hsfo-boiler-cons',
        'arrival-hsfo-incinerators',
        'arrival-hsfo-me-24',
        'arrival-hsfo-ae-24',
        'arrival-hsfo-total-cons',

        // BIOFUEL Field Noon
        'noon-biofuel-previous',
        'noon-biofuel-current',
        'noon-biofuel-me-propulsion',
        'noon-biofuel-ae-cons',
        'noon-biofuel-boiler-cons',
        'noon-biofuel-incinerators',
        'noon-biofuel-me-24',
        'noon-biofuel-ae-24',
        'noon-biofuel-total-cons',

        // BIOFUEL Field Departure
        'departure-biofuel-previous',
        'departure-biofuel-current',
        'departure-biofuel-me-propulsion',
        'departure-biofuel-ae-cons',
        'departure-biofuel-boiler-cons',
        'departure-biofuel-incinerators',
        'departure-biofuel-me-24',
        'departure-biofuel-ae-24',
        'departure-biofuel-total-cons',

        // BIOFUEL Field Arrival
        'arrival-biofuel-previous',
        'arrival-biofuel-current',
        'arrival-biofuel-me-propulsion',
        'arrival-biofuel-ae-cons',
        'arrival-biofuel-boiler-cons',
        'arrival-biofuel-incinerators',
        'arrival-biofuel-me-24',
        'arrival-biofuel-ae-24',
        'arrival-biofuel-total-cons',

        // VLSFO Field Noon
        'noon-vlsfo-previous',
        'noon-vlsfo-current',
        'noon-vlsfo-me-propulsion',
        'noon-vlsfo-ae-cons',
        'noon-vlsfo-boiler-cons',
        'noon-vlsfo-incinerators',
        'noon-vlsfo-me-24',
        'noon-vlsfo-ae-24',
        'noon-vlsfo-total-cons',

        // VLSFO Field Departure
        'departure-vlsfo-previous',
        'departure-vlsfo-current',
        'departure-vlsfo-me-propulsion',
        'departure-vlsfo-ae-cons',
        'departure-vlsfo-boiler-cons',
        'departure-vlsfo-incinerators',
        'departure-vlsfo-me-24',
        'departure-vlsfo-ae-24',
        'departure-vlsfo-total-cons',

        // VLSFO Field Arrival
        'arrival-vlsfo-previous',
        'arrival-vlsfo-current',
        'arrival-vlsfo-me-propulsion',
        'arrival-vlsfo-ae-cons',
        'arrival-vlsfo-boiler-cons',
        'arrival-vlsfo-incinerators',
        'arrival-vlsfo-me-24',
        'arrival-vlsfo-ae-24',
        'arrival-vlsfo-total-cons',

        // LSMGO Fields Noon
        'noon-lsmgo-previous',
        'noon-lsmgo-current',
        'noon-lsmgo-me-propulsion',
        'noon-lsmgo-ae-cons',
        'noon-lsmgo-boiler-cons',
        'noon-lsmgo-incinerators',
        'noon-lsmgo-me-24',
        'noon-lsmgo-ae-24',
        'noon-lsmgo-total-cons',

        // LSMGO Fields Departure
        'departure-lsmgo-previous',
        'departure-lsmgo-current',
        'departure-lsmgo-me-propulsion',
        'departure-lsmgo-ae-cons',
        'departure-lsmgo-boiler-cons',
        'departure-lsmgo-incinerators',
        'departure-lsmgo-me-24',
        'departure-lsmgo-ae-24',
        'departure-lsmgo-total-cons',

        // LSMGO Fields Arrival
        'arrival-lsmgo-previous',
        'arrival-lsmgo-current',
        'arrival-lsmgo-me-propulsion',
        'arrival-lsmgo-ae-cons',
        'arrival-lsmgo-boiler-cons',
        'arrival-lsmgo-incinerators',
        'arrival-lsmgo-me-24',
        'arrival-lsmgo-ae-24',
        'arrival-lsmgo-total-cons',
    ];

    // Apply formatting to each field
    fieldIds.forEach(formatFieldToThreeDecimalPlaces);
});


function updateTotalConsField(fieldId, value) {
    const field = document.getElementById(fieldId);
    field.value = formatFieldToThreeDecimalPlaces(value); // Updates the field with formatted value
}

function calculateTotalCons(fields, totalConsFieldId) {
    let sum = 0;
    fields.forEach(fieldId => {
        const fieldValue = parseFloat(document.getElementById(fieldId).value) || 0;
        sum += fieldValue;
    });
    updateTotalConsField(totalConsFieldId, sum); // Applies the formatting to the total-cons field
}

document.addEventListener('DOMContentLoaded', function() {
    const fieldsToWatch = [
        // HSFO Fields
        {
            fields: ['noon-hsfo-me-propulsion', 'noon-hsfo-ae-cons', 'noon-hsfo-boiler-cons', 'noon-hsfo-incinerators'],
            totalConsFieldId: 'noon-hsfo-total-cons'
        },
        {
            fields: ['departure-hsfo-me-propulsion', 'departure-hsfo-ae-cons', 'departure-hsfo-boiler-cons', 'departure-hsfo-incinerators'],
            totalConsFieldId: 'departure-hsfo-total-cons'
        },
        {
            fields: ['arrival-hsfo-me-propulsion', 'arrival-hsfo-ae-cons', 'arrival-hsfo-boiler-cons', 'arrival-hsfo-incinerators'],
            totalConsFieldId: 'arrival-hsfo-total-cons'
        },
        // Biofuel Fields
        {
            fields: ['noon-biofuel-me-propulsion', 'noon-biofuel-ae-cons', 'noon-biofuel-boiler-cons', 'noon-biofuel-incinerators'],
            totalConsFieldId: 'noon-biofuel-total-cons'
        },
        {
            fields: ['departure-biofuel-me-propulsion', 'departure-biofuel-ae-cons', 'departure-biofuel-boiler-cons', 'departure-biofuel-incinerators'],
            totalConsFieldId: 'departure-biofuel-total-cons'
        },
        {
            fields: ['arrival-biofuel-me-propulsion', 'arrival-biofuel-ae-cons', 'arrival-biofuel-boiler-cons', 'arrival-biofuel-incinerators'],
            totalConsFieldId: 'arrival-biofuel-total-cons'
        },
        // VLSFO Fields
        {
            fields: ['noon-vlsfo-me-propulsion', 'noon-vlsfo-ae-cons', 'noon-vlsfo-boiler-cons', 'noon-vlsfo-incinerators'],
            totalConsFieldId: 'noon-vlsfo-total-cons'
        },
        {
            fields: ['departure-vlsfo-me-propulsion', 'departure-vlsfo-ae-cons', 'departure-vlsfo-boiler-cons', 'departure-vlsfo-incinerators'],
            totalConsFieldId: 'departure-vlsfo-total-cons'
        },
        {
            fields: ['arrival-vlsfo-me-propulsion', 'arrival-vlsfo-ae-cons', 'arrival-vlsfo-boiler-cons', 'arrival-vlsfo-incinerators'],
            totalConsFieldId: 'arrival-vlsfo-total-cons'
        },
        // LSMGO Fields
        {
            fields: ['noon-lsmgo-me-propulsion', 'noon-lsmgo-ae-cons', 'noon-lsmgo-boiler-cons', 'noon-lsmgo-incinerators'],
            totalConsFieldId: 'noon-lsmgo-total-cons'
        },
        {
            fields: ['departure-lsmgo-me-propulsion', 'departure-lsmgo-ae-cons', 'departure-lsmgo-boiler-cons', 'departure-lsmgo-incinerators'],
            totalConsFieldId: 'departure-lsmgo-total-cons'
        },
        {
            fields: ['arrival-lsmgo-me-propulsion', 'arrival-lsmgo-ae-cons', 'arrival-lsmgo-boiler-cons', 'arrival-lsmgo-incinerators'],
            totalConsFieldId: 'arrival-lsmgo-total-cons'
        }
    ];

    fieldsToWatch.forEach(fieldSet => {
        fieldSet.fields.forEach(fieldId => {
            document.getElementById(fieldId).addEventListener('input', function() {
                calculateTotalCons(fieldSet.fields, fieldSet.totalConsFieldId);
            });
        });
        // Initial calculation to ensure correct values on page load
        calculateTotalCons(fieldSet.fields, fieldSet.totalConsFieldId);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    function updateROBValues() {
        const fuelTypes = {
            'hsfo': 0,
            'biofuel': 0,
            'vlsfo': 0,
            'lsmgo': 0
        };

        // Iterate through each row of the ROB details table
        document.querySelectorAll('#robDetailsTableBody tr').forEach(row => {
            const fuelGradeElement = row.querySelector('.fuel-grade-select');
            const robValueElement = row.querySelector('[id^="noon-rob-details-tank-"][id$="-rob"]');

            if (fuelGradeElement && robValueElement) {
                const fuelGrade = fuelGradeElement.value.toLowerCase();
                const robValue = parseFloat(robValueElement.value) || 0;

                if (fuelTypes.hasOwnProperty(fuelGrade)) {
                    fuelTypes[fuelGrade] += robValue;
                }
            }
        });

        // Update the corresponding noon-current fields
        document.getElementById('noon-hsfo-current').value = fuelTypes['hsfo'].toFixed(3);
        document.getElementById('noon-biofuel-current').value = fuelTypes['biofuel'].toFixed(3);
        document.getElementById('noon-vlsfo-current').value = fuelTypes['vlsfo'].toFixed(3);
        document.getElementById('noon-lsmgo-current').value = fuelTypes['lsmgo'].toFixed(3);
    }

    // Event delegation: Attach the event listeners to the table body
    document.getElementById('robDetailsTableBody').addEventListener('input', function(event) {
        if (event.target.matches('.fuel-grade-select') || event.target.matches('[id^="noon-rob-details-tank-"][id$="-rob"]')) {
            updateROBValues();
        }
    });

    // Initial calculation on page load
    updateROBValues();
});

function formatFieldToTwoDecimalPlaces(fieldId) {
    const field = document.getElementById(fieldId);
    
    // Function to format the value
    function formatValue() {
        let value = parseFloat(field.value);
            if (!isNaN(value) && value !== 0) {
                // Round to three decimal places and ensure the format
                field.value = value.toFixed(2);
            } else if (field.value.trim() !== '') {
                field.value = '0.00';
            } else {
                field.value = ''; // Do not display anything if the field is empty
            }
    }

    // Trigger formatting when the user stops typing (debounce effect)
    let typingTimer;
    const typingDelay = 500; // Adjust the delay as needed

    field.addEventListener('input', function() {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(formatValue, typingDelay);
    });

    // Also trigger formatting when the user leaves the field
    field.addEventListener('blur', formatValue);
}

document.addEventListener('DOMContentLoaded', function() {
    // List of field IDs to format to two decimal places
    const twoDecimalFieldIds = [
        'noon-wind-force-dir-for-every-six-hours-12-18-swell-height',
        'noon-wind-force-dir-for-every-six-hours-18-00-swell-height',
        'noon-wind-force-dir-for-every-six-hours-00-06-swell-height',
        'noon-wind-force-dir-for-every-six-hours-06-12-swell-height',
        'departure-wind-force-dir-for-every-six-hours-12-18-swell-height',
        'departure-wind-force-dir-for-every-six-hours-18-00-swell-height',
        'departure-wind-force-dir-for-every-six-hours-00-06-swell-height',
        'departure-wind-force-dir-for-every-six-hours-06-12-swell-height',
        'arrival-wind-force-dir-for-every-six-hours-12-18-swell-height',
        'arrival-wind-force-dir-for-every-six-hours-18-00-swell-height',
        'arrival-wind-force-dir-for-every-six-hours-00-06-swell-height',
        'arrival-wind-force-dir-for-every-six-hours-06-12-swell-height',

        //new fields
        'noon-wind-force-dir-for-every-six-hours-12-18-wind-sea-height',
        'noon-wind-force-dir-for-every-six-hours-18-00-wind-sea-height',
        'noon-wind-force-dir-for-every-six-hours-00-06-wind-sea-height',
        'noon-wind-force-dir-for-every-six-hours-06-12-wind-sea-height',
        'departure-wind-force-dir-for-every-six-hours-12-18-wind-sea-height',
        'departure-wind-force-dir-for-every-six-hours-18-00-wind-sea-height',
        'departure-wind-force-dir-for-every-six-hours-00-06-wind-sea-height',
        'departure-wind-force-dir-for-every-six-hours-06-12-wind-sea-height',
        'arrival-wind-force-dir-for-every-six-hours-12-18-wind-sea-height',
        'arrival-wind-force-dir-for-every-six-hours-18-00-wind-sea-height',
        'arrival-wind-force-dir-for-every-six-hours-00-06-wind-sea-height',
        'arrival-wind-force-dir-for-every-six-hours-06-12-wind-sea-height'
    ];

    // Apply formatting to each field
    twoDecimalFieldIds.forEach(formatFieldToTwoDecimalPlaces);

});

// Computers Oil consumption automacatically
document.addEventListener('DOMContentLoaded', function() {
    const oilFields = [
        // HSFO - Noon Report
        { quantity: 'noon-hsfo-oil-me-cyl-oil-quantity', hours: 'noon-hsfo-oil-me-cyl-total-runn-hrs', cons: 'noon-hsfo-oil-me-cyl-oil-cons' },
        { quantity: 'noon-hsfo-oil-me-cc-oil-quantity', hours: 'noon-hsfo-oil-me-cc-total-run-hrs', cons: 'noon-hsfo-oil-me-cc-oil-cons' },
        { quantity: 'noon-hsfo-oil-ae1-cc-oil-quantity', hours: 'noon-hsfo-oil-ae1-cc-total-runn-hrs', cons: 'noon-hsfo-oil-ae1-cc-oil-cons' },
        { quantity: 'noon-hsfo-oil-ae2-cc-oil-quantity', hours: 'noon-hsfo-oil-ae2-cc-total-runn-hrs', cons: 'noon-hsfo-oil-ae2-cc-oil-cons' },
        { quantity: 'noon-hsfo-oil-ae3-cc-oil-quantity', hours: 'noon-hsfo-oil-ae3-cc-total-runn-hrs', cons: 'noon-hsfo-oil-ae3-cc-oil-cons' },

        // BIOFUEL - Noon Report
        { quantity: 'noon-biofuel-oil-me-cyl-oil-quantity', hours: 'noon-biofuel-oil-me-cyl-total-runn-hrs', cons: 'noon-biofuel-oil-me-cyl-oil-cons' },
        { quantity: 'noon-biofuel-oil-me-cc-oil-quantity', hours: 'noon-biofuel-oil-me-cc-total-run-hrs', cons: 'noon-biofuel-oil-me-cc-oil-cons' },
        { quantity: 'noon-biofuel-oil-ae1-cc-oil-quantity', hours: 'noon-biofuel-oil-ae1-cc-total-runn-hrs', cons: 'noon-biofuel-oil-ae1-cc-oil-cons' },
        { quantity: 'noon-biofuel-oil-ae2-cc-oil-quantity', hours: 'noon-biofuel-oil-ae2-cc-total-runn-hrs', cons: 'noon-biofuel-oil-ae2-cc-oil-cons' },
        { quantity: 'noon-biofuel-oil-ae3-cc-oil-quantity', hours: 'noon-biofuel-oil-ae3-cc-total-runn-hrs', cons: 'noon-biofuel-oil-ae3-cc-oil-cons' },

        // VLSFO - Noon Report
        { quantity: 'noon-vlsfo-oil-me-cyl-oil-quantity', hours: 'noon-vlsfo-oil-me-cyl-total-runn-hrs', cons: 'noon-vlsfo-oil-me-cyl-oil-cons' },
        { quantity: 'noon-vlsfo-oil-me-cc-oil-quantity', hours: 'noon-vlsfo-oil-me-cc-total-run-hrs', cons: 'noon-vlsfo-oil-me-cc-oil-cons' },
        { quantity: 'noon-vlsfo-oil-ae1-cc-oil-quantity', hours: 'noon-vlsfo-oil-ae1-cc-total-runn-hrs', cons: 'noon-vlsfo-oil-ae1-cc-oil-cons' },
        { quantity: 'noon-vlsfo-oil-ae2-cc-oil-quantity', hours: 'noon-vlsfo-oil-ae2-cc-total-runn-hrs', cons: 'noon-vlsfo-oil-ae2-cc-oil-cons' },
        { quantity: 'noon-vlsfo-oil-ae3-cc-oil-quantity', hours: 'noon-vlsfo-oil-ae3-cc-total-runn-hrs', cons: 'noon-vlsfo-oil-ae3-cc-oil-cons' },

        // LSMGO - Noon Report
        { quantity: 'noon-lsmgo-oil-me-cyl-oil-quantity', hours: 'noon-lsmgo-oil-me-cyl-total-runn-hrs', cons: 'noon-lsmgo-oil-me-cyl-oil-cons' },
        { quantity: 'noon-lsmgo-oil-me-cc-oil-quantity', hours: 'noon-lsmgo-oil-me-cc-total-run-hrs', cons: 'noon-lsmgo-oil-me-cc-oil-cons' },
        { quantity: 'noon-lsmgo-oil-ae1-cc-oil-quantity', hours: 'noon-lsmgo-oil-ae1-cc-total-runn-hrs', cons: 'noon-lsmgo-oil-ae1-cc-oil-cons' },
        { quantity: 'noon-lsmgo-oil-ae2-cc-oil-quantity', hours: 'noon-lsmgo-oil-ae2-cc-total-runn-hrs', cons: 'noon-lsmgo-oil-ae2-cc-oil-cons' },
        { quantity: 'noon-lsmgo-oil-ae3-cc-oil-quantity', hours: 'noon-lsmgo-oil-ae3-cc-total-runn-hrs', cons: 'noon-lsmgo-oil-ae3-cc-oil-cons' },

        // HSFO - Departure Report
        { quantity: 'departure-hsfo-oil-me-cyl-oil-quantity', hours: 'departure-hsfo-oil-me-cyl-total-runn-hrs', cons: 'departure-hsfo-oil-me-cyl-oil-cons' },
        { quantity: 'departure-hsfo-oil-me-cc-oil-quantity', hours: 'departure-hsfo-oil-me-cc-total-run-hrs', cons: 'departure-hsfo-oil-me-cc-oil-cons' },
        { quantity: 'departure-hsfo-oil-ae1-cc-oil-quantity', hours: 'departure-hsfo-oil-ae1-cc-total-runn-hrs', cons: 'departure-hsfo-oil-ae1-cc-oil-cons' },
        { quantity: 'departure-hsfo-oil-ae2-cc-oil-quantity', hours: 'departure-hsfo-oil-ae2-cc-total-runn-hrs', cons: 'departure-hsfo-oil-ae2-cc-oil-cons' },
        { quantity: 'departure-hsfo-oil-ae3-cc-oil-quantity', hours: 'departure-hsfo-oil-ae3-cc-total-runn-hrs', cons: 'departure-hsfo-oil-ae3-cc-oil-cons' },

        // BIOFUEL - Departure Report
        { quantity: 'departure-biofuel-oil-me-cyl-oil-quantity', hours: 'departure-biofuel-oil-me-cyl-total-runn-hrs', cons: 'departure-biofuel-oil-me-cyl-oil-cons' },
        { quantity: 'departure-biofuel-oil-me-cc-oil-quantity', hours: 'departure-biofuel-oil-me-cc-total-run-hrs', cons: 'departure-biofuel-oil-me-cc-oil-cons' },
        { quantity: 'departure-biofuel-oil-ae1-cc-oil-quantity', hours: 'departure-biofuel-oil-ae1-cc-total-runn-hrs', cons: 'departure-biofuel-oil-ae1-cc-oil-cons' },
        { quantity: 'departure-biofuel-oil-ae2-cc-oil-quantity', hours: 'departure-biofuel-oil-ae2-cc-total-runn-hrs', cons: 'departure-biofuel-oil-ae2-cc-oil-cons' },
        { quantity: 'departure-biofuel-oil-ae3-cc-oil-quantity', hours: 'departure-biofuel-oil-ae3-cc-total-runn-hrs', cons: 'departure-biofuel-oil-ae3-cc-oil-cons' },

        // VLSFO - Departure Report
        { quantity: 'departure-vlsfo-oil-me-cyl-oil-quantity', hours: 'departure-vlsfo-oil-me-cyl-total-runn-hrs', cons: 'departure-vlsfo-oil-me-cyl-oil-cons' },
        { quantity: 'departure-vlsfo-oil-me-cc-oil-quantity', hours: 'departure-vlsfo-oil-me-cc-total-run-hrs', cons: 'departure-vlsfo-oil-me-cc-oil-cons' },
        { quantity: 'departure-vlsfo-oil-ae1-cc-oil-quantity', hours: 'departure-vlsfo-oil-ae1-cc-total-runn-hrs', cons: 'departure-vlsfo-oil-ae1-cc-oil-cons' },
        { quantity: 'departure-vlsfo-oil-ae2-cc-oil-quantity', hours: 'departure-vlsfo-oil-ae2-cc-total-runn-hrs', cons: 'departure-vlsfo-oil-ae2-cc-oil-cons' },
        { quantity: 'departure-vlsfo-oil-ae3-cc-oil-quantity', hours: 'departure-vlsfo-oil-ae3-cc-total-runn-hrs', cons: 'departure-vlsfo-oil-ae3-cc-oil-cons' },

        // LSMGO - Departure Report
        { quantity: 'departure-lsmgo-oil-me-cyl-oil-quantity', hours: 'departure-lsmgo-oil-me-cyl-total-runn-hrs', cons: 'departure-lsmgo-oil-me-cyl-oil-cons' },
        { quantity: 'departure-lsmgo-oil-me-cc-oil-quantity', hours: 'departure-lsmgo-oil-me-cc-total-run-hrs', cons: 'departure-lsmgo-oil-me-cc-oil-cons' },
        { quantity: 'departure-lsmgo-oil-ae1-cc-oil-quantity', hours: 'departure-lsmgo-oil-ae1-cc-total-runn-hrs', cons: 'departure-lsmgo-oil-ae1-cc-oil-cons' },
        { quantity: 'departure-lsmgo-oil-ae2-cc-oil-quantity', hours: 'departure-lsmgo-oil-ae2-cc-total-runn-hrs', cons: 'departure-lsmgo-oil-ae2-cc-oil-cons' },
        { quantity: 'departure-lsmgo-oil-ae3-cc-oil-quantity', hours: 'departure-lsmgo-oil-ae3-cc-total-runn-hrs', cons: 'departure-lsmgo-oil-ae3-cc-oil-cons' },

        // HSFO - Arrival Report
        { quantity: 'arrival-hsfo-oil-me-cyl-oil-quantity', hours: 'arrival-hsfo-oil-me-cyl-total-runn-hrs', cons: 'arrival-hsfo-oil-me-cyl-oil-cons' },
        { quantity: 'arrival-hsfo-oil-me-cc-oil-quantity', hours: 'arrival-hsfo-oil-me-cc-total-run-hrs', cons: 'arrival-hsfo-oil-me-cc-oil-cons' },
        { quantity: 'arrival-hsfo-oil-ae1-cc-oil-quantity', hours: 'arrival-hsfo-oil-ae1-cc-total-runn-hrs', cons: 'arrival-hsfo-oil-ae1-cc-oil-cons' },
        { quantity: 'arrival-hsfo-oil-ae2-cc-oil-quantity', hours: 'arrival-hsfo-oil-ae2-cc-total-runn-hrs', cons: 'arrival-hsfo-oil-ae2-cc-oil-cons' },
        { quantity: 'arrival-hsfo-oil-ae3-cc-oil-quantity', hours: 'arrival-hsfo-oil-ae3-cc-total-runn-hrs', cons: 'arrival-hsfo-oil-ae3-cc-oil-cons' },

        // BIOFUEL - Arrival Report
        { quantity: 'arrival-biofuel-oil-me-cyl-oil-quantity', hours: 'arrival-biofuel-oil-me-cyl-total-runn-hrs', cons: 'arrival-biofuel-oil-me-cyl-oil-cons' },
        { quantity: 'arrival-biofuel-oil-me-cc-oil-quantity', hours: 'arrival-biofuel-oil-me-cc-total-run-hrs', cons: 'arrival-biofuel-oil-me-cc-oil-cons' },
        { quantity: 'arrival-biofuel-oil-ae1-cc-oil-quantity', hours: 'arrival-biofuel-oil-ae1-cc-total-runn-hrs', cons: 'arrival-biofuel-oil-ae1-cc-oil-cons' },
        { quantity: 'arrival-biofuel-oil-ae2-cc-oil-quantity', hours: 'arrival-biofuel-oil-ae2-cc-total-runn-hrs', cons: 'arrival-biofuel-oil-ae2-cc-oil-cons' },
        { quantity: 'arrival-biofuel-oil-ae3-cc-oil-quantity', hours: 'arrival-biofuel-oil-ae3-cc-total-runn-hrs', cons: 'arrival-biofuel-oil-ae3-cc-oil-cons' },

        // VLSFO - Arrival Report
        { quantity: 'arrival-vlsfo-oil-me-cyl-oil-quantity', hours: 'arrival-vlsfo-oil-me-cyl-total-runn-hrs', cons: 'arrival-vlsfo-oil-me-cyl-oil-cons' },
        { quantity: 'arrival-vlsfo-oil-me-cc-oil-quantity', hours: 'arrival-vlsfo-oil-me-cc-total-run-hrs', cons: 'arrival-vlsfo-oil-me-cc-oil-cons' },
        { quantity: 'arrival-vlsfo-oil-ae1-cc-oil-quantity', hours: 'arrival-vlsfo-oil-ae1-cc-total-runn-hrs', cons: 'arrival-vlsfo-oil-ae1-cc-oil-cons' },
        { quantity: 'arrival-vlsfo-oil-ae2-cc-oil-quantity', hours: 'arrival-vlsfo-oil-ae2-cc-total-runn-hrs', cons: 'arrival-vlsfo-oil-ae2-cc-oil-cons' },
        { quantity: 'arrival-vlsfo-oil-ae3-cc-oil-quantity', hours: 'arrival-vlsfo-oil-ae3-cc-total-runn-hrs', cons: 'arrival-vlsfo-oil-ae3-cc-oil-cons' },

        // LSMGO - Arrival Report
        { quantity: 'arrival-lsmgo-oil-me-cyl-oil-quantity', hours: 'arrival-lsmgo-oil-me-cyl-total-runn-hrs', cons: 'arrival-lsmgo-oil-me-cyl-oil-cons' },
        { quantity: 'arrival-lsmgo-oil-me-cc-oil-quantity', hours: 'arrival-lsmgo-oil-me-cc-total-run-hrs', cons: 'arrival-lsmgo-oil-me-cc-oil-cons' },
        { quantity: 'arrival-lsmgo-oil-ae1-cc-oil-quantity', hours: 'arrival-lsmgo-oil-ae1-cc-total-runn-hrs', cons: 'arrival-lsmgo-oil-ae1-cc-oil-cons' },
        { quantity: 'arrival-lsmgo-oil-ae2-cc-oil-quantity', hours: 'arrival-lsmgo-oil-ae2-cc-total-runn-hrs', cons: 'arrival-lsmgo-oil-ae2-cc-oil-cons' },
        { quantity: 'arrival-lsmgo-oil-ae3-cc-oil-quantity', hours: 'arrival-lsmgo-oil-ae3-cc-total-runn-hrs', cons: 'arrival-lsmgo-oil-ae3-cc-oil-cons' },
    ];

    function calculateOilCons(oilQuantityField, totalRunnHrsField, oilConsField) {
        const oilQuantity = parseFloat(oilQuantityField.value) || 0;
        const totalRunnHrs = parseFloat(totalRunnHrsField.value) || 0;

        if (totalRunnHrs > 0) {
            oilConsField.value = (oilQuantity / totalRunnHrs).toFixed(3);
        } else {
            oilConsField.value = '0.000';
        }
    }

    oilFields.forEach(field => {
        const oilQuantityField = document.getElementById(field.quantity);
        const totalRunnHrsField = document.getElementById(field.hours);
        const oilConsField = document.getElementById(field.cons);

        if (oilQuantityField && totalRunnHrsField && oilConsField) {
            oilQuantityField.addEventListener('input', () => calculateOilCons(oilQuantityField, totalRunnHrsField, oilConsField));
            totalRunnHrsField.addEventListener('input', () => calculateOilCons(oilQuantityField, totalRunnHrsField, oilConsField));
        }
    });
});



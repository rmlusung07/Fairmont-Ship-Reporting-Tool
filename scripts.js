document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('toggle');
    const body = document.body;

    toggle.addEventListener('change', function() {
        if (this.checked) {
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
        }
    });

    // Initialize the first report section as visible
    document.getElementById('NoonReport').style.display = 'block';

    // Add event listeners to report buttons
    const reportButtons = document.querySelectorAll('nav button');
    reportButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            openReport(event, button.getAttribute('onclick').split("'")[1]);
        });
    });

    // Show HSFO tab by default on page load
    resetTabContent('NoonReport');
});

function openReport(evt, reportName) {
    var i, reportSections, reportButtons;
    reportSections = document.getElementsByClassName("report-section");
    for (i = 0; i < reportSections.length; i++) {
        reportSections[i].style.display = "none";
    }
    reportButtons = document.querySelectorAll('nav button');
    for (i = 0; i < reportButtons.length; i++) {
        reportButtons[i].className = reportButtons[i].className.replace(" active", "");
    }
    document.getElementById(reportName).style.display = "block";
    evt.currentTarget.className += " active";

    // Reset tab content visibility for the selected report
    resetTabContent(reportName);
}

function resetTabContent(reportName) {
    var tabcontent = document.querySelectorAll(`#${reportName} .tab-content`);
    for (var i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    var hsfoTab = document.querySelector(`#${reportName} .tab-content.hsfo`);
    if (hsfoTab) {
        hsfoTab.style.display = "block";
    }
    var tablinks = document.querySelectorAll(`#${reportName} .w3-button`);
    for (var i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" w3-theme", "");
    }
    var hsfoButton = document.querySelector(`#${reportName} .w3-button.hsfo`);
    if (hsfoButton) {
        hsfoButton.className += " w3-theme";
    }
}

function openTab(evt, tabName) {
    evt.preventDefault();
    var i, tabcontent, tablinks;

    // Disable form validation temporarily
    var form = evt.target.closest('form');
    var elements = form.elements;
    for (i = 0; i < elements.length; i++) {
        elements[i].setAttribute('data-required', elements[i].required);
        elements[i].required = false;
    }

    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("w3-button");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" w3-theme", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " w3-theme";

    // Re-enable form validation
    setTimeout(function() {
        for (i = 0; i < elements.length; i++) {
            elements[i].required = elements[i].getAttribute('data-required') === 'true';
        }
    }, 0);

    // Prevent scroll to top
    evt.target.blur();
}

function addRow() {
    const tableBody = document.getElementById('allFastRobTableBody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td><input type="text" name="hsfo" required></td>
        <td><input type="text" name="lsfo" required></td>
        <td><input type="text" name="vlsfo" required></td>
        <td><input type="text" name="lsmgo" required></td>
        <td><button type="button" onclick="removeRow(this)">Remove</button></td>
    `;
    tableBody.appendChild(newRow);
}

function removeRow(button) {
    const row = button.closest('tr');
    row.remove();
}

/* Prevent user to type character to fields that only accepts numbers */
function validateNumberFields() {
    const fields = document.querySelectorAll('.validate');

    fields.forEach(field => {
        field.addEventListener('keypress', function(event) {
            const char = String.fromCharCode(event.which);
            const isValid = /[\d.]/.test(char);
            if (!isValid) {
                event.preventDefault();
            }
        });

        field.addEventListener('input', function() {
            const value = this.value;
            const isValid = /^\d*\.?\d*$/.test(value);
            if (!isValid) {
                this.value = value.slice(0, -1);
            }
        });
    });
}

// Call the validation function after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    validateNumberFields();
});


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

    // Handle dynamic form change
    const reportTypeSelect = document.getElementById('noon-voyage-details-report-type');
    reportTypeSelect.addEventListener('change', function() {
        handleReportTypeChange(this.value);
    });

    // Add the port search functionality for Noon Report fields
    setupPortSearch('noon-voyage-details-port', 'noon-voyage-details-port-results');
    setupPortSearch('noon-voyage-itinerary-port', 'noon-voyage-itinerary-port-results');
    setupPortSearch('noon-details-since-last-report-next-port', 'noon-details-since-last-report-next-port-results');

    // Add the port search functionality for Departure Report fields
    setupPortSearch('departure-voyage-details-departure-port', 'departure-voyage-details-departure-port-results');
    setupPortSearch('departure-details-since-last-report-next-port', 'departure-details-since-last-report-next-port-results');
    setupPortSearch('departure-voyage-itinerary-port', 'departure-voyage-itinerary-port-results');

    // Add the port search functionality for Arrival and Bunkering Report fields
    setupPortSearch('arrival-voyage-details-port', 'arrival-voyage-details-port-results');
    setupPortSearch('bunkering-details-bunkering-port', 'bunkering-details-bunkering-port-results');
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
    
    if (reportSection === 'at-sea') {
        document.getElementById('at-sea-section').style.display = 'block';
    } else if (reportSection === 'in-port') {
        document.getElementById('in-port-section').style.display = 'block';
    } else if (reportSection === 'at-anchorage') {
        document.getElementById('at-anchorage-section').style.display = 'block';
    }
}

// Function to export data to excel form
function exportToExcel(reportId) {
    const form = document.querySelector(`#${reportId} form`);
    const formData = new FormData(form);
    const data = [];

    const reportSection = reportId.toLowerCase();
    const adjustedReportSection = reportSection.replace("report", "");

    // Mapping form keys to labels
    const fieldLabels = {

        'noonreport': {

            // Noon Voyage Details
            'noon-voyage-details-vessel-name': 'Vessel Name:',
            'noon-voyage-details-voyage-no': 'Voyage No:',
            'noon-voyage-details-report-type': 'Report Type:',
            'noon-voyage-details-date-time': 'Date/Time (LT):',
            'noon-voyage-details-gmt-offset': 'GMT Offset:',
            'noon-voyage-details-latitude': 'Latitude:',
            'noon-voyage-details-longitude': 'Longitude:',
            'noon-voyage-details-port': 'Port:',

            // Noon Details Since Last Report
            'noon-details-since-last-report-cp-ordered-speed': 'CP/Ordered Speed (Kts):',
            'noon-details-since-last-report-allowed-me-cons-at-cp-speed': 'Allowed M/E Cons. at C/P Speed:',
            'noon-details-since-last-report-obs-distance': 'Obs. Distance (NM):',
            'noon-details-since-last-report-steaming-time': 'Steaming Time (Hrs):',
            'noon-details-since-last-report-avg-speed': 'Avg Speed (Kts):',
            'noon-details-since-last-report-distance-to-go': 'Distance to go (NM):',
            'noon-details-since-last-report-course': 'Course (Deg):',
            'noon-details-since-last-report-breakdown': 'Breakdown (Hrs):',
            'noon-details-since-last-report-avg-rpm': 'Avg RPM:',
            'noon-details-since-last-report-engine-distance': 'Engine Distance (NM):',
            'noon-details-since-last-report-slip': 'Slip (%):',
            'noon-details-since-last-report-me-output': 'M/E Output (% MCR):',
            'noon-details-since-last-report-avg-power': 'Avg Power (KW):',
            'noon-details-since-last-report-logged-distance': 'Logged Distance (NM):',
            'noon-details-since-last-report-speed-through-water': 'Speed Through Water (Kts):',
            'noon-details-since-last-report-next-port': 'Next Port:',
            'noon-details-since-last-report-eta-next-port': 'ETA Next Port (LT):',
            'noon-details-since-last-report-eta-gmt-offset': 'ETA GMT Offset:',
            'noon-details-since-last-report-anchored-hours': 'Anchored Hours:',
            'noon-details-since-last-report-drifting-hours': 'Drifting Hours:',
            'noon-details-since-last-report-maneuvering-hours': 'Maneuvering Hours:',

            // Noon Conditions	
            'noon-conditions-condition': 'Condition:',
            'noon-conditions-displacement': 'Displacement (MT):',
            'noon-conditions-deadweight': 'Deadweight (MT):',
            'noon-conditions-cargo-weight': 'Cargo Weight (MT):',
            'noon-conditions-ballast-weight': 'Ballast Weight (MT):',
            'noon-conditions-fresh-water': 'Fresh Water (MT):',
            'noon-conditions-fwd-draft': 'Fwd Draft (m):',
            'noon-conditions-aft-draft': 'Aft Draft (m):',
            'noon-conditions-gm': 'GM:',

            // Noon Voyage Itinerary	
            'noon-voyage-itinerary-port': 'Port:',
            'noon-voyage-itinerary-via': 'Via:',
            'noon-voyage-itinerary-eta': 'ETA (LT):',
            'noon-voyage-itinerary-gmt-offset': 'GMT Offset:',
            'noon-voyage-itinerary-distance-to-go': 'Distance to go:',
            'noon-voyage-itinerary-projected-speed': 'Projected Speed (kts):',

            // Noon Average Weather	
            'noon-average-weather-wind-force': 'Wind Force (Bft.) (T):',
            'noon-average-weather-swell': 'Swell:',
            'noon-average-weather-sea-currents': 'Sea Currents (Kts) (Rel.):',
            'noon-average-weather-sea-temp': 'Sea Temp (Deg. C):',
            'noon-average-weather-observed-wind-dir': 'Observed Wind Dir. (T):',
            'noon-average-weather-wind-sea-height': 'Wind Sea Height (m):',
            'sea-current-dir': 'Sea Current Direction (Rel.):',
            'swell-height': 'Swell Height (m):',
            'observed-sea-dir': 'Observed Sea Dir. (T):',
            'noon-average-weather-air-temp': 'Air Temp (Deg. C):',
            'noon-average-weather-observed-swell-dir': 'Observed Swell Dir. (T):',
            'noon-average-weather-sea-ds': 'Sea DS:',
            'noon-average-weather-atm-pressure': 'Atm. Pressure (millibar):',

            // Noon Bad Weather Details	
            'noon-bad-weather-details-wind-force-since-last-report': 'Wind force (Bft.) >0 hrs (since last report):',
            'noon-bad-weather-details-wind-force-continuous': 'Wind Force (Bft.) (continuous):',
            'noon-bad-weather-details-sea-state-since-last-report': 'Sea State (DS) >0 hrs (since last report):',
            'noon-bad-weather-details-sea-state-continuous': 'Sea State (continuous):',

            // Noon Wind/Force for every six hours	
            // Noon 12:00 - 18:00	
            'noon-wind-force-dir-for-every-six-hours-12-18-wind-force': 'Wind Force (Bft.) (12:00 - 18:00):',
            'noon-wind-force-dir-for-every-six-hours-12-18-wind-direction': 'Wind Direction (T) (12:00 - 18:00):',
            'noon-wind-force-dir-for-every-six-hours-12-18-swell-height': 'Swell Height (m) (12:00 - 18:00):',
            'noon-wind-force-dir-for-every-six-hours-12-18-swell-direction': 'Swell Direction (T) (12:00 - 18:00):',
            'noon-wind-force-dir-for-every-six-hours-12-18-wind-sea-height': 'Wind Sea Height (m) (12:00 - 18:00):',
            'noon-wind-force-dir-for-every-six-hours-12-18-sea-direction': 'Sea Direction (T) (12:00 - 18:00):',
            'noon-wind-force-dir-for-every-six-hours-12-18-sea-ds': 'Sea DS (12:00 - 18:00):',
            
            // Noon 18:00 - 00:00	
            'noon-wind-force-dir-for-every-six-hours-18-00-wind-force': 'Wind Force (Bft.) (18:00 - 00:00):',
            'noon-wind-force-dir-for-every-six-hours-18-00-wind-direction': 'Wind Direction (T) (18:00 - 00:00):',
            'noon-wind-force-dir-for-every-six-hours-18-00-swell-height': 'Swell Height (m) (18:00 - 00:00):',
            'noon-wind-force-dir-for-every-six-hours-18-00-swell-direction': 'Swell Direction (T) (18:00 - 00:00):',
            'noon-wind-force-dir-for-every-six-hours-18-00-wind-sea-height': 'Wind Sea Height (m) (18:00 - 00:00):',
            'noon-wind-force-dir-for-every-six-hours-18-00-sea-direction': 'Sea Direction (T) (18:00 - 00:00):',
            'noon-wind-force-dir-for-every-six-hours-18-00-sea-ds': 'Sea DS (18:00 - 00:00):',

            // Noon 6:00 - 12:00	
            'noon-wind-force-dir-for-every-six-hours-06-12-wind-force': 'Wind Force (Bft.) (06:00 - 12:00):',
            'noon-wind-force-dir-for-every-six-hours-06-12-wind-direction': 'Wind Direction (T) (06:00 - 12:00):',
            'noon-wind-force-dir-for-every-six-hours-06-12-swell-height': 'Swell Height (m) (06:00 - 12:00):',
            'noon-wind-force-dir-for-every-six-hours-06-12-swell-direction': 'Swell Direction (T) (06:00 - 12:00):',
            'noon-wind-force-dir-for-every-six-hours-06-12-wind-sea-height': 'Wind Sea Height (m) (06:00 - 12:00):',
            'noon-wind-force-dir-for-every-six-hours-06-12-sea-direction': 'Sea Direction (T) (06:00 - 12:00):',
            'noon-wind-force-dir-for-every-six-hours-06-12-sea-ds': 'Sea DS (06:00 - 12:00):',

            
            // Noon ROB Details	
            'noon-rob-details-tank-1-number': 'Tank 1 Number:',
            'noon-rob-details-tank-1-description': 'Tank 1 Description:',
            'noon-rob-details-tank-1-fuel-grade': 'Tank 1 Fuel Grade:',
            'noon-rob-details-tank-1-capacity': 'Tank 1 Capacity:',
            'noon-rob-details-tank-1-unit': 'Tank 1 Unit:',
            'noon-rob-details-tank-1-rob': 'Tank 1 ROB:',
            'noon-rob-details-tank-1-date-time': 'Tank 1 Date/Time:',

            'noon-rob-details-tank-2-number': 'Tank 2 Number:',
            'noon-rob-details-tank-2-description': 'Tank 2 Description:',
            'noon-rob-details-tank-2-fuel-grade': 'Tank 2 Fuel Grade:',
            'noon-rob-details-tank-2-capacity': 'Tank 2 Capacity:',
            'noon-rob-details-tank-2-unit': 'Tank 2 Unit:',
            'noon-rob-details-tank-2-rob': 'Tank 2 ROB:',
            'noon-rob-details-tank-2-date-time': 'Tank 2 Date/Time:',

            'noon-rob-details-tank-3-number': 'Tank 3 Number:',
            'noon-rob-details-tank-3-description': 'Tank 3 Description:',
            'noon-rob-details-tank-3-fuel-grade': 'Tank 3 Fuel Grade:',
            'noon-rob-details-tank-3-capacity': 'Tank 3 Capacity:',
            'noon-rob-details-tank-3-unit': 'Tank 3 Unit:',
            'noon-rob-details-tank-3-rob': 'Tank 3 ROB:',
            'noon-rob-details-tank-3-date-time': 'Tank 3 Date/Time:',

            'noon-rob-details-tank-4-number': 'Tank 4 Number:',
            'noon-rob-details-tank-4-description': 'Tank 4 Description:',
            'noon-rob-details-tank-4-fuel-grade': 'Tank 4 Fuel Grade:',
            'noon-rob-details-tank-4-capacity': 'Tank 4 Capacity:',
            'noon-rob-details-tank-4-unit': 'Tank 4 Unit:',
            'noon-rob-details-tank-4-rob': 'Tank 4 ROB:',
            'noon-rob-details-tank-4-date-time': 'Tank 4 Date/Time:',
            
            'noon-rob-details-tank-5-number': 'Tank 5 Number:',
            'noon-rob-details-tank-5-description': 'Tank 5 Description:',
            'noon-rob-details-tank-5-fuel-grade': 'Tank 5 Fuel Grade:',
            'noon-rob-details-tank-5-capacity': 'Tank 5 Capacity:',
            'noon-rob-details-tank-5-unit': 'Tank 5 Unit:',
            'noon-rob-details-tank-5-rob': 'Tank 5 ROB:',
            'noon-rob-details-tank-5-date-time': 'Tank 5 Date/Time:',
            
            'noon-rob-details-tank-6-number': 'Tank 6 Number:',
            'noon-rob-details-tank-6-description': 'Tank 6 Description:',
            'noon-rob-details-tank-6-fuel-grade': 'Tank 6 Fuel Grade:',
            'noon-rob-details-tank-6-capacity': 'Tank 6 Capacity:',
            'noon-rob-details-tank-6-unit': 'Tank 6 Unit:',
            'noon-rob-details-tank-6-rob': 'Tank 6 ROB:',
            'noon-rob-details-tank-6-date-time': 'Tank 6 Date/Time:',

            'noon-rob-details-tank-7-number': 'Tank 7 Number:',
            'noon-rob-details-tank-7-description': 'Tank 7 Description:',
            'noon-rob-details-tank-7-fuel-grade': 'Tank 7 Fuel Grade:',
            'noon-rob-details-tank-7-capacity': 'Tank 7 Capacity:',
            'noon-rob-details-tank-7-unit': 'Tank 7 Unit:',
            'noon-rob-details-tank-7-rob': 'Tank 7 ROB:',
            'noon-rob-details-tank-7-date-time': 'Tank 7 Date/Time:',

            'noon-rob-details-tank-8-number': 'Tank 8 Number:',
            'noon-rob-details-tank-8-description': 'Tank 8 Description:',
            'noon-rob-details-tank-8-fuel-grade': 'Tank 8 Fuel Grade:',
            'noon-rob-details-tank-8-capacity': 'Tank 8 Capacity:',
            'noon-rob-details-tank-8-unit': 'Tank 8 Unit:',
            'noon-rob-details-tank-8-rob': 'Tank 8 ROB:',
            'noon-rob-details-tank-8-date-time': 'Tank 8 Date/Time:',

            'noon-rob-details-tank-9-number': 'Tank 9 Number:',
            'noon-rob-details-tank-9-description': 'Tank 9 Description:',
            'noon-rob-details-tank-9-fuel-grade': 'Tank 9 Fuel Grade:',
            'noon-rob-details-tank-9-capacity': 'Tank 9 Capacity:',
            'noon-rob-details-tank-9-unit': 'Tank 9 Unit:',
            'noon-rob-details-tank-9-rob': 'Tank 9 ROB:',
            'noon-rob-details-tank-9-date-time': 'Tank 9 Date/Time:',

            'noon-rob-details-tank-10-number': 'Tank 10 Number:',
            'noon-rob-details-tank-10-description': 'Tank 10 Description:',
            'noon-rob-details-tank-10-fuel-grade': 'Tank 10 Fuel Grade:',
            'noon-rob-details-tank-10-capacity': 'Tank 10 Capacity:',
            'noon-rob-details-tank-10-unit': 'Tank 10 Unit:',
            'noon-rob-details-tank-10-rob': 'Tank 10 ROB:',
            'noon-rob-details-tank-10-date-time': 'Tank 10 Date/Time:',

            'noon-rob-details-tank-11-number': 'Tank 11 Number:',
            'noon-rob-details-tank-11-description': 'Tank 11 Description:',
            'noon-rob-details-tank-11-fuel-grade': 'Tank 11 Fuel Grade:',
            'noon-rob-details-tank-11-capacity': 'Tank 11 Capacity:',
            'noon-rob-details-tank-11-unit': 'Tank 11 Unit:',
            'noon-rob-details-tank-11-rob': 'Tank 11 ROB:',
            'noon-rob-details-tank-11-date-time': 'Tank 11 Date/Time:',

            'noon-rob-details-tank-12-number': 'Tank 12 Number:',
            'noon-rob-details-tank-12-description': 'Tank 12 Description:',
            'noon-rob-details-tank-12-fuel-grade': 'Tank 12 Fuel Grade:',
            'noon-rob-details-tank-12-capacity': 'Tank 12 Capacity:',
            'noon-rob-details-tank-12-unit': 'Tank 12 Unit:',
            'noon-rob-details-tank-12-rob': 'Tank 12 ROB:',
            'noon-rob-details-tank-12-date-time': 'Tank 12 Date/Time:',

            'noon-rob-details-tank-13-number': 'Tank 13 Number:',
            'noon-rob-details-tank-13-description': 'Tank 13 Description:',
            'noon-rob-details-tank-13-fuel-grade': 'Tank 13 Fuel Grade:',
            'noon-rob-details-tank-13-capacity': 'Tank 13 Capacity:',
            'noon-rob-details-tank-13-unit': 'Tank 13 Unit:',
            'noon-rob-details-tank-13-rob': 'Tank 13 ROB:',
            'noon-rob-details-tank-13-date-time': 'Tank 13 Date/Time:',

            'noon-rob-details-tank-14-number': 'Tank 14 Number:',
            'noon-rob-details-tank-14-description': 'Tank 14 Description:',
            'noon-rob-details-tank-14-fuel-grade': 'Tank 14 Fuel Grade:',
            'noon-rob-details-tank-14-capacity': 'Tank 14 Capacity:',
            'noon-rob-details-tank-14-unit': 'Tank 14 Unit:',
            'noon-rob-details-tank-14-rob': 'Tank 14 ROB:',
            'noon-rob-details-tank-14-date-time': 'Tank 14 Date/Time:',

            'noon-rob-details-tank-15-number': 'Tank 15 Number:',
            'noon-rob-details-tank-15-description': 'Tank 15 Description:',
            'noon-rob-details-tank-15-fuel-grade': 'Tank 15 Fuel Grade:',
            'noon-rob-details-tank-15-capacity': 'Tank 15 Capacity:',
            'noon-rob-details-tank-15-unit': 'Tank 15 Unit:',
            'noon-rob-details-tank-15-rob': 'Tank 15 ROB:',
            'noon-rob-details-tank-15-date-time': 'Tank 15 Date/Time:',

            'noon-rob-details-tank-16-number': 'Tank 16 Number:',
            'noon-rob-details-tank-16-description': 'Tank 16 Description:',
            'noon-rob-details-tank-16-fuel-grade': 'Tank 16 Fuel Grade:',
            'noon-rob-details-tank-16-capacity': 'Tank 16 Capacity:',
            'noon-rob-details-tank-16-unit': 'Tank 16 Unit:',
            'noon-rob-details-tank-16-rob': 'Tank 16 ROB:',
            'noon-rob-details-tank-16-date-time': 'Tank 16 Date/Time:',

            'noon-rob-details-tank-17-number': 'Tank 17 Number:',
            'noon-rob-details-tank-17-description': 'Tank 17 Description:',
            'noon-rob-details-tank-17-fuel-grade': 'Tank 17 Fuel Grade:',
            'noon-rob-details-tank-17-capacity': 'Tank 17 Capacity:',
            'noon-rob-details-tank-17-unit': 'Tank 17 Unit:',
            'noon-rob-details-tank-17-rob': 'Tank 17 ROB:',
            'noon-rob-details-tank-17-date-time': 'Tank 17 Date/Time:',

            'noon-rob-details-tank-18-number': 'Tank 18 Number:',
            'noon-rob-details-tank-18-description': 'Tank 18 Description:',
            'noon-rob-details-tank-18-fuel-grade': 'Tank 18 Fuel Grade:',
            'noon-rob-details-tank-18-capacity': 'Tank 18 Capacity:',
            'noon-rob-details-tank-18-unit': 'Tank 18 Unit:',
            'noon-rob-details-tank-18-rob': 'Tank 18 ROB:',
            'noon-rob-details-tank-18-date-time': 'Tank 18 Date/Time:',

            'noon-rob-details-tank-19-number': 'Tank 19 Number:',
            'noon-rob-details-tank-19-description': 'Tank 19 Description:',
            'noon-rob-details-tank-19-fuel-grade': 'Tank 19 Fuel Grade:',
            'noon-rob-details-tank-19-capacity': 'Tank 19 Capacity:',
            'noon-rob-details-tank-19-unit': 'Tank 19 Unit:',
            'noon-rob-details-tank-19-rob': 'Tank 19 ROB:',
            'noon-rob-details-tank-19-date-time': 'Tank 19 Date/Time:',

            'noon-rob-details-tank-20-number': 'Tank 20 Number:',
            'noon-rob-details-tank-20-description': 'Tank 20 Description:',
            'noon-rob-details-tank-20-fuel-grade': 'Tank 20 Fuel Grade:',
            'noon-rob-details-tank-20-capacity': 'Tank 20 Capacity:',
            'noon-rob-details-tank-20-unit': 'Tank 20 Unit:',
            'noon-rob-details-tank-20-rob': 'Tank 20 ROB:',
            'noon-rob-details-tank-20-date-time': 'Tank 20 Date/Time:',

            // Noon HSFO (MT)	
            'noon-hsfo-previous': 'HSFO Previous:',
            'noon-hsfo-current': 'HSFO Current:',
            'noon-hsfo-me-propulsion': 'HSFO ME Propulsion:',
            'noon-hsfo-ae-cons': 'HSFO AE Cons:',
            'noon-hsfo-boiler-cons': 'HSFO Boiler Cons:',
            'noon-hsfo-incinerators': 'HSFO Incinerators:',
            'noon-hsfo-me-24': 'HSFO ME 24:',
            'noon-hsfo-ae-24': 'HSFO AE 24:',
            'noon-hsfo-total-cons': 'HSFO Total Cons:',

            //Noon HSFO Oil
            'noon-hsfo-oil-me-cyl-oil-grade': 'ME CYL Oil Grade:',
            'noon-hsfo-oil-me-cyl-total-runn-hrs': 'ME CYL Total Running Hours:',
            'noon-hsfo-oil-me-cyl-oil-cons': 'ME CYL Oil Consumption:',
            'noon-hsfo-oil-me-cc-oil-grade': 'ME CC Oil Grade:',
            'noon-hsfo-oil-me-cc-total-run-hrs': 'ME CC Total Running Hours:',
            'noon-hsfo-oil-me-cc-oil-cons': 'ME CC Oil Consumption:',
            'noon-hsfo-oil-ae-oil-grade': 'AE CC Oil Grade:',
            'noon-hsfo-oil-ae-total-runn-hrs-ae1': 'AE1 Total Running Hours:',
            'noon-hsfo-oil-ae-total-runn-hrs-ae2': 'AE2 Total Running Hours:',
            'noon-hsfo-oil-ae-total-runn-hrs-ae3': 'AE3 Total Running Hours:',
            'noon-hsfo-oil-ae-oil-cons': 'AE Oil Consumption:',

            // Noon BIOFUEL (MT)	
            'noon-biofuel-previous': 'BIOFUEL Previous:',
            'noon-biofuel-current': 'BIOFUEL Current:',
            'noon-biofuel-me-propulsion': 'BIOFUEL ME Propulsion:',
            'noon-biofuel-ae-cons': 'BIOFUEL AE Cons:',
            'noon-biofuel-boiler-cons': 'BIOFUEL Boiler Cons:',
            'noon-biofuel-incinerators': 'BIOFUEL Incinerators:',
            'noon-biofuel-me-24': 'BIOFUEL ME 24:',
            'noon-biofuel-ae-24': 'BIOFUEL AE 24:',
            'noon-biofuel-total-cons': 'BIOFUEL Total Cons:',

            //Noon BIOFUEL Oil
            'noon-biofuel-oil-me-cyl-oil-grade': 'ME CYL Oil Grade:',
            'noon-biofuel-oil-me-cyl-total-runn-hrs': 'ME CYL Total Running Hours:',
            'noon-biofuel-oil-me-cyl-oil-cons': 'ME CYL Oil Consumption:',
            'noon-biofuel-oil-me-cc-oil-grade': 'ME CC Oil Grade:',
            'noon-biofuel-oil-me-cc-total-run-hrs': 'ME CC Total Running Hours:',
            'noon-biofuel-oil-me-cc-oil-cons': 'ME CC Oil Consumption:',
            'noon-biofuel-oil-ae-oil-grade': 'AE CC Oil Grade:',
            'noon-biofuel-oil-ae-total-runn-hrs-ae1': 'AE1 Total Running Hours:',
            'noon-biofuel-oil-ae-total-runn-hrs-ae2': 'AE2 Total Running Hours:',
            'noon-biofuel-oil-ae-total-runn-hrs-ae3': 'AE3 Total Running Hours:',
            'noon-biofuel-oil-ae-oil-cons': 'AE Oil Consumption:',

            // Noon VLSFO (MT)	
            'noon-vlsfo-previous': 'VLSFO Previous:',
            'noon-vlsfo-current': 'VLSFO Current:',
            'noon-vlsfo-me-propulsion': 'VLSFO ME Propulsion:',
            'noon-vlsfo-ae-cons': 'VLSFO AE Cons:',
            'noon-vlsfo-boiler-cons': 'VLSFO Boiler Cons:',
            'noon-vlsfo-incinerators': 'VLSFO Incinerators:',
            'noon-vlsfo-me-24': 'VLSFO ME 24:',
            'noon-vlsfo-ae-24': 'VLSFO AE 24:',
            'noon-vlsfo-total-cons': 'VLSFO Total Cons:',

            //Noon VLSFO Oil
            'noon-vlsfo-oil-me-cyl-oil-grade': 'ME CYL Oil Grade:',
            'noon-vlsfo-oil-me-cyl-total-runn-hrs': 'ME CYL Total Running Hours:',
            'noon-vlsfo-oil-me-cyl-oil-cons': 'ME CYL Oil Consumption:',
            'noon-vlsfo-oil-me-cc-oil-grade': 'ME CC Oil Grade:',
            'noon-vlsfo-oil-me-cc-total-run-hrs': 'ME CC Total Running Hours:',
            'noon-vlsfo-oil-me-cc-oil-cons': 'ME CC Oil Consumption:',
            'noon-vlsfo-oil-ae-oil-grade': 'AE CC Oil Grade:',
            'noon-vlsfo-oil-ae-total-runn-hrs-ae1': 'AE1 Total Running Hours:',
            'noon-vlsfo-oil-ae-total-runn-hrs-ae2': 'AE2 Total Running Hours:',
            'noon-vlsfo-oil-ae-total-runn-hrs-ae3': 'AE3 Total Running Hours:',
            'noon-vlsfo-oil-ae-oil-cons': 'AE Oil Consumption:',

            // Noon LSMGO (MT)	
            'noon-lsmgo-previous': 'LSMGO Previous:',
            'noon-lsmgo-current': 'LSMGO Current:',
            'noon-lsmgo-me-propulsion': 'LSMGO ME Propulsion:',
            'noon-lsmgo-ae-cons': 'LSMGO AE Cons:',
            'noon-lsmgo-boiler-cons': 'LSMGO Boiler Cons:',
            'noon-lsmgo-incinerators': 'LSMGO Incinerators:',
            'noon-lsmgo-me-24': 'LSMGO ME 24:',
            'noon-lsmgo-ae-24': 'LSMGO AE 24:',
            'noon-lsmgo-total-cons': 'LSMGO Total Cons:',

            //Noon LSMGO Oil
            'noon-lsmgo-oil-me-cyl-oil-grade': 'ME CYL Oil Grade:',
            'noon-lsmgo-oil-me-cyl-total-runn-hrs': 'ME CYL Total Running Hours:',
            'noon-lsmgo-oil-me-cyl-oil-cons': 'ME CYL Oil Consumption:',
            'noon-lsmgo-oil-me-cc-oil-grade': 'ME CC Oil Grade:',
            'noon-lsmgo-oil-me-cc-total-run-hrs': 'ME CC Total Running Hours:',
            'noon-lsmgo-oil-me-cc-oil-cons': 'ME CC Oil Consumption:',
            'noon-lsmgo-oil-ae-oil-grade': 'AE CC Oil Grade:',
            'noon-lsmgo-oil-ae-total-runn-hrs-ae1': 'AE1 Total Running Hours:',
            'noon-lsmgo-oil-ae-total-runn-hrs-ae2': 'AE2 Total Running Hours:',
            'noon-lsmgo-oil-ae-total-runn-hrs-ae3': 'AE3 Total Running Hours:',
            'noon-lsmgo-oil-ae-oil-cons': 'AE Oil Consumption:',

            // Noon Master Remarks	
            'noon-remarks': 'Remarks:',
            'noon-master-name': 'Masters Name:'
        },

        'departurereport': {

            // Departure Voyage Details
            'departure-voyage-details-vessel-name': 'Vessel Name:',
            'departure-voyage-details-voyage-no': 'Voyage No:',
            'departure-voyage-details-date-time': 'Date/Time (LT):',
            'departure-voyage-details-gmt-offset': 'GMT Offset:',
            'departure-voyage-details-latitude': 'Latitude:',
            'departure-voyage-details-longitude': 'Longitude:',
            'departure-voyage-details-departure-type': 'Departure Type:',
            'departure-voyage-details-departure-port': 'Departure Port:',

            // Departure Details Since Last Report
            'departure-details-since-last-report-cp-ordered-speed': 'CP/Ordered Speed (Kts):',
            'departure-details-since-last-report-obs-distance': 'Obs. Distance (NM):',
            'departure-details-since-last-report-steaming-time': 'Steaming Time (Hrs):',
            'departure-details-since-last-report-avg-speed': 'Avg Speed (Kts):',
            'departure-details-since-last-report-distance-to-go': 'Distance to go (NM):',
            'departure-details-since-last-report-course': 'Course (Deg):',
            'departure-details-since-last-report-avg-rpm': 'Avg RPM:',
            'departure-details-since-last-report-engine-distance': 'Engine Distance (NM):',
            'departure-details-since-last-report-slip': 'Slip (%):',
            'departure-details-since-last-report-avg-power': 'Avg Power (KW):',
            'departure-details-since-last-report-logged-distance': 'Logged Distance (NM):',
            'departure-details-since-last-report-speed-through-water': 'Speed Through Water (Kts):',
            'departure-details-since-last-report-next-port': 'Next Port:',
            'departure-details-since-last-report-eta-next-port': 'ETA Next Port (LT):',
            'departure-details-since-last-report-eta-gmt-offset': 'ETA GMT Offset:',

            // Departure Conditions
            'departure-conditions-condition': 'Departure Condition:',
            'departure-conditions-displacement': 'Displacement (MT):',
            'departure-conditions-deadweight': 'Deadweight (MT):',
            'departure-conditions-cargo-weight': 'Cargo Weight (MT):',
            'departure-conditions-ballast-weight': 'Ballast Weight (MT):',
            'departure-conditions-fresh-water': 'Fresh Water (MT):',
            'departure-conditions-fwd-draft': 'Fwd Draft (m):',
            'departure-conditions-aft-draft': 'Aft Draft (m):',
            'departure-conditions-gm': 'GM:',

            // Departure Voyage Itinerary
            'departure-voyage-itinerary-port': 'Port:',
            'departure-voyage-itinerary-via': 'Via:',
            'departure-voyage-itinerary-eta': 'ETA (LT):',
            'departure-voyage-itinerary-gmt-offset': 'GMT Offset:',
            'departure-voyage-itinerary-distance-to-go': 'Distance to go:',
            'departure-voyage-itinerary-projected-speed': 'Projected Speed (kts):',

            // Departure Wind Force/Dir for every six hours
            // Departure 12:00 - 18:00
            'departure-wind-force-dir-for-every-six-hours-12-18-wind-force': 'Wind Force (Bft.) (12:00 - 18:00):',
            'departure-wind-force-dir-for-every-six-hours-12-18-wind-direction': 'Wind Direction (T) (12:00 - 18:00):',
            'departure-wind-force-dir-for-every-six-hours-12-18-swell-height': 'Swell Height (m) (12:00 - 18:00):',
            'departure-wind-force-dir-for-every-six-hours-12-18-swell-direction': 'Swell Direction (T) (12:00 - 18:00):',
            'departure-wind-force-dir-for-every-six-hours-12-18-wind-sea-height': 'Wind Sea Height (m) (12:00 - 18:00):',
            'departure-wind-force-dir-for-every-six-hours-12-18-sea-direction': 'Sea Direction (T) (12:00 - 18:00):',
            'departure-wind-force-dir-for-every-six-hours-12-18-sea-ds': 'Sea DS (12:00 - 18:00):',

            // Departure 18:00 - 00:00
            'departure-wind-force-dir-for-every-six-hours-18-00-wind-force': 'Wind Force (Bft.) (18:00 - 00:00):',
            'departure-wind-force-dir-for-every-six-hours-18-00-wind-direction': 'Wind Direction (T) (18:00 - 00:00):',
            'departure-wind-force-dir-for-every-six-hours-18-00-swell-height': 'Swell Height (m) (18:00 - 00:00):',
            'departure-wind-force-dir-for-every-six-hours-18-00-swell-direction': 'Swell Direction (T) (18:00 - 00:00):',
            'departure-wind-force-dir-for-every-six-hours-18-00-wind-sea-height': 'Wind Sea Height (m) (18:00 - 00:00):',
            'departure-wind-force-dir-for-every-six-hours-18-00-sea-direction': 'Sea Direction (T) (18:00 - 00:00):',
            'departure-wind-force-dir-for-every-six-hours-18-00-sea-ds': 'Sea DS (18:00 - 00:00):',

            // Departure 06:00 - 12:00
            'departure-wind-force-dir-for-every-six-hours-06-12-wind-force': 'Wind Force (Bft.) (06:00 - 12:00):',
            'departure-wind-force-dir-for-every-six-hours-06-12-wind-direction': 'Wind Direction (T) (06:00 - 12:00):',
            'departure-wind-force-dir-for-every-six-hours-06-12-swell-height': 'Swell Height (m) (06:00 - 12:00):',
            'departure-wind-force-dir-for-every-six-hours-06-12-swell-direction': 'Swell Direction (T) (06:00 - 12:00):',
            'departure-wind-force-dir-for-every-six-hours-06-12-wind-sea-height': 'Wind Sea Height (m) (06:00 - 12:00):',
            'departure-wind-force-dir-for-every-six-hours-06-12-sea-direction': 'Sea Direction (T) (06:00 - 12:00):',
            'departure-wind-force-dir-for-every-six-hours-06-12-sea-ds': 'Sea DS (06:00 - 12:00):',

            // Departure HSFO (MT)
            'departure-hsfo-previous': 'HSFO Previous:',
            'departure-hsfo-current': 'HSFO Current:',
            'departure-hsfo-me-propulsion': 'HSFO ME Propulsion:',
            'departure-hsfo-ae-cons': 'HSFO AE Cons:',
            'departure-hsfo-boiler-cons': 'HSFO Boiler Cons:',
            'departure-hsfo-incinerators': 'HSFO Incinerators:',
            'departure-hsfo-me-24': 'HSFO ME 24:',
            'departure-hsfo-ae-24': 'HSFO AE 24:',
            'departure-hsfo-total-cons': 'HSFO Total Cons:',

            //Departure HSFO Oil
            'departure-hsfo-oil-me-cyl-oil-grade': 'ME CYL Oil Grade:',
            'departure-hsfo-oil-me-cyl-total-runn-hrs': 'ME CYL Total Running Hours:',
            'departure-hsfo-oil-me-cyl-oil-cons': 'ME CYL Oil Consumption:',
            'departure-hsfo-oil-me-cc-oil-grade': 'ME CC Oil Grade:',
            'departure-hsfo-oil-me-cc-total-run-hrs': 'ME CC Total Running Hours:',
            'departure-hsfo-oil-me-cc-oil-cons': 'ME CC Oil Consumption:',
            'departure-hsfo-oil-ae-oil-grade': 'AE CC Oil Grade:',
            'departure-hsfo-oil-ae-total-runn-hrs-ae1': 'AE1 Total Running Hours:',
            'departure-hsfo-oil-ae-total-runn-hrs-ae2': 'AE2 Total Running Hours:',
            'departure-hsfo-oil-ae-total-runn-hrs-ae3': 'AE3 Total Running Hours:',
            'departure-hsfo-oil-ae-oil-cons': 'AE Oil Consumption:',

            // Departure BIOFUEL (MT)
            'departure-biofuel-previous': 'BIOFUEL Previous:',
            'departure-biofuel-current': 'BIOFUEL Current:',
            'departure-biofuel-me-propulsion': 'BIOFUEL ME Propulsion:',
            'departure-biofuel-ae-cons': 'BIOFUEL AE Cons:',
            'departure-biofuel-boiler-cons': 'BIOFUEL Boiler Cons:',
            'departure-biofuel-incinerators': 'BIOFUEL Incinerators:',
            'departure-biofuel-me-24': 'BIOFUEL ME 24:',
            'departure-biofuel-ae-24': 'BIOFUEL AE 24:',
            'departure-biofuel-total-cons': 'BIOFUEL Total Cons:',

            //Departure BIOFUEL Oil
            'departure-biofuel-oil-me-cyl-oil-grade': 'ME CYL Oil Grade:',
            'departure-biofuel-oil-me-cyl-total-runn-hrs': 'ME CYL Total Running Hours:',
            'departure-biofuel-oil-me-cyl-oil-cons': 'ME CYL Oil Consumption:',
            'departure-biofuel-oil-me-cc-oil-grade': 'ME CC Oil Grade:',
            'departure-biofuel-oil-me-cc-total-run-hrs': 'ME CC Total Running Hours:',
            'departure-biofuel-oil-me-cc-oil-cons': 'ME CC Oil Consumption:',
            'departure-biofuel-oil-ae-oil-grade': 'AE CC Oil Grade:',
            'departure-biofuel-oil-ae-total-runn-hrs-ae1': 'AE1 Total Running Hours:',
            'departure-biofuel-oil-ae-total-runn-hrs-ae2': 'AE2 Total Running Hours:',
            'departure-biofuel-oil-ae-total-runn-hrs-ae3': 'AE3 Total Running Hours:',
            'departure-biofuel-oil-ae-oil-cons': 'AE Oil Consumption:',

            // Departure VLSFO (MT)
            'departure-vlsfo-previous': 'VLSFO Previous:',
            'departure-vlsfo-current': 'VLSFO Current:',
            'departure-vlsfo-me-propulsion': 'VLSFO ME Propulsion:',
            'departure-vlsfo-ae-cons': 'VLSFO AE Cons:',
            'departure-vlsfo-boiler-cons': 'VLSFO Boiler Cons:',
            'departure-vlsfo-incinerators': 'VLSFO Incinerators:',
            'departure-vlsfo-me-24': 'VLSFO ME 24:',
            'departure-vlsfo-ae-24': 'VLSFO AE 24:',
            'departure-vlsfo-total-cons': 'VLSFO Total Cons:',

            //Departure VLSFO Oil
            'departure-vlsfo-oil-me-cyl-oil-grade': 'ME CYL Oil Grade:',
            'departure-vlsfo-oil-me-cyl-total-runn-hrs': 'ME CYL Total Running Hours:',
            'departure-vlsfo-oil-me-cyl-oil-cons': 'ME CYL Oil Consumption:',
            'departure-vlsfo-oil-me-cc-oil-grade': 'ME CC Oil Grade:',
            'departure-vlsfo-oil-me-cc-total-run-hrs': 'ME CC Total Running Hours:',
            'departure-vlsfo-oil-me-cc-oil-cons': 'ME CC Oil Consumption:',
            'departure-vlsfo-oil-ae-oil-grade': 'AE CC Oil Grade:',
            'departure-vlsfo-oil-ae-total-runn-hrs-ae1': 'AE1 Total Running Hours:',
            'departure-vlsfo-oil-ae-total-runn-hrs-ae2': 'AE2 Total Running Hours:',
            'departure-vlsfo-oil-ae-total-runn-hrs-ae3': 'AE3 Total Running Hours:',
            'departure-vlsfo-oil-ae-oil-cons': 'AE Oil Consumption:',

            // Departure LSMGO (MT)
            'departure-lsmgo-previous': 'LSMGO Previous:',
            'departure-lsmgo-current': 'LSMGO Current:',
            'departure-lsmgo-me-propulsion': 'LSMGO ME Propulsion:',
            'departure-lsmgo-ae-cons': 'LSMGO AE Cons:',
            'departure-lsmgo-boiler-cons': 'LSMGO Boiler Cons:',
            'departure-lsmgo-incinerators': 'LSMGO Incinerators:',
            'departure-lsmgo-me-24': 'LSMGO ME 24:',
            'departure-lsmgo-ae-24': 'LSMGO AE 24:',
            'departure-lsmgo-total-cons': 'LSMGO Total Cons:',

            //Departure LSMGO Oil
            'departure-lsmgo-oil-me-cyl-oil-grade': 'ME CYL Oil Grade:',
            'departure-lsmgo-oil-me-cyl-total-runn-hrs': 'ME CYL Total Running Hours:',
            'departure-lsmgo-oil-me-cyl-oil-cons': 'ME CYL Oil Consumption:',
            'departure-lsmgo-oil-me-cc-oil-grade': 'ME CC Oil Grade:',
            'departure-lsmgo-oil-me-cc-total-run-hrs': 'ME CC Total Running Hours:',
            'departure-lsmgo-oil-me-cc-oil-cons': 'ME CC Oil Consumption:',
            'departure-lsmgo-oil-ae-oil-grade': 'AE CC Oil Grade:',
            'departure-lsmgo-oil-ae-total-runn-hrs-ae1': 'AE1 Total Running Hours:',
            'departure-lsmgo-oil-ae-total-runn-hrs-ae2': 'AE2 Total Running Hours:',
            'departure-lsmgo-oil-ae-total-runn-hrs-ae3': 'AE3 Total Running Hours:',
            'departure-lsmgo-oil-ae-oil-cons': 'AE Oil Consumption:',

            // Departure Master Remarks
            'departure-remarks': 'Remarks:',
            'departure-master-name': 'Masters Name:'
        },

        'arrivalreport': {
            // Arrival Voyage Details
            'arrival-voyage-details-vessel-name': 'Vessel Name:',
            'arrival-voyage-details-voyage-no': 'Voyage No:',
            'arrival-voyage-details-date-time': 'Date/Time (LT):',
            'arrival-voyage-details-gmt-offset': 'GMT Offset:',
            'arrival-voyage-details-latitude': 'Latitude:',
            'arrival-voyage-details-longitude': 'Longitude:',
            'arrival-voyage-details-arrival-type': 'Arrival Type:',
            'arrival-voyage-details-port': 'Arrival Port:',
            'arrival-voyage-details-anchored-hours': 'Anchored Hours:',
            'arrival-voyage-details-drifting-hours': 'Drifting Hours:',

            // Arrival Details Since Last Report
            'arrival-details-since-last-report-cp-ordered-speed': 'CP/Ordered Speed (Kts):',
            'arrival-details-since-last-report-allowed-me-cons-at-cp-speed': 'Allowed M/E Cons. at C/P Speed:',
            'arrival-details-since-last-report-obs-distance': 'Obs. Distance (NM):',
            'arrival-details-since-last-report-steaming-time': 'Steaming Time (Hrs):',
            'arrival-details-since-last-report-avg-speed': 'Avg Speed (Kts):',
            'arrival-details-since-last-report-distance-sailed-from-last-port': 'Distance Sailed from Last Port (NM):',
            'arrival-details-since-last-report-course': 'Course (Deg):',
            'arrival-details-since-last-report-breakdown': 'Breakdown (Hrs):',
            'arrival-details-since-last-report-me-revs-counter': 'M/E Revs Counter (Noon to Noon):',
            'arrival-details-since-last-report-avg-rpm': 'Avg RPM:',
            'arrival-details-since-last-report-engine-distance': 'Engine Distance (NM):',
            'arrival-details-since-last-report-slip': 'Slip (%):',
            'arrival-details-since-last-report-avg-power': 'Avg Power (KW):',
            'arrival-details-since-last-report-logged-distance': 'Logged Distance (NM):',
            'arrival-details-since-last-report-speed-through-water': 'Speed Through Water (Kts):',

            // Arrival Conditions
            'arrival-conditions-condition': 'Condition:',
            'arrival-conditions-displacement': 'Displacement (MT):',
            'arrival-conditions-deadweight': 'Deadweight (MT):',
            'arrival-conditions-cargo-weight': 'Cargo Weight (MT):',
            'arrival-conditions-ballast-weight': 'Ballast Weight (MT):',
            'arrival-conditions-fresh-water': 'Fresh Water (MT):',
            'arrival-conditions-fwd-draft': 'Fwd Draft (m):',
            'arrival-conditions-aft-draft': 'Aft Draft (m):',
            'arrival-conditions-gm': 'GM:',

            // Arrival Wind Force/Dir for every six hours
            // Arrival 12:00 - 18:00
            'arrival-wind-force-dir-for-every-six-hours-12-18-wind-force': 'Wind Force (Bft.) (12:00 - 18:00):',
            'arrival-wind-force-dir-for-every-six-hours-12-18-wind-direction': 'Wind Direction (T) (12:00 - 18:00):',
            'arrival-wind-force-dir-for-every-six-hours-12-18-swell-height': 'Swell Height (m) (12:00 - 18:00):',
            'arrival-wind-force-dir-for-every-six-hours-12-18-swell-direction': 'Swell Direction (T) (12:00 - 18:00):',
            'arrival-wind-force-dir-for-every-six-hours-12-18-wind-sea-height': 'Wind Sea Height (m) (12:00 - 18:00):',
            'arrival-wind-force-dir-for-every-six-hours-12-18-sea-direction': 'Sea Direction (T) (12:00 - 18:00):',
            'arrival-wind-force-dir-for-every-six-hours-12-18-sea-ds': 'Sea DS (12:00 - 18:00):',

            // Arrival 18:00 - 00:00
            'arrival-wind-force-dir-for-every-six-hours-18-00-wind-force': 'Wind Force (Bft.) (18:00 - 00:00):',
            'arrival-wind-force-dir-for-every-six-hours-18-00-wind-direction': 'Wind Direction (T) (18:00 - 00:00):',
            'arrival-wind-force-dir-for-every-six-hours-18-00-swell-height': 'Swell Height (m) (18:00 - 00:00):',
            'arrival-wind-force-dir-for-every-six-hours-18-00-swell-direction': 'Swell Direction (T) (18:00 - 00:00):',
            'arrival-wind-force-dir-for-every-six-hours-18-00-wind-sea-height': 'Wind Sea Height (m) (18:00 - 00:00):',
            'arrival-wind-force-dir-for-every-six-hours-18-00-sea-direction': 'Sea Direction (T) (18:00 - 00:00):',
            'arrival-wind-force-dir-for-every-six-hours-18-00-sea-ds': 'Sea DS (18:00 - 00:00):',

            // Arrival 06:00 - 12:00
            'arrival-wind-force-dir-for-every-six-hours-06-12-wind-force': 'Wind Force (Bft.) (06:00 - 12:00):',
            'arrival-wind-force-dir-for-every-six-hours-06-12-wind-direction': 'Wind Direction (T) (06:00 - 12:00):',
            'arrival-wind-force-dir-for-every-six-hours-06-12-swell-height': 'Swell Height (m) (06:00 - 12:00):',
            'arrival-wind-force-dir-for-every-six-hours-06-12-swell-direction': 'Swell Direction (T) (06:00 - 12:00):',
            'arrival-wind-force-dir-for-every-six-hours-06-12-wind-sea-height': 'Wind Sea Height (m) (06:00 - 12:00):',
            'arrival-wind-force-dir-for-every-six-hours-06-12-sea-direction': 'Sea Direction (T) (06:00 - 12:00):',
            'arrival-wind-force-dir-for-every-six-hours-06-12-sea-ds': 'Sea DS (06:00 - 12:00):',

            // Arrival HSFO (MT)
            'arrival-hsfo-previous': 'HSFO Previous:',
            'arrival-hsfo-current': 'HSFO Current:',
            'arrival-hsfo-me-propulsion': 'HSFO ME Propulsion:',
            'arrival-hsfo-ae-cons': 'HSFO AE Cons:',
            'arrival-hsfo-boiler-cons': 'HSFO Boiler Cons:',
            'arrival-hsfo-incinerators': 'HSFO Incinerators:',
            'arrival-hsfo-me-24': 'HSFO ME 24:',
            'arrival-hsfo-ae-24': 'HSFO AE 24:',
            'arrival-hsfo-total-cons': 'HSFO Total Cons:',

            //Arrival HSFO Oil
            'arrival-hsfo-oil-me-cyl-oil-grade': 'ME CYL Oil Grade:',
            'arrival-hsfo-oil-me-cyl-total-runn-hrs': 'ME CYL Total Running Hours:',
            'arrival-hsfo-oil-me-cyl-oil-cons': 'ME CYL Oil Consumption:',
            'arrival-hsfo-oil-me-cc-oil-grade': 'ME CC Oil Grade:',
            'arrival-hsfo-oil-me-cc-total-run-hrs': 'ME CC Total Running Hours:',
            'arrival-hsfo-oil-me-cc-oil-cons': 'ME CC Oil Consumption:',
            'arrival-hsfo-oil-ae-oil-grade': 'AE CC Oil Grade:',
            'arrival-hsfo-oil-ae-total-runn-hrs-ae1': 'AE1 Total Running Hours:',
            'arrival-hsfo-oil-ae-total-runn-hrs-ae2': 'AE2 Total Running Hours:',
            'arrival-hsfo-oil-ae-total-runn-hrs-ae3': 'AE3 Total Running Hours:',
            'arrival-hsfo-oil-ae-oil-cons': 'AE Oil Consumption:',

            // Arrival BIOFUEL (MT)
            'arrival-biofuel-previous': 'BIOFUEL Previous:',
            'arrival-biofuel-current': 'BIOFUEL Current:',
            'arrival-biofuel-me-propulsion': 'BIOFUEL ME Propulsion:',
            'arrival-biofuel-ae-cons': 'BIOFUEL AE Cons:',
            'arrival-biofuel-boiler-cons': 'BIOFUEL Boiler Cons:',
            'arrival-biofuel-incinerators': 'BIOFUEL Incinerators:',
            'arrival-biofuel-me-24': 'BIOFUEL ME 24:',
            'arrival-biofuel-ae-24': 'BIOFUEL AE 24:',
            'arrival-biofuel-total-cons': 'BIOFUEL Total Cons:',

            //Arrival BIOFUEL Oil
            'arrival-biofuel-oil-me-cyl-oil-grade': 'ME CYL Oil Grade:',
            'arrival-biofuel-oil-me-cyl-total-runn-hrs': 'ME CYL Total Running Hours:',
            'arrival-biofuel-oil-me-cyl-oil-cons': 'ME CYL Oil Consumption:',
            'arrival-biofuel-oil-me-cc-oil-grade': 'ME CC Oil Grade:',
            'arrival-biofuel-oil-me-cc-total-run-hrs': 'ME CC Total Running Hours:',
            'arrival-biofuel-oil-me-cc-oil-cons': 'ME CC Oil Consumption:',
            'arrival-biofuel-oil-ae-oil-grade': 'AE CC Oil Grade:',
            'arrival-biofuel-oil-ae-total-runn-hrs-ae1': 'AE1 Total Running Hours:',
            'arrival-biofuel-oil-ae-total-runn-hrs-ae2': 'AE2 Total Running Hours:',
            'arrival-biofuel-oil-ae-total-runn-hrs-ae3': 'AE3 Total Running Hours:',
            'arrival-biofuel-oil-ae-oil-cons': 'AE Oil Consumption:',

            // Arrival VLSFO (MT)
            'arrival-vlsfo-previous': 'VLSFO Previous:',
            'arrival-vlsfo-current': 'VLSFO Current:',
            'arrival-vlsfo-me-propulsion': 'VLSFO ME Propulsion:',
            'arrival-vlsfo-ae-cons': 'VLSFO AE Cons:',
            'arrival-vlsfo-boiler-cons': 'VLSFO Boiler Cons:',
            'arrival-vlsfo-incinerators': 'VLSFO Incinerators:',
            'arrival-vlsfo-me-24': 'VLSFO ME 24:',
            'arrival-vlsfo-ae-24': 'VLSFO AE 24:',
            'arrival-vlsfo-total-cons': 'VLSFO Total Cons:',

            //Arrival VLSFO Oil
            'arrival-vlsfo-oil-me-cyl-oil-grade': 'ME CYL Oil Grade:',
            'arrival-vlsfo-oil-me-cyl-total-runn-hrs': 'ME CYL Total Running Hours:',
            'arrival-vlsfo-oil-me-cyl-oil-cons': 'ME CYL Oil Consumption:',
            'arrival-vlsfo-oil-me-cc-oil-grade': 'ME CC Oil Grade:',
            'arrival-vlsfo-oil-me-cc-total-run-hrs': 'ME CC Total Running Hours:',
            'arrival-vlsfo-oil-me-cc-oil-cons': 'ME CC Oil Consumption:',
            'arrival-vlsfo-oil-ae-oil-grade': 'AE CC Oil Grade:',
            'arrival-vlsfo-oil-ae-total-runn-hrs-ae1': 'AE1 Total Running Hours:',
            'arrival-vlsfo-oil-ae-total-runn-hrs-ae2': 'AE2 Total Running Hours:',
            'arrival-vlsfo-oil-ae-total-runn-hrs-ae3': 'AE3 Total Running Hours:',
            'arrival-vlsfo-oil-ae-oil-cons': 'AE Oil Consumption:',

            // Arrival LSMGO (MT)
            'arrival-lsmgo-previous': 'LSMGO Previous:',
            'arrival-lsmgo-current': 'LSMGO Current:',
            'arrival-lsmgo-me-propulsion': 'LSMGO ME Propulsion:',
            'arrival-lsmgo-ae-cons': 'LSMGO AE Cons:',
            'arrival-lsmgo-boiler-cons': 'LSMGO Boiler Cons:',
            'arrival-lsmgo-incinerators': 'LSMGO Incinerators:',
            'arrival-lsmgo-me-24': 'LSMGO ME 24:',
            'arrival-lsmgo-ae-24': 'LSMGO AE 24:',
            'arrival-lsmgo-total-cons': 'LSMGO Total Cons:',
            
            //Arrival LSMGO Oil
            'arrival-lsmgo-oil-me-cyl-oil-grade': 'ME CYL Oil Grade:',
            'arrival-lsmgo-oil-me-cyl-total-runn-hrs': 'ME CYL Total Running Hours:',
            'arrival-lsmgo-oil-me-cyl-oil-cons': 'ME CYL Oil Consumption:',
            'arrival-lsmgo-oil-me-cc-oil-grade': 'ME CC Oil Grade:',
            'arrival-lsmgo-oil-me-cc-total-run-hrs': 'ME CC Total Running Hours:',
            'arrival-lsmgo-oil-me-cc-oil-cons': 'ME CC Oil Consumption:',
            'arrival-lsmgo-oil-ae-oil-grade': 'AE CC Oil Grade:',
            'arrival-lsmgo-oil-ae-total-runn-hrs-ae1': 'AE1 Total Running Hours:',
            'arrival-lsmgo-oil-ae-total-runn-hrs-ae2': 'AE2 Total Running Hours:',
            'arrival-lsmgo-oil-ae-total-runn-hrs-ae3': 'AE3 Total Running Hours:',
            'arrival-lsmgo-oil-ae-oil-cons': 'AE Oil Consumption:',

            // Arrival Master Remarks
            'arrival-remarks': 'Remarks:',
            'arrival-master-name': 'Master Name:',
        },
        'bunkering': {

            // Bunkering Details
            'bunkering-details-vessel-name': 'Vessel Name:',
            'bunkering-details-voyage-no': 'Voyage No:',
            'bunkering-details-bunkering-port': 'Bunkering Port:',
            'bunkering-details-supplier': 'Supplier:',
            'bunkering-details-port-etd': 'Port ETD (LT):',
            'bunkering-details-port-gmt-offset': 'Port GMT Offset:',
            'bunkering-details-bunker-completed': 'Bunker Completed (LT):',
            'bunkering-details-bunker-gmt-offset': 'Bunker GMT Offset:',

            // Bunkering Bunker Type Quantity Taken (in MT)
            'bunkering-bunker-type-quantity-taken-hsfo-quantity': 'HSFO Quantity (MT):',
            'bunkering-bunker-type-quantity-taken-hsfo-viscosity': 'HSFO Viscosity (CST):',
            'bunkering-bunker-type-quantity-taken-biofuel-quantity': 'BIOFUEL Quantity (MT):',
            'bunkering-bunker-type-quantity-taken-biofuel-viscosity': 'BIOFUEL Viscosity (CST):',
            'bunkering-bunker-type-quantity-taken-vlsfo-quantity': 'VLSFO Quantity (MT):',
            'bunkering-bunker-type-quantity-taken-vlsfo-viscosity': 'VLSFO Viscosity (CST):',
            'bunkering-bunker-type-quantity-taken-lsmgo-quantity': 'LSMGO Quantity (MT):',
            'bunkering-bunker-type-quantity-taken-lsmgo-viscosity': 'LSMGO Viscosity (CST):',

            // Bunkering Associated Information
            'bunkering-associated-information-in-port-vs-off-shore-delivery': 'In Port vs Off Shore Delivery:',
            'bunkering-associated-information-eosp': 'EOSP (LT):',
            'bunkering-associated-information-eosp-gmt-offset': 'EOSP GMT Offset:',
            'bunkering-associated-information-barge-alongside': 'Barge Alongside (LT):',
            'bunkering-associated-information-barge-alongside-gmt-offset': 'Barge Alongside GMT Offset:',
            'bunkering-associated-information-cosp': 'COSP (LT):',
            'bunkering-associated-information-cosp-gmt-offset': 'COSP GMT Offset:',
            'bunkering-associated-information-anchor-dropped': 'Anchor Dropped (LT):',
            'bunkering-associated-information-anchor-dropped-gmt-offset': 'Anchor Dropped GMT Offset:',
            'bunkering-associated-information-pumping-completed': 'Pumping Completed (LT):',
            'bunkering-associated-information-pumping-completed-gmt-offset': 'Pumping Completed GMT Offset:',
            
            // Bunkering Master Remarks
            'bunkering-remarks': 'Remarks:',
            'bunkering-master-name': 'Masters Name:'
        },

        'allfast': {
            // Voyage Details
            'all-fast-voyage-details-vessel-name': 'Vessel Name:',
            'all-fast-voyage-details-voyage-no': 'Voyage No:',
            'all-fast-voyage-details-datetime': 'All Fast Date/Time (LT):',
            'all-fast-voyage-details-gmt-offset': 'GMT Offset:',

            // All Fast ROBs
            'all-fast-rob-hsfo': 'HSFO (MT):',
            'all-fast-rob-biofuel': 'BIOFUEL (MT):',
            'all-fast-rob-vlsfo': 'VLSFO (MT):',
            'all-fast-rob-lsmgo': 'LSMGO (MT):',
        }
    };

        const currentFieldLabels = fieldLabels[reportSection];

        // Extract necessary values from the form
        const vesselNameElement = form.querySelector(`#${adjustedReportSection}-voyage-details-vessel-name`);
        const vesselName = vesselNameElement ? vesselNameElement.options[vesselNameElement.selectedIndex].text : 'Vessel Name';

        const dateTimeElement = form.querySelector(`#${reportSection}-voyage-details-date-time`);
        const date = dateTimeElement ? new Date(dateTimeElement.value) : new Date();
        const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' });

        let exportedReportType = '';

        if (adjustedReportSection === 'noon') {
            const exportReportType = form.querySelector(`#${adjustedReportSection}-voyage-details-report-type`);
            exportedReportType = exportReportType ? exportReportType.options[exportReportType.selectedIndex].text : '';
        }

        const title = `${vesselName} / ${formattedDate}${exportedReportType ? ` / ${exportedReportType}` : ''}`;

        data.push([title]);
        data.push([""]);

    // List of fields to insert sub-titles before section field
        const fieldsWithSubTitles = {
        
        'noonreport' : {

            // Noon Report Section Title
            'noon-voyage-details-vessel-name': 'Voyage Details',
            'noon-details-since-last-report-cp-ordered-speed': 'Details Since Last Report',
            'noon-conditions-condition': 'Noon Conditions',
            'noon-voyage-itinerary-port': 'Voyage Itinerary',
            'noon-average-weather-wind-force': 'Average Weather',
            'noon-bad-weather-details-wind-force-since-last-report': 'Bad Weather Details',
            'noon-wind-force-dir-for-every-six-hours-12-18-wind-force': 'Wind/Force for every six hours',
            'noon-rob-details-tank-1-description': 'ROB Details',
            'noon-hsfo-previous': 'HSFO (MT)',
            'noon-biofuel-previous': 'BIOFUEL (MT)',
            'noon-vlsfo-previous': 'VLSFO (MT)',
            'noon-lsmgo-previous': 'LSMGO (MT)',
            'noon-hsfo-oil-me-cyl-oil-grade': 'HSFO Oil',
            'noon-biofuel-oil-me-cyl-oil-grade': 'BIOFUEL Oil',
            'noon-vlsfo-oil-me-cyl-oil-grade': 'VLSFO Oil',
            'noon-lsmgo-oil-me-cyl-oil-grade': 'LSMGO Oil',
            'noon-remarks': 'Master Remarks',
        },

        'departurereport': {

            // Departure Report Section Title
            'departure-voyage-details-vessel-name': 'Voyage Details',
            'departure-details-since-last-report-cp-ordered-speed' : 'Details Since Last Report',
            'departure-conditions-condition': 'Departure Conditions',
            'departure-voyage-itinerary-port': 'Voyage Itinerary',
            'departure-average-weather-wind-force': 'Average Weather',
            'departure-bad-weather-details-wind-force-since-last-report': 'Bad Weather Details',
            'departure-wind-force-dir-for-every-six-hours-12-18-wind-force': 'Wind/Force for every six hours',
            'departure-rob-details-tank-1-fuel-grade': 'ROB Details',
            'departure-hsfo-previous': 'HSFO (MT)',
            'departure-biofuel-previous': 'BIOFUEL (MT)',
            'departure-vlsfo-previous': 'VLSFO (MT)',
            'departure-lsmgo-previous': 'LSMGO (MT)',
            'departure-hsfo-oil-me-cyl-oil-grade': 'HSFO Oil',
            'departure-biofuel-oil-me-cyl-oil-grade': 'BIOFUEL Oil',
            'departure-vlsfo-oil-me-cyl-oil-grade': 'VLSFO Oil',
            'departure-lsmgo-oil-me-cyl-oil-grade': 'LSMGO Oil',
            'departure-remarks': 'Master Remarks',
        },

        'arrivalreport': {
            // Arrival Report Section Title
            'arrival-voyage-details-vessel-name': 'Voyage Details',
            'arrival-voyage-details-cp-ordered-speed': 'Details Since Last Report',
            'arrival-conditions-condition': 'Arrival Conditions',
            'arrival-average-weather-wind-force': 'Average Weather',
            'arrival-bad-weather-details-wind-force-since-last-report': 'Bad Weather Details',
            'arrival-wind-force-dir-for-every-six-hours-12-18-wind-force': 'Wind/Force for every six hours',
            'arrival-rob-details-tank-1-fuel-grade': 'ROB Details',
            'arrival-hsfo-previous': 'HSFO (MT)',
            'arrival-biofuel-previous': 'BIOFUEL (MT)',
            'arrival-vlsfo-previous': 'VLSFO (MT)',
            'arrival-lsmgo-previous': 'LSMGO (MT)',
            'arrival-hsfo-oil-me-cyl-oil-grade': 'HSFO Oil',
            'arrival-biofuel-oil-me-cyl-oil-grade': 'BIOFUEL Oil',
            'arrival-vlsfo-oil-me-cyl-oil-grade': 'VLSFO Oil',
            'arrival-lsmgo-oil-me-cyl-oil-grade': 'LSMGO Oil',
            'arrival-remarks': 'Master Remarks',
        },
        
        'bunkering': {
            // Bunkering Report Section Title
            'bunkering-details-vessel-name': 'Bunkering Details',
            'bunkering-bunker-type-quantity-taken-hsfo-quantity': 'Bunker Type Quantity Taken (in MT)',
            'bunkering-associated-information-in-port-vs-off-shore-delivery': 'Associated Information',
            'bunkering-remarks': 'Master Remarks',
        },
        
        'allfast': {
            // All Fast Section Title
            'all-fast-voyage-details-vessel-name': 'Voyage Details',
            'all-fast-rob-hsfo': 'All Fast ROBs'
        }
    };

    // List of fields to insert blank rows after
    const fieldsWithBlanks = {

        'noonreport': [
            // Noon Report Section Title
            'noon-voyage-details-port',
            'noon-details-since-last-report-maneuvering-hours',
            'noon-conditions-gm',
            'noon-voyage-itinerary-projected-speed',
            'noon-average-weather-atm-pressure',
            'noon-bad-weather-details-sea-state-continuous',
            'noon-wind-force-dir-for-every-six-hours-12-18-sea-ds',
            'noon-wind-force-dir-for-every-six-hours-18-00-sea-ds',
            'noon-wind-force-dir-for-every-six-hours-06-12-sea-ds',
            'noon-rob-details-tank-1-date-time',
            'noon-rob-details-tank-2-date-time',
            'noon-rob-details-tank-3-date-time',
            'noon-rob-details-tank-4-date-time',
            'noon-rob-details-tank-5-date-time',
            'noon-rob-details-tank-6-date-time',
            'noon-rob-details-tank-7-date-time',
            'noon-rob-details-tank-8-date-time',
            'noon-rob-details-tank-9-date-time',
            'noon-rob-details-tank-10-date-time',
            'noon-rob-details-tank-11-date-time',
            'noon-rob-details-tank-12-date-time',
            'noon-rob-details-tank-13-date-time',
            'noon-rob-details-tank-14-date-time',
            'noon-rob-details-tank-15-date-time',
            'noon-rob-details-tank-16-date-time',
            'noon-rob-details-tank-17-date-time',
            'noon-rob-details-tank-18-date-time',
            'noon-rob-details-tank-19-date-time',
            'noon-rob-details-tank-20-date-time',
            'noon-hsfo-total-cons',
            'noon-biofuel-total-cons',
            'noon-vlsfo-total-cons',
            'noon-lsmgo-total-cons',
            'noon-hsfo-oil-ae-oil-cons',
            'noon-biofuel-oil-ae-oil-cons',
            'noon-vlsfo-oil-ae-oil-cons',
            'noon-lsmgo-oil-ae-oil-cons'
        ],

        'departurereport': [
            // Departure Report Section Title
            'departure-voyage-details-departure-port',
            'departure-details-since-last-report-eta-gmt-offset',
            'departure-conditions-gm',
            'departure-voyage-itinerary-projected-speed',
            'departure-average-weather-atm-pressure',
            'departure-bad-weather-details-sea-state-continuous',
            'departure-wind-force-dir-for-every-six-hours-12-18-sea-ds',
            'departure-wind-force-dir-for-every-six-hours-18-00-sea-ds',
            'departure-wind-force-dir-for-every-six-hours-06-12-sea-ds',
            'departure-rob-details-tank-13-date-time',
            'departure-hsfo-total-cons',
            'departure-biofuel-total-cons',
            'departure-vlsfo-total-cons',
            'departure-lsmgo-total-cons',
            'departure-hsfo-oil-ae-oil-cons',
            'departure-biofuel-oil-ae-oil-cons',
            'departure-vlsfo-oil-ae-oil-cons',
            'departure-lsmgo-oil-ae-oil-cons'
        ],

        'arrivalreport': [
            // Arrival Report Section Title
            'arrival-voyage-details-drifting-hours',
            'arrival-voyage-details-course',
            'arrival-conditions-gm',
            'arrival-average-weather-atm-pressure',
            'arrival-bad-weather-details-sea-state-continuous',
            'arrival-wind-force-dir-for-every-six-hours-12-18-sea-ds',
            'arrival-wind-force-dir-for-every-six-hours-18-00-sea-ds',
            'arrival-wind-force-dir-for-every-six-hours-06-12-sea-ds',
            'arrival-rob-details-tank-13-date-time',
            'arrival-hsfo-total-cons',
            'arrival-biofuel-total-cons',
            'arrival-vlsfo-total-cons',
            'arrival-lsmgo-total-cons',
            'arrival-hsfo-oil-ae-oil-cons',
            'arrival-biofuel-oil-ae-oil-cons',
            'arrival-vlsfo-oil-ae-oil-cons',
            'arrival-lsmgo-oil-ae-oil-cons'
        ],

        'bunkering': [
            // Bunkering Report Section Title
            'bunkering-details-bunker-gmt-offset',
            'bunkering-bunker-type-quantity-taken-lsmgo-viscosity',
            'bunkering-associated-information-pumping-completed-gmt-offset'
        ],

        'allfast': [
            // All Fast Section Title
            'all-fast-voyage-details-gmt-offset',
            'all-fast-rob-lsmgo'
        ]
    };

    const currentFieldSubTitles = fieldsWithSubTitles[reportSection];
    const currentFieldsWithBlanks = fieldsWithBlanks[reportSection];

    // Add form data with sub-titles and blank rows
    formData.forEach((value, key) => {
        if (currentFieldSubTitles[key]) {
            data.push([currentFieldSubTitles[key]]);
        }

        const label = currentFieldLabels[key] || key;
        data.push([label, value]);

        if (currentFieldsWithBlanks.includes(key)) {
            data.push([""]);
        }
    });

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "FormData");

    // Set column widths
    const wscols = [
        { wch: 35 }, // Field column width
        { wch: 25 }  // Value column width
    ];
    worksheet['!cols'] = wscols;

    // Generate dynamic filename
    const filenameExportVesselName = form.querySelector(`#${adjustedReportSection}-voyage-details-vessel-name`);
    const filenameVesselName = filenameExportVesselName ? 
        filenameExportVesselName.options[filenameExportVesselName.selectedIndex].text : 'Vessel Name';

    let filenameReportType = '';

    if (adjustedReportSection === 'noon') {
        const filenameExportReportType = form.querySelector(`#${adjustedReportSection}-voyage-details-report-type`);
        filenameReportType = filenameExportReportType ? 
            (filenameExportReportType.selectedIndex !== -1 ? filenameExportReportType.options[filenameExportReportType.selectedIndex].text : '') 
            : ''; // Only set this value if exporting from the noon report
    }

    const filenameDate = new Date();
    const filenameFormattedDate = filenameDate.toISOString().slice(0, 10).replace(/-/g, '');

    const filename = `${filenameVesselName}-${reportId}-${filenameFormattedDate}${filenameReportType ? `-${filenameReportType}` : ''}.xlsx`;


    XLSX.writeFile(workbook, filename);

    // Clear the form fields after exporting the data
    
    clearFormFields(reportId);    

    // Clear saved local storage
    localStorage.clear();
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

function addRowAllFast() {
    const tableBodyAllFast = document.getElementById('allFastRobTableBody');
    const newRowAllFast = document.createElement('tr');
    newRowAllFast.innerHTML = `
        <td><input class="validate" type="text" name="all-fast-rob-hsfo" required></td>
        <td><input class="validate" type="text" name="all-fast-rob-biofuel" required></td>
        <td><input class="validate" type="text" name="all-fast-rob-vlsfo" required></td>
        <td><input class="validate" type="text" name="all-fast-rob-lsmgo" required></td>
        <td><button type="button" class="remove-button" onclick="removeRow(this)">Remove</button></td>
    `;
    tableBodyAllFast.appendChild(newRowAllFast);
}


let tankNumber = 1;
const maxRowsRobTank = 20;

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
            <td>
                <select id="noon-rob-details-tank-${newTankNumber}-fuel-grade" name="noon-rob-details-tank-${newTankNumber}-fuel-grade">
                    <option value="-1">Select</option>
                    <option value="hsfo">HSFO</option>
                    <option value="biofuel">BIO FUEL</option>
                    <option value="vlsfo">VLSFO</option>
                    <option value="lsmgo">LSMGO</option>
                </select>
            </td>
            <td><input class="validate" type="text" id="noon-rob-details-tank-${newTankNumber}-capacity" name="noon-rob-details-tank-${newTankNumber}-capacity" placeholder="Enter tank capacity"></td>
            <td>
                <select id="noon-rob-details-tank-${newTankNumber}-unit" name="noon-rob-details-tank-${newTankNumber}-unit">
                    <option value="MT">MT</option>
                    <option value="liters">L</option>
                    <option value="gallons">GAL</option>
                </select>
            </td>
            <td><input class="validate" type="text" id="noon-rob-details-tank-${newTankNumber}-rob" name="noon-rob-details-tank-${newTankNumber}-rob"></td>
            <td><input type="datetime-local" id="noon-rob-details-tank-${newTankNumber}-date-time" name="noon-rob-details-tank-${newTankNumber}-date-time"></td>
            <td><button type="button" class="remove-button" onclick="removeRow(this)">Remove</button></td>
        `;

        tableBody.appendChild(newRowRobDetail);
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
        //alert(`Draft for ${reportId} restored!`);
    }
}

// Restore all drafts
function restoreAllDrafts() {
    const reportIds = ['NoonReport', 'DepartureReport', 'ArrivalReport', 'Bunkering', 'AllFast'];
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

    if (reportSection === 'at-sea') {
        document.querySelectorAll('.in-port-section').forEach(function(element) {
            element.style.display = 'none';
         });
         document.querySelectorAll('.at-sea-section').forEach(function(element) {
            element.style.display = 'flex';
         });
         document.querySelectorAll('.at-sea-section-fieldset').forEach(function(element) {
            element.style.display = 'block';
         });
    } else if (reportSection === 'in-port') {
        document.querySelectorAll('.at-sea-section').forEach(function(element) {
            element.style.display = 'none';
         });
         document.querySelectorAll('.at-sea-section-fieldset').forEach(function(element) {
            element.style.display = 'none';
         });
         document.querySelectorAll('.in-port-section').forEach(function(element) {
            element.style.display = 'flex';
         });
    } else if (reportSection === 'at-anchorage') {
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
function setupPortSearch(inputId, resultsId) {
    let portList = [];

    // Fetch the port names from the text file
    fetch('portName.txt')
        .then(response => response.text())
        .then(data => {
            portList = JSON.parse(data); // Parse the JSON data from the file
        })
        .catch(error => console.error('Error loading port names:', error));

    // Search function for ports
    function searchPorts(query) {
        return portList.filter(port => port.toLowerCase().includes(query.toLowerCase()));
    }

    // Event listener for the port search box
    document.getElementById(inputId).addEventListener('input', function() {
        const query = this.value;
        const results = searchPorts(query);

        // Display results
        const resultsContainer = document.getElementById(resultsId);
        resultsContainer.innerHTML = '';

        results.forEach(port => {
            const div = document.createElement('div');
            div.className = 'result-item';
            div.textContent = port;
            div.addEventListener('click', function() {
                // Set the search box value to the selected item
                document.getElementById(inputId).value = port;
                // Hide the dropdown list
                resultsContainer.style.display = 'none';
            });
            resultsContainer.appendChild(div);
        });

        // Apply the limit and make it scrollable if needed
        if (results.length > 0) {
            resultsContainer.style.display = 'block';
            resultsContainer.style.maxHeight = '150px';  // Limit to about 5 items
            resultsContainer.style.overflowY = 'auto';   // Enable scrolling
        } else {
            resultsContainer.style.display = 'none';
        }
    });

    // Hide the results when clicking outside the search box and dropdown
    document.addEventListener('click', function(event) {
        const searchBox = document.getElementById(inputId);
        const resultsContainer = document.getElementById(resultsId);
        if (!searchBox.contains(event.target) && !resultsContainer.contains(event.target)) {
            resultsContainer.style.display = 'none';
        }
    });
}
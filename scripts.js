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

    // Add the port search functionality for Noon Report fields
    setupPortSearch('noon-voyage-details-port', 'noon-voyage-details-port-results');
    setupPortSearch('noon-voyage-itinerary-port', 'noon-voyage-itinerary-port-results');
    setupPortSearch('noon-details-since-last-report-next-port', 'noon-details-since-last-report-next-port-results');

    // Add the port search functionality for Departure Report fields
    setupPortSearch('departure-voyage-details-departure-port', 'departure-voyage-details-departure-port-results');
    setupPortSearch('departure-details-since-last-report-next-port', 'departure-details-since-last-report-next-port-results');
    setupPortSearch('departure-voyage-itinerary-port', 'departure-voyage-itinerary-port-results');

    // Add the port search functionality for Arrival, Bunkering and All fast Report fields
    setupPortSearch('arrival-voyage-details-port', 'arrival-voyage-details-port-results');
    setupPortSearch('bunkering-details-bunkering-port', 'bunkering-details-bunkering-port-results');
    setupPortSearch('allfast-voyage-details-port', 'allfast-voyage-details-port-results');

    // Add the port search functionality for Weekly Schedule Report fields
    setupPortSearch('weekly-schedule-details-port-1', 'weekly-schedule-details-port-1-results');
    setupPortSearch('weekly-schedule-details-port-2-1', 'weekly-schedule-details-port-2-1-results');
    setupPortSearch('weekly-schedule-details-port-3-1', 'weekly-schedule-details-port-3-1-results');
    setupPortSearch('weekly-schedule-details-port-4-1', 'weekly-schedule-details-port-4-1-results');
    setupPortSearch('weekly-schedule-details-port-5-1', 'weekly-schedule-details-port-5-1-results');
    setupPortSearch('weekly-schedule-details-port-6-1', 'weekly-schedule-details-port-6-1-results');
    setupPortSearch('weekly-schedule-details-port-7-1', 'weekly-schedule-details-port-7-1-results');
    setupPortSearch('weekly-schedule-details-port-8-1', 'weekly-schedule-details-port-8-1-results');
    setupPortSearch('weekly-schedule-details-port-9-1', 'weekly-schedule-details-port-9-1-results');
    setupPortSearch('weekly-schedule-details-port-10-1', 'weekly-schedule-details-port-10-1-results');
    setupPortSearch('weekly-schedule-details-port-11-1', 'weekly-schedule-details-port-11-1-results');
    setupPortSearch('weekly-schedule-details-port-12-1', 'weekly-schedule-details-port-12-1-results');
    setupPortSearch('weekly-schedule-details-port-13-1', 'weekly-schedule-details-port-13-1-results');
    setupPortSearch('weekly-schedule-details-port-14-1', 'weekly-schedule-details-port-14-1-results');
    setupPortSearch('weekly-schedule-details-port-15-1', 'weekly-schedule-details-port-15-1-results');
    setupPortSearch('weekly-schedule-details-port-16-1', 'weekly-schedule-details-port-16-1-results');
    setupPortSearch('weekly-schedule-details-port-17-1', 'weekly-schedule-details-port-17-1-results');
    setupPortSearch('weekly-schedule-details-port-18-1', 'weekly-schedule-details-port-18-1-results');
    setupPortSearch('weekly-schedule-details-port-19-1', 'weekly-schedule-details-port-19-1-results');
    setupPortSearch('weekly-schedule-details-port-20-1', 'weekly-schedule-details-port-20-1-results');

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

// Function to export data to excel form
function exportToExcel(reportId) {

    // Find all disabled input fields within the table
    const disabledFields = document.querySelectorAll('input[disabled]');

    // Temporarily remove the disabled attribute
    disabledFields.forEach((field) => {
        field.disabled = false;
    });

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
            'noon-average-weather-sea-current-dir': 'Sea Current Direction (Rel.):',
            'noon-average-weather-swell-height': 'Swell Height (m):',
            'noon-average-weather-observed-sea-dir': 'Observed Sea Dir. (T):',
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

            // Noon 00:00 - 06:00	
            'noon-wind-force-dir-for-every-six-hours-00-06-wind-force': 'Wind Force (Bft.) (00:00 - 06:00):',
            'noon-wind-force-dir-for-every-six-hours-00-06-wind-direction': 'Wind Direction (T) (00:00 - 06:00):',
            'noon-wind-force-dir-for-every-six-hours-00-06-swell-height': 'Swell Height (m) (00:00 - 06:00):',
            'noon-wind-force-dir-for-every-six-hours-00-06-swell-direction': 'Swell Direction (T) (00:00 - 06:00):',
            'noon-wind-force-dir-for-every-six-hours-00-06-wind-sea-height': 'Wind Sea Height (m) (00:00 - 06:00):',
            'noon-wind-force-dir-for-every-six-hours-00-06-sea-direction': 'Sea Direction (T) (00:00 - 06:00):',
            'noon-wind-force-dir-for-every-six-hours-00-06-sea-ds': 'Sea DS (00:00 - 06:00):',

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
            'noon-rob-details-tank-1-date-time': 'Tank 1 Supply Date (LT):',

            'noon-rob-details-tank-2-number': 'Tank 2 Number:',
            'noon-rob-details-tank-2-description': 'Tank 2 Description:',
            'noon-rob-details-tank-2-fuel-grade': 'Tank 2 Fuel Grade:',
            'noon-rob-details-tank-2-capacity': 'Tank 2 Capacity:',
            'noon-rob-details-tank-2-unit': 'Tank 2 Unit:',
            'noon-rob-details-tank-2-rob': 'Tank 2 ROB:',
            'noon-rob-details-tank-2-date-time': 'Tank 2 Supply Date (LT):',

            'noon-rob-details-tank-3-number': 'Tank 3 Number:',
            'noon-rob-details-tank-3-description': 'Tank 3 Description:',
            'noon-rob-details-tank-3-fuel-grade': 'Tank 3 Fuel Grade:',
            'noon-rob-details-tank-3-capacity': 'Tank 3 Capacity:',
            'noon-rob-details-tank-3-unit': 'Tank 3 Unit:',
            'noon-rob-details-tank-3-rob': 'Tank 3 ROB:',
            'noon-rob-details-tank-3-date-time': 'Tank 3 Supply Date (LT):',

            'noon-rob-details-tank-4-number': 'Tank 4 Number:',
            'noon-rob-details-tank-4-description': 'Tank 4 Description:',
            'noon-rob-details-tank-4-fuel-grade': 'Tank 4 Fuel Grade:',
            'noon-rob-details-tank-4-capacity': 'Tank 4 Capacity:',
            'noon-rob-details-tank-4-unit': 'Tank 4 Unit:',
            'noon-rob-details-tank-4-rob': 'Tank 4 ROB:',
            'noon-rob-details-tank-4-date-time': 'Tank 4 Supply Date (LT):',
            
            'noon-rob-details-tank-5-number': 'Tank 5 Number:',
            'noon-rob-details-tank-5-description': 'Tank 5 Description:',
            'noon-rob-details-tank-5-fuel-grade': 'Tank 5 Fuel Grade:',
            'noon-rob-details-tank-5-capacity': 'Tank 5 Capacity:',
            'noon-rob-details-tank-5-unit': 'Tank 5 Unit:',
            'noon-rob-details-tank-5-rob': 'Tank 5 ROB:',
            'noon-rob-details-tank-5-date-time': 'Tank 5 Supply Date (LT):',
            
            'noon-rob-details-tank-6-number': 'Tank 6 Number:',
            'noon-rob-details-tank-6-description': 'Tank 6 Description:',
            'noon-rob-details-tank-6-fuel-grade': 'Tank 6 Fuel Grade:',
            'noon-rob-details-tank-6-capacity': 'Tank 6 Capacity:',
            'noon-rob-details-tank-6-unit': 'Tank 6 Unit:',
            'noon-rob-details-tank-6-rob': 'Tank 6 ROB:',
            'noon-rob-details-tank-6-date-time': 'Tank 6 Supply Date (LT):',

            'noon-rob-details-tank-7-number': 'Tank 7 Number:',
            'noon-rob-details-tank-7-description': 'Tank 7 Description:',
            'noon-rob-details-tank-7-fuel-grade': 'Tank 7 Fuel Grade:',
            'noon-rob-details-tank-7-capacity': 'Tank 7 Capacity:',
            'noon-rob-details-tank-7-unit': 'Tank 7 Unit:',
            'noon-rob-details-tank-7-rob': 'Tank 7 ROB:',
            'noon-rob-details-tank-7-date-time': 'Tank 7 Supply Date (LT):',

            'noon-rob-details-tank-8-number': 'Tank 8 Number:',
            'noon-rob-details-tank-8-description': 'Tank 8 Description:',
            'noon-rob-details-tank-8-fuel-grade': 'Tank 8 Fuel Grade:',
            'noon-rob-details-tank-8-capacity': 'Tank 8 Capacity:',
            'noon-rob-details-tank-8-unit': 'Tank 8 Unit:',
            'noon-rob-details-tank-8-rob': 'Tank 8 ROB:',
            'noon-rob-details-tank-8-date-time': 'Tank 8 Supply Date (LT):',

            'noon-rob-details-tank-9-number': 'Tank 9 Number:',
            'noon-rob-details-tank-9-description': 'Tank 9 Description:',
            'noon-rob-details-tank-9-fuel-grade': 'Tank 9 Fuel Grade:',
            'noon-rob-details-tank-9-capacity': 'Tank 9 Capacity:',
            'noon-rob-details-tank-9-unit': 'Tank 9 Unit:',
            'noon-rob-details-tank-9-rob': 'Tank 9 ROB:',
            'noon-rob-details-tank-9-date-time': 'Tank 9 Supply Date (LT):',

            'noon-rob-details-tank-10-number': 'Tank 10 Number:',
            'noon-rob-details-tank-10-description': 'Tank 10 Description:',
            'noon-rob-details-tank-10-fuel-grade': 'Tank 10 Fuel Grade:',
            'noon-rob-details-tank-10-capacity': 'Tank 10 Capacity:',
            'noon-rob-details-tank-10-unit': 'Tank 10 Unit:',
            'noon-rob-details-tank-10-rob': 'Tank 10 ROB:',
            'noon-rob-details-tank-10-date-time': 'Tank 10 Supply Date (LT):',

            'noon-rob-details-tank-11-number': 'Tank 11 Number:',
            'noon-rob-details-tank-11-description': 'Tank 11 Description:',
            'noon-rob-details-tank-11-fuel-grade': 'Tank 11 Fuel Grade:',
            'noon-rob-details-tank-11-capacity': 'Tank 11 Capacity:',
            'noon-rob-details-tank-11-unit': 'Tank 11 Unit:',
            'noon-rob-details-tank-11-rob': 'Tank 11 ROB:',
            'noon-rob-details-tank-11-date-time': 'Tank 11 Supply Date (LT):',

            'noon-rob-details-tank-12-number': 'Tank 12 Number:',
            'noon-rob-details-tank-12-description': 'Tank 12 Description:',
            'noon-rob-details-tank-12-fuel-grade': 'Tank 12 Fuel Grade:',
            'noon-rob-details-tank-12-capacity': 'Tank 12 Capacity:',
            'noon-rob-details-tank-12-unit': 'Tank 12 Unit:',
            'noon-rob-details-tank-12-rob': 'Tank 12 ROB:',
            'noon-rob-details-tank-12-date-time': 'Tank 12 Supply Date (LT):',

            'noon-rob-details-tank-13-number': 'Tank 13 Number:',
            'noon-rob-details-tank-13-description': 'Tank 13 Description:',
            'noon-rob-details-tank-13-fuel-grade': 'Tank 13 Fuel Grade:',
            'noon-rob-details-tank-13-capacity': 'Tank 13 Capacity:',
            'noon-rob-details-tank-13-unit': 'Tank 13 Unit:',
            'noon-rob-details-tank-13-rob': 'Tank 13 ROB:',
            'noon-rob-details-tank-13-date-time': 'Tank 13 Supply Date (LT):',

            'noon-rob-details-tank-14-number': 'Tank 14 Number:',
            'noon-rob-details-tank-14-description': 'Tank 14 Description:',
            'noon-rob-details-tank-14-fuel-grade': 'Tank 14 Fuel Grade:',
            'noon-rob-details-tank-14-capacity': 'Tank 14 Capacity:',
            'noon-rob-details-tank-14-unit': 'Tank 14 Unit:',
            'noon-rob-details-tank-14-rob': 'Tank 14 ROB:',
            'noon-rob-details-tank-14-date-time': 'Tank 14 Supply Date (LT):',

            'noon-rob-details-tank-15-number': 'Tank 15 Number:',
            'noon-rob-details-tank-15-description': 'Tank 15 Description:',
            'noon-rob-details-tank-15-fuel-grade': 'Tank 15 Fuel Grade:',
            'noon-rob-details-tank-15-capacity': 'Tank 15 Capacity:',
            'noon-rob-details-tank-15-unit': 'Tank 15 Unit:',
            'noon-rob-details-tank-15-rob': 'Tank 15 ROB:',
            'noon-rob-details-tank-15-date-time': 'Tank 15 Supply Date (LT):',

            'noon-rob-details-tank-16-number': 'Tank 16 Number:',
            'noon-rob-details-tank-16-description': 'Tank 16 Description:',
            'noon-rob-details-tank-16-fuel-grade': 'Tank 16 Fuel Grade:',
            'noon-rob-details-tank-16-capacity': 'Tank 16 Capacity:',
            'noon-rob-details-tank-16-unit': 'Tank 16 Unit:',
            'noon-rob-details-tank-16-rob': 'Tank 16 ROB:',
            'noon-rob-details-tank-16-date-time': 'Tank 16 Supply Date (LT):',

            'noon-rob-details-tank-17-number': 'Tank 17 Number:',
            'noon-rob-details-tank-17-description': 'Tank 17 Description:',
            'noon-rob-details-tank-17-fuel-grade': 'Tank 17 Fuel Grade:',
            'noon-rob-details-tank-17-capacity': 'Tank 17 Capacity:',
            'noon-rob-details-tank-17-unit': 'Tank 17 Unit:',
            'noon-rob-details-tank-17-rob': 'Tank 17 ROB:',
            'noon-rob-details-tank-17-date-time': 'Tank 17 Supply Date (LT):',

            'noon-rob-details-tank-18-number': 'Tank 18 Number:',
            'noon-rob-details-tank-18-description': 'Tank 18 Description:',
            'noon-rob-details-tank-18-fuel-grade': 'Tank 18 Fuel Grade:',
            'noon-rob-details-tank-18-capacity': 'Tank 18 Capacity:',
            'noon-rob-details-tank-18-unit': 'Tank 18 Unit:',
            'noon-rob-details-tank-18-rob': 'Tank 18 ROB:',
            'noon-rob-details-tank-18-date-time': 'Tank 18 Supply Date (LT):',

            'noon-rob-details-tank-19-number': 'Tank 19 Number:',
            'noon-rob-details-tank-19-description': 'Tank 19 Description:',
            'noon-rob-details-tank-19-fuel-grade': 'Tank 19 Fuel Grade:',
            'noon-rob-details-tank-19-capacity': 'Tank 19 Capacity:',
            'noon-rob-details-tank-19-unit': 'Tank 19 Unit:',
            'noon-rob-details-tank-19-rob': 'Tank 19 ROB:',
            'noon-rob-details-tank-19-date-time': 'Tank 19 Supply Date (LT):',

            'noon-rob-details-tank-20-number': 'Tank 20 Number:',
            'noon-rob-details-tank-20-description': 'Tank 20 Description:',
            'noon-rob-details-tank-20-fuel-grade': 'Tank 20 Fuel Grade:',
            'noon-rob-details-tank-20-capacity': 'Tank 20 Capacity:',
            'noon-rob-details-tank-20-unit': 'Tank 20 Unit:',
            'noon-rob-details-tank-20-rob': 'Tank 20 ROB:',
            'noon-rob-details-tank-20-date-time': 'Tank 19 Supply Date (LT):',

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
            'noon-hsfo-oil-me-cyl-oil-quantity': 'ME CYL Oil Quantity:',
            'noon-hsfo-oil-me-cyl-total-runn-hrs': 'ME CYL Total Running Hours:',
            'noon-hsfo-oil-me-cyl-oil-cons': 'ME CYL Oil Consumption:',
            'noon-hsfo-oil-me-cc-oil-grade': 'ME CC Oil Grade:',
            'noon-hsfo-oil-me-cc-oil-quantity': 'ME CC Oil Quantity:',
            'noon-hsfo-oil-me-cc-total-run-hrs': 'ME CC Total Running Hours:',
            'noon-hsfo-oil-me-cc-oil-cons': 'ME CC Oil Consumption:',
            'noon-hsfo-oil-ae1-cc-oil-grade': 'AE1 CC Oil Grade:',
            'noon-hsfo-oil-ae1-cc-oil-quantity': 'AE1 CC Oil Quantity:',
            'noon-hsfo-oil-ae1-cc-total-runn-hrs': 'AE1 CC Total Running Hours:',
            'noon-hsfo-oil-ae1-cc-oil-cons': 'AE1 CC Oil Consumption:',
            'noon-hsfo-oil-ae2-cc-oil-grade': 'AE2 CC Oil Grade:',
            'noon-hsfo-oil-ae2-cc-oil-quantity': 'AE2 CC Oil Quantity:',
            'noon-hsfo-oil-ae2-cc-total-runn-hrs': 'AE2 CC Total Running Hours:',
            'noon-hsfo-oil-ae2-cc-oil-cons': 'AE2 CC Oil Consumption:',
            'noon-hsfo-oil-ae3-cc-oil-grade': 'AE3 CC Oil Grade:',
            'noon-hsfo-oil-ae3-cc-oil-quantity': 'AE3 CC Oil Quantity:',
            'noon-hsfo-oil-ae3-cc-total-runn-hrs': 'AE3 CC Total Running Hours:',
            'noon-hsfo-oil-ae3-cc-oil-cons': 'AE3 CC Oil Consumption:',
            
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
            'noon-biofuel-oil-me-cyl-oil-quantity': 'ME CYL Oil Quantity:',
            'noon-biofuel-oil-me-cyl-total-runn-hrs': 'ME CYL Total Running Hours:',
            'noon-biofuel-oil-me-cyl-oil-cons': 'ME CYL Oil Consumption:',
            'noon-biofuel-oil-me-cc-oil-grade': 'ME CC Oil Grade:',
            'noon-biofuel-oil-me-cc-oil-quantity': 'ME CC Oil Quantity:',
            'noon-biofuel-oil-me-cc-total-run-hrs': 'ME CC Total Running Hours:',
            'noon-biofuel-oil-me-cc-oil-cons': 'ME CC Oil Consumption:',
            'noon-biofuel-oil-ae1-cc-oil-grade': 'AE1 CC Oil Grade:',
            'noon-biofuel-oil-ae1-cc-oil-quantity': 'AE1 CC Oil Quantity:',
            'noon-biofuel-oil-ae1-cc-total-runn-hrs': 'AE1 CC Total Running Hours:',
            'noon-biofuel-oil-ae1-cc-oil-cons': 'AE1 CC Oil Consumption:',
            'noon-biofuel-oil-ae2-cc-oil-grade': 'AE2 CC Oil Grade:',
            'noon-biofuel-oil-ae2-cc-oil-quantity': 'AE2 CC Oil Quantity:',
            'noon-biofuel-oil-ae2-cc-total-runn-hrs': 'AE2 CC Total Running Hours:',
            'noon-biofuel-oil-ae2-cc-oil-cons': 'AE2 CC Oil Consumption:',
            'noon-biofuel-oil-ae3-cc-oil-grade': 'AE3 CC Oil Grade:',
            'noon-biofuel-oil-ae3-cc-oil-quantity': 'AE3 CC Oil Quantity:',
            'noon-biofuel-oil-ae3-cc-total-runn-hrs': 'AE3 CC Total Running Hours:',
            'noon-biofuel-oil-ae3-cc-oil-cons': 'AE3 CC Oil Consumption:',

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
            'noon-vlsfo-oil-me-cyl-oil-quantity': 'ME CYL Oil Quantity:',
            'noon-vlsfo-oil-me-cyl-total-runn-hrs': 'ME CYL Total Running Hours:',
            'noon-vlsfo-oil-me-cyl-oil-cons': 'ME CYL Oil Consumption:',
            'noon-vlsfo-oil-me-cc-oil-grade': 'ME CC Oil Grade:',
            'noon-vlsfo-oil-me-cc-oil-quantity': 'ME CC Oil Quantity:',
            'noon-vlsfo-oil-me-cc-total-run-hrs': 'ME CC Total Running Hours:',
            'noon-vlsfo-oil-me-cc-oil-cons': 'ME CC Oil Consumption:',
            'noon-vlsfo-oil-ae1-cc-oil-grade': 'AE1 CC Oil Grade:',
            'noon-vlsfo-oil-ae1-cc-oil-quantity': 'AE1 CC Oil Quantity:',
            'noon-vlsfo-oil-ae1-cc-total-runn-hrs': 'AE1 CC Total Running Hours:',
            'noon-vlsfo-oil-ae1-cc-oil-cons': 'AE1 CC Oil Consumption:',
            'noon-vlsfo-oil-ae2-cc-oil-grade': 'AE2 CC Oil Grade:',
            'noon-vlsfo-oil-ae2-cc-oil-quantity': 'AE2 CC Oil Quantity:',
            'noon-vlsfo-oil-ae2-cc-total-runn-hrs': 'AE2 CC Total Running Hours:',
            'noon-vlsfo-oil-ae2-cc-oil-cons': 'AE2 CC Oil Consumption:',
            'noon-vlsfo-oil-ae3-cc-oil-grade': 'AE3 CC Oil Grade:',
            'noon-vlsfo-oil-ae3-cc-oil-quantity': 'AE3 CC Oil Quantity:',
            'noon-vlsfo-oil-ae3-cc-total-runn-hrs': 'AE3 CC Total Running Hours:',
            'noon-vlsfo-oil-ae3-cc-oil-cons': 'AE3 CC Oil Consumption:',

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
            'noon-lsmgo-oil-me-cyl-oil-quantity': 'ME CYL Oil Quantity:',
            'noon-lsmgo-oil-me-cyl-total-runn-hrs': 'ME CYL Total Running Hours:',
            'noon-lsmgo-oil-me-cyl-oil-cons': 'ME CYL Oil Consumption:',
            'noon-lsmgo-oil-me-cc-oil-grade': 'ME CC Oil Grade:',
            'noon-lsmgo-oil-me-cc-oil-quantity': 'ME CC Oil Quantity:',
            'noon-lsmgo-oil-me-cc-total-run-hrs': 'ME CC Total Running Hours:',
            'noon-lsmgo-oil-me-cc-oil-cons': 'ME CC Oil Consumption:',
            'noon-lsmgo-oil-ae1-cc-oil-grade': 'AE1 CC Oil Grade:',
            'noon-lsmgo-oil-ae1-cc-oil-quantity': 'AE1 CC Oil Quantity:',
            'noon-lsmgo-oil-ae1-cc-total-runn-hrs': 'AE1 CC Total Running Hours:',
            'noon-lsmgo-oil-ae1-cc-oil-cons': 'AE1 CC Oil Consumption:',
            'noon-lsmgo-oil-ae2-cc-oil-grade': 'AE2 CC Oil Grade:',
            'noon-lsmgo-oil-ae2-cc-oil-quantity': 'AE2 CC Oil Quantity:',
            'noon-lsmgo-oil-ae2-cc-total-runn-hrs': 'AE2 CC Total Running Hours:',
            'noon-lsmgo-oil-ae2-cc-oil-cons': 'AE2 CC Oil Consumption:',
            'noon-lsmgo-oil-ae3-cc-oil-grade': 'AE3 CC Oil Grade:',
            'noon-lsmgo-oil-ae3-cc-oil-quantity': 'AE3 CC Oil Quantity:',
            'noon-lsmgo-oil-ae3-cc-total-runn-hrs': 'AE3 CC Total Running Hours:',
            'noon-lsmgo-oil-ae3-cc-oil-cons': 'AE3 CC Oil Consumption:',

            //Arrival Known Next Port Agent Details Port 1
            'port1-agent-company-name': 'port1-agent-company-name',
            'port1-agent-address': 'port1-agent-address',
            'port1-agent-pic-name': 'port1-agent-pic-name',
            'port1-agent-telephone': 'port1-agent-telephone',
            'port1-agent-mobile': 'port1-agent-mobile',
            'port1-agent-email': 'port1-agent-email',

            //Arrival Known Next Port Agent Details Port 2
            'port2-agent-company-name': 'port2-agent-company-name',
            'port2-agent-address': 'port2-agent-address',
            'port2-agent-pic-name': 'port2-agent-pic-name',
            'port2-agent-telephone': 'port2-agent-telephone',
            'port2-agent-mobile': 'port2-agent-mobile',
            'port2-agent-email': 'port2-agent-email',

            //Arrival Known Next Port Agent Details Port 2
            'port3-agent-company-name': 'port3-agent-company-name',
            'port3-agent-address': 'port3-agent-address',
            'port3-agent-pic-name': 'port3-agent-pic-name',
            'port3-agent-telephone': 'port3-agent-telephone',
            'port3-agent-mobile': 'port3-agent-mobile',
            'port3-agent-email': 'port3-agent-email',

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

            // Departure 00:00 - 06:00	
            'departure-wind-force-dir-for-every-six-hours-00-06-wind-force': 'Wind Force (Bft.) (00:00 - 06:00):',
            'departure-wind-force-dir-for-every-six-hours-00-06-wind-direction': 'Wind Direction (T) (00:00 - 06:00):',
            'departure-wind-force-dir-for-every-six-hours-00-06-swell-height': 'Swell Height (m) (00:00 - 06:00):',
            'departure-wind-force-dir-for-every-six-hours-00-06-swell-direction': 'Swell Direction (T) (00:00 - 06:00):',
            'departure-wind-force-dir-for-every-six-hours-00-06-wind-sea-height': 'Wind Sea Height (m) (00:00 - 06:00):',
            'departure-wind-force-dir-for-every-six-hours-00-06-sea-direction': 'Sea Direction (T) (00:00 - 06:00):',
            'departure-wind-force-dir-for-every-six-hours-00-06-sea-ds': 'Sea DS (00:00 - 06:00):',

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

            //  Departure HSFO Oil
            'departure-hsfo-oil-me-cyl-oil-grade': 'ME CYL Oil Grade:',
            'departure-hsfo-oil-me-cyl-oil-quantity': 'ME CYL Oil Quantity:',
            'departure-hsfo-oil-me-cyl-total-runn-hrs': 'ME CYL Total Running Hours:',
            'departure-hsfo-oil-me-cyl-oil-cons': 'ME CYL Oil Consumption:',
            'departure-hsfo-oil-me-cc-oil-grade': 'ME CC Oil Grade:',
            'departure-hsfo-oil-me-cc-oil-quantity': 'ME CC Oil Quantity:',
            'departure-hsfo-oil-me-cc-total-run-hrs': 'ME CC Total Running Hours:',
            'departure-hsfo-oil-me-cc-oil-cons': 'ME CC Oil Consumption:',
            'departure-hsfo-oil-ae1-cc-oil-grade': 'AE1 CC Oil Grade:',
            'departure-hsfo-oil-ae1-cc-oil-quantity': 'AE1 CC Oil Quantity:',
            'departure-hsfo-oil-ae1-cc-total-runn-hrs': 'AE1 CC Total Running Hours:',
            'departure-hsfo-oil-ae1-cc-oil-cons': 'AE1 CC Oil Consumption:',
            'departure-hsfo-oil-ae2-cc-oil-grade': 'AE2 CC Oil Grade:',
            'departure-hsfo-oil-ae2-cc-oil-quantity': 'AE2 CC Oil Quantity:',
            'departure-hsfo-oil-ae2-cc-total-runn-hrs': 'AE2 CC Total Running Hours:',
            'departure-hsfo-oil-ae2-cc-oil-cons': 'AE2 CC Oil Consumption:',
            'departure-hsfo-oil-ae3-cc-oil-grade': 'AE3 CC Oil Grade:',
            'departure-hsfo-oil-ae3-cc-oil-quantity': 'AE3 CC Oil Quantity:',
            'departure-hsfo-oil-ae3-cc-total-runn-hrs': 'AE3 CC Total Running Hours:',
            'departure-hsfo-oil-ae3-cc-oil-cons': 'AE3 CC Oil Consumption:',
            
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

            // Departure BIOFUEL Oil
            'departure-biofuel-oil-me-cyl-oil-grade': 'ME CYL Oil Grade:',
            'departure-biofuel-oil-me-cyl-oil-quantity': 'ME CYL Oil Quantity:',
            'departure-biofuel-oil-me-cyl-total-runn-hrs': 'ME CYL Total Running Hours:',
            'departure-biofuel-oil-me-cyl-oil-cons': 'ME CYL Oil Consumption:',
            'departure-biofuel-oil-me-cc-oil-grade': 'ME CC Oil Grade:',
            'departure-biofuel-oil-me-cc-oil-quantity': 'ME CC Oil Quantity:',
            'departure-biofuel-oil-me-cc-total-run-hrs': 'ME CC Total Running Hours:',
            'departure-biofuel-oil-me-cc-oil-cons': 'ME CC Oil Consumption:',
            'departure-biofuel-oil-ae1-cc-oil-grade': 'AE1 CC Oil Grade:',
            'departure-biofuel-oil-ae1-cc-oil-quantity': 'AE1 CC Oil Quantity:',
            'departure-biofuel-oil-ae1-cc-total-runn-hrs': 'AE1 CC Total Running Hours:',
            'departure-biofuel-oil-ae1-cc-oil-cons': 'AE1 CC Oil Consumption:',
            'departure-biofuel-oil-ae2-cc-oil-grade': 'AE2 CC Oil Grade:',
            'departure-biofuel-oil-ae2-cc-oil-quantity': 'AE2 CC Oil Quantity:',
            'departure-biofuel-oil-ae2-cc-total-runn-hrs': 'AE2 CC Total Running Hours:',
            'departure-biofuel-oil-ae2-cc-oil-cons': 'AE2 CC Oil Consumption:',
            'departure-biofuel-oil-ae3-cc-oil-grade': 'AE3 CC Oil Grade:',
            'departure-biofuel-oil-ae3-cc-oil-quantity': 'AE3 CC Oil Quantity:',
            'departure-biofuel-oil-ae3-cc-total-runn-hrs': 'AE3 CC Total Running Hours:',
            'departure-biofuel-oil-ae3-cc-oil-cons': 'AE3 CC Oil Consumption:',

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

            // Departure VLSFO Oil
            'departure-vlsfo-oil-me-cyl-oil-grade': 'ME CYL Oil Grade:',
            'departure-vlsfo-oil-me-cyl-oil-quantity': 'ME CYL Oil Quantity:',
            'departure-vlsfo-oil-me-cyl-total-runn-hrs': 'ME CYL Total Running Hours:',
            'departure-vlsfo-oil-me-cyl-oil-cons': 'ME CYL Oil Consumption:',
            'departure-vlsfo-oil-me-cc-oil-grade': 'ME CC Oil Grade:',
            'departure-vlsfo-oil-me-cc-oil-quantity': 'ME CC Oil Quantity:',
            'departure-vlsfo-oil-me-cc-total-run-hrs': 'ME CC Total Running Hours:',
            'departure-vlsfo-oil-me-cc-oil-cons': 'ME CC Oil Consumption:',
            'departure-vlsfo-oil-ae1-cc-oil-grade': 'AE1 CC Oil Grade:',
            'departure-vlsfo-oil-ae1-cc-oil-quantity': 'AE1 CC Oil Quantity:',
            'departure-vlsfo-oil-ae1-cc-total-runn-hrs': 'AE1 CC Total Running Hours:',
            'departure-vlsfo-oil-ae1-cc-oil-cons': 'AE1 CC Oil Consumption:',
            'departure-vlsfo-oil-ae2-cc-oil-grade': 'AE2 CC Oil Grade:',
            'departure-vlsfo-oil-ae2-cc-oil-quantity': 'AE2 CC Oil Quantity:',
            'departure-vlsfo-oil-ae2-cc-total-runn-hrs': 'AE2 CC Total Running Hours:',
            'departure-vlsfo-oil-ae2-cc-oil-cons': 'AE2 CC Oil Consumption:',
            'departure-vlsfo-oil-ae3-cc-oil-grade': 'AE3 CC Oil Grade:',
            'departure-vlsfo-oil-ae3-cc-oil-quantity': 'AE3 CC Oil Quantity:',
            'departure-vlsfo-oil-ae3-cc-total-runn-hrs': 'AE3 CC Total Running Hours:',
            'departure-vlsfo-oil-ae3-cc-oil-cons': 'AE3 CC Oil Consumption:',

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

            // Departure LSMGO Oil
            'departure-lsmgo-oil-me-cyl-oil-grade': 'ME CYL Oil Grade:',
            'departure-lsmgo-oil-me-cyl-oil-quantity': 'ME CYL Oil Quantity:',
            'departure-lsmgo-oil-me-cyl-total-runn-hrs': 'ME CYL Total Running Hours:',
            'departure-lsmgo-oil-me-cyl-oil-cons': 'ME CYL Oil Consumption:',
            'departure-lsmgo-oil-me-cc-oil-grade': 'ME CC Oil Grade:',
            'departure-lsmgo-oil-me-cc-oil-quantity': 'ME CC Oil Quantity:',
            'departure-lsmgo-oil-me-cc-total-run-hrs': 'ME CC Total Running Hours:',
            'departure-lsmgo-oil-me-cc-oil-cons': 'ME CC Oil Consumption:',
            'departure-lsmgo-oil-ae1-cc-oil-grade': 'AE1 CC Oil Grade:',
            'departure-lsmgo-oil-ae1-cc-oil-quantity': 'AE1 CC Oil Quantity:',
            'departure-lsmgo-oil-ae1-cc-total-runn-hrs': 'AE1 CC Total Running Hours:',
            'departure-lsmgo-oil-ae1-cc-oil-cons': 'AE1 CC Oil Consumption:',
            'departure-lsmgo-oil-ae2-cc-oil-grade': 'AE2 CC Oil Grade:',
            'departure-lsmgo-oil-ae2-cc-oil-quantity': 'AE2 CC Oil Quantity:',
            'departure-lsmgo-oil-ae2-cc-total-runn-hrs': 'AE2 CC Total Running Hours:',
            'departure-lsmgo-oil-ae2-cc-oil-cons': 'AE2 CC Oil Consumption:',
            'departure-lsmgo-oil-ae3-cc-oil-grade': 'AE3 CC Oil Grade:',
            'departure-lsmgo-oil-ae3-cc-oil-quantity': 'AE3 CC Oil Quantity:',
            'departure-lsmgo-oil-ae3-cc-total-runn-hrs': 'AE3 CC Total Running Hours:',
            'departure-lsmgo-oil-ae3-cc-oil-cons': 'AE3 CC Oil Consumption:',

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

            // Arrival 00:00 - 06:00	
            'arrival-wind-force-dir-for-every-six-hours-00-06-wind-force': 'Wind Force (Bft.) (00:00 - 06:00):',
            'arrival-wind-force-dir-for-every-six-hours-00-06-wind-direction': 'Wind Direction (T) (00:00 - 06:00):',
            'arrival-wind-force-dir-for-every-six-hours-00-06-swell-height': 'Swell Height (m) (00:00 - 06:00):',
            'arrival-wind-force-dir-for-every-six-hours-00-06-swell-direction': 'Swell Direction (T) (00:00 - 06:00):',
            'arrival-wind-force-dir-for-every-six-hours-00-06-wind-sea-height': 'Wind Sea Height (m) (00:00 - 06:00):',
            'arrival-wind-force-dir-for-every-six-hours-00-06-sea-direction': 'Sea Direction (T) (00:00 - 06:00):',
            'arrival-wind-force-dir-for-every-six-hours-00-06-sea-ds': 'Sea DS (00:00 - 06:00):',

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

            // Arrival HSFO Oil
            'arrival-hsfo-oil-me-cyl-oil-grade': 'ME CYL Oil Grade:',
            'arrival-hsfo-oil-me-cyl-oil-quantity': 'ME CYL Oil Quantity:',
            'arrival-hsfo-oil-me-cyl-total-runn-hrs': 'ME CYL Total Running Hours:',
            'arrival-hsfo-oil-me-cyl-oil-cons': 'ME CYL Oil Consumption:',
            'arrival-hsfo-oil-me-cc-oil-grade': 'ME CC Oil Grade:',
            'arrival-hsfo-oil-me-cc-oil-quantity': 'ME CC Oil Quantity:',
            'arrival-hsfo-oil-me-cc-total-run-hrs': 'ME CC Total Running Hours:',
            'arrival-hsfo-oil-me-cc-oil-cons': 'ME CC Oil Consumption:',
            'arrival-hsfo-oil-ae1-cc-oil-grade': 'AE1 CC Oil Grade:',
            'arrival-hsfo-oil-ae1-cc-oil-quantity': 'AE1 CC Oil Quantity:',
            'arrival-hsfo-oil-ae1-cc-total-runn-hrs': 'AE1 CC Total Running Hours:',
            'arrival-hsfo-oil-ae1-cc-oil-cons': 'AE1 CC Oil Consumption:',
            'arrival-hsfo-oil-ae2-cc-oil-grade': 'AE2 CC Oil Grade:',
            'arrival-hsfo-oil-ae2-cc-oil-quantity': 'AE2 CC Oil Quantity:',
            'arrival-hsfo-oil-ae2-cc-total-runn-hrs': 'AE2 CC Total Running Hours:',
            'arrival-hsfo-oil-ae2-cc-oil-cons': 'AE2 CC Oil Consumption:',
            'arrival-hsfo-oil-ae3-cc-oil-grade': 'AE3 CC Oil Grade:',
            'arrival-hsfo-oil-ae3-cc-oil-quantity': 'AE3 CC Oil Quantity:',
            'arrival-hsfo-oil-ae3-cc-total-runn-hrs': 'AE3 CC Total Running Hours:',
            'arrival-hsfo-oil-ae3-cc-oil-cons': 'AE3 CC Oil Consumption:',
            
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

            // Arrival BIOFUEL Oil
            'arrival-biofuel-oil-me-cyl-oil-grade': 'ME CYL Oil Grade:',
            'arrival-biofuel-oil-me-cyl-oil-quantity': 'ME CYL Oil Quantity:',
            'arrival-biofuel-oil-me-cyl-total-runn-hrs': 'ME CYL Total Running Hours:',
            'arrival-biofuel-oil-me-cyl-oil-cons': 'ME CYL Oil Consumption:',
            'arrival-biofuel-oil-me-cc-oil-grade': 'ME CC Oil Grade:',
            'arrival-biofuel-oil-me-cc-oil-quantity': 'ME CC Oil Quantity:',
            'arrival-biofuel-oil-me-cc-total-run-hrs': 'ME CC Total Running Hours:',
            'arrival-biofuel-oil-me-cc-oil-cons': 'ME CC Oil Consumption:',
            'arrival-biofuel-oil-ae1-cc-oil-grade': 'AE1 CC Oil Grade:',
            'arrival-biofuel-oil-ae1-cc-oil-quantity': 'AE1 CC Oil Quantity:',
            'arrival-biofuel-oil-ae1-cc-total-runn-hrs': 'AE1 CC Total Running Hours:',
            'arrival-biofuel-oil-ae1-cc-oil-cons': 'AE1 CC Oil Consumption:',
            'arrival-biofuel-oil-ae2-cc-oil-grade': 'AE2 CC Oil Grade:',
            'arrival-biofuel-oil-ae2-cc-oil-quantity': 'AE2 CC Oil Quantity:',
            'arrival-biofuel-oil-ae2-cc-total-runn-hrs': 'AE2 CC Total Running Hours:',
            'arrival-biofuel-oil-ae2-cc-oil-cons': 'AE2 CC Oil Consumption:',
            'arrival-biofuel-oil-ae3-cc-oil-grade': 'AE3 CC Oil Grade:',
            'arrival-biofuel-oil-ae3-cc-oil-quantity': 'AE3 CC Oil Quantity:',
            'arrival-biofuel-oil-ae3-cc-total-runn-hrs': 'AE3 CC Total Running Hours:',
            'arrival-biofuel-oil-ae3-cc-oil-cons': 'AE3 CC Oil Consumption:',

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

            // Arrival VLSFO Oil
            'arrival-vlsfo-oil-me-cyl-oil-grade': 'ME CYL Oil Grade:',
            'arrival-vlsfo-oil-me-cyl-oil-quantity': 'ME CYL Oil Quantity:',
            'arrival-vlsfo-oil-me-cyl-total-runn-hrs': 'ME CYL Total Running Hours:',
            'arrival-vlsfo-oil-me-cyl-oil-cons': 'ME CYL Oil Consumption:',
            'arrival-vlsfo-oil-me-cc-oil-grade': 'ME CC Oil Grade:',
            'arrival-vlsfo-oil-me-cc-oil-quantity': 'ME CC Oil Quantity:',
            'arrival-vlsfo-oil-me-cc-total-run-hrs': 'ME CC Total Running Hours:',
            'arrival-vlsfo-oil-me-cc-oil-cons': 'ME CC Oil Consumption:',
            'arrival-vlsfo-oil-ae1-cc-oil-grade': 'AE1 CC Oil Grade:',
            'arrival-vlsfo-oil-ae1-cc-oil-quantity': 'AE1 CC Oil Quantity:',
            'arrival-vlsfo-oil-ae1-cc-total-runn-hrs': 'AE1 CC Total Running Hours:',
            'arrival-vlsfo-oil-ae1-cc-oil-cons': 'AE1 CC Oil Consumption:',
            'arrival-vlsfo-oil-ae2-cc-oil-grade': 'AE2 CC Oil Grade:',
            'arrival-vlsfo-oil-ae2-cc-oil-quantity': 'AE2 CC Oil Quantity:',
            'arrival-vlsfo-oil-ae2-cc-total-runn-hrs': 'AE2 CC Total Running Hours:',
            'arrival-vlsfo-oil-ae2-cc-oil-cons': 'AE2 CC Oil Consumption:',
            'arrival-vlsfo-oil-ae3-cc-oil-grade': 'AE3 CC Oil Grade:',
            'arrival-vlsfo-oil-ae3-cc-oil-quantity': 'AE3 CC Oil Quantity:',
            'arrival-vlsfo-oil-ae3-cc-total-runn-hrs': 'AE3 CC Total Running Hours:',
            'arrival-vlsfo-oil-ae3-cc-oil-cons': 'AE3 CC Oil Consumption:',

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

            // Arrival LSMGO Oil
            'arrival-lsmgo-oil-me-cyl-oil-grade': 'ME CYL Oil Grade:',
            'arrival-lsmgo-oil-me-cyl-oil-quantity': 'ME CYL Oil Quantity:',
            'arrival-lsmgo-oil-me-cyl-total-runn-hrs': 'ME CYL Total Running Hours:',
            'arrival-lsmgo-oil-me-cyl-oil-cons': 'ME CYL Oil Consumption:',
            'arrival-lsmgo-oil-me-cc-oil-grade': 'ME CC Oil Grade:',
            'arrival-lsmgo-oil-me-cc-oil-quantity': 'ME CC Oil Quantity:',
            'arrival-lsmgo-oil-me-cc-total-run-hrs': 'ME CC Total Running Hours:',
            'arrival-lsmgo-oil-me-cc-oil-cons': 'ME CC Oil Consumption:',
            'arrival-lsmgo-oil-ae1-cc-oil-grade': 'AE1 CC Oil Grade:',
            'arrival-lsmgo-oil-ae1-cc-oil-quantity': 'AE1 CC Oil Quantity:',
            'arrival-lsmgo-oil-ae1-cc-total-runn-hrs': 'AE1 CC Total Running Hours:',
            'arrival-lsmgo-oil-ae1-cc-oil-cons': 'AE1 CC Oil Consumption:',
            'arrival-lsmgo-oil-ae2-cc-oil-grade': 'AE2 CC Oil Grade:',
            'arrival-lsmgo-oil-ae2-cc-oil-quantity': 'AE2 CC Oil Quantity:',
            'arrival-lsmgo-oil-ae2-cc-total-runn-hrs': 'AE2 CC Total Running Hours:',
            'arrival-lsmgo-oil-ae2-cc-oil-cons': 'AE2 CC Oil Consumption:',
            'arrival-lsmgo-oil-ae3-cc-oil-grade': 'AE3 CC Oil Grade:',
            'arrival-lsmgo-oil-ae3-cc-oil-quantity': 'AE3 CC Oil Quantity:',
            'arrival-lsmgo-oil-ae3-cc-total-runn-hrs': 'AE3 CC Total Running Hours:',
            'arrival-lsmgo-oil-ae3-cc-oil-cons': 'AE3 CC Oil Consumption:',

            // Arrival Master Remarks
            'arrival-remarks': 'Remarks:',
            'arrival-master-name': 'Master Name:',
        },
        'bunkering': {

            // Bunkering Details
            'bunkering-voyage-details-vessel-name': 'Vessel Name:',
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
            'allfast-voyage-details-vessel-name': 'Vessel Name:',
            'allfast-voyage-details-voyage-no': 'Voyage No:',
            'allfast-voyage-details-datetime': 'All Fast Date/Time (LT):',
            'allfast-voyage-details-gmt-offset': 'GMT Offset:',
            'allfast-voyage-details-port': 'Port:',

            // All Fast ROBs
            'allfast-rob-hsfo': 'HSFO (MT):',
            'allfast-rob-biofuel': 'BIOFUEL (MT):',
            'allfast-rob-vlsfo': 'VLSFO (MT):',
            'allfast-rob-lsmgo': 'LSMGO (MT):',
        },

        'weeklyreport': {
            // Voyage Details
            'weekly-voyage-details-vessel-name': 'Vessel Name:',
            'weekly-voyage-details-voyage-no': 'Voyage No:',
            'weekly-voyage-details-date-time': 'Weekly Schedule Date/Time:',

            // Port Details
            // Port 1
            'weekly-schedule-details-port-1': 'Port 1 Name:',
            'weekly-schedule-details-activity-port-1': 'Port 1 Activity:',
            'weekly-eta-etb-port-1-date-time': 'Port 1 ETA:',
            'weekly-etcd-port-1-date-time': 'Port 1 ETCD:',
            'weekly-schedule-details-cargo-port-1': 'Port 1 Details:',
            'weekly-schedule-details-cargo-qty-port-1': 'Port 1 Quantity:',
            'weekly-schedule-details-remarks-port-1': 'Port 1 Remarks:',

            // Port 2
            'weekly-schedule-details-port-2-1': 'Port 2 Name:',
            'weekly-schedule-details-activity-port-2-1': 'Port 2 Activity:',
            'weekly-eta-etb-port-2-1-date-time': 'Port 2 ETA:',
            'weekly-etcd-port-2-1-date-time': 'Port 2 ETCD:',
            'weekly-schedule-details-cargo-port-2-1': 'Port 2 Details:',
            'weekly-schedule-details-cargo-qty-port-2-1': 'Port 2 Quantity:',
            'weekly-schedule-details-remarks-port-2-1': 'Port 2 Remarks:',

            // Port 3
            'weekly-schedule-details-port-3-1': 'Port 3 Name:',
            'weekly-schedule-details-activity-port-3-1': 'Port 3 Activity:',
            'weekly-eta-etb-port-3-1-date-time': 'Port 3 ETA:',
            'weekly-etcd-port-3-1-date-time': 'Port 3 ETCD:',
            'weekly-schedule-details-cargo-port-3-1': 'Port 3 Details:',
            'weekly-schedule-details-cargo-qty-port-3-1': 'Port 3 Quantity:',
            'weekly-schedule-details-remarks-port-3-1': 'Port 3 Remarks:',
            
            // Port 4
            'weekly-schedule-details-port-4-1': 'Port 4 Name:',
            'weekly-schedule-details-activity-port-4-1': 'Port 4 Activity:',
            'weekly-eta-etb-port-4-1-date-time': 'Port 4 ETA:',
            'weekly-etcd-port-4-1-date-time': 'Port 4 ETCD:',
            'weekly-schedule-details-cargo-port-4-1': 'Port 4 Details:',
            'weekly-schedule-details-cargo-qty-port-4-1': 'Port 4 Quantity:',
            'weekly-schedule-details-remarks-port-4-1': 'Port 4 Remarks:',

            // Port 5
            'weekly-schedule-details-port-5-1': 'Port 5 Name:',
            'weekly-schedule-details-activity-port-5-1': 'Port 5 Activity:',
            'weekly-eta-etb-port-5-1-date-time': 'Port 5 ETA:',
            'weekly-etcd-port-5-1-date-time': 'Port 5 ETCD:',
            'weekly-schedule-details-cargo-port-5-1': 'Port 5 Details:',
            'weekly-schedule-details-cargo-qty-port-5-1': 'Port 5 Quantity:',
            'weekly-schedule-details-remarks-port-5-1': 'Port 5 Remarks:',

            // Port 6
            'weekly-schedule-details-port-6-1': 'Port 6 Name:',
            'weekly-schedule-details-activity-port-6-1': 'Port 6 Activity:',
            'weekly-eta-etb-port-6-1-date-time': 'Port 6 ETA:',
            'weekly-etcd-port-6-1-date-time': 'Port 6 ETCD:',
            'weekly-schedule-details-cargo-port-6-1': 'Port 6 Details:',
            'weekly-schedule-details-cargo-qty-port-6-1': 'Port 6 Quantity:',
            'weekly-schedule-details-remarks-port-6-1': 'Port 6 Remarks:',

            // Port 7
            'weekly-schedule-details-port-7-1': 'Port 7 Name:',
            'weekly-schedule-details-activity-port-7-1': 'Port 7 Activity:',
            'weekly-eta-etb-port-7-1-date-time': 'Port 7 ETA:',
            'weekly-etcd-port-7-1-date-time': 'Port 7 ETCD:',
            'weekly-schedule-details-cargo-port-7-1': 'Port 7 Details:',
            'weekly-schedule-details-cargo-qty-port-7-1': 'Port 7 Quantity:',
            'weekly-schedule-details-remarks-port-7-1': 'Port 7 Remarks:',

            // Port 8
            'weekly-schedule-details-port-8-1': 'Port 8 Name:',
            'weekly-schedule-details-activity-port-8-1': 'Port 8 Activity:',
            'weekly-eta-etb-port-8-1-date-time': 'Port 8 ETA:',
            'weekly-etcd-port-8-1-date-time': 'Port 8 ETCD:',
            'weekly-schedule-details-cargo-port-8-1': 'Port 8 Details:',
            'weekly-schedule-details-cargo-qty-port-8-1': 'Port 8 Quantity:',
            'weekly-schedule-details-remarks-port-8-1': 'Port 8 Remarks:',

            // Port 9
            'weekly-schedule-details-port-9-1': 'Port 9 Name:',
            'weekly-schedule-details-activity-port-9-1': 'Port 9 Activity:',
            'weekly-eta-etb-port-9-1-date-time': 'Port 9 ETA:',
            'weekly-etcd-port-9-1-date-time': 'Port 9 ETCD:',
            'weekly-schedule-details-cargo-port-9-1': 'Port 9 Details:',
            'weekly-schedule-details-cargo-qty-port-9-1': 'Port 9 Quantity:',
            'weekly-schedule-details-remarks-port-9-1': 'Port 9 Remarks:',

            // Port 10
            'weekly-schedule-details-port-10-1': 'Port 10 Name:',
            'weekly-schedule-details-activity-port-10-1': 'Port 10 Activity:',
            'weekly-eta-etb-port-10-1-date-time': 'Port 10 ETA:',
            'weekly-etcd-port-10-1-date-time': 'Port 10 ETCD:',
            'weekly-schedule-details-cargo-port-10-1': 'Port 10 Details:',
            'weekly-schedule-details-cargo-qty-port-10-1': 'Port 10 Quantity:',
            'weekly-schedule-details-remarks-port-10-1': 'Port 10 Remarks:',

            // Port 11
            'weekly-schedule-details-port-11-1': 'Port 11 Name:',
            'weekly-schedule-details-activity-port-11-1': 'Port 11 Activity:',
            'weekly-eta-etb-port-11-1-date-time': 'Port 11 ETA:',
            'weekly-etcd-port-11-1-date-time': 'Port 11 ETCD:',
            'weekly-schedule-details-cargo-port-11-1': 'Port 11 Details:',
            'weekly-schedule-details-cargo-qty-port-11-1': 'Port 11 Quantity:',
            'weekly-schedule-details-remarks-port-11-1': 'Port 11 Remarks:',
            
            // Port 12
            'weekly-schedule-details-port-12-1': 'Port 12 Name:',
            'weekly-schedule-details-activity-port-12-1': 'Port 12 Activity:',
            'weekly-eta-etb-port-12-1-date-time': 'Port 12 ETA:',
            'weekly-etcd-port-12-1-date-time': 'Port 12 ETCD:',
            'weekly-schedule-details-cargo-port-12-1': 'Port 12 Details:',
            'weekly-schedule-details-cargo-qty-port-12-1': 'Port 12 Quantity:',
            'weekly-schedule-details-remarks-port-12-1': 'Port 12 Remarks:',

            // Port 13
            'weekly-schedule-details-port-13-1': 'Port 13 Name:',
            'weekly-schedule-details-activity-port-13-1': 'Port 13 Activity:',
            'weekly-eta-etb-port-13-1-date-time': 'Port 13 ETA:',
            'weekly-etcd-port-13-1-date-time': 'Port 13 ETCD:',
            'weekly-schedule-details-cargo-port-13-1': 'Port 13 Details:',
            'weekly-schedule-details-cargo-qty-port-13-1': 'Port 13 Quantity:',
            'weekly-schedule-details-remarks-port-13-1': 'Port 13 Remarks:',

            // Port 14
            'weekly-schedule-details-port-14-1': 'Port 14 Name:',
            'weekly-schedule-details-activity-port-14-1': 'Port 14 Activity:',
            'weekly-eta-etb-port-14-1-date-time': 'Port 14 ETA:',
            'weekly-etcd-port-14-1-date-time': 'Port 14 ETCD:',
            'weekly-schedule-details-cargo-port-14-1': 'Port 14 Details:',
            'weekly-schedule-details-cargo-qty-port-14-1': 'Port 14 Quantity:',
            'weekly-schedule-details-remarks-port-14-1': 'Port 14 Remarks:',

            // Port 15
            'weekly-schedule-details-port-15-1': 'Port 15 Name:',
            'weekly-schedule-details-activity-port-15-1': 'Port 15 Activity:',
            'weekly-eta-etb-port-15-1-date-time': 'Port 15 ETA:',
            'weekly-etcd-port-15-1-date-time': 'Port 15 ETCD:',
            'weekly-schedule-details-cargo-port-15-1': 'Port 15 Details:',
            'weekly-schedule-details-cargo-qty-port-15-1': 'Port 15 Quantity:',
            'weekly-schedule-details-remarks-port-15-1': 'Port 15 Remarks:',

            // Port 16
            'weekly-schedule-details-port-16-1': 'Port 16 Name:',
            'weekly-schedule-details-activity-port-16-1': 'Port 16 Activity:',
            'weekly-eta-etb-port-16-1-date-time': 'Port 16 ETA:',
            'weekly-etcd-port-16-1-date-time': 'Port 16 ETCD:',
            'weekly-schedule-details-cargo-port-16-1': 'Port 16 Details:',
            'weekly-schedule-details-cargo-qty-port-16-1': 'Port 16 Quantity:',
            'weekly-schedule-details-remarks-port-16-1': 'Port 16 Remarks:',

            // Port 17
            'weekly-schedule-details-port-17-1': 'Port 17 Name:',
            'weekly-schedule-details-activity-port-17-1': 'Port 17 Activity:',
            'weekly-eta-etb-port-17-1-date-time': 'Port 17 ETA:',
            'weekly-etcd-port-17-1-date-time': 'Port 17 ETCD:',
            'weekly-schedule-details-cargo-port-17-1': 'Port 17 Details:',
            'weekly-schedule-details-cargo-qty-port-17-1': 'Port 17 Quantity:',
            'weekly-schedule-details-remarks-port-17-1': 'Port 17 Remarks:',

            // Port 18
            'weekly-schedule-details-port-18-1': 'Port 18 Name:',
            'weekly-schedule-details-activity-port-18-1': 'Port 18 Activity:',
            'weekly-eta-etb-port-18-1-date-time': 'Port 18 ETA:',
            'weekly-etcd-port-18-1-date-time': 'Port 18 ETCD:',
            'weekly-schedule-details-cargo-port-18-1': 'Port 18 Details:',
            'weekly-schedule-details-cargo-qty-port-18-1': 'Port 18 Quantity:',
            'weekly-schedule-details-remarks-port-18-1': 'Port 18 Remarks:',

            // Port 19
            'weekly-schedule-details-port-19-1': 'Port 19 Name:',
            'weekly-schedule-details-activity-port-19-1': 'Port 19 Activity:',
            'weekly-eta-etb-port-19-1-date-time': 'Port 19 ETA:',
            'weekly-etcd-port-19-1-date-time': 'Port 19 ETCD:',
            'weekly-schedule-details-cargo-port-19-1': 'Port 19 Details:',
            'weekly-schedule-details-cargo-qty-port-19-1': 'Port 19 Quantity:',
            'weekly-schedule-details-remarks-port-19-1': 'Port 19 Remarks:',

            // Port 20
            'weekly-schedule-details-port-20-1': 'Port 20 Name:',
            'weekly-schedule-details-activity-port-20-1': 'Port 20 Activity:',
            'weekly-eta-etb-port-20-1-date-time': 'Port 20 ETA:',
            'weekly-etcd-port-20-1-date-time': 'Port 20 ETCD:',
            'weekly-schedule-details-cargo-port-20-1': 'Port 20 Details:',
            'weekly-schedule-details-cargo-qty-port-20-1': 'Port 20 Quantity:',
            'weekly-schedule-details-remarks-port-20-1': 'Port 20 Remarks:',

            // Agent Details for Port 1

            // Port 1 Agent 1
            'weekly-schedule-details-agent-name-1': 'Agent 1 Name:',
            'weekly-schedule-details-agent-address-1': 'Agent 1 Address:',
            'weekly-schedule-details-agent-pic-name-1': 'Agent 1 PIC Name:',
            'weekly-schedule-details-agent-telephone-1': 'Agent 1 Telephone:',
            'weekly-schedule-details-agent-mobile-1': 'Agent 1 Mobile:',
            'weekly-schedule-details-agent-email-1': 'Agent 1 Email:',

            // Port 1 Agent 2
            'weekly-schedule-details-agent-name-2': 'Agent 2 Name:',
            'weekly-schedule-details-agent-address-2': 'Agent 2 Address:',
            'weekly-schedule-details-agent-pic-name-2': 'Agent 2 PIC Name:',
            'weekly-schedule-details-agent-telephone-2': 'Agent 2 Telephone:',
            'weekly-schedule-details-agent-mobile-2': 'Agent 2 Mobile:',
            'weekly-schedule-details-agent-email-2': 'Agent 2 Email:',

            // Port 1 Agent 3
            'weekly-schedule-details-agent-name-3': 'Agent 3 Name:',
            'weekly-schedule-details-agent-address-3': 'Agent 3 Address:',
            'weekly-schedule-details-agent-pic-name-3': 'Agent 3 PIC Name:',
            'weekly-schedule-details-agent-telephone-3': 'Agent 3 Telephone:',
            'weekly-schedule-details-agent-mobile-3': 'Agent 3 Mobile:',
            'weekly-schedule-details-agent-email-3': 'Agent 3 Email:',

            // Port 1 Agent 4
            'weekly-schedule-details-agent-name-4': 'Agent 4 Name:',
            'weekly-schedule-details-agent-address-4': 'Agent 4 Address:',
            'weekly-schedule-details-agent-pic-name-4': 'Agent 4 PIC Name:',
            'weekly-schedule-details-agent-telephone-4': 'Agent 4 Telephone:',
            'weekly-schedule-details-agent-mobile-4': 'Agent 4 Mobile:',
            'weekly-schedule-details-agent-email-4': 'Agent 4 Email:',

            // Port 1 Agent 5
            'weekly-schedule-details-agent-name-5': 'Agent 5 Name:',
            'weekly-schedule-details-agent-address-5': 'Agent 5 Address:',
            'weekly-schedule-details-agent-pic-name-5': 'Agent 5 PIC Name:',
            'weekly-schedule-details-agent-telephone-5': 'Agent 5 Telephone:',
            'weekly-schedule-details-agent-mobile-5': 'Agent 5 Mobile:',
            'weekly-schedule-details-agent-email-5': 'Agent 5 Email:',

            // Port 1 Agent 6
            'weekly-schedule-details-agent-name-6': 'Agent 6 Name:',
            'weekly-schedule-details-agent-address-6': 'Agent 6 Address:',
            'weekly-schedule-details-agent-pic-name-6': 'Agent 6 PIC Name:',
            'weekly-schedule-details-agent-telephone-6': 'Agent 6 Telephone:',
            'weekly-schedule-details-agent-mobile-6': 'Agent 6 Mobile:',
            'weekly-schedule-details-agent-email-6': 'Agent 6 Email:',

            // Port 1 Agent 7
            'weekly-schedule-details-agent-name-7': 'Agent 7 Name:',
            'weekly-schedule-details-agent-address-7': 'Agent 7 Address:',
            'weekly-schedule-details-agent-pic-name-7': 'Agent 7 PIC Name:',
            'weekly-schedule-details-agent-telephone-7': 'Agent 7 Telephone:',
            'weekly-schedule-details-agent-mobile-7': 'Agent 7 Mobile:',
            'weekly-schedule-details-agent-email-7': 'Agent 7 Email:',

            // Port 1 Agent 8
            'weekly-schedule-details-agent-name-8': 'Agent 8 Name:',
            'weekly-schedule-details-agent-address-8': 'Agent 8 Address:',
            'weekly-schedule-details-agent-pic-name-8': 'Agent 8 PIC Name:',
            'weekly-schedule-details-agent-telephone-8': 'Agent 8 Telephone:',
            'weekly-schedule-details-agent-mobile-8': 'Agent 8 Mobile:',
            'weekly-schedule-details-agent-email-8': 'Agent 8 Email:',

            // Port 1 Agent 9
            'weekly-schedule-details-agent-name-9': 'Agent 9 Name:',
            'weekly-schedule-details-agent-address-9': 'Agent 9 Address:',
            'weekly-schedule-details-agent-pic-name-9': 'Agent 9 PIC Name:',
            'weekly-schedule-details-agent-telephone-9': 'Agent 9 Telephone:',
            'weekly-schedule-details-agent-mobile-9': 'Agent 9 Mobile:',
            'weekly-schedule-details-agent-email-9': 'Agent 9 Email:',

            // Port 1 Agent 10
            'weekly-schedule-details-agent-name-10': 'Agent 10 Name:',
            'weekly-schedule-details-agent-address-10': 'Agent 10 Address:',
            'weekly-schedule-details-agent-pic-name-10': 'Agent 10 PIC Name:',
            'weekly-schedule-details-agent-telephone-10': 'Agent 10 Telephone:',
            'weekly-schedule-details-agent-mobile-10': 'Agent 10 Mobile:',
            'weekly-schedule-details-agent-email-10': 'Agent 10 Email:',

            // Port 1 Agent 11
            'weekly-schedule-details-agent-name-11': 'Agent 11 Name:',
            'weekly-schedule-details-agent-address-11': 'Agent 11 Address:',
            'weekly-schedule-details-agent-pic-name-11': 'Agent 11 PIC Name:',
            'weekly-schedule-details-agent-telephone-11': 'Agent 11 Telephone:',
            'weekly-schedule-details-agent-mobile-11': 'Agent 11 Mobile:',
            'weekly-schedule-details-agent-email-11': 'Agent 11 Email:',

            // Port 1 Agent 12
            'weekly-schedule-details-agent-name-12': 'Agent 12 Name:',
            'weekly-schedule-details-agent-address-12': 'Agent 12 Address:',
            'weekly-schedule-details-agent-pic-name-12': 'Agent 12 PIC Name:',
            'weekly-schedule-details-agent-telephone-12': 'Agent 12 Telephone:',
            'weekly-schedule-details-agent-mobile-12': 'Agent 12 Mobile:',
            'weekly-schedule-details-agent-email-12': 'Agent 12 Email:',

            // Agent Details for Port 2

            // Port 2 Agent 1
            'weekly-schedule-details-agent-name-2-1': 'Agent 1 Name:',
            'weekly-schedule-details-agent-address-2-1': 'Agent 1 Address:',
            'weekly-schedule-details-agent-pic-name-2-1': 'Agent 1 PIC Name:',
            'weekly-schedule-details-agent-telephone-2-1': 'Agent 1 Telephone:',
            'weekly-schedule-details-agent-mobile-2-1': 'Agent 1 Mobile:',
            'weekly-schedule-details-agent-email-2-1': 'Agent 1 Email:',

            // Port 2 Agent 2
            'weekly-schedule-details-agent-name-2-2': 'Agent 2 Name:',
            'weekly-schedule-details-agent-address-2-2': 'Agent 2 Address:',
            'weekly-schedule-details-agent-pic-name-2-2': 'Agent 2 PIC Name:',
            'weekly-schedule-details-agent-telephone-2-2': 'Agent 2 Telephone:',
            'weekly-schedule-details-agent-mobile-2-2': 'Agent 2 Mobile:',
            'weekly-schedule-details-agent-email-2-2': 'Agent 2 Email:',

            // Port 2 Agent 3
            'weekly-schedule-details-agent-name-2-3': 'Agent 3 Name:',
            'weekly-schedule-details-agent-address-2-3': 'Agent 3 Address:',
            'weekly-schedule-details-agent-pic-name-2-3': 'Agent 3 PIC Name:',
            'weekly-schedule-details-agent-telephone-2-3': 'Agent 3 Telephone:',
            'weekly-schedule-details-agent-mobile-2-3': 'Agent 3 Mobile:',
            'weekly-schedule-details-agent-email-2-3': 'Agent 3 Email:',

            // Port 2 Agent 4
            'weekly-schedule-details-agent-name-2-4': 'Agent 4 Name:',
            'weekly-schedule-details-agent-address-2-4': 'Agent 4 Address:',
            'weekly-schedule-details-agent-pic-name-2-4': 'Agent 4 PIC Name:',
            'weekly-schedule-details-agent-telephone-2-4': 'Agent 4 Telephone:',
            'weekly-schedule-details-agent-mobile-2-4': 'Agent 4 Mobile:',
            'weekly-schedule-details-agent-email-2-4': 'Agent 4 Email:',

            // Port 2 Agent 5
            'weekly-schedule-details-agent-name-2-5': 'Agent 5 Name:',
            'weekly-schedule-details-agent-address-2-5': 'Agent 5 Address:',
            'weekly-schedule-details-agent-pic-name-2-5': 'Agent 5 PIC Name:',
            'weekly-schedule-details-agent-telephone-2-5': 'Agent 5 Telephone:',
            'weekly-schedule-details-agent-mobile-2-5': 'Agent 5 Mobile:',
            'weekly-schedule-details-agent-email-2-5': 'Agent 5 Email:',

            // Port 2 Agent 6
            'weekly-schedule-details-agent-name-2-6': 'Agent 6 Name:',
            'weekly-schedule-details-agent-address-2-6': 'Agent 6 Address:',
            'weekly-schedule-details-agent-pic-name-2-6': 'Agent 6 PIC Name:',
            'weekly-schedule-details-agent-telephone-2-6': 'Agent 6 Telephone:',
            'weekly-schedule-details-agent-mobile-2-6': 'Agent 6 Mobile:',
            'weekly-schedule-details-agent-email-2-6': 'Agent 6 Email:',

            // Port 2 Agent 7
            'weekly-schedule-details-agent-name-2-7': 'Agent 7 Name:',
            'weekly-schedule-details-agent-address-2-7': 'Agent 7 Address:',
            'weekly-schedule-details-agent-pic-name-2-7': 'Agent 7 PIC Name:',
            'weekly-schedule-details-agent-telephone-2-7': 'Agent 7 Telephone:',
            'weekly-schedule-details-agent-mobile-2-7': 'Agent 7 Mobile:',
            'weekly-schedule-details-agent-email-2-7': 'Agent 7 Email:',

            // Port 2 Agent 8
            'weekly-schedule-details-agent-name-2-8': 'Agent 8 Name:',
            'weekly-schedule-details-agent-address-2-8': 'Agent 8 Address:',
            'weekly-schedule-details-agent-pic-name-2-8': 'Agent 8 PIC Name:',
            'weekly-schedule-details-agent-telephone-2-8': 'Agent 8 Telephone:',
            'weekly-schedule-details-agent-mobile-2-8': 'Agent 8 Mobile:',
            'weekly-schedule-details-agent-email-2-8': 'Agent 8 Email:',

            // Port 2 Agent 9
            'weekly-schedule-details-agent-name-2-9': 'Agent 9 Name:',
            'weekly-schedule-details-agent-address-2-9': 'Agent 9 Address:',
            'weekly-schedule-details-agent-pic-name-2-9': 'Agent 9 PIC Name:',
            'weekly-schedule-details-agent-telephone-2-9': 'Agent 9 Telephone:',
            'weekly-schedule-details-agent-mobile-2-9': 'Agent 9 Mobile:',
            'weekly-schedule-details-agent-email-2-9': 'Agent 9 Email:',

            // Port 2 Agent 10
            'weekly-schedule-details-agent-name-2-10': 'Agent 10 Name:',
            'weekly-schedule-details-agent-address-2-10': 'Agent 10 Address:',
            'weekly-schedule-details-agent-pic-name-2-10': 'Agent 10 PIC Name:',
            'weekly-schedule-details-agent-telephone-2-10': 'Agent 10 Telephone:',
            'weekly-schedule-details-agent-mobile-2-10': 'Agent 10 Mobile:',
            'weekly-schedule-details-agent-email-2-10': 'Agent 10 Email:',

            // Port 2 Agent 11
            'weekly-schedule-details-agent-name-2-11': 'Agent 11 Name:',
            'weekly-schedule-details-agent-address-2-11': 'Agent 11 Address:',
            'weekly-schedule-details-agent-pic-name-2-11': 'Agent 11 PIC Name:',
            'weekly-schedule-details-agent-telephone-2-11': 'Agent 11 Telephone:',
            'weekly-schedule-details-agent-mobile-2-11': 'Agent 11 Mobile:',
            'weekly-schedule-details-agent-email-2-11': 'Agent 11 Email:',

            // Port 2 Agent 12
            'weekly-schedule-details-agent-name-2-12': 'Agent 12 Name:',
            'weekly-schedule-details-agent-address-2-12': 'Agent 12 Address:',
            'weekly-schedule-details-agent-pic-name-2-12': 'Agent 12 PIC Name:',
            'weekly-schedule-details-agent-telephone-2-12': 'Agent 12 Telephone:',
            'weekly-schedule-details-agent-mobile-2-12': 'Agent 12 Mobile:',
            'weekly-schedule-details-agent-email-2-12': 'Agent 12 Email:',

            // Agent Details for Port 3

            // Port 3 Agent 1
            'weekly-schedule-details-agent-name-3-1': 'Agent 1 Name:',
            'weekly-schedule-details-agent-address-3-1': 'Agent 1 Address:',
            'weekly-schedule-details-agent-pic-name-3-1': 'Agent 1 PIC Name:',
            'weekly-schedule-details-agent-telephone-3-1': 'Agent 1 Telephone:',
            'weekly-schedule-details-agent-mobile-3-1': 'Agent 1 Mobile:',
            'weekly-schedule-details-agent-email-3-1': 'Agent 1 Email:',

            // Port 3 Agent 2
            'weekly-schedule-details-agent-name-3-2': 'Agent 2 Name:',
            'weekly-schedule-details-agent-address-3-2': 'Agent 2 Address:',
            'weekly-schedule-details-agent-pic-name-3-2': 'Agent 2 PIC Name:',
            'weekly-schedule-details-agent-telephone-3-2': 'Agent 2 Telephone:',
            'weekly-schedule-details-agent-mobile-3-2': 'Agent 2 Mobile:',
            'weekly-schedule-details-agent-email-3-2': 'Agent 2 Email:',

            // Port 3 Agent 3
            'weekly-schedule-details-agent-name-3-3': 'Agent 3 Name:',
            'weekly-schedule-details-agent-address-3-3': 'Agent 3 Address:',
            'weekly-schedule-details-agent-pic-name-3-3': 'Agent 3 PIC Name:',
            'weekly-schedule-details-agent-telephone-3-3': 'Agent 3 Telephone:',
            'weekly-schedule-details-agent-mobile-3-3': 'Agent 3 Mobile:',
            'weekly-schedule-details-agent-email-3-3': 'Agent 3 Email:',

            // Port 3 Agent 4
            'weekly-schedule-details-agent-name-3-4': 'Agent 4 Name:',
            'weekly-schedule-details-agent-address-3-4': 'Agent 4 Address:',
            'weekly-schedule-details-agent-pic-name-3-4': 'Agent 4 PIC Name:',
            'weekly-schedule-details-agent-telephone-3-4': 'Agent 4 Telephone:',
            'weekly-schedule-details-agent-mobile-3-4': 'Agent 4 Mobile:',
            'weekly-schedule-details-agent-email-3-4': 'Agent 4 Email:',

            // Port 3 Agent 5
            'weekly-schedule-details-agent-name-3-5': 'Agent 5 Name:',
            'weekly-schedule-details-agent-address-3-5': 'Agent 5 Address:',
            'weekly-schedule-details-agent-pic-name-3-5': 'Agent 5 PIC Name:',
            'weekly-schedule-details-agent-telephone-3-5': 'Agent 5 Telephone:',
            'weekly-schedule-details-agent-mobile-3-5': 'Agent 5 Mobile:',
            'weekly-schedule-details-agent-email-3-5': 'Agent 5 Email:',

            // Port 3 Agent 6
            'weekly-schedule-details-agent-name-3-6': 'Agent 6 Name:',
            'weekly-schedule-details-agent-address-3-6': 'Agent 6 Address:',
            'weekly-schedule-details-agent-pic-name-3-6': 'Agent 6 PIC Name:',
            'weekly-schedule-details-agent-telephone-3-6': 'Agent 6 Telephone:',
            'weekly-schedule-details-agent-mobile-3-6': 'Agent 6 Mobile:',
            'weekly-schedule-details-agent-email-3-6': 'Agent 6 Email:',

            // Port 3 Agent 7
            'weekly-schedule-details-agent-name-3-7': 'Agent 7 Name:',
            'weekly-schedule-details-agent-address-3-7': 'Agent 7 Address:',
            'weekly-schedule-details-agent-pic-name-3-7': 'Agent 7 PIC Name:',
            'weekly-schedule-details-agent-telephone-3-7': 'Agent 7 Telephone:',
            'weekly-schedule-details-agent-mobile-3-7': 'Agent 7 Mobile:',
            'weekly-schedule-details-agent-email-3-7': 'Agent 7 Email:',

            // Port 3 Agent 8
            'weekly-schedule-details-agent-name-3-8': 'Agent 8 Name:',
            'weekly-schedule-details-agent-address-3-8': 'Agent 8 Address:',
            'weekly-schedule-details-agent-pic-name-3-8': 'Agent 8 PIC Name:',
            'weekly-schedule-details-agent-telephone-3-8': 'Agent 8 Telephone:',
            'weekly-schedule-details-agent-mobile-3-8': 'Agent 8 Mobile:',
            'weekly-schedule-details-agent-email-3-8': 'Agent 8 Email:',

            // Port 3 Agent 9
            'weekly-schedule-details-agent-name-3-9': 'Agent 9 Name:',
            'weekly-schedule-details-agent-address-3-9': 'Agent 9 Address:',
            'weekly-schedule-details-agent-pic-name-3-9': 'Agent 9 PIC Name:',
            'weekly-schedule-details-agent-telephone-3-9': 'Agent 9 Telephone:',
            'weekly-schedule-details-agent-mobile-3-9': 'Agent 9 Mobile:',
            'weekly-schedule-details-agent-email-3-9': 'Agent 9 Email:',

            // Port 3 Agent 10
            'weekly-schedule-details-agent-name-3-10': 'Agent 10 Name:',
            'weekly-schedule-details-agent-address-3-10': 'Agent 10 Address:',
            'weekly-schedule-details-agent-pic-name-3-10': 'Agent 10 PIC Name:',
            'weekly-schedule-details-agent-telephone-3-10': 'Agent 10 Telephone:',
            'weekly-schedule-details-agent-mobile-3-10': 'Agent 10 Mobile:',
            'weekly-schedule-details-agent-email-3-10': 'Agent 10 Email:',

            // Port 3 Agent 11
            'weekly-schedule-details-agent-name-3-11': 'Agent 11 Name:',
            'weekly-schedule-details-agent-address-3-11': 'Agent 11 Address:',
            'weekly-schedule-details-agent-pic-name-3-11': 'Agent 11 PIC Name:',
            'weekly-schedule-details-agent-telephone-3-11': 'Agent 11 Telephone:',
            'weekly-schedule-details-agent-mobile-3-11': 'Agent 11 Mobile:',
            'weekly-schedule-details-agent-email-3-11': 'Agent 11 Email:',

            // Port 3 Agent 12
            'weekly-schedule-details-agent-name-3-12': 'Agent 12 Name:',
            'weekly-schedule-details-agent-address-3-12': 'Agent 12 Address:',
            'weekly-schedule-details-agent-pic-name-3-12': 'Agent 12 PIC Name:',
            'weekly-schedule-details-agent-telephone-3-12': 'Agent 12 Telephone:',
            'weekly-schedule-details-agent-mobile-3-12': 'Agent 12 Mobile:',
            'weekly-schedule-details-agent-email-3-12': 'Agent 12 Email:',

            // Agent Details for Port 4

            // Port 4 Agent 1
            'weekly-schedule-details-agent-name-4-1': 'Agent 1 Name:',
            'weekly-schedule-details-agent-address-4-1': 'Agent 1 Address:',
            'weekly-schedule-details-agent-pic-name-4-1': 'Agent 1 PIC Name:',
            'weekly-schedule-details-agent-telephone-4-1': 'Agent 1 Telephone:',
            'weekly-schedule-details-agent-mobile-4-1': 'Agent 1 Mobile:',
            'weekly-schedule-details-agent-email-4-1': 'Agent 1 Email:',

            // Port 4 Agent 2
            'weekly-schedule-details-agent-name-4-2': 'Agent 2 Name:',
            'weekly-schedule-details-agent-address-4-2': 'Agent 2 Address:',
            'weekly-schedule-details-agent-pic-name-4-2': 'Agent 2 PIC Name:',
            'weekly-schedule-details-agent-telephone-4-2': 'Agent 2 Telephone:',
            'weekly-schedule-details-agent-mobile-4-2': 'Agent 2 Mobile:',
            'weekly-schedule-details-agent-email-4-2': 'Agent 2 Email:',

            // Port 4 Agent 3
            'weekly-schedule-details-agent-name-4-3': 'Agent 3 Name:',
            'weekly-schedule-details-agent-address-4-3': 'Agent 3 Address:',
            'weekly-schedule-details-agent-pic-name-4-3': 'Agent 3 PIC Name:',
            'weekly-schedule-details-agent-telephone-4-3': 'Agent 3 Telephone:',
            'weekly-schedule-details-agent-mobile-4-3': 'Agent 3 Mobile:',
            'weekly-schedule-details-agent-email-4-3': 'Agent 3 Email:',

            // Port 4 Agent 4
            'weekly-schedule-details-agent-name-4-4': 'Agent 4 Name:',
            'weekly-schedule-details-agent-address-4-4': 'Agent 4 Address:',
            'weekly-schedule-details-agent-pic-name-4-4': 'Agent 4 PIC Name:',
            'weekly-schedule-details-agent-telephone-4-4': 'Agent 4 Telephone:',
            'weekly-schedule-details-agent-mobile-4-4': 'Agent 4 Mobile:',
            'weekly-schedule-details-agent-email-4-4': 'Agent 4 Email:',

            // Port 4 Agent 5
            'weekly-schedule-details-agent-name-4-5': 'Agent 5 Name:',
            'weekly-schedule-details-agent-address-4-5': 'Agent 5 Address:',
            'weekly-schedule-details-agent-pic-name-4-5': 'Agent 5 PIC Name:',
            'weekly-schedule-details-agent-telephone-4-5': 'Agent 5 Telephone:',
            'weekly-schedule-details-agent-mobile-4-5': 'Agent 5 Mobile:',
            'weekly-schedule-details-agent-email-4-5': 'Agent 5 Email:',

            // Port 4 Agent 6
            'weekly-schedule-details-agent-name-4-6': 'Agent 6 Name:',
            'weekly-schedule-details-agent-address-4-6': 'Agent 6 Address:',
            'weekly-schedule-details-agent-pic-name-4-6': 'Agent 6 PIC Name:',
            'weekly-schedule-details-agent-telephone-4-6': 'Agent 6 Telephone:',
            'weekly-schedule-details-agent-mobile-4-6': 'Agent 6 Mobile:',
            'weekly-schedule-details-agent-email-4-6': 'Agent 6 Email:',

            // Port 4 Agent 7
            'weekly-schedule-details-agent-name-4-7': 'Agent 7 Name:',
            'weekly-schedule-details-agent-address-4-7': 'Agent 7 Address:',
            'weekly-schedule-details-agent-pic-name-4-7': 'Agent 7 PIC Name:',
            'weekly-schedule-details-agent-telephone-4-7': 'Agent 7 Telephone:',
            'weekly-schedule-details-agent-mobile-4-7': 'Agent 7 Mobile:',
            'weekly-schedule-details-agent-email-4-7': 'Agent 7 Email:',

            // Port 4 Agent 8
            'weekly-schedule-details-agent-name-4-8': 'Agent 8 Name:',
            'weekly-schedule-details-agent-address-4-8': 'Agent 8 Address:',
            'weekly-schedule-details-agent-pic-name-4-8': 'Agent 8 PIC Name:',
            'weekly-schedule-details-agent-telephone-4-8': 'Agent 8 Telephone:',
            'weekly-schedule-details-agent-mobile-4-8': 'Agent 8 Mobile:',
            'weekly-schedule-details-agent-email-4-8': 'Agent 8 Email:',

            // Port 4 Agent 9
            'weekly-schedule-details-agent-name-4-9': 'Agent 9 Name:',
            'weekly-schedule-details-agent-address-4-9': 'Agent 9 Address:',
            'weekly-schedule-details-agent-pic-name-4-9': 'Agent 9 PIC Name:',
            'weekly-schedule-details-agent-telephone-4-9': 'Agent 9 Telephone:',
            'weekly-schedule-details-agent-mobile-4-9': 'Agent 9 Mobile:',
            'weekly-schedule-details-agent-email-4-9': 'Agent 9 Email:',

            // Port 4 Agent 10
            'weekly-schedule-details-agent-name-4-10': 'Agent 10 Name:',
            'weekly-schedule-details-agent-address-4-10': 'Agent 10 Address:',
            'weekly-schedule-details-agent-pic-name-4-10': 'Agent 10 PIC Name:',
            'weekly-schedule-details-agent-telephone-4-10': 'Agent 10 Telephone:',
            'weekly-schedule-details-agent-mobile-4-10': 'Agent 10 Mobile:',
            'weekly-schedule-details-agent-email-4-10': 'Agent 10 Email:',

            // Port 4 Agent 11
            'weekly-schedule-details-agent-name-4-11': 'Agent 11 Name:',
            'weekly-schedule-details-agent-address-4-11': 'Agent 11 Address:',
            'weekly-schedule-details-agent-pic-name-4-11': 'Agent 11 PIC Name:',
            'weekly-schedule-details-agent-telephone-4-11': 'Agent 11 Telephone:',
            'weekly-schedule-details-agent-mobile-4-11': 'Agent 11 Mobile:',
            'weekly-schedule-details-agent-email-4-11': 'Agent 11 Email:',

            // Port 4 Agent 12
            'weekly-schedule-details-agent-name-4-12': 'Agent 12 Name:',
            'weekly-schedule-details-agent-address-4-12': 'Agent 12 Address:',
            'weekly-schedule-details-agent-pic-name-4-12': 'Agent 12 PIC Name:',
            'weekly-schedule-details-agent-telephone-4-12': 'Agent 12 Telephone:',
            'weekly-schedule-details-agent-mobile-4-12': 'Agent 12 Mobile:',
            'weekly-schedule-details-agent-email-4-12': 'Agent 12 Email:',

            // Agent Details for Port 5

            // Port 5 Agent 1
            'weekly-schedule-details-agent-name-5-1': 'Agent 1 Name:',
            'weekly-schedule-details-agent-address-5-1': 'Agent 1 Address:',
            'weekly-schedule-details-agent-pic-name-5-1': 'Agent 1 PIC Name:',
            'weekly-schedule-details-agent-telephone-5-1': 'Agent 1 Telephone:',
            'weekly-schedule-details-agent-mobile-5-1': 'Agent 1 Mobile:',
            'weekly-schedule-details-agent-email-5-1': 'Agent 1 Email:',

            // Port 5 Agent 2
            'weekly-schedule-details-agent-name-5-2': 'Agent 2 Name:',
            'weekly-schedule-details-agent-address-5-2': 'Agent 2 Address:',
            'weekly-schedule-details-agent-pic-name-5-2': 'Agent 2 PIC Name:',
            'weekly-schedule-details-agent-telephone-5-2': 'Agent 2 Telephone:',
            'weekly-schedule-details-agent-mobile-5-2': 'Agent 2 Mobile:',
            'weekly-schedule-details-agent-email-5-2': 'Agent 2 Email:',

            // Port 5 Agent 3
            'weekly-schedule-details-agent-name-5-3': 'Agent 3 Name:',
            'weekly-schedule-details-agent-address-5-3': 'Agent 3 Address:',
            'weekly-schedule-details-agent-pic-name-5-3': 'Agent 3 PIC Name:',
            'weekly-schedule-details-agent-telephone-5-3': 'Agent 3 Telephone:',
            'weekly-schedule-details-agent-mobile-5-3': 'Agent 3 Mobile:',
            'weekly-schedule-details-agent-email-5-3': 'Agent 3 Email:',

            // Port 5 Agent 4
            'weekly-schedule-details-agent-name-5-4': 'Agent 4 Name:',
            'weekly-schedule-details-agent-address-5-4': 'Agent 4 Address:',
            'weekly-schedule-details-agent-pic-name-5-4': 'Agent 4 PIC Name:',
            'weekly-schedule-details-agent-telephone-5-4': 'Agent 4 Telephone:',
            'weekly-schedule-details-agent-mobile-5-4': 'Agent 4 Mobile:',
            'weekly-schedule-details-agent-email-5-4': 'Agent 4 Email:',

            // Port 5 Agent 5
            'weekly-schedule-details-agent-name-5-5': 'Agent 5 Name:',
            'weekly-schedule-details-agent-address-5-5': 'Agent 5 Address:',
            'weekly-schedule-details-agent-pic-name-5-5': 'Agent 5 PIC Name:',
            'weekly-schedule-details-agent-telephone-5-5': 'Agent 5 Telephone:',
            'weekly-schedule-details-agent-mobile-5-5': 'Agent 5 Mobile:',
            'weekly-schedule-details-agent-email-5-5': 'Agent 5 Email:',

            // Port 5 Agent 6
            'weekly-schedule-details-agent-name-5-6': 'Agent 6 Name:',
            'weekly-schedule-details-agent-address-5-6': 'Agent 6 Address:',
            'weekly-schedule-details-agent-pic-name-5-6': 'Agent 6 PIC Name:',
            'weekly-schedule-details-agent-telephone-5-6': 'Agent 6 Telephone:',
            'weekly-schedule-details-agent-mobile-5-6': 'Agent 6 Mobile:',
            'weekly-schedule-details-agent-email-5-6': 'Agent 6 Email:',

            // Port 5 Agent 7
            'weekly-schedule-details-agent-name-5-7': 'Agent 7 Name:',
            'weekly-schedule-details-agent-address-5-7': 'Agent 7 Address:',
            'weekly-schedule-details-agent-pic-name-5-7': 'Agent 7 PIC Name:',
            'weekly-schedule-details-agent-telephone-5-7': 'Agent 7 Telephone:',
            'weekly-schedule-details-agent-mobile-5-7': 'Agent 7 Mobile:',
            'weekly-schedule-details-agent-email-5-7': 'Agent 7 Email:',

            // Port 5 Agent 8
            'weekly-schedule-details-agent-name-5-8': 'Agent 8 Name:',
            'weekly-schedule-details-agent-address-5-8': 'Agent 8 Address:',
            'weekly-schedule-details-agent-pic-name-5-8': 'Agent 8 PIC Name:',
            'weekly-schedule-details-agent-telephone-5-8': 'Agent 8 Telephone:',
            'weekly-schedule-details-agent-mobile-5-8': 'Agent 8 Mobile:',
            'weekly-schedule-details-agent-email-5-8': 'Agent 8 Email:',

            // Port 5 Agent 9
            'weekly-schedule-details-agent-name-5-9': 'Agent 9 Name:',
            'weekly-schedule-details-agent-address-5-9': 'Agent 9 Address:',
            'weekly-schedule-details-agent-pic-name-5-9': 'Agent 9 PIC Name:',
            'weekly-schedule-details-agent-telephone-5-9': 'Agent 9 Telephone:',
            'weekly-schedule-details-agent-mobile-5-9': 'Agent 9 Mobile:',
            'weekly-schedule-details-agent-email-5-9': 'Agent 9 Email:',

            // Port 5 Agent 10
            'weekly-schedule-details-agent-name-5-10': 'Agent 10 Name:',
            'weekly-schedule-details-agent-address-5-10': 'Agent 10 Address:',
            'weekly-schedule-details-agent-pic-name-5-10': 'Agent 10 PIC Name:',
            'weekly-schedule-details-agent-telephone-5-10': 'Agent 10 Telephone:',
            'weekly-schedule-details-agent-mobile-5-10': 'Agent 10 Mobile:',
            'weekly-schedule-details-agent-email-5-10': 'Agent 10 Email:',

            // Port 5 Agent 11
            'weekly-schedule-details-agent-name-5-11': 'Agent 11 Name:',
            'weekly-schedule-details-agent-address-5-11': 'Agent 11 Address:',
            'weekly-schedule-details-agent-pic-name-5-11': 'Agent 11 PIC Name:',
            'weekly-schedule-details-agent-telephone-5-11': 'Agent 11 Telephone:',
            'weekly-schedule-details-agent-mobile-5-11': 'Agent 11 Mobile:',
            'weekly-schedule-details-agent-email-5-11': 'Agent 11 Email:',

            // Port 5 Agent 12
            'weekly-schedule-details-agent-name-5-12': 'Agent 12 Name:',
            'weekly-schedule-details-agent-address-5-12': 'Agent 12 Address:',
            'weekly-schedule-details-agent-pic-name-5-12': 'Agent 12 PIC Name:',
            'weekly-schedule-details-agent-telephone-5-12': 'Agent 12 Telephone:',
            'weekly-schedule-details-agent-mobile-5-12': 'Agent 12 Mobile:',
            'weekly-schedule-details-agent-email-5-12': 'Agent 12 Email:',

            // Agent Details for Port 6

            // Port 6 Agent 1
            'weekly-schedule-details-agent-name-6-1': 'Agent 1 Name:',
            'weekly-schedule-details-agent-address-6-1': 'Agent 1 Address:',
            'weekly-schedule-details-agent-pic-name-6-1': 'Agent 1 PIC Name:',
            'weekly-schedule-details-agent-telephone-6-1': 'Agent 1 Telephone:',
            'weekly-schedule-details-agent-mobile-6-1': 'Agent 1 Mobile:',
            'weekly-schedule-details-agent-email-6-1': 'Agent 1 Email:',

            // Port 6 Agent 2
            'weekly-schedule-details-agent-name-6-2': 'Agent 2 Name:',
            'weekly-schedule-details-agent-address-6-2': 'Agent 2 Address:',
            'weekly-schedule-details-agent-pic-name-6-2': 'Agent 2 PIC Name:',
            'weekly-schedule-details-agent-telephone-6-2': 'Agent 2 Telephone:',
            'weekly-schedule-details-agent-mobile-6-2': 'Agent 2 Mobile:',
            'weekly-schedule-details-agent-email-6-2': 'Agent 2 Email:',

            // Port 6 Agent 3
            'weekly-schedule-details-agent-name-6-3': 'Agent 3 Name:',
            'weekly-schedule-details-agent-address-6-3': 'Agent 3 Address:',
            'weekly-schedule-details-agent-pic-name-6-3': 'Agent 3 PIC Name:',
            'weekly-schedule-details-agent-telephone-6-3': 'Agent 3 Telephone:',
            'weekly-schedule-details-agent-mobile-6-3': 'Agent 3 Mobile:',
            'weekly-schedule-details-agent-email-6-3': 'Agent 3 Email:',

            // Port 6 Agent 4
            'weekly-schedule-details-agent-name-6-4': 'Agent 4 Name:',
            'weekly-schedule-details-agent-address-6-4': 'Agent 4 Address:',
            'weekly-schedule-details-agent-pic-name-6-4': 'Agent 4 PIC Name:',
            'weekly-schedule-details-agent-telephone-6-4': 'Agent 4 Telephone:',
            'weekly-schedule-details-agent-mobile-6-4': 'Agent 4 Mobile:',
            'weekly-schedule-details-agent-email-6-4': 'Agent 4 Email:',

            // Port 6 Agent 5
            'weekly-schedule-details-agent-name-6-5': 'Agent 5 Name:',
            'weekly-schedule-details-agent-address-6-5': 'Agent 5 Address:',
            'weekly-schedule-details-agent-pic-name-6-5': 'Agent 5 PIC Name:',
            'weekly-schedule-details-agent-telephone-6-5': 'Agent 5 Telephone:',
            'weekly-schedule-details-agent-mobile-6-5': 'Agent 5 Mobile:',
            'weekly-schedule-details-agent-email-6-5': 'Agent 5 Email:',

            // Port 6 Agent 6
            'weekly-schedule-details-agent-name-6-6': 'Agent 6 Name:',
            'weekly-schedule-details-agent-address-6-6': 'Agent 6 Address:',
            'weekly-schedule-details-agent-pic-name-6-6': 'Agent 6 PIC Name:',
            'weekly-schedule-details-agent-telephone-6-6': 'Agent 6 Telephone:',
            'weekly-schedule-details-agent-mobile-6-6': 'Agent 6 Mobile:',
            'weekly-schedule-details-agent-email-6-6': 'Agent 6 Email:',

            // Port 6 Agent 7
            'weekly-schedule-details-agent-name-6-7': 'Agent 7 Name:',
            'weekly-schedule-details-agent-address-6-7': 'Agent 7 Address:',
            'weekly-schedule-details-agent-pic-name-6-7': 'Agent 7 PIC Name:',
            'weekly-schedule-details-agent-telephone-6-7': 'Agent 7 Telephone:',
            'weekly-schedule-details-agent-mobile-6-7': 'Agent 7 Mobile:',
            'weekly-schedule-details-agent-email-6-7': 'Agent 7 Email:',

            // Port 6 Agent 8
            'weekly-schedule-details-agent-name-6-8': 'Agent 8 Name:',
            'weekly-schedule-details-agent-address-6-8': 'Agent 8 Address:',
            'weekly-schedule-details-agent-pic-name-6-8': 'Agent 8 PIC Name:',
            'weekly-schedule-details-agent-telephone-6-8': 'Agent 8 Telephone:',
            'weekly-schedule-details-agent-mobile-6-8': 'Agent 8 Mobile:',
            'weekly-schedule-details-agent-email-6-8': 'Agent 8 Email:',

            // Port 6 Agent 9
            'weekly-schedule-details-agent-name-6-9': 'Agent 9 Name:',
            'weekly-schedule-details-agent-address-6-9': 'Agent 9 Address:',
            'weekly-schedule-details-agent-pic-name-6-9': 'Agent 9 PIC Name:',
            'weekly-schedule-details-agent-telephone-6-9': 'Agent 9 Telephone:',
            'weekly-schedule-details-agent-mobile-6-9': 'Agent 9 Mobile:',
            'weekly-schedule-details-agent-email-6-9': 'Agent 9 Email:',

            // Port 6 Agent 10
            'weekly-schedule-details-agent-name-6-10': 'Agent 10 Name:',
            'weekly-schedule-details-agent-address-6-10': 'Agent 10 Address:',
            'weekly-schedule-details-agent-pic-name-6-10': 'Agent 10 PIC Name:',
            'weekly-schedule-details-agent-telephone-6-10': 'Agent 10 Telephone:',
            'weekly-schedule-details-agent-mobile-6-10': 'Agent 10 Mobile:',
            'weekly-schedule-details-agent-email-6-10': 'Agent 10 Email:',

            // Port 6 Agent 11
            'weekly-schedule-details-agent-name-6-11': 'Agent 11 Name:',
            'weekly-schedule-details-agent-address-6-11': 'Agent 11 Address:',
            'weekly-schedule-details-agent-pic-name-6-11': 'Agent 11 PIC Name:',
            'weekly-schedule-details-agent-telephone-6-11': 'Agent 11 Telephone:',
            'weekly-schedule-details-agent-mobile-6-11': 'Agent 11 Mobile:',
            'weekly-schedule-details-agent-email-6-11': 'Agent 11 Email:',

            // Port 6 Agent 12
            'weekly-schedule-details-agent-name-6-12': 'Agent 12 Name:',
            'weekly-schedule-details-agent-address-6-12': 'Agent 12 Address:',
            'weekly-schedule-details-agent-pic-name-6-12': 'Agent 12 PIC Name:',
            'weekly-schedule-details-agent-telephone-6-12': 'Agent 12 Telephone:',
            'weekly-schedule-details-agent-mobile-6-12': 'Agent 12 Mobile:',
            'weekly-schedule-details-agent-email-6-12': 'Agent 12 Email:',

            // Agent Details for Port 7

            // Port 7 Agent 1
            'weekly-schedule-details-agent-name-7-1': 'Agent 1 Name:',
            'weekly-schedule-details-agent-address-7-1': 'Agent 1 Address:',
            'weekly-schedule-details-agent-pic-name-7-1': 'Agent 1 PIC Name:',
            'weekly-schedule-details-agent-telephone-7-1': 'Agent 1 Telephone:',
            'weekly-schedule-details-agent-mobile-7-1': 'Agent 1 Mobile:',
            'weekly-schedule-details-agent-email-7-1': 'Agent 1 Email:',

            // Port 7 Agent 2
            'weekly-schedule-details-agent-name-7-2': 'Agent 2 Name:',
            'weekly-schedule-details-agent-address-7-2': 'Agent 2 Address:',
            'weekly-schedule-details-agent-pic-name-7-2': 'Agent 2 PIC Name:',
            'weekly-schedule-details-agent-telephone-7-2': 'Agent 2 Telephone:',
            'weekly-schedule-details-agent-mobile-7-2': 'Agent 2 Mobile:',
            'weekly-schedule-details-agent-email-7-2': 'Agent 2 Email:',

            // Port 7 Agent 3
            'weekly-schedule-details-agent-name-7-3': 'Agent 3 Name:',
            'weekly-schedule-details-agent-address-7-3': 'Agent 3 Address:',
            'weekly-schedule-details-agent-pic-name-7-3': 'Agent 3 PIC Name:',
            'weekly-schedule-details-agent-telephone-7-3': 'Agent 3 Telephone:',
            'weekly-schedule-details-agent-mobile-7-3': 'Agent 3 Mobile:',
            'weekly-schedule-details-agent-email-7-3': 'Agent 3 Email:',

            // Port 7 Agent 4
            'weekly-schedule-details-agent-name-7-4': 'Agent 4 Name:',
            'weekly-schedule-details-agent-address-7-4': 'Agent 4 Address:',
            'weekly-schedule-details-agent-pic-name-7-4': 'Agent 4 PIC Name:',
            'weekly-schedule-details-agent-telephone-7-4': 'Agent 4 Telephone:',
            'weekly-schedule-details-agent-mobile-7-4': 'Agent 4 Mobile:',
            'weekly-schedule-details-agent-email-7-4': 'Agent 4 Email:',

            // Port 7 Agent 5
            'weekly-schedule-details-agent-name-7-5': 'Agent 5 Name:',
            'weekly-schedule-details-agent-address-7-5': 'Agent 5 Address:',
            'weekly-schedule-details-agent-pic-name-7-5': 'Agent 5 PIC Name:',
            'weekly-schedule-details-agent-telephone-7-5': 'Agent 5 Telephone:',
            'weekly-schedule-details-agent-mobile-7-5': 'Agent 5 Mobile:',
            'weekly-schedule-details-agent-email-7-5': 'Agent 5 Email:',

            // Port 7 Agent 6
            'weekly-schedule-details-agent-name-7-6': 'Agent 6 Name:',
            'weekly-schedule-details-agent-address-7-6': 'Agent 6 Address:',
            'weekly-schedule-details-agent-pic-name-7-6': 'Agent 6 PIC Name:',
            'weekly-schedule-details-agent-telephone-7-6': 'Agent 6 Telephone:',
            'weekly-schedule-details-agent-mobile-7-6': 'Agent 6 Mobile:',
            'weekly-schedule-details-agent-email-7-6': 'Agent 6 Email:',

            // Port 7 Agent 7
            'weekly-schedule-details-agent-name-7-7': 'Agent 7 Name:',
            'weekly-schedule-details-agent-address-7-7': 'Agent 7 Address:',
            'weekly-schedule-details-agent-pic-name-7-7': 'Agent 7 PIC Name:',
            'weekly-schedule-details-agent-telephone-7-7': 'Agent 7 Telephone:',
            'weekly-schedule-details-agent-mobile-7-7': 'Agent 7 Mobile:',
            'weekly-schedule-details-agent-email-7-7': 'Agent 7 Email:',

            // Port 7 Agent 8
            'weekly-schedule-details-agent-name-7-8': 'Agent 8 Name:',
            'weekly-schedule-details-agent-address-7-8': 'Agent 8 Address:',
            'weekly-schedule-details-agent-pic-name-7-8': 'Agent 8 PIC Name:',
            'weekly-schedule-details-agent-telephone-7-8': 'Agent 8 Telephone:',
            'weekly-schedule-details-agent-mobile-7-8': 'Agent 8 Mobile:',
            'weekly-schedule-details-agent-email-7-8': 'Agent 8 Email:',

            // Port 7 Agent 9
            'weekly-schedule-details-agent-name-7-9': 'Agent 9 Name:',
            'weekly-schedule-details-agent-address-7-9': 'Agent 9 Address:',
            'weekly-schedule-details-agent-pic-name-7-9': 'Agent 9 PIC Name:',
            'weekly-schedule-details-agent-telephone-7-9': 'Agent 9 Telephone:',
            'weekly-schedule-details-agent-mobile-7-9': 'Agent 9 Mobile:',
            'weekly-schedule-details-agent-email-7-9': 'Agent 9 Email:',

            // Port 7 Agent 10
            'weekly-schedule-details-agent-name-7-10': 'Agent 10 Name:',
            'weekly-schedule-details-agent-address-7-10': 'Agent 10 Address:',
            'weekly-schedule-details-agent-pic-name-7-10': 'Agent 10 PIC Name:',
            'weekly-schedule-details-agent-telephone-7-10': 'Agent 10 Telephone:',
            'weekly-schedule-details-agent-mobile-7-10': 'Agent 10 Mobile:',
            'weekly-schedule-details-agent-email-7-10': 'Agent 10 Email:',

            // Port 7 Agent 11
            'weekly-schedule-details-agent-name-7-11': 'Agent 11 Name:',
            'weekly-schedule-details-agent-address-7-11': 'Agent 11 Address:',
            'weekly-schedule-details-agent-pic-name-7-11': 'Agent 11 PIC Name:',
            'weekly-schedule-details-agent-telephone-7-11': 'Agent 11 Telephone:',
            'weekly-schedule-details-agent-mobile-7-11': 'Agent 11 Mobile:',
            'weekly-schedule-details-agent-email-7-11': 'Agent 11 Email:',

            // Port 7 Agent 12
            'weekly-schedule-details-agent-name-7-12': 'Agent 12 Name:',
            'weekly-schedule-details-agent-address-7-12': 'Agent 12 Address:',
            'weekly-schedule-details-agent-pic-name-7-12': 'Agent 12 PIC Name:',
            'weekly-schedule-details-agent-telephone-7-12': 'Agent 12 Telephone:',
            'weekly-schedule-details-agent-mobile-7-12': 'Agent 12 Mobile:',
            'weekly-schedule-details-agent-email-7-12': 'Agent 12 Email:',

            // Agent Details for Port 8

            // Port 8 Agent 1
            'weekly-schedule-details-agent-name-8-1': 'Agent 1 Name:',
            'weekly-schedule-details-agent-address-8-1': 'Agent 1 Address:',
            'weekly-schedule-details-agent-pic-name-8-1': 'Agent 1 PIC Name:',
            'weekly-schedule-details-agent-telephone-8-1': 'Agent 1 Telephone:',
            'weekly-schedule-details-agent-mobile-8-1': 'Agent 1 Mobile:',
            'weekly-schedule-details-agent-email-8-1': 'Agent 1 Email:',

            // Port 8 Agent 2
            'weekly-schedule-details-agent-name-8-2': 'Agent 2 Name:',
            'weekly-schedule-details-agent-address-8-2': 'Agent 2 Address:',
            'weekly-schedule-details-agent-pic-name-8-2': 'Agent 2 PIC Name:',
            'weekly-schedule-details-agent-telephone-8-2': 'Agent 2 Telephone:',
            'weekly-schedule-details-agent-mobile-8-2': 'Agent 2 Mobile:',
            'weekly-schedule-details-agent-email-8-2': 'Agent 2 Email:',

            // Port 8 Agent 3
            'weekly-schedule-details-agent-name-8-3': 'Agent 3 Name:',
            'weekly-schedule-details-agent-address-8-3': 'Agent 3 Address:',
            'weekly-schedule-details-agent-pic-name-8-3': 'Agent 3 PIC Name:',
            'weekly-schedule-details-agent-telephone-8-3': 'Agent 3 Telephone:',
            'weekly-schedule-details-agent-mobile-8-3': 'Agent 3 Mobile:',
            'weekly-schedule-details-agent-email-8-3': 'Agent 3 Email:',

            // Port 8 Agent 4
            'weekly-schedule-details-agent-name-8-4': 'Agent 4 Name:',
            'weekly-schedule-details-agent-address-8-4': 'Agent 4 Address:',
            'weekly-schedule-details-agent-pic-name-8-4': 'Agent 4 PIC Name:',
            'weekly-schedule-details-agent-telephone-8-4': 'Agent 4 Telephone:',
            'weekly-schedule-details-agent-mobile-8-4': 'Agent 4 Mobile:',
            'weekly-schedule-details-agent-email-8-4': 'Agent 4 Email:',

            // Port 8 Agent 5
            'weekly-schedule-details-agent-name-8-5': 'Agent 5 Name:',
            'weekly-schedule-details-agent-address-8-5': 'Agent 5 Address:',
            'weekly-schedule-details-agent-pic-name-8-5': 'Agent 5 PIC Name:',
            'weekly-schedule-details-agent-telephone-8-5': 'Agent 5 Telephone:',
            'weekly-schedule-details-agent-mobile-8-5': 'Agent 5 Mobile:',
            'weekly-schedule-details-agent-email-8-5': 'Agent 5 Email:',

            // Port 8 Agent 6
            'weekly-schedule-details-agent-name-8-6': 'Agent 6 Name:',
            'weekly-schedule-details-agent-address-8-6': 'Agent 6 Address:',
            'weekly-schedule-details-agent-pic-name-8-6': 'Agent 6 PIC Name:',
            'weekly-schedule-details-agent-telephone-8-6': 'Agent 6 Telephone:',
            'weekly-schedule-details-agent-mobile-8-6': 'Agent 6 Mobile:',
            'weekly-schedule-details-agent-email-8-6': 'Agent 6 Email:',

            // Port 8 Agent 7
            'weekly-schedule-details-agent-name-8-7': 'Agent 7 Name:',
            'weekly-schedule-details-agent-address-8-7': 'Agent 7 Address:',
            'weekly-schedule-details-agent-pic-name-8-7': 'Agent 7 PIC Name:',
            'weekly-schedule-details-agent-telephone-8-7': 'Agent 7 Telephone:',
            'weekly-schedule-details-agent-mobile-8-7': 'Agent 7 Mobile:',
            'weekly-schedule-details-agent-email-8-7': 'Agent 7 Email:',

            // Port 8 Agent 8
            'weekly-schedule-details-agent-name-8-8': 'Agent 8 Name:',
            'weekly-schedule-details-agent-address-8-8': 'Agent 8 Address:',
            'weekly-schedule-details-agent-pic-name-8-8': 'Agent 8 PIC Name:',
            'weekly-schedule-details-agent-telephone-8-8': 'Agent 8 Telephone:',
            'weekly-schedule-details-agent-mobile-8-8': 'Agent 8 Mobile:',
            'weekly-schedule-details-agent-email-8-8': 'Agent 8 Email:',

            // Port 8 Agent 9
            'weekly-schedule-details-agent-name-8-9': 'Agent 9 Name:',
            'weekly-schedule-details-agent-address-8-9': 'Agent 9 Address:',
            'weekly-schedule-details-agent-pic-name-8-9': 'Agent 9 PIC Name:',
            'weekly-schedule-details-agent-telephone-8-9': 'Agent 9 Telephone:',
            'weekly-schedule-details-agent-mobile-8-9': 'Agent 9 Mobile:',
            'weekly-schedule-details-agent-email-8-9': 'Agent 9 Email:',

            // Port 8 Agent 10
            'weekly-schedule-details-agent-name-8-10': 'Agent 10 Name:',
            'weekly-schedule-details-agent-address-8-10': 'Agent 10 Address:',
            'weekly-schedule-details-agent-pic-name-8-10': 'Agent 10 PIC Name:',
            'weekly-schedule-details-agent-telephone-8-10': 'Agent 10 Telephone:',
            'weekly-schedule-details-agent-mobile-8-10': 'Agent 10 Mobile:',
            'weekly-schedule-details-agent-email-8-10': 'Agent 10 Email:',

            // Port 8 Agent 11
            'weekly-schedule-details-agent-name-8-11': 'Agent 11 Name:',
            'weekly-schedule-details-agent-address-8-11': 'Agent 11 Address:',
            'weekly-schedule-details-agent-pic-name-8-11': 'Agent 11 PIC Name:',
            'weekly-schedule-details-agent-telephone-8-11': 'Agent 11 Telephone:',
            'weekly-schedule-details-agent-mobile-8-11': 'Agent 11 Mobile:',
            'weekly-schedule-details-agent-email-8-11': 'Agent 11 Email:',

            // Port 8 Agent 12
            'weekly-schedule-details-agent-name-8-12': 'Agent 12 Name:',
            'weekly-schedule-details-agent-address-8-12': 'Agent 12 Address:',
            'weekly-schedule-details-agent-pic-name-8-12': 'Agent 12 PIC Name:',
            'weekly-schedule-details-agent-telephone-8-12': 'Agent 12 Telephone:',
            'weekly-schedule-details-agent-mobile-8-12': 'Agent 12 Mobile:',
            'weekly-schedule-details-agent-email-8-12': 'Agent 12 Email:',

            // Agent Details for Port 9

            // Port 9 Agent 1
            'weekly-schedule-details-agent-name-9-1': 'Agent 1 Name:',
            'weekly-schedule-details-agent-address-9-1': 'Agent 1 Address:',
            'weekly-schedule-details-agent-pic-name-9-1': 'Agent 1 PIC Name:',
            'weekly-schedule-details-agent-telephone-9-1': 'Agent 1 Telephone:',
            'weekly-schedule-details-agent-mobile-9-1': 'Agent 1 Mobile:',
            'weekly-schedule-details-agent-email-9-1': 'Agent 1 Email:',

            // Port 9 Agent 2
            'weekly-schedule-details-agent-name-9-2': 'Agent 2 Name:',
            'weekly-schedule-details-agent-address-9-2': 'Agent 2 Address:',
            'weekly-schedule-details-agent-pic-name-9-2': 'Agent 2 PIC Name:',
            'weekly-schedule-details-agent-telephone-9-2': 'Agent 2 Telephone:',
            'weekly-schedule-details-agent-mobile-9-2': 'Agent 2 Mobile:',
            'weekly-schedule-details-agent-email-9-2': 'Agent 2 Email:',

            // Port 9 Agent 3
            'weekly-schedule-details-agent-name-9-3': 'Agent 3 Name:',
            'weekly-schedule-details-agent-address-9-3': 'Agent 3 Address:',
            'weekly-schedule-details-agent-pic-name-9-3': 'Agent 3 PIC Name:',
            'weekly-schedule-details-agent-telephone-9-3': 'Agent 3 Telephone:',
            'weekly-schedule-details-agent-mobile-9-3': 'Agent 3 Mobile:',
            'weekly-schedule-details-agent-email-9-3': 'Agent 3 Email:',

            // Port 9 Agent 4
            'weekly-schedule-details-agent-name-9-4': 'Agent 4 Name:',
            'weekly-schedule-details-agent-address-9-4': 'Agent 4 Address:',
            'weekly-schedule-details-agent-pic-name-9-4': 'Agent 4 PIC Name:',
            'weekly-schedule-details-agent-telephone-9-4': 'Agent 4 Telephone:',
            'weekly-schedule-details-agent-mobile-9-4': 'Agent 4 Mobile:',
            'weekly-schedule-details-agent-email-9-4': 'Agent 4 Email:',

            // Port 9 Agent 5
            'weekly-schedule-details-agent-name-9-5': 'Agent 5 Name:',
            'weekly-schedule-details-agent-address-9-5': 'Agent 5 Address:',
            'weekly-schedule-details-agent-pic-name-9-5': 'Agent 5 PIC Name:',
            'weekly-schedule-details-agent-telephone-9-5': 'Agent 5 Telephone:',
            'weekly-schedule-details-agent-mobile-9-5': 'Agent 5 Mobile:',
            'weekly-schedule-details-agent-email-9-5': 'Agent 5 Email:',

            // Port 9 Agent 6
            'weekly-schedule-details-agent-name-9-6': 'Agent 6 Name:',
            'weekly-schedule-details-agent-address-9-6': 'Agent 6 Address:',
            'weekly-schedule-details-agent-pic-name-9-6': 'Agent 6 PIC Name:',
            'weekly-schedule-details-agent-telephone-9-6': 'Agent 6 Telephone:',
            'weekly-schedule-details-agent-mobile-9-6': 'Agent 6 Mobile:',
            'weekly-schedule-details-agent-email-9-6': 'Agent 6 Email:',

            // Port 9 Agent 7
            'weekly-schedule-details-agent-name-9-7': 'Agent 7 Name:',
            'weekly-schedule-details-agent-address-9-7': 'Agent 7 Address:',
            'weekly-schedule-details-agent-pic-name-9-7': 'Agent 7 PIC Name:',
            'weekly-schedule-details-agent-telephone-9-7': 'Agent 7 Telephone:',
            'weekly-schedule-details-agent-mobile-9-7': 'Agent 7 Mobile:',
            'weekly-schedule-details-agent-email-9-7': 'Agent 7 Email:',

            // Port 9 Agent 8
            'weekly-schedule-details-agent-name-9-8': 'Agent 8 Name:',
            'weekly-schedule-details-agent-address-9-8': 'Agent 8 Address:',
            'weekly-schedule-details-agent-pic-name-9-8': 'Agent 8 PIC Name:',
            'weekly-schedule-details-agent-telephone-9-8': 'Agent 8 Telephone:',
            'weekly-schedule-details-agent-mobile-9-8': 'Agent 8 Mobile:',
            'weekly-schedule-details-agent-email-9-8': 'Agent 8 Email:',

            // Port 9 Agent 9
            'weekly-schedule-details-agent-name-9-9': 'Agent 9 Name:',
            'weekly-schedule-details-agent-address-9-9': 'Agent 9 Address:',
            'weekly-schedule-details-agent-pic-name-9-9': 'Agent 9 PIC Name:',
            'weekly-schedule-details-agent-telephone-9-9': 'Agent 9 Telephone:',
            'weekly-schedule-details-agent-mobile-9-9': 'Agent 9 Mobile:',
            'weekly-schedule-details-agent-email-9-9': 'Agent 9 Email:',

            // Port 9 Agent 10
            'weekly-schedule-details-agent-name-9-10': 'Agent 10 Name:',
            'weekly-schedule-details-agent-address-9-10': 'Agent 10 Address:',
            'weekly-schedule-details-agent-pic-name-9-10': 'Agent 10 PIC Name:',
            'weekly-schedule-details-agent-telephone-9-10': 'Agent 10 Telephone:',
            'weekly-schedule-details-agent-mobile-9-10': 'Agent 10 Mobile:',
            'weekly-schedule-details-agent-email-9-10': 'Agent 10 Email:',

            // Port 9 Agent 11
            'weekly-schedule-details-agent-name-9-11': 'Agent 11 Name:',
            'weekly-schedule-details-agent-address-9-11': 'Agent 11 Address:',
            'weekly-schedule-details-agent-pic-name-9-11': 'Agent 11 PIC Name:',
            'weekly-schedule-details-agent-telephone-9-11': 'Agent 11 Telephone:',
            'weekly-schedule-details-agent-mobile-9-11': 'Agent 11 Mobile:',
            'weekly-schedule-details-agent-email-9-11': 'Agent 11 Email:',

            // Port 9 Agent 12
            'weekly-schedule-details-agent-name-9-12': 'Agent 12 Name:',
            'weekly-schedule-details-agent-address-9-12': 'Agent 12 Address:',
            'weekly-schedule-details-agent-pic-name-9-12': 'Agent 12 PIC Name:',
            'weekly-schedule-details-agent-telephone-9-12': 'Agent 12 Telephone:',
            'weekly-schedule-details-agent-mobile-9-12': 'Agent 12 Mobile:',
            'weekly-schedule-details-agent-email-9-12': 'Agent 12 Email:',

            // Agent Details for Port 10

            // Port 10 Agent 1
            'weekly-schedule-details-agent-name-10-1': 'Agent 1 Name:',
            'weekly-schedule-details-agent-address-10-1': 'Agent 1 Address:',
            'weekly-schedule-details-agent-pic-name-10-1': 'Agent 1 PIC Name:',
            'weekly-schedule-details-agent-telephone-10-1': 'Agent 1 Telephone:',
            'weekly-schedule-details-agent-mobile-10-1': 'Agent 1 Mobile:',
            'weekly-schedule-details-agent-email-10-1': 'Agent 1 Email:',

            // Port 10 Agent 2
            'weekly-schedule-details-agent-name-10-2': 'Agent 2 Name:',
            'weekly-schedule-details-agent-address-10-2': 'Agent 2 Address:',
            'weekly-schedule-details-agent-pic-name-10-2': 'Agent 2 PIC Name:',
            'weekly-schedule-details-agent-telephone-10-2': 'Agent 2 Telephone:',
            'weekly-schedule-details-agent-mobile-10-2': 'Agent 2 Mobile:',
            'weekly-schedule-details-agent-email-10-2': 'Agent 2 Email:',

            // Port 10 Agent 3
            'weekly-schedule-details-agent-name-10-3': 'Agent 3 Name:',
            'weekly-schedule-details-agent-address-10-3': 'Agent 3 Address:',
            'weekly-schedule-details-agent-pic-name-10-3': 'Agent 3 PIC Name:',
            'weekly-schedule-details-agent-telephone-10-3': 'Agent 3 Telephone:',
            'weekly-schedule-details-agent-mobile-10-3': 'Agent 3 Mobile:',
            'weekly-schedule-details-agent-email-10-3': 'Agent 3 Email:',

            // Port 10 Agent 4
            'weekly-schedule-details-agent-name-10-4': 'Agent 4 Name:',
            'weekly-schedule-details-agent-address-10-4': 'Agent 4 Address:',
            'weekly-schedule-details-agent-pic-name-10-4': 'Agent 4 PIC Name:',
            'weekly-schedule-details-agent-telephone-10-4': 'Agent 4 Telephone:',
            'weekly-schedule-details-agent-mobile-10-4': 'Agent 4 Mobile:',
            'weekly-schedule-details-agent-email-10-4': 'Agent 4 Email:',

            // Port 10 Agent 5
            'weekly-schedule-details-agent-name-10-5': 'Agent 5 Name:',
            'weekly-schedule-details-agent-address-10-5': 'Agent 5 Address:',
            'weekly-schedule-details-agent-pic-name-10-5': 'Agent 5 PIC Name:',
            'weekly-schedule-details-agent-telephone-10-5': 'Agent 5 Telephone:',
            'weekly-schedule-details-agent-mobile-10-5': 'Agent 5 Mobile:',
            'weekly-schedule-details-agent-email-10-5': 'Agent 5 Email:',

            // Port 10 Agent 6
            'weekly-schedule-details-agent-name-10-6': 'Agent 6 Name:',
            'weekly-schedule-details-agent-address-10-6': 'Agent 6 Address:',
            'weekly-schedule-details-agent-pic-name-10-6': 'Agent 6 PIC Name:',
            'weekly-schedule-details-agent-telephone-10-6': 'Agent 6 Telephone:',
            'weekly-schedule-details-agent-mobile-10-6': 'Agent 6 Mobile:',
            'weekly-schedule-details-agent-email-10-6': 'Agent 6 Email:',

            // Port 10 Agent 7
            'weekly-schedule-details-agent-name-10-7': 'Agent 7 Name:',
            'weekly-schedule-details-agent-address-10-7': 'Agent 7 Address:',
            'weekly-schedule-details-agent-pic-name-10-7': 'Agent 7 PIC Name:',
            'weekly-schedule-details-agent-telephone-10-7': 'Agent 7 Telephone:',
            'weekly-schedule-details-agent-mobile-10-7': 'Agent 7 Mobile:',
            'weekly-schedule-details-agent-email-10-7': 'Agent 7 Email:',

            // Port 10 Agent 8
            'weekly-schedule-details-agent-name-10-8': 'Agent 8 Name:',
            'weekly-schedule-details-agent-address-10-8': 'Agent 8 Address:',
            'weekly-schedule-details-agent-pic-name-10-8': 'Agent 8 PIC Name:',
            'weekly-schedule-details-agent-telephone-10-8': 'Agent 8 Telephone:',
            'weekly-schedule-details-agent-mobile-10-8': 'Agent 8 Mobile:',
            'weekly-schedule-details-agent-email-10-8': 'Agent 8 Email:',

            // Port 10 Agent 9
            'weekly-schedule-details-agent-name-10-9': 'Agent 9 Name:',
            'weekly-schedule-details-agent-address-10-9': 'Agent 9 Address:',
            'weekly-schedule-details-agent-pic-name-10-9': 'Agent 9 PIC Name:',
            'weekly-schedule-details-agent-telephone-10-9': 'Agent 9 Telephone:',
            'weekly-schedule-details-agent-mobile-10-9': 'Agent 9 Mobile:',
            'weekly-schedule-details-agent-email-10-9': 'Agent 9 Email:',

            // Port 10 Agent 10
            'weekly-schedule-details-agent-name-10-10': 'Agent 10 Name:',
            'weekly-schedule-details-agent-address-10-10': 'Agent 10 Address:',
            'weekly-schedule-details-agent-pic-name-10-10': 'Agent 10 PIC Name:',
            'weekly-schedule-details-agent-telephone-10-10': 'Agent 10 Telephone:',
            'weekly-schedule-details-agent-mobile-10-10': 'Agent 10 Mobile:',
            'weekly-schedule-details-agent-email-10-10': 'Agent 10 Email:',

            // Port 10 Agent 11
            'weekly-schedule-details-agent-name-10-11': 'Agent 11 Name:',
            'weekly-schedule-details-agent-address-10-11': 'Agent 11 Address:',
            'weekly-schedule-details-agent-pic-name-10-11': 'Agent 11 PIC Name:',
            'weekly-schedule-details-agent-telephone-10-11': 'Agent 11 Telephone:',
            'weekly-schedule-details-agent-mobile-10-11': 'Agent 11 Mobile:',
            'weekly-schedule-details-agent-email-10-11': 'Agent 11 Email:',

            // Port 10 Agent 12
            'weekly-schedule-details-agent-name-10-12': 'Agent 12 Name:',
            'weekly-schedule-details-agent-address-10-12': 'Agent 12 Address:',
            'weekly-schedule-details-agent-pic-name-10-12': 'Agent 12 PIC Name:',
            'weekly-schedule-details-agent-telephone-10-12': 'Agent 12 Telephone:',
            'weekly-schedule-details-agent-mobile-10-12': 'Agent 12 Mobile:',
            'weekly-schedule-details-agent-email-10-12': 'Agent 12 Email:',


            // Agent Details for Port 11

            // Port 11 Agent 1
            'weekly-schedule-details-agent-name-11-1': 'Agent 1 Name:',
            'weekly-schedule-details-agent-address-11-1': 'Agent 1 Address:',
            'weekly-schedule-details-agent-pic-name-11-1': 'Agent 1 PIC Name:',
            'weekly-schedule-details-agent-telephone-11-1': 'Agent 1 Telephone:',
            'weekly-schedule-details-agent-mobile-11-1': 'Agent 1 Mobile:',
            'weekly-schedule-details-agent-email-11-1': 'Agent 1 Email:',

            // Port 11 Agent 2
            'weekly-schedule-details-agent-name-11-2': 'Agent 2 Name:',
            'weekly-schedule-details-agent-address-11-2': 'Agent 2 Address:',
            'weekly-schedule-details-agent-pic-name-11-2': 'Agent 2 PIC Name:',
            'weekly-schedule-details-agent-telephone-11-2': 'Agent 2 Telephone:',
            'weekly-schedule-details-agent-mobile-11-2': 'Agent 2 Mobile:',
            'weekly-schedule-details-agent-email-11-2': 'Agent 2 Email:',

            // Port 11 Agent 3
            'weekly-schedule-details-agent-name-11-3': 'Agent 3 Name:',
            'weekly-schedule-details-agent-address-11-3': 'Agent 3 Address:',
            'weekly-schedule-details-agent-pic-name-11-3': 'Agent 3 PIC Name:',
            'weekly-schedule-details-agent-telephone-11-3': 'Agent 3 Telephone:',
            'weekly-schedule-details-agent-mobile-11-3': 'Agent 3 Mobile:',
            'weekly-schedule-details-agent-email-11-3': 'Agent 3 Email:',

            // Port 11 Agent 4
            'weekly-schedule-details-agent-name-11-4': 'Agent 4 Name:',
            'weekly-schedule-details-agent-address-11-4': 'Agent 4 Address:',
            'weekly-schedule-details-agent-pic-name-11-4': 'Agent 4 PIC Name:',
            'weekly-schedule-details-agent-telephone-11-4': 'Agent 4 Telephone:',
            'weekly-schedule-details-agent-mobile-11-4': 'Agent 4 Mobile:',
            'weekly-schedule-details-agent-email-11-4': 'Agent 4 Email:',

            // Port 11 Agent 5
            'weekly-schedule-details-agent-name-11-5': 'Agent 5 Name:',
            'weekly-schedule-details-agent-address-11-5': 'Agent 5 Address:',
            'weekly-schedule-details-agent-pic-name-11-5': 'Agent 5 PIC Name:',
            'weekly-schedule-details-agent-telephone-11-5': 'Agent 5 Telephone:',
            'weekly-schedule-details-agent-mobile-11-5': 'Agent 5 Mobile:',
            'weekly-schedule-details-agent-email-11-5': 'Agent 5 Email:',

            // Port 11 Agent 6
            'weekly-schedule-details-agent-name-11-6': 'Agent 6 Name:',
            'weekly-schedule-details-agent-address-11-6': 'Agent 6 Address:',
            'weekly-schedule-details-agent-pic-name-11-6': 'Agent 6 PIC Name:',
            'weekly-schedule-details-agent-telephone-11-6': 'Agent 6 Telephone:',
            'weekly-schedule-details-agent-mobile-11-6': 'Agent 6 Mobile:',
            'weekly-schedule-details-agent-email-11-6': 'Agent 6 Email:',

            // Port 11 Agent 7
            'weekly-schedule-details-agent-name-11-7': 'Agent 7 Name:',
            'weekly-schedule-details-agent-address-11-7': 'Agent 7 Address:',
            'weekly-schedule-details-agent-pic-name-11-7': 'Agent 7 PIC Name:',
            'weekly-schedule-details-agent-telephone-11-7': 'Agent 7 Telephone:',
            'weekly-schedule-details-agent-mobile-11-7': 'Agent 7 Mobile:',
            'weekly-schedule-details-agent-email-11-7': 'Agent 7 Email:',

            // Port 11 Agent 8
            'weekly-schedule-details-agent-name-11-8': 'Agent 8 Name:',
            'weekly-schedule-details-agent-address-11-8': 'Agent 8 Address:',
            'weekly-schedule-details-agent-pic-name-11-8': 'Agent 8 PIC Name:',
            'weekly-schedule-details-agent-telephone-11-8': 'Agent 8 Telephone:',
            'weekly-schedule-details-agent-mobile-11-8': 'Agent 8 Mobile:',
            'weekly-schedule-details-agent-email-11-8': 'Agent 8 Email:',

            // Port 11 Agent 9
            'weekly-schedule-details-agent-name-11-9': 'Agent 9 Name:',
            'weekly-schedule-details-agent-address-11-9': 'Agent 9 Address:',
            'weekly-schedule-details-agent-pic-name-11-9': 'Agent 9 PIC Name:',
            'weekly-schedule-details-agent-telephone-11-9': 'Agent 9 Telephone:',
            'weekly-schedule-details-agent-mobile-11-9': 'Agent 9 Mobile:',
            'weekly-schedule-details-agent-email-11-9': 'Agent 9 Email:',

            // Port 11 Agent 10
            'weekly-schedule-details-agent-name-11-10': 'Agent 10 Name:',
            'weekly-schedule-details-agent-address-11-10': 'Agent 10 Address:',
            'weekly-schedule-details-agent-pic-name-11-10': 'Agent 10 PIC Name:',
            'weekly-schedule-details-agent-telephone-11-10': 'Agent 10 Telephone:',
            'weekly-schedule-details-agent-mobile-11-10': 'Agent 10 Mobile:',
            'weekly-schedule-details-agent-email-11-10': 'Agent 10 Email:',

            // Port 11 Agent 11
            'weekly-schedule-details-agent-name-11-11': 'Agent 11 Name:',
            'weekly-schedule-details-agent-address-11-11': 'Agent 11 Address:',
            'weekly-schedule-details-agent-pic-name-11-11': 'Agent 11 PIC Name:',
            'weekly-schedule-details-agent-telephone-11-11': 'Agent 11 Telephone:',
            'weekly-schedule-details-agent-mobile-11-11': 'Agent 11 Mobile:',
            'weekly-schedule-details-agent-email-11-11': 'Agent 11 Email:',

            // Port 11 Agent 12
            'weekly-schedule-details-agent-name-11-12': 'Agent 12 Name:',
            'weekly-schedule-details-agent-address-11-12': 'Agent 12 Address:',
            'weekly-schedule-details-agent-pic-name-11-12': 'Agent 12 PIC Name:',
            'weekly-schedule-details-agent-telephone-11-12': 'Agent 12 Telephone:',
            'weekly-schedule-details-agent-mobile-11-12': 'Agent 12 Mobile:',
            'weekly-schedule-details-agent-email-11-12': 'Agent 12 Email:',

            // Agent Details for Port 12

            // Port 12 Agent 1
            'weekly-schedule-details-agent-name-12-1': 'Agent 1 Name:',
            'weekly-schedule-details-agent-address-12-1': 'Agent 1 Address:',
            'weekly-schedule-details-agent-pic-name-12-1': 'Agent 1 PIC Name:',
            'weekly-schedule-details-agent-telephone-12-1': 'Agent 1 Telephone:',
            'weekly-schedule-details-agent-mobile-12-1': 'Agent 1 Mobile:',
            'weekly-schedule-details-agent-email-12-1': 'Agent 1 Email:',

            // Port 12 Agent 2
            'weekly-schedule-details-agent-name-12-2': 'Agent 2 Name:',
            'weekly-schedule-details-agent-address-12-2': 'Agent 2 Address:',
            'weekly-schedule-details-agent-pic-name-12-2': 'Agent 2 PIC Name:',
            'weekly-schedule-details-agent-telephone-12-2': 'Agent 2 Telephone:',
            'weekly-schedule-details-agent-mobile-12-2': 'Agent 2 Mobile:',
            'weekly-schedule-details-agent-email-12-2': 'Agent 2 Email:',

            // Port 12 Agent 3
            'weekly-schedule-details-agent-name-12-3': 'Agent 3 Name:',
            'weekly-schedule-details-agent-address-12-3': 'Agent 3 Address:',
            'weekly-schedule-details-agent-pic-name-12-3': 'Agent 3 PIC Name:',
            'weekly-schedule-details-agent-telephone-12-3': 'Agent 3 Telephone:',
            'weekly-schedule-details-agent-mobile-12-3': 'Agent 3 Mobile:',
            'weekly-schedule-details-agent-email-12-3': 'Agent 3 Email:',

            // Port 12 Agent 4
            'weekly-schedule-details-agent-name-12-4': 'Agent 4 Name:',
            'weekly-schedule-details-agent-address-12-4': 'Agent 4 Address:',
            'weekly-schedule-details-agent-pic-name-12-4': 'Agent 4 PIC Name:',
            'weekly-schedule-details-agent-telephone-12-4': 'Agent 4 Telephone:',
            'weekly-schedule-details-agent-mobile-12-4': 'Agent 4 Mobile:',
            'weekly-schedule-details-agent-email-12-4': 'Agent 4 Email:',

            // Port 12 Agent 5
            'weekly-schedule-details-agent-name-12-5': 'Agent 5 Name:',
            'weekly-schedule-details-agent-address-12-5': 'Agent 5 Address:',
            'weekly-schedule-details-agent-pic-name-12-5': 'Agent 5 PIC Name:',
            'weekly-schedule-details-agent-telephone-12-5': 'Agent 5 Telephone:',
            'weekly-schedule-details-agent-mobile-12-5': 'Agent 5 Mobile:',
            'weekly-schedule-details-agent-email-12-5': 'Agent 5 Email:',

            // Port 12 Agent 6
            'weekly-schedule-details-agent-name-12-6': 'Agent 6 Name:',
            'weekly-schedule-details-agent-address-12-6': 'Agent 6 Address:',
            'weekly-schedule-details-agent-pic-name-12-6': 'Agent 6 PIC Name:',
            'weekly-schedule-details-agent-telephone-12-6': 'Agent 6 Telephone:',
            'weekly-schedule-details-agent-mobile-12-6': 'Agent 6 Mobile:',
            'weekly-schedule-details-agent-email-12-6': 'Agent 6 Email:',

            // Port 12 Agent 7
            'weekly-schedule-details-agent-name-12-7': 'Agent 7 Name:',
            'weekly-schedule-details-agent-address-12-7': 'Agent 7 Address:',
            'weekly-schedule-details-agent-pic-name-12-7': 'Agent 7 PIC Name:',
            'weekly-schedule-details-agent-telephone-12-7': 'Agent 7 Telephone:',
            'weekly-schedule-details-agent-mobile-12-7': 'Agent 7 Mobile:',
            'weekly-schedule-details-agent-email-12-7': 'Agent 7 Email:',

            // Port 12 Agent 8
            'weekly-schedule-details-agent-name-12-8': 'Agent 8 Name:',
            'weekly-schedule-details-agent-address-12-8': 'Agent 8 Address:',
            'weekly-schedule-details-agent-pic-name-12-8': 'Agent 8 PIC Name:',
            'weekly-schedule-details-agent-telephone-12-8': 'Agent 8 Telephone:',
            'weekly-schedule-details-agent-mobile-12-8': 'Agent 8 Mobile:',
            'weekly-schedule-details-agent-email-12-8': 'Agent 8 Email:',

            // Port 12 Agent 9
            'weekly-schedule-details-agent-name-12-9': 'Agent 9 Name:',
            'weekly-schedule-details-agent-address-12-9': 'Agent 9 Address:',
            'weekly-schedule-details-agent-pic-name-12-9': 'Agent 9 PIC Name:',
            'weekly-schedule-details-agent-telephone-12-9': 'Agent 9 Telephone:',
            'weekly-schedule-details-agent-mobile-12-9': 'Agent 9 Mobile:',
            'weekly-schedule-details-agent-email-12-9': 'Agent 9 Email:',

            // Port 12 Agent 10
            'weekly-schedule-details-agent-name-12-10': 'Agent 10 Name:',
            'weekly-schedule-details-agent-address-12-10': 'Agent 10 Address:',
            'weekly-schedule-details-agent-pic-name-12-10': 'Agent 10 PIC Name:',
            'weekly-schedule-details-agent-telephone-12-10': 'Agent 10 Telephone:',
            'weekly-schedule-details-agent-mobile-12-10': 'Agent 10 Mobile:',
            'weekly-schedule-details-agent-email-12-10': 'Agent 10 Email:',

            // Port 12 Agent 11
            'weekly-schedule-details-agent-name-12-11': 'Agent 11 Name:',
            'weekly-schedule-details-agent-address-12-11': 'Agent 11 Address:',
            'weekly-schedule-details-agent-pic-name-12-11': 'Agent 11 PIC Name:',
            'weekly-schedule-details-agent-telephone-12-11': 'Agent 11 Telephone:',
            'weekly-schedule-details-agent-mobile-12-11': 'Agent 11 Mobile:',
            'weekly-schedule-details-agent-email-12-11': 'Agent 11 Email:',

            // Port 12 Agent 12
            'weekly-schedule-details-agent-name-12-12': 'Agent 12 Name:',
            'weekly-schedule-details-agent-address-12-12': 'Agent 12 Address:',
            'weekly-schedule-details-agent-pic-name-12-12': 'Agent 12 PIC Name:',
            'weekly-schedule-details-agent-telephone-12-12': 'Agent 12 Telephone:',
            'weekly-schedule-details-agent-mobile-12-12': 'Agent 12 Mobile:',
            'weekly-schedule-details-agent-email-12-12': 'Agent 12 Email:',

            // Agent Details for Port 13

            // Port 13 Agent 1
            'weekly-schedule-details-agent-name-13-1': 'Agent 1 Name:',
            'weekly-schedule-details-agent-address-13-1': 'Agent 1 Address:',
            'weekly-schedule-details-agent-pic-name-13-1': 'Agent 1 PIC Name:',
            'weekly-schedule-details-agent-telephone-13-1': 'Agent 1 Telephone:',
            'weekly-schedule-details-agent-mobile-13-1': 'Agent 1 Mobile:',
            'weekly-schedule-details-agent-email-13-1': 'Agent 1 Email:',

            // Port 13 Agent 2
            'weekly-schedule-details-agent-name-13-2': 'Agent 2 Name:',
            'weekly-schedule-details-agent-address-13-2': 'Agent 2 Address:',
            'weekly-schedule-details-agent-pic-name-13-2': 'Agent 2 PIC Name:',
            'weekly-schedule-details-agent-telephone-13-2': 'Agent 2 Telephone:',
            'weekly-schedule-details-agent-mobile-13-2': 'Agent 2 Mobile:',
            'weekly-schedule-details-agent-email-13-2': 'Agent 2 Email:',

            // Port 13 Agent 3
            'weekly-schedule-details-agent-name-13-3': 'Agent 3 Name:',
            'weekly-schedule-details-agent-address-13-3': 'Agent 3 Address:',
            'weekly-schedule-details-agent-pic-name-13-3': 'Agent 3 PIC Name:',
            'weekly-schedule-details-agent-telephone-13-3': 'Agent 3 Telephone:',
            'weekly-schedule-details-agent-mobile-13-3': 'Agent 3 Mobile:',
            'weekly-schedule-details-agent-email-13-3': 'Agent 3 Email:',

            // Port 13 Agent 4
            'weekly-schedule-details-agent-name-13-4': 'Agent 4 Name:',
            'weekly-schedule-details-agent-address-13-4': 'Agent 4 Address:',
            'weekly-schedule-details-agent-pic-name-13-4': 'Agent 4 PIC Name:',
            'weekly-schedule-details-agent-telephone-13-4': 'Agent 4 Telephone:',
            'weekly-schedule-details-agent-mobile-13-4': 'Agent 4 Mobile:',
            'weekly-schedule-details-agent-email-13-4': 'Agent 4 Email:',

            // Port 13 Agent 5
            'weekly-schedule-details-agent-name-13-5': 'Agent 5 Name:',
            'weekly-schedule-details-agent-address-13-5': 'Agent 5 Address:',
            'weekly-schedule-details-agent-pic-name-13-5': 'Agent 5 PIC Name:',
            'weekly-schedule-details-agent-telephone-13-5': 'Agent 5 Telephone:',
            'weekly-schedule-details-agent-mobile-13-5': 'Agent 5 Mobile:',
            'weekly-schedule-details-agent-email-13-5': 'Agent 5 Email:',

            // Port 13 Agent 6
            'weekly-schedule-details-agent-name-13-6': 'Agent 6 Name:',
            'weekly-schedule-details-agent-address-13-6': 'Agent 6 Address:',
            'weekly-schedule-details-agent-pic-name-13-6': 'Agent 6 PIC Name:',
            'weekly-schedule-details-agent-telephone-13-6': 'Agent 6 Telephone:',
            'weekly-schedule-details-agent-mobile-13-6': 'Agent 6 Mobile:',
            'weekly-schedule-details-agent-email-13-6': 'Agent 6 Email:',

            // Port 13 Agent 7
            'weekly-schedule-details-agent-name-13-7': 'Agent 7 Name:',
            'weekly-schedule-details-agent-address-13-7': 'Agent 7 Address:',
            'weekly-schedule-details-agent-pic-name-13-7': 'Agent 7 PIC Name:',
            'weekly-schedule-details-agent-telephone-13-7': 'Agent 7 Telephone:',
            'weekly-schedule-details-agent-mobile-13-7': 'Agent 7 Mobile:',
            'weekly-schedule-details-agent-email-13-7': 'Agent 7 Email:',

            // Port 13 Agent 8
            'weekly-schedule-details-agent-name-13-8': 'Agent 8 Name:',
            'weekly-schedule-details-agent-address-13-8': 'Agent 8 Address:',
            'weekly-schedule-details-agent-pic-name-13-8': 'Agent 8 PIC Name:',
            'weekly-schedule-details-agent-telephone-13-8': 'Agent 8 Telephone:',
            'weekly-schedule-details-agent-mobile-13-8': 'Agent 8 Mobile:',
            'weekly-schedule-details-agent-email-13-8': 'Agent 8 Email:',

            // Port 13 Agent 9
            'weekly-schedule-details-agent-name-13-9': 'Agent 9 Name:',
            'weekly-schedule-details-agent-address-13-9': 'Agent 9 Address:',
            'weekly-schedule-details-agent-pic-name-13-9': 'Agent 9 PIC Name:',
            'weekly-schedule-details-agent-telephone-13-9': 'Agent 9 Telephone:',
            'weekly-schedule-details-agent-mobile-13-9': 'Agent 9 Mobile:',
            'weekly-schedule-details-agent-email-13-9': 'Agent 9 Email:',

            // Port 13 Agent 10
            'weekly-schedule-details-agent-name-13-10': 'Agent 10 Name:',
            'weekly-schedule-details-agent-address-13-10': 'Agent 10 Address:',
            'weekly-schedule-details-agent-pic-name-13-10': 'Agent 10 PIC Name:',
            'weekly-schedule-details-agent-telephone-13-10': 'Agent 10 Telephone:',
            'weekly-schedule-details-agent-mobile-13-10': 'Agent 10 Mobile:',
            'weekly-schedule-details-agent-email-13-10': 'Agent 10 Email:',

            // Port 13 Agent 11
            'weekly-schedule-details-agent-name-13-11': 'Agent 11 Name:',
            'weekly-schedule-details-agent-address-13-11': 'Agent 11 Address:',
            'weekly-schedule-details-agent-pic-name-13-11': 'Agent 11 PIC Name:',
            'weekly-schedule-details-agent-telephone-13-11': 'Agent 11 Telephone:',
            'weekly-schedule-details-agent-mobile-13-11': 'Agent 11 Mobile:',
            'weekly-schedule-details-agent-email-13-11': 'Agent 11 Email:',

            // Port 13 Agent 12
            'weekly-schedule-details-agent-name-13-12': 'Agent 12 Name:',
            'weekly-schedule-details-agent-address-13-12': 'Agent 12 Address:',
            'weekly-schedule-details-agent-pic-name-13-12': 'Agent 12 PIC Name:',
            'weekly-schedule-details-agent-telephone-13-12': 'Agent 12 Telephone:',
            'weekly-schedule-details-agent-mobile-13-12': 'Agent 12 Mobile:',
            'weekly-schedule-details-agent-email-13-12': 'Agent 12 Email:',

            // Agent Details for Port 14

            // Port 14 Agent 1
            'weekly-schedule-details-agent-name-14-1': 'Agent 1 Name:',
            'weekly-schedule-details-agent-address-14-1': 'Agent 1 Address:',
            'weekly-schedule-details-agent-pic-name-14-1': 'Agent 1 PIC Name:',
            'weekly-schedule-details-agent-telephone-14-1': 'Agent 1 Telephone:',
            'weekly-schedule-details-agent-mobile-14-1': 'Agent 1 Mobile:',
            'weekly-schedule-details-agent-email-14-1': 'Agent 1 Email:',

            // Port 14 Agent 2
            'weekly-schedule-details-agent-name-14-2': 'Agent 2 Name:',
            'weekly-schedule-details-agent-address-14-2': 'Agent 2 Address:',
            'weekly-schedule-details-agent-pic-name-14-2': 'Agent 2 PIC Name:',
            'weekly-schedule-details-agent-telephone-14-2': 'Agent 2 Telephone:',
            'weekly-schedule-details-agent-mobile-14-2': 'Agent 2 Mobile:',
            'weekly-schedule-details-agent-email-14-2': 'Agent 2 Email:',

            // Port 14 Agent 3
            'weekly-schedule-details-agent-name-14-3': 'Agent 3 Name:',
            'weekly-schedule-details-agent-address-14-3': 'Agent 3 Address:',
            'weekly-schedule-details-agent-pic-name-14-3': 'Agent 3 PIC Name:',
            'weekly-schedule-details-agent-telephone-14-3': 'Agent 3 Telephone:',
            'weekly-schedule-details-agent-mobile-14-3': 'Agent 3 Mobile:',
            'weekly-schedule-details-agent-email-14-3': 'Agent 3 Email:',

            // Port 14 Agent 4
            'weekly-schedule-details-agent-name-14-4': 'Agent 4 Name:',
            'weekly-schedule-details-agent-address-14-4': 'Agent 4 Address:',
            'weekly-schedule-details-agent-pic-name-14-4': 'Agent 4 PIC Name:',
            'weekly-schedule-details-agent-telephone-14-4': 'Agent 4 Telephone:',
            'weekly-schedule-details-agent-mobile-14-4': 'Agent 4 Mobile:',
            'weekly-schedule-details-agent-email-14-4': 'Agent 4 Email:',

            // Port 14 Agent 5
            'weekly-schedule-details-agent-name-14-5': 'Agent 5 Name:',
            'weekly-schedule-details-agent-address-14-5': 'Agent 5 Address:',
            'weekly-schedule-details-agent-pic-name-14-5': 'Agent 5 PIC Name:',
            'weekly-schedule-details-agent-telephone-14-5': 'Agent 5 Telephone:',
            'weekly-schedule-details-agent-mobile-14-5': 'Agent 5 Mobile:',
            'weekly-schedule-details-agent-email-14-5': 'Agent 5 Email:',

            // Port 14 Agent 6
            'weekly-schedule-details-agent-name-14-6': 'Agent 6 Name:',
            'weekly-schedule-details-agent-address-14-6': 'Agent 6 Address:',
            'weekly-schedule-details-agent-pic-name-14-6': 'Agent 6 PIC Name:',
            'weekly-schedule-details-agent-telephone-14-6': 'Agent 6 Telephone:',
            'weekly-schedule-details-agent-mobile-14-6': 'Agent 6 Mobile:',
            'weekly-schedule-details-agent-email-14-6': 'Agent 6 Email:',

            // Port 14 Agent 7
            'weekly-schedule-details-agent-name-14-7': 'Agent 7 Name:',
            'weekly-schedule-details-agent-address-14-7': 'Agent 7 Address:',
            'weekly-schedule-details-agent-pic-name-14-7': 'Agent 7 PIC Name:',
            'weekly-schedule-details-agent-telephone-14-7': 'Agent 7 Telephone:',
            'weekly-schedule-details-agent-mobile-14-7': 'Agent 7 Mobile:',
            'weekly-schedule-details-agent-email-14-7': 'Agent 7 Email:',

            // Port 14 Agent 8
            'weekly-schedule-details-agent-name-14-8': 'Agent 8 Name:',
            'weekly-schedule-details-agent-address-14-8': 'Agent 8 Address:',
            'weekly-schedule-details-agent-pic-name-14-8': 'Agent 8 PIC Name:',
            'weekly-schedule-details-agent-telephone-14-8': 'Agent 8 Telephone:',
            'weekly-schedule-details-agent-mobile-14-8': 'Agent 8 Mobile:',
            'weekly-schedule-details-agent-email-14-8': 'Agent 8 Email:',

            // Port 14 Agent 9
            'weekly-schedule-details-agent-name-14-9': 'Agent 9 Name:',
            'weekly-schedule-details-agent-address-14-9': 'Agent 9 Address:',
            'weekly-schedule-details-agent-pic-name-14-9': 'Agent 9 PIC Name:',
            'weekly-schedule-details-agent-telephone-14-9': 'Agent 9 Telephone:',
            'weekly-schedule-details-agent-mobile-14-9': 'Agent 9 Mobile:',
            'weekly-schedule-details-agent-email-14-9': 'Agent 9 Email:',

            // Port 14 Agent 10
            'weekly-schedule-details-agent-name-14-10': 'Agent 10 Name:',
            'weekly-schedule-details-agent-address-14-10': 'Agent 10 Address:',
            'weekly-schedule-details-agent-pic-name-14-10': 'Agent 10 PIC Name:',
            'weekly-schedule-details-agent-telephone-14-10': 'Agent 10 Telephone:',
            'weekly-schedule-details-agent-mobile-14-10': 'Agent 10 Mobile:',
            'weekly-schedule-details-agent-email-14-10': 'Agent 10 Email:',

            // Port 14 Agent 11
            'weekly-schedule-details-agent-name-14-11': 'Agent 11 Name:',
            'weekly-schedule-details-agent-address-14-11': 'Agent 11 Address:',
            'weekly-schedule-details-agent-pic-name-14-11': 'Agent 11 PIC Name:',
            'weekly-schedule-details-agent-telephone-14-11': 'Agent 11 Telephone:',
            'weekly-schedule-details-agent-mobile-14-11': 'Agent 11 Mobile:',
            'weekly-schedule-details-agent-email-14-11': 'Agent 11 Email:',

            // Port 14 Agent 12
            'weekly-schedule-details-agent-name-14-12': 'Agent 12 Name:',
            'weekly-schedule-details-agent-address-14-12': 'Agent 12 Address:',
            'weekly-schedule-details-agent-pic-name-14-12': 'Agent 12 PIC Name:',
            'weekly-schedule-details-agent-telephone-14-12': 'Agent 12 Telephone:',
            'weekly-schedule-details-agent-mobile-14-12': 'Agent 12 Mobile:',
            'weekly-schedule-details-agent-email-14-12': 'Agent 12 Email:',

            // Agent Details for Port 15

            // Port 15 Agent 1
            'weekly-schedule-details-agent-name-15-1': 'Agent 1 Name:',
            'weekly-schedule-details-agent-address-15-1': 'Agent 1 Address:',
            'weekly-schedule-details-agent-pic-name-15-1': 'Agent 1 PIC Name:',
            'weekly-schedule-details-agent-telephone-15-1': 'Agent 1 Telephone:',
            'weekly-schedule-details-agent-mobile-15-1': 'Agent 1 Mobile:',
            'weekly-schedule-details-agent-email-15-1': 'Agent 1 Email:',

            // Port 15 Agent 2
            'weekly-schedule-details-agent-name-15-2': 'Agent 2 Name:',
            'weekly-schedule-details-agent-address-15-2': 'Agent 2 Address:',
            'weekly-schedule-details-agent-pic-name-15-2': 'Agent 2 PIC Name:',
            'weekly-schedule-details-agent-telephone-15-2': 'Agent 2 Telephone:',
            'weekly-schedule-details-agent-mobile-15-2': 'Agent 2 Mobile:',
            'weekly-schedule-details-agent-email-15-2': 'Agent 2 Email:',

            // Port 15 Agent 3
            'weekly-schedule-details-agent-name-15-3': 'Agent 3 Name:',
            'weekly-schedule-details-agent-address-15-3': 'Agent 3 Address:',
            'weekly-schedule-details-agent-pic-name-15-3': 'Agent 3 PIC Name:',
            'weekly-schedule-details-agent-telephone-15-3': 'Agent 3 Telephone:',
            'weekly-schedule-details-agent-mobile-15-3': 'Agent 3 Mobile:',
            'weekly-schedule-details-agent-email-15-3': 'Agent 3 Email:',

            // Port 15 Agent 4
            'weekly-schedule-details-agent-name-15-4': 'Agent 4 Name:',
            'weekly-schedule-details-agent-address-15-4': 'Agent 4 Address:',
            'weekly-schedule-details-agent-pic-name-15-4': 'Agent 4 PIC Name:',
            'weekly-schedule-details-agent-telephone-15-4': 'Agent 4 Telephone:',
            'weekly-schedule-details-agent-mobile-15-4': 'Agent 4 Mobile:',
            'weekly-schedule-details-agent-email-15-4': 'Agent 4 Email:',

            // Port 15 Agent 5
            'weekly-schedule-details-agent-name-15-5': 'Agent 5 Name:',
            'weekly-schedule-details-agent-address-15-5': 'Agent 5 Address:',
            'weekly-schedule-details-agent-pic-name-15-5': 'Agent 5 PIC Name:',
            'weekly-schedule-details-agent-telephone-15-5': 'Agent 5 Telephone:',
            'weekly-schedule-details-agent-mobile-15-5': 'Agent 5 Mobile:',
            'weekly-schedule-details-agent-email-15-5': 'Agent 5 Email:',

            // Port 15 Agent 6
            'weekly-schedule-details-agent-name-15-6': 'Agent 6 Name:',
            'weekly-schedule-details-agent-address-15-6': 'Agent 6 Address:',
            'weekly-schedule-details-agent-pic-name-15-6': 'Agent 6 PIC Name:',
            'weekly-schedule-details-agent-telephone-15-6': 'Agent 6 Telephone:',
            'weekly-schedule-details-agent-mobile-15-6': 'Agent 6 Mobile:',
            'weekly-schedule-details-agent-email-15-6': 'Agent 6 Email:',

            // Port 15 Agent 7
            'weekly-schedule-details-agent-name-15-7': 'Agent 7 Name:',
            'weekly-schedule-details-agent-address-15-7': 'Agent 7 Address:',
            'weekly-schedule-details-agent-pic-name-15-7': 'Agent 7 PIC Name:',
            'weekly-schedule-details-agent-telephone-15-7': 'Agent 7 Telephone:',
            'weekly-schedule-details-agent-mobile-15-7': 'Agent 7 Mobile:',
            'weekly-schedule-details-agent-email-15-7': 'Agent 7 Email:',

            // Port 15 Agent 8
            'weekly-schedule-details-agent-name-15-8': 'Agent 8 Name:',
            'weekly-schedule-details-agent-address-15-8': 'Agent 8 Address:',
            'weekly-schedule-details-agent-pic-name-15-8': 'Agent 8 PIC Name:',
            'weekly-schedule-details-agent-telephone-15-8': 'Agent 8 Telephone:',
            'weekly-schedule-details-agent-mobile-15-8': 'Agent 8 Mobile:',
            'weekly-schedule-details-agent-email-15-8': 'Agent 8 Email:',

            // Port 15 Agent 9
            'weekly-schedule-details-agent-name-15-9': 'Agent 9 Name:',
            'weekly-schedule-details-agent-address-15-9': 'Agent 9 Address:',
            'weekly-schedule-details-agent-pic-name-15-9': 'Agent 9 PIC Name:',
            'weekly-schedule-details-agent-telephone-15-9': 'Agent 9 Telephone:',
            'weekly-schedule-details-agent-mobile-15-9': 'Agent 9 Mobile:',
            'weekly-schedule-details-agent-email-15-9': 'Agent 9 Email:',

            // Port 15 Agent 10
            'weekly-schedule-details-agent-name-15-10': 'Agent 10 Name:',
            'weekly-schedule-details-agent-address-15-10': 'Agent 10 Address:',
            'weekly-schedule-details-agent-pic-name-15-10': 'Agent 10 PIC Name:',
            'weekly-schedule-details-agent-telephone-15-10': 'Agent 10 Telephone:',
            'weekly-schedule-details-agent-mobile-15-10': 'Agent 10 Mobile:',
            'weekly-schedule-details-agent-email-15-10': 'Agent 10 Email:',

            // Port 15 Agent 11
            'weekly-schedule-details-agent-name-15-11': 'Agent 11 Name:',
            'weekly-schedule-details-agent-address-15-11': 'Agent 11 Address:',
            'weekly-schedule-details-agent-pic-name-15-11': 'Agent 11 PIC Name:',
            'weekly-schedule-details-agent-telephone-15-11': 'Agent 11 Telephone:',
            'weekly-schedule-details-agent-mobile-15-11': 'Agent 11 Mobile:',
            'weekly-schedule-details-agent-email-15-11': 'Agent 11 Email:',

            // Port 15 Agent 12
            'weekly-schedule-details-agent-name-15-12': 'Agent 12 Name:',
            'weekly-schedule-details-agent-address-15-12': 'Agent 12 Address:',
            'weekly-schedule-details-agent-pic-name-15-12': 'Agent 12 PIC Name:',
            'weekly-schedule-details-agent-telephone-15-12': 'Agent 12 Telephone:',
            'weekly-schedule-details-agent-mobile-15-12': 'Agent 12 Mobile:',
            'weekly-schedule-details-agent-email-15-12': 'Agent 12 Email:',

            // Agent Details for Port 16

            // Port 16 Agent 1
            'weekly-schedule-details-agent-name-16-1': 'Agent 1 Name:',
            'weekly-schedule-details-agent-address-16-1': 'Agent 1 Address:',
            'weekly-schedule-details-agent-pic-name-16-1': 'Agent 1 PIC Name:',
            'weekly-schedule-details-agent-telephone-16-1': 'Agent 1 Telephone:',
            'weekly-schedule-details-agent-mobile-16-1': 'Agent 1 Mobile:',
            'weekly-schedule-details-agent-email-16-1': 'Agent 1 Email:',

            // Port 16 Agent 2
            'weekly-schedule-details-agent-name-16-2': 'Agent 2 Name:',
            'weekly-schedule-details-agent-address-16-2': 'Agent 2 Address:',
            'weekly-schedule-details-agent-pic-name-16-2': 'Agent 2 PIC Name:',
            'weekly-schedule-details-agent-telephone-16-2': 'Agent 2 Telephone:',
            'weekly-schedule-details-agent-mobile-16-2': 'Agent 2 Mobile:',
            'weekly-schedule-details-agent-email-16-2': 'Agent 2 Email:',

            // Port 16 Agent 3
            'weekly-schedule-details-agent-name-16-3': 'Agent 3 Name:',
            'weekly-schedule-details-agent-address-16-3': 'Agent 3 Address:',
            'weekly-schedule-details-agent-pic-name-16-3': 'Agent 3 PIC Name:',
            'weekly-schedule-details-agent-telephone-16-3': 'Agent 3 Telephone:',
            'weekly-schedule-details-agent-mobile-16-3': 'Agent 3 Mobile:',
            'weekly-schedule-details-agent-email-16-3': 'Agent 3 Email:',

            // Port 16 Agent 4
            'weekly-schedule-details-agent-name-16-4': 'Agent 4 Name:',
            'weekly-schedule-details-agent-address-16-4': 'Agent 4 Address:',
            'weekly-schedule-details-agent-pic-name-16-4': 'Agent 4 PIC Name:',
            'weekly-schedule-details-agent-telephone-16-4': 'Agent 4 Telephone:',
            'weekly-schedule-details-agent-mobile-16-4': 'Agent 4 Mobile:',
            'weekly-schedule-details-agent-email-16-4': 'Agent 4 Email:',

            // Port 16 Agent 5
            'weekly-schedule-details-agent-name-16-5': 'Agent 5 Name:',
            'weekly-schedule-details-agent-address-16-5': 'Agent 5 Address:',
            'weekly-schedule-details-agent-pic-name-16-5': 'Agent 5 PIC Name:',
            'weekly-schedule-details-agent-telephone-16-5': 'Agent 5 Telephone:',
            'weekly-schedule-details-agent-mobile-16-5': 'Agent 5 Mobile:',
            'weekly-schedule-details-agent-email-16-5': 'Agent 5 Email:',

            // Port 16 Agent 6
            'weekly-schedule-details-agent-name-16-6': 'Agent 6 Name:',
            'weekly-schedule-details-agent-address-16-6': 'Agent 6 Address:',
            'weekly-schedule-details-agent-pic-name-16-6': 'Agent 6 PIC Name:',
            'weekly-schedule-details-agent-telephone-16-6': 'Agent 6 Telephone:',
            'weekly-schedule-details-agent-mobile-16-6': 'Agent 6 Mobile:',
            'weekly-schedule-details-agent-email-16-6': 'Agent 6 Email:',

            // Port 16 Agent 7
            'weekly-schedule-details-agent-name-16-7': 'Agent 7 Name:',
            'weekly-schedule-details-agent-address-16-7': 'Agent 7 Address:',
            'weekly-schedule-details-agent-pic-name-16-7': 'Agent 7 PIC Name:',
            'weekly-schedule-details-agent-telephone-16-7': 'Agent 7 Telephone:',
            'weekly-schedule-details-agent-mobile-16-7': 'Agent 7 Mobile:',
            'weekly-schedule-details-agent-email-16-7': 'Agent 7 Email:',

            // Port 16 Agent 8
            'weekly-schedule-details-agent-name-16-8': 'Agent 8 Name:',
            'weekly-schedule-details-agent-address-16-8': 'Agent 8 Address:',
            'weekly-schedule-details-agent-pic-name-16-8': 'Agent 8 PIC Name:',
            'weekly-schedule-details-agent-telephone-16-8': 'Agent 8 Telephone:',
            'weekly-schedule-details-agent-mobile-16-8': 'Agent 8 Mobile:',
            'weekly-schedule-details-agent-email-16-8': 'Agent 8 Email:',

            // Port 16 Agent 9
            'weekly-schedule-details-agent-name-16-9': 'Agent 9 Name:',
            'weekly-schedule-details-agent-address-16-9': 'Agent 9 Address:',
            'weekly-schedule-details-agent-pic-name-16-9': 'Agent 9 PIC Name:',
            'weekly-schedule-details-agent-telephone-16-9': 'Agent 9 Telephone:',
            'weekly-schedule-details-agent-mobile-16-9': 'Agent 9 Mobile:',
            'weekly-schedule-details-agent-email-16-9': 'Agent 9 Email:',

            // Port 16 Agent 10
            'weekly-schedule-details-agent-name-16-10': 'Agent 10 Name:',
            'weekly-schedule-details-agent-address-16-10': 'Agent 10 Address:',
            'weekly-schedule-details-agent-pic-name-16-10': 'Agent 10 PIC Name:',
            'weekly-schedule-details-agent-telephone-16-10': 'Agent 10 Telephone:',
            'weekly-schedule-details-agent-mobile-16-10': 'Agent 10 Mobile:',
            'weekly-schedule-details-agent-email-16-10': 'Agent 10 Email:',

            // Port 16 Agent 11
            'weekly-schedule-details-agent-name-16-11': 'Agent 11 Name:',
            'weekly-schedule-details-agent-address-16-11': 'Agent 11 Address:',
            'weekly-schedule-details-agent-pic-name-16-11': 'Agent 11 PIC Name:',
            'weekly-schedule-details-agent-telephone-16-11': 'Agent 11 Telephone:',
            'weekly-schedule-details-agent-mobile-16-11': 'Agent 11 Mobile:',
            'weekly-schedule-details-agent-email-16-11': 'Agent 11 Email:',

            // Port 16 Agent 12
            'weekly-schedule-details-agent-name-16-12': 'Agent 12 Name:',
            'weekly-schedule-details-agent-address-16-12': 'Agent 12 Address:',
            'weekly-schedule-details-agent-pic-name-16-12': 'Agent 12 PIC Name:',
            'weekly-schedule-details-agent-telephone-16-12': 'Agent 12 Telephone:',
            'weekly-schedule-details-agent-mobile-16-12': 'Agent 12 Mobile:',
            'weekly-schedule-details-agent-email-16-12': 'Agent 12 Email:',

            // Agent Details for Port 17

            // Port 17 Agent 1
            'weekly-schedule-details-agent-name-17-1': 'Agent 1 Name:',
            'weekly-schedule-details-agent-address-17-1': 'Agent 1 Address:',
            'weekly-schedule-details-agent-pic-name-17-1': 'Agent 1 PIC Name:',
            'weekly-schedule-details-agent-telephone-17-1': 'Agent 1 Telephone:',
            'weekly-schedule-details-agent-mobile-17-1': 'Agent 1 Mobile:',
            'weekly-schedule-details-agent-email-17-1': 'Agent 1 Email:',

            // Port 17 Agent 2
            'weekly-schedule-details-agent-name-17-2': 'Agent 2 Name:',
            'weekly-schedule-details-agent-address-17-2': 'Agent 2 Address:',
            'weekly-schedule-details-agent-pic-name-17-2': 'Agent 2 PIC Name:',
            'weekly-schedule-details-agent-telephone-17-2': 'Agent 2 Telephone:',
            'weekly-schedule-details-agent-mobile-17-2': 'Agent 2 Mobile:',
            'weekly-schedule-details-agent-email-17-2': 'Agent 2 Email:',

            // Port 17 Agent 3
            'weekly-schedule-details-agent-name-17-3': 'Agent 3 Name:',
            'weekly-schedule-details-agent-address-17-3': 'Agent 3 Address:',
            'weekly-schedule-details-agent-pic-name-17-3': 'Agent 3 PIC Name:',
            'weekly-schedule-details-agent-telephone-17-3': 'Agent 3 Telephone:',
            'weekly-schedule-details-agent-mobile-17-3': 'Agent 3 Mobile:',
            'weekly-schedule-details-agent-email-17-3': 'Agent 3 Email:',

            // Port 17 Agent 4
            'weekly-schedule-details-agent-name-17-4': 'Agent 4 Name:',
            'weekly-schedule-details-agent-address-17-4': 'Agent 4 Address:',
            'weekly-schedule-details-agent-pic-name-17-4': 'Agent 4 PIC Name:',
            'weekly-schedule-details-agent-telephone-17-4': 'Agent 4 Telephone:',
            'weekly-schedule-details-agent-mobile-17-4': 'Agent 4 Mobile:',
            'weekly-schedule-details-agent-email-17-4': 'Agent 4 Email:',

            // Port 17 Agent 5
            'weekly-schedule-details-agent-name-17-5': 'Agent 5 Name:',
            'weekly-schedule-details-agent-address-17-5': 'Agent 5 Address:',
            'weekly-schedule-details-agent-pic-name-17-5': 'Agent 5 PIC Name:',
            'weekly-schedule-details-agent-telephone-17-5': 'Agent 5 Telephone:',
            'weekly-schedule-details-agent-mobile-17-5': 'Agent 5 Mobile:',
            'weekly-schedule-details-agent-email-17-5': 'Agent 5 Email:',

            // Port 17 Agent 6
            'weekly-schedule-details-agent-name-17-6': 'Agent 6 Name:',
            'weekly-schedule-details-agent-address-17-6': 'Agent 6 Address:',
            'weekly-schedule-details-agent-pic-name-17-6': 'Agent 6 PIC Name:',
            'weekly-schedule-details-agent-telephone-17-6': 'Agent 6 Telephone:',
            'weekly-schedule-details-agent-mobile-17-6': 'Agent 6 Mobile:',
            'weekly-schedule-details-agent-email-17-6': 'Agent 6 Email:',

            // Port 17 Agent 7
            'weekly-schedule-details-agent-name-17-7': 'Agent 7 Name:',
            'weekly-schedule-details-agent-address-17-7': 'Agent 7 Address:',
            'weekly-schedule-details-agent-pic-name-17-7': 'Agent 7 PIC Name:',
            'weekly-schedule-details-agent-telephone-17-7': 'Agent 7 Telephone:',
            'weekly-schedule-details-agent-mobile-17-7': 'Agent 7 Mobile:',
            'weekly-schedule-details-agent-email-17-7': 'Agent 7 Email:',

            // Port 17 Agent 8
            'weekly-schedule-details-agent-name-17-8': 'Agent 8 Name:',
            'weekly-schedule-details-agent-address-17-8': 'Agent 8 Address:',
            'weekly-schedule-details-agent-pic-name-17-8': 'Agent 8 PIC Name:',
            'weekly-schedule-details-agent-telephone-17-8': 'Agent 8 Telephone:',
            'weekly-schedule-details-agent-mobile-17-8': 'Agent 8 Mobile:',
            'weekly-schedule-details-agent-email-17-8': 'Agent 8 Email:',

            // Port 17 Agent 9
            'weekly-schedule-details-agent-name-17-9': 'Agent 9 Name:',
            'weekly-schedule-details-agent-address-17-9': 'Agent 9 Address:',
            'weekly-schedule-details-agent-pic-name-17-9': 'Agent 9 PIC Name:',
            'weekly-schedule-details-agent-telephone-17-9': 'Agent 9 Telephone:',
            'weekly-schedule-details-agent-mobile-17-9': 'Agent 9 Mobile:',
            'weekly-schedule-details-agent-email-17-9': 'Agent 9 Email:',

            // Port 17 Agent 10
            'weekly-schedule-details-agent-name-17-10': 'Agent 10 Name:',
            'weekly-schedule-details-agent-address-17-10': 'Agent 10 Address:',
            'weekly-schedule-details-agent-pic-name-17-10': 'Agent 10 PIC Name:',
            'weekly-schedule-details-agent-telephone-17-10': 'Agent 10 Telephone:',
            'weekly-schedule-details-agent-mobile-17-10': 'Agent 10 Mobile:',
            'weekly-schedule-details-agent-email-17-10': 'Agent 10 Email:',

            // Port 17 Agent 11
            'weekly-schedule-details-agent-name-17-11': 'Agent 11 Name:',
            'weekly-schedule-details-agent-address-17-11': 'Agent 11 Address:',
            'weekly-schedule-details-agent-pic-name-17-11': 'Agent 11 PIC Name:',
            'weekly-schedule-details-agent-telephone-17-11': 'Agent 11 Telephone:',
            'weekly-schedule-details-agent-mobile-17-11': 'Agent 11 Mobile:',
            'weekly-schedule-details-agent-email-17-11': 'Agent 11 Email:',

            // Port 17 Agent 12
            'weekly-schedule-details-agent-name-17-12': 'Agent 12 Name:',
            'weekly-schedule-details-agent-address-17-12': 'Agent 12 Address:',
            'weekly-schedule-details-agent-pic-name-17-12': 'Agent 12 PIC Name:',
            'weekly-schedule-details-agent-telephone-17-12': 'Agent 12 Telephone:',
            'weekly-schedule-details-agent-mobile-17-12': 'Agent 12 Mobile:',
            'weekly-schedule-details-agent-email-17-12': 'Agent 12 Email:',


            // Agent Details for Port 18

            // Port 18 Agent 1
            'weekly-schedule-details-agent-name-18-1': 'Agent 1 Name:',
            'weekly-schedule-details-agent-address-18-1': 'Agent 1 Address:',
            'weekly-schedule-details-agent-pic-name-18-1': 'Agent 1 PIC Name:',
            'weekly-schedule-details-agent-telephone-18-1': 'Agent 1 Telephone:',
            'weekly-schedule-details-agent-mobile-18-1': 'Agent 1 Mobile:',
            'weekly-schedule-details-agent-email-18-1': 'Agent 1 Email:',

            // Port 18 Agent 2
            'weekly-schedule-details-agent-name-18-2': 'Agent 2 Name:',
            'weekly-schedule-details-agent-address-18-2': 'Agent 2 Address:',
            'weekly-schedule-details-agent-pic-name-18-2': 'Agent 2 PIC Name:',
            'weekly-schedule-details-agent-telephone-18-2': 'Agent 2 Telephone:',
            'weekly-schedule-details-agent-mobile-18-2': 'Agent 2 Mobile:',
            'weekly-schedule-details-agent-email-18-2': 'Agent 2 Email:',

            // Port 18 Agent 3
            'weekly-schedule-details-agent-name-18-3': 'Agent 3 Name:',
            'weekly-schedule-details-agent-address-18-3': 'Agent 3 Address:',
            'weekly-schedule-details-agent-pic-name-18-3': 'Agent 3 PIC Name:',
            'weekly-schedule-details-agent-telephone-18-3': 'Agent 3 Telephone:',
            'weekly-schedule-details-agent-mobile-18-3': 'Agent 3 Mobile:',
            'weekly-schedule-details-agent-email-18-3': 'Agent 3 Email:',

            // Port 18 Agent 4
            'weekly-schedule-details-agent-name-18-4': 'Agent 4 Name:',
            'weekly-schedule-details-agent-address-18-4': 'Agent 4 Address:',
            'weekly-schedule-details-agent-pic-name-18-4': 'Agent 4 PIC Name:',
            'weekly-schedule-details-agent-telephone-18-4': 'Agent 4 Telephone:',
            'weekly-schedule-details-agent-mobile-18-4': 'Agent 4 Mobile:',
            'weekly-schedule-details-agent-email-18-4': 'Agent 4 Email:',

            // Port 18 Agent 5
            'weekly-schedule-details-agent-name-18-5': 'Agent 5 Name:',
            'weekly-schedule-details-agent-address-18-5': 'Agent 5 Address:',
            'weekly-schedule-details-agent-pic-name-18-5': 'Agent 5 PIC Name:',
            'weekly-schedule-details-agent-telephone-18-5': 'Agent 5 Telephone:',
            'weekly-schedule-details-agent-mobile-18-5': 'Agent 5 Mobile:',
            'weekly-schedule-details-agent-email-18-5': 'Agent 5 Email:',

            // Port 18 Agent 6
            'weekly-schedule-details-agent-name-18-6': 'Agent 6 Name:',
            'weekly-schedule-details-agent-address-18-6': 'Agent 6 Address:',
            'weekly-schedule-details-agent-pic-name-18-6': 'Agent 6 PIC Name:',
            'weekly-schedule-details-agent-telephone-18-6': 'Agent 6 Telephone:',
            'weekly-schedule-details-agent-mobile-18-6': 'Agent 6 Mobile:',
            'weekly-schedule-details-agent-email-18-6': 'Agent 6 Email:',

            // Port 18 Agent 7
            'weekly-schedule-details-agent-name-18-7': 'Agent 7 Name:',
            'weekly-schedule-details-agent-address-18-7': 'Agent 7 Address:',
            'weekly-schedule-details-agent-pic-name-18-7': 'Agent 7 PIC Name:',
            'weekly-schedule-details-agent-telephone-18-7': 'Agent 7 Telephone:',
            'weekly-schedule-details-agent-mobile-18-7': 'Agent 7 Mobile:',
            'weekly-schedule-details-agent-email-18-7': 'Agent 7 Email:',

            // Port 18 Agent 8
            'weekly-schedule-details-agent-name-18-8': 'Agent 8 Name:',
            'weekly-schedule-details-agent-address-18-8': 'Agent 8 Address:',
            'weekly-schedule-details-agent-pic-name-18-8': 'Agent 8 PIC Name:',
            'weekly-schedule-details-agent-telephone-18-8': 'Agent 8 Telephone:',
            'weekly-schedule-details-agent-mobile-18-8': 'Agent 8 Mobile:',
            'weekly-schedule-details-agent-email-18-8': 'Agent 8 Email:',

            // Port 18 Agent 9
            'weekly-schedule-details-agent-name-18-9': 'Agent 9 Name:',
            'weekly-schedule-details-agent-address-18-9': 'Agent 9 Address:',
            'weekly-schedule-details-agent-pic-name-18-9': 'Agent 9 PIC Name:',
            'weekly-schedule-details-agent-telephone-18-9': 'Agent 9 Telephone:',
            'weekly-schedule-details-agent-mobile-18-9': 'Agent 9 Mobile:',
            'weekly-schedule-details-agent-email-18-9': 'Agent 9 Email:',

            // Port 18 Agent 10
            'weekly-schedule-details-agent-name-18-10': 'Agent 10 Name:',
            'weekly-schedule-details-agent-address-18-10': 'Agent 10 Address:',
            'weekly-schedule-details-agent-pic-name-18-10': 'Agent 10 PIC Name:',
            'weekly-schedule-details-agent-telephone-18-10': 'Agent 10 Telephone:',
            'weekly-schedule-details-agent-mobile-18-10': 'Agent 10 Mobile:',
            'weekly-schedule-details-agent-email-18-10': 'Agent 10 Email:',

            // Port 18 Agent 11
            'weekly-schedule-details-agent-name-18-11': 'Agent 11 Name:',
            'weekly-schedule-details-agent-address-18-11': 'Agent 11 Address:',
            'weekly-schedule-details-agent-pic-name-18-11': 'Agent 11 PIC Name:',
            'weekly-schedule-details-agent-telephone-18-11': 'Agent 11 Telephone:',
            'weekly-schedule-details-agent-mobile-18-11': 'Agent 11 Mobile:',
            'weekly-schedule-details-agent-email-18-11': 'Agent 11 Email:',

            // Port 18 Agent 12
            'weekly-schedule-details-agent-name-18-12': 'Agent 12 Name:',
            'weekly-schedule-details-agent-address-18-12': 'Agent 12 Address:',
            'weekly-schedule-details-agent-pic-name-18-12': 'Agent 12 PIC Name:',
            'weekly-schedule-details-agent-telephone-18-12': 'Agent 12 Telephone:',
            'weekly-schedule-details-agent-mobile-18-12': 'Agent 12 Mobile:',
            'weekly-schedule-details-agent-email-18-12': 'Agent 12 Email:',

            // Agent Details for Port 19

            // Port 19 Agent 1
            'weekly-schedule-details-agent-name-19-1': 'Agent 1 Name:',
            'weekly-schedule-details-agent-address-19-1': 'Agent 1 Address:',
            'weekly-schedule-details-agent-pic-name-19-1': 'Agent 1 PIC Name:',
            'weekly-schedule-details-agent-telephone-19-1': 'Agent 1 Telephone:',
            'weekly-schedule-details-agent-mobile-19-1': 'Agent 1 Mobile:',
            'weekly-schedule-details-agent-email-19-1': 'Agent 1 Email:',

            // Port 19 Agent 2
            'weekly-schedule-details-agent-name-19-2': 'Agent 2 Name:',
            'weekly-schedule-details-agent-address-19-2': 'Agent 2 Address:',
            'weekly-schedule-details-agent-pic-name-19-2': 'Agent 2 PIC Name:',
            'weekly-schedule-details-agent-telephone-19-2': 'Agent 2 Telephone:',
            'weekly-schedule-details-agent-mobile-19-2': 'Agent 2 Mobile:',
            'weekly-schedule-details-agent-email-19-2': 'Agent 2 Email:',

            // Port 19 Agent 3
            'weekly-schedule-details-agent-name-19-3': 'Agent 3 Name:',
            'weekly-schedule-details-agent-address-19-3': 'Agent 3 Address:',
            'weekly-schedule-details-agent-pic-name-19-3': 'Agent 3 PIC Name:',
            'weekly-schedule-details-agent-telephone-19-3': 'Agent 3 Telephone:',
            'weekly-schedule-details-agent-mobile-19-3': 'Agent 3 Mobile:',
            'weekly-schedule-details-agent-email-19-3': 'Agent 3 Email:',

            // Port 19 Agent 4
            'weekly-schedule-details-agent-name-19-4': 'Agent 4 Name:',
            'weekly-schedule-details-agent-address-19-4': 'Agent 4 Address:',
            'weekly-schedule-details-agent-pic-name-19-4': 'Agent 4 PIC Name:',
            'weekly-schedule-details-agent-telephone-19-4': 'Agent 4 Telephone:',
            'weekly-schedule-details-agent-mobile-19-4': 'Agent 4 Mobile:',
            'weekly-schedule-details-agent-email-19-4': 'Agent 4 Email:',

            // Port 19 Agent 5
            'weekly-schedule-details-agent-name-19-5': 'Agent 5 Name:',
            'weekly-schedule-details-agent-address-19-5': 'Agent 5 Address:',
            'weekly-schedule-details-agent-pic-name-19-5': 'Agent 5 PIC Name:',
            'weekly-schedule-details-agent-telephone-19-5': 'Agent 5 Telephone:',
            'weekly-schedule-details-agent-mobile-19-5': 'Agent 5 Mobile:',
            'weekly-schedule-details-agent-email-19-5': 'Agent 5 Email:',

            // Port 19 Agent 6
            'weekly-schedule-details-agent-name-19-6': 'Agent 6 Name:',
            'weekly-schedule-details-agent-address-19-6': 'Agent 6 Address:',
            'weekly-schedule-details-agent-pic-name-19-6': 'Agent 6 PIC Name:',
            'weekly-schedule-details-agent-telephone-19-6': 'Agent 6 Telephone:',
            'weekly-schedule-details-agent-mobile-19-6': 'Agent 6 Mobile:',
            'weekly-schedule-details-agent-email-19-6': 'Agent 6 Email:',

            // Port 19 Agent 7
            'weekly-schedule-details-agent-name-19-7': 'Agent 7 Name:',
            'weekly-schedule-details-agent-address-19-7': 'Agent 7 Address:',
            'weekly-schedule-details-agent-pic-name-19-7': 'Agent 7 PIC Name:',
            'weekly-schedule-details-agent-telephone-19-7': 'Agent 7 Telephone:',
            'weekly-schedule-details-agent-mobile-19-7': 'Agent 7 Mobile:',
            'weekly-schedule-details-agent-email-19-7': 'Agent 7 Email:',

            // Port 19 Agent 8
            'weekly-schedule-details-agent-name-19-8': 'Agent 8 Name:',
            'weekly-schedule-details-agent-address-19-8': 'Agent 8 Address:',
            'weekly-schedule-details-agent-pic-name-19-8': 'Agent 8 PIC Name:',
            'weekly-schedule-details-agent-telephone-19-8': 'Agent 8 Telephone:',
            'weekly-schedule-details-agent-mobile-19-8': 'Agent 8 Mobile:',
            'weekly-schedule-details-agent-email-19-8': 'Agent 8 Email:',

            // Port 19 Agent 9
            'weekly-schedule-details-agent-name-19-9': 'Agent 9 Name:',
            'weekly-schedule-details-agent-address-19-9': 'Agent 9 Address:',
            'weekly-schedule-details-agent-pic-name-19-9': 'Agent 9 PIC Name:',
            'weekly-schedule-details-agent-telephone-19-9': 'Agent 9 Telephone:',
            'weekly-schedule-details-agent-mobile-19-9': 'Agent 9 Mobile:',
            'weekly-schedule-details-agent-email-19-9': 'Agent 9 Email:',

            // Port 19 Agent 10
            'weekly-schedule-details-agent-name-19-10': 'Agent 10 Name:',
            'weekly-schedule-details-agent-address-19-10': 'Agent 10 Address:',
            'weekly-schedule-details-agent-pic-name-19-10': 'Agent 10 PIC Name:',
            'weekly-schedule-details-agent-telephone-19-10': 'Agent 10 Telephone:',
            'weekly-schedule-details-agent-mobile-19-10': 'Agent 10 Mobile:',
            'weekly-schedule-details-agent-email-19-10': 'Agent 10 Email:',

            // Port 19 Agent 11
            'weekly-schedule-details-agent-name-19-11': 'Agent 11 Name:',
            'weekly-schedule-details-agent-address-19-11': 'Agent 11 Address:',
            'weekly-schedule-details-agent-pic-name-19-11': 'Agent 11 PIC Name:',
            'weekly-schedule-details-agent-telephone-19-11': 'Agent 11 Telephone:',
            'weekly-schedule-details-agent-mobile-19-11': 'Agent 11 Mobile:',
            'weekly-schedule-details-agent-email-19-11': 'Agent 11 Email:',

            // Port 19 Agent 12
            'weekly-schedule-details-agent-name-19-12': 'Agent 12 Name:',
            'weekly-schedule-details-agent-address-19-12': 'Agent 12 Address:',
            'weekly-schedule-details-agent-pic-name-19-12': 'Agent 12 PIC Name:',
            'weekly-schedule-details-agent-telephone-19-12': 'Agent 12 Telephone:',
            'weekly-schedule-details-agent-mobile-19-12': 'Agent 12 Mobile:',
            'weekly-schedule-details-agent-email-19-12': 'Agent 12 Email:',

            // Agent Details for Port 20

            // Port 20 Agent 1
            'weekly-schedule-details-agent-name-20-1': 'Agent 1 Name:',
            'weekly-schedule-details-agent-address-20-1': 'Agent 1 Address:',
            'weekly-schedule-details-agent-pic-name-20-1': 'Agent 1 PIC Name:',
            'weekly-schedule-details-agent-telephone-20-1': 'Agent 1 Telephone:',
            'weekly-schedule-details-agent-mobile-20-1': 'Agent 1 Mobile:',
            'weekly-schedule-details-agent-email-20-1': 'Agent 1 Email:',

            // Port 20 Agent 2
            'weekly-schedule-details-agent-name-20-2': 'Agent 2 Name:',
            'weekly-schedule-details-agent-address-20-2': 'Agent 2 Address:',
            'weekly-schedule-details-agent-pic-name-20-2': 'Agent 2 PIC Name:',
            'weekly-schedule-details-agent-telephone-20-2': 'Agent 2 Telephone:',
            'weekly-schedule-details-agent-mobile-20-2': 'Agent 2 Mobile:',
            'weekly-schedule-details-agent-email-20-2': 'Agent 2 Email:',

            // Port 20 Agent 3
            'weekly-schedule-details-agent-name-20-3': 'Agent 3 Name:',
            'weekly-schedule-details-agent-address-20-3': 'Agent 3 Address:',
            'weekly-schedule-details-agent-pic-name-20-3': 'Agent 3 PIC Name:',
            'weekly-schedule-details-agent-telephone-20-3': 'Agent 3 Telephone:',
            'weekly-schedule-details-agent-mobile-20-3': 'Agent 3 Mobile:',
            'weekly-schedule-details-agent-email-20-3': 'Agent 3 Email:',

            // Port 20 Agent 4
            'weekly-schedule-details-agent-name-20-4': 'Agent 4 Name:',
            'weekly-schedule-details-agent-address-20-4': 'Agent 4 Address:',
            'weekly-schedule-details-agent-pic-name-20-4': 'Agent 4 PIC Name:',
            'weekly-schedule-details-agent-telephone-20-4': 'Agent 4 Telephone:',
            'weekly-schedule-details-agent-mobile-20-4': 'Agent 4 Mobile:',
            'weekly-schedule-details-agent-email-20-4': 'Agent 4 Email:',

            // Port 20 Agent 5
            'weekly-schedule-details-agent-name-20-5': 'Agent 5 Name:',
            'weekly-schedule-details-agent-address-20-5': 'Agent 5 Address:',
            'weekly-schedule-details-agent-pic-name-20-5': 'Agent 5 PIC Name:',
            'weekly-schedule-details-agent-telephone-20-5': 'Agent 5 Telephone:',
            'weekly-schedule-details-agent-mobile-20-5': 'Agent 5 Mobile:',
            'weekly-schedule-details-agent-email-20-5': 'Agent 5 Email:',

            // Port 20 Agent 6
            'weekly-schedule-details-agent-name-20-6': 'Agent 6 Name:',
            'weekly-schedule-details-agent-address-20-6': 'Agent 6 Address:',
            'weekly-schedule-details-agent-pic-name-20-6': 'Agent 6 PIC Name:',
            'weekly-schedule-details-agent-telephone-20-6': 'Agent 6 Telephone:',
            'weekly-schedule-details-agent-mobile-20-6': 'Agent 6 Mobile:',
            'weekly-schedule-details-agent-email-20-6': 'Agent 6 Email:',

            // Port 20 Agent 7
            'weekly-schedule-details-agent-name-20-7': 'Agent 7 Name:',
            'weekly-schedule-details-agent-address-20-7': 'Agent 7 Address:',
            'weekly-schedule-details-agent-pic-name-20-7': 'Agent 7 PIC Name:',
            'weekly-schedule-details-agent-telephone-20-7': 'Agent 7 Telephone:',
            'weekly-schedule-details-agent-mobile-20-7': 'Agent 7 Mobile:',
            'weekly-schedule-details-agent-email-20-7': 'Agent 7 Email:',

            // Port 20 Agent 8
            'weekly-schedule-details-agent-name-20-8': 'Agent 8 Name:',
            'weekly-schedule-details-agent-address-20-8': 'Agent 8 Address:',
            'weekly-schedule-details-agent-pic-name-20-8': 'Agent 8 PIC Name:',
            'weekly-schedule-details-agent-telephone-20-8': 'Agent 8 Telephone:',
            'weekly-schedule-details-agent-mobile-20-8': 'Agent 8 Mobile:',
            'weekly-schedule-details-agent-email-20-8': 'Agent 8 Email:',

            // Port 20 Agent 9
            'weekly-schedule-details-agent-name-20-9': 'Agent 9 Name:',
            'weekly-schedule-details-agent-address-20-9': 'Agent 9 Address:',
            'weekly-schedule-details-agent-pic-name-20-9': 'Agent 9 PIC Name:',
            'weekly-schedule-details-agent-telephone-20-9': 'Agent 9 Telephone:',
            'weekly-schedule-details-agent-mobile-20-9': 'Agent 9 Mobile:',
            'weekly-schedule-details-agent-email-20-9': 'Agent 9 Email:',

            // Port 20 Agent 10
            'weekly-schedule-details-agent-name-20-10': 'Agent 10 Name:',
            'weekly-schedule-details-agent-address-20-10': 'Agent 10 Address:',
            'weekly-schedule-details-agent-pic-name-20-10': 'Agent 10 PIC Name:',
            'weekly-schedule-details-agent-telephone-20-10': 'Agent 10 Telephone:',
            'weekly-schedule-details-agent-mobile-20-10': 'Agent 10 Mobile:',
            'weekly-schedule-details-agent-email-20-10': 'Agent 10 Email:',

            // Port 20 Agent 11
            'weekly-schedule-details-agent-name-20-11': 'Agent 11 Name:',
            'weekly-schedule-details-agent-address-20-11': 'Agent 11 Address:',
            'weekly-schedule-details-agent-pic-name-20-11': 'Agent 11 PIC Name:',
            'weekly-schedule-details-agent-telephone-20-11': 'Agent 11 Telephone:',
            'weekly-schedule-details-agent-mobile-20-11': 'Agent 11 Mobile:',
            'weekly-schedule-details-agent-email-20-11': 'Agent 11 Email:',

            // Port 20 Agent 12
            'weekly-schedule-details-agent-name-20-12': 'Agent 12 Name:',
            'weekly-schedule-details-agent-address-20-12': 'Agent 12 Address:',
            'weekly-schedule-details-agent-pic-name-20-12': 'Agent 12 PIC Name:',
            'weekly-schedule-details-agent-telephone-20-12': 'Agent 12 Telephone:',
            'weekly-schedule-details-agent-mobile-20-12': 'Agent 12 Mobile:',
            'weekly-schedule-details-agent-email-20-12': 'Agent 12 Email:',

            // Master Name
            'weekly-master-name': 'Master Name:'
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
        } else if (adjustedReportSection === 'departure') {
            const exportDepartureType = form.querySelector(`#${adjustedReportSection}-voyage-details-departure-type`);
            exportedReportType = exportDepartureType ? exportDepartureType.options[exportDepartureType.selectedIndex].text : '';
        } else if (adjustedReportSection === 'arrival') {
            const exportArrivalType = form.querySelector(`#${adjustedReportSection}-voyage-details-arrival-type`);
            exportedReportType = exportArrivalType ? exportArrivalType.options[exportArrivalType.selectedIndex].text : '';
        }
        
        const title = `${vesselName} / ${formattedDate}${exportedReportType ? ` / ${exportedReportType}` : ''}`;
        
        data.push([title]);
        data.push([""]);

    // List of fields to insert sub-titles before section field
        const fieldsWithSubTitles = {
        
        'noonreport' : {

            // Noon Report Section Title
            'noon-voyage-details-vessel-name': 'VOYAGE DETAILS',
            'noon-details-since-last-report-cp-ordered-speed': 'DETAILS SINCE LAST REPORT',
            'noon-conditions-condition': 'NOON CONDITIONS',
            'noon-voyage-itinerary-port': 'VOYAGE ITINERARY',
            'noon-average-weather-wind-force': 'AVERAGE WEATHER',
            'noon-bad-weather-details-wind-force-since-last-report': 'BAD WEATHER DETAILS',
            'noon-wind-force-dir-for-every-six-hours-12-18-wind-force': 'WIND/FORCE FOR EVERY SIX HOURS',
            'noon-rob-details-tank-1-description': 'ROB DETAILS',
            'noon-hsfo-previous': 'HSFO (MT)',
            'noon-biofuel-previous': 'BIOFUEL (MT)',
            'noon-vlsfo-previous': 'VLSFO (MT)',
            'noon-lsmgo-previous': 'LSMGO (MT)',
            'noon-hsfo-oil-me-cyl-oil-grade': 'HSFO OIL',
            'noon-biofuel-oil-me-cyl-oil-grade': 'BIOFUEL OIL',
            'noon-vlsfo-oil-me-cyl-oil-grade': 'VLSFO OIL',
            'noon-lsmgo-oil-me-cyl-oil-grade': 'LSMGO OIL',
            'port1-agent-company-name': 'ALL KNOWN NEXT PORT AGENT DETAILS (PORT 1)',
            'port2-agent-company-name': 'ALL KNOWN NEXT PORT AGENT DETAILS (PORT 2)',
            'port3-agent-company-name': 'ALL KNOWN NEXT PORT AGENT DETAILS (PORT 3)',
            'noon-remarks': 'MASTER REMARKS',
        },


        'departurereport': {

            // Departure Report Section Title
            'departure-voyage-details-vessel-name': 'VOYAGE DETAILS',
            'departure-details-since-last-report-cp-ordered-speed' : 'DETAILS SINCE LAST REPORT',
            'departure-conditions-condition': 'DEPARTURE CONDITIONS',
            'departure-voyage-itinerary-port': 'VOYAGE ITINERARY',
            'departure-average-weather-wind-force': 'AVERAGE WEATHER',
            'departure-bad-weather-details-wind-force-since-last-report': 'BAD WEATHER DETAILS',
            'departure-wind-force-dir-for-every-six-hours-12-18-wind-force': 'WIND/FORCE FOR EVERY SIX HOURS',
            'departure-rob-details-tank-1-fuel-grade': 'ROB DETAILS',
            'departure-hsfo-previous': 'HSFO (MT)',
            'departure-biofuel-previous': 'BIOFUEL (MT)',
            'departure-vlsfo-previous': 'VLSFO (MT)',
            'departure-lsmgo-previous': 'LSMGO (MT)',
            'departure-hsfo-oil-me-cyl-oil-grade': 'HSFO OIL',
            'departure-biofuel-oil-me-cyl-oil-grade': 'BIOFUEL OIL',
            'departure-vlsfo-oil-me-cyl-oil-grade': 'VLSFO OIL',
            'departure-lsmgo-oil-me-cyl-oil-grade': 'LSMGO OIL',
            'departure-remarks': 'MASTER REMARKS',
        },

        'arrivalreport': {
            // Arrival Report Section Title
            'arrival-voyage-details-vessel-name': 'VOYAGE DETAILS',
            'arrival-voyage-details-cp-ordered-speed': 'DETAILS SINCE LAST REPORT',
            'arrival-conditions-condition': 'ARRIVAL CONDITIONS',
            'arrival-average-weather-wind-force': 'AVERAGE WEATHER',
            'arrival-bad-weather-details-wind-force-since-last-report': 'BAD WEATHER DETAILS',
            'arrival-wind-force-dir-for-every-six-hours-12-18-wind-force': 'WIND/FORCE FOR EVERY SIX HOURS',
            'arrival-rob-details-tank-1-fuel-grade': 'ROB DETAILS',
            'arrival-hsfo-previous': 'HSFO (MT)',
            'arrival-biofuel-previous': 'BIOFUEL (MT)',
            'arrival-vlsfo-previous': 'VLSFO (MT)',
            'arrival-lsmgo-previous': 'LSMGO (MT)',
            'arrival-hsfo-oil-me-cyl-oil-grade': 'HSFO OIL',
            'arrival-biofuel-oil-me-cyl-oil-grade': 'BIOFUEL OIL',
            'arrival-vlsfo-oil-me-cyl-oil-grade': 'VLSFO OIL',
            'arrival-lsmgo-oil-me-cyl-oil-grade': 'LSMGO OIL',
            'arrival-remarks': 'MASTER REMARKS',
        },

        'bunkering': {
            // Bunkering Report Section Title
            'bunkering-details-vessel-name': 'BUNKERING DETAILS',
            'bunkering-bunker-type-quantity-taken-hsfo-quantity': 'BUNKER TYPE QUANTITY TAKEN (IN MT)',
            'bunkering-associated-information-in-port-vs-off-shore-delivery': 'ASSOCIATED INFORMATION',
            'bunkering-remarks': 'MASTER REMARKS',
        },

        'allfast': {
            // All Fast Section Title
            'allfast-voyage-details-vessel-name': 'VOYAGE DETAILS',
            'allfast-rob-hsfo': 'ALL FAST ROBS'
        },

        'weeklyreport': {
            //Weekly Schedule Title
            'weekly-voyage-details-vessel-name': 'VOYAGE DETAILS',
            'weekly-schedule-details-port-1': 'Port Details',
            'weekly-schedule-details-agent-name-1': 'Agent Details',
            'weekly-schedule-details-agent-name-2-1': 'Agent Details',
            'weekly-schedule-details-agent-name-3-1': 'Agent Details',
            'weekly-schedule-details-agent-name-4-1': 'Agent Details',
            'weekly-schedule-details-agent-name-5-1': 'Agent Details',
            'weekly-schedule-details-agent-name-6-1': 'Agent Details',
            'weekly-schedule-details-agent-name-7-1': 'Agent Details',
            'weekly-schedule-details-agent-name-8-1': 'Agent Details',
            'weekly-schedule-details-agent-name-9-1': 'Agent Details',
            'weekly-schedule-details-agent-name-10-1': 'Agent Details',
            'weekly-schedule-details-agent-name-11-1': 'Agent Details',
            'weekly-schedule-details-agent-name-12-1': 'Agent Details',
            'weekly-schedule-details-agent-name-13-1': 'Agent Details',
            'weekly-schedule-details-agent-name-14-1': 'Agent Details',
            'weekly-schedule-details-agent-name-15-1': 'Agent Details',
            'weekly-schedule-details-agent-name-16-1': 'Agent Details',
            'weekly-schedule-details-agent-name-17-1': 'Agent Details',
            'weekly-schedule-details-agent-name-18-1': 'Agent Details',
            'weekly-schedule-details-agent-name-19-1': 'Agent Details',
            'weekly-schedule-details-agent-name-20-1': 'Agent Details',
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
            'noon-wind-force-dir-for-every-six-hours-00-06-sea-ds',
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
            'noon-hsfo-oil-ae-cc-oil-cons',
            'noon-biofuel-oil-ae-cc-oil-cons',
            'noon-vlsfo-oil-ae-cc-oil-cons',
            'noon-lsmgo-oil-ae-cc-oil-cons',
            'noon-hsfo-oil-ae3-cc-oil-cons',
            'noon-biofuel-oil-ae3-cc-oil-cons',
            'noon-vlsfo-oil-ae3-cc-oil-cons',
            'noon-lsmgo-oil-ae3-cc-oil-cons',
            'port1-agent-email',
            'port2-agent-email',
            'port3-agent-email'
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
            'departure-wind-force-dir-for-every-six-hours-00-06-sea-ds',
            'departure-wind-force-dir-for-every-six-hours-06-12-sea-ds',
            'departure-rob-details-tank-13-date-time',
            'departure-hsfo-total-cons',
            'departure-biofuel-total-cons',
            'departure-vlsfo-total-cons',
            'departure-lsmgo-total-cons',
            'departure-hsfo-oil-ae-cc-oil-cons',
            'departure-biofuel-oil-ae-cc-oil-cons',
            'departure-vlsfo-oil-ae-cc-oil-cons',
            'departure-lsmgo-oil-ae-cc-oil-cons',
            'departure-hsfo-oil-ae3-cc-oil-cons',
            'departure-biofuel-oil-ae3-cc-oil-cons',
            'departure-vlsfo-oil-ae3-cc-oil-cons',
            'departure-lsmgo-oil-ae3-cc-oil-cons'
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
            'arrival-wind-force-dir-for-every-six-hours-00-06-sea-ds',
            'arrival-wind-force-dir-for-every-six-hours-06-12-sea-ds',
            'arrival-rob-details-tank-13-date-time',
            'arrival-hsfo-total-cons',
            'arrival-biofuel-total-cons',
            'arrival-vlsfo-total-cons',
            'arrival-lsmgo-total-cons',
            'arrival-hsfo-oil-ae-cc-oil-cons',
            'arrival-biofuel-oil-ae-cc-oil-cons',
            'arrival-vlsfo-oil-ae-cc-oil-cons',
            'arrival-lsmgo-oil-ae-cc-oil-cons',
            'arrival-hsfo-oil-ae3-cc-oil-cons',
            'arrival-biofuel-oil-ae3-cc-oil-cons',
            'arrival-vlsfo-oil-ae3-cc-oil-cons',
            'arrival-lsmgo-oil-ae3-cc-oil-cons'
        ],

        'bunkering': [
            // Bunkering Report Section Title
            'bunkering-details-bunker-gmt-offset',
            'bunkering-bunker-type-quantity-taken-lsmgo-viscosity',
            'bunkering-associated-information-pumping-completed-gmt-offset'
        ],

        'allfast': [
            // All Fast Section Title
            'allfast-voyage-details-port',
            'allfast-rob-lsmgo'
        ],
        
        'weeklyreport': [
            // Weekly Schedule Title
            'weekly-voyage-details-date-time',

            // Port Details
            'weekly-schedule-details-remarks-port-1',
            'weekly-schedule-details-remarks-port-2-1',
            'weekly-schedule-details-remarks-port-3-1',
            'weekly-schedule-details-remarks-port-4-1',
            'weekly-schedule-details-remarks-port-5-1',
            'weekly-schedule-details-remarks-port-6-1',
            'weekly-schedule-details-remarks-port-7-1',
            'weekly-schedule-details-remarks-port-8-1',
            'weekly-schedule-details-remarks-port-9-1',
            'weekly-schedule-details-remarks-port-10-1',
            'weekly-schedule-details-remarks-port-11-1',
            'weekly-schedule-details-remarks-port-12-1',
            'weekly-schedule-details-remarks-port-13-1',
            'weekly-schedule-details-remarks-port-14-1',
            'weekly-schedule-details-remarks-port-15-1',
            'weekly-schedule-details-remarks-port-16-1',
            'weekly-schedule-details-remarks-port-17-1',
            'weekly-schedule-details-remarks-port-18-1',
            'weekly-schedule-details-remarks-port-19-1',
            'weekly-schedule-details-remarks-port-20-1',

            // Agent Details

            'weekly-schedule-details-agent-email-1',
            'weekly-schedule-details-agent-email-2',
            'weekly-schedule-details-agent-email-3',
            'weekly-schedule-details-agent-email-4',
            'weekly-schedule-details-agent-email-5',
            'weekly-schedule-details-agent-email-6',
            'weekly-schedule-details-agent-email-7',
            'weekly-schedule-details-agent-email-8',
            'weekly-schedule-details-agent-email-9',
            'weekly-schedule-details-agent-email-10',
            'weekly-schedule-details-agent-email-11',
            'weekly-schedule-details-agent-email-12',

            'weekly-schedule-details-agent-email-2-1',
            'weekly-schedule-details-agent-email-2-2',
            'weekly-schedule-details-agent-email-2-3',
            'weekly-schedule-details-agent-email-2-4',
            'weekly-schedule-details-agent-email-2-5',
            'weekly-schedule-details-agent-email-2-6',
            'weekly-schedule-details-agent-email-2-7',
            'weekly-schedule-details-agent-email-2-8',
            'weekly-schedule-details-agent-email-2-9',
            'weekly-schedule-details-agent-email-2-10',
            'weekly-schedule-details-agent-email-2-11',
            'weekly-schedule-details-agent-email-2-12',

            'weekly-schedule-details-agent-email-3-1',
            'weekly-schedule-details-agent-email-3-2',
            'weekly-schedule-details-agent-email-3-3',
            'weekly-schedule-details-agent-email-3-4',
            'weekly-schedule-details-agent-email-3-5',
            'weekly-schedule-details-agent-email-3-6',
            'weekly-schedule-details-agent-email-3-7',
            'weekly-schedule-details-agent-email-3-8',
            'weekly-schedule-details-agent-email-3-9',
            'weekly-schedule-details-agent-email-3-10',
            'weekly-schedule-details-agent-email-3-11',
            'weekly-schedule-details-agent-email-3-12',

            'weekly-schedule-details-agent-email-4-1',
            'weekly-schedule-details-agent-email-4-2',
            'weekly-schedule-details-agent-email-4-3',
            'weekly-schedule-details-agent-email-4-4',
            'weekly-schedule-details-agent-email-4-5',
            'weekly-schedule-details-agent-email-4-6',
            'weekly-schedule-details-agent-email-4-7',
            'weekly-schedule-details-agent-email-4-8',
            'weekly-schedule-details-agent-email-4-9',
            'weekly-schedule-details-agent-email-4-10',
            'weekly-schedule-details-agent-email-4-11',
            'weekly-schedule-details-agent-email-4-12',

            'weekly-schedule-details-agent-email-5-1',
            'weekly-schedule-details-agent-email-5-2',
            'weekly-schedule-details-agent-email-5-3',
            'weekly-schedule-details-agent-email-5-4',
            'weekly-schedule-details-agent-email-5-5',
            'weekly-schedule-details-agent-email-5-6',
            'weekly-schedule-details-agent-email-5-7',
            'weekly-schedule-details-agent-email-5-8',
            'weekly-schedule-details-agent-email-5-9',
            'weekly-schedule-details-agent-email-5-10',
            'weekly-schedule-details-agent-email-5-11',
            'weekly-schedule-details-agent-email-5-12',

            'weekly-schedule-details-agent-email-6-1',
            'weekly-schedule-details-agent-email-6-2',
            'weekly-schedule-details-agent-email-6-3',
            'weekly-schedule-details-agent-email-6-4',
            'weekly-schedule-details-agent-email-6-5',
            'weekly-schedule-details-agent-email-6-6',
            'weekly-schedule-details-agent-email-6-7',
            'weekly-schedule-details-agent-email-6-8',
            'weekly-schedule-details-agent-email-6-9',
            'weekly-schedule-details-agent-email-6-10',
            'weekly-schedule-details-agent-email-6-11',
            'weekly-schedule-details-agent-email-6-12',

            'weekly-schedule-details-agent-email-7-1',
            'weekly-schedule-details-agent-email-7-2',
            'weekly-schedule-details-agent-email-7-3',
            'weekly-schedule-details-agent-email-7-4',
            'weekly-schedule-details-agent-email-7-5',
            'weekly-schedule-details-agent-email-7-6',
            'weekly-schedule-details-agent-email-7-7',
            'weekly-schedule-details-agent-email-7-8',
            'weekly-schedule-details-agent-email-7-9',
            'weekly-schedule-details-agent-email-7-10',
            'weekly-schedule-details-agent-email-7-11',
            'weekly-schedule-details-agent-email-7-12',

            'weekly-schedule-details-agent-email-8-1',
            'weekly-schedule-details-agent-email-8-2',
            'weekly-schedule-details-agent-email-8-3',
            'weekly-schedule-details-agent-email-8-4',
            'weekly-schedule-details-agent-email-8-5',
            'weekly-schedule-details-agent-email-8-6',
            'weekly-schedule-details-agent-email-8-7',
            'weekly-schedule-details-agent-email-8-8',
            'weekly-schedule-details-agent-email-8-9',
            'weekly-schedule-details-agent-email-8-10',
            'weekly-schedule-details-agent-email-8-11',
            'weekly-schedule-details-agent-email-8-12',

            'weekly-schedule-details-agent-email-9-1',
            'weekly-schedule-details-agent-email-9-2',
            'weekly-schedule-details-agent-email-9-3',
            'weekly-schedule-details-agent-email-9-4',
            'weekly-schedule-details-agent-email-9-5',
            'weekly-schedule-details-agent-email-9-6',
            'weekly-schedule-details-agent-email-9-7',
            'weekly-schedule-details-agent-email-9-8',
            'weekly-schedule-details-agent-email-9-9',
            'weekly-schedule-details-agent-email-9-10',
            'weekly-schedule-details-agent-email-9-11',
            'weekly-schedule-details-agent-email-9-12',

            'weekly-schedule-details-agent-email-10-1',
            'weekly-schedule-details-agent-email-10-2',
            'weekly-schedule-details-agent-email-10-3',
            'weekly-schedule-details-agent-email-10-4',
            'weekly-schedule-details-agent-email-10-5',
            'weekly-schedule-details-agent-email-10-6',
            'weekly-schedule-details-agent-email-10-7',
            'weekly-schedule-details-agent-email-10-8',
            'weekly-schedule-details-agent-email-10-9',
            'weekly-schedule-details-agent-email-10-10',
            'weekly-schedule-details-agent-email-10-11',
            'weekly-schedule-details-agent-email-10-12',

            'weekly-schedule-details-agent-email-11-1',
            'weekly-schedule-details-agent-email-11-2',
            'weekly-schedule-details-agent-email-11-3',
            'weekly-schedule-details-agent-email-11-4',
            'weekly-schedule-details-agent-email-11-5',
            'weekly-schedule-details-agent-email-11-6',
            'weekly-schedule-details-agent-email-11-7',
            'weekly-schedule-details-agent-email-11-8',
            'weekly-schedule-details-agent-email-11-9',
            'weekly-schedule-details-agent-email-11-10',
            'weekly-schedule-details-agent-email-11-11',
            'weekly-schedule-details-agent-email-11-12',

            'weekly-schedule-details-agent-email-12-1',
            'weekly-schedule-details-agent-email-12-2',
            'weekly-schedule-details-agent-email-12-3',
            'weekly-schedule-details-agent-email-12-4',
            'weekly-schedule-details-agent-email-12-5',
            'weekly-schedule-details-agent-email-12-6',
            'weekly-schedule-details-agent-email-12-7',
            'weekly-schedule-details-agent-email-12-8',
            'weekly-schedule-details-agent-email-12-9',
            'weekly-schedule-details-agent-email-12-10',
            'weekly-schedule-details-agent-email-12-11',
            'weekly-schedule-details-agent-email-12-12',

            'weekly-schedule-details-agent-email-13-1',
            'weekly-schedule-details-agent-email-13-2',
            'weekly-schedule-details-agent-email-13-3',
            'weekly-schedule-details-agent-email-13-4',
            'weekly-schedule-details-agent-email-13-5',
            'weekly-schedule-details-agent-email-13-6',
            'weekly-schedule-details-agent-email-13-7',
            'weekly-schedule-details-agent-email-13-8',
            'weekly-schedule-details-agent-email-13-9',
            'weekly-schedule-details-agent-email-13-10',
            'weekly-schedule-details-agent-email-13-11',
            'weekly-schedule-details-agent-email-13-12',

            'weekly-schedule-details-agent-email-14-1',
            'weekly-schedule-details-agent-email-14-2',
            'weekly-schedule-details-agent-email-14-3',
            'weekly-schedule-details-agent-email-14-4',
            'weekly-schedule-details-agent-email-14-5',
            'weekly-schedule-details-agent-email-14-6',
            'weekly-schedule-details-agent-email-14-7',
            'weekly-schedule-details-agent-email-14-8',
            'weekly-schedule-details-agent-email-14-9',
            'weekly-schedule-details-agent-email-14-10',
            'weekly-schedule-details-agent-email-14-11',
            'weekly-schedule-details-agent-email-14-12',

            'weekly-schedule-details-agent-email-15-1',
            'weekly-schedule-details-agent-email-15-2',
            'weekly-schedule-details-agent-email-15-3',
            'weekly-schedule-details-agent-email-15-4',
            'weekly-schedule-details-agent-email-15-5',
            'weekly-schedule-details-agent-email-15-6',
            'weekly-schedule-details-agent-email-15-7',
            'weekly-schedule-details-agent-email-15-8',
            'weekly-schedule-details-agent-email-15-9',
            'weekly-schedule-details-agent-email-15-10',
            'weekly-schedule-details-agent-email-15-11',
            'weekly-schedule-details-agent-email-15-12',

            'weekly-schedule-details-agent-email-16-1',
            'weekly-schedule-details-agent-email-16-2',
            'weekly-schedule-details-agent-email-16-3',
            'weekly-schedule-details-agent-email-16-4',
            'weekly-schedule-details-agent-email-16-5',
            'weekly-schedule-details-agent-email-16-6',
            'weekly-schedule-details-agent-email-16-7',
            'weekly-schedule-details-agent-email-16-8',
            'weekly-schedule-details-agent-email-16-9',
            'weekly-schedule-details-agent-email-16-10',
            'weekly-schedule-details-agent-email-16-11',
            'weekly-schedule-details-agent-email-16-12',

            'weekly-schedule-details-agent-email-17-1',
            'weekly-schedule-details-agent-email-17-2',
            'weekly-schedule-details-agent-email-17-3',
            'weekly-schedule-details-agent-email-17-4',
            'weekly-schedule-details-agent-email-17-5',
            'weekly-schedule-details-agent-email-17-6',
            'weekly-schedule-details-agent-email-17-7',
            'weekly-schedule-details-agent-email-17-8',
            'weekly-schedule-details-agent-email-17-9',
            'weekly-schedule-details-agent-email-17-10',
            'weekly-schedule-details-agent-email-17-11',
            'weekly-schedule-details-agent-email-17-12',

            'weekly-schedule-details-agent-email-18-1',
            'weekly-schedule-details-agent-email-18-2',
            'weekly-schedule-details-agent-email-18-3',
            'weekly-schedule-details-agent-email-18-4',
            'weekly-schedule-details-agent-email-18-5',
            'weekly-schedule-details-agent-email-18-6',
            'weekly-schedule-details-agent-email-18-7',
            'weekly-schedule-details-agent-email-18-8',
            'weekly-schedule-details-agent-email-18-9',
            'weekly-schedule-details-agent-email-18-10',
            'weekly-schedule-details-agent-email-18-11',
            'weekly-schedule-details-agent-email-18-12',

            'weekly-schedule-details-agent-email-19-1',
            'weekly-schedule-details-agent-email-19-2',
            'weekly-schedule-details-agent-email-19-3',
            'weekly-schedule-details-agent-email-19-4',
            'weekly-schedule-details-agent-email-19-5',
            'weekly-schedule-details-agent-email-19-6',
            'weekly-schedule-details-agent-email-19-7',
            'weekly-schedule-details-agent-email-19-8',
            'weekly-schedule-details-agent-email-19-9',
            'weekly-schedule-details-agent-email-19-10',
            'weekly-schedule-details-agent-email-19-11',
            'weekly-schedule-details-agent-email-19-12',

            'weekly-schedule-details-agent-email-20-1',
            'weekly-schedule-details-agent-email-20-2',
            'weekly-schedule-details-agent-email-20-3',
            'weekly-schedule-details-agent-email-20-4',
            'weekly-schedule-details-agent-email-20-5',
            'weekly-schedule-details-agent-email-20-6',
            'weekly-schedule-details-agent-email-20-7',
            'weekly-schedule-details-agent-email-20-8',
            'weekly-schedule-details-agent-email-20-9',
            'weekly-schedule-details-agent-email-20-10',
            'weekly-schedule-details-agent-email-20-11',
            'weekly-schedule-details-agent-email-20-12'

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

    let currentSection = null; // To track subtitles
    let rowData = []; // To collect rows
    let spacingRow = ['', '', '', '']; // To add a blank row between sections if needed

    formData.forEach((value, key) => {
        if (fieldLabels[reportId] && fieldLabels[reportId][key]) {
            let label = fieldLabels[reportId][key];

            // Check if a new section/subtitle needs to be inserted
            if (currentFieldSubTitles[key] && currentSection !== currentFieldSubTitles[key]) {
                currentSection = currentFieldSubTitles[key];
                // Add subtitle as a full-width row (using all 4 columns for now)
                data.push([currentSection, '', '', '']);
                data.push(spacingRow); // Add a blank row for spacing
            }

            // Add the label and value in a row
            rowData.push(`${label}: ${value}`);

            // Add spacing if needed
            if (currentFieldsWithBlanks[key]) {
                rowData.push(''); // Insert blank space for the field
            }

            // After every 4 columns, push the row data to data array and reset
            if (rowData.length === 4) {
                data.push(rowData);
                rowData = [];
            }
        }
    });

    // If there's leftover data in the row (less than 4 columns), push it
    if (rowData.length > 0) {
        data.push(rowData);
    }

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "FormData");

    // Set column widths
    const wscols = [
        { wch: 45 }, // Field column width
        { wch: 30 }  // Value column width
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
            : '';
    } else if (adjustedReportSection === 'departure') {
        const filenameExportDepartureType = form.querySelector(`#${adjustedReportSection}-voyage-details-departure-type`);
        filenameReportType = filenameExportDepartureType ? 
            (filenameExportDepartureType.selectedIndex !== -1 ? filenameExportDepartureType.options[filenameExportDepartureType.selectedIndex].text : '') 
            : '';
    } else if (adjustedReportSection === 'arrival') {
        const filenameExportArrivalType = form.querySelector(`#${adjustedReportSection}-voyage-details-arrival-type`);
        filenameReportType = filenameExportArrivalType ? 
            (filenameExportArrivalType.selectedIndex !== -1 ? filenameExportArrivalType.options[filenameExportArrivalType.selectedIndex].text : '') 
            : '';
    }
    

    const filenameDate = new Date();
    const filenameFormattedDate = filenameDate.toISOString().slice(0, 10).replace(/-/g, '');

    const filename = `${filenameVesselName}-${reportId}-${filenameFormattedDate}${filenameReportType ? `-${filenameReportType}` : ''}.xlsx`;


    XLSX.writeFile(workbook, filename);

    // Clear the form fields after exporting the data
    clearFormFields(reportId);    

    // Clear saved local storage
    localStorage.clear();

    disabledFields.forEach((field) => {
        field.disabled = true;
    });

    // After exporting the data, clear all table sets
    clearAllTableSets(30);

    removeNewRowsAllFast();

    removeNewRowsWeeklyReportAgent();

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
                            <div id="${newResultFieldId}" class="weekly-port-search-results"></div>
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
                    <tr>
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
}

function removeTableSet(setNumber) {
    const tableSet = document.getElementById(`tableSet-${setNumber}`);
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
        //alert(`Draft for ${reportId} restored!`);
    }
}

// Restore all drafts
function restoreAllDrafts() {
    const reportIds = ['NoonReport', 'DepartureReport', 'ArrivalReport', 'Bunkering', 'AllFast', 'WeeklyReport'];
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



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

    // Add the port search functionality for Crew Monitoring Plan Report fields
    setupPortSearch('crew-monitoring-plan-port-1', 'crew-monitoring-plan-port-results-1');

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
            'noon-voyage-details-port': 'Port of Departure:',

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
            'noon-conditions-deadweight': 'Cargo Name:',
            'noon-conditions-cargo-weight': 'Cargo Weight (MT):',
            'noon-conditions-ballast-weight': 'Ballast Weight (MT):',
            'noon-conditions-fresh-water': 'Fresh Water (MT):',
            'noon-conditions-fwd-draft': 'Fwd Draft (m):',
            'noon-conditions-aft-draft': 'Aft Draft (m):',
            'noon-conditions-gm': 'GM:',

            // Noon Voyage Itinerary	
            'noon-voyage-itinerary-port': 'Next Port:',
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

            'noon-hsfo-oil-me-cc-oil-quantity': 'ME CC Oil Quantity:',
            'noon-hsfo-oil-me-cc-total-run-hrs': 'ME CC Total Running Hours:',
            'noon-hsfo-oil-me-cc-oil-cons': 'ME CC Oil Consumption:',

            'noon-hsfo-oil-ae-cc-oil-quantity': 'AE CC Oil Quantity:',
            'noon-hsfo-oil-ae-cc-total-run-hrs': 'AE CC Total Running Hours:',
            'noon-hsfo-oil-ae-cc-oil-cons': 'AE CC Oil Consumption:',

            
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

            'noon-biofuel-oil-me-cc-oil-quantity': 'ME CC Oil Quantity:',
            'noon-biofuel-oil-me-cc-total-run-hrs': 'ME CC Total Running Hours:',
            'noon-biofuel-oil-me-cc-oil-cons': 'ME CC Oil Consumption:',

            'noon-biofuel-oil-ae-cc-oil-quantity': 'AE CC Oil Quantity:',
            'noon-biofuel-oil-ae-cc-total-run-hrs': 'AE CC Total Running Hours:',
            'noon-biofuel-oil-ae-cc-oil-cons': 'AE CC Oil Consumption:',

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

            'noon-vlsfo-oil-me-cc-oil-quantity': 'ME CC Oil Quantity:',
            'noon-vlsfo-oil-me-cc-total-run-hrs': 'ME CC Total Running Hours:',
            'noon-vlsfo-oil-me-cc-oil-cons': 'ME CC Oil Consumption:',

            'noon-vlsfo-oil-ae-cc-oil-quantity': 'AE CC Oil Quantity:',
            'noon-vlsfo-oil-ae-cc-total-run-hrs': 'AE CC Total Running Hours:',
            'noon-vlsfo-oil-ae-cc-oil-cons': 'AE CC Oil Consumption:',

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
            
            'noon-lsmgo-oil-me-cc-oil-quantity': 'ME CC Oil Quantity:',
            'noon-lsmgo-oil-me-cc-total-run-hrs': 'ME CC Total Running Hours:',
            'noon-lsmgo-oil-me-cc-oil-cons': 'ME CC Oil Consumption:',

            'noon-lsmgo-oil-ae-cc-oil-quantity': 'AE CC Oil Quantity:',
            'noon-lsmgo-oil-ae-cc-total-run-hrs': 'AE CC Total Running Hours:',
            'noon-lsmgo-oil-ae-cc-oil-cons': 'AE CC Oil Consumption:',

            // //Arrival Known Next Port Agent Details Port 1
            // 'port1-agent-company-name': 'port1-agent-company-name',
            // 'port1-agent-address': 'port1-agent-address',
            // 'port1-agent-pic-name': 'port1-agent-pic-name',
            // 'port1-agent-telephone': 'port1-agent-telephone',
            // 'port1-agent-mobile': 'port1-agent-mobile',
            // 'port1-agent-email': 'port1-agent-email',

            // //Arrival Known Next Port Agent Details Port 2
            // 'port2-agent-company-name': 'port2-agent-company-name',
            // 'port2-agent-address': 'port2-agent-address',
            // 'port2-agent-pic-name': 'port2-agent-pic-name',
            // 'port2-agent-telephone': 'port2-agent-telephone',
            // 'port2-agent-mobile': 'port2-agent-mobile',
            // 'port2-agent-email': 'port2-agent-email',

            // //Arrival Known Next Port Agent Details Port 2
            // 'port3-agent-company-name': 'port3-agent-company-name',
            // 'port3-agent-address': 'port3-agent-address',
            // 'port3-agent-pic-name': 'port3-agent-pic-name',
            // 'port3-agent-telephone': 'port3-agent-telephone',
            // 'port3-agent-mobile': 'port3-agent-mobile',
            // 'port3-agent-email': 'port3-agent-email',

            // Diesel Engine
            'diesel-engine-dg1-run-hours': 'DG1 Run Hours:',
            'diesel-engine-dg2-run-hours': 'DG2 Run Hours:',
            'diesel-engine-dg3-run-hours': 'DG3 Run Hours:',

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

            // // Departure Wind Force/Dir for every six hours
            // // Departure 12:00 - 18:00
            // 'departure-wind-force-dir-for-every-six-hours-12-18-wind-force': 'Wind Force (Bft.) (12:00 - 18:00):',
            // 'departure-wind-force-dir-for-every-six-hours-12-18-wind-direction': 'Wind Direction (T) (12:00 - 18:00):',
            // 'departure-wind-force-dir-for-every-six-hours-12-18-swell-height': 'Swell Height (m) (12:00 - 18:00):',
            // 'departure-wind-force-dir-for-every-six-hours-12-18-swell-direction': 'Swell Direction (T) (12:00 - 18:00):',
            // 'departure-wind-force-dir-for-every-six-hours-12-18-wind-sea-height': 'Wind Sea Height (m) (12:00 - 18:00):',
            // 'departure-wind-force-dir-for-every-six-hours-12-18-sea-direction': 'Sea Direction (T) (12:00 - 18:00):',
            // 'departure-wind-force-dir-for-every-six-hours-12-18-sea-ds': 'Sea DS (12:00 - 18:00):',

            // // Departure 18:00 - 00:00
            // 'departure-wind-force-dir-for-every-six-hours-18-00-wind-force': 'Wind Force (Bft.) (18:00 - 00:00):',
            // 'departure-wind-force-dir-for-every-six-hours-18-00-wind-direction': 'Wind Direction (T) (18:00 - 00:00):',
            // 'departure-wind-force-dir-for-every-six-hours-18-00-swell-height': 'Swell Height (m) (18:00 - 00:00):',
            // 'departure-wind-force-dir-for-every-six-hours-18-00-swell-direction': 'Swell Direction (T) (18:00 - 00:00):',
            // 'departure-wind-force-dir-for-every-six-hours-18-00-wind-sea-height': 'Wind Sea Height (m) (18:00 - 00:00):',
            // 'departure-wind-force-dir-for-every-six-hours-18-00-sea-direction': 'Sea Direction (T) (18:00 - 00:00):',
            // 'departure-wind-force-dir-for-every-six-hours-18-00-sea-ds': 'Sea DS (18:00 - 00:00):',

            // // Departure 00:00 - 06:00	
            // 'departure-wind-force-dir-for-every-six-hours-00-06-wind-force': 'Wind Force (Bft.) (00:00 - 06:00):',
            // 'departure-wind-force-dir-for-every-six-hours-00-06-wind-direction': 'Wind Direction (T) (00:00 - 06:00):',
            // 'departure-wind-force-dir-for-every-six-hours-00-06-swell-height': 'Swell Height (m) (00:00 - 06:00):',
            // 'departure-wind-force-dir-for-every-six-hours-00-06-swell-direction': 'Swell Direction (T) (00:00 - 06:00):',
            // 'departure-wind-force-dir-for-every-six-hours-00-06-wind-sea-height': 'Wind Sea Height (m) (00:00 - 06:00):',
            // 'departure-wind-force-dir-for-every-six-hours-00-06-sea-direction': 'Sea Direction (T) (00:00 - 06:00):',
            // 'departure-wind-force-dir-for-every-six-hours-00-06-sea-ds': 'Sea DS (00:00 - 06:00):',

            // // Departure 06:00 - 12:00
            // 'departure-wind-force-dir-for-every-six-hours-06-12-wind-force': 'Wind Force (Bft.) (06:00 - 12:00):',
            // 'departure-wind-force-dir-for-every-six-hours-06-12-wind-direction': 'Wind Direction (T) (06:00 - 12:00):',
            // 'departure-wind-force-dir-for-every-six-hours-06-12-swell-height': 'Swell Height (m) (06:00 - 12:00):',
            // 'departure-wind-force-dir-for-every-six-hours-06-12-swell-direction': 'Swell Direction (T) (06:00 - 12:00):',
            // 'departure-wind-force-dir-for-every-six-hours-06-12-wind-sea-height': 'Wind Sea Height (m) (06:00 - 12:00):',
            // 'departure-wind-force-dir-for-every-six-hours-06-12-sea-direction': 'Sea Direction (T) (06:00 - 12:00):',
            // 'departure-wind-force-dir-for-every-six-hours-06-12-sea-ds': 'Sea DS (06:00 - 12:00):',

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

            'departure-hsfo-oil-me-cc-oil-quantity': 'ME CC Oil Quantity:',
            'departure-hsfo-oil-me-cc-total-run-hrs': 'ME CC Total Running Hours:',
            'departure-hsfo-oil-me-cc-oil-cons': 'ME CC Oil Consumption:',

            'departure-hsfo-oil-ae-cc-oil-quantity': 'AE CC Oil Quantity:',
            'departure-hsfo-oil-ae-cc-total-run-hrs': 'AE CC Total Running Hours:',
            'departure-hsfo-oil-ae-cc-oil-cons': 'AE CC Oil Consumption:',
            
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

            'departure-biofuel-oil-me-cc-oil-quantity': 'ME CC Oil Quantity:',
            'departure-biofuel-oil-me-cc-total-run-hrs': 'ME CC Total Running Hours:',
            'departure-biofuel-oil-me-cc-oil-cons': 'ME CC Oil Consumption:',
            
            'departure-biofuel-oil-ae-cc-oil-quantity': 'AE CC Oil Quantity:',
            'departure-biofuel-oil-ae-cc-total-run-hrs': 'AE CC Total Running Hours:',
            'departure-biofuel-oil-ae-cc-oil-cons': 'AE CC Oil Consumption:',

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

            'departure-vlsfo-oil-me-cc-oil-quantity': 'ME CC Oil Quantity:',
            'departure-vlsfo-oil-me-cc-total-run-hrs': 'ME CC Total Running Hours:',
            'departure-vlsfo-oil-me-cc-oil-cons': 'ME CC Oil Consumption:',

            'departure-vlsfo-oil-ae-cc-oil-quantity': 'AE CC Oil Quantity:',
            'departure-vlsfo-oil-ae-cc-total-run-hrs': 'AE CC Total Running Hours:',
            'departure-vlsfo-oil-ae-cc-oil-cons': 'AE CC Oil Consumption:',

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

            'departure-lsmgo-oil-me-cc-oil-quantity': 'ME CC Oil Quantity:',
            'departure-lsmgo-oil-me-cc-total-run-hrs': 'ME CC Total Running Hours:',
            'departure-lsmgo-oil-me-cc-oil-cons': 'ME CC Oil Consumption:',

            'departure-lsmgo-oil-ae-cc-oil-quantity': 'AE CC Oil Quantity:',
            'departure-lsmgo-oil-ae-cc-total-run-hrs': 'AE CC Total Running Hours:',
            'departure-lsmgo-oil-ae-cc-oil-cons': 'AE CC Oil Consumption:',

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

            // // Arrival Wind Force/Dir for every six hours
            // // Arrival 12:00 - 18:00
            // 'arrival-wind-force-dir-for-every-six-hours-12-18-wind-force': 'Wind Force (Bft.) (12:00 - 18:00):',
            // 'arrival-wind-force-dir-for-every-six-hours-12-18-wind-direction': 'Wind Direction (T) (12:00 - 18:00):',
            // 'arrival-wind-force-dir-for-every-six-hours-12-18-swell-height': 'Swell Height (m) (12:00 - 18:00):',
            // 'arrival-wind-force-dir-for-every-six-hours-12-18-swell-direction': 'Swell Direction (T) (12:00 - 18:00):',
            // 'arrival-wind-force-dir-for-every-six-hours-12-18-wind-sea-height': 'Wind Sea Height (m) (12:00 - 18:00):',
            // 'arrival-wind-force-dir-for-every-six-hours-12-18-sea-direction': 'Sea Direction (T) (12:00 - 18:00):',
            // 'arrival-wind-force-dir-for-every-six-hours-12-18-sea-ds': 'Sea DS (12:00 - 18:00):',

            // // Arrival 18:00 - 00:00
            // 'arrival-wind-force-dir-for-every-six-hours-18-00-wind-force': 'Wind Force (Bft.) (18:00 - 00:00):',
            // 'arrival-wind-force-dir-for-every-six-hours-18-00-wind-direction': 'Wind Direction (T) (18:00 - 00:00):',
            // 'arrival-wind-force-dir-for-every-six-hours-18-00-swell-height': 'Swell Height (m) (18:00 - 00:00):',
            // 'arrival-wind-force-dir-for-every-six-hours-18-00-swell-direction': 'Swell Direction (T) (18:00 - 00:00):',
            // 'arrival-wind-force-dir-for-every-six-hours-18-00-wind-sea-height': 'Wind Sea Height (m) (18:00 - 00:00):',
            // 'arrival-wind-force-dir-for-every-six-hours-18-00-sea-direction': 'Sea Direction (T) (18:00 - 00:00):',
            // 'arrival-wind-force-dir-for-every-six-hours-18-00-sea-ds': 'Sea DS (18:00 - 00:00):',

            // // Arrival 00:00 - 06:00	
            // 'arrival-wind-force-dir-for-every-six-hours-00-06-wind-force': 'Wind Force (Bft.) (00:00 - 06:00):',
            // 'arrival-wind-force-dir-for-every-six-hours-00-06-wind-direction': 'Wind Direction (T) (00:00 - 06:00):',
            // 'arrival-wind-force-dir-for-every-six-hours-00-06-swell-height': 'Swell Height (m) (00:00 - 06:00):',
            // 'arrival-wind-force-dir-for-every-six-hours-00-06-swell-direction': 'Swell Direction (T) (00:00 - 06:00):',
            // 'arrival-wind-force-dir-for-every-six-hours-00-06-wind-sea-height': 'Wind Sea Height (m) (00:00 - 06:00):',
            // 'arrival-wind-force-dir-for-every-six-hours-00-06-sea-direction': 'Sea Direction (T) (00:00 - 06:00):',
            // 'arrival-wind-force-dir-for-every-six-hours-00-06-sea-ds': 'Sea DS (00:00 - 06:00):',

            // // Arrival 06:00 - 12:00
            // 'arrival-wind-force-dir-for-every-six-hours-06-12-wind-force': 'Wind Force (Bft.) (06:00 - 12:00):',
            // 'arrival-wind-force-dir-for-every-six-hours-06-12-wind-direction': 'Wind Direction (T) (06:00 - 12:00):',
            // 'arrival-wind-force-dir-for-every-six-hours-06-12-swell-height': 'Swell Height (m) (06:00 - 12:00):',
            // 'arrival-wind-force-dir-for-every-six-hours-06-12-swell-direction': 'Swell Direction (T) (06:00 - 12:00):',
            // 'arrival-wind-force-dir-for-every-six-hours-06-12-wind-sea-height': 'Wind Sea Height (m) (06:00 - 12:00):',
            // 'arrival-wind-force-dir-for-every-six-hours-06-12-sea-direction': 'Sea Direction (T) (06:00 - 12:00):',
            // 'arrival-wind-force-dir-for-every-six-hours-06-12-sea-ds': 'Sea DS (06:00 - 12:00):',

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

            'arrival-hsfo-oil-me-cc-oil-quantity': 'ME CC Oil Quantity:',
            'arrival-hsfo-oil-me-cc-total-run-hrs': 'ME CC Total Running Hours:',
            'arrival-hsfo-oil-me-cc-oil-cons': 'ME CC Oil Consumption:',

            'arrival-hsfo-oil-ae-cc-oil-quantity': 'AE CC Oil Quantity:',
            'arrival-hsfo-oil-ae-cc-total-run-hrs': 'AE CC Total Running Hours:',
            'arrival-hsfo-oil-ae-cc-oil-cons': 'AE CC Oil Consumption:',
            
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

            'arrival-biofuel-oil-me-cc-oil-quantity': 'ME CC Oil Quantity:',
            'arrival-biofuel-oil-me-cc-total-run-hrs': 'ME CC Total Running Hours:',
            'arrival-biofuel-oil-me-cc-oil-cons': 'ME CC Oil Consumption:',

            'arrival-biofuel-oil-ae-cc-oil-quantity': 'AE CC Oil Quantity:',
            'arrival-biofuel-oil-ae-cc-total-run-hrs': 'AE CC Total Running Hours:',
            'arrival-biofuel-oil-ae-cc-oil-cons': 'AE CC Oil Consumption:',

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

            'arrival-vlsfo-oil-me-cc-oil-quantity': 'ME CC Oil Quantity:',
            'arrival-vlsfo-oil-me-cc-total-run-hrs': 'ME CC Total Running Hours:',
            'arrival-vlsfo-oil-me-cc-oil-cons': 'ME CC Oil Consumption:',

            'arrival-vlsfo-oil-ae-cc-oil-quantity': 'AE CC Oil Quantity:',
            'arrival-vlsfo-oil-ae-cc-total-run-hrs': 'AE CC Total Running Hours:',
            'arrival-vlsfo-oil-ae-cc-oil-cons': 'AE CC Oil Consumption:',

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

            'arrival-lsmgo-oil-me-cc-oil-quantity': 'ME CC Oil Quantity:',
            'arrival-lsmgo-oil-me-cc-total-run-hrs': 'ME CC Total Running Hours:',
            'arrival-lsmgo-oil-me-cc-oil-cons': 'ME CC Oil Consumption:',

            'arrival-lsmgo-oil-ae-cc-oil-quantity': 'AE CC Oil Quantity:',
            'arrival-lsmgo-oil-ae-cc-total-run-hrs': 'AE CC Total Running Hours:',
            'arrival-lsmgo-oil-ae-cc-oil-cons': 'AE CC Oil Consumption:',

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
        },

        'crewmonitoringplan': {
        // On Board Crew Data 1
        'crew-monitoring-plan-crew-no-1': 'No:',
        'crew-monitoring-plan-vessel-name-1': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-1': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-1': 'Crew First Name:',
        'crew-monitoring-plan-rank-1': 'Rank:',
        'crew-monitoring-plan-crew-nationality-1': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-1': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-1': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-1': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-1': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-1': 'No of Months On Board:',

        // Crew Change Data 1
        'crew-monitoring-plan-vessel-1': 'Vessel Name:',
        'crew-monitoring-plan-port-1': 'Port:',
        'crew-monitoring-plan-country-1': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-1': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-1': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-1': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-1': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-1': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-1': 'Reason for Change:',
        'crew-monitoring-plan-remarks-1': 'Remarks:',

        // On Board Crew Data 2 
        'crew-monitoring-plan-crew-no-2': 'No:',
        'crew-monitoring-plan-vessel-name-2': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-2': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-2': 'Crew First Name:',
        'crew-monitoring-plan-rank-2': 'Rank:',
        'crew-monitoring-plan-crew-nationality-2': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-2': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-2': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-2': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-2': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-2': 'No of Months On Board:',
        
        // Crew Change Data 2 
        'crew-monitoring-plan-vessel-2': 'Vessel:',
        'crew-monitoring-plan-port-2': 'Port:',
        'crew-monitoring-plan-country-2': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-2': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-2': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-2': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-2': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-2': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-2': 'Reason for Change:',
        'crew-monitoring-plan-remarks-2': 'Remarks:',

        // On Board Crew Data 3
        'crew-monitoring-plan-crew-no-3': 'No:',
        'crew-monitoring-plan-vessel-name-3': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-3': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-3': 'Crew First Name:',
        'crew-monitoring-plan-rank-3': 'Rank:',
        'crew-monitoring-plan-crew-nationality-3': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-3': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-3': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-3': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-3': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-3': 'No of Months On Board:',

        // Crew Change Data 3
        'crew-monitoring-plan-vessel-3': 'Vessel:',
        'crew-monitoring-plan-port-3': 'Port:',
        'crew-monitoring-plan-country-3': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-3': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-3': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-3': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-3': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-3': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-3': 'Reason for Change:',
        'crew-monitoring-plan-remarks-3': 'Remarks:',

        // On Board Crew Data 4
        'crew-monitoring-plan-crew-no-4': 'No:',
        'crew-monitoring-plan-vessel-name-4': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-4': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-4': 'Crew First Name:',
        'crew-monitoring-plan-rank-4': 'Rank:',
        'crew-monitoring-plan-crew-nationality-4': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-4': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-4': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-4': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-4': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-4': 'No of Months On Board:',

        // Crew Change Data 4
        'crew-monitoring-plan-vessel-4': 'Vessel:',
        'crew-monitoring-plan-port-4': 'Port:',
        'crew-monitoring-plan-country-4': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-4': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-4': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-4': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-4': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-4': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-4': 'Reason for Change:',
        'crew-monitoring-plan-remarks-4': 'Remarks:',

        // On Board Crew Data 5
        'crew-monitoring-plan-crew-no-5': 'No:',
        'crew-monitoring-plan-vessel-name-5': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-5': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-5': 'Crew First Name:',
        'crew-monitoring-plan-rank-5': 'Rank:',
        'crew-monitoring-plan-crew-nationality-5': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-5': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-5': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-5': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-5': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-5': 'No of Months On Board:',

        // Crew Change Data 5
        'crew-monitoring-plan-vessel-5': 'Vessel:',
        'crew-monitoring-plan-port-5': 'Port:',
        'crew-monitoring-plan-country-5': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-5': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-5': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-5': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-5': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-5': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-5': 'Reason for Change:',
        'crew-monitoring-plan-remarks-5': 'Remarks:',

        // On Board Crew Data 6
        'crew-monitoring-plan-crew-no-6': 'No:',
        'crew-monitoring-plan-vessel-name-6': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-6': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-6': 'Crew First Name:',
        'crew-monitoring-plan-rank-6': 'Rank:',
        'crew-monitoring-plan-crew-nationality-6': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-6': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-6': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-6': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-6': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-6': 'No of Months On Board:',

        // Crew Change Data 6
        'crew-monitoring-plan-vessel-6': 'Vessel:',
        'crew-monitoring-plan-port-6': 'Port:',
        'crew-monitoring-plan-country-6': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-6': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-6': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-6': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-6': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-6': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-6': 'Reason for Change:',
        'crew-monitoring-plan-remarks-6': 'Remarks:',

        // On Board Crew Data 7
        'crew-monitoring-plan-crew-no-7': 'No:',
        'crew-monitoring-plan-vessel-name-7': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-7': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-7': 'Crew First Name:',
        'crew-monitoring-plan-rank-7': 'Rank:',
        'crew-monitoring-plan-crew-nationality-7': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-7': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-7': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-7': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-7': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-7': 'No of Months On Board:',

        // Crew Change Data 7
        'crew-monitoring-plan-vessel-7': 'Vessel:',
        'crew-monitoring-plan-port-7': 'Port:',
        'crew-monitoring-plan-country-7': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-7': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-7': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-7': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-7': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-7': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-7': 'Reason for Change:',
        'crew-monitoring-plan-remarks-7': 'Remarks:',

        // On Board Crew Data 8
        'crew-monitoring-plan-crew-no-8': 'No:',
        'crew-monitoring-plan-vessel-name-8': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-8': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-8': 'Crew First Name:',
        'crew-monitoring-plan-rank-8': 'Rank:',
        'crew-monitoring-plan-crew-nationality-8': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-8': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-8': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-8': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-8': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-8': 'No of Months On Board:',

        // Crew Change Data 8
        'crew-monitoring-plan-vessel-8': 'Vessel:',
        'crew-monitoring-plan-port-8': 'Port:',
        'crew-monitoring-plan-country-8': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-8': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-8': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-8': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-8': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-8': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-8': 'Reason for Change:',
        'crew-monitoring-plan-remarks-8': 'Remarks:',

        // On Board Crew Data 9
        'crew-monitoring-plan-crew-no-9': 'No:',
        'crew-monitoring-plan-vessel-name-9': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-9': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-9': 'Crew First Name:',
        'crew-monitoring-plan-rank-9': 'Rank:',
        'crew-monitoring-plan-crew-nationality-9': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-9': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-9': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-9': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-9': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-9': 'No of Months On Board:',

        // Crew Change Data 9
        'crew-monitoring-plan-vessel-9': 'Vessel:',
        'crew-monitoring-plan-port-9': 'Port:',
        'crew-monitoring-plan-country-9': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-9': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-9': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-9': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-9': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-9': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-9': 'Reason for Change:',
        'crew-monitoring-plan-remarks-9': 'Remarks:',

        // On Board Crew Data 10
        'crew-monitoring-plan-crew-no-10': 'No:',
        'crew-monitoring-plan-vessel-name-10': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-10': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-10': 'Crew First Name:',
        'crew-monitoring-plan-rank-10': 'Rank:',
        'crew-monitoring-plan-crew-nationality-10': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-10': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-10': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-10': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-10': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-10': 'No of Months On Board:',

        // Crew Change Data 10
        'crew-monitoring-plan-vessel-10': 'Vessel:',
        'crew-monitoring-plan-port-10': 'Port:',
        'crew-monitoring-plan-country-10': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-10': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-10': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-10': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-10': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-10': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-10': 'Reason for Change:',
        'crew-monitoring-plan-remarks-10': 'Remarks:',

        // On Board Crew Data 11
        'crew-monitoring-plan-crew-no-11': 'No:',
        'crew-monitoring-plan-vessel-name-11': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-11': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-11': 'Crew First Name:',
        'crew-monitoring-plan-rank-11': 'Rank:',
        'crew-monitoring-plan-crew-nationality-11': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-11': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-11': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-11': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-11': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-11': 'No of Months On Board:',

        // Crew Change Data 11
        'crew-monitoring-plan-vessel-11': 'Vessel:',
        'crew-monitoring-plan-port-11': 'Port:',
        'crew-monitoring-plan-country-11': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-11': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-11': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-11': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-11': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-11': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-11': 'Reason for Change:',
        'crew-monitoring-plan-remarks-11': 'Remarks:',

        // On Board Crew Data 12
        'crew-monitoring-plan-crew-no-12': 'No:',
        'crew-monitoring-plan-vessel-name-12': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-12': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-12': 'Crew First Name:',
        'crew-monitoring-plan-rank-12': 'Rank:',
        'crew-monitoring-plan-crew-nationality-12': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-12': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-12': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-12': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-12': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-12': 'No of Months On Board:',

        // Crew Change Data 12
        'crew-monitoring-plan-vessel-12': 'Vessel:',
        'crew-monitoring-plan-port-12': 'Port:',
        'crew-monitoring-plan-country-12': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-12': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-12': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-12': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-12': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-12': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-12': 'Reason for Change:',
        'crew-monitoring-plan-remarks-12': 'Remarks:',

        // On Board Crew Data 13
        'crew-monitoring-plan-crew-no-13': 'No:',
        'crew-monitoring-plan-vessel-name-13': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-13': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-13': 'Crew First Name:',
        'crew-monitoring-plan-rank-13': 'Rank:',
        'crew-monitoring-plan-crew-nationality-13': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-13': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-13': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-13': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-13': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-13': 'No of Months On Board:',

        // Crew Change Data 13
        'crew-monitoring-plan-vessel-13': 'Vessel:',
        'crew-monitoring-plan-port-13': 'Port:',
        'crew-monitoring-plan-country-13': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-13': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-13': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-13': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-13': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-13': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-13': 'Reason for Change:',
        'crew-monitoring-plan-remarks-13': 'Remarks:',

        // On Board Crew Data 14
        'crew-monitoring-plan-crew-no-14': 'No:',
        'crew-monitoring-plan-vessel-name-14': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-14': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-14': 'Crew First Name:',
        'crew-monitoring-plan-rank-14': 'Rank:',
        'crew-monitoring-plan-crew-nationality-14': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-14': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-14': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-14': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-14': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-14': 'No of Months On Board:',

        // Crew Change Data 14
        'crew-monitoring-plan-vessel-14': 'Vessel:',
        'crew-monitoring-plan-port-14': 'Port:',
        'crew-monitoring-plan-country-14': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-14': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-14': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-14': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-14': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-14': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-14': 'Reason for Change:',
        'crew-monitoring-plan-remarks-14': 'Remarks:',

        // On Board Crew Data 15
        'crew-monitoring-plan-crew-no-15': 'No:',
        'crew-monitoring-plan-vessel-name-15': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-15': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-15': 'Crew First Name:',
        'crew-monitoring-plan-rank-15': 'Rank:',
        'crew-monitoring-plan-crew-nationality-15': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-15': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-15': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-15': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-15': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-15': 'No of Months On Board:',

        // Crew Change Data 15
        'crew-monitoring-plan-vessel-15': 'Vessel:',
        'crew-monitoring-plan-port-15': 'Port:',
        'crew-monitoring-plan-country-15': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-15': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-15': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-15': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-15': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-15': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-15': 'Reason for Change:',
        'crew-monitoring-plan-remarks-15': 'Remarks:',

        // On Board Crew Data 16
        'crew-monitoring-plan-crew-no-16': 'No:',
        'crew-monitoring-plan-vessel-name-16': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-16': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-16': 'Crew First Name:',
        'crew-monitoring-plan-rank-16': 'Rank:',
        'crew-monitoring-plan-crew-nationality-16': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-16': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-16': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-16': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-16': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-16': 'No of Months On Board:',

        // Crew Change Data 16
        'crew-monitoring-plan-vessel-16': 'Vessel:',
        'crew-monitoring-plan-port-16': 'Port:',
        'crew-monitoring-plan-country-16': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-16': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-16': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-16': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-16': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-16': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-16': 'Reason for Change:',
        'crew-monitoring-plan-remarks-16': 'Remarks:',

        // On Board Crew Data 17
        'crew-monitoring-plan-crew-no-17': 'No:',
        'crew-monitoring-plan-vessel-name-17': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-17': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-17': 'Crew First Name:',
        'crew-monitoring-plan-rank-17': 'Rank:',
        'crew-monitoring-plan-crew-nationality-17': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-17': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-17': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-17': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-17': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-17': 'No of Months On Board:',

        // Crew Change Data 17
        'crew-monitoring-plan-vessel-17': 'Vessel:',
        'crew-monitoring-plan-port-17': 'Port:',
        'crew-monitoring-plan-country-17': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-17': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-17': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-17': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-17': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-17': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-17': 'Reason for Change:',
        'crew-monitoring-plan-remarks-17': 'Remarks:',

        // On Board Crew Data 18
        'crew-monitoring-plan-crew-no-18': 'No:',
        'crew-monitoring-plan-vessel-name-18': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-18': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-18': 'Crew First Name:',
        'crew-monitoring-plan-rank-18': 'Rank:',
        'crew-monitoring-plan-crew-nationality-18': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-18': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-18': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-18': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-18': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-18': 'No of Months On Board:',

        // Crew Change Data 18
        'crew-monitoring-plan-vessel-18': 'Vessel:',
        'crew-monitoring-plan-port-18': 'Port:',
        'crew-monitoring-plan-country-18': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-18': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-18': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-18': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-18': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-18': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-18': 'Reason for Change:',
        'crew-monitoring-plan-remarks-18': 'Remarks:',

        // On Board Crew Data 19
        'crew-monitoring-plan-crew-no-19': 'No:',
        'crew-monitoring-plan-vessel-name-19': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-19': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-19': 'Crew First Name:',
        'crew-monitoring-plan-rank-19': 'Rank:',
        'crew-monitoring-plan-crew-nationality-19': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-19': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-19': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-19': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-19': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-19': 'No of Months On Board:',

        // Crew Change Data 19
        'crew-monitoring-plan-vessel-19': 'Vessel:',
        'crew-monitoring-plan-port-19': 'Port:',
        'crew-monitoring-plan-country-19': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-19': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-19': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-19': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-19': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-19': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-19': 'Reason for Change:',
        'crew-monitoring-plan-remarks-19': 'Remarks:',

        // On Board Crew Data 20
        'crew-monitoring-plan-crew-no-20': 'No:',
        'crew-monitoring-plan-vessel-name-20': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-20': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-20': 'Crew First Name:',
        'crew-monitoring-plan-rank-20': 'Rank:',
        'crew-monitoring-plan-crew-nationality-20': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-20': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-20': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-20': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-20': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-20': 'No of Months On Board:',

        // Crew Change Data 20
        'crew-monitoring-plan-vessel-20': 'Vessel:',
        'crew-monitoring-plan-port-20': 'Port:',
        'crew-monitoring-plan-country-20': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-20': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-20': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-20': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-20': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-20': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-20': 'Reason for Change:',
        'crew-monitoring-plan-remarks-20': 'Remarks:',

        // On Board Crew Data 21
        'crew-monitoring-plan-crew-no-21': 'No:',
        'crew-monitoring-plan-vessel-name-21': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-21': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-21': 'Crew First Name:',
        'crew-monitoring-plan-rank-21': 'Rank:',
        'crew-monitoring-plan-crew-nationality-21': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-21': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-21': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-21': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-21': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-21': 'No of Months On Board:',

        // Crew Change Data 21
        'crew-monitoring-plan-vessel-21': 'Vessel:',
        'crew-monitoring-plan-port-21': 'Port:',
        'crew-monitoring-plan-country-21': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-21': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-21': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-21': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-21': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-21': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-21': 'Reason for Change:',
        'crew-monitoring-plan-remarks-21': 'Remarks:',

        // On Board Crew Data 22
        'crew-monitoring-plan-crew-no-22': 'No:',
        'crew-monitoring-plan-vessel-name-22': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-22': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-22': 'Crew First Name:',
        'crew-monitoring-plan-rank-22': 'Rank:',
        'crew-monitoring-plan-crew-nationality-22': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-22': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-22': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-22': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-22': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-22': 'No of Months On Board:',

        // Crew Change Data 22
        'crew-monitoring-plan-vessel-22': 'Vessel:',
        'crew-monitoring-plan-port-22': 'Port:',
        'crew-monitoring-plan-country-22': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-22': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-22': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-22': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-22': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-22': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-22': 'Reason for Change:',
        'crew-monitoring-plan-remarks-22': 'Remarks:',

        // On Board Crew Data 23
        'crew-monitoring-plan-crew-no-23': 'No:',
        'crew-monitoring-plan-vessel-name-23': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-23': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-23': 'Crew First Name:',
        'crew-monitoring-plan-rank-23': 'Rank:',
        'crew-monitoring-plan-crew-nationality-23': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-23': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-23': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-23': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-23': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-23': 'No of Months On Board:',

        // Crew Change Data 23
        'crew-monitoring-plan-vessel-23': 'Vessel:',
        'crew-monitoring-plan-port-23': 'Port:',
        'crew-monitoring-plan-country-23': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-23': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-23': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-23': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-23': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-23': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-23': 'Reason for Change:',
        'crew-monitoring-plan-remarks-23': 'Remarks:',

        // On Board Crew Data 24
        'crew-monitoring-plan-crew-no-24': 'No:',
        'crew-monitoring-plan-vessel-name-24': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-24': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-24': 'Crew First Name:',
        'crew-monitoring-plan-rank-24': 'Rank:',
        'crew-monitoring-plan-crew-nationality-24': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-24': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-24': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-24': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-24': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-24': 'No of Months On Board:',

        // Crew Change Data 24
        'crew-monitoring-plan-vessel-24': 'Vessel:',
        'crew-monitoring-plan-port-24': 'Port:',
        'crew-monitoring-plan-country-24': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-24': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-24': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-24': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-24': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-24': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-24': 'Reason for Change:',
        'crew-monitoring-plan-remarks-24': 'Remarks:',

        // On Board Crew Data 25
        'crew-monitoring-plan-crew-no-25': 'No:',
        'crew-monitoring-plan-vessel-name-25': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-25': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-25': 'Crew First Name:',
        'crew-monitoring-plan-rank-25': 'Rank:',
        'crew-monitoring-plan-crew-nationality-25': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-25': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-25': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-25': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-25': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-25': 'No of Months On Board:',

        // Crew Change Data 25
        'crew-monitoring-plan-vessel-25': 'Vessel:',
        'crew-monitoring-plan-port-25': 'Port:',
        'crew-monitoring-plan-country-25': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-25': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-25': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-25': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-25': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-25': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-25': 'Reason for Change:',
        'crew-monitoring-plan-remarks-25': 'Remarks:',

        // On Board Crew Data 26
        'crew-monitoring-plan-crew-no-26': 'No:',
        'crew-monitoring-plan-vessel-name-26': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-26': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-26': 'Crew First Name:',
        'crew-monitoring-plan-rank-26': 'Rank:',
        'crew-monitoring-plan-crew-nationality-26': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-26': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-26': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-26': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-26': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-26': 'No of Months On Board:',

        // Crew Change Data 26
        'crew-monitoring-plan-vessel-26': 'Vessel:',
        'crew-monitoring-plan-port-26': 'Port:',
        'crew-monitoring-plan-country-26': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-26': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-26': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-26': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-26': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-26': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-26': 'Reason for Change:',
        'crew-monitoring-plan-remarks-26': 'Remarks:',

        // On Board Crew Data 27
        'crew-monitoring-plan-crew-no-27': 'No:',
        'crew-monitoring-plan-vessel-name-27': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-27': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-27': 'Crew First Name:',
        'crew-monitoring-plan-rank-27': 'Rank:',
        'crew-monitoring-plan-crew-nationality-27': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-27': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-27': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-27': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-27': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-27': 'No of Months On Board:',

        // Crew Change Data 27
        'crew-monitoring-plan-vessel-27': 'Vessel:',
        'crew-monitoring-plan-port-27': 'Port:',
        'crew-monitoring-plan-country-27': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-27': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-27': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-27': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-27': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-27': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-27': 'Reason for Change:',
        'crew-monitoring-plan-remarks-27': 'Remarks:',

        // On Board Crew Data 28
        'crew-monitoring-plan-crew-no-28': 'No:',
        'crew-monitoring-plan-vessel-name-28': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-28': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-28': 'Crew First Name:',
        'crew-monitoring-plan-rank-28': 'Rank:',
        'crew-monitoring-plan-crew-nationality-28': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-28': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-28': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-28': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-28': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-28': 'No of Months On Board:',

        // Crew Change Data 28
        'crew-monitoring-plan-vessel-28': 'Vessel:',
        'crew-monitoring-plan-port-28': 'Port:',
        'crew-monitoring-plan-country-28': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-28': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-28': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-28': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-28': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-28': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-28': 'Reason for Change:',
        'crew-monitoring-plan-remarks-28': 'Remarks:',

        // On Board Crew Data 29
        'crew-monitoring-plan-crew-no-29': 'No:',
        'crew-monitoring-plan-vessel-name-29': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-29': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-29': 'Crew First Name:',
        'crew-monitoring-plan-rank-29': 'Rank:',
        'crew-monitoring-plan-crew-nationality-29': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-29': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-29': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-29': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-29': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-29': 'No of Months On Board:',

        // Crew Change Data 29
        'crew-monitoring-plan-vessel-29': 'Vessel:',
        'crew-monitoring-plan-port-29': 'Port:',
        'crew-monitoring-plan-country-29': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-29': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-29': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-29': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-29': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-29': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-29': 'Reason for Change:',
        'crew-monitoring-plan-remarks-29': 'Remarks:',

        // On Board Crew Data 30
        'crew-monitoring-plan-crew-no-30': 'No:',
        'crew-monitoring-plan-vessel-name-30': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-30': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-30': 'Crew First Name:',
        'crew-monitoring-plan-rank-30': 'Rank:',
        'crew-monitoring-plan-crew-nationality-30': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-30': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-30': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-30': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-30': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-30': 'No of Months On Board:',

        // Crew Change Data 30
        'crew-monitoring-plan-vessel-30': 'Vessel:',
        'crew-monitoring-plan-port-30': 'Port:',
        'crew-monitoring-plan-country-30': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-30': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-30': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-30': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-30': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-30': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-30': 'Reason for Change:',
        'crew-monitoring-plan-remarks-30': 'Remarks:',

        // On Board Crew Data 31
        'crew-monitoring-plan-crew-no-31': 'No:',
        'crew-monitoring-plan-vessel-name-31': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-31': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-31': 'Crew First Name:',
        'crew-monitoring-plan-rank-31': 'Rank:',
        'crew-monitoring-plan-crew-nationality-31': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-31': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-31': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-31': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-31': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-31': 'No of Months On Board:',

        // Crew Change Data 31
        'crew-monitoring-plan-vessel-31': 'Vessel:',
        'crew-monitoring-plan-port-31': 'Port:',
        'crew-monitoring-plan-country-31': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-31': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-31': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-31': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-31': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-31': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-31': 'Reason for Change:',
        'crew-monitoring-plan-remarks-31': 'Remarks:',

        // On Board Crew Data 32
        'crew-monitoring-plan-crew-no-32': 'No:',
        'crew-monitoring-plan-vessel-name-32': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-32': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-32': 'Crew First Name:',
        'crew-monitoring-plan-rank-32': 'Rank:',
        'crew-monitoring-plan-crew-nationality-32': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-32': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-32': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-32': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-32': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-32': 'No of Months On Board:',

        // Crew Change Data 32
        'crew-monitoring-plan-vessel-32': 'Vessel:',
        'crew-monitoring-plan-port-32': 'Port:',
        'crew-monitoring-plan-country-32': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-32': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-32': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-32': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-32': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-32': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-32': 'Reason for Change:',
        'crew-monitoring-plan-remarks-32': 'Remarks:',

        // On Board Crew Data 33
        'crew-monitoring-plan-crew-no-33': 'No:',
        'crew-monitoring-plan-vessel-name-33': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-33': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-33': 'Crew First Name:',
        'crew-monitoring-plan-rank-33': 'Rank:',
        'crew-monitoring-plan-crew-nationality-33': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-33': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-33': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-33': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-33': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-33': 'No of Months On Board:',

        // Crew Change Data 33
        'crew-monitoring-plan-vessel-33': 'Vessel:',
        'crew-monitoring-plan-port-33': 'Port:',
        'crew-monitoring-plan-country-33': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-33': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-33': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-33': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-33': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-33': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-33': 'Reason for Change:',
        'crew-monitoring-plan-remarks-33': 'Remarks:',

        // On Board Crew Data 34
        'crew-monitoring-plan-crew-no-34': 'No:',
        'crew-monitoring-plan-vessel-name-34': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-34': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-34': 'Crew First Name:',
        'crew-monitoring-plan-rank-34': 'Rank:',
        'crew-monitoring-plan-crew-nationality-34': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-34': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-34': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-34': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-34': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-34': 'No of Months On Board:',

        // Crew Change Data 34
        'crew-monitoring-plan-vessel-34': 'Vessel:',
        'crew-monitoring-plan-port-34': 'Port:',
        'crew-monitoring-plan-country-34': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-34': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-34': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-34': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-34': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-34': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-34': 'Reason for Change:',
        'crew-monitoring-plan-remarks-34': 'Remarks:',

        // On Board Crew Data 35
        'crew-monitoring-plan-crew-no-35': 'No:',
        'crew-monitoring-plan-vessel-name-35': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-35': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-35': 'Crew First Name:',
        'crew-monitoring-plan-rank-35': 'Rank:',
        'crew-monitoring-plan-crew-nationality-35': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-35': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-35': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-35': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-35': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-35': 'No of Months On Board:',

        // Crew Change Data 35
        'crew-monitoring-plan-vessel-35': 'Vessel:',
        'crew-monitoring-plan-port-35': 'Port:',
        'crew-monitoring-plan-country-35': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-35': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-35': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-35': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-35': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-35': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-35': 'Reason for Change:',
        'crew-monitoring-plan-remarks-35': 'Remarks:',

        // On Board Crew Data 36
        'crew-monitoring-plan-crew-no-36': 'No:',
        'crew-monitoring-plan-vessel-name-36': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-36': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-36': 'Crew First Name:',
        'crew-monitoring-plan-rank-36': 'Rank:',
        'crew-monitoring-plan-crew-nationality-36': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-36': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-36': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-36': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-36': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-36': 'No of Months On Board:',

        // Crew Change Data 36
        'crew-monitoring-plan-vessel-36': 'Vessel:',
        'crew-monitoring-plan-port-36': 'Port:',
        'crew-monitoring-plan-country-36': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-36': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-36': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-36': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-36': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-36': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-36': 'Reason for Change:',
        'crew-monitoring-plan-remarks-36': 'Remarks:',

        // On Board Crew Data 37
        'crew-monitoring-plan-crew-no-37': 'No:',
        'crew-monitoring-plan-vessel-name-37': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-37': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-37': 'Crew First Name:',
        'crew-monitoring-plan-rank-37': 'Rank:',
        'crew-monitoring-plan-crew-nationality-37': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-37': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-37': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-37': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-37': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-37': 'No of Months On Board:',

        // Crew Change Data 37
        'crew-monitoring-plan-vessel-37': 'Vessel:',
        'crew-monitoring-plan-port-37': 'Port:',
        'crew-monitoring-plan-country-37': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-37': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-37': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-37': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-37': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-37': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-37': 'Reason for Change:',
        'crew-monitoring-plan-remarks-37': 'Remarks:',

        // On Board Crew Data 38
        'crew-monitoring-plan-crew-no-38': 'No:',
        'crew-monitoring-plan-vessel-name-38': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-38': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-38': 'Crew First Name:',
        'crew-monitoring-plan-rank-38': 'Rank:',
        'crew-monitoring-plan-crew-nationality-38': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-38': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-38': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-38': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-38': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-38': 'No of Months On Board:',

        // Crew Change Data 38
        'crew-monitoring-plan-vessel-38': 'Vessel:',
        'crew-monitoring-plan-port-38': 'Port:',
        'crew-monitoring-plan-country-38': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-38': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-38': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-38': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-38': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-38': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-38': 'Reason for Change:',
        'crew-monitoring-plan-remarks-38': 'Remarks:',

        // On Board Crew Data 39
        'crew-monitoring-plan-crew-no-39': 'No:',
        'crew-monitoring-plan-vessel-name-39': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-39': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-39': 'Crew First Name:',
        'crew-monitoring-plan-rank-39': 'Rank:',
        'crew-monitoring-plan-crew-nationality-39': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-39': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-39': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-39': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-39': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-39': 'No of Months On Board:',

        // Crew Change Data 39
        'crew-monitoring-plan-vessel-39': 'Vessel:',
        'crew-monitoring-plan-port-39': 'Port:',
        'crew-monitoring-plan-country-39': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-39': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-39': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-39': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-39': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-39': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-39': 'Reason for Change:',
        'crew-monitoring-plan-remarks-39': 'Remarks:',

        // On Board Crew Data 40
        'crew-monitoring-plan-crew-no-40': 'No:',
        'crew-monitoring-plan-vessel-name-40': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-40': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-40': 'Crew First Name:',
        'crew-monitoring-plan-rank-40': 'Rank:',
        'crew-monitoring-plan-crew-nationality-40': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-40': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-40': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-40': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-40': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-40': 'No of Months On Board:',

        // Crew Change Data 40
        'crew-monitoring-plan-vessel-40': 'Vessel:',
        'crew-monitoring-plan-port-40': 'Port:',
        'crew-monitoring-plan-country-40': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-40': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-40': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-40': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-40': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-40': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-40': 'Reason for Change:',
        'crew-monitoring-plan-remarks-40': 'Remarks:',
    
        // On Board Crew Data 41
        'crew-monitoring-plan-crew-no-41': 'No:',
        'crew-monitoring-plan-vessel-name-41': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-41': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-41': 'Crew First Name:',
        'crew-monitoring-plan-rank-41': 'Rank:',
        'crew-monitoring-plan-crew-nationality-41': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-41': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-41': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-41': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-41': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-41': 'No of Months On Board:',

        // Crew Change Data 41
        'crew-monitoring-plan-vessel-41': 'Vessel:',
        'crew-monitoring-plan-port-41': 'Port:',
        'crew-monitoring-plan-country-41': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-41': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-41': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-41': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-41': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-41': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-41': 'Reason for Change:',
        'crew-monitoring-plan-remarks-41': 'Remarks:',

        // On Board Crew Data 42
        'crew-monitoring-plan-crew-no-42': 'No:',
        'crew-monitoring-plan-vessel-name-42': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-42': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-42': 'Crew First Name:',
        'crew-monitoring-plan-rank-42': 'Rank:',
        'crew-monitoring-plan-crew-nationality-42': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-42': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-42': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-42': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-42': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-42': 'No of Months On Board:',

        // Crew Change Data 42
        'crew-monitoring-plan-vessel-42': 'Vessel:',
        'crew-monitoring-plan-port-42': 'Port:',
        'crew-monitoring-plan-country-42': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-42': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-42': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-42': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-42': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-42': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-42': 'Reason for Change:',
        'crew-monitoring-plan-remarks-42': 'Remarks:',

        // On Board Crew Data 43
        'crew-monitoring-plan-crew-no-43': 'No:',
        'crew-monitoring-plan-vessel-name-43': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-43': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-43': 'Crew First Name:',
        'crew-monitoring-plan-rank-43': 'Rank:',
        'crew-monitoring-plan-crew-nationality-43': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-43': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-43': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-43': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-43': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-43': 'No of Months On Board:',

        // Crew Change Data 43
        'crew-monitoring-plan-vessel-43': 'Vessel:',
        'crew-monitoring-plan-port-43': 'Port:',
        'crew-monitoring-plan-country-43': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-43': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-43': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-43': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-43': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-43': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-43': 'Reason for Change:',
        'crew-monitoring-plan-remarks-43': 'Remarks:',

        // On Board Crew Data 44
        'crew-monitoring-plan-crew-no-44': 'No:',
        'crew-monitoring-plan-vessel-name-44': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-44': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-44': 'Crew First Name:',
        'crew-monitoring-plan-rank-44': 'Rank:',
        'crew-monitoring-plan-crew-nationality-44': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-44': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-44': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-44': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-44': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-44': 'No of Months On Board:',

        // Crew Change Data 44
        'crew-monitoring-plan-vessel-44': 'Vessel:',
        'crew-monitoring-plan-port-44': 'Port:',
        'crew-monitoring-plan-country-44': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-44': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-44': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-44': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-44': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-44': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-44': 'Reason for Change:',
        'crew-monitoring-plan-remarks-44': 'Remarks:',

        // On Board Crew Data 45
        'crew-monitoring-plan-crew-no-45': 'No:',
        'crew-monitoring-plan-vessel-name-45': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-45': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-45': 'Crew First Name:',
        'crew-monitoring-plan-rank-45': 'Rank:',
        'crew-monitoring-plan-crew-nationality-45': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-45': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-45': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-45': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-45': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-45': 'No of Months On Board:',

        // Crew Change Data 45
        'crew-monitoring-plan-vessel-45': 'Vessel:',
        'crew-monitoring-plan-port-45': 'Port:',
        'crew-monitoring-plan-country-45': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-45': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-45': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-45': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-45': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-45': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-45': 'Reason for Change:',
        'crew-monitoring-plan-remarks-45': 'Remarks:',

        // On Board Crew Data 46
        'crew-monitoring-plan-crew-no-46': 'No:',
        'crew-monitoring-plan-vessel-name-46': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-46': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-46': 'Crew First Name:',
        'crew-monitoring-plan-rank-46': 'Rank:',
        'crew-monitoring-plan-crew-nationality-46': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-46': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-46': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-46': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-46': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-46': 'No of Months On Board:',

        // Crew Change Data 46
        'crew-monitoring-plan-vessel-46': 'Vessel:',
        'crew-monitoring-plan-port-46': 'Port:',
        'crew-monitoring-plan-country-46': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-46': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-46': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-46': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-46': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-46': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-46': 'Reason for Change:',
        'crew-monitoring-plan-remarks-46': 'Remarks:',

        // On Board Crew Data 47
        'crew-monitoring-plan-crew-no-47': 'No:',
        'crew-monitoring-plan-vessel-name-47': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-47': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-47': 'Crew First Name:',
        'crew-monitoring-plan-rank-47': 'Rank:',
        'crew-monitoring-plan-crew-nationality-47': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-47': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-47': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-47': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-47': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-47': 'No of Months On Board:',

        // Crew Change Data 47
        'crew-monitoring-plan-vessel-47': 'Vessel:',
        'crew-monitoring-plan-port-47': 'Port:',
        'crew-monitoring-plan-country-47': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-47': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-47': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-47': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-47': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-47': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-47': 'Reason for Change:',
        'crew-monitoring-plan-remarks-47': 'Remarks:',

        // On Board Crew Data 48
        'crew-monitoring-plan-crew-no-48': 'No:',
        'crew-monitoring-plan-vessel-name-48': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-48': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-48': 'Crew First Name:',
        'crew-monitoring-plan-rank-48': 'Rank:',
        'crew-monitoring-plan-crew-nationality-48': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-48': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-48': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-48': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-48': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-48': 'No of Months On Board:',

        // Crew Change Data 48
        'crew-monitoring-plan-vessel-48': 'Vessel:',
        'crew-monitoring-plan-port-48': 'Port:',
        'crew-monitoring-plan-country-48': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-48': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-48': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-48': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-48': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-48': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-48': 'Reason for Change:',
        'crew-monitoring-plan-remarks-48': 'Remarks:',

        // On Board Crew Data 49
        'crew-monitoring-plan-crew-no-49': 'No:',
        'crew-monitoring-plan-vessel-name-49': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-49': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-49': 'Crew First Name:',
        'crew-monitoring-plan-rank-49': 'Rank:',
        'crew-monitoring-plan-crew-nationality-49': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-49': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-49': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-49': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-49': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-49': 'No of Months On Board:',

        // Crew Change Data 49
        'crew-monitoring-plan-vessel-49': 'Vessel:',
        'crew-monitoring-plan-port-49': 'Port:',
        'crew-monitoring-plan-country-49': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-49': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-49': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-49': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-49': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-49': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-49': 'Reason for Change:',
        'crew-monitoring-plan-remarks-49': 'Remarks:',

        // On Board Crew Data 50
        'crew-monitoring-plan-crew-no-50': 'No:',
        'crew-monitoring-plan-vessel-name-50': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-50': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-50': 'Crew First Name:',
        'crew-monitoring-plan-rank-50': 'Rank:',
        'crew-monitoring-plan-crew-nationality-50': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-50': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-50': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-50': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-50': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-50': 'No of Months On Board:',

        // Crew Change Data 50
        'crew-monitoring-plan-vessel-50': 'Vessel:',
        'crew-monitoring-plan-port-50': 'Port:',
        'crew-monitoring-plan-country-50': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-50': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-50': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-50': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-50': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-50': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-50': 'Reason for Change:',
        'crew-monitoring-plan-remarks-50': 'Remarks:',

        // On Board Crew Data 51
        'crew-monitoring-plan-crew-no-51': 'No:',
        'crew-monitoring-plan-vessel-name-51': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-51': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-51': 'Crew First Name:',
        'crew-monitoring-plan-rank-51': 'Rank:',
        'crew-monitoring-plan-crew-nationality-51': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-51': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-51': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-51': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-51': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-51': 'No of Months On Board:',

        // Crew Change Data 51
        'crew-monitoring-plan-vessel-51': 'Vessel:',
        'crew-monitoring-plan-port-51': 'Port:',
        'crew-monitoring-plan-country-51': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-51': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-51': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-51': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-51': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-51': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-51': 'Reason for Change:',
        'crew-monitoring-plan-remarks-51': 'Remarks:',

        // On Board Crew Data 52
        'crew-monitoring-plan-crew-no-52': 'No:',
        'crew-monitoring-plan-vessel-name-52': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-52': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-52': 'Crew First Name:',
        'crew-monitoring-plan-rank-52': 'Rank:',
        'crew-monitoring-plan-crew-nationality-52': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-52': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-52': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-52': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-52': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-52': 'No of Months On Board:',

        // Crew Change Data 52
        'crew-monitoring-plan-vessel-52': 'Vessel:',
        'crew-monitoring-plan-port-52': 'Port:',
        'crew-monitoring-plan-country-52': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-52': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-52': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-52': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-52': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-52': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-52': 'Reason for Change:',
        'crew-monitoring-plan-remarks-52': 'Remarks:',

        // On Board Crew Data 53
        'crew-monitoring-plan-crew-no-53': 'No:',
        'crew-monitoring-plan-vessel-name-53': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-53': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-53': 'Crew First Name:',
        'crew-monitoring-plan-rank-53': 'Rank:',
        'crew-monitoring-plan-crew-nationality-53': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-53': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-53': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-53': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-53': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-53': 'No of Months On Board:',

        // Crew Change Data 53
        'crew-monitoring-plan-vessel-53': 'Vessel:',
        'crew-monitoring-plan-port-53': 'Port:',
        'crew-monitoring-plan-country-53': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-53': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-53': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-53': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-53': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-53': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-53': 'Reason for Change:',
        'crew-monitoring-plan-remarks-53': 'Remarks:',

        // On Board Crew Data 54
        'crew-monitoring-plan-crew-no-54': 'No:',
        'crew-monitoring-plan-vessel-name-54': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-54': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-54': 'Crew First Name:',
        'crew-monitoring-plan-rank-54': 'Rank:',
        'crew-monitoring-plan-crew-nationality-54': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-54': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-54': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-54': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-54': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-54': 'No of Months On Board:',

        // Crew Change Data 54
        'crew-monitoring-plan-vessel-54': 'Vessel:',
        'crew-monitoring-plan-port-54': 'Port:',
        'crew-monitoring-plan-country-54': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-54': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-54': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-54': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-54': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-54': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-54': 'Reason for Change:',
        'crew-monitoring-plan-remarks-54': 'Remarks:',

        // On Board Crew Data 55
        'crew-monitoring-plan-crew-no-55': 'No:',
        'crew-monitoring-plan-vessel-name-55': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-55': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-55': 'Crew First Name:',
        'crew-monitoring-plan-rank-55': 'Rank:',
        'crew-monitoring-plan-crew-nationality-55': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-55': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-55': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-55': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-55': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-55': 'No of Months On Board:',

        // Crew Change Data 55
        'crew-monitoring-plan-vessel-55': 'Vessel:',
        'crew-monitoring-plan-port-55': 'Port:',
        'crew-monitoring-plan-country-55': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-55': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-55': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-55': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-55': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-55': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-55': 'Reason for Change:',
        'crew-monitoring-plan-remarks-55': 'Remarks:',

        // On Board Crew Data 56
        'crew-monitoring-plan-crew-no-56': 'No:',
        'crew-monitoring-plan-vessel-name-56': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-56': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-56': 'Crew First Name:',
        'crew-monitoring-plan-rank-56': 'Rank:',
        'crew-monitoring-plan-crew-nationality-56': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-56': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-56': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-56': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-56': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-56': 'No of Months On Board:',

        // Crew Change Data 56
        'crew-monitoring-plan-vessel-56': 'Vessel:',
        'crew-monitoring-plan-port-56': 'Port:',
        'crew-monitoring-plan-country-56': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-56': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-56': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-56': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-56': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-56': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-56': 'Reason for Change:',
        'crew-monitoring-plan-remarks-56': 'Remarks:',

        // On Board Crew Data 57
        'crew-monitoring-plan-crew-no-57': 'No:',
        'crew-monitoring-plan-vessel-name-57': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-57': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-57': 'Crew First Name:',
        'crew-monitoring-plan-rank-57': 'Rank:',
        'crew-monitoring-plan-crew-nationality-57': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-57': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-57': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-57': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-57': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-57': 'No of Months On Board:',

        // Crew Change Data 57
        'crew-monitoring-plan-vessel-57': 'Vessel:',
        'crew-monitoring-plan-port-57': 'Port:',
        'crew-monitoring-plan-country-57': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-57': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-57': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-57': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-57': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-57': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-57': 'Reason for Change:',
        'crew-monitoring-plan-remarks-57': 'Remarks:',

        // On Board Crew Data 58
        'crew-monitoring-plan-crew-no-58': 'No:',
        'crew-monitoring-plan-vessel-name-58': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-58': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-58': 'Crew First Name:',
        'crew-monitoring-plan-rank-58': 'Rank:',
        'crew-monitoring-plan-crew-nationality-58': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-58': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-58': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-58': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-58': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-58': 'No of Months On Board:',

        // Crew Change Data 58
        'crew-monitoring-plan-vessel-58': 'Vessel:',
        'crew-monitoring-plan-port-58': 'Port:',
        'crew-monitoring-plan-country-58': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-58': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-58': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-58': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-58': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-58': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-58': 'Reason for Change:',
        'crew-monitoring-plan-remarks-58': 'Remarks:',

        // On Board Crew Data 59
        'crew-monitoring-plan-crew-no-59': 'No:',
        'crew-monitoring-plan-vessel-name-59': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-59': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-59': 'Crew First Name:',
        'crew-monitoring-plan-rank-59': 'Rank:',
        'crew-monitoring-plan-crew-nationality-59': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-59': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-59': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-59': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-59': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-59': 'No of Months On Board:',

        // Crew Change Data 59
        'crew-monitoring-plan-vessel-59': 'Vessel:',
        'crew-monitoring-plan-port-59': 'Port:',
        'crew-monitoring-plan-country-59': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-59': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-59': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-59': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-59': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-59': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-59': 'Reason for Change:',
        'crew-monitoring-plan-remarks-59': 'Remarks:',

        // On Board Crew Data 60
        'crew-monitoring-plan-crew-no-60': 'No:',
        'crew-monitoring-plan-vessel-name-60': 'Vessel Name:',
        'crew-monitoring-plan-crew-surname-60': 'Crew Surname:',
        'crew-monitoring-plan-crew-first-name-60': 'Crew First Name:',
        'crew-monitoring-plan-rank-60': 'Rank:',
        'crew-monitoring-plan-crew-nationality-60': 'Crew Nationality:',
        'crew-monitoring-plan-joining-date-60': 'Joining Date:',
        'crew-monitoring-plan-contract-completion-date-60': 'Contract Completion Date:',
        'crew-monitoring-plan-current-date-60': 'Current Date:',
        'crew-monitoring-plan-days-to-completion-60': 'Days to Contract Completion:',
        'crew-monitoring-plan-months-on-board-60': 'No of Months On Board:',

        // Crew Change Data 60
        'crew-monitoring-plan-vessel-60': 'Vessel:',
        'crew-monitoring-plan-port-60': 'Port:',
        'crew-monitoring-plan-country-60': 'Country:',
        'crew-monitoring-plan-joiners-boarding-date-60': 'Date of Joiners Boarding:',
        'crew-monitoring-plan-offsigners-signoff-date-60': 'Date of Off-signers Sign Off:',
        'crew-monitoring-plan-joiners-rank-60': 'Joiners Ranks:',
        'crew-monitoring-plan-offsigners-rank-60': 'Off-Signers Ranks:',
        'crew-monitoring-plan-total-crew-change-60': 'Total Crew Change:',
        'crew-monitoring-plan-reason-for-change-60': 'Reason for Change:',
        'crew-monitoring-plan-remarks-60': 'Remarks:',

        // Crew Monitoring Plan Master
        'crew-monitoring-plan-master-name': 'Master:'
        },

        'voyagereport': {

        // Voyage Details DataGroup
        'voyage-report-vessel-name': 'Vessel Name:',
        'voyage-report-vessel-no': 'Voyage No:',
        'voyage-report-date': 'Date:',
        
        // Location DataGroup
        'voyage-report-port-departure-cosp': 'Port of Departure COSP (Date and UTC):',
        'voyage-report-port-arrival-eosp': 'Port of Arrival EOSP (Date and UTC):',
        
        // Off Hire DataGroup
        'voyage-report-offhire-hrs': 'Off Hire Hours (Hrs):',
        'voyage-report-offhire-reason': 'Off Hire Reason:',
        
        // Engine DataGroup
        'voyage-report-avg-merpm': 'Avg ME RPM:',
        'voyage-report-avg-mekw': 'Avg ME kW:',
        'voyage-report-tdr': 'TDR (Nm):',
        'voyage-report-tst': 'TST (Hrs):',
        'voyage-report-slip': 'Slip (pct):',
        
        // ROB DataGroup
        'voyage-report-hsfo': 'HSFO (MT):',
        'voyage-report-vlsfo': 'VLSFO (MT):',
        'voyage-report-biofuel': 'BIO FUEL (MT):',
        'voyage-report-lsmgo': 'LSMGO (MT):',
        'voyage-report-me-cc-oil': 'ME CC Oil (Litres):',
        'voyage-report-me-cyl-oil': 'ME CYL Oil (Litres):',
        'voyage-report-ge-cc-oil': 'GE CC Oil (Litres):',
        'voyage-report-fw': 'FW (MT):',
        'voyage-report-fw-produced': 'FW Produced (Litres):',
        
        // Received DataGroup
        'voyage-report-received-hsfo': 'Received HSFO (MT):',
        'voyage-report-received-vlsfo': 'Received VLSFO (MT):',
        'voyage-report-received-biofuel': 'Received BIO FUEL (MT):',
        'voyage-report-received-lsmgo': 'Received LSMGO (MT):',
        'voyage-report-received-me-cc': 'Received ME CC Oil (Litres):',
        'voyage-report-received-me-cyl-oil': 'Received ME CYL Oil (Litres):',
        'voyage-report-received-ge-cc-oil': 'Received GE CC Oil (Litres):',
        'voyage-report-received-fw': 'Received FW (MT):',
        
        // Consumption DataGroup
        'voyage-report-consumption-hsfo': 'Consumption HSFO (MT):',
        'voyage-report-consumption-vlsfo': 'Consumption VLSFO (MT):',
        'voyage-report-consumption-biofuel': 'Consumption BIO FUEL (MT):',
        'voyage-report-consumption-lsmgo': 'Consumption LSMGO (MT):',
        'voyage-report-consumption-me-cc': 'Consumption ME CC Oil (Litres):',
        'voyage-report-consumption-me-cyl-oil': 'Consumption ME CYL Oil (Litres):',
        'voyage-report-consumption-ge-cc-oil': 'Consumption GE CC Oil (Litres):',
        'voyage-report-consumption-fw': 'Consumption FW (MT):',
        
        // Remarks DataGroup
        'voyage-report-remarks': 'Remarks:',
        
        // Master's Name DataGroup
        'voyage-report-master-name': 'Masters Name:'
        },

        'kpi': {

        // Vessel Information
        'kpi-vessel-name': 'Vessel Name:',
        'kpi-fleet': 'Fleet:',
        'kpi-vessel-type': 'Vessel Type:',
        'kpi-reporting-period': 'Reporting Period:',
        
        // Waste Management
        'kpi-plastics-ashore': 'Plastics - Total Landed Ashore (m3):',
        'kpi-plastics-incinerated': 'Plastics - Total Incinerated (m3):',
        'kpi-food-sea': 'Food Waste - Total Disposed at Sea (m3):',
        'kpi-food-ashore': 'Food Waste - Total Landed Ashore (m3):',
        'kpi-domestic-ashore': 'Domestic Waste - Total Landed Ashore (m3):',
        'kpi-domestic-incinerated': 'Domestic Waste - Total Incinerated (m3):',
        'kpi-oil-ashore': 'Cooking Oil - Total Landed Ashore (m3):',
        'kpi-oil-incinerated': 'Cooking Oil - Total Incinerated (m3):',
        'kpi-ash-ashore': 'Incinerator Ash - Total Landed Ashore (m3):',
        'kpi-ash-incinerated': 'Incinerator Ash - Total Incinerated (m3):',
        'kpi-operational-ashore': 'Operational Wastes - Total Landed Ashore (m3):',
        'kpi-operational-incinerated': 'Operational Wastes - Total Incinerated (m3):',
        'kpi-ewaste-ashore': 'E-Waste - Total Landed Ashore (m3):',
        'kpi-cargo-ashore': 'Cargo Residues - Total Landed Ashore (m3):',
        'kpi-garbage-sea': 'Total Garbage Disposed at Sea (m3):',
        'kpi-garbage-ashore': 'Total Garbage Landed Ashore (m3):',
        'kpi-sludge-ashore': 'Sludge - Total Landed Ashore (m3):',
        'kpi-sludge-incinerated': 'Sludge - Total Incinerated (m3):',
        'kpi-sludge-generated': 'Sludge - Total Quantity Generated (m3):',
        'kpi-fuel-consumed': 'Total Fuel Consumed (MT):',
        'kpi-sludge-ratio': 'Ratio of Sludge Generated to Bunkers Consumed:',
        'kpi-sludge-remarks': 'Sludge Remarks (if target exceeded):',
        'kpi-bilge-ows': 'Total Bilge Water Discharged Through OWS (m3):',
        'kpi-bilge-ashore': 'Total Bilge Water Landed to Shore (m3):',
        'kpi-bilge-generated': 'Total Bilge Water Generated (m3):',
        'kpi-paper-consumption': 'Paper Consumption (reams):',
        'kpi-cartridges-consumed': 'Printer Cartridges (units):',
        'kpi-consumption-remarks': 'Consumption Remarks (if target exceeded):',
        'kpi-fresh-generated': 'Fresh Water Generated (m3):',
        'kpi-fresh-consumed': 'Fresh Water Consumed (m3):',
        'kpi-ballast-exchanges': 'Number of Ballast Water Exchanges Performed:',
        'kpi-ballast-operations': 'Number of Ballast Operations:',
        'kpi-deballast-operations': 'Number of De-Ballast Operations:',
        'kpi-ballast-intake': 'Total Water Intake During Ballasting (m3):',
        'kpi-deballast-out': 'Total Water Out During De-Ballasting (m3):',
        'kpi-ballast-exchange-amount': 'Total Ballast Water Exchange Amount (m3):',
        'kpi-propeller-cleanings': 'Total Number of Propeller Cleanings:',
        'kpi-hull-cleanings': 'Total Number of Hull Cleanings:',
        
        // Voyage
        'kpi-sailing-days-total': 'Total Sailing Days:',
        'kpi-sailing-days-eco': 'Eco Speed Sailing Days:',
        'kpi-sailing-days-full': 'Full Speed Sailing Days:',
        
        // Crew
        'kpi-crew-fatalities': 'No. of Fatalities:',
        'kpi-crew-lti': 'LTI (Lost Time Injuries):',
        'kpi-crew-injuries': 'No. of Recordable Injuries:',
        
        // MACN
        'kpi-macn-corruption': 'No. of Corruption/Bribery/Entertainment for Port Officials:',
        
        // Inspection
        'kpi-psc-inspections': 'Number of PSC Inspections:',
        'kpi-psc-deficiencies': 'PSC No. of Deficiencies:',
        'kpi-psc-detentions': 'PSC Detentions (if any):',
        'kpi-flag-inspections': 'Number of Flag State Inspections:',
        'kpi-flag-deficiencies': 'Flag No. of Deficiencies:',
        'kpi-third-party-inspections': 'Third Party Inspections (Charterers, Owners, RISQ, Others):',
        'kpi-third-party-deficiencies': 'Third Party No. of Deficiencies:',
        
        // Overall Remarks
        'voyage-overall-remarks': 'Overall Remarks:',
        
        // Master's Name
        'kpi-master-name': 'Masters Name:'
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
            'diesel-engine-dg1-run-hours': 'DIESEL ENGINE'
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
        },

        'crewmonitoringplan': {
        // Crew Monitoring Plan Title
        'crew-monitoring-plan-crew-no-1': 'Crew No 1',
        'crew-monitoring-plan-vessel-1': 'Vessel No 1',
        'crew-monitoring-plan-crew-no-2': 'Crew No 2',
        'crew-monitoring-plan-vessel-2': 'Vessel No 2',
        'crew-monitoring-plan-crew-no-3': 'Crew No 3',
        'crew-monitoring-plan-vessel-3': 'Vessel No 3',
        'crew-monitoring-plan-crew-no-4': 'Crew No 4',
        'crew-monitoring-plan-vessel-4': 'Vessel No 4',
        'crew-monitoring-plan-crew-no-5': 'Crew No 5',
        'crew-monitoring-plan-vessel-5': 'Vessel No 5',
        'crew-monitoring-plan-crew-no-6': 'Crew No 6',
        'crew-monitoring-plan-vessel-6': 'Vessel No 6',
        'crew-monitoring-plan-crew-no-7': 'Crew No 7',
        'crew-monitoring-plan-vessel-7': 'Vessel No 7',
        'crew-monitoring-plan-crew-no-8': 'Crew No 8',
        'crew-monitoring-plan-vessel-8': 'Vessel No 8',
        'crew-monitoring-plan-crew-no-9': 'Crew No 9',
        'crew-monitoring-plan-vessel-9': 'Vessel No 9',
        'crew-monitoring-plan-crew-no-10': 'Crew No 10',
        'crew-monitoring-plan-vessel-10': 'Vessel No 10',
        'crew-monitoring-plan-crew-no-11': 'Crew No 11',
        'crew-monitoring-plan-vessel-11': 'Vessel No 11',
        'crew-monitoring-plan-crew-no-12': 'Crew No 12',
        'crew-monitoring-plan-vessel-12': 'Vessel No 12',
        'crew-monitoring-plan-crew-no-13': 'Crew No 13',
        'crew-monitoring-plan-vessel-13': 'Vessel No 13',
        'crew-monitoring-plan-crew-no-14': 'Crew No 14',
        'crew-monitoring-plan-vessel-14': 'Vessel No 14',
        'crew-monitoring-plan-crew-no-15': 'Crew No 15',
        'crew-monitoring-plan-vessel-15': 'Vessel No 15',
        'crew-monitoring-plan-crew-no-16': 'Crew No 16',
        'crew-monitoring-plan-vessel-16': 'Vessel No 16',
        'crew-monitoring-plan-crew-no-17': 'Crew No 17',
        'crew-monitoring-plan-vessel-17': 'Vessel No 17',
        'crew-monitoring-plan-crew-no-18': 'Crew No 18',
        'crew-monitoring-plan-vessel-18': 'Vessel No 18',
        'crew-monitoring-plan-crew-no-19': 'Crew No 19',
        'crew-monitoring-plan-vessel-19': 'Vessel No 19',
        'crew-monitoring-plan-crew-no-20': 'Crew No 20',
        'crew-monitoring-plan-vessel-20': 'Vessel No 20',
        'crew-monitoring-plan-crew-no-21': 'Crew No 21',
        'crew-monitoring-plan-vessel-21': 'Vessel No 21',
        'crew-monitoring-plan-crew-no-22': 'Crew No 22',
        'crew-monitoring-plan-vessel-22': 'Vessel No 22',
        'crew-monitoring-plan-crew-no-23': 'Crew No 23',
        'crew-monitoring-plan-vessel-23': 'Vessel No 23',
        'crew-monitoring-plan-crew-no-24': 'Crew No 24',
        'crew-monitoring-plan-vessel-24': 'Vessel No 24',
        'crew-monitoring-plan-crew-no-25': 'Crew No 25',
        'crew-monitoring-plan-vessel-25': 'Vessel No 25',
        'crew-monitoring-plan-crew-no-26': 'Crew No 26',
        'crew-monitoring-plan-vessel-26': 'Vessel No 26',
        'crew-monitoring-plan-crew-no-27': 'Crew No 27',
        'crew-monitoring-plan-vessel-27': 'Vessel No 27',
        'crew-monitoring-plan-crew-no-28': 'Crew No 28',
        'crew-monitoring-plan-vessel-28': 'Vessel No 28',
        'crew-monitoring-plan-crew-no-29': 'Crew No 29',
        'crew-monitoring-plan-vessel-29': 'Vessel No 29',
        'crew-monitoring-plan-crew-no-30': 'Crew No 30',
        'crew-monitoring-plan-vessel-30': 'Vessel No 30',
        'crew-monitoring-plan-crew-no-31': 'Crew No 31',
        'crew-monitoring-plan-vessel-31': 'Vessel No 31',
        'crew-monitoring-plan-crew-no-32': 'Crew No 32',
        'crew-monitoring-plan-vessel-32': 'Vessel No 32',
        'crew-monitoring-plan-crew-no-33': 'Crew No 33',
        'crew-monitoring-plan-vessel-33': 'Vessel No 33',
        'crew-monitoring-plan-crew-no-34': 'Crew No 34',
        'crew-monitoring-plan-vessel-34': 'Vessel No 34',
        'crew-monitoring-plan-crew-no-35': 'Crew No 35',
        'crew-monitoring-plan-vessel-35': 'Vessel No 35',
        'crew-monitoring-plan-crew-no-36': 'Crew No 36',
        'crew-monitoring-plan-vessel-36': 'Vessel No 36',
        'crew-monitoring-plan-crew-no-37': 'Crew No 37',
        'crew-monitoring-plan-vessel-37': 'Vessel No 37',
        'crew-monitoring-plan-crew-no-38': 'Crew No 38',
        'crew-monitoring-plan-vessel-38': 'Vessel No 38',
        'crew-monitoring-plan-crew-no-39': 'Crew No 39',
        'crew-monitoring-plan-vessel-39': 'Vessel No 39',
        'crew-monitoring-plan-crew-no-40': 'Crew No 40',
        'crew-monitoring-plan-vessel-40': 'Vessel No 40',
        'crew-monitoring-plan-crew-no-41': 'Crew No 41',
        'crew-monitoring-plan-vessel-41': 'Vessel No 41',
        'crew-monitoring-plan-crew-no-42': 'Crew No 42',
        'crew-monitoring-plan-vessel-42': 'Vessel No 42',
        'crew-monitoring-plan-crew-no-43': 'Crew No 43',
        'crew-monitoring-plan-vessel-43': 'Vessel No 43',
        'crew-monitoring-plan-crew-no-44': 'Crew No 44',
        'crew-monitoring-plan-vessel-44': 'Vessel No 44',
        'crew-monitoring-plan-crew-no-45': 'Crew No 45',
        'crew-monitoring-plan-vessel-45': 'Vessel No 45',
        'crew-monitoring-plan-crew-no-46': 'Crew No 46',
        'crew-monitoring-plan-vessel-46': 'Vessel No 46',
        'crew-monitoring-plan-crew-no-47': 'Crew No 47',
        'crew-monitoring-plan-vessel-47': 'Vessel No 47',
        'crew-monitoring-plan-crew-no-48': 'Crew No 48',
        'crew-monitoring-plan-vessel-48': 'Vessel No 48',
        'crew-monitoring-plan-crew-no-49': 'Crew No 49',
        'crew-monitoring-plan-vessel-49': 'Vessel No 49',
        'crew-monitoring-plan-crew-no-50': 'Crew No 50',
        'crew-monitoring-plan-vessel-50': 'Vessel No 50',
        'crew-monitoring-plan-crew-no-51': 'Crew No 51',
        'crew-monitoring-plan-vessel-51': 'Vessel No 51',
        'crew-monitoring-plan-crew-no-52': 'Crew No 52',
        'crew-monitoring-plan-vessel-52': 'Vessel No 52',
        'crew-monitoring-plan-crew-no-53': 'Crew No 53',
        'crew-monitoring-plan-vessel-53': 'Vessel No 53',
        'crew-monitoring-plan-crew-no-54': 'Crew No 54',
        'crew-monitoring-plan-vessel-54': 'Vessel No 54',
        'crew-monitoring-plan-crew-no-55': 'Crew No 55',
        'crew-monitoring-plan-vessel-55': 'Vessel No 55',
        'crew-monitoring-plan-crew-no-56': 'Crew No 56',
        'crew-monitoring-plan-vessel-56': 'Vessel No 56',
        'crew-monitoring-plan-crew-no-57': 'Crew No 57',
        'crew-monitoring-plan-vessel-57': 'Vessel No 57',
        'crew-monitoring-plan-crew-no-58': 'Crew No 58',
        'crew-monitoring-plan-vessel-58': 'Vessel No 58',
        'crew-monitoring-plan-crew-no-59': 'Crew No 59',
        'crew-monitoring-plan-vessel-59': 'Vessel No 59',
        'crew-monitoring-plan-crew-no-60': 'Crew No 60',
        'crew-monitoring-plan-vessel-60': 'Vessel No 60'
        },

        'voyagereport': {
            'voyage-report-vessel-name': 'VOYAGE DETAILS',
            'voyage-report-port-departure-cosp': 'LOCATION',
            'voyage-report-offhire-hrs': 'OFF HIRE',
            'voyage-report-avg-merpm': 'ENGINE',
            'voyage-report-hsfo': 'ROB',
            'voyage-report-received-hsfo': 'RECEIVED',
            'voyage-report-consumption-hsfo': 'CONSUMPTION',
            'voyage-report-remarks': 'MASTER REMARKS',
        },

        'kpi': {
            'kpi-vessel-name': 'VESSEL INFORMATION',
            'kpi-plastics-ashore': 'WASTE MANAGEMENT',
            'kpi-sailing-days-total': 'VOYAGE',    
            'kpi-crew-fatalities': 'CREW',
            'kpi-macn-corruption': 'MACN',
            'kpi-psc-inspections': 'INSPECTION',
            'voyage-overall-remarks': 'OVERALL REMARKS',
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
            'diesel-engine-dg3-run-hours'
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

        ],

        'crewmonitoringplan': [
        // Crew No 1 to 60 Months on Board and Remarks
        'crew-monitoring-plan-months-on-board-1',
        'crew-monitoring-plan-remarks-1',
        'crew-monitoring-plan-months-on-board-2',
        'crew-monitoring-plan-remarks-2',
        'crew-monitoring-plan-months-on-board-3',
        'crew-monitoring-plan-remarks-3',
        'crew-monitoring-plan-months-on-board-4',
        'crew-monitoring-plan-remarks-4',
        'crew-monitoring-plan-months-on-board-5',
        'crew-monitoring-plan-remarks-5',
        'crew-monitoring-plan-months-on-board-6',
        'crew-monitoring-plan-remarks-6',
        'crew-monitoring-plan-months-on-board-7',
        'crew-monitoring-plan-remarks-7',
        'crew-monitoring-plan-months-on-board-8',
        'crew-monitoring-plan-remarks-8',
        'crew-monitoring-plan-months-on-board-9',
        'crew-monitoring-plan-remarks-9',
        'crew-monitoring-plan-months-on-board-10',
        'crew-monitoring-plan-remarks-10',
        'crew-monitoring-plan-months-on-board-11',
        'crew-monitoring-plan-remarks-11',
        'crew-monitoring-plan-months-on-board-12',
        'crew-monitoring-plan-remarks-12',
        'crew-monitoring-plan-months-on-board-13',
        'crew-monitoring-plan-remarks-13',
        'crew-monitoring-plan-months-on-board-14',
        'crew-monitoring-plan-remarks-14',
        'crew-monitoring-plan-months-on-board-15',
        'crew-monitoring-plan-remarks-15',
        'crew-monitoring-plan-months-on-board-16',
        'crew-monitoring-plan-remarks-16',
        'crew-monitoring-plan-months-on-board-17',
        'crew-monitoring-plan-remarks-17',
        'crew-monitoring-plan-months-on-board-18',
        'crew-monitoring-plan-remarks-18',
        'crew-monitoring-plan-months-on-board-19',
        'crew-monitoring-plan-remarks-19',
        'crew-monitoring-plan-months-on-board-20',
        'crew-monitoring-plan-remarks-20',
        'crew-monitoring-plan-months-on-board-21',
        'crew-monitoring-plan-remarks-21',
        'crew-monitoring-plan-months-on-board-22',
        'crew-monitoring-plan-remarks-22',
        'crew-monitoring-plan-months-on-board-23',
        'crew-monitoring-plan-remarks-23',
        'crew-monitoring-plan-months-on-board-24',
        'crew-monitoring-plan-remarks-24',
        'crew-monitoring-plan-months-on-board-25',
        'crew-monitoring-plan-remarks-25',
        'crew-monitoring-plan-months-on-board-26',
        'crew-monitoring-plan-remarks-26',
        'crew-monitoring-plan-months-on-board-27',
        'crew-monitoring-plan-remarks-27',
        'crew-monitoring-plan-months-on-board-28',
        'crew-monitoring-plan-remarks-28',
        'crew-monitoring-plan-months-on-board-29',
        'crew-monitoring-plan-remarks-29',
        'crew-monitoring-plan-months-on-board-30',
        'crew-monitoring-plan-remarks-30',
        'crew-monitoring-plan-months-on-board-31',
        'crew-monitoring-plan-remarks-31',
        'crew-monitoring-plan-months-on-board-32',
        'crew-monitoring-plan-remarks-32',
        'crew-monitoring-plan-months-on-board-33',
        'crew-monitoring-plan-remarks-33',
        'crew-monitoring-plan-months-on-board-34',
        'crew-monitoring-plan-remarks-34',
        'crew-monitoring-plan-months-on-board-35',
        'crew-monitoring-plan-remarks-35',
        'crew-monitoring-plan-months-on-board-36',
        'crew-monitoring-plan-remarks-36',
        'crew-monitoring-plan-months-on-board-37',
        'crew-monitoring-plan-remarks-37',
        'crew-monitoring-plan-months-on-board-38',
        'crew-monitoring-plan-remarks-38',
        'crew-monitoring-plan-months-on-board-39',
        'crew-monitoring-plan-remarks-39',
        'crew-monitoring-plan-months-on-board-40',
        'crew-monitoring-plan-remarks-40',
        'crew-monitoring-plan-months-on-board-41',
        'crew-monitoring-plan-remarks-41',
        'crew-monitoring-plan-months-on-board-42',
        'crew-monitoring-plan-remarks-42',
        'crew-monitoring-plan-months-on-board-43',
        'crew-monitoring-plan-remarks-43',
        'crew-monitoring-plan-months-on-board-44',
        'crew-monitoring-plan-remarks-44',
        'crew-monitoring-plan-months-on-board-45',
        'crew-monitoring-plan-remarks-45',
        'crew-monitoring-plan-months-on-board-46',
        'crew-monitoring-plan-remarks-46',
        'crew-monitoring-plan-months-on-board-47',
        'crew-monitoring-plan-remarks-47',
        'crew-monitoring-plan-months-on-board-48',
        'crew-monitoring-plan-remarks-48',
        'crew-monitoring-plan-months-on-board-49',
        'crew-monitoring-plan-remarks-49',
        'crew-monitoring-plan-months-on-board-50',
        'crew-monitoring-plan-remarks-50',
        'crew-monitoring-plan-months-on-board-51',
        'crew-monitoring-plan-remarks-51',
        'crew-monitoring-plan-months-on-board-52',
        'crew-monitoring-plan-remarks-52',
        'crew-monitoring-plan-months-on-board-53',
        'crew-monitoring-plan-remarks-53',
        'crew-monitoring-plan-months-on-board-54',
        'crew-monitoring-plan-remarks-54',
        'crew-monitoring-plan-months-on-board-55',
        'crew-monitoring-plan-remarks-55',
        'crew-monitoring-plan-months-on-board-56',
        'crew-monitoring-plan-remarks-56',
        'crew-monitoring-plan-months-on-board-57',
        'crew-monitoring-plan-remarks-57',
        'crew-monitoring-plan-months-on-board-58',
        'crew-monitoring-plan-remarks-58',
        'crew-monitoring-plan-months-on-board-59',
        'crew-monitoring-plan-remarks-59',
        'crew-monitoring-plan-months-on-board-60',
        'crew-monitoring-plan-remarks-60'
        ],

        'voyagereport': [
            'voyage-report-date',
            'voyage-report-port-arrival-eosp',
            'voyage-report-offhire-reason',
            'voyage-report-slip',
            'voyage-report-fw-produced',
            'voyage-report-received-fw',
            'voyage-report-consumption-fw'
        ],

        'kpi': [
            'kpi-reporting-period',
            'kpi-hull-cleanings',
            'kpi-sailing-days-full',
            'kpi-crew-injuries',
            'kpi-macn-corruption',
            'kpi-third-party-deficiencies'
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
                        <div id="crew-monitoring-plan-port-results-${crewCounter}" class="crew-monitoring-plan-port-results"></div>
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

    // Add the port search functionality for Weekly Schedule Report fields
    setupPortSearch('weekly-schedule-details-port-' + portSetNumber, 'weekly-schedule-details-port-' + portSetNumber + '-results');
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
function setupPortSearch(inputId, resultsId) {
    let portList = [];
    console.log("Hello " +inputId);
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



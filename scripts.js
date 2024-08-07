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
});

// Function to add custom validation for select elements
function addCustomValidationForSelectElements() {
    const selectElements = document.querySelectorAll('select[required]');
    selectElements.forEach(select => {
        select.addEventListener('change', function() {
            if (this.value === '-1') {
                alert('Please choose another option');
            }
        });
    });
}

function handleReportTypeChange(reportType) {
    const sections = document.querySelectorAll('.dynamic-section');
    sections.forEach(section => section.style.display = 'none');
    
    if (reportType === 'at-sea') {
        document.getElementById('at-sea-section').style.display = 'block';
    } else if (reportType === 'in-port') {
        document.getElementById('in-port-section').style.display = 'block';
    } else if (reportType === 'in-transit') {
        document.getElementById('in-transit-section').style.display = 'block';
    }
}

// Function to export data to excel form
function exportToExcel(reportId) {
    const form = document.querySelector(`#${reportId} form`);
    const formData = new FormData(form);
    const data = [];

    // Highlighted change: Determine the report type
    const reportType = reportId.toLowerCase();

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
            'noon-details-since-last-report-me-revs-counter': 'M/E Revs Counter (Noon to Noon):',
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
            'noon-rob-details-tank-1-fuel-grade': 'Tank 1 Fuel Grade:',
            'noon-rob-details-tank-1-rob': 'Tank 1 ROB:',
            'noon-rob-details-tank-1-date-time': 'Tank 1 Date/Time:',
            'noon-rob-details-tank-2-fuel-grade': 'Tank 2 Fuel Grade:',
            'noon-rob-details-tank-2-port': 'Tank 2 Port:',
            'noon-rob-details-tank-2-date-time': 'Tank 2 Date/Time:',
            'noon-rob-details-tank-3-fuel-grade': 'Tank 3 Fuel Grade:',
            'noon-rob-details-tank-3-stbd-rob': 'Tank 3 STBD ROB:',
            'noon-rob-details-tank-3-date-time': 'Tank 3 Date/Time:',
            'noon-rob-details-tank-4-fuel-grade': 'Tank 4 Fuel Grade:',
            'noon-rob-details-tank-4-port-rob': 'Tank 4 Port ROB:',
            'noon-rob-details-tank-4-date-time': 'Tank 4 Date/Time:',
            'noon-rob-details-tank-5-fuel-grade': 'Tank 5 Fuel Grade:',
            'noon-rob-details-tank-5-rob': 'Tank 5 ROB:',
            'noon-rob-details-tank-5-date-time': 'Tank 5 Date/Time:',
            'noon-rob-details-tank-6-fuel-grade': 'Tank 6 Fuel Grade:',
            'noon-rob-details-tank-6-rob': 'Tank 6 ROB:',
            'noon-rob-details-tank-6-date-time': 'Tank 6 Date/Time:',
            'noon-rob-details-tank-7-fuel-grade': 'Tank 7 Fuel Grade:',
            'noon-rob-details-tank-7-rob': 'Tank 7 ROB:',
            'noon-rob-details-tank-7-date-time': 'Tank 7 Date/Time:',
            'noon-rob-details-tank-8-fuel-grade': 'Tank 8 Fuel Grade:',
            'noon-rob-details-tank-8-rob': 'Tank 8 ROB:',
            'noon-rob-details-tank-8-date-time': 'Tank 8 Date/Time:',
            'noon-rob-details-tank-9-fuel-grade': 'Tank 9 Fuel Grade:',
            'noon-rob-details-tank-9-rob': 'Tank 9 ROB:',
            'noon-rob-details-tank-9-date-time': 'Tank 9 Date/Time:',
            'noon-rob-details-tank-10-fuel-grade': 'Tank 10 Fuel Grade:',
            'noon-rob-details-tank-10-rob': 'Tank 10 ROB:',
            'noon-rob-details-tank-10-date-time': 'Tank 10 Date/Time:',
            'noon-rob-details-tank-11-fuel-grade': 'Tank 11 Fuel Grade:',
            'noon-rob-details-tank-11-rob': 'Tank 11 ROB:',
            'noon-rob-details-tank-11-date-time': 'Tank 11 Date/Time:',
            'noon-rob-details-tank-12-fuel-grade': 'Tank 12 Fuel Grade:',
            'noon-rob-details-tank-12-rob': 'Tank 12 ROB:',
            'noon-rob-details-tank-12-date-time': 'Tank 12 Date/Time:',
            'noon-rob-details-tank-13-fuel-grade': 'Tank 13 Fuel Grade:',
            'noon-rob-details-tank-13-rob': 'Tank 13 ROB:',
            'noon-rob-details-tank-13-date-time': 'Tank 13 Date/Time:',

            // Noon HSFO (MT)	
            'noon-hsfo-previous': 'HSFO Previous:',
            'noon-hsfo-current': 'HSFO Current:',
            'noon-hsfo-me-propulsion': 'HSFO ME Propulsion:',
            'noon-hsfo-standard-ae-cons': 'HSFO Standard AE Cons:',
            'noon-hsfo-standard-boiler-cons': 'HSFO Standard Boiler Cons:',
            'noon-hsfo-incinerators': 'HSFO Incinerators:',
            'noon-hsfo-me-24': 'HSFO ME 24:',
            'noon-hsfo-ae-24': 'HSFO AE 24:',
            'noon-hsfo-total-cons': 'HSFO Total Cons:',

            // Noon LSFO (MT)	
            'noon-lsfo-previous': 'LSFO Previous:',
            'noon-lsfo-current': 'LSFO Current:',
            'noon-lsfo-me-propulsion': 'LSFO ME Propulsion:',
            'noon-lsfo-standard-ae-cons': 'LSFO Standard AE Cons:',
            'noon-lsfo-standard-boiler-cons': 'LSFO Standard Boiler Cons:',
            'noon-lsfo-incinerators': 'LSFO Incinerators:',
            'noon-lsfo-me-24': 'LSFO ME 24:',
            'noon-lsfo-ae-24': 'LSFO AE 24:',
            'noon-lsfo-total-cons': 'LSFO Total Cons:',

            // Noon VLSFO (MT)	
            'noon-vlsfo-previous': 'VLSFO Previous:',
            'noon-vlsfo-current': 'VLSFO Current:',
            'noon-vlsfo-me-propulsion': 'VLSFO ME Propulsion:',
            'noon-vlsfo-standard-ae-cons': 'VLSFO Standard AE Cons:',
            'noon-vlsfo-standard-boiler-cons': 'VLSFO Standard Boiler Cons:',
            'noon-vlsfo-incinerators': 'VLSFO Incinerators:',
            'noon-vlsfo-me-24': 'VLSFO ME 24:',
            'noon-vlsfo-ae-24': 'VLSFO AE 24:',
            'noon-vlsfo-total-cons': 'VLSFO Total Cons:',

            // Noon LSMGO (MT)	
            'noon-lsmgo-previous': 'LSMGO Previous:',
            'noon-lsmgo-current': 'LSMGO Current:',
            'noon-lsmgo-me-propulsion': 'LSMGO ME Propulsion:',
            'noon-lsmgo-standard-ae-cons': 'LSMGO Standard AE Cons:',
            'noon-lsmgo-standard-boiler-cons': 'LSMGO Standard Boiler Cons:',
            'noon-lsmgo-incinerators': 'LSMGO Incinerators:',
            'noon-lsmgo-me-24': 'LSMGO ME 24:',
            'noon-lsmgo-ae-24': 'LSMGO AE 24:',
            'noon-lsmgo-total-cons': 'LSMGO Total Cons:',

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
            'departure-details-since-last-report-me-revs-counter': 'M/E Revs Counter:',
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

            // Departure Average Weather (Auto Generated)
            'departure-average-weather-wind-force': 'Wind Force (Bft.) (T):',
            'departure-average-weather-swell': 'Swell:',
            'departure-average-weather-sea-currents': 'Sea Currents (Kts) (Rel.):',
            'departure-average-weather-sea-temp': 'Sea Temp (Deg. C):',
            'departure-average-weather-observed-wind-dir': 'Observed Wind Dir. (T):',
            'departure-average-weather-wind-sea-height': 'Wind Sea Height (m):',
            'departure-sea-current-dir': 'Sea Current Direction (Rel.):',
            'departure-swell-height': 'Swell Height (m):',
            'departure-observed-sea-dir': 'Observed Sea Dir. (T):',
            'departure-average-weather-air-temp': 'Air Temp (Deg. C):',
            'departure-average-weather-observed-swell-dir': 'Observed Swell Dir. (T):',
            'departure-average-weather-sea-ds': 'Sea DS:',
            'departure-average-weather-atm-pressure': 'Atm. Pressure (millibar):',

            // Departure Bad Weather Details
            'departure-bad-weather-details-wind-force-since-last-report': 'Wind force (Bft.) >0 hrs (since last report):',
            'departure-bad-weather-details-wind-force-continuous': 'Wind Force (Bft.) (continuous):',
            'departure-bad-weather-details-sea-state-since-last-report': 'Sea State (DS) >0 hrs (since last report):',
            'departure-bad-weather-details-sea-state-continuous': 'Sea State (continuous):',

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

            // Departure ROB Details
            'departure-rob-details-tank-1-fuel-grade': 'Tank 1 Fuel Grade:',
            'departure-rob-details-tank-1-rob': 'Tank 1 ROB:',
            'departure-rob-details-tank-1-date-time': 'Tank 1 Date/Time:',
            'departure-rob-details-tank-2-fuel-grade': 'Tank 2 Fuel Grade:',
            'departure-rob-details-tank-2-rob': 'Tank 2 ROB:',
            'departure-rob-details-tank-2-date-time': 'Tank 2 Date/Time:',
            'departure-rob-details-tank-3-fuel-grade': 'Tank 3 Fuel Grade:',
            'departure-rob-details-tank-3-rob': 'Tank 3 ROB:',
            'departure-rob-details-tank-3-date-time': 'Tank 3 Date/Time:',
            'departure-rob-details-tank-4-fuel-grade': 'Tank 4 Fuel Grade:',
            'departure-rob-details-tank-4-rob': 'Tank 4 ROB:',
            'departure-rob-details-tank-4-date-time': 'Tank 4 Date/Time:',
            'departure-rob-details-tank-5-fuel-grade': 'Tank 5 Fuel Grade:',
            'departure-rob-details-tank-5-rob': 'Tank 5 ROB:',
            'departure-rob-details-tank-5-date-time': 'Tank 5 Date/Time:',
            'departure-rob-details-tank-6-fuel-grade': 'Tank 6 Fuel Grade:',
            'departure-rob-details-tank-6-rob': 'Tank 6 ROB:',
            'departure-rob-details-tank-6-date-time': 'Tank 6 Date/Time:',
            'departure-rob-details-tank-7-fuel-grade': 'Tank 7 Fuel Grade:',
            'departure-rob-details-tank-7-rob': 'Tank 7 ROB:',
            'departure-rob-details-tank-7-date-time': 'Tank 7 Date/Time:',
            'departure-rob-details-tank-8-fuel-grade': 'Tank 8 Fuel Grade:',
            'departure-rob-details-tank-8-rob': 'Tank 8 ROB:',
            'departure-rob-details-tank-8-date-time': 'Tank 8 Date/Time:',
            'departure-rob-details-tank-9-fuel-grade': 'Tank 9 Fuel Grade:',
            'departure-rob-details-tank-9-rob': 'Tank 9 ROB:',
            'departure-rob-details-tank-9-date-time': 'Tank 9 Date/Time:',
            'departure-rob-details-tank-10-fuel-grade': 'Tank 10 Fuel Grade:',
            'departure-rob-details-tank-10-rob': 'Tank 10 ROB:',
            'departure-rob-details-tank-10-date-time': 'Tank 10 Date/Time:',
            'departure-rob-details-tank-11-fuel-grade': 'Tank 11 Fuel Grade:',
            'departure-rob-details-tank-11-rob': 'Tank 11 ROB:',
            'departure-rob-details-tank-11-date-time': 'Tank 11 Date/Time:',
            'departure-rob-details-tank-12-fuel-grade': 'Tank 12 Fuel Grade:',
            'departure-rob-details-tank-12-rob': 'Tank 12 ROB:',
            'departure-rob-details-tank-12-date-time': 'Tank 12 Date/Time:',
            'departure-rob-details-tank-13-fuel-grade': 'Tank 13 Fuel Grade:',
            'departure-rob-details-tank-13-rob': 'Tank 13 ROB:',
            'departure-rob-details-tank-13-date-time': 'Tank 13 Date/Time:',

            // Noon HSFO (MT)
            'departure-hsfo-previous': 'HSFO Previous:',
            'departure-hsfo-current': 'HSFO Current:',
            'departure-hsfo-me-propulsion': 'HSFO ME Propulsion:',
            'departure-hsfo-standard-ae-cons': 'HSFO Standard AE Cons:',
            'departure-hsfo-standard-boiler-cons': 'HSFO Standard Boiler Cons:',
            'departure-hsfo-incinerators': 'HSFO Incinerators:',
            'departure-hsfo-me-24': 'HSFO ME 24:',
            'departure-hsfo-ae-24': 'HSFO AE 24:',
            'departure-hsfo-total-cons': 'HSFO Total Cons:',

            // Noon LSFO (MT)
            'departure-lsfo-previous': 'LSFO Previous:',
            'departure-lsfo-current': 'LSFO Current:',
            'departure-lsfo-me-propulsion': 'LSFO ME Propulsion:',
            'departure-lsfo-standard-ae-cons': 'LSFO Standard AE Cons:',
            'departure-lsfo-standard-boiler-cons': 'LSFO Standard Boiler Cons:',
            'departure-lsfo-incinerators': 'LSFO Incinerators:',
            'departure-lsfo-me-24': 'LSFO ME 24:',
            'departure-lsfo-ae-24': 'LSFO AE 24:',
            'departure-lsfo-total-cons': 'LSFO Total Cons:',

            // Noon VLSFO (MT)
            'departure-vlsfo-previous': 'VLSFO Previous:',
            'departure-vlsfo-current': 'VLSFO Current:',
            'departure-vlsfo-me-propulsion': 'VLSFO ME Propulsion:',
            'departure-vlsfo-standard-ae-cons': 'VLSFO Standard AE Cons:',
            'departure-vlsfo-standard-boiler-cons': 'VLSFO Standard Boiler Cons:',
            'departure-vlsfo-incinerators': 'VLSFO Incinerators:',
            'departure-vlsfo-me-24': 'VLSFO ME 24:',
            'departure-vlsfo-ae-24': 'VLSFO AE 24:',
            'departure-vlsfo-total-cons': 'VLSFO Total Cons:',

            // Noon LSMGO (MT)
            'departure-lsmgo-previous': 'LSMGO Previous:',
            'departure-lsmgo-current': 'LSMGO Current:',
            'departure-lsmgo-me-propulsion': 'LSMGO ME Propulsion:',
            'departure-lsmgo-standard-ae-cons': 'LSMGO Standard AE Cons:',
            'departure-lsmgo-standard-boiler-cons': 'LSMGO Standard Boiler Cons:',
            'departure-lsmgo-incinerators': 'LSMGO Incinerators:',
            'departure-lsmgo-me-24': 'LSMGO ME 24:',
            'departure-lsmgo-ae-24': 'LSMGO AE 24:',
            'departure-lsmgo-total-cons': 'LSMGO Total Cons:',

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

            // Arrival Average Weather (Auto Generated)
            'arrival-average-weather-wind-force': 'Wind Force (Bft.) (T):',
            'arrival-average-weather-swell': 'Swell:',
            'arrival-average-weather-sea-currents': 'Sea Currents (Kts) (Rel.):',
            'arrival-average-weather-sea-temp': 'Sea Temp (Deg. C):',
            'arrival-average-weather-observed-wind-dir': 'Observed Wind Dir. (T):',
            'arrival-average-weather-wind-sea-height': 'Wind Sea Height (m):',
            'arrival-average-weather-sea-current-dir': 'Sea Current Direction (Rel.):',
            'arrival-average-weather-swell-height': 'Swell Height (m):',
            'arrival-average-weather-observed-sea-dir': 'Observed Sea Dir. (T):',
            'arrival-average-weather-air-temp': 'Air Temp (Deg. C):',
            'arrival-average-weather-observed-swell-dir': 'Observed Swell Dir. (T):',
            'arrival-average-weather-sea-ds': 'Sea DS:',
            'arrival-average-weather-atm-pressure': 'Atm. Pressure (millibar):',

            // Arrival Bad Weather Details
            'arrival-bad-weather-details-wind-force-since-last-report': 'Wind force (Bft.) >0 hrs (since last report):',
            'arrival-bad-weather-details-wind-force-continuous': 'Wind Force (Bft.) (continuous):',
            'arrival-bad-weather-details-sea-state-since-last-report': 'Sea State (DS) >0 hrs (since last report):',
            'arrival-bad-weather-details-sea-state-continuous': 'Sea State (continuous):',

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

            // Arrival ROB Details
            'arrival-rob-details-tank-1-fuel-grade': 'Tank 1 Fuel Grade:',
            'arrival-rob-details-tank-1-rob': 'Tank 1 ROB:',
            'arrival-rob-details-tank-1-date-time': 'Tank 1 Date/Time:',
            'arrival-rob-details-tank-2-fuel-grade': 'Tank 2 Fuel Grade:',
            'arrival-rob-details-tank-2-rob': 'Tank 2 ROB:',
            'arrival-rob-details-tank-2-date-time': 'Tank 2 Date/Time:',
            'arrival-rob-details-tank-3-fuel-grade': 'Tank 3 Fuel Grade:',
            'arrival-rob-details-tank-3-rob': 'Tank 3 ROB:',
            'arrival-rob-details-tank-3-date-time': 'Tank 3 Date/Time:',
            'arrival-rob-details-tank-4-fuel-grade': 'Tank 4 Fuel Grade:',
            'arrival-rob-details-tank-4-rob': 'Tank 4 ROB:',
            'arrival-rob-details-tank-4-date-time': 'Tank 4 Date/Time:',
            'arrival-rob-details-tank-5-fuel-grade': 'Tank 5 Fuel Grade:',
            'arrival-rob-details-tank-5-rob': 'Tank 5 ROB:',
            'arrival-rob-details-tank-5-date-time': 'Tank 5 Date/Time:',
            'arrival-rob-details-tank-6-fuel-grade': 'Tank 6 Fuel Grade:',
            'arrival-rob-details-tank-6-rob': 'Tank 6 ROB:',
            'arrival-rob-details-tank-6-date-time': 'Tank 6 Date/Time:',
            'arrival-rob-details-tank-7-fuel-grade': 'Tank 7 Fuel Grade:',
            'arrival-rob-details-tank-7-rob': 'Tank 7 ROB:',
            'arrival-rob-details-tank-7-date-time': 'Tank 7 Date/Time:',
            'arrival-rob-details-tank-8-fuel-grade': 'Tank 8 Fuel Grade:',
            'arrival-rob-details-tank-8-rob': 'Tank 8 ROB:',
            'arrival-rob-details-tank-8-date-time': 'Tank 8 Date/Time:',
            'arrival-rob-details-tank-9-fuel-grade': 'Tank 9 Fuel Grade:',
            'arrival-rob-details-tank-9-rob': 'Tank 9 ROB:',
            'arrival-rob-details-tank-9-date-time': 'Tank 9 Date/Time:',
            'arrival-rob-details-tank-10-fuel-grade': 'Tank 10 Fuel Grade:',
            'arrival-rob-details-tank-10-rob': 'Tank 10 ROB:',
            'arrival-rob-details-tank-10-date-time': 'Tank 10 Date/Time:',
            'arrival-rob-details-tank-11-fuel-grade': 'Tank 11 Fuel Grade:',
            'arrival-rob-details-tank-11-rob': 'Tank 11 ROB:',
            'arrival-rob-details-tank-11-date-time': 'Tank 11 Date/Time:',
            'arrival-rob-details-tank-12-fuel-grade': 'Tank 12 Fuel Grade:',
            'arrival-rob-details-tank-12-rob': 'Tank 12 ROB:',
            'arrival-rob-details-tank-12-date-time': 'Tank 12 Date/Time:',
            'arrival-rob-details-tank-13-fuel-grade': 'Tank 13 Fuel Grade:',
            'arrival-rob-details-tank-13-rob': 'Tank 13 ROB:',
            'arrival-rob-details-tank-13-date-time': 'Tank 13 Date/Time:',

            // Arrival HSFO (MT)
            'arrival-hsfo-previous': 'HSFO Previous:',
            'arrival-hsfo-current': 'HSFO Current:',
            'arrival-hsfo-me-propulsion': 'HSFO ME Propulsion:',
            'arrival-hsfo-standard-ae-cons': 'HSFO Standard AE Cons:',
            'arrival-hsfo-standard-boiler-cons': 'HSFO Standard Boiler Cons:',
            'arrival-hsfo-incinerators': 'HSFO Incinerators:',
            'arrival-hsfo-me-24': 'HSFO ME 24:',
            'arrival-hsfo-ae-24': 'HSFO AE 24:',
            'arrival-hsfo-total-cons': 'HSFO Total Cons:',

            // Arrival LSFO (MT)
            'arrival-lsfo-previous': 'LSFO Previous:',
            'arrival-lsfo-current': 'LSFO Current:',
            'arrival-lsfo-me-propulsion': 'LSFO ME Propulsion:',
            'arrival-lsfo-standard-ae-cons': 'LSFO Standard AE Cons:',
            'arrival-lsfo-standard-boiler-cons': 'LSFO Standard Boiler Cons:',
            'arrival-lsfo-incinerators': 'LSFO Incinerators:',
            'arrival-lsfo-me-24': 'LSFO ME 24:',
            'arrival-lsfo-ae-24': 'LSFO AE 24:',
            'arrival-lsfo-total-cons': 'LSFO Total Cons:',

            // Arrival VLSFO (MT)
            'arrival-vlsfo-previous': 'VLSFO Previous:',
            'arrival-vlsfo-current': 'VLSFO Current:',
            'arrival-vlsfo-me-propulsion': 'VLSFO ME Propulsion:',
            'arrival-vlsfo-standard-ae-cons': 'VLSFO Standard AE Cons:',
            'arrival-vlsfo-standard-boiler-cons': 'VLSFO Standard Boiler Cons:',
            'arrival-vlsfo-incinerators': 'VLSFO Incinerators:',
            'arrival-vlsfo-me-24': 'VLSFO ME 24:',
            'arrival-vlsfo-ae-24': 'VLSFO AE 24:',
            'arrival-vlsfo-total-cons': 'VLSFO Total Cons:',

            // Arrival LSMGO (MT)
            'arrival-lsmgo-previous': 'LSMGO Previous:',
            'arrival-lsmgo-current': 'LSMGO Current:',
            'arrival-lsmgo-me-propulsion': 'LSMGO ME Propulsion:',
            'arrival-lsmgo-standard-ae-cons': 'LSMGO Standard AE Cons:',
            'arrival-lsmgo-standard-boiler-cons': 'LSMGO Standard Boiler Cons:',
            'arrival-lsmgo-incinerators': 'LSMGO Incinerators:',
            'arrival-lsmgo-me-24': 'LSMGO ME 24:',
            'arrival-lsmgo-ae-24': 'LSMGO AE 24:',
            'arrival-lsmgo-total-cons': 'LSMGO Total Cons:',

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
            'bunkering-bunker-type-quantity-taken-lsfo-quantity': 'LSFO Quantity (MT):',
            'bunkering-bunker-type-quantity-taken-lsfo-viscosity': 'LSFO Viscosity (CST):',
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
            'all-fast-voyage-details-port': 'Port:',
            'all-fast-voyage-details-voyage-no': 'Voyage No:',
            'all-fast-voyage-details-datetime': 'All Fast Date/Time (LT):',
            'all-fast-voyage-details-gmt-offset': 'GMT Offset:',

            // All Fast ROBs
            'all-fast-rob-hsfo': 'HSFO (MT):',
            'all-fast-rob-lsfo': 'LSFO (MT):',
            'all-fast-rob-vlsfo': 'VLSFO (MT):',
            'all-fast-rob-lsmgo': 'LSMGO (MT):',
        }
    };

    // Highlighted change: Use the appropriate field labels based on the report type
    const currentFieldLabels = fieldLabels[reportType];

    // Extract necessary values from the form
    // Highlighted change: Update selectors to be dynamic based on the report type
    const vesselNameElement = form.querySelector(`#${reportType}-voyage-details-vessel-name`);
    const vesselName = vesselNameElement ? vesselNameElement.options[vesselNameElement.selectedIndex].text : 'Vessel Name';

    const dateTimeElement = form.querySelector(`#${reportType}-voyage-details-date-time`);
    const date = dateTimeElement ? new Date(dateTimeElement.value) : new Date();
    const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' });

    const reportTypeElement = form.querySelector(`#${reportType}-voyage-details-report-type`);
    const reportTypeText = reportTypeElement ? reportTypeElement.options[reportTypeElement.selectedIndex].text : 'Report Type';

    const title = `${vesselName} / ${formattedDate} / ${reportTypeText}`;

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
            'noon-rob-details-tank-1-fuel-grade': 'ROB Details',
            'noon-hsfo-previous': 'HSFO (MT)',
            'noon-lsfo-previous': 'LSFO (MT)',
            'noon-vlsfo-previous': 'VLSFO (MT)',
            'noon-lsmgo-previous': 'LSMGO (MT)',
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
            'departure-lsfo-previous': 'LSFO (MT)',
            'departure-vlsfo-previous': 'VLSFO (MT)',
            'departure-lsmgo-previous': 'LSMGO (MT)',
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
            'arrival-lsfo-previous': 'LSFO (MT)',
            'arrival-vlsfo-previous': 'VLSFO (MT)',
            'arrival-lsmgo-previous': 'LSMGO (MT)',
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
            'noon-rob-details-tank-13-date-time',
            'noon-hsfo-total-cons',
            'noon-lsfo-total-cons',
            'noon-vlsfo-total-cons',
            'noon-lsmgo-total-cons',
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
            'departure-lsfo-total-cons',
            'departure-vlsfo-total-cons',
            'departure-lsmgo-total-cons'
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
            'arrival-lsfo-total-cons',
            'arrival-vlsfo-total-cons',
            'arrival-lsmgo-total-cons'
        ],

        'bunkering': [
            // Bunkering Report Section Title
            'bunkering-details-bunker-gmt-offset',
            'bunkering-bunker-type-quantity-taken-lsmgo-viscosity',
            'bunkering-associated-information-pumping-completed-gmt-offset'
        ],

        'allfast': [
            // All Fast Section Title
            'all-fast-voyage-details-gmt-offset'
        ]
    };

    // Highlighted change: Use the appropriate sub-titles and blank rows based on the report type
    const currentFieldSubTitles = fieldsWithSubTitles[reportType];
    const currentFieldsWithBlanks = fieldsWithBlanks[reportType];

    // Add form data with sub-titles and blank rows
    formData.forEach((value, key) => {
        // Highlighted change: Insert a sub-title before specific fields
        if (currentFieldSubTitles[key]) {
            data.push([currentFieldSubTitles[key]]);
        }

        // Highlighted change: Use the current field labels based on the report type
        const label = currentFieldLabels[key] || key;
        data.push([label, value]);

        // Highlighted change: Insert a blank row after specific fields
        if (currentFieldsWithBlanks.includes(key)) {
            data.push([""]);
        }
    });

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "FormData");

    // Merge specific cells
    const merges = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } },   // Merge A1 and B1
        { s: { r: 2, c: 0 }, e: { r: 2, c: 1 } },   // Merge A3 and B3
        { s: { r: 12, c: 0 }, e: { r: 12, c: 1 } }, // Merge A13 and B13
        { s: { r: 36, c: 0 }, e: { r: 36, c: 1 } }, // Merge A37 and B37
        { s: { r: 47, c: 0 }, e: { r: 47, c: 1 } }, // Merge A48 and B48
        { s: { r: 55, c: 0 }, e: { r: 55, c: 1 } }, // Merge A56 and B56
        { s: { r: 70, c: 0 }, e: { r: 70, c: 1 } }, // Merge A71 and B71
        { s: { r: 76, c: 0 }, e: { r: 76, c: 1 } }, // Merge A77 and B77
        { s: { r: 85, c: 0 }, e: { r: 85, c: 1 } }, // Merge A86 and B86
        { s: { r: 93, c: 0 }, e: { r: 93, c: 1 } }, // Merge A94 and B94
        { s: { r: 101, c: 0 }, e: { r: 101, c: 1 } }, // Merge A102 and B102
        { s: { r: 142, c: 0 }, e: { r: 142, c: 1 } }, // Merge A143 and B143
        { s: { r: 153, c: 0 }, e: { r: 153, c: 1 } }, // Merge A154 and B154
        { s: { r: 164, c: 0 }, e: { r: 164, c: 1 } }, // Merge A165 and B165
        { s: { r: 175, c: 0 }, e: { r: 175, c: 1 } }, // Merge A176 and B176
        { s: { r: 186, c: 0 }, e: { r: 186, c: 1 } }  // Merge A187 and B187
    ];
    worksheet['!merges'] = merges;
    
    // Set column widths
    const wscols = [
        { wch: 35 }, // Field column width
        { wch: 25 }  // Value column width
    ];
    worksheet['!cols'] = wscols;

    // Generate dynamic filename
    const filenameExportReportType = form.querySelector('#noon-voyage-details-vessel-name');
    const filenameVesselName = filenameExportReportType ? filenameExportReportType.options[filenameExportReportType.selectedIndex].text : 'VesselName';
    const filenameDate = new Date();
    const filenameFormattedDate = filenameDate.toISOString().slice(0, 10).replace(/-/g, '');
    const filename = `${filenameVesselName}-${reportId}-${filenameFormattedDate}-${reportType}.xlsx`;

    XLSX.writeFile(workbook, filename);
    // Highlighted changes end here

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

// Function for clear fields
function clearFields(reportId) {
    const form = document.querySelector(`#${reportId} form`);

    // Clear the form fields after exporting the data
    clearFormFields(reportId);    

    // Clear saved local storage
    localStorage.clear();
    
    document.querySelectorAll('.at-sea-section').forEach(function(element) {
        element.style.display = 'flex';
     });
     document.querySelectorAll('.at-sea-section-fieldset').forEach(function(element) {
        element.style.display = 'block';
     });
     document.querySelectorAll('.in-port-section').forEach(function(element) {
        element.style.display = 'flex';
     });
    
    var elmtTable = document.getElementById('allFastRobTableBody');
    var tableRows = elmtTable.getElementsByTagName('tr');
    var rowCount = tableRows.length;

    for (var x=rowCount-1; x>0; x--) {
        elmtTable.removeChild(tableRows[x]);
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

function addRow() {
    const tableBody = document.getElementById('allFastRobTableBody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td><input type="text" name="hsfo" required></td>
        <td><input type="text" name="lsfo" required></td>
        <td><input type="text" name="vlsfo" required></td>
        <td><input type="text" name="lsmgo" required></td>
        <td><button type="button" class="remove-button" onclick="removeRow(this)">Remove</button></td>
    `;
    tableBody.appendChild(newRow);
}

function removeRow(button) {
    button.closest('tr').remove();
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
function handleReportTypeChange(reportType) {

    if (reportType === 'at-sea') {
        document.querySelectorAll('.in-port-section').forEach(function(element) {
            element.style.display = 'none';
         });
         document.querySelectorAll('.at-sea-section').forEach(function(element) {
            element.style.display = 'flex';
         });
         document.querySelectorAll('.at-sea-section-fieldset').forEach(function(element) {
            element.style.display = 'block';
         });
    } else if (reportType === 'in-port') {
        document.querySelectorAll('.at-sea-section').forEach(function(element) {
            element.style.display = 'none';
         });
         document.querySelectorAll('.at-sea-section-fieldset').forEach(function(element) {
            element.style.display = 'none';
         });
         document.querySelectorAll('.in-port-section').forEach(function(element) {
            element.style.display = 'flex';
         });
    } else if (reportType === 'in-transit') {
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

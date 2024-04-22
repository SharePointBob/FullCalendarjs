<script>
document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridWeek',  // Configures the initial view to show a week grid
        events: [],  // Initialize with an empty array of events
        // Additional configurations can be added here
    });
    calendar.render();

    var teamListMap = {
        "Team1": "Team1CalendarListTitle",
        "Team2": "Team2CalendarListTitle",
        // Additional teams and their calendar list titles
    };

    function fetchEventsForTeam(team) {
        var listTitle = teamListMap[team];
        var today = new Date();
        var nextWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);

        var filterUrl = "/_api/web/lists/GetByTitle('" + listTitle + "')/items?$filter=StartDate ge datetime'" +
                        today.toISOString() + "' and EndDate le datetime'" + nextWeek.toISOString() + "'";

        fetch(_spPageContextInfo.webAbsoluteUrl + filterUrl, {
            method: 'GET',
            headers: {
                "Accept": "application/json; odata=verbose",
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(data => {
            var events = data.d.results.map(item => ({
                title: item.Title,
                start: item.StartDate,
                end: item.EndDate
            }));

            calendar.removeAllEvents();  // Clears all current events
            calendar.addEventSource(events);  // Adds new events
        })
        .catch(error => console.error('Error fetching events:', error));
    }

    // Listen for changes in the dropdown and update the calendar
    document.getElementById('teamDropdown').addEventListener('change', function() {
        fetchEventsForTeam(this.value);
    });

    // Initial load of events based on the default selected team
    fetchEventsForTeam(document.getElementById('teamDropdown').value);
});
</script>
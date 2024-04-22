$(document).ready(function() {
    
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridWeek',  // Display a week view initially
    });
    calendar.render();

    var teamListMap = {
        "Team1": "Team1CalendarListTitle",
        "Team2": "Team2CalendarListTitle",
    };

    function fetchEventsForTeam(team) {
        var listTitle = teamListMap[team]; 
        var today = new Date();
        var nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);

        var filterUrl = "/_api/web/lists/GetByTitle('" + listTitle + "')/items?$filter=StartDate ge datetime'" +
                        today.toISOString() + "' and EndDate le datetime'" + nextWeek.toISOString() + "'";

        $.ajax({
            url: _spPageContextInfo.webAbsoluteUrl + filterUrl,
            type: "GET",
            headers: { "Accept": "application/json; odata=verbose" },
            success: function(data) {
                var events = data.d.results.map(function(item) {
                    return {
                        title: item.Title,  
                        start: item.StartDate, 
                        end: item.EndDate
                    };
                });
                calendar.removeAllEvents();  //Remove existing events
                calendar.addEventSource(events);  //Add new events
            },
            error: function(error) {
                console.error("Error fetching events: ", error);
            }
        });
    }

    $('#teamDropdown').change(function() {
        var selectedTeam = $(this).val();
        fetchEventsForTeam(selectedTeam);
    });

    var initialTeam = $('#teamDropdown').val();
    fetchEventsForTeam(initialTeam);
});

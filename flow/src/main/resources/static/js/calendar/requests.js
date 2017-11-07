/**
 * Created by Admin on 23.10.2017.
 */

function getGoals(initialPosition) {
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/calendar/requests/goals",
        dataType: 'json',
        success: function (goals) {
            calendarInstance.setGoals(goals);
            calendarInstance.currentGoalId = calendarInstance.getGoalIdByPosition(initialPosition);
            getTiles();
        },
        error: function (e) {
            console.log("ERROR: ", e);
        }
    });
}

function getTiles() {
    var goal = calendarInstance.goals[calendarInstance.currentGoalId];

    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/calendar/requests/tiles",
        data: JSON.stringify(goal),
        dataType: 'json',
        success: function (tiles) {
            calendarInstance.setTiles(tiles);
            calendarInstance.generateCalendar();
        },
        error: function (e) {
            console.log("ERROR: ", e);
        }
    });
}

function saveTile(tile) {
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/calendar/requests/tiles/save",
        data: JSON.stringify(tile),
        dataType: 'json',
        success: function () {
            console.log("Kafelek został pomyślnie dodany do bazy!")
        },
        error: function (e) {
            console.log("ERROR: ", e);
        }
    });
}

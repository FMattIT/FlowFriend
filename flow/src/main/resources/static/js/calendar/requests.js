/**
 * Created by Admin on 23.10.2017.
 */

function getGoals() {
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/calendar/requests/goals",
        dataType: 'json',
        async: false,
        success: function (goals) {
            calendarInstance.setGoals(goals);

            let dateHeader = $(".date_header__date");
            dateHeader.html(calendarInstance.currentMonth + ' ' + calendarInstance.currentYear);

            let goalHeader = $(".goal_header__goal_name");
            goalHeader.html(calendarInstance.goals[calendarInstance.getGoalIdByPosition(0)].name);

            calendarInstance.currentGoalId = calendarInstance.getGoalIdByPosition(0);
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
        async: false,
        success: function (tiles) {
            calendarInstance.setTiles(tiles);
        },
        error: function (e) {
            console.log("ERROR: ", e);
        }
    });
}

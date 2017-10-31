/**
 * Created by Admin on 23.10.2017.
 */
$( document ).ready(function() {
    getGoals();
});

function getGoals() {
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/calendar/requests/goals",
        dataType: 'json',
        success: function (goals) {
            calendarInstance.setGoals(goals);

            let dateHeader = $(".date_header__date");
            dateHeader.html(calendarInstance.currentMonth + ' ' + calendarInstance.currentYear);

            let goalHeader = $(".goal_header__goal_name");
            goalHeader.html(calendarInstance.goals[calendarInstance.currentGoalId].name);
        },
        error: function (e) {
            console.log("ERROR: ", e);
        }
    });
}

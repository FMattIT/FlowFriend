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
        },
        error: function (e) {
            console.log("ERROR: ", e);
        }
    });
}

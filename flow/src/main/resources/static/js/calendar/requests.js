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
            calendarInstance.loadGoalsList();
            getTiles();
        },
        error: function (e) {
            console.log("Wystąpił błąd podczas pobierania celów z bazy danych: ", e);
        }
    });
}

function getTiles() {
    let goal = calendarInstance.goals[calendarInstance.currentGoalId];

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
            console.log("Wystąpił błąd podczas pobierania kafelków z bazy danych: ", e);
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
            calendarInstance.loadSavedTileView(tile.flag);
            calendarInstance.hideTilePicker();
            calendarInstance.loadCurrentScore();
            calendarInstance.loadRecordScore();
        },
        error: function (e) {
            console.log("Wystąpił błąd podczas dodawania kafelka do bazy: ", e);
        }
    });
}

function saveGoal(goal, position) {
    goal.position = position;

    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/calendar/requests/goals/save",
        data: JSON.stringify(goal),
        dataType: 'json',
        success: function (goalek) {
            console.log("Cel został pomyślnie dodany do bazy!")
            getGoals(goalek.position);
        },
        error: function (e) {
            console.log("Wystąpił błąd podczas dodawania celu do bazy: ", e);
        }
    });
}

function deleteGoal(goal) {

    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/calendar/requests/goals/delete",
        data: JSON.stringify(goal),
        dataType: 'json',
        success: function () {
            console.log("Cel został pomyślnie usunięty z bazy!")
        },
        error: function (e) {
            console.log("Wystąpił błąd podczas usuwania celu z bazy: ", e);
        }
    });
}

function getCurrentScore(goal) {
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/calendar/requests/tiles/scores/current",
        data: JSON.stringify(goal),
        dataType: 'json',
        success: function (currentScore) {
            console.log("Aktualny wynik został pomyślnie pobrany z serwera!")
            $(".current_score_counter").html(currentScore);
        },
        error: function (e) {
            console.log("Wystąpił błąd podczas pobierania aktualnego wyniu z serwera: ", e);
        }
    });
}

function getRecordScore(goal) {
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/calendar/requests/tiles/scores/record",
        data: JSON.stringify(goal),
        dataType: 'json',
        success: function (recordScore) {
            console.log("Rekordowy wynik został pomyślnie pobrany z serwera!")
            $(".record_score_counter").html(recordScore);
        },
        error: function (e) {
            console.log("Wystąpił błąd podczas pobierania rekordowego wyniu z serwera: ", e);
        }
    });
}

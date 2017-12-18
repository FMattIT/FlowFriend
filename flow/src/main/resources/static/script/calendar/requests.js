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
            if (goals === undefined || goals.length == 0) {
                $(".empty_block").css("display", "inline-block");
                $(".block").css("display", "none");
            }
            else {
                $(".empty_block").css("display", "none");
                $(".block").css("display", "inline-block");
            }

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

function saveGoal(goal, position, advantages, reloadParam) {
    if(goal.name.length > 170 || goal.name.length < 2) {
        alert("Błąd ilości znaków - cel nie może przekroczyć 170 znaków i musi mieć więcej niż 2!");
    }
    else {
        goal.position = position;
        goal.advantages = advantages;

        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "/calendar/requests/goals/save",
            data: JSON.stringify(goal),
            dataType: 'json',
            async: false,
            success: function (goalek) {
                console.log("Cel został pomyślnie dodany do bazy!")
                if(reloadParam === "reloadAll") {
                    getGoals(goalek.position);
                }
                else if(reloadParam === "reloadName") {
                    $(".goal_bar__id:contains('" + calendarInstance.currentGoalId + "')").parent().find('.goal_bar__name').html(goalek.name);
                    $(".goal_header__goal_name").html(goalek.name);
                }
            },
            error: function (e) {
                console.log("Wystąpił błąd podczas dodawania celu do bazy: ", e);
            }
        });
    }
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
            getGoals(0);
        },
        error: function (e) {
            console.log("Wystąpił błąd podczas usuwania celu z bazy: ", e);
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
        success: function (returnedTile) {
            console.log("Kafelek został pomyślnie dodany do bazy!")
            calendarInstance.loadSavedTileView(tile.flag);
            calendarInstance.hideTilePicker();
            calendarInstance.loadCurrentScore();
            calendarInstance.loadRecordScore();
            calendarInstance.updateTiles(returnedTile);
            calendarInstance.createPieChart($(".block__others__chart_type_select").val());
        },
        error: function (e) {
            console.log("Wystąpił błąd podczas dodawania kafelka do bazy: ", e);
        }
    });
}

function getMinusTiles(goal) {
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/calendar/requests/minus/tiles",
        data: JSON.stringify(goal),
        dataType: 'json',
        success: function (minusTiles) {
            console.log("Wyłączone kafelki zostały pomyślnie pobrane z bazy!")
            calendarInstance.fillOffDays(minusTiles);
        },
        error: function (e) {
            console.log("Wystąpił błąd podczas pobierania wyłączonych kafelków: ", e);
        }
    });
}

function saveMinusTiles(minusTiles) {
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/calendar/requests/minus/tiles/save",
        data: JSON.stringify(minusTiles),
        dataType: 'json',
        success: function () {
            console.log("Wyłączony kafelek został pomyślnie dodany do bazy!")
        },
        error: function (e) {
            console.log("Wystąpił błąd podczas dodawania wyłączonego kafelka do bazy: ", e);
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
        type: "POST",        contentType: "application/json",
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

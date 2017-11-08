/**
 * Created by Admin on 23.10.2017.
 */

var calendarInstance = new Calendar(0, 10, 2017);

$( document ).ready(function() {
    getGoals(0);

    $( ".date_header__next_arrow .fa-chevron-right" ).click(function() {
        calendarInstance.setNextMonth();
    });

    $( ".date_header__previous_arrow .fa-chevron-left" ).click(function() {
        calendarInstance.setPreviousMonth();
    });

    $( ".goal_header__next_arrow .fa-chevron-right" ).click(function() {
        calendarInstance.setNextGoal();
    });

    $( ".goal_header__previous_arrow .fa-chevron-left" ).click(function() {
        calendarInstance.setPreviousGoal();
    });
});

function Calendar(currentGoalId, currentMonthId, currentYear) {
    this.months = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
    this.daysInMonths = ['31', '28', '31', '30', '31', '30', '31', '31', '30', '31', '30', '31'];
    this.years = [];
    this.years.push(new Date().getFullYear());
    this.years.push(new Date().getFullYear()+1);

    this.currentGoalId = currentGoalId;
    this.currentMonthId = currentMonthId;
    this.currentMonth = this.months[this.currentMonthId];
    this.currentYear = currentYear;
    this.daysInMonth = this.daysInMonths[this.currentMonthId];

    if((this.currentYear % 4 == 0 &&this.currentYear % 100 != 0) || this.currentYear % 400 == 0){
        this.daysInMonth = 29;
    }

    this.goals;
    this.tiles;
    this.clickedDay;
}

Calendar.prototype.init = function(currentGoalId, currentMonthId, currentYear) {
    this.currentGoalId = currentGoalId;
    this.currentMonthId = currentMonthId;
    this.currentMonth = this.months[this.currentMonthId];
    this.currentYear = currentYear;
    this.daysInMonth = this.daysInMonths[this.currentMonthId];

    if((this.currentYear % 4 == 0 &&this.currentYear % 100 != 0) || this.currentYear % 400 == 0){
        this.daysInMonth = 29;
    }
}

Calendar.prototype.getGoalIdByPosition = function(goalPosition) {
    for (let goalId = 0; goalId <= this.goals.length-1; goalId++) {

        if (this.goals[goalId].position === goalPosition)
        {
            return goalId;
            break;
        }
    }
}

Calendar.prototype.getNextGoalIdByPosition = function() {
    let currentGoalPosition = this.goals[this.currentGoalId].position;
    let newGoalId = this.getGoalIdByPosition(currentGoalPosition+1);
    if( isNaN(newGoalId) ) {
        return this.getGoalIdByPosition(0);
    }
    else {
        return this.getGoalIdByPosition(currentGoalPosition+1);
    }
}

Calendar.prototype.getPreviousGoalIdByPosition = function() {
    let currentGoalPosition = this.goals[this.currentGoalId].position;
    let newGoalId = this.getGoalIdByPosition(currentGoalPosition-1);
    if( isNaN(newGoalId) ) {
        return this.getGoalIdByPosition(this.goals.length-1);
    }
    else {
        return this.getGoalIdByPosition(currentGoalPosition-1);
    }
}

Calendar.prototype.setGoals = function(goals) {
    this.goals = goals;
}

Calendar.prototype.setTiles = function(tiles) {
    this.tiles = tiles;
}

Calendar.prototype.clearTable = function() {
    for(let iterator = 6; iterator >= 1; iterator --) {
        $(".calendar__days__table__row").eq(iterator).remove();
    }
}

Calendar.prototype.updateDateHeader = function() {
    let dateHeader = $(".date_header__date");
    dateHeader.html(this.currentMonth + ' ' + this.currentYear);
}

Calendar.prototype.updateGoalHeader = function() {
    let goalHeader = $(".goal_header__goal_name");
    goalHeader.html(this.goals[this.currentGoalId].name);
}

Calendar.prototype.monthChecker = function() {
    if(this.currentMonthId === 12) {
        this.init(this.currentGoalId, 0, this.currentYear + 1);
    }
    else if(this.currentMonthId === -1) {
        this.init(this.currentGoalId, 11, this.currentYear - 1);
    }
}

Calendar.prototype.setNextMonth = function() {
    this.clearTable();
    this.init(this.currentGoalId, this.currentMonthId + 1, this.currentYear);
    this.monthChecker();
    getTiles();
    this.updateDateHeader();
}

Calendar.prototype.setPreviousMonth = function() {
    this.clearTable();
    this.init(this.currentGoalId, this.currentMonthId - 1, this.currentYear);
    this.monthChecker();
    getTiles();
    this.updateDateHeader();
}

Calendar.prototype.setNextGoal = function() {
    this.clearTable();
    this.init(this.getNextGoalIdByPosition(), this.currentMonthId, this.currentYear);
    getTiles();
    this.updateGoalHeader();
}

Calendar.prototype.setPreviousGoal = function() {
    this.clearTable();
    this.init(this.getPreviousGoalIdByPosition(), this.currentMonthId, this.currentYear);
    getTiles();
    this.updateGoalHeader();
}

Calendar.prototype.showTilePicker = function(target) {
    this.clickedDay = target;
    let picker = $('.tile__picker');

    picker.removeClass('animated zoomOut');
    picker.addClass('animated zoomIn');
    picker.css("display", "block").css("opacity", "1").unbind('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend');
    picker.css( {top:event.pageY - 60, left: event.pageX + 10});
}

Calendar.prototype.hideTilePicker = function() {
    this.clickedDay = null;
    let picker = $('.tile__picker');

    picker.removeClass('zoomIn');
    picker.css("opacity", "0").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
        picker.css("display", "none");
    });
    picker.addClass('zoomOut');
}

Calendar.prototype.loadSavedTileView = function(flag) {
    $(this.clickedDay).removeClass("tick").removeClass("cross").removeClass("yellow_tick").removeClass("minus");

    if(flag=="YELLOWTICK") {
        $(this.clickedDay).addClass("yellow_tick");
    }
    else {
        $(this.clickedDay).addClass(flag.toLowerCase());
    }
}

Calendar.prototype.saveTile = function(target, event, flag) {
    let tile = {};
    tile["day"]=this.clickedDay.innerHTML;
    tile["flag"]=flag;
    tile["goalId"]=this.goals[this.currentGoalId];
    tile["month"]=this.currentMonthId;
    tile["year"]=this.currentYear;

    this.loadSavedTileView(flag);

    saveTile(tile);
    event.stopPropagation();
    this.hideTilePicker();
}

Calendar.prototype.generateTile = function(td, currentlyCreatingDay) {
    for (let iterator = 0; iterator < this.tiles.length; iterator ++) {
        let tile = this.tiles[iterator];
        if (Number(tile.month) === this.currentMonthId && Number(tile.day) === currentlyCreatingDay && String(tile.flag) === "TICK") {
            td.classList.add("tick");
        }
        else if (Number(tile.month) === this.currentMonthId && Number(tile.day) === currentlyCreatingDay && String(tile.flag) === "CROSS") {
            td.classList.add("cross");
        }
        else if (Number(tile.month) === this.currentMonthId && Number(tile.day) === currentlyCreatingDay && String(tile.flag) === "YELLOWTICK") {
            td.classList.add("yellow_tick");
        }
        else if (Number(tile.month) === this.currentMonthId && Number(tile.day) === currentlyCreatingDay && String(tile.flag) === "MINUS") {
            td.classList.add("minus");
        }
    }
    return td;
}

Calendar.prototype.loadCurrentScore = function() {

}

Calendar.prototype.loadRecordScore = function() {

}

Calendar.prototype.generateCalendar = function() {

    this.clearTable();
    this.updateDateHeader();
    this.updateGoalHeader();

    let table = $(".calendar__days__table");
    let currentlyCreatingDay = 1;
    let tableRowNumber;
    let rowDayNumber;
    let currentDate = new Date();
    let firstDayOfWeekInCurrentMonth = new Date(this.currentYear, this.currentMonthId, 1).getDay(); // 0 - 6 and 0 for sunday
    let lastDayInPreviousMonth = new Date(this.currentYear, this.currentMonthId, 0).getDate();

    if (firstDayOfWeekInCurrentMonth === 0) {
        firstDayOfWeekInCurrentMonth = 7;
    }

    for (tableRowNumber=1; tableRowNumber<=6; tableRowNumber++) {

        let tr = document.createElement('tr');
        tr.className = "calendar__days__table__row";

        function createEmptyDaysInFirstRow(lastDayInPreviousMonth, rowDayNumber, firstDayOfWeekInCurrentMonth) {
            let td = document.createElement('td');
            td.innerHTML = lastDayInPreviousMonth + rowDayNumber - firstDayOfWeekInCurrentMonth + 1;
            td.classList.add("day_cell");
            td.classList.add("empty");
            tr.appendChild(td);
            table.append(tr);
        }

        function createEmptyDaysInLastRows(td, daysInMonth) {
            td.innerHTML = currentlyCreatingDay - daysInMonth;
            td.classList.add("day_cell");
            td.classList.add("empty");
        }

        function createEnabledDay(td) {
            td.classList.add("day_cell");
            td.classList.add("enabled");
            td.setAttribute('onclick', 'calendarInstance.showTilePicker(this)');
        }

        function createDisabledDay(td) {
            td.classList.add("day_cell");
            td.classList.add("disabled");
        }

        for(rowDayNumber=1; rowDayNumber <=7; rowDayNumber++) {
            if(tableRowNumber === 1 && rowDayNumber <= firstDayOfWeekInCurrentMonth) {
                if(rowDayNumber === firstDayOfWeekInCurrentMonth) {
                    currentlyCreatingDay = 1;
                }
                else {
                    createEmptyDaysInFirstRow(lastDayInPreviousMonth, rowDayNumber, firstDayOfWeekInCurrentMonth);
                    currentlyCreatingDay++
                    continue;
                }
            }

            let td = document.createElement('td');

            if(currentlyCreatingDay > this.daysInMonth && currentlyCreatingDay < 42) {
                createEmptyDaysInLastRows(td, this.daysInMonth);
            }
            else if(currentlyCreatingDay > this.daysInMonth) {
                break;
            }
            else {
                td.innerHTML = currentlyCreatingDay;

                let today = currentDate.getUTCDate();
                let yesterday = currentDate.getUTCDate() - 1;
                let dayBeforeYesterday = currentDate.getUTCDate() - 2;
                let currentDateMonthId = currentDate.getMonth();
                let currentDateYear = currentDate.getFullYear()
                let lastDayOfPreviousMonth = new Date(this.currentYear, this.currentMonthId, 0).getDate();


                if( (currentlyCreatingDay === today || currentlyCreatingDay === yesterday || currentlyCreatingDay === dayBeforeYesterday) && this.currentMonthId === currentDateMonthId && this.currentYear === currentDateYear) {
                    createEnabledDay(td);
                }
                else {
                    createDisabledDay(td);
                }

                if(this.currentYear === currentDateYear && this.currentMonthId === currentDateMonthId - 1 && today === 1 && (currentlyCreatingDay === lastDayOfPreviousMonth || currentlyCreatingDay === lastDayOfPreviousMonth - 1)) {
                    createEnabledDay(td);
                }
                else if(this.currentYear === currentDateYear && this.currentMonthId === currentDateMonthId - 1 && today === 2 && currentlyCreatingDay === lastDayOfPreviousMonth)
                {
                    createEnabledDay(td);
                }

                td = this.generateTile(td, currentlyCreatingDay);

            }
            tr.appendChild(td);
            table.append(tr);
            currentlyCreatingDay++;
        }
    }
}





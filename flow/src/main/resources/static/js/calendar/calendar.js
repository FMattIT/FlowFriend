/**
 * Created by Admin on 23.10.2017.
 */

var calendarInstance = new Calendar(0, 10, 2017);

$( document ).ready(function() {
    // getGoals();

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
    for (var goalId = 0; goalId <= this.goals.length-1; goalId++) {

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
    let table = $(".calendar__days__table");
    for(let i = 6; i>=1; i--){
        $(".calendar__days__table__row").eq(i).remove();
    }


    // table.html("<tr class='calendar__days__table__row'><td class='day_cell disabled'>PN</td><td class='day_cell disabled'>WT</td><td class='day_cell disabled'>ŚR</td><td class='day_cell disabled'>CZ</td> <td class='day_cell disabled'>PT</td> <td class='day_cell disabled'>SO</td> <td class='day_cell disabled'>ND</td> </tr>");
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

Calendar.prototype.displayTilePicker = function() {
    if ($('.tile__picker').css("display") == "none"){
        $(".tile__picker").removeClass('animated zoomOut');
        $(".tile__picker").addClass('animated zoomIn');
        $(".tile__picker").css("display", "block").css("opacity", "1").unbind('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend');
        $('.tile__picker').css( {top:event.pageY - 60, left: event.pageX + 10});
    }
    else{
        $(".tile__picker").removeClass('zoomIn');
        $(".tile__picker").css("opacity", "0").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $(".tile__picker").css("display", "none");
        });
        $(".tile__picker").addClass('zoomOut');
    }
}

Calendar.prototype.saveTile = function(target, event, flag) {
    this.displayTilePicker();

    var tile = {};
    tile["day"]=2;
    tile["flag"]=flag;
    tile["goalId"]=this.goals[this.currentGoalId];
    tile["month"]=this.currentMonthId;
    tile["year"]=this.currentYear;

    saveTile(tile);
    event.stopPropagation();
}

Calendar.prototype.generateTiles = function(teedek, currentlyCreatingDay) {
    let td = teedek;
    for(let i=0; i<this.tiles.length; i++){
        let tile = this.tiles[i];
        if(tile.month == this.currentMonthId && tile.day == currentlyCreatingDay && tile.flag == "TICK") {
            td.classList.add("tick");
        }
        else if (tile.month == this.currentMonthId && tile.day == currentlyCreatingDay && tile.flag == "CROSS") {
            td.classList.add("cross");
        }
        else if (tile.month == this.currentMonthId && tile.day == currentlyCreatingDay && tile.flag == "YELLOWTICK") {
            td.classList.add("yellow_tick");
        }
        else if (tile.month == this.currentMonthId && tile.day == currentlyCreatingDay && tile.flag == "MINUS") {
            td.classList.add("minus");
        }
    }
    return td;
}

Calendar.prototype.generateCalendar = function() {

    this.clearTable();

    this.updateDateHeader();
    this.updateGoalHeader();

    var currentlyCreatingDay = 1;
    var tableRowNumber;
    var rowDayNumber;
    var table = $(".calendar__days__table");
    var currentDate = new Date();
    var firstDayOfWeekInCurrentMonth = new Date(this.currentYear, this.currentMonthId, 1).getDay(); // 0 - 6 and 0 for sunday
    var lastDayInPreviousMonth = new Date(this.currentYear, this.currentMonthId, 0).getDate();

    if(firstDayOfWeekInCurrentMonth === 0){
        firstDayOfWeekInCurrentMonth = 7;
    }

    for(tableRowNumber=1; tableRowNumber<=6; tableRowNumber++) {

        var tr = document.createElement('tr');
        tr.className = "calendar__days__table__row";

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

            function createEmptyDaysInFirstRow(lastDayInPreviousMonth, rowDayNumber, firstDayOfWeekInCurrentMonth) {
                let td = document.createElement('td');
                td.innerHTML = lastDayInPreviousMonth + rowDayNumber - firstDayOfWeekInCurrentMonth + 1;
                td.classList.add("day_cell");
                td.classList.add("empty");
                tr.appendChild(td);
                table.append(tr);
            }

            if(currentlyCreatingDay > this.daysInMonth && currentlyCreatingDay < 42) {
                var td = document.createElement('td');
                td.innerHTML = currentlyCreatingDay - this.daysInMonth;
                td.classList.add("day_cell");
                td.classList.add("empty");
            }
            else if(currentlyCreatingDay > this.daysInMonth) {
                break;
            }
            else {
                var td = document.createElement('td');
                td.innerHTML = currentlyCreatingDay;

                let today = currentDate.getUTCDate();
                let yesterday = currentDate.getUTCDate() - 1;
                let dayBeforeYesterday = currentDate.getUTCDate() - 2;
                let currentMonthId = currentDate.getMonth(); // tu nazwe zmienic bo dwie takie same sa

                if((currentlyCreatingDay === today || currentlyCreatingDay === yesterday || currentlyCreatingDay === dayBeforeYesterday) && this.currentMonthId === currentMonthId && this.currentYear === currentDate.getFullYear()){
                    td.classList.add("day_cell");
                    td.classList.add("enabled");
                    td.setAttribute('onclick', 'calendarInstance.displayTilePicker()');
                }
                else {
                    td.classList.add("day_cell");
                    td.classList.add("disabled");
                }

                if((new Date().getDate()==1 && this.currentMonthId == new Date().getMonth()-1 && (td.innerHTML==31 || td.innerHTML==30)) || (new Date().getDate()==2 && this.currentMonthId == new Date().getMonth()-1 && (td.innerHTML==31)))
                {
                    td.classList.add("day_cell");
                    td.classList.add("enabled");
                    td.setAttribute('onclick', 'calendarInstance.displayTilePicker()');
                }

                td = this.generateTiles(td, currentlyCreatingDay);

            }
            tr.appendChild(td);
            table.append(tr);
            currentlyCreatingDay++;
        }
    }
}





/**
 * Created by Admin on 23.10.2017.
 */

var calendarInstance = new Calendar(0, 9, 2017);

$( document ).ready(function() {
    calendarInstance.generateCalendar();

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
    this.goalPosition;
}

Calendar.prototype.init = function(currentGoalId, currentMonthId, currentYear) {
    this.currentGoalId = currentGoalId;
    this.currentMonthId = currentMonthId;
    this.currentMonth = this.months[this.currentMonthId];
    this.currentYear = currentYear;
    this.daysInMonth = this.daysInMonths[this.currentMonthId];
    // this.goalPosition = this.goals[this.currentGoalId].position;

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
    return this.getGoalIdByPosition(currentGoalPosition+1);
}

Calendar.prototype.getPreviousGoalIdByPosition = function() {
    let currentGoalPosition = this.goals[this.currentGoalId].position;
    return this.getGoalIdByPosition(currentGoalPosition-1);
}

Calendar.prototype.generateCalendar = function() {

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

            // function createEmptyDaysAtTheEnd(currentlyCreatingDay) {
            //     var td = document.createElement('td');
            //     td.innerHTML = currentlyCreatingDay - this.daysInMonth;
            //     td.classList.add("day_cell");
            //     td.classList.add("empty");
            // }


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
                    td.setAttribute('onclick', 'onDayClick(this)');
                }
                else {
                    td.classList.add("day_cell");
                    td.classList.add("disabled");
                }



                // do tiles - color/get/everything
                // for(var i=0; i<value[0].length; i++){
                //     var t= value[1][Number(actual_goal_id.innerHTML)];
                //     if(value[0][i].goalId.id == t.id && value[0][i].month == this.currentMonthId && value[0][i].day == currentlyCreatingDay && value[0][i].flag == "TICK") {
                //         td.style.cssText = "background-color: #009966; background-size: cover; border: 0; color:white;";
                //     }
                //     else if (value[0][i].goalId.id == value[1][Number(actual_goal_id.innerHTML)].id && value[0][i].month == this.currentMonthId && value[0][i].day == currentlyCreatingDay && value[0][i].flag == "CROSS") {
                //         td.style.cssText = "background-color: #e74c3c; background-size: cover; border: 0; color:white;";
                //     }
                //     else if (value[0][i].goalId.id == value[1][Number(actual_goal_id.innerHTML)].id && value[0][i].month == this.currentMonthId && value[0][i].day == currentlyCreatingDay && value[0][i].flag == "YELLOWTICK") {
                //         td.style.cssText = "background-color: #f1c40f; background-size: cover; border: 0; color:white;";
                //     }
                //     else if (value[0][i].goalId.id == value[1][Number(actual_goal_id.innerHTML)].id && value[0][i].month == this.currentMonthId && value[0][i].day == currentlyCreatingDay && value[0][i].flag == "MINUS") {
                //         td.style.cssText = "background-color: #7f8c8d; background-size: cover; border: 0; color:white;";
                //     }
                // }

            }
            tr.appendChild(td);
            table.append(tr);
            currentlyCreatingDay++;
        }
    }
}

Calendar.prototype.setGoals = function(goals) {
    this.goals = goals;
}

Calendar.prototype.clearTable = function() {
    let table = $(".calendar__days__table");
    table.html("<tr class='calendar__days__table__row'><td class='day_cell disabled'>PN</td><td class='day_cell disabled'>WT</td><td class='day_cell disabled'>ŚR</td><td class='day_cell disabled'>CZ</td> <td class='day_cell disabled'>PT</td> <td class='day_cell disabled'>SO</td> <td class='day_cell disabled'>ND</td> </tr>");
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
    this.generateCalendar();
    this.updateDateHeader();
}

Calendar.prototype.setPreviousMonth = function() {
    this.clearTable();
    this.init(this.currentGoalId, this.currentMonthId - 1, this.currentYear);
    this.monthChecker();
    this.generateCalendar();
    this.updateDateHeader();
}

Calendar.prototype.setNextGoal = function() {
    this.clearTable();
    this.init(this.getNextGoalIdByPosition(), this.currentMonthId, this.currentYear);
    this.generateCalendar();
    this.updateGoalHeader();
}

Calendar.prototype.setPreviousGoal = function() {
    this.clearTable();
    this.init(this.getPreviousGoalIdByPosition(), this.currentMonthId, this.currentYear);
    this.generateCalendar();
    this.updateGoalHeader();
}



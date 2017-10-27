/**
 * Created by Admin on 23.10.2017.
 */

var calendarInstance = new Calendar(1, 9, 2017);
//10 - listopad
//11- listopad

$( document ).ready(function() {
    calendarInstance.generateCalendar();
});

function Calendar(currentGoalId, currentMonthId, currentYear) {
    this.months = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
    this.daysInMonths = ['31', '28', '31', '30', '31', '30', '31', '31', '30', '31', '30', '31'];
    this.years = [];
    this.years.push(new Date().getFullYear());
    this.years.push(new Date().getFullYear()+1);
    this.years.push(new Date().getFullYear()+2);

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

Calendar.prototype.init = function() {}

Calendar.prototype.generateCalendar = function() {

    let currentlyCreatingDay = 1;
    let tableRowNumber;
    let rowDayNumber; //dayInRowNumber
    let table = $(".calendar__days__table");
    let today = new Date();
    let dayOfWeek;

    for(tableRowNumber=1; tableRowNumber<=6; tableRowNumber++) {

        let tr = document.createElement('tr');
        tr.className = "calendar__days__table__row";

        for(rowDayNumber=1; rowDayNumber <=7; rowDayNumber++) {

            //check if in row number one exist empty days
            if(tableRowNumber===1 && rowDayNumber<=new Date(this.currentYear, this.currentMonthId, 1).getDay()){
                if(rowDayNumber===new Date(this.currentYear, this.currentMonthId, 1).getDay()){
                    currentlyCreatingDay=1;
                }
                else{ //create empty day on the row number one and exit if statement
                    var td = document.createElement('td');
                    td.innerHTML = new Date(this.currentYear, this.currentMonthId, 0).getDate()+rowDayNumber-new Date(this.currentYear, this.currentMonthId, 1).getDay()+1;
                    td.classList.add("day_cell");
                    td.classList.add("empty");
                    tr.appendChild(td);
                    table.append(tr);
                    currentlyCreatingDay++
                    continue;
                }
            }


            //generateEmptyDaysAtTheEnd

            // function generateEmptyDayOnFirstRow(){
            // var td = document.createElement('td');
            // td.innerHTML = new Date(this.currentYear, this.currentMonthId, 0).getDate()+rowDayNumber-new Date(this.currentYear, this.currentMonthId, 1).getDay()+1;
            // td.classList.add("day_cell");
            // td.classList.add("empty");
            // tr.appendChild(td);
            // table.append(tr);
            // currentlyCreatingDay++
            // continue;
                // }

            // function generateEmptyDayOnLastRows(){
            //     var td = document.createElement('td');
            //     td.innerHTML = new Date(this.currentYear, this.currentMonthId+1, 1).getDate()+currentlyCreatingDay-this.daysInMonth-1;
            //     td.classList.add("day_cell");
            //     td.classList.add("empty");
            //     return td;
            // }

            if(currentlyCreatingDay>this.daysInMonth && currentlyCreatingDay<42){
                var td = document.createElement('td');
                td.innerHTML = new Date(this.currentYear, this.currentMonthId+1, 1).getDate()+currentlyCreatingDay-this.daysInMonth-1;
                td.classList.add("day_cell");
                td.classList.add("empty");
            }
            else if(currentlyCreatingDay>this.daysInMonth){break;} //breakIfEndOfTable
            else{
                var td = document.createElement('td');
                td.innerHTML = currentlyCreatingDay;

                //setDays on enabled or disabled
                if((currentlyCreatingDay==new Date().getUTCDate() || currentlyCreatingDay==new Date().getUTCDate()-1 || currentlyCreatingDay==new Date().getUTCDate()-2) && this.currentMonthId==new Date().getMonth()){
                    td.classList.add("day_cell");
                    td.classList.add("enabled");
                    td.setAttribute('onclick', 'onDayClick(this)');
                }
                    else {
                    td.classList.add("day_cell");
                    td.classList.add("disabled");
                }

                //setEmptyDaysAsEnabled when necesarry
                if((new Date().getDate()==1 && this.currentMonthId == today.getMonth()-1 && (td.innerHTML==31 || td.innerHTML==30)) || (new Date().getDate()==2 && this.currentMonthId == today.getMonth()-1 && (td.innerHTML==31)))
                {
                    td.classList.add("day_cell");
                    td.classList.add("enabled");
                    td.setAttribute('onclick', 'onDayClick(this)');
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
            currentlyCreatingDay++
        }
    }
}

Calendar.prototype.setGoals = function(goals) {
    this.goals = goals;
}

function generateDays() {
   //generowanie tr i td i wypelnienie danymi
    //musze tu miec id miesiaca, roku, celu
    //po id miesiaca biore taile z bazy
    var goals;

}

function getActualDate() {

}


function getCurrentDate() {

}

function getPreviousDate() {

}

function getCurrentGoal() {

}

function getNextGoal() {

}

function getPreviousGoal() {

}

function updateGoalHeader() {

}

function updateDateHeader() {

}

function updateCurrentScore() {

}

function updateRecordScore() {

}

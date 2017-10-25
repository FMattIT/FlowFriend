/**
 * Created by Admin on 23.10.2017.
 */

var calendarInstance = new Calendar(1, 1, 2017, 0);

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

    var daysss = days_in_month[this_month_id];
    if((this_year % 4 == 0 &&this_year % 100 != 0) || this_year % 400 == 0){
        daysss = 29;
    }

    this.goals;
    this.goalPosition;
}

Calendar.prototype.init = function() {}

Calendar.prototype.generateCalendar = function() {

    var day = 1;
    var rows;
    var days;

    var tr = document.createElement('tr');

    for(rows=1; rows<=6; rows++) {
        var tr = document.createElement('tr');
        for(days=1; days <=7; days++){
            if(rows==1 && days<=new Date(this_year, this_month_id, 1).getDay()){
                if(days==new Date(this_year, this_month_id, 1).getDay()){
                    day=1;
                }
                else{
                    var td = document.createElement('td');
                    td.innerHTML = new Date(this_year, this_month_id, 0).getDate()+days-new Date(this_year, this_month_id, 1).getDay()+1;
                    td.className = "day empty";
                    tr.appendChild(td);
                    table.appendChild(tr);
                    day++
                    continue;
                }
            }

            if(day>daysss && day<42){
                var td = document.createElement('td');
                td.innerHTML = new Date(this_year, this_month_id+1, 1).getDate()+day-daysss-1;
                td.className = "day empty";
            }
            else if(day>daysss){break;}
            else{
                var td = document.createElement('td');
                td.innerHTML = day;

                if((day==new Date().getUTCDate() || day==new Date().getUTCDate()-1 || day==new Date().getUTCDate()-2) && this_month_id==new Date().getMonth()){td.className = "day"; td.setAttribute('onclick', 'onDayClick(this)');}else {td.className = "day disabled";}

                if((new Date().getDate()==1 && this_month_id == today.getMonth()-1 && (td.innerHTML==31 || td.innerHTML==30)) || (new Date().getDate()==2 && this_month_id == today.getMonth()-1 && (td.innerHTML==31)))
                {
                    td.className = "day";
                    td.setAttribute('onclick', 'onDayClick(this)');
                }

                for(var i=0; i<value[0].length; i++){
                    var t= value[1][Number(actual_goal_id.innerHTML)];
                    if(value[0][i].goalId.id == t.id && value[0][i].month == this_month_id && value[0][i].day == day && value[0][i].flag == "TICK") {
                        td.style.cssText = "background-color: #009966; background-size: cover; border: 0; color:white;";
                    }
                    else if (value[0][i].goalId.id == value[1][Number(actual_goal_id.innerHTML)].id && value[0][i].month == this_month_id && value[0][i].day == day && value[0][i].flag == "CROSS") {
                        td.style.cssText = "background-color: #e74c3c; background-size: cover; border: 0; color:white;";
                    }
                    else if (value[0][i].goalId.id == value[1][Number(actual_goal_id.innerHTML)].id && value[0][i].month == this_month_id && value[0][i].day == day && value[0][i].flag == "YELLOWTICK") {
                        td.style.cssText = "background-color: #f1c40f; background-size: cover; border: 0; color:white;";
                    }
                    else if (value[0][i].goalId.id == value[1][Number(actual_goal_id.innerHTML)].id && value[0][i].month == this_month_id && value[0][i].day == day && value[0][i].flag == "MINUS") {
                        td.style.cssText = "background-color: #7f8c8d; background-size: cover; border: 0; color:white;";
                    }
                }
            }
            tr.appendChild(td);
            table.appendChild(tr);
            day++
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
/**
 * Created by Admin on 23.10.2017.
 */

function Calendar(currentGoalId, currentMonthId, currentYear) {
    this.months = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
    this.daysInMonths = ['31', '28', '31', '30', '31', '30', '31', '31', '30', '31', '30', '31'];
    this.years = [];
    this.years.push(new Date().getFullYear());
    this.years.push(new Date().getFullYear()+1);
    this.years.push(new Date().getFullYear()+2);

    this.currentGoalId = currentGoalId;
    this.currentMonthId = currentMonthId;
    this.currentMonth = months[this.currentMonthId];
    this.currentYear = currentYear;

    this.goals={};
    this.goalPosition;
}

Calendar.prototype.savHello = function() {

}


var classaa = new Calendar();

classaa.savHello();


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
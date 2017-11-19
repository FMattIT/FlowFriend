/**
 * Created by Admin on 23.10.2017.
 */

var calendarInstance = new Calendar(0, 10, 2017);

$( document ).ready(function() {
    getGoals(0);

    $( ".fa-info-circle" ).click(function() {
        $(".block__others__information").toggle();
        $(".block__others__chart").toggle();
    });

    $( ".fa-pie-chart" ).click(function() {
        $(".block__others__information").toggle();
        $(".block__others__chart").toggle();
        calendarInstance.createChart();
    });

    $( ".goal_header__previous_arrow .fa-chevron-left" ).click(function() {
        calendarInstance.setPreviousGoal();
    });

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

    $( ".goal_name__buttons_save").click(function() {
        let goal = calendarInstance.goals[calendarInstance.currentGoalId];
        goal.name = $(".information__goal_name__name_text_area").val();
        saveGoal(goal, goal.position);
    });

    $( ".goal_name__buttons_delete").click(function() {
        deleteGoal(calendarInstance.goals[calendarInstance.currentGoalId]);
        calendarInstance.deleteGoal();
        calendarInstance.updateGoalsList();
    });

    $( ".fa-plus-circle" ).click(function() {
        $('#add_goal__modal').modal('show');
    });

    $('body').on('submit', '.add_goal__modal__form', function(event) {
        event.preventDefault();
        calendarInstance.saveGoal();
        $('#add_goal__modal').modal('toggle');
    });

    $( document ).on( "click", ".goal_bar__name" , function() {
        if(calendarInstance.currentGoalId != $(this).parent().find(".goal_bar__id").html()){
            calendarInstance.currentGoalId = $(this).parent().find(".goal_bar__id").html();
            getTiles();
            calendarInstance.selectGoalOnList();
        }
    });

    $('.block__goals').sortable({
        revert: false,
        handle: '.fa.fa-arrows-v',
        update: function (event, ui) {
            calendarInstance.updateGoalsList();
        }
    });

    $('.block__goals').disableSelection();

    autosize(document.querySelector('textarea'));
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
    this.selectGoalOnList();
}

Calendar.prototype.setPreviousMonth = function() {
    this.clearTable();
    this.init(this.currentGoalId, this.currentMonthId - 1, this.currentYear);
    this.monthChecker();
    getTiles();
    this.updateDateHeader();
    this.selectGoalOnList();
}

Calendar.prototype.setNextGoal = function() {
    this.clearTable();
    this.init(this.getNextGoalIdByPosition(), this.currentMonthId, this.currentYear);
    getTiles();
    this.updateGoalHeader();
    this.selectGoalOnList();
}

Calendar.prototype.setPreviousGoal = function() {
    this.clearTable();
    this.init(this.getPreviousGoalIdByPosition(), this.currentMonthId, this.currentYear);
    getTiles();
    this.updateGoalHeader();
    this.selectGoalOnList();
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
    tile["day"] = this.clickedDay.innerHTML;
    tile["flag"] = flag;
    tile["goalId"] = this.goals[this.currentGoalId];
    tile["month"] = this.currentMonthId;
    tile["year"] = this.currentYear;

    saveTile(tile);
    event.stopPropagation();
}

Calendar.prototype.saveGoal = function() {
    let goal = {};
    goal["name"] = $('.add_goal__modal__form_name').val();
    goal["position"] = $('.block__goals').children().length;
    saveGoal(goal, goal.position);
}

Calendar.prototype.deleteGoal = function() {
    $(".goal_bar__id:contains('" + this.currentGoalId + "')").parent().remove();
}

Calendar.prototype.saveOffDays = function(target) {
    let value = "false";
    let minusTiles = {}
    minusTiles["goalId"] = this.goals[this.currentGoalId];

    for(let iterator = 0; iterator <= 6; iterator++) {
        if($(target).parent().find("div").eq(iterator).hasClass("enabled")) {
            value="true";
        }
        else{
            value="false";
        }
        minusTiles[$(target).parent().find("div").eq(iterator).attr('id')] = value;
    }
    saveMinusTiles(minusTiles);
}

Calendar.prototype.getOffDays = function() {
    getMinusTiles(this.goals[this.currentGoalId]);
}

Calendar.prototype.displayOffDays = function(minusTiles) {
    $(".information__goal_off_days__blocks").find("div").removeClass("enabled").removeClass("disabled");
    $(".information__goal_off_days__blocks").find("div").addClass("disabled");
    jQuery.each(minusTiles, function(iterator, value) {
        if(value == "true"){
            $(".information__goal_off_days__blocks").find("div").eq(iterator).toggleClass("disabled");
            $(".information__goal_off_days__blocks").find("div").eq(iterator).toggleClass("enabled");
        }
    });
}

Calendar.prototype.toggleClassInBlock = function (target) {
     $(target).toggleClass("disabled");
     $(target).toggleClass("enabled");
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
    getCurrentScore(this.goals[this.currentGoalId]);
}

Calendar.prototype.loadRecordScore = function() {
    getRecordScore(this.goals[this.currentGoalId]);
}

Calendar.prototype.loadGoalNameToEditField = function() {
    $(".information__goal_name__name_text_area").val(this.goals[this.currentGoalId].name);
}

Calendar.prototype.selectGoalOnList = function() {
    $(".block__goals__goal_bar").removeClass('selected');
    $(".goal_bar__id:contains('" + this.currentGoalId + "')").parent().addClass('selected');
    this.getOffDays();
}

Calendar.prototype.selectGoalOnListForDelete = function(position) {
    $(".block__goals__goal_bar").removeClass('selected');
    $(".goal_bar__id:contains('" + this.getGoalIdByPosition(position) + "')").parent().addClass('selected');
}

Calendar.prototype.loadGoalsList = function() {
    $(".block__goals").html("");
    for (let iterator = 0; iterator <= this.goals.length-1; iterator++) {
        let goalId = this.getGoalIdByPosition(iterator);

        let goal_bar = document.createElement('div');
        goal_bar.className = "block__goals__goal_bar";

        let goal_position = document.createElement('div');
        goal_position.className = "goal_bar__position";
        goal_position.innerHTML = iterator;

        let goal_id = document.createElement('div');
        goal_id.className = "goal_bar__id";
        goal_id.innerHTML = goalId;

        let goal_grip = document.createElement('div');
        goal_grip.className = "goal_bar__grip";
        goal_grip.innerHTML = "<i class='fa fa-arrows-v' aria-hidden='true'></i>";

        let goal_name = document.createElement('div');
        goal_name.className = "goal_bar__name";
        goal_name.innerHTML = this.goals[goalId].name;

        goal_bar.append(goal_position);
        goal_bar.append(goal_id);
        goal_bar.append(goal_grip);
        goal_bar.append(goal_name);

        $(".block__goals").append(goal_bar);
    }
    this.selectGoalOnList();
}

Calendar.prototype.updateGoalsList = function() {
    let self = this;
    $('.block__goals').find('.block__goals__goal_bar').each(function(){
        let goalId = $(this).find('.goal_bar__id').html();
        let goalPosition = $(this).index();
        saveGoal(self.goals[goalId], goalPosition);
    });
}

Calendar.prototype.createChart = function() {
    let canvas = document.getElementById('forChart');
    canvas.innerHTML = '';
    canvas.innerHTML = "<canvas id='myChart'></canvas>";
    let ctx = document.getElementById('myChart').getContext('2d');
    let myDoughnutChart = new Chart(ctx, {
        type: 'doughnut',
        options:{
            legend:{
                display: false
            }
        },
        data: {
            datasets: [{
                // data: [getChoicesCount("TICK", type), getChoicesCount("YELLOWTICK", type), getChoicesCount("CROSS", type), getChoicesCount("MINUS", type)],
                data: [1, 1, 1, 1],
                backgroundColor: [
                    "#009966",
                    "#f1c40f",
                    "#e74c3c",
                    "#7f8c8d"
                ]
            }],

            labels: [
                'TICK',
                'YELLOWTICK',
                'CROSS',
                'MINUS'
            ]
        },
    });
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
    this.loadCurrentScore();
    this.loadRecordScore();
    this.loadGoalNameToEditField();
}





/**
 * Created by Admin on 23.10.2017.
 */

var calendarInstance = new Calendar(0, new Date().getMonth(), new Date().getFullYear());

$( document ).ready(function() {
    $.widget.bridge('uibutton', $.ui.button);
    $.widget.bridge('uitooltip', $.ui.tooltip);

    getGoals(0);

    $( ".fa-info-circle" ).click(function() {
        $(".block__others__information").css("display", "block");
        $(".block__others__chart").css("display", "none");
    });

    $( ".fa-pie-chart" ).click(function() {
        $(".block__others__information").css("display", "none");
        $(".block__others__chart").css("display", "flex");
    });

    $( ".goal_header__previous_arrow .fa-chevron-left" ).click(function() {
        calendarInstance.setPreviousGoal();
    });

    $( ".goal_header__next_arrow .fa-chevron-right" ).click(function() {
        calendarInstance.setNextGoal();
    });

    $( ".date_header__next_arrow .fa-chevron-right" ).click(function() {
        calendarInstance.setNextMonth();
    });

    $( ".date_header__previous_arrow .fa-chevron-left" ).click(function() {
        calendarInstance.setPreviousMonth();
    });

    $( ".information__goal_name__buttons_save").click(function() {
        calendarInstance.saveGoalName();
    });

    $( ".information__goal_advantages__button_save").click(function() {
        calendarInstance.saveGoalAdvantages();
    });

    $( ".information__goal_name__buttons_delete").click(function() {
        calendarInstance.deleteGoal();
    });

    $( ".navbar-option" ).click(function() {
        $('#add_goal__modal').modal('show')
        $(".add_goal__modal__form_name").focus();
    });

    $('body').on('submit', '.add_goal__modal__form', function(event) {
        event.preventDefault();
        calendarInstance.saveGoalPosition();
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
        handle: '.goal_bar__grip',
        update: function (event, ui) {
            calendarInstance.updateGoalsList();
        }
    });

    $('.block__goals').disableSelection();

    autosize(document.getElementsByClassName('information__goal_name__field_area'));
    autosize(document.getElementsByClassName("information__goal_advantages__field_area"));
    autosize(document.getElementsByClassName("add_goal__modal__form_name"));

    $('.block__goals').perfectScrollbar();

    $(document).click(function(e) {
        if ( $(e.target).closest('.day_cell.enabled').length === 0 ) {
            calendarInstance.hideTilePicker();
        }
        $('[data-toggle="tooltip"]').tooltip('destroy');
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

Calendar.prototype.updateTiles = function(tile) {
    let count = 0;
    let self  = this;
    this.tiles.filter(function(item) {
        if(item.id === tile.id) {
            self.tiles[self.tiles.indexOf(item)] = tile;
            count++;
        }
    });
    if(count === 0) {
        this.tiles.push(tile);
    }
}

Calendar.prototype.saveGoalName = function() {
    let goal = this.goals[this.currentGoalId];
    goal.name = $(".information__goal_name__field_area").val();
    saveGoal(goal, goal.position, goal.advantages, "reloadName");
}

Calendar.prototype.saveGoalPosition = function() {
    let goal = {};
    goal["name"] = $('.add_goal__modal__form_name').val();
    goal["position"] = $('.block__goals__goal_bar').length;
    saveGoal(goal, goal.position, goal.advantages, "reloadAll");
}

Calendar.prototype.saveGoalAdvantages = function() {
    let goal = this.goals[this.currentGoalId];
    goal.advantages = $(".information__goal_advantages__field_area").val();
    saveGoal(goal, goal.position, goal.advantages);
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

Calendar.prototype.loadSavedTileView = function(flag) {
    $(this.clickedDay).removeClass("tick").removeClass("cross").removeClass("yellow_tick").removeClass("minus");

    if(flag=="YELLOWTICK") {
        $(this.clickedDay).addClass("yellow_tick");
    }
    else {
        $(this.clickedDay).addClass(flag.toLowerCase());
    }
}

Calendar.prototype.deleteGoal = function() {
    $(".goal_bar__id:contains('" + this.currentGoalId + "')").parent().remove();
    deleteGoal(this.goals[this.currentGoalId]);
    this.updateGoalsList();
}

Calendar.prototype.showTilePicker = function(target) {
    this.hideTilePicker();

    this.clickedDay = target;
    let picker = $('.tile__picker');
    let triangle = $(".tile__picker_triangle");
    let targetPosition = $(target).position();

    triangle.removeClass('animated zoomOut');
    triangle.addClass('animated zoomIn');
    triangle.css("display", "block").css("opacity", "1").unbind('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend');
    triangle.css( {top: targetPosition.top - 12, left: targetPosition.left + 22});

    picker.removeClass('animated zoomOut');
    picker.addClass('animated zoomIn');
    picker.css("display", "block").css("opacity", "1").unbind('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend');
    picker.css( {top: targetPosition.top - 70, left: targetPosition.left - 6});
    picker.css( {top: targetPosition.top - 70, left: targetPosition.left - 6});
}

Calendar.prototype.hideTilePicker = function() {
    this.clickedDay = null;
    let picker = $('.tile__picker');
    let triangle = $(".tile__picker_triangle");

    triangle.removeClass('zoomIn');
    triangle.css("opacity", "0").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
        triangle.css("display", "none");
    });
    triangle.addClass('zoomOut');

    picker.removeClass('zoomIn');
    picker.css("opacity", "0").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
        picker.css("display", "none");
    });
    picker.addClass('zoomOut');
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

Calendar.prototype.loadCurrentScore = function() {
    getCurrentScore(this.goals[this.currentGoalId]);
}

Calendar.prototype.loadRecordScore = function() {
    getRecordScore(this.goals[this.currentGoalId]);
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
    this.init(this.currentGoalId, this.currentMonthId + 1, this.currentYear);
    this.monthChecker();
    getTiles();
    this.updateDateHeader();
    this.selectGoalOnList();
}

Calendar.prototype.setPreviousMonth = function() {
    this.init(this.currentGoalId, this.currentMonthId - 1, this.currentYear);
    this.monthChecker();
    getTiles();
    this.updateDateHeader();
    this.selectGoalOnList();
}

Calendar.prototype.setNextGoal = function() {
    this.init(this.getNextGoalIdByPosition(), this.currentMonthId, this.currentYear);
    getTiles();
    this.updateGoalHeader();
    this.selectGoalOnList();
}

Calendar.prototype.setPreviousGoal = function() {
    this.init(this.getPreviousGoalIdByPosition(), this.currentMonthId, this.currentYear);
    getTiles();
    this.updateGoalHeader();
    this.selectGoalOnList();
}


// GOALS LIST METHODS

Calendar.prototype.selectGoalOnList = function() {
    $(".block__goals__goal_bar").removeClass('selected');
    $(".goal_bar__id:contains('" + this.currentGoalId + "')").parent().addClass('selected');
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

        goal_bar.appendChild(goal_position);
        goal_bar.appendChild(goal_id);
        goal_bar.appendChild(goal_grip);
        goal_bar.appendChild(goal_name);

        $(".block__goals").append(goal_bar);
    }
    this.selectGoalOnList();
}

Calendar.prototype.updateGoalsList = function() {
    let self = this;
    $('.block__goals').find('.block__goals__goal_bar').each(function(){
        let goalId = $(this).find('.goal_bar__id').html();
        let goalPosition = $(this).index();
        saveGoal(self.goals[goalId], goalPosition, self.goals[goalId].advantages);
    });
}


// INFORMATION METHODS

Calendar.prototype.loadGoalNameToEditField = function() {
    $(".information__goal_name__field_area").val(this.goals[this.currentGoalId].name);
}

Calendar.prototype.loadOffDays = function() {
    getMinusTiles(this.goals[this.currentGoalId]);
}

Calendar.prototype.fillOffDays = function(minusTiles) {
    $(".information__goal_off_days__blocks").find("div").removeClass("enabled").removeClass("disabled");
    $(".information__goal_off_days__blocks").find("div").addClass("disabled");
    jQuery.each(minusTiles, function(iterator, value) {
        if(value == "true"){
            $(".information__goal_off_days__blocks").find("div").eq(iterator).toggleClass("disabled");
            $(".information__goal_off_days__blocks").find("div").eq(iterator).toggleClass("enabled");
        }
    });
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

Calendar.prototype.toggleClassInOffDayBlock = function (target) {
    $(target).toggleClass("disabled");
    $(target).toggleClass("enabled");
}

Calendar.prototype.loadGoalAdvantages = function() {
    $(".information__goal_advantages__field_area").val(this.goals[this.currentGoalId].advantages);
}


// CHART METHODS

Calendar.prototype.countTilesToCreatePieChart = function(choice, type) {
    let score = 0;
    for (let iterator = 0; iterator <= this.tiles.length-1; iterator++) {

        if(type=="one"){
            if (this.tiles[iterator].goalId.id == this.goals[this.currentGoalId].id && this.tiles[iterator].flag == choice && this.tiles[iterator].month == this.currentMonthId)
            {
                score++;
            }
        }
        else{
            if (this.tiles[iterator].goalId.id  == this.goals[this.currentGoalId].id && this.tiles[iterator].flag == choice)
            {
                score++;
            }
        }
    }
    return score;
}

Calendar.prototype.createPieChart = function(type) {
    let amountOfTicks = this.countTilesToCreatePieChart("TICK", type);
    let amountOfYellowTicks = this.countTilesToCreatePieChart("YELLOWTICK", type);
    let amountOfCrosses = this.countTilesToCreatePieChart("CROSS", type);
    let amountOfMinuses = this.countTilesToCreatePieChart("MINUS", type);

    let block = $(".block__others__chart");

    if(amountOfTicks === 0 && amountOfYellowTicks === 0 && amountOfCrosses === 0 && amountOfMinuses === 0) {
        block.html("<select class='block__others__chart__type_select' onchange='calendarInstance.createPieChart($(this).val());'><option class='chart__type_select__first_option' value='one'>POKAŻ DLA WYBRANEGO MIESIĄCA</option><option class='chart__type_select__second_option' value='all'>POKAŻ DLA WSZYSTKICH MIESIĘCY</option></select>" +
            "<div class='block__others__chart_information'>BRAK DANYCH DO STWORZENIA WYKRESU!</div>");
    }
    else {
        block.html("<select class='block__others__chart__type_select' onchange='calendarInstance.createPieChart($(this).val());'><option class='chart__type_select__first_option' value='one'>POKAŻ DLA WYBRANEGO MIESIĄCA</option><option class='chart__type_select__second_option' value='all'>POKAŻ DLA WSZYSTKICH MIESIĘCY</option></select><div class='block__others__chart__chart_space'></div>");

        let canvas = document.querySelector('.block__others__chart__chart_space');
        canvas.innerHTML = '';
        canvas.innerHTML = "<canvas id='chart' style='margin-top: 20px;'></canvas>";
        let ctx = document.getElementById('chart').getContext('2d');
        let myDoughnutChart = new Chart(ctx, {
            type: 'doughnut',
            options:{
                legend:{
                    display: false
                },
                responsive: true,
                maintainAspectRatio: false
            },
            data: {
                datasets: [{
                    data: [amountOfTicks, amountOfYellowTicks, amountOfCrosses, amountOfMinuses],
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

    if(type === "one"){
        $(".chart__type_select__first_option").attr('selected', 'selected');
    }
    else {
        $(".chart__type_select__second_option").attr('selected', 'selected');
    }

}



// MAIN METHODS

Calendar.prototype.generateTile = function(td, currentlyCreatingDay) {
    for (let iterator = 0; iterator < this.tiles.length; iterator ++) {
        let tile = this.tiles[iterator];
        if (Number(tile.year) === this.currentYear && Number(tile.month) === this.currentMonthId && Number(tile.day) === currentlyCreatingDay && String(tile.flag) === "TICK") {
            td.classList.add("tick");
        }
        else if (Number(tile.year) === this.currentYear && Number(tile.month) === this.currentMonthId && Number(tile.day) === currentlyCreatingDay && String(tile.flag) === "CROSS") {
            td.classList.add("cross");
        }
        else if (Number(tile.year) === this.currentYear && Number(tile.month) === this.currentMonthId && Number(tile.day) === currentlyCreatingDay && String(tile.flag) === "YELLOWTICK") {
            td.classList.add("yellow_tick");
        }
        else if (Number(tile.year) === this.currentYear && Number(tile.month) === this.currentMonthId && Number(tile.day) === currentlyCreatingDay && String(tile.flag) === "MINUS") {
            td.classList.add("minus");
        }
    }
    return td;
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
            // td.classList.add("day_cell");
            // td.classList.add("enabled");
            // td.setAttribute('onclick', 'calendarInstance.showTilePicker(this)');
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
    this.loadOffDays();
    this.loadGoalAdvantages();
    this.createPieChart($(".block__others__chart__type_select").val());

    autosize.update(document.getElementsByClassName('information__goal_name__field_area'));
    autosize.update(document.getElementsByClassName("information__goal_advantages__field_area"));
}





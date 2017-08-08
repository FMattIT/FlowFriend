/**
 * Created by Admin on 18.06.2017.
 */
    var value = null;

    var goal_header_reset = document.createElement('div');
    goal_header_reset.setAttribute('style', 'clear: both;');

    var date_header_reset = document.createElement('div');
    date_header_reset.setAttribute('style', 'clear: both;');

    var goal_header = document.createElement('div');
    goal_header.className = "goalHeader";
    var previous_goal = document.createElement('div');
    previous_goal.className = "previous_goal";
    previous_goal.innerHTML = "<i class='fa fa-chevron-left' aria-hidden='true'></i>";
    var actual_goal = document.createElement('div');
    actual_goal.className = "actual_goal";
    var actual_goal_id = document.createElement('div');
    actual_goal_id.style.cssText = "display:none;";
    actual_goal.append(actual_goal_id);
    var next_goal = document.createElement('div');
    next_goal.className = "next_goal";
    next_goal.innerHTML = "<i class='fa fa-chevron-right' aria-hidden='true'></i>";
    goal_header.append(previous_goal);
    goal_header.append(actual_goal);
    goal_header.append(next_goal);
    goal_header.append(goal_header_reset);

    var date_header = document.createElement('div');
    date_header.className = "dateHeader";
    var previous_date = document.createElement('div');
    previous_date.className = "previous_date";
    previous_date.innerHTML = "<i class='fa fa-chevron-left' aria-hidden='true'></i>";
    var actual_date = document.createElement('div');
    actual_date.className = "actual_date";
    var next_date = document.createElement('div');
    next_date.className = "next_date";
    next_date.innerHTML = "<i class='fa fa-chevron-right' aria-hidden='true'></i>";
    date_header.append(previous_date);
    date_header.append(actual_date);
    date_header.append(next_date);
    date_header.append(date_header_reset);


var months = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
var days_in_month = ['31', '28', '31', '30', '31', '30', '31', '31', '30', '31', '30', '31'];
var years = [];
years.push(new Date().getFullYear());
years.push(new Date().getFullYear()+1);


function dataRetriever(dane, month_id, year, goal_init) {
    value = dane;
    createNewCalendar(value, month_id, year, goal_init);
}

function retrieverOfValue(danedane){
    value=danedane;
}

function retrieveValue(){
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/calendar/retrieveData/tiles",
        dataType: 'json',
        async: false,
        success: function (dane) {
            retrieverOfValue(dane);
        },
        error: function (e) {
            console.log("ERROR: ", e);
        }
    });
}

function retrieveNewData(month_id, year, goal_init) {

    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/calendar/retrieveData/tiles",
        dataType: 'json',
        success: function (dane) {
            dataRetriever(dane, month_id, year, goal_init);
        },
        error: function (e) {
            console.log("ERROR: ", e);
        }
    });
}

function getGoalId(pos){
    for (var n = 0; n <= value[1].length-1; n++) {

        if (value[1][n].position == pos)
        {
            return n;
            break;
        }
    }
}

function createNewCalendar(value, month_id, year, goal_init) {
    $(".calendar").html("");

    if (value[1] === undefined || value[1].length == 0) {
        $(".calendar").html("BRAK CELÓW");
        $(".list_goals").html("BRAK CELÓW");
    }
    else{


    var today = new Date();
    var this_month_id = today.getMonth();
    var this_year = today.getFullYear();
    if ((typeof(month_id) !== 'undefined') && (month_id !== null)) {
        this_month_id = month_id;
    }
    if ((typeof(year) !== 'undefined') && (year !== null)) {
        this_year = year;
    }



    if(goal_init==0){
    var goal_name = value[1][getGoalId(0)].name;
    var goal_id = getGoalId(0);
    actual_goal.innerHTML = goal_name;
    actual_goal_id.innerHTML = getGoalId(0);
    }

    if ((typeof(goal_init) == 'undefined') || (goal_init == null)){
        goal_name = value[1][Number(actual_goal_id.innerHTML)].name;
        goal_id = Number(actual_goal_id.innerHTML);
        actual_goal.innerHTML = goal_name;
        actual_goal_id.innerHTML = goal_id;
    }

    if ((typeof(goal_init) !== 'undefined') && (goal_init !== null)) {

        if(goal_init=="deleted"){
            goal_name = value[1][getGoalId(0)].name;
            goal_id = getGoalId(0);
        }

        if(goal_init=="new"){
            goal_name = value[1][value[1].length-1].name;
            goal_id = value[1].length-1;
        }

        if(goal_init=="nx") {
            if((typeof(value[1][Number(actual_goal_id.innerHTML)+1]) == 'undefined')){
                goal_name = value[1][0].name;
                goal_id = 0;
        }else{
             goal_name = value[1][Number(actual_goal_id.innerHTML)+1].name;
             goal_id = Number(actual_goal_id.innerHTML)+1;
            }

        }
        else if(goal_init=="pr") {
            if((typeof(value[1][Number(actual_goal_id.innerHTML)-1]) == 'undefined')){
                goal_name = value[1][value[1].length-1].name;
                goal_id = value[1].length-1;
            }else{
                goal_name = value[1][Number(actual_goal_id.innerHTML)-1].name;
                goal_id = Number(actual_goal_id.innerHTML)-1;
            }
        }
        else if(!isNaN(goal_init)){
            goal_name = value[1][Number(goal_init)].name;
            goal_id = Number(goal_init);
        }

        actual_goal.innerHTML = goal_name;
        actual_goal_id.innerHTML = goal_id;
    }

    var table = document.createElement('table');
    table.setAttribute('id', 'calendar');
    var daysss = days_in_month[this_month_id];
    if((this_year % 4 == 0 &&this_year % 100 != 0) || this_year % 400 == 0){
        daysss = 29;
    }

    var day = 1;
    var rows;
    var days;

    var tr = document.createElement('tr');
    var pn = document.createElement('td');
    pn.innerHTML = "PN";
    pn.className = "day disabled";
    tr.appendChild(pn);
    var wt = document.createElement('td');
    wt.innerHTML = "WT";
    wt.className = "day disabled";
    tr.appendChild(wt);
    var sr = document.createElement('td');
    sr.innerHTML = "ŚR";
    sr.className = "day disabled";
    tr.appendChild(sr);
    var cz = document.createElement('td');
    cz.innerHTML = "CZ";
    cz.className = "day disabled";
    tr.appendChild(cz);
    var pt = document.createElement('td');
    pt.innerHTML = "PT";
    pt.className = "day disabled";
    tr.appendChild(pt);
    var so = document.createElement('td');
    so.innerHTML = "SO";
    so.className = "day disabled";
    tr.appendChild(so);
    var nd = document.createElement('td');
    nd.innerHTML = "ND";
    nd.className = "day disabled";
    tr.appendChild(nd);
    table.appendChild(tr);

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

    actual_date.innerHTML = months[this_month_id] + " " + this_year;
    $(".calendar").append(goal_header);
    $(".calendar").append(date_header);
    $(".calendar").append(table);

    var bar = document.createElement('div');
    var tick_choice = document.createElement('div');
    tick_choice.className = "tick_choice";
    tick_choice.setAttribute("id", "tick");
    tick_choice.setAttribute('onclick', 'onTickClick(this, event)');
    var yellow_tick_choice = document.createElement('div');
    yellow_tick_choice.className = "yellow_tick_choice";
    yellow_tick_choice.setAttribute("id", "yellow_tick");
    yellow_tick_choice.setAttribute('onclick', 'onYellowTickClick(this, event)');
    var cross_choice = document.createElement('div');
    cross_choice.className = "cross_choice";
    cross_choice.setAttribute("id", "cross");
    cross_choice.setAttribute('onclick', 'onCrossClick(this, event)');
    var minus_choice = document.createElement('div');
    minus_choice.className = "minus_choice";
    minus_choice.setAttribute("id", "minus");
    minus_choice.setAttribute('onclick', 'onMinusClick(this, event)');
    bar.append(tick_choice);
    bar.append(yellow_tick_choice);
    bar.append(cross_choice);
    bar.append(minus_choice);
    bar.className = "bar";
    $('.calendar').append(bar);
    
    loadGoals();
    $('#edit_name').text(value[1][actual_goal_id.innerHTML].name);
    makeChart($("#chart_changer").val());
    retrieveActualCount(value[1][actual_goal_id.innerHTML]);
    retrieveMinusTiles();
    }
}

function getPosition(s){
    for (var p = 0; p <= value[1].length-1; p++) {

        if (value[1][p].position == s)
        {
            return p;
            break;
        }
    }
}

function loadGoals(){
    $(".list_goals").html("");
    for (var i = 0; i <= value[1].length-1; i++) {
        var goal = getPosition(i);
        if ((typeof(goal) !== 'undefined') && (goal !== null)){
        var goal_grip = document.createElement('div');
        goal_grip.className = "goal_grip";
        goal_grip.innerHTML = "<i class='fa fa-arrows-v' aria-hidden='true'></i>";
        var goal_name = document.createElement('div');
        goal_name.className = "goal_name";
        goal_name.innerHTML = value[1][goal].name;
        var delete_option = document.createElement('div');
        delete_option.className = "delete_option";
        delete_option.innerHTML = "<i class='fa fa-trash' aria-hidden='true'></i>";
        delete_option.setAttribute("onclick", "deleteGoalFunc(this, event)");
        var slide = document.createElement('div');
        slide.className = "slide";
        slide.append(goal_grip);
        slide.append(goal_name);
        slide.append(delete_option);
        var slide_id = document.createElement('div');
        slide_id.innerHTML = goal;
        slide_id.className = 'slide_goal_id';
        slide.append(slide_id);
        $(".list_goals").append(slide);
        }
    }
    $(".slide_goal_id:contains('"+actual_goal_id.innerHTML+"')").parent().find(".goal_name").addClass('selectable');
}

function onTickClick(target, event) {
    $('.day.active').css('backgroundColor', ' #009966');
    $('.day.active').css('backgroundSize', 'cover');
    $('.day.active').css('border', '0');
    $('.day.active').css('color', 'white');
    $(target).parent().toggle();

    var day = $('.day.active').html();
    $('.day.active').removeClass( "day active" ).addClass( "day" );
    var data = {};
    data["day"]=day;
    data["flag"]="TICK";
    data["goalId"]=value[1][actual_goal_id.innerHTML];

    var header = $(".actual_date").text();
    var words = header.split(' ');
    var month_name = words[0];
    var year = words[1];
    var id = months.indexOf(month_name);
    data["month"]=id;
    data["year"]=year;

    saveTileToDB(data);
    retrieveActualCount(value[1][actual_goal_id.innerHTML]);
    makeChart($("#chart_changer").val());
    event.stopPropagation();
}

function onYellowTickClick(target, event) {
    $('.day.active').css('backgroundColor', ' #f1c40f');
    $('.day.active').css('backgroundSize', 'cover');
    $('.day.active').css('border', '0');
    $('.day.active').css('color', 'white');
    $(target).parent().toggle();

    var day = $('.day.active').html();
    $('.day.active').removeClass( "day active" ).addClass( "day" );
    var data = {};
    data["day"]=day;
    data["flag"]="YELLOWTICK";
    data["goalId"]=value[1][actual_goal_id.innerHTML];

    var header = $(".actual_date").text();
    var words = header.split(' ');
    var month_name = words[0];
    var year = words[1];
    var id = months.indexOf(month_name);
    data["month"]=id;
    data["year"]=year;

    saveTileToDB(data);
    retrieveActualCount(value[1][actual_goal_id.innerHTML]);
    makeChart($("#chart_changer").val());
    event.stopPropagation();
}

function onCrossClick(target, event) {
    $('.day.active').css('backgroundColor', ' #e74c3c');
    $('.day.active').css('backgroundSize', 'cover');
    $('.day.active').css('border', '0');
    $('.day.active').css('color', 'white');
    $(target).parent().toggle();

    var day = $('.day.active').html();
    $('.day.active').removeClass( "day active" ).addClass( "day" );
    var data = {};
    data["day"]=day;
    data["flag"]="CROSS";
    data["goalId"]=value[1][actual_goal_id.innerHTML];

    var header = $(".actual_date").text();
    var words = header.split(' ');
    var month_name = words[0];
    var year = words[1];
    var id = months.indexOf(month_name);
    data["month"]=id;
    data["year"]=year;

    saveTileToDB(data);
    retrieveActualCount(value[1][actual_goal_id.innerHTML]);
    makeChart($("#chart_changer").val());
    event.stopPropagation();
}

function onMinusClick(target, event) {
    $('.day.active').css('backgroundColor', ' #7f8c8d');
    $('.day.active').css('backgroundSize', 'cover');
    $('.day.active').css('border', '0');
    $('.day.active').css('color', 'white');
    $(target).parent().toggle();

    var day = $('.day.active').html();
    $('.day.active').removeClass( "day active" ).addClass( "day" );
    var data = {};
    data["day"]=day;
    data["flag"]="MINUS";
    data["goalId"]=value[1][actual_goal_id.innerHTML];

    var header = $(".actual_date").text();
    var words = header.split(' ');
    var month_name = words[0];
    var year = words[1];
    var id = months.indexOf(month_name);
    data["month"]=id;
    data["year"]=year;

    saveTileToDB(data);
    retrieveActualCount(value[1][actual_goal_id.innerHTML]);
    makeChart($("#chart_changer").val());
    event.stopPropagation();
}

function retrieveMaxCount(value){
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/calendar/maxCounter",
        dataType: 'json',
        async: false,
        data: JSON.stringify(value),
        success: function (dane) {
            $('#best_counter').text(dane);
        },
        error: function (e) {
            console.log("ERROR: ", e);
        }
    });
}

function GetThisHidden(){
    $(".bar").removeClass('zoomIn');
    $(".bar").css("opacity", "0").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
        $(".bar").css("display", "none");
    });
    $(".bar").addClass('zoomOut');

}

function GetThisDisplayed(){
    $(".bar").removeClass('animated zoomOut');
    $(".bar").addClass('animated zoomIn');
    $(".bar").css("display", "block").css("opacity", "1").unbind('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend');
}

function onDayClick(day){
    $('.day').removeClass( "day active" ).addClass( "day" );
    var target = day;
    $(target).removeClass( "day" ).addClass( "day active" );
    if ($('.bar').css("display") == "none"){
        GetThisDisplayed();
        $('.bar').css( {position:"absolute", top:event.pageY - 60, left: event.pageX + 10});
    }
    else{
        GetThisHidden();
    }

}

function retrieveActualCount(value){
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/calendar/actualCounter",
        dataType: 'json',
        async: false,
        data: JSON.stringify(value),
        success: function (dane) {
            $('#actual_counter').text(dane);
            retrieveMaxCount(value);
        },
        error: function (e) {
            console.log("ERROR: ", e);
        }
    });
}

function saveTileToDB(data) {
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/calendar/saveTile",
        data: JSON.stringify(data),
        dataType: 'json',
        async: false,
        success: function (dane) {
            console.log("passed");
        },
        error: function (e) {
            console.log("ERROR: ", e);
        }
    });
}

function deleteGoalFunc(target, event){
    event.preventDefault();
    var data = {};
    data["name"]=value[1][Number($(target).parent().find(".slide_goal_id").text())].name;
    data["id"]=value[1][Number($(target).parent().find(".slide_goal_id").text())].id;
    $(target).parent().remove();
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/calendar/deleteGoal",
        data: JSON.stringify(data),
        dataType: 'json',
        success: function (datassek) {
            console.log("passed");
            updateSortable();
            retrieveNewData(null, null, "deleted");
        },
        error: function (e) {
            console.log("ERROR: ", e);
        }
    });
}
$( document ).ready(function() {

    $('body').on('click', '.slide', function(event) {
        event.preventDefault();
        var header = $(".actual_date").text();
        var words = header.split(' ');
        var month_name = words[0];
        var year = words[1];
        var id = months.indexOf(month_name);

        actual_goal_id.innerHTML = $(this).find('.slide_goal_id').html();
        retrieveNewData(id, year, actual_goal_id.innerHTML);
    });


    $('body').on('submit', '#formek', function(event) {

        event.preventDefault();

        var data = {};
        data["name"]=$('#name').text();
        data["position"]=$('.list_goals').children().length;

        if($('#name').text().length <=0 || $('#name').text().length>170){
            return;
        }

        else{
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "/calendar/addGoal",
            data: JSON.stringify(data),
            dataType: 'json',
            success: function (datassek) {
                console.log("passed");
                $('#myModal').modal('toggle');
                $('#name').text("");
                retrieveNewData(null, null, "new")
                $(".add_error").css("display", "none");
            },
            error: function (e) {
                console.log("ERROR: ", e);
            }
        });
        }
    });

    $('body').on('submit', '#edit_formek', function(event) {
        event.preventDefault();

        var data = {};
        data["name"]=$('#edit_name').text();
        data["id"]=value[1][Number(actual_goal_id.innerHTML)].id;
        data["position"]=$(".slide_goal_id:contains('"+actual_goal_id.innerHTML+"')").parent().index();

        if($('#edit_name').text().length <=0 || $('#edit_name').text().length>170){
            return;
        }
        else{
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "/calendar/editGoal",
            data: JSON.stringify(data),
            dataType: 'json',
            success: function (datassek) {
                console.log("passed");
                retrieveNewData(null, null, "new")
                $(".add_error").css("display", "none");
            },
            error: function (e) {
                console.log("ERROR: ", e);
            }
        });
        }
    });


    $('body').on('click', ".previous_date .fa.fa-chevron-left", function(event) {
        setPreviousMonth();
    });

    $('body').on('click', ".next_date .fa.fa-chevron-right", function(event) {
        setNextMonth();
    });

    $('body').on('click', ".previous_goal .fa.fa-chevron-left", function(event) {
        setPreviousGoal();
    });

    $('body').on('click', ".next_goal .fa.fa-chevron-right", function(event) {
        setNextGoal();
    });

});

function setNextMonth() {
    var header = $(".actual_date").text();
    var words = header.split(' ');
    var month_name = words[0];
    var year = words[1];
    var id = months.indexOf(month_name);
    id++;
    if(id==12) {
        id = 0;
        year++;
        if(year==years[years.length-1])
        {
            return;
        }
    }

    createNewCalendar(value, id, year, null);
}

function setPreviousMonth() {
    var header = $(".actual_date").text();
    var words = header.split(' ');
    var month_name = words[0];
    var year = words[1];
    var id = months.indexOf(month_name);

    if(id==0) {
        id = 12;
        year--;
        var nextYear = (years[0]) - 1;
        if(year==nextYear)
        {
            return;
        }
    }
    id--;

    createNewCalendar(value, id, year, null);
}

function setNextGoal(){
    var header = $(".actual_date").text();
    var words = header.split(' ');
    var month_name = words[0];
    var year = words[1];
    var id = months.indexOf(month_name);

    retrieveNewData(id, year, "nx");
}

function setPreviousGoal(){
    var header = $(".actual_date").text();
    var words = header.split(' ');
    var month_name = words[0];
    var year = words[1];
    var id = months.indexOf(month_name);

    retrieveNewData(id, year, "pr");
}








/**
 * Created by Admin on 18.06.2017.
 */


    var goal_header_reset = document.createElement('div');
    goal_header_reset.setAttribute('style', 'clear: both;');

    var date_header_reset = document.createElement('div');
    date_header_reset.setAttribute('style', 'clear: both;');

    var goal_header = document.createElement('div');
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


function retrieveData() {

    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/calendar/retrieveData/goals",
        dataType: 'json',
        success: function (dane) {
            var node = document.createTextNode(dane[0].name);
            actual_goal.innerHTML = "";
            actual_goal.appendChild(node);
            createCalendar('2', '2017');
        },
        error: function (e) {
            console.log("ERROR: ", e);
        }
    });
}


function dataRetriever(dane) {
    var value = null;
    value = dane;
    var newValue1 = JSON.stringify(value[0]);
    var newValue2 = JSON.stringify(value[1]);

    createNewCalendar(value);
}

function retrieveNewData() {

    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/calendar/retrieveData/tiles",
        dataType: 'json',
        success: function (dane) {
            dataRetriever(dane);
        },
        error: function (e) {
            console.log("ERROR: ", e);
        }
    });
}

function createNewCalendar(value) {
    document.body.innerHTML = "";
    var today = new Date();
    var this_month_id = today.getMonth();
    var this_year = today.getFullYear();

    var table = document.createElement('table');
    var daysss = days_in_month[this_month_id];
    if((this_year % 4 == 0 &&this_year % 100 != 0) || this_year % 400 == 0){
        daysss = 29;
    }

    var day = 1;
    var plus;
    for(var rows=1; rows<=5; rows++) {
        switch (rows) {
            case 1:
                plus = 0;
                break;
            case 2:
                plus = 7;
                break;
            case 3:
                plus = 14;
                break;
            case 4:
                plus = 21;
                break;
            case 5:
                plus = 28;
                break;
        }
        var tr = document.createElement('tr');
        for(var days=1; days <=7; days++){
            if(day>daysss){
                break;
            }
            var td = document.createElement('td');
            td.innerHTML = day;
            td.className = "day";
            td.setAttribute('onclick', 'onDayClick(this)');
            for(var i=0; i<value[0].length; i++){
            if (value[0][i].day == day ) {
                if(value[0][i].flag == "TICK"){
                    td.innerHTML = "";
                    td.style.cssText = "background: url(/style/tick.png) no-repeat; background-size:cover;";
                }
                else if(value[0][i].flag == "CROSS"){
                    td.innerHTML = "";
                    td.style.cssText = "background: url(http://www.pngall.com/wp-content/uploads/2016/04/Red-Cross-Mark-PNG.png) no-repeat; background-size:cover;";
                }
            }
            }
            tr.appendChild(td);
            table.appendChild(tr);
            day++
        }
    }

    actual_date.innerHTML = months[this_month_id] + " " + this_year;
    $("body").append(goal_header);
    $("body").append(date_header);
    $("body").append(table);

    var bar = document.createElement('div');
    var tick_choice = document.createElement('div');
    tick_choice.className = "tick_choice";
    tick_choice.setAttribute("id", "tick");
    tick_choice.setAttribute('onclick', 'onTickClick(this, event)');
    var cross_choice = document.createElement('div');
    cross_choice.className = "cross_choice";
    cross_choice.setAttribute("id", "cross");
    cross_choice.setAttribute('onclick', 'onCrossClick(this, event)');
    var reset_div = document.createElement('div')
    reset_div.setAttribute('style', 'clear: both;');
    bar.append(tick_choice);
    bar.append(cross_choice);
    bar.append(reset_div);
    bar.className = "bar";
    $('body').append(bar);

    var form = document.createElement('div');
    form.innerHTML="" +
        "<form id='formek' method='post' th:action='@{/calendar/addGoal}'>"
        + "<div><label> Nazwa celu : <input type='text' id='name' name='name'/> </label></div>" +
        "<div><input type='submit' value='Dodaj cel'/></div>"
    "</form>";
    form.className = "forma";
    $("body").append(form);
}

function createCalendar(month_id, year){
    document.body.innerHTML = "";

    var table = document.createElement('table');

    var daysss = days_in_month[month_id];
    if((year % 4 == 0 &&year % 100 != 0) || year % 400 == 0){
        daysss = 29;
    }

    var day = 1;

    for(var rows=1; rows<=5; rows++) {
        var tr = document.createElement('tr');
        for(var days=1; days <=7; days++){
            if(day>daysss){
                break;
            }
            var td = document.createElement('td');
            td.innerHTML = day;
            td.className = "day";
            td.setAttribute('onclick', 'onDayClick(this)');
            // + " " + day;
            tr.appendChild(td);
            day++;
            table.appendChild(tr);
        }
    }

    actual_date.innerHTML = months[month_id] + " " + year;
    $("body").append(goal_header);
    $("body").append(date_header);
    $("body").append(table);

    var bar = document.createElement('div');
    var tick_choice = document.createElement('div');
    tick_choice.className = "tick_choice";
    tick_choice.setAttribute("id", "tick");
    tick_choice.setAttribute('onclick', 'onTickClick(this, event)');
    var cross_choice = document.createElement('div');
    cross_choice.className = "cross_choice";
    cross_choice.setAttribute("id", "cross");
    cross_choice.setAttribute('onclick', 'onCrossClick(this, event)');
    var reset_div = document.createElement('div')
    reset_div.setAttribute('style', 'clear: both;');
    bar.append(tick_choice);
    bar.append(cross_choice);
    bar.append(reset_div);
    bar.className = "bar";
    $('body').append(bar);

    var form = document.createElement('div');
    form.innerHTML="" +
        "<form id='formek' method='post' th:action='@{/calendar/addGoal}'>"
        + "<div><label> Nazwa celu : <input type='text' id='name' name='name'/> </label></div>" +
        "<div><input type='submit' value='Dodaj cel'/></div>"
    "</form>";
    form.className = "forma";
    $("body").append(form);

}

function onTickClick(target, event) {
    $('.day.active').text("");
    $('.day.active').css('background', ' url(/style/tick.png) no-repeat');
    $('.day.active').css('backgroundSize', 'cover');
    $(target).parent().toggle();

    var day = $('.day.active').index();
    var tr_index = $('.day.active').parent().index() + 1;
    switch (tr_index) {
        case 1:
            day = day+1;
            break;
        case 2:
            day = day+8;
            break;
        case 3:
            day = day+15;
            break;
        case 4:
            day = day+22;
            break;
        case 5:
            day = day+29;
            break;
    }
    $('.day.active').removeClass( "day active" ).addClass( "day" );
    var data = {};
    data["day"]=day;
    data["flag"]="TICK";

    var header = $(".actual_date").text();
    var words = header.split(' ');
    var month_name = words[0];
    var year = words[1];
    var id = months.indexOf(month_name);
    data["month"]=id;
    data["year"]=year;

    saveTileToDB(data);
    event.stopPropagation();
}

function onCrossClick(target, event) {
    $('.day.active').text("");
    $('.day.active').css('background', ' url(http://www.pngall.com/wp-content/uploads/2016/04/Red-Cross-Mark-PNG.png) no-repeat');
    $('.day.active').css('backgroundSize', 'cover');
    $(target).parent().toggle();

    var day = $('.day.active').index();
    var tr_index = $('.day.active').parent().index() + 1;
    switch (tr_index) {
        case 1:
            day = day+1;
            break;
        case 2:
            day = day+8;
            break;
        case 3:
            day = day+15;
            break;
        case 4:
            day = day+22;
            break;
        case 5:
            day = day+29;
            break;
    }
    $('.day.active').removeClass( "day active" ).addClass( "day" );
    var data = {};
    data["day"]=day;
    data["flag"]="CROSS";

    var header = $(".actual_date").text();
    var words = header.split(' ');
    var month_name = words[0];
    var year = words[1];
    var id = months.indexOf(month_name);
    data["month"]=id;
    data["year"]=year;

    saveTileToDB(data);
    event.stopPropagation();
}

function onDayClick(day){
    $('.day').removeClass( "day active" ).addClass( "day" );
    var target = day;
    $(target).removeClass( "day" ).addClass( "day active" );
    $('.bar').css( {position:"absolute", top:event.pageY - 60, left: event.pageX});
    $('.bar').toggle();
}

function saveTileToDB(data) {
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/calendar/saveTile",
        data: JSON.stringify(data),
        dataType: 'json',
        success: function (dane) {
            console.log("passed");
        },
        error: function (e) {
            console.log("ERROR: ", e);
        }
    });
}



// $( document ).ready(function() {
//     $('body').on('submit', '#formek', function(event) {
//         event.preventDefault();
//
//         var data = {};
//         data["name"]=$('#name').val();
//
//         $.ajax({
//             type: "POST",
//             contentType: "application/json",
//             url: "/calendar/addGoal",
//             data: JSON.stringify(data),
//             dataType: 'json',
//             success: function (dane) {
//                 var node = document.createTextNode(dane.name);
//                 actual_goal.innerHTML = "";
//                 actual_goal.appendChild(node);
//             },
//             error: function (e) {
//                 console.log("ERROR: ", e);
//             }
//         });
//     });
//
//
//     $('body').on('click', ".previous_date .fa.fa-chevron-left", function(event) {
//         setPreviousMonth();
//     });
//
//     $('body').on('click', ".next_date .fa.fa-chevron-right", function(event) {
//         setNextMonth();
//     });
//
// });

// function setNextMonth() {
//     var header = $(".actual_date").text();
//     var words = header.split(' ');
//     var month_name = words[0];
//     var year = words[1];
//     var id = months.indexOf(month_name);
//     id++;
//     if(id==12) {
//         id = 0;
//         year++;
//         if(year==years[years.length-1])
//         {
//             return;
//         }
//     }
//
//     createCalendar(id, year);
// }
//
// function setPreviousMonth() {
//     var header = $(".actual_date").text();
//     var words = header.split(' ');
//     var month_name = words[0];
//     var year = words[1];
//     var id = months.indexOf(month_name);
//
//     if(id==0) {
//         id = 12;
//         year--;
//         var nextYear = (years[0]) - 1;
//         if(year==nextYear)
//         {
//             return;
//         }
//     }
//     id--;
//
//     createCalendar(id, year);
// }









/**
 * Created by Admin on 01.07.2017.
 */
var pos;

function getChoicesCount(choice, type){
    retrieveValue();
    var counter = 0;
    for (var i = 0; i <= value[0].length-1; i++) {

        if(type=="one"){
            var header = $(".actual_date").text();
            var words = header.split(' ');
            var month_name = words[0];
            var year = words[1];
            var id = months.indexOf(month_name);

            if (value[0][i].goalId.id == value[1][actual_goal_id.innerHTML].id && value[0][i].flag == choice && value[0][i].month == id)
            {
                counter++;
            }
        }
        else{
            if (value[0][i].goalId.id == value[1][actual_goal_id.innerHTML].id && value[0][i].flag == choice)
            {
                counter++;
            }
        }
    }
    return counter;
}

function makeAreChart(){
    var trytytki;
    var celek={};
    celek["name"]=value[1][Number(actual_goal_id.innerHTML)].name;
    celek["id"]=value[1][Number(actual_goal_id.innerHTML)].id;
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/calendar/returnStrengths",
        data: JSON.stringify(celek),
        dataType: 'json',
        success: function (dane) {
            console.log("passed");
            trytytki = dane;
        },
        error: function (e) {
            console.log("ERROR: ", e);
        },
        async: false
    });

    var variable={
        type: 'line',
        data: {
            datasets: [{
                data: [],
                label: value[1][actual_goal_id.innerHTML].name,
                backgroundColor: "rgba(46, 204, 113, .3)",
                borderColor: "rgb(46, 204, 113)",
                fill: true
            }],

            labels: [
            ]
        },
        options: {
            title: {
                display: true,
                text: 'Siła celu - budowa!'
            }, scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: "Sila"
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: "Sierpien"
                    }
                }]
            }
        }
    }

    for(var i=0; i<trytytki.length; i++){
        variable.data.datasets[0].data.push(trytytki[i].strength);
        variable.data.labels.push(Number(new Date(trytytki[i].date).getUTCDate()))
    }

    var canvas1 = document.getElementById('area_chart');
    canvas1.innerHTML = '';
    canvas1.innerHTML = "<canvas id='myChart1'></canvas>";
    var ctx1= document.getElementById('myChart1').getContext('2d');
    var chartek = new Chart(ctx1, variable);
}

function makeChart(type){
    var canvas = document.getElementById('canvek');
    canvas.innerHTML = '';
    canvas.innerHTML = "<canvas id='myChart'></canvas>";
    var ctx = document.getElementById('myChart').getContext('2d');
    var myDoughnutChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [getChoicesCount("TICK", type), getChoicesCount("YELLOWTICK", type), getChoicesCount("CROSS", type), getChoicesCount("MINUS", type)],
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

function updateSortable(zmienna){
    $('.list_goals').find('.slide').each(function(){
        var goalId = $(this).find('.slide_goal_id').html();
        var goalPosition = $(this).index();
        pos = goalPosition;
        editGoal(goalId, goalPosition);
    });
    if(zmienna!="delete"){
        loadAdvAndCons(actual_goal_id.innerHTML);
    }
}

function putSelectable(target){
    $(target).toggleClass('selectable');
}

function editGoal(id, position){
    retrieveValue();
    var data = {};
    data["name"]=value[1][id].name;
    data["id"]=value[1][id].id;
    data["position"]=position;
    data["firstAdvantage"]=value[1][id].firstAdvantage;
    data["secondAdvantage"]=value[1][id].secondAdvantage;
    data["thirdAdvantage"]=value[1][id].thirdAdvantage;

    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/calendar/editGoal",
        data: JSON.stringify(data),
        dataType: 'json',
        success: function (dane) {
            console.log("passed");
        },
        error: function (e) {
            console.log("ERROR: ", e);
        },
        async: false
    });
}

function addOnType(event){
        var cntMaxLength = parseInt($(this).attr('maxlength'));

        if ($(this).text().length >= cntMaxLength) {
            if(!(event.which==8 || event.ctrlKey || event.shiftKey || event.button))
            {
                event.preventDefault();
                $(this).parent().find(".add_error").css("display", "block");
            }
        }
        else{
            $(this).parent().find(".add_error").css("display", "none");
        }
}

function addOnTypeKeyDown(event){
    var cntMaxLength = parseInt($(this).attr('maxlength'));

    event = event || window.event;

    if ($(this).text().length >= cntMaxLength) {
        if(!(event.which==8))
        {
            event.preventDefault();
            $(this).parent().find(".add_error").css("display", "block");
        }
    }
    else{
        $(this).parent().find(".add_error").css("display", "none");
    }
    //!(event.which==8 || (event.ctrlKey && (event.which == 65)) || (event.ctrlKey && (event.which == 67)) || (event.ctrlKey && (event.which == 86)))
}

function updateMinusDay(day, target) {
    var bol = "false";
    var data={}
    data["goalId"]=value[1][actual_goal_id.innerHTML];

    for(var i=0; i<=6; i++){
        if($(target).parent().find("div").eq(i).hasClass("selectable")){
            bol="true";
        }
        else{
            bol="false";
        }
        data[$(target).parent().find("div").eq(i).attr('id')] = bol;
    }

    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/calendar/updateMinusTile",
        dataType: 'json',
        async: false,
        data: JSON.stringify(data),
        success: function (dane) {
            console.log("passed");
        },
        error: function (e) {
            console.log("ERROR: ", e);
        }
    });
}

function retrieveMinusTiles(){
    var data = {};
    data["name"]=$('.goal_name').html();
    data["id"]=value[1][Number(actual_goal_id.innerHTML)].id;

    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/calendar/retrieveMinusTiles",
        dataType: 'json',
        async: false,
        data: JSON.stringify(data),
        success: function (dane) {
            $("#off_options").find("div").removeClass("selectable");
            jQuery.each(dane, function(i, val) {
                if(val=="true"){
                    $("#off_options").find("div").eq(i).addClass("selectable");
                }
            });
        },
        error: function (e) {
            console.log("ERROR: ", e);
        }
    });
}


$(document).ready(function () {

    // $('.list_goals').perfectScrollbar();

    var editor = new MediumEditor('.editable', {
        placeholder: {
            /* This example includes the default options for placeholder,
             if nothing is passed this is what it used */
            text: 'Kliknij aby napisac...',
            hideOnClick: true
        },
    });

    editor.subscribe('blur', function (event, editable) {
        var data = {};
        data["id"]=value[1][Number(actual_goal_id.innerHTML)].id;
        data["name"]=value[1][Number(actual_goal_id.innerHTML)].name;
        data["firstAdvantage"]=$("#firstAdvantage").html();
        data["secondAdvantage"]=$("#secondAdvantage").html();
        data["thirdAdvantage"]=$("#thirdAdvantage").html();
        data["position"]=$(".slide_goal_id:contains('"+actual_goal_id.innerHTML+"')").parent().index();

        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "/calendar/editGoal",
            data: JSON.stringify(data),
            dataType: 'json',
            success: function (datassek) {
                console.log("passed");
            },
            error: function (e) {
                console.log("ERROR: ", e);
            }
        });
    });

    var divek = document.getElementById("name");
    var secondDivek = document.getElementById("edit_name");
    divek.addEventListener("blur", addOnType);
    divek.addEventListener("keyup", addOnType);
    divek.addEventListener("keydown", addOnTypeKeyDown);
    divek.addEventListener("paste", addOnType);
    divek.addEventListener("copy", addOnType);
    divek.addEventListener("cut", addOnType);
    divek.addEventListener("delete", addOnType);
    divek.addEventListener("mouseup", addOnType);

    secondDivek.addEventListener("blur", addOnType);
    secondDivek.addEventListener("keyup", addOnType);
    secondDivek.addEventListener("keydown", addOnTypeKeyDown);
    secondDivek.addEventListener("paste", addOnType);
    secondDivek.addEventListener("copy", addOnType);
    secondDivek.addEventListener("cut", addOnType);
    secondDivek.addEventListener("delete", addOnType);
    secondDivek.addEventListener("mouseup", addOnType);

    $('#circle-element').on('click', function () {
        $('#myModal').modal('show');
    });


    $('.list_goals').sortable({
        revert: false,
        handle: '.goal_grip',
        update: function (event, ui) {
            updateSortable(false);
        }
    });

    $('.list_goals').disableSelection();

    $("div[contenteditable='true'][maxlength]").on('keydown', function (event) {
        var cntMaxLength = parseInt($(this).attr('maxlength'));

        if ($(this).text().length >= cntMaxLength) {
            if(event.keyCode != 8)
            {
                event.preventDefault();
            }
            $('#add_error').css("display", "block");
        }
        else{
            $('#add_error').css("display", "none");
        }
    });

    $('#edit_buttonek_second').on('click', function () {
        $('#edit_buttonek_second').toggle();
        $('#edit_buttonek').toggle();
        $('#edit_name').toggleClass("namik");
        $('#edit_name').toggleClass("namikTheSecond");
        $('#edit_name').attr("contenteditable", "true");
    });

    $('#deletik').on('click', function () {
        deleteGoalFunc($(".slide_goal_id:contains('"+actual_goal_id.innerHTML+"')"));
    });

    $('#add_adv_buttonek').on('click', function () {
        var count = $(".listOfStaff li").length;
        console.log(count);
        if(count==1){
            $(".listOfStaff").append('<li class="editable" id="secondAdvantage"></li>');
            editor.addElements('.editable');
            $("#przyciskiSecond").css("width", "260px")
            $("#add_adv_buttonek").css("margin-right", "20px")
            $('#delete_adv_buttonek').toggle();
        }
        else if (count==2){
            $(".listOfStaff").append('<li class="editable" id="thirdAdvantage"></li>');
            editor.addElements('.editable');
            $("#przyciskiSecond").css("width", "120px")
            $('#add_adv_buttonek').toggle();
        }
    });

    $('#delete_adv_buttonek').on('click', function () {
        var count = $(".listOfStaff li").length;
        console.log(count);
        if(count==3){
            $("#thirdAdvantage").remove();
            $("#przyciskiSecond").css("width", "260px")
            $("#add_adv_buttonek").css("margin-right", "20px")
            $('#add_adv_buttonek').toggle();
        }
        else if (count==2){
            $("#secondAdvantage").remove();
            $("#przyciskiSecond").css("width", "120px")
            $("#add_adv_buttonek").css("margin-right", "0px")
            $('#delete_adv_buttonek').toggle();
        }
    });

    $(document).click(function(event) {
        if(!$(event.target).closest('.day').length) {
            GetThisHidden();
        }
    });

});
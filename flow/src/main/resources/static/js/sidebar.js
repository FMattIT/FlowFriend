/**
 * Created by Admin on 01.07.2017.
 */
var pos;

function getChoicesCount(choice){
    var counter = 0;
    for (var i = 0; i <= value[0].length-1; i++) {

        if (value[0][i].goalId.id == value[1][actual_goal_id.innerHTML].id && value[0][i].flag == choice)
        {
            counter++;
        }
    }
    return counter;
}

function makeChart(){
    var canvas = document.getElementById('general');
    canvas.innerHTML = '';
    canvas.innerHTML = "<canvas id='myChart'></canvas>";
    var ctx = document.getElementById('myChart').getContext('2d');
    var myDoughnutChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [getChoicesCount("TICK"), getChoicesCount("YELLOWTICK"), getChoicesCount("CROSS"), getChoicesCount("MINUS")],
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

function updateSortable(){
    $('.list_goals').find('.slide').each(function(){
        var goalId = $(this).find('.slide_goal_id').html();
        var goalPosition = $(this).index();
        pos = goalPosition;
        editGoal(goalId, goalPosition);
    });
}

function editGoal(id, position){
    var data = {};
    data["name"]=value[1][id].name;
    data["id"]=value[1][id].id;
    data["position"]=position;

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
        }
    });
}

$(document).ready(function () {

    $('.fa.fa-bars').on('click', function () {
        $('.sidebar').toggleClass('active');
    });

    $('.fa.fa-plus-circle').on('click', function () {
        $('#myModal').modal('show');
    });


    $('.list_goals').sortable({
        revert: false,
        handle: '.goal_grip',
        update: function (event, ui) {
            updateSortable();
        }
    });

    $('.list_goals').disableSelection();

});
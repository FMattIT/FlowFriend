/**
 * Created by Admin on 01.07.2017.
 */
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
            $(this).find('.slide').each(function(i, el){
                var goalId = $(this).find('.slide_goal_id').html();
                var goalPosition = $(this).index();
                editGoal(goalId, goalPosition);
            });
        }
    });

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

    $('.list_goals').disableSelection();
});
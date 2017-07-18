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
            console.log($('.list_goals').sortable('toArray'));
        }
    });

    $('.list_goals').disableSelection();
});
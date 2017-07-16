/**
 * Created by Admin on 01.07.2017.
 */
$(document).ready(function () {

    $('.fa.fa-bars').on('click', function () {
        $('.sidebar').toggleClass('active');
    });

    $('.list_goals').sortable({
        revert: false,
        handle: '.goal_grip'
    });

    $('.list_goals').disableSelection();

});
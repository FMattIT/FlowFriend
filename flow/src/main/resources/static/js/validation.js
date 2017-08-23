/**
 * Created by Admin on 22.08.2017.
 */
$(document).ready(function () {
    var password = document.getElementById("password")
        , confirm_password = document.getElementById("confirm_password");

    function validatePassword() {
        if (password.value != confirm_password.value) {
            confirm_password.setCustomValidity("Podane hasła różnią się od siebie!");
        } else {
            confirm_password.setCustomValidity('');
        }
    }

    password.onchange = validatePassword;
    confirm_password.onkeyup = validatePassword;


    $("#formik").on('submit', function (e) {

        var data = {};
        data["username"]=$('#loginss').val();
        data["email"]=$('#email').val();
        data["password"]=$('#password').val();
        data["confirmPassword"]=$('#confirm_password').val();

        e.preventDefault();

        $.ajax({
            type: "POST",
            contentType: "application/json",
            dataType: 'json',
            url: "/register/checkData",
            data: JSON.stringify(data),
            success: function (newData) {
                console.log(newData);
            },
            error: function (xhr, status, error) {
                console.log("ERROR: ", error);
            }
        });
    });

});


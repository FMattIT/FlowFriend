/**
 * Created by Admin on 22.08.2017.
 */
$(document).ready(function () {
    var login = document.getElementById("loginss")
        , email = document.getElementById("email");


    function validateLoginAndEmail() {
        var data = {};
        data["username"]=$('#loginss').val();
        data["email"]=$('#email').val();

        $.ajax({
            type: "POST",
            contentType: "application/json",
            dataType: 'json',
            url: "/register/checkData",
            data: JSON.stringify(data),
            async:false,
            success: function (newData) {
                if (newData.login != 0) {
                    login.setCustomValidity("Login jest już używany przez innnego użytkownika, wybierz inny!");
                } else {
                    login.setCustomValidity('');
                }

                if (newData.email != 0) {
                    email.setCustomValidity("Email jest już używany przez innnego użytkownika, wybierz inny!");
                } else {
                    email.setCustomValidity('');
                }
            },
            error: function (xhr, status, error) {
                console.log("ERROR: ", error);
            }
        });
    }

    login.onchange=validateLoginAndEmail;
    email.onchange=validateLoginAndEmail;

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


});


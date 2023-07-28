// $(document).ready(function () {

// });

$("#registerBtn").click(function (e) {
    e.preventDefault();
    $("#loginCard").hide();
    $("#registerCard").show();
});
$("#loginBtn").click(function (e) {
    e.preventDefault();
    $("#loginCard").show();
    $("#registerCard").hide();
});

$("#confirmPassword").keyup(function (e) {
    if ($(this).val().length > 0) {
        if ($("#registerPassword").val() != $(this).val()) {
            $("#confirmPasswordLabel").show();
            $("#registerSubmit").attr('disabled', 'disabled');
            return;
        }
        $("#confirmPasswordLabel").hide();
        $("#registerSubmit").removeAttr('disabled');
    }
});
$("#registerPassword").keyup(function (e) {
    if ($("#confirmPassword").val().length > 0) {
        if ($("#confirmPassword").val() != $(this).val()) {
            $("#confirmPasswordLabel").show();
            $("#registerSubmit").attr('disabled', 'disabled');
            return;
        }
        $("#confirmPasswordLabel").hide();
        $("#registerSubmit").removeAttr('disabled');
    }
});
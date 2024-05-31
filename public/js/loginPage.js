// $(document).ready(function () {

// });

$("#registerBtn").click(function (e) {
    e.preventDefault();
    $("#loginCard").addClass('d-none');
    $("#registerCard").removeClass('d-none');
});
$("#loginBtn").click(function (e) {
    e.preventDefault();
    $("#loginCard").removeClass('d-none');
    $("#registerCard").addClass('d-none');
});

$("#confirmPassword").keyup(function (e) {
    if ($(this).val().length > 0) {
        if ($("#registerPassword").val() != $(this).val()) {
            $("#confirmPasswordLabel").removeClass('d-none');
            $("#registerSubmit").attr('disabled', 'disabled');
            return;
        }
        $("#confirmPasswordLabel").addClass('d-none');
        $("#registerSubmit").removeAttr('disabled');
    }
});
$("#registerPassword").keyup(function (e) {
    if ($("#confirmPassword").val().length > 0) {
        if ($("#confirmPassword").val() != $(this).val()) {
            $("#confirmPasswordLabel").removeClass('d-none');
            $("#registerSubmit").attr('disabled', 'disabled');
            return;
        }
        $("#confirmPasswordLabel").addClass('d-none');
        $("#registerSubmit").removeAttr('disabled');
    }
});
function user_change_view_mode(){
    $.ajax({
        type: "PUT",
        url: "/user-change-view-mode",
        success: function(){},
        error: function(){
            alertify.error(error_undefine_mess)
        }
    })
}

$(document).ready(function() {
    // $("#bootstrap-dark-style").attr("disabled", !1)
    // $("#bootstrap-style").attr("disabled", !0)
    // $("#app-dark-style").attr("disabled", !1)
    // $("#app-style").attr("disabled", !0)

    // $("#bootstrap-dark-style").attr("disabled", !0)
    // $("#bootstrap-style").attr("disabled", !1)
    // $("#app-dark-style").attr("disabled", !0)
    // $("#app-style").attr("disabled", !1)
})
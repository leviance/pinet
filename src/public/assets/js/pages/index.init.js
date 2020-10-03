$(document).ready(function() {
   $("#user-status-carousel").owlCarousel({
      items: 4,
      loop: !1,
      margin: 16,
      nav: !1,
      dots: !1
  }), $("#user-profile-hide").click(function() {
      $(".user-profile-sidebar").hide()
  }), $(".chat-user-list li a").click(function() {
      $(".user-chat").addClass("user-chat-show")
  }), $(".user-chat-remove").click(function() {
      $(".user-chat").removeClass("user-chat-show")
  })
});
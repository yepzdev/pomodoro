"use strict";

$(function () {

  // Events needed to change the styles of each list item when clicked
  $("#task-list").on("click", "li, li span, li p", function (e) {
    // to not highlight a task when we press finish/remove button
    if ($(e.target).is("button")) {
      return ;
    }
    
    // highlighted only once
    if ($(e.target).hasClass("highlighted")) {
      console.log("ya esta resaltado");
      return ;
    }
    
    $("#pending-list li").removeClass("highlighted");
    $(this).closest("li").addClass("highlighted");
  });
});

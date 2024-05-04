"use strict";

$(function () {

  // Events needed to change the styles of each list item when clicked
  $("#task-list").on("click", "li", function (e) {
    // to not highlight a task when we press finish/remove button
    if ($(e.target).is("button")) {
      return ;
    }

    $("#pending-list li").removeClass("highlighted");
    $(this).addClass("highlighted");
  });

  // This event is also necessary because it allows us to apply styles to
  // elements that are dynamically introduced into the DOM.
  $("#task-list").on("click", "li span, li p", function (e) {
    e.stopPropagation();
    if (!$(e.target).is("button")) {
      $("#pending-list li").removeClass("highlighted");
      $(this).closest("li").addClass("highlighted");
    }
  });
});

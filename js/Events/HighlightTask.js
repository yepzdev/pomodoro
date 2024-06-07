"use strict";

import TaskManager from "./../task_manager.js";
import { POMOTASK_URL } from "./../endpoints.js";

$(function () {
  // Events needed to change the styles of each list item when clicked
  $("#task-list").on("click", "li, li span, li p", function (e) {
    // to not highlight a task when we click the finish/delete button
    if ($(e.target).is("button")) {
      return ;
    }
    
    // highlighted only once
    if ($(e.target).hasClass("highlighted")) {
      // console.log("ya esta resaltado");
      return ;
    }
    
    // remove all highlighted tasks
    $("#pending-list li").removeClass("highlighted");
    // highlight task target
    $(this).closest("li").addClass("highlighted");
    // save id li item
    let taskId = $(this).closest("li").attr("data-task-id");
    // new task instance to be able to update the tasks.
    const task = new TaskManager();

    fetch(POMOTASK_URL + '/highlighted.php', {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: taskId,
        highlighted: 1,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        return response.json();
      })
      .then((data) => {
        console.warn(data);
        task.getData();
      })
      .catch((error) => {
        console.error(
          "There was a problem with your fetch operation:",
          error
        );
      });
  });
});

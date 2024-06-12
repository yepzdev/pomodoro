"use strict";

import TaskManager from "./../task_manager.js";
import { POMOTASK_URL } from "./../endpoints.js";
import fetchData from "../Api/Fetch.js";

$(function () {
  // Events needed to change the styles of each list item when clicked
  $(document).on("click", "#pending-list li, #pending-list li span, #pending-list li p", function (e) {

    let $target = $(e.target);

    // Do nothing if highlighted
    if ($target.is("button")) {
      return;
    }

    // Do nothing if it's a button
    if ($target.hasClass("highlighted")) {
      return;
    }

    // remove all highlighted tasks
    $("#pending-list li").removeClass("highlighted");
    // highlight task target
    $(this).closest("li").addClass("highlighted");
    // save id li item
    let taskId = $(this).closest("li").attr("data-task-id");
    // new task instance to be able to update the tasks.
    const task = new TaskManager();

    let taskData = {
      url: POMOTASK_URL + "/highlighted.php",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        id: taskId,
        highlighted: 1,
      },
    };

    fetchData(taskData)
      .then((data) => {
        console.warn(data);
        task.update();
      })
      .catch((error) => {
        console.error("There was a problem with your fetch operation:", error);
      });
  });
});

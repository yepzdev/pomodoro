"use strict";

import * as buttons from "./buttons.js";

// task list field
let add_task_field = $("<input>");
add_task_field.clone().attr("id", "task-field").appendTo(".task-container");

// pending list container
let pending_list = $("<div>")
  .attr({
    id: "pending-list",
    class: "pending-list-container",
  })
  .html("<h3>Pending list</h3><ul></ul>");

// complete list container
let complete_list = $("<div>")
  .attr({
    id: "complete-list",
    class: "complete-list-container",
  })
  .html("<h3>complete list</h3><ul></ul>");

$(() => {
  let counter = 0;
  $("#add-task").click(() => {
    const newTask = $("#task-field").val(),
      finish = buttons.finish_task.get(0).outerHTML,
      remove = buttons.remove_task.get(0).outerHTML;
    if (newTask !== "") {
      pending_list.appendTo("#task-list");
      let taskItem = $("#pending-list ul").append(
        `<li data-task-id="${counter}">${newTask}${finish}${remove}</li>`
      );
      $("#task-field").val("");
      counter++;

      taskItem.find(".remove-task").click(function () {
        const taskIdToRemove = $(this).closest("li").attr("data-task-id");
        $(`[data-task-id="${taskIdToRemove}"]`).remove();

        if (!taskItem.find(".remove-task").length) {
          $("#pending-list").remove();
          counter = 0;
        }
      });
    }
  });
});

$(document).ready(() => {
  let timer;
  let timeLeft = 25 * 60; // 25 minutes in seconds
  let isPaused = true;

  function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      remainingSeconds < 10 ? "0" : ""
    }${remainingSeconds}`;
  }

  const updateTimer = () => {
    $("#timer").text(formatTime(timeLeft));
  };

  const toggleTimer = () => {
    if (isPaused) {
      timer = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft === 0) {
          clearInterval(timer);
          alert("¡Tiempo terminado!");
        }
      }, 1000);
      isPaused = false;
      $("#start").text("Pause");
    } else {
      clearInterval(timer);
      isPaused = true;
      $("#start").text("Start");
    }
  };

  $("#short-break-btn").click(() => {
    resetInterval(5);
  });

  $("#long-break-btn").click(() => {
    resetInterval(15);
  });

  $("#pomodoro-btn").click(() => {
    resetInterval(25);
  });

  $("#start").click(() => toggleTimer());

  $("#reset").click(() => {
    resetInterval(25);
  });

  updateTimer();

  const resetInterval = (time) => {
    timeLeft = time * 60;
    clearInterval(timer);
    isPaused = true;
    $("#start").text("Start");
    updateTimer();
  };
});

// "use strict";

import * as button from "./buttons.js";

// task list field
let addTaskField = $("<input>");
addTaskField.clone().attr("id", "task-field").appendTo(".task-container");

// pending list container
let pendingList = $("<div>")
  .attr({
    id: "pending-list",
    class: "pending-list-container",
  })
  .html("<h3>Pending list</h3><ul></ul>");

// complete list container
let finishList = $("<div>")
  .attr({
    id: "finish-list",
    class: "finish-list-container",
  })
  .html("<h3>complete list</h3><ul></ul>");

class TaskManager {
  constructor() {
    this.taskId = 0;
    this.finishButton = button.finish.get(0).outerHTML;
    this.removeButton = button.remove.get(0).outerHTML;
    this.undoButton = button.undo.get(0).outerHTML;
  }

  isEmptyTask(name) {
    return name !== "";
  }

  add(name = null) {
    let task = name || $("#task-field").val();
    if (this.isEmptyTask(name)) {
      pendingList.appendTo("#task-list");
      let taskItem = $("#pending-list ul").append(
        `<li data-task-id="${this.taskId}">${task}${this.finishButton}${this.removeButton}</li>`
      );
      $("#task-field").val("");
      this.taskId++;
      this.remove(taskItem);
      this.finish(taskItem);
    }
  }

  // dynamically generates the remove and finish button
  remove(item) {
    item.find(".remove-task").click(function () {
      const taskIdToRemove = $(this).closest("li").attr("data-task-id");
      $(`[data-task-id="${taskIdToRemove}"]`).remove();

      // remove unordered list if there are no tasks
      if (!item.find(".remove-task").length) {
        $("#pending-list").remove();
        this.taskId = 0;
      }
    });
  }

  finish(item) {
    let self = this;
    item.find(".finish-task").click(function () {
      let liTaskItem = $(this).parent();
      // detach ul item and add liTaskItem
      let ul = finishList.find("ul").detach().append(liTaskItem);
      // remove finish and remove buttons
      ul.find("button").remove();
      // add undo button
      ul.find("li").append(`${self.undoButton}`);
      // attached to the finish list
      finishList.append(ul);
      // insert into the task list
      finishList.appendTo("#task-list");
      // set undo event
      self.undo(self);

      // remove unordered list if there are no tasks
      if (!item.find(".finish-task").length) {
        $("#pending-list").remove();
        this.taskId = 0;
      }
    });
  }

  undo(self) {
    $("#finish-list")
      .find(".undo-button")
      .click(function () {
        let liTaskItem = $(this).parent();
        liTaskItem.find("button").remove();
        let name = liTaskItem.text();
        self.add(name);
        liTaskItem.remove();

        // remove unordered list if there are no tasks
        if (!$("#finish-list").find(".undo-button").length) {
          $("#finish-list").remove();
        }
      });
  }
}

$(document).ready(function () {
  const task = new TaskManager();
  $("#add-task").click(function () {
    task.add();
  });
});

$(document).ready(() => {
  let timer;
  let timeLeft = 25 * 60; // 25 minutes in seconds
  let isPaused = true;
  const POMODORO = 25;
  const SHORT_BREAK = 5;
  const LONG_BREAK = 15;

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
    resetInterval(SHORT_BREAK);
  });

  $("#long-break-btn").click(() => {
    resetInterval(LONG_BREAK);
  });

  $("#pomodoro-btn").click(() => {
    resetInterval(POMODORO);
  });

  $("#start").click(() => toggleTimer());

  $("#reset").click(() => {
    resetInterval(POMODORO);
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

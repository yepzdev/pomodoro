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
    this.finish = button.finish.get(0).outerHTML;
    this.remove = button.remove.get(0).outerHTML;
    this.undo = button.undo.get(0).outerHTML;
  }

  isEmptyTask(name) {
    return name !== "";
  }

  addTask(name = null) {
    let task = name || $("#task-field").val();
    if (this.isEmptyTask(name)) {
      pendingList.appendTo("#task-list");
      let taskItem = $("#pending-list ul").append(
        `<li data-task-id="${this.taskId}">${task}${this.finish}${this.remove}</li>`
      );
      $("#task-field").val("");
      this.taskId++;
      this.removeTask(taskItem);
      this.finishTask(taskItem);
    }
  }

  // dynamically generates the remove and finish button
  removeTask(item) {
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

  finishTask(item) {
    let self = this;
    item.find(".finish-task").click(function () {
      finishList.appendTo("#task-list");
      // gets the task item
      let liTaskItem = $(this).parent();
      // attached to unordered list
      let ul = finishList.find("ul").append(liTaskItem);
      finishList.find("button").remove();
      // attach the undo button
      ul.find("li").append(`${self.undo}`);
      self.undoTask(self);
    });
  }

  undoTask(self) {
    $("#finish-list")
      .find(".undo-button")
      .click(function () {
        let liTaskItem = $(this).parent();
        liTaskItem.find("button").remove();
        let name = liTaskItem.text();
        self.addTask(name);
        liTaskItem.remove();
      });
  }
}

$(document).ready(function () {
  const taskManager = new TaskManager();
  $("#add-task").click(function () {
    taskManager.addTask();
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

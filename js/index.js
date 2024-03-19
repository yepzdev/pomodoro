"use strict";

import taskManager from "./task_manager.js";

// task list field
let addTaskField = $("<input>");
addTaskField.clone().attr("id", "task-field").appendTo(".add-task-field");

$(document).ready(function () {
  const task = new taskManager();
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

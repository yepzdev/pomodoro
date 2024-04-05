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

  // py default the timer is paused
  let isPaused = true;

  // pomodoros counter
  let counter = 1;
  let heHadBreaks = false;

  // const POMODORO = 25;
  // const SHORT_BREAK = 5;
  // const LONG_BREAK = 15;

  const POMODORO = 1 / 10; // 6s
  const SHORT_BREAK = 1 / 30; // 2s
  const LONG_BREAK = 1 / 20; // 3s

  // establishes the number of cycles necessary to apply long rests or short rests
  // For example, if you want to apply long breaks after 3 pomodoros or more, change the value of the constant.
  const CYCLES = 3;

  // This method formats the timer to be human readable.
  function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      remainingSeconds < 10 ? "0" : ""
    }${remainingSeconds}`;
  }

  function playAudio(id) {
    return $(`${id}`)[0].play();
  }

  // This method shows the remaining time in the HTML
  const showTimer = () => {
    $("#timer").text(formatTime(timeLeft));
  };

  // Shows the number of pomodoros in the HTML #1, 2, 3...
  const showNumberOfPomodoros = (counter) => {
    $("#pomodoro-counter").text(`#${counter}`);
  };

  const isTimerExpired = () => {
    return timeLeft === 0;
  };

  // This method is important because it is what will allow us to know the number of 
  // pomodoros (cycles) completed based on the counter (pomodoro counter) and thus be able to apply long or short rest.
  const isEqualToNumberOf = (cycles) => {
    return counter % cycles === 0;
  };

  // This method handles the rest timer and pomodoro timer.
  // It is what allows us to assign rest timers or pomodoros
  const breakHandler = (breakTime) => {
    // If you already had a rest timer then set the pomodoro timer
    if (heHadBreaks) {
      setTimeInterval(POMODORO);
      // pomodoro counter
      counter++;
      showNumberOfPomodoros(counter);
      heHadBreaks = false;
      return;
    }

    // set shift break timer
    setTimeInterval(breakTime);
    heHadBreaks = true;
  };

  // This method checks the number of cycles of a pomodoro
  // one cycle is a pomodoro + short/long rest
  // Based on these numbers of cycles, short or long rest will be applied.
  const checkCycles = () => {
    isEqualToNumberOf(CYCLES)
      ? breakHandler(LONG_BREAK)
      : breakHandler(SHORT_BREAK);
  };

  // This method starts the time or resumes it
  function startTimer() {
    timer = setInterval(() => {
      timeLeft--;
      showTimer();
      // we check that the timer has ended
      if (isTimerExpired()) {
        clearInterval(timer);
        $("#start").text("Start");
        checkCycles();
      }
    }, 1000);

    isPaused = false;
    $("#start").text("Pause");
  }

  // This method starts/pauses the timer
  const toggleTimer = () => {
    // check the timer status
    if (isPaused) {
      return startTimer(timeLeft);
    }
    
    clearInterval(timer);
    isPaused = true;
    $("#start").text("Start");
  };

  $("#short-break-btn").click(() => {
    heHadBreaks = true;
    setTimeInterval(SHORT_BREAK);
  });

  $("#long-break-btn").click(() => {
    heHadBreaks = true;
    setTimeInterval(LONG_BREAK);
  });

  $("#pomodoro-btn").click(() => {
    heHadBreaks = false;
    setTimeInterval(POMODORO);
  });

  $("#start").click(() => {
    toggleTimer();
    playAudio("#audio-pomodoro");
  });

  // maybe this button doesn't make sense
  $("#reset").click(() => {
    setTimeInterval(POMODORO);
    playAudio("#audio-pomodoro");
  });

  const setTimeInterval = (time) => {
    timeLeft = time * 60;
    clearInterval(timer);
    isPaused = true;
    $("#start").text("Start");
    showTimer();
  };

  showTimer();
  showNumberOfPomodoros(counter);
});

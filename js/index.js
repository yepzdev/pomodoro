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
  let counter = 1;
  let heHadBreaks = false;

  // const POMODORO = 25;
  // const SHORT_BREAK = 5;
  // const LONG_BREAK = 15;

  const POMODORO = 1 / 10; // 6s
  const SHORT_BREAK = 1 / 30; // 2s
  const LONG_BREAK = 1 / 20; // 3s
  const CYCLES = 3;

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

  const updateTimerHtml = () => {
    $("#timer").text(formatTime(timeLeft));
  };

  const updateTimerCycle = (counter) => {
    $("#pomodoro-counter").text(`#${counter}`);
  };

  const isTimeExpired = () => {
    return timeLeft === 0;
  };

  // devuelve verdadero si se cumple el numero de ciclos
  const isEqualToNumberOf = (cycles) => {
    return counter % cycles === 0;
  };

  // nos aseguramos de que el usuario no tuvo
  // descansos en el ciclo anterior y asi poder establecer el
  // pomodoro nuevamente
  const breakHandler = (time) => {
    if (heHadBreaks) {
      setTimeInterval(POMODORO);
      counter++;
      updateTimerCycle(counter);
      heHadBreaks = false;
      return;
    }
    setTimeInterval(time);
    heHadBreaks = true;
  };

  // comprueba los X ciclos del pomodoro para
  // establecer descanso largo, de lo contrario establece un
  // descanso corto.
  const checkCycles = () => {
    if (isEqualToNumberOf(CYCLES)) {
      // long break
      return breakHandler(LONG_BREAK);
    }
    // short break
    breakHandler(SHORT_BREAK);
  };

  const checkPausedTimer = () => {
    if (isPaused) {
      timer = setInterval(() => {
        timeLeft--;
        updateTimerHtml();
        if (isTimeExpired()) {
          clearInterval(timer);
          $("#start").text("Start");
          checkCycles();
          // must be removing in the future
          alert("¡Tiempo terminado!");
        }
      }, 1000);

      isPaused = false;
      return $("#start").text("Pause");
    }

    clearInterval(timer);
    isPaused = true;
    $("#start").text("Start");
  };

  const toggleTimer = () => {
    checkPausedTimer();
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
    updateTimerHtml();
  };

  updateTimerHtml();
  updateTimerCycle(counter);
});

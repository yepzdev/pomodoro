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
  let pomodoroCounter = 1;
  let heHadBreaks = false;

  // const POMODORO = 25;
  // const SHORT_BREAK = 5;
  // const LONG_BREAK = 15;

  const POMODORO = 1/10; // 6s
  const SHORT_BREAK = 1/30 // 2s
  const LONG_BREAK = 1/20; // 3s

  function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      remainingSeconds < 10 ? "0" : ""
    }${remainingSeconds}`;
  }

  function playAudioButton(id) {
    return $(`${id}`)[0].play();
  }

  const updateTimer = () => {
    $("#timer").text(formatTime(timeLeft));
    updatePomodoroCounter(pomodoroCounter);
  };

  const updatePomodoroCounter = (number) => {
    $("#pomodoro-counter").text(`#${number}`);
  }

  const toggleTimer = () => {
    if (isPaused) {
      timer = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft === 0) {
          clearInterval(timer);
          // pomodoroCounter++;
          // updatePomodoroCounter(pomodoroCounter);
          $("#start").text("Start");
          
          // comprueba los tres ciclos del pomodoro para
          // establecer descanso largo, de lo contrario establece un
          // descanso corto.
          if ((pomodoroCounter % 3) === 0) {
            // long break
            
            // nos aseguramos de que el usuario no tuvo
            // descansos en el ciclo anterior y asi poder establecer el 
            // pomodoro nuevamente
            if (heHadBreaks) {
              resetInterval(POMODORO);
              pomodoroCounter++;
              updatePomodoroCounter(pomodoroCounter);
              heHadBreaks = false;  
            } else {
              resetInterval(LONG_BREAK);
              heHadBreaks = true;
            }      
          } else {
            // short break
            if (heHadBreaks) {
              resetInterval(POMODORO);
              pomodoroCounter++;
              updatePomodoroCounter(pomodoroCounter);
              heHadBreaks = false;
            } else {
              resetInterval(SHORT_BREAK);
              heHadBreaks = true;
            }

          }
          
          // must be removing in the future
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
    heHadBreaks = true;
    resetInterval(SHORT_BREAK);
  });

  $("#long-break-btn").click(() => {
    heHadBreaks = true;
    resetInterval(LONG_BREAK);
  });

  $("#pomodoro-btn").click(() => {
    heHadBreaks = false;
    resetInterval(POMODORO);
  });

  $("#start").click(() => {
    toggleTimer();
    playAudioButton("#audio-pomodoro");
  });

  // maybe this button doesn't make sense
  $("#reset").click(() => {
    resetInterval(POMODORO);
    playAudioButton("#audio-pomodoro");
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

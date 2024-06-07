"use strict";

import taskManager from "./task_manager.js";
import "./Events/HighlightTask.js";
import { POMOTASK_URL } from "./endpoints.js";
import { addTaskComponent } from "./Components/addTaskComponent.js";
import { addTaskEvents } from "./Events/addTaskEvents.js";

const task = new taskManager();
$(document).ready(function () {

  let addTaskButton = $("#add-task-btn");
  // get the template to add task
  const template = addTaskComponent();
  // assigns the events necessary for the template to work
  addTaskEvents(addTaskButton, template);
  
  // update tasks
  task.getData();

  $(addTaskButton).click(function () {
    // task.add();
  });

  // Event for the enter key, allows us to create tasks more easily.
  $("#task-field").keypress(function (event) {
    if (event.which === 13) {
      // task.add();
    }
  });
});

$(document).ready(() => {
  let timer;
  let timeLeft = 25 * 60; // 25 minutes in seconds
  // save the pomodoro cycles
  let pomodoroCycles = 1;

  // by default the timer is paused
  let isPaused = true;
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
  const showNumberOfPomodoros = () => {
    $("#pomodoro-counter").text(`#${pomodoroCycles}`);
  };

  const isTimerExpired = () => {
    return timeLeft === 0;
  };

  // This method is important because it is what will allow us to know the number of
  // pomodoros (cycles) completed based on the counter (pomodoro counter) and thus be able to apply long or short rest.
  const isEqualToNumberOf = (cycles) => {
    return pomodoroCycles % cycles === 0;
  };

  // This method handles the rest timer and pomodoro timer.
  // It is what allows us to assign rest timers or pomodoros
  const breakHandler = function (breakTime) {
    // If you already had a rest timer then set the pomodoro timer
    if (heHadBreaks) {
      setTimeInterval(POMODORO);
      pomodoroCycles++;

      // Check that the pending task is highlighted
      if ($("ul").find("li.highlighted").length) {
        let id = $("ul").find("li.highlighted").attr("data-task-id");

        // increases the number of times the pomodoro was completed for this task
        fetch(POMOTASK_URL + "increase_highlighted_task.php", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }

            return response.json();
          })
          .then((data) => {
            task.getData();
          })
          .catch((error) => {
            console.error(
              "There was a problem with your fetch operation:",
              error
            );
          });
      }

      showNumberOfPomodoros();
      heHadBreaks = false;
    } else {
      // set short break timer
      setTimeInterval(breakTime);
      heHadBreaks = true;
    }
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
  showNumberOfPomodoros();
});

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
  // por defecto el temporizador no esta en pausa
  let isPaused = false;
  // contador de ciclos del temporizador,
  // no confundir con la constante CYCLE que establece
  // la cantidad de ciclos 

  // counter es igual a un ciclo, un ciclo igual a  pomodoro + short/long_break
  let counter = 1;
  let heHadBreaks = false;

  // const POMODORO = 25;
  // const SHORT_BREAK = 5;
  // const LONG_BREAK = 15;

  const POMODORO = 1 / 10; // 6s
  const SHORT_BREAK = 1 / 30; // 2s
  const LONG_BREAK = 1 / 20; // 3s
  // establece la cantidad de ciclos necesarios para tener descansos largos y cortos
  const CYCLES = 3;

  // da formato al tiempo para que sea legible para humanos 
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

  // muestra el temporizador en el HTML
  // showTimer()
  const updateTimerHtml = () => {
    $("#timer").text(formatTime(timeLeft));
  };

  // muestra la cantidad de ciclos ( pomodoros ) completados en el HTML
  // tal vez sea mejor renombrar este metodo a 
  // showNumberCycles()
  const updateTimerCycle = (counter) => {
    $("#pomodoro-counter").text(`#${counter}`);
  };
  
  const isTimeExpired = () => {
    return timeLeft === 0;
  };
  
  // este metodo sirve para establecer la cantidad de ciclos
  // necesarios para aplicar descansos largos/cortos

  // devuelve verdadero si se cumple el numero de ciclos
  // counter - contador de ciclos
  // CYCLE - establecedor de ciclos
  const isEqualToNumberOf = (cycles) => {
    return counter % cycles === 0;
  };

  // nos aseguramos de que el usuario no tuvo
  // descansos en el ciclo anterior y asi poder establecer el
  // pomodoro nuevamente

  // note que el contador de ciclos no aumenta cuando hay descanso
  const breakHandler = (breakTime) => {

    // entonces si es que el usuario ya tuvo un descanso, entonces se 
    // vuelve a establecer el pomodoro/ 25 mins
    if (heHadBreaks) {
      setTimeInterval(POMODORO);
      // aumenta el contador de ciclos pomodoro
      counter++;
      // muestra el incrementoo del ciclo en el html
      updateTimerCycle(counter);
      // ya no estamos descansando
      heHadBreaks = false;
      return;
    }

    // de lo contrario, establece un descanso
    setTimeInterval(breakTime);
    // por lo tanto, a partir de este momento el usuario
    // tuvo un descanso.
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

  // comprueba la pausa del temporizador
  const checkPausedTimer = () => {
    
    if (!isPaused) {
      // continua con el intervalo de tiempo
      timer = setInterval(() => {
        timeLeft--;
        updateTimerHtml();
        // comprueba que el tiempo ha terminado
        if (isTimeExpired()) {
          clearInterval(timer);
          $("#start").text("Start");
          // como el tiempo ha expirado, comprobamos 
          // los ciclos para establecer tiempo de descanso
          checkCycles();
          // must be removing in the future
          alert("¡Tiempo terminado!");
        }
      }, 1000);

      console.log('start');
      isPaused = true;
      return $("#start").text("Pause");
    }
    
    console.log('stop');
    clearInterval(timer);
    isPaused = false;
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

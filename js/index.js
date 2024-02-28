(() => {

  "use strict";

  // start / pause button
  let button = document.createElement('button');
  $(button)
    .clone()
    .attr('id', 'start')
    .addClass('start-btn')
    .text('Start')
    .appendTo(".pomodoro-button-wrapper.footer");

  // reset button
  $(button)
    .clone()
    .attr('id', 'reset')
    .addClass('reset-btn')
    .text('Reset')
    .appendTo(".pomodoro-button-wrapper.footer");
  
  // pomodoro button 
  $(button).clone().attr('id', 'pomodoro-btn').text('Pomodoro').appendTo(".pomodoro-button-wrapper.header");

  // long break button  
  $(button).clone().attr('id', 'long-break-btn').text('Long Break').appendTo(".pomodoro-button-wrapper.header");

  // short break button 
  $(button).clone().attr('id', 'short-break-btn').text('Short Break').appendTo(".pomodoro-button-wrapper.header");

  // codigo de chatGPT
  $(document).ready(() => {
    let timer;
    let timeLeft = 25 * 60; // 25 minutes in seconds
    let isPaused = true;

    function formatTime(seconds) {
        let minutes = Math.floor(seconds / 60);
        let remainingSeconds = seconds % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    function updateTimer() {
        $("#timer").text(formatTime(timeLeft));
    }

    function toggleTimer() {
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
    }

    $("#short-break-btn").click(() => {
        timeLeft = 5 * 60;
        updateTimer();
    });

    $("#long-break-btn").click(() => {
        timeLeft = 15 * 60;
        updateTimer();
    });


    $("#pomodoro-btn").click(() => {
        timeLeft = 25 * 60;
        updateTimer();
    });

    $("#start").click(() => toggleTimer());

    $("#reset").click(() => {
        clearInterval(timer);
        timeLeft = 25 * 60;
        updateTimer();
        isPaused = false;
    });

    updateTimer();
});

})();

(() => {

  "use strict";

  // start / pause button
  let button = document.createElement('button');
  $(button).clone().addClass('start-btn').text('Start').appendTo(".pomodoro-button-wrapper.footer");
  
  // pomodoro button 
  $(button).clone().addClass('pomodoro-btn').text('Pomodoro').appendTo(".pomodoro-button-wrapper.header");

  // long break button  
  $(button).clone().addClass('long-break-btn').text('Long Break').appendTo(".pomodoro-button-wrapper.header");

  // short break button 
  $(button).clone().addClass('short-break-btn').text('Short Break').appendTo(".pomodoro-button-wrapper.header");
})();

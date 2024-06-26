let button = $("<button>");

// start
$(button)
.clone()
.attr("id", "start")
.addClass("start-btn btn-red")
.html("<i class='fa-solid fa-play'></i>")
.appendTo(".pomodoro-button-wrapper.footer");

// reset 
$(button)
.clone()
.attr("id", "reset")
.addClass("reset-btn btn-dark")
.html("<i class='fa-solid fa-arrow-rotate-right'></i>")
.appendTo(".pomodoro-button-wrapper.footer");

// pomodoro
$(button)
.clone()
.attr("id", "pomodoro-btn")
.addClass("btn-dark")
.text("Pomodoro")
.appendTo(".pomodoro-button-wrapper.header");

// long break
$(button)
.clone()
.attr("id", "long-break-btn")
.addClass("btn-dark")
.text("Long Break")
.appendTo(".pomodoro-button-wrapper.header");

// short break
$(button)
.clone()
.attr("id", "short-break-btn")
.addClass("btn-dark")
.text("Short Break")
.appendTo(".pomodoro-button-wrapper.header");

// ======================== task list elements ==============================

// finish
export let finish = $(button)
.clone()
.addClass("finish-task")
.text("finish");

// remove
export let remove = $(button)
.clone()
.addClass("remove-task")
.text("remove");

// undo
export let undo = $(button)
.clone()
.addClass("undo-button")
.text("undo");

export let button = $("<button>");

// start
$(button)
.clone()
.attr("id", "start")
.addClass("start-btn")
.text("Start")
.appendTo(".pomodoro-button-wrapper.footer");

// reset 
$(button)
.clone()
.attr("id", "reset")
.addClass("reset-btn")
.text("Reset")
.appendTo(".pomodoro-button-wrapper.footer");

// pomodoro
$(button)
.clone()
.attr("id", "pomodoro-btn")
.text("Pomodoro")
.appendTo(".pomodoro-button-wrapper.header");

// long break
$(button)
.clone()
.attr("id", "long-break-btn")
.text("Long Break")
.appendTo(".pomodoro-button-wrapper.header");

// short break
$(button)
.clone()
.attr("id", "short-break-btn")
.text("Short Break")
.appendTo(".pomodoro-button-wrapper.header");

// ======================== task list elements ==============================

// add task
$(button)
.clone()
.attr("id", "add-task")
.text("Add task")
.appendTo(".task-container");

// finish task
$(button)
.clone()
.attr("id", "check-task")
.text("finish")
.appendTo(".task-container");

// remove task
$(button)
.clone()
.attr("id", "remove-task")
.text("remove")
.appendTo(".task-container");

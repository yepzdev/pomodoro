import TaskManager from "./../task_manager.js";

export function addTaskEvents(addTaskButton, getTemplate) {
  $(document).on("click", `#${addTaskButton.attr("id")}`, function () {
    // container template
    $(".add-task-container").empty().append(getTemplate());
  });

  // cancel event
  $(document).on("click", "#btn-cancel", function () {
    $(".add-task-container").empty().append(addTaskButton);
  });

  // This event will allow us to save the task data
  $(document).on("click", "#btn-save", function () {
    
    // get all task data
    let taskDescription = $(".add-task-container")
      .find(".add-task-textarea")
      .val();

    let estimatedPomodoro = $(".input-number-container")
      .find("#add-task-input")
      .val();

    let task = new TaskManager();
    task.add({ taskDescription, estimatedPomodoro });
    // replace with the "add task" button after saving the task
    $(".add-task-container").empty().append(addTaskButton);
  });

  // Event for the enter key, allows us to create tasks more easily.
  $(".add-task-container").on("keypress", function (e) {
    if (e.which === 13) {
      
      let taskDescription = $(".add-task-container")
        .find(".add-task-textarea")
        .val();
      
        let estimatedPomodoro = $(".input-number-container")
        .find("#add-task-input")
        .val();

      let task = new TaskManager();
      task.add({ taskDescription, estimatedPomodoro });
      $(".add-task-container").empty().append(addTaskButton);
    }
  });

  // Validate input to accept only numbers from 1 to 20
  $(document).on("input", "#add-task-input", function () {
    var value = parseInt($(this).val(), 10);
    if (value < 1 || value > 20) {
      $(this).val("");
      alert("Please enter a number between 1 and 20");
    }
  });

  // Prevent non-numeric input
  $(document).on("keypress", "#add-task-input", function (e) {
    var charCode = e.which ? e.which : e.keyCode;
    if (charCode < 48 || charCode > 57) {
      e.preventDefault();
    }
  });
}

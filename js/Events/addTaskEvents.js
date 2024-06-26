import TaskManager from "./../task_manager.js";

const MAX_ESTIMATED_POMOS = "20";
const MIN_ESTIMATED_POMOS = "1";

export function addTaskEvents(addTaskButton, getTemplate) {

  let containerContent = $("#add-task-container").html();
 
  $(document).on("click", `#${addTaskButton.attr("id")}`, function () {
    $(".add-task-container").removeClass("dashed");
    // set component template
    $(".add-task-container").empty().append(getTemplate());
    $(".add-task-container textarea").focus();
  });

  // cancel event
  $(document).on("click", "#btn-cancel", function (e) {
    // to prevent propagation with the parent element
    e.stopPropagation();
    $(".add-task-container").addClass("dashed");
    $(".add-task-container").empty().append(containerContent);
  });

  // increases the number of estimated pomodoros
  $(document).on("click", "#btn-increase-estimated", function () {
    // estimated input element
    let estimatedIpunt = $("#add-task-input"),
      inputValue = estimatedIpunt.val();

    inputValue !== MAX_ESTIMATED_POMOS
      ? estimatedIpunt.val(++inputValue)
      : null;
  });

  // decrease the number of estimated pomodoros
  $(document).on("click", "#btn-decrements-estimated", function () {
    // estimated input element
    let estimatedIpunt = $("#add-task-input"),
      inputValue = estimatedIpunt.val();

    inputValue !== MIN_ESTIMATED_POMOS
      ? estimatedIpunt.val(--inputValue)
      : null;
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

  // ============== These events allow us to save tasks ==============

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
    // parse to integer
    estimatedPomodoro = parseInt(estimatedPomodoro);

    // validations
    // check that it is not empty text
    if (task.isEmpty(taskDescription)) {
      return console.error("La tarea debe tener una descripcion");
    }
    // check that it is an integer
    if (!Number.isInteger(estimatedPomodoro)) {
      return console.error("debe ser un numero entero");
    }

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
      estimatedPomodoro = parseInt(estimatedPomodoro);

      // validations
      // check that it is not empty text
      if (task.isEmpty(taskDescription)) {
        return console.error("La tarea debe tener una descripcion");
      }
      // check that it is an integer
      if (!Number.isInteger(estimatedPomodoro)) {
        return console.error("debe ser un numero entero");
      }
      
      task.add({ taskDescription, estimatedPomodoro });
      $(".add-task-container").empty().append(addTaskButton);
    }
  });

  // =================================================================
}

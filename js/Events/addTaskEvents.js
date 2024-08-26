import TaskManager from "./../task_manager.js";

const MAX_ESTIMATED_POMOS = "20";
const MIN_ESTIMATED_POMOS = "1";

export function addTaskEvents(addTaskContainer, getTemplate) {

  const $addTaskContainer = $("#add-task-container");

  function openTaskContainer() {
    $addTaskContainer.empty().append(getTemplate());
    $addTaskContainer.find("input[type='text']").focus();
    $addTaskContainer.removeClass("closed dashed").addClass("open");
  }

  function closeTaskContainer() {
    $addTaskContainer.removeClass("open").addClass("closed dashed");
    $addTaskContainer.empty().append(addTaskContainer);
  }

  $(document).on("click", "div.closed", function (e) {
    e.stopPropagation();
    openTaskContainer();
  });

  // cancel event
  $(document).on("click", "#btn-cancel", function (e) {
    // to prevent propagation with the parent element
    e.stopPropagation();
    closeTaskContainer();
  });

  // increases the number of estimated pomodoros
  $(document).on("click", "#btn-increase-estimated", function (e) {
    e.stopPropagation();

    let estimatedIpunt = $("#add-task-input"),
      inputValue = estimatedIpunt.val();

    inputValue !== MAX_ESTIMATED_POMOS
      ? estimatedIpunt.val(++inputValue)
      : null;
  });

  // decrease the number of estimated pomodoros
  $(document).on("click", "#btn-decrements-estimated", function (e) {
    e.stopPropagation();

    let estimatedIpunt = $("#add-task-input"),
      inputValue = estimatedIpunt.val();

    inputValue !== MIN_ESTIMATED_POMOS
      ? estimatedIpunt.val(--inputValue)
      : null;
  });

  // maintains focus when the user clicks on the number field
  $(document).on("click", "#add-task-input", function (e) {
    // We avoid the propagation of the click event for the other fields
    e.stopPropagation();
    $(this).focus();
  });

  // Validate input to accept only numbers from 1 to 20
  $(document).on("input", "#add-task-input", function (e) {
    var value = parseInt($(this).val(), 10);
    if (value < MIN_ESTIMATED_POMOS || value > MAX_ESTIMATED_POMOS ) {
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
  $(document).on("click", "#btn-save", function (e) {
    // get all task data
    let taskDescription = $addTaskContainer
      .find(".add-task-input-text")
      .val();

    let estimatedPomodoro = $(".input-number-container")
      .find("#add-task-input")
      .val();

    let task = new TaskManager();
    // parse to integer
    estimatedPomodoro = parseInt(estimatedPomodoro);

    if (task.isEmpty(taskDescription)) {
      // check that it is not empty text
      return console.error("La tarea debe tener una descripcion");
    }
    // check that it is an integer
    if (!Number.isInteger(estimatedPomodoro)) {
      return console.error("debe ser un numero entero");
    }

    task.add({ taskDescription, estimatedPomodoro });
    closeTaskContainer();
  });

  // Event for the enter key, allows us to create tasks more easily.
  $addTaskContainer.on("keypress", function (e) {
    if (e.which === 13) {
      let taskDescription = $addTaskContainer
        .find(".add-task-input-text")
        .val();

      let estimatedPomodoro = $(".input-number-container")
        .find("#add-task-input")
        .val();

      let task = new TaskManager();
      estimatedPomodoro = parseInt(estimatedPomodoro);

      // check that it is not empty text
      if (task.isEmpty(taskDescription)) {
        return console.error("The task must have a description");
      }
      // check that it is an integer
      if (!Number.isInteger(estimatedPomodoro)) {
        return console.error("Must be a integer number");
      }

      task.add({ taskDescription, estimatedPomodoro });
      closeTaskContainer();
    }
  });

  // =================================================================
}
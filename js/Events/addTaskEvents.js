export function addTaskEvents(addTaskButton, getTemplate) {

  $(document).on("click", `#${addTaskButton.attr("id")}`, function () {
    // container template
    $(".add-task-container").empty().append(getTemplate());
  });

  // start cancel event
  $(document).on("click", "#btn-cancel", function () {
    $(".add-task-container").empty().append(addTaskButton);
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

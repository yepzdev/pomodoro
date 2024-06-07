export function addTaskComponent() {
  let addTaskButton = $("#add-task-btn");
  // template
  function getTemplate() {
    return `
        <div class="add-task-container">
        <textarea class="add-task-textarea" placeholder="What are you working on ?"></textarea>
      <div class="input-numer-container">
        <input type="number" name="0" id="add-task-input" min="1" max="20" />
        <button id="btn-increase-estimated">up</button>
        <button id="btn-decrements-estimated">down</button>
      </div>
      <button id="btn-save">save</button>
      <button id="btn-cancel">cancel</button>
    </div>`;
  }

  // Return the button element for further use in event handlers
  return {addTaskButton, getTemplate};
}

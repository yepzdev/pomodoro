export function addTaskComponent() {
  function getTemplate() {
    return `  
      <input type="text" class="add-task-input-text" placeholder="What are you working on ?"></input>
      <div class="input-number-container">
        <input type="number" name="0" id="add-task-input" min="1" max="20" value="1" />
        <button id="btn-increase-estimated"> <i class="fa-solid fa-caret-up"></i></button>
        <button id="btn-decrements-estimated">down</button>
      </div>
      <button id="btn-save">save</button>
      <button id="btn-cancel">cancel</button>`;
  }

  // Return the button element for further use in event handlers
  return getTemplate;
}

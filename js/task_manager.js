import * as button from "./buttons.js";

// pending list container
let pendingList = $("<div>")
  .attr({
    id: "pending-list",
    class: "pending-list-container",
  })
  .html("<h3>Pending list</h3><ul></ul>");

// complete list container
let finishList = $("<div>")
  .attr({
    id: "finish-list",
    class: "finish-list-container",
  })
  .html("<h3>Complete list</h3><ul></ul>");

export default class TaskManager {
    constructor() {
      this.taskId = 0;
      this.finishButton = button.finish.get(0).outerHTML;
      this.removeButton = button.remove.get(0).outerHTML;
      this.undoButton = button.undo.get(0).outerHTML;
    }
  
    isEmpty(task) {
      return task.trim() !== "";
    }
  
    add(name = null) {
      let task = name || $("#task-field").val();
      if (this.isEmpty(task)) {
        pendingList.prependTo("#task-list");
        let taskItem = $("#pending-list ul").append(
          `<li data-task-id="${this.taskId}">${task}${this.finishButton}${this.removeButton}</li>`
        );
        $("#task-field").val("");
        this.taskId++;
        this.remove(taskItem);
        this.finish(taskItem);
      }
    }
  
    // dynamically generates the remove and finish button
    remove(item) {
      item.find(".remove-task").click(function () {
        const taskIdToRemove = $(this).closest("li").attr("data-task-id");
        $(`[data-task-id="${taskIdToRemove}"]`).remove();
  
        // remove unordered list if there are no tasks
        if (!item.find(".remove-task").length) {
          $("#pending-list").remove();
          this.taskId = 0;
        }
      });
    }
  
    finish(item) {
      let self = this;
      item.find(".finish-task").click(function () {
        let liTaskItem = $(this).parent();
        // detach ul item and add liTaskItem
        let ul = finishList.find("ul").detach().append(liTaskItem);
        // remove finish and remove buttons
        ul.find("button").remove();
        // add undo button
        ul.find("li").append(`${self.undoButton}`);
        // attached to the finish list
        finishList.append(ul);
        // insert into the task list
        finishList.appendTo("#task-list");
        // set undo event
        self.undo(self);
  
        // remove unordered list if there are no tasks
        if (!item.find(".finish-task").length) {
          $("#pending-list").remove();
          this.taskId = 0;
        }
      });
    }
  
    undo(self) {
      $("#finish-list")
        .find(".undo-button")
        .click(function () {
          let liTaskItem = $(this).parent();
          // remove undo button
          liTaskItem.find("button").remove();
          let name = liTaskItem.text();
          self.add(name);
          liTaskItem.remove();
  
          // undo unordered list if there are no tasks
          if (!$("#finish-list").find(".undo-button").length) {
            $("#finish-list").remove();
          }
        });
    }
  }
  
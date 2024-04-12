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
      this.taskName = null;
    }

    setPomoScore(score) {
      this.score = score;
    }

    // gets the number of current pomodoros score
    getCurrentPomoScore() {
      return this.score;
    }
  
    isEmpty(task) {
      return task.trim() !== "";
    }

    // This method updates the "li" element of the list, this
    // allows us to set the current pomodoro score.
    updateTaskScore = () => {
      // span elements contain the score of pomos
      let pomoScore = $("#pending-list").find('span');
    
      if (pomoScore.length) {
        let liCollection = $("#pending-list ul").detach();
        // remove old scores 
        liCollection.find("span").remove();
        // set score
        let span = $(`<span> 1/${this.getCurrentPomoScore()} </span>`);
        // set scores on each task
        liCollection.find("li").prepend(span);
        // set items in the pending list
        $("#pending-list").append(liCollection);
        
      }
    }
    
    add(taskName) {
      let task = taskName || $("#task-field").val();
      if (this.isEmpty(task)) {
        pendingList.prependTo("#task-list");

        // create li
        let li = $(`<li data-task-id="${this.taskId}"><p> ${task}</p></li>`);
        // add display inline
        li.find("p").addClass("inline");
        // create span
        let span = $(`<span> 1/${this.getCurrentPomoScore()} </span>`);
        // create buttons 
        let buttons = $(`${this.finishButton}${this.removeButton}`);
        // we add buttons to the li element
        li.append(buttons);
        // add span pomos score
        li.prepend(span);
        // add to unordered list
        let taskItem = $("#pending-list ul").append(li);
  
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
        // puts the class for text decoration
        ul.find("p").addClass("text-decoration-line");
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
          //remove span item
          liTaskItem.find("span").remove();
          // take task name with score
          let task = liTaskItem.text();
          // undo task
          self.add(task)
          // removes item from completed task list
          liTaskItem.remove();
  
          // undo unordered list if there are no tasks
          if (!$("#finish-list").find(".undo-button").length) {
            $("#finish-list").remove();
          }
        });
    }
  }
  
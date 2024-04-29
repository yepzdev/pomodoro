import * as button from "./buttons.js";
import { GET_ALL_TASKS_URL } from "./endpoints.js";

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

  // This method builds an elements list template
  createItemList(task) {
    return `<li data-task-id="${task.id}">
      <span>${task.spected} / ${task.current}</span>
      <p class="inline">${task.description}</p>
      ${this.finishButton}${this.removeButton}
    </li>`;
  }

  // This method obtains all the task data.
  async getData() {
    let self = this;

    try {
      const response = await fetch(GET_ALL_TASKS_URL);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      // we check that the data function
      // returns null when we don't receive
      // an empty array.
      if (data.length === 0) {
        console.log("no hay registros de tareas");
        return null;
      }

      let pendingElementStorage = [],
        completedElementStorage = [];

      // We separate the  tasks by their status
      // ( pending / completed )
      $.each(data, function (index, task) {
        // we filter by status
        if (task.status) {
          // wrap the item list in a jquery object
          let li = $(self.createItemList(task));

          // save item list
          pendingElementStorage.push(li);

          // clean field to add task
          $("#task-field").val("");

          // assing the click event to the remove button
          self.remove(li, task.id);

          // self.finish(item);
        } else {
          let li = $(self.createItemList(task));
          completedElementStorage.push(li);
          $("#task-field").val("");

          // this.remove(item);
          // this.finish(item);
        }
      });

      // append all pending tasks to the corresponding list.
      pendingList.find("ul").append(pendingElementStorage);
      pendingList.prependTo("#task-list");
      // remove unordered list if there are no tasks
      if (!pendingList.find(".remove-task").length) {
        $("#pending-list").remove();
      }
      // append all finish tasks
      finishList.find("ul").append(completedElementStorage);
      finishList.appendTo("#task-list");
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    }
  }

  setPomoScore(score) {
    this.score = score;
  }

  // gets the number of current pomodoros score
  getCurrentPomoScore() {
    return this.score;
  }

  isEmpty(task) {
    return task.trim() == "";
  }

  // This method updates the "li" element of the list, this
  // allows us to set the current pomodoro score.
  updateTaskScore = () => {
    // span elements contain the score of pomos
    // The span tag is where we show the score
    let pomoScore = $("#pending-list").find("span");

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
  };

  add(task) {
    let description = task || $("#task-field").val();

    // we check that the task is not an empty string
    if (this.isEmpty(description)) {
      console.error("Empty tasks cannot be created.");
      return null;
    }

    fetch(GET_ALL_TASKS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description,
        status: 1,
        spected: 1,
        current: 0,
        completed: 0,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Acceder a la propiedad 'value' del objeto 'data'
        console.log(data.value);
      })
      .catch((error) => {
        console.error("There was a problem with your fetch operation:", error);
      });

    // pendingList.prependTo("#task-list");

    // // create li
    // let li = $(`<li data-task-id="${this.taskId}"><p> ${task}</p></li>`);
    // // add display inline
    // li.find("p").addClass("inline");
    // // create span
    // let span = $(`<span> 1/${this.getCurrentPomoScore()} </span>`);
    // // create buttons
    // let buttons = $(`${this.finishButton}${this.removeButton}`);
    // // we add buttons to the li element
    // li.append(buttons);
    // // add span pomos score
    // li.prepend(span);
    // // add to unordered list
    // let taskItem = $("#pending-list ul").append(li);

    // $("#task-field").val("");
    // this.taskId++;
    // this.remove(taskItem);
    // this.finish(taskItem);
  }

  // This method does not create the remove button,
  // instead, what it does is assign the click
  // event to the remove button
  remove(item, id) {
    let self = this;
    // assign click event to all buttons to delete tasks
    item.find(".remove-task").click(function () {
      const removeIdButon = $(this).closest("li").attr("data-task-id");
      // const removeIdButon = $(this).closest("li").attr("data-task-id");

      if (parseInt(removeIdButon) !== id) {
        console.log("error al eliminar el elemento");
        return null;
      }

      fetch(GET_ALL_TASKS_URL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          // Acceder a la propiedad 'value' del objeto 'data'
          console.log(data);
        })
        .catch((error) => {
          console.error(
            "There was a problem with your fetch operation:",
            error
          );
        });

      $(`[data-task-id="${removeIdButon}"]`).remove();

      let pendingList = $("#pending-list ul");
      // remove unordered list if there are no tasks
      if (!pendingList.find(".remove-task").length) {
        $("#pending-list").remove();
      }
      // }
    });
  }

  finish(item) {
    let self = this;
    // item.find(".finish-task").click(function () {
    //   let liTaskItem = $(this).parent();
    //   // detach ul item and add liTaskItem
    //   let ul = finishList.find("ul").detach().append(liTaskItem);
    //   // remove finish and remove buttons
    //   ul.find("button").remove();
    //   // puts the class for text decoration
    //   ul.find("p").addClass("text-decoration-line");
    //   // add undo button
    //   ul.find("li").append(`${self.undoButton}`);
    //   // attached to the finish list
    //   finishList.append(ul);
    //   // insert into the task list
    //   finishList.appendTo("#task-list");
    //   // set undo event
    //   self.undo(self);

    //   // remove unordered list if there are no tasks
    //   if (!item.find(".finish-task").length) {
    //     $("#pending-list").remove();
    //     this.taskId = 0;
    //   }
    // });
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
        self.add(task);
        // removes item from completed task list
        liTaskItem.remove();

        // undo unordered list if there are no tasks
        if (!$("#finish-list").find(".undo-button").length) {
          $("#finish-list").remove();
        }
      });
  }
}

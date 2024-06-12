"use strict";

import * as button from "./buttons.js";
import { POMOTASK_URL } from "./endpoints.js";
import fetchData from "./Api/Fetch.js";

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

  /**
   * This method builds an elements list item template
   *
   * @param {Object} task - he task object containing id, spected, current and description properties
   * @param {int} status - The status indicating if the task is finished or not
   * @returns {string} - The HTML template for the list item
   */
  createItemList(task, status) {
    if (status) {
      return `<li data-task-id="${task.id}">
        <span>${task.expected} / ${task.current}</span>
        <p class="inline">${task.description}</p>
        ${this.finishButton}${this.removeButton}
      </li>`;
    }

    return `<li data-task-id="${task.id}">
        <span>${task.expected} / ${task.current}</span>
        <p class="inline">${task.description}</p>
        ${this.undoButton}
      </li>`;
  }

  // This method updates the entire task list.
  async update() {
    let self = this;

    try {
      const response = await fetch(POMOTASK_URL);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      // we check that the data function
      // returns null when we don't receive
      // an empty array.
      if (data.length === 0) {
        console.warn("There is no task log.");

        pendingList.find("ul").empty();
        finishList.find("ul").empty();

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
          let li = $(self.createItemList(task, task.status));

          // apply highlight styles
          if (task.highlighted) {
            li.addClass("highlighted");
          }

          // save item list
          pendingElementStorage.push(li);

          // clean field to add task
          $("#task-field").val("");

          self.remove(li, task.id);
          self.finish(li, task.id);
        } else {
          let li = $(self.createItemList(task, task.status));

          // line-through
          li.addClass("text-decoration-line");
          // applies styles to the completed task
          completedElementStorage.push(li);
          $("#task-field").val("");

          self.undo(li, task.id);
        }
      });

      // we empty the lists before adding the elements
      pendingList.find("ul").empty();
      finishList.find("ul").empty();

      // append all pending tasks to the corresponding list.
      pendingList.find("ul").append(pendingElementStorage);
      pendingList.prependTo("#task-list");

      finishList.find("ul").append(completedElementStorage);
      finishList.appendTo("#task-list");

      // remove unordered list if there are no pending tasks
      if (pendingElementStorage.length == 0) {
        pendingList.remove();
      }
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    }
  }

  isEmpty(task) {
    return task.trim() == "";
  }

  add(data) {
    let { taskDescription, estimatedPomodoro } = data;

    // prepare data for fetch API
    let taskData = {
      url: POMOTASK_URL,
      method: "POST",
      body: {
        description: taskDescription,
        status: 1,
        expected: estimatedPomodoro,
        current: 0,
        highlighted: 0,
      },
    };

    fetchData(taskData)
      .then((data) => {
        console.info(data);
        // update task
        this.update();
      })
      .catch((error) => {
        console.error("There was a problem with your fetch operation:", error);
      });
  }

  // This method does not create the remove button,
  // instead, what it does is assign the click
  // event to the remove button
  remove(item, id) {
    let self = this;
    // assign click event to all buttons to delete tasks
    item.find(".remove-task").click(function () {
      const removeIdButon = $(this).closest("li").attr("data-task-id");

      if (parseInt(removeIdButon) !== id) {
        console.log("error when removing task");
        return null;
      }

      let taskData = {
        url: POMOTASK_URL,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: { id: id },
      };

      fetchData(taskData)
        .then((data) => {
          console.info(data);
          // update tasks
          self.update();
        })
        .catch((error) => {
          console.error(
            "There was a problem with your fetch operation:",
            error
          );
        });
    });
  }

  finish(item, id) {
    let self = this;

    item.find(".finish-task").click(function () {
      let taskData = {
        url: POMOTASK_URL,
        method: "PUT",
        body: {
          id,
          status: 0,
        },
      };

      fetchData(taskData)
        .then((data) => {
          console.warn(data);
          // update tasks
          self.update();
        })
        .catch((error) => {
          console.error(
            "There was a problem with your fetch operation:",
            error
          );
        });
    });
  }

  undo(item, id) {
    self = this;
    item.find(".undo-button").click(function () {
      
      let taskData = {
        url: POMOTASK_URL,
        method: "PUT",
        body: {
          id,
          status: 1,
        },
      };

      fetchData(taskData).then((data) => {
          console.warn(data);
          // update tasks
          self.update();
        })
        .catch((error) => {
          console.error(
            "There was a problem with your fetch operation:",
            error
          );
        });
    });
  }
}

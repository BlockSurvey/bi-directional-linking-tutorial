import { Component, OnInit } from "@angular/core";
import { DataService } from "../data.service";
import { Router } from "@angular/router";


@Component({
  selector: "app-task",
  templateUrl: "./task.component.html",
  styleUrls: ["./task.component.scss"],
})
export class TaskComponent implements OnInit {
  newTaskObjectLocal;

  previousItems = [];

  items = [];

  list = [];

  newTaskObject;

  value;

  oldTask;

  newTask;

  dropdown = false;

  hashtag;

  searchTag;

  removeHash;

  tagList = [];

  linkedTask = [];
  unlinkedTask = [];

  tagname: any;

  searchList = [];

  newTaskName;

  constructor(private data: DataService, private router: Router) {}

  ngOnInit() {
    // Fetch the todo object from data service. 
    this.data.currentMessage.subscribe(
      (taskObject) => (this.newTaskObjectLocal = taskObject)
    );

    // Assign value
    this.newTaskObject = this.newTaskObjectLocal;
    this.searchList = this.newTaskObjectLocal[0].unlinkedList;
    this.newTaskName = this.newTaskObjectLocal[0].task;

    // Fetch the Todo List from Local Storage

    if (typeof Storage !== "undefined") {
      // Store
      this.previousItems = JSON.parse(
        localStorage.getItem("previousItems")
          ? localStorage.getItem("previousItems")
          : ""
      );
    }
  }

  // Segregate Linked and unlinked tasks
  addToNewList(value, taskName) {
    this.newTaskObject = [];
    let taskList = value;
    let unlinkedTask = [];
    let linkedTask = [];

    for (let i = 0; i < taskList.length; i++) {
      if (taskList[i].word == "") {
        unlinkedTask.push(taskList[i]);
      } else if (this.searchList[i].word == taskName) {
        linkedTask.push(taskList[i]);
      }
    }

    let task = {
      task: taskName,
      linkedList: linkedTask,
      unlinkedList: unlinkedTask,
    };

    this.newTaskObject.push(task);
  }

  // Function for Linking Task
  linkNotes(value, task) {
    for (let i = 0; i < this.previousItems.length; i++) {
      if (this.previousItems[i].sentence == value.sentence) {
        this.previousItems[i].word = task;
      }
    }

    for (let i = 0; i < this.searchList.length; i++) {
      if (this.searchList[i].sentence == value.sentence) {
        this.searchList[i].word = task;
      }
    }

    this.addToNewList(this.searchList, this.newTaskName);
  }

  // Function for Unlinking Task
  unlinkNotes(value) {
    for (let i = 0; i < this.previousItems.length; i++) {
      if (this.previousItems[i].sentence == value.sentence) {
        this.previousItems[i].word = "";
      }
    }

    for (let i = 0; i < this.searchList.length; i++) {
      if (this.searchList[i].sentence == value.sentence) {
        this.searchList[i].word = "";
      }
    }

    this.addToNewList(this.searchList, this.newTaskName);
  }

  // Save to Local Storage
  save() {
    if (typeof Storage !== "undefined") {
      localStorage.setItem("previousItems", JSON.stringify(this.previousItems));
    }
    this.router.navigate(["/"]);
  }
}

import { Component, ViewChild } from "@angular/core";
import { NgbDropdownMenu } from "@ng-bootstrap/ng-bootstrap";
import * as fuzzysort from "fuzzysort";
import FuzzySearch from "fuzzy-search";
import { DataService } from "../data.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent {
  @ViewChild(NgbDropdownMenu, { static: false }) dropdownList: NgbDropdownMenu;

  // Todo List Array Object
  previousItems = [];

  // Eg. of Todo List Array Object

  // previousItems = [
  //   {
  //     sentence:
  //       "The greatest glory in living lies not in never falling, but in rising every time we fall.",
  //     word: "",
  //   },
  //   {
  //     sentence: "The way to get started is to quit talking and begin doing.",
  //     word: "",
  //   },
  //   {
  //     sentence:
  //       "Your time is limited, so don't waste it living someone else's life. Don't be trapped by dogma – which is living with the results of other people's thinking.",
  //     word: "",
  //   },
  //   {
  //     sentence:
  //       "If life were predictable it would cease to be life, and be without flavor.",
  //     word: "",
  //   },
  //   {
  //     sentence:
  //       "If you look at what you have in life, you'll always have more. If you look at what you don't have in life, you'll never have enough.",
  //     word: "",
  //   },
  //   {
  //     sentence:
  //       "If you set your goals ridiculously high and it's a failure, you will fail above everyone else's success.",
  //     word: "",
  //   },
  //   {
  //     sentence: "Life is what happens when you're busy making other plans.",
  //     word: "",
  //   },
  //   {
  //     sentence:
  //       "Spread love everywhere you go. Let no one ever come to you without leaving happier.",
  //     word: "",
  //   },
  //   {
  //     sentence:
  //       "Tell me and I forget. Teach me and I remember. Involve me and I learn.",
  //     word: "",
  //   },
  // ];

  items = [];

  list = [];

  newTaskObject = [];

  value;

  oldTask = "";

  newTask = "";

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

  constructor(private data: DataService, private router: Router) {
    // Fetching the data of Todo List from Local Storage
    if (typeof Storage !== "undefined") {
      // Store
      this.previousItems = JSON.parse(
        localStorage.getItem("previousItems")
          ? localStorage.getItem("previousItems")
          : "[]"
      );
    }
  }

  // Adding to Task to Todo List
  addToOldList() {
    if (this.oldTask == "") {
    } else {
      let items = { sentence: this.removeHash, word: this.hashtag };
      this.previousItems.push(items);
      this.list = this.previousItems;
      this.oldTask = "";
      // Stroing the Todo list object to Local Storage
      if (typeof Storage !== "undefined") {
        // Store
        localStorage.setItem(
          "previousItems",
          JSON.stringify(this.previousItems)
        );
      }
    }
  }

  // Navigating the Todo Task for Bidirectional Linking
  addToNewList() {
    this.newTaskObject = [];

    let unlinkedTask = [];
    let linkedTask = [];

    // If Search Field is empty
    if (this.newTask == "") {
    }
    // Else if Search Field is not empty
    else {
      this.items.push(this.newTask);

      this.searchList = this.list;

      for (let i = 0; i < this.searchList.length; i++) {
        if (this.searchList[i].word == "") {
          unlinkedTask.push(this.searchList[i]);
        } else if (this.searchList[i].word == this.newTask) {
          linkedTask.push(this.searchList[i]);
        }
      }

      let task = {
        task: this.newTask,
        linkedList: linkedTask,
        unlinkedList: unlinkedTask,
      };
      this.newTaskObject.push(task);

      this.list = this.items;
      this.newTaskName = this.newTask;
      this.newTask = "";
      // Passing the object to Task Component
      this.data.changeMessage(this.newTaskObject);

      // Navigating to Task Component
      this.router.navigate(["task/" + this.newTaskName]);
    }
  }

  // Deleting the Task from Todo List
  deleteTask(index, inputBox) {
    if (inputBox == "oldTask") {
      this.previousItems.splice(index, 1);

      // Updating the Local Storage
      if (typeof Storage !== "undefined") {
        localStorage.setItem(
          "previousItems",
          JSON.stringify(this.previousItems)
        );
      }
    } else {
      this.items.splice(index, 1);
      this.list = this.items;
    }
  }

  // ********************************

  // Search Available Tags which have been linked
  searchHashtag(value) {
    this.tagList = [];

    for (let j = 0; j < this.previousItems.length; j++) {
      if (
        this.previousItems[j].word.toLowerCase().includes(value.toLowerCase())
      ) {
        if (this.tagList.includes(this.previousItems[j].sentence)) {
        } else {
          this.tagList.push(this.previousItems[j].sentence);
        }
      }
    }
    this.tagname = value;
    this.searchTag = "";
  }

  // Function for Adding Tag Manually to task by keeping the word in [[]]

  // for eg. Type " Play Cricket Everyday [[sports]] " in Add Todo Field
  // where sports will be tagged or lnked to that particular task.

  searchAndAddTag() {
    this.hashtag = this.oldTask.substring(
      this.oldTask.lastIndexOf("[["),
      this.oldTask.lastIndexOf("]]")
    );

    if (this.hashtag) {
      let length = this.hashtag.length;
      this.hashtag = this.hashtag.substr(2, length);
    }

    this.removeHash = this.oldTask.replace("[[" + this.hashtag + "]]", "");
  }

  // Function for Searching Tags using Npm packages Fuzzy Sort / Fuzzy Search
  search(data) {
    this.list = [];
    this.value = "";

    let results = data;

    // For Fuzzy Sort uncomment the below and comment out the next for loop.

    // for (let i = 0; i < results.length; i++) {
    //   if (this.list.includes(results[i][0]["target"])) {
    //   } else {
    //     this.list.push(results[i][0]["target"]);
    //   }
    // }

    // For Fuzzy Search comment out the above for loop.

    for (let i = 0; i < results.length; i++) {
      if (this.list.includes(results[i]["sentence"])) {
      } else {
        this.list.push(results[i]);
      }
    }

    if (this.newTask == "") {
      this.list = [];
      this.dropdown = false;
    } else {
      this.dropdown = true;
    }

    if (this.list.length <= 0) {
      this.dropdown = false;
    }
  }

  // Use the Enter key for entering todo to list
  tagEnter($event) {
    if ($event.keyCode === 13) {
      this.searchHashtag(this.searchTag);
    }
  }

  // Fucntion for using enter, up arrow , down arrow key for navigating between search results.
  upDown($event, inputBox) {
    if (inputBox == "oldTask") {
      if ($event.keyCode === 13) {
        this.selectOption(this.oldTask, inputBox);
      }
    } else {
      if (this.list.length <= 0) {
        this.dropdown = false;
      }
      if ($event.keyCode === 40) {
        let index = this.list.indexOf(this.value);
        index = index + 1;
        if (index >= this.list.length) {
          index = 0;
        }
        this.value = this.list[index];
      } else if ($event.keyCode === 38) {
        let index = this.list.indexOf(this.value);
        index = index - 1;
        if (index < 0) {
          index = this.list.length - 1;
        }
        this.value = this.list[index];
      } else if ($event.keyCode === 13) {
        this.selectOption(this.value, "newTask");
        this.dropdown = false;
      }
    }
  }

  // For Selecting Todo List
  selectOption(value, inputBox) {
    if (inputBox == "oldTask") {
      this.addToOldList();
    } else {
      this.value = this.newTask;
      this.newTask = this.value;
      this.addToNewList();
    }
  }

  // Close Dropdown of Search
  closeDropdown() {
    this.dropdown = false;
  }

  // Function for Searching TODO Task for Bidirectional Linking
  worker() {
    // For Fuzzy Sort
    // let results = fuzzysort.go(this.newTask, this.previousItems, {
    //   //     keys: ["sentence"],
    //   //   });

    // For Fuzzy Search
    const searcher = new FuzzySearch(this.previousItems, ["sentence"], {
      caseSensitive: false,
      sort: true,
    });
    let results = searcher.search(this.newTask);
    this.search(results);
  }
}

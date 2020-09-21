import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class DataService {
  private messageSource = new BehaviorSubject("");
  currentMessage = this.messageSource.asObservable();

  constructor() {}

  // Pass Data from home component to task component
  changeMessage(taskObject) {
    this.messageSource.next(taskObject);
  }
}

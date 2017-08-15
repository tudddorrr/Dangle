import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { ApiService } from '../services/api/api.service';
import { SnackbarService } from '../services/snackbar/snackbar.service';
import * as _ from 'lodash';
import { isSameDay, differenceInMinutes, getHours } from 'date-fns';

@Component({
  selector: 'app-view-event',
  templateUrl: './view-event.component.html',
  styleUrls: ['./view-event.component.scss']
})
export class ViewEventComponent implements OnInit {
  deletionKey: string = '';
  viewDate: Date = new Date();
  cols: number = 12;
  times: string[] = ['0am', '2am', '4am', '6am', '8am', '10am', '12pm', '2pm', '4pm', '6pm', '8pm', '10pm'];

  constructor(@Inject(MD_DIALOG_DATA) public data: any, public dialogRef: MdDialogRef<ViewEventComponent>, private api: ApiService, private snackbar: SnackbarService) { }

  ngOnInit() {}

  delete() {
    this.dialogRef.close();
  }

  done() {
    this.dialogRef.close();
  }

  getWidth(event: any): number {
    let hours = this.getDuration(event)/(24/this.cols);
    let colWidth = 100/this.cols;
    let width = colWidth * hours;

    if(width + this.getMargin(event) > 100) width = 100-this.getMargin(event);
    return width;
  }

  getMargin(event: any): number {
    let hours = this.getHours(event)/(24/this.cols);
    let colWidth = 100/this.cols;

    return hours*colWidth;
  }

  create() {
    this.dialogRef.close({create: true})
  }

  todaysEvents(): any[] {
    let events: any[] = [];

    for(let event of this.data.events) {
      if(isSameDay(this.data.day.date, event.start)) {
        events.push(event);
        events[events.length-1].useEnd = false;
      } else if(isSameDay(this.data.day.date, event.end)) {
        events.push(event);
        events[events.length-1].useEnd = true;
      }
    }

    return events;
  }

  getDuration(event): number {
    if(event.useEnd) {
      return differenceInMinutes(event.end, this.data.day.date)/60;
    } else {
      return differenceInMinutes(event.end, event.start)/60;
    }
  }

  getHours(event): number {
    if(event.useEnd) {
      return 0;
    } else {
      return getHours(event.start);
    }
  }
}

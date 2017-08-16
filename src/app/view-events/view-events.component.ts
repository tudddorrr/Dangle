import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { ApiService } from '../services/api/api.service';
import { SnackbarService } from '../services/snackbar/snackbar.service';
import * as _ from 'lodash';
import { isSameDay, differenceInMinutes, getHours, isPast } from 'date-fns';

@Component({
  selector: 'app-view-evenst',
  templateUrl: './view-events.component.html',
  styleUrls: ['./view-events.component.scss']
})
export class ViewEventsComponent implements OnInit {
  deletionKey: string = '';
  viewDate: Date = new Date();
  cols: number = 12;
  times: string[] = ['0am', '2am', '4am', '6am', '8am', '10am', '12pm', '2pm', '4pm', '6pm', '8pm', '10pm'];
  events: any[] = [];

  constructor(@Inject(MD_DIALOG_DATA) public data: any, public dialogRef: MdDialogRef<ViewEventsComponent>, private api: ApiService, private snackbar: SnackbarService) { 
    this.setEvents();
  }

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

  setEvents(): void {
    for(let event of this.data.events) {
      if(isSameDay(this.data.day.date, event.start)) {
        this.events.push(event);
        this.events[this.events.length-1].useEnd = false;
      } else if(isSameDay(this.data.day.date, event.end)) {
        this.events.push(event);
        this.events[this.events.length-1].useEnd = true;
      }
    }
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

  isToday(): boolean {
    return isSameDay(new Date(), this.data.day.date);
  }

  isPast(): boolean {
    return isPast(this.data.day.date) && !this.isToday();
  }

  getSessionText(): string {
    return (this.events.length > 1 || this.events.length === 0) ? 'sessions' : 'session';
  }
}

import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { ApiService } from '../services/api/api.service';
import { SnackbarService } from '../services/snackbar/snackbar.service';
import { addMinutes, addHours, setHours, setMinutes, differenceInMinutes, isPast } from 'date-fns';
import * as _ from 'lodash';

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.scss']
})
export class NewEventComponent implements OnInit {
  name: string;
  note: string = '';

  hours: number[] = Array.apply(null, {length: 24}).map(Number.call, Number);
  mins: number[] = [0, 15, 30, 45];
  durHours: number[] = Array.apply(null, {length: 25}).map(Number.call, Number);
  durMins: number[] = [0, 15, 30, 45];

  startHour: number;
  startMins: number;
  addHours: number;
  addMins: number;

  constructor(@Inject(MD_DIALOG_DATA) public data: any, public dialogRef: MdDialogRef<NewEventComponent>, private api: ApiService, private snackbar: SnackbarService) {}

  ngOnInit() {
  }

  addEvent() {
    let start = _.cloneDeep(this.data.day.date);
    start.setHours(this.startHour);
    start.setMinutes(this.startMins);

    let end = _.cloneDeep(start);
    end = addHours(end, this.addHours);
    end = addMinutes(end, this.addMins);

    if(_.isUndefined(start) || _.isUndefined(end)) {
      let snackBarRef = this.snackbar.create('Invalid date time!');
      return;
    }

    if(differenceInMinutes(end, start)<15) {
      let snackBarRef = this.snackbar.create('Play sessions can\'t be less than 15 minutes!');
      return;
    }

    if(isPast(start)) {
      let snackBarRef = this.snackbar.create('That starting time is in the past!');
      return;
    }

    this.api.post('event', {
      title: this.name,
      start: start,
      end: end,
      meta: {
        gameid: this.data.gameid,
        note: this.note
      }
    }).subscribe(data => {
      if(!data.success) {
        let snackBarRef = this.snackbar.create(data.msg);
      } else {
        this.dialogRef.close({event: data.event});
      }
    });
  }

  rand(min: number, max:number) {
    return Math.random() * (max - min) + min;
  }

  cancel() {
    this.dialogRef.close();
  }
}

import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { ApiService } from '../services/api/api.service';
import { SnackbarService } from '../services/snackbar/snackbar.service';
import { addMinutes, addHours } from 'date-fns';

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.scss']
})
export class NewEventComponent implements OnInit {
  name: string;
  startHour: number = 12; startMin: number = 0;
  endHour: number = this.startHour; endMin: number = 0;

  colors: any = {
    red: {
      primary: '#ad2121',
      secondary: '#FAE3E3'
    },
    blue: {
      primary: '#1e90ff',
      secondary: '#D1E8FF'
    },
    yellow: {
      primary: '#e3bc08',
      secondary: '#FDF1BA'
    }
  };

  constructor(@Inject(MD_DIALOG_DATA) public data: any, public dialogRef: MdDialogRef<NewEventComponent>, private api: ApiService, private snackbar: SnackbarService) { 
  }

  ngOnInit() {
  }

  addEvent() {
    let end = new Date();
    end = addMinutes(end, this.rand(10, 90));
    end = addHours(end, this.rand(1, 14));

    this.api.post('event', {
      title: this.name,
      start: new Date(),
      end: end,
      color: this.colors.red,
      meta: {
        gameid: this.data.gameid
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

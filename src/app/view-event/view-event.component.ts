import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { ApiService } from '../services/api/api.service';
import { SnackbarService } from '../services/snackbar/snackbar.service';

@Component({
  selector: 'app-view-event',
  templateUrl: './view-event.component.html',
  styleUrls: ['./view-event.component.scss']
})
export class ViewEventComponent implements OnInit {
  deletionKey: string = '';

  constructor(@Inject(MD_DIALOG_DATA) public data: any, public dialogRef: MdDialogRef<ViewEventComponent>, private api: ApiService, private snackbar: SnackbarService) { }

  ngOnInit() {
  }

  delete() {
    this.dialogRef.close();
  }

  done() {
    this.dialogRef.close();
  }
}

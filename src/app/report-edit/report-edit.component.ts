import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { ApiService } from '../services/api/api.service';
import { SnackbarService } from '../services/snackbar/snackbar.service';

@Component({
  selector: 'app-report-edit',
  templateUrl: './report-edit.component.html',
  styleUrls: ['./report-edit.component.scss']
})
export class ReportEditComponent implements OnInit {
  mode: string = 'Report';
  category: string;
  desc: string;

  constructor(@Inject(MD_DIALOG_DATA) public data: any, public dialogRef: MdDialogRef<ReportEditComponent>, private api: ApiService, private snackbar: SnackbarService) { }

  ngOnInit() {
  }

  submit() {
    if(!this.category || !this.desc) {
      this.snackbar.create("You haven't filled out all the required fields");
      return;
    }

    this.api.post('issue', {mode: this.mode, category: this.category, desc: this.desc, gameid: this.data.game.id}).subscribe(data => {
      if(data.success) {
        this.snackbar.create(this.mode + " successfully received!");
        this.cancel();
      } else {
        this.snackbar.create(data.msg);        
      }
    });
  }

  cancel() {
    this.dialogRef.close();
  }
}

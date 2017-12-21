import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SnackbarService } from '../../services/snackbar/snackbar.service';

@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.scss']
})
export class ReplyComponent implements OnInit {
  @Input() mode: number;
  @Output() submit = new EventEmitter();
  @Output() cancel = new EventEmitter();  

  title: string;
  name: string;
  text: string;

  constructor(private snackbar: SnackbarService) { }

  ngOnInit() {
  }

  addReply() {
    if((!this.title && this.mode==0) || !this.name || !this.text) {
      this.snackbar.create("You haven't filled in all the required fields");
      return;
    }

    this.submit.emit({title: this.title, name: this.name, text: this.text});

    this.title = '';
    this.name = '';
    this.text = '';
  }

  onCancel() {
    this.cancel.emit();    
  }
}

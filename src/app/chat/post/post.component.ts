import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Post } from '../../game/chat';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  @Input() post: Post;
  @Output() report = new EventEmitter;

  constructor() { }

  ngOnInit() {
  }

  onReport() {
    this.report.emit({text: this.post.text});
  }
}

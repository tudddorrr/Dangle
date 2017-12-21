import { Component, OnInit, Input } from '@angular/core';
import { Thread } from '../game/chat';
import { ApiService } from '../services/api/api.service';
import { SnackbarService } from '../services/snackbar/snackbar.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @Input() thread: Thread;
  showPosts: boolean;

  constructor(private api: ApiService, private snackbar: SnackbarService) { }

  ngOnInit() {
  }

  addPost(event) {
    this.api.post('post', {
      threadid: this.thread.id,
      name: event.name,
      text: event.text,
      date: new Date()      
    }).subscribe(data => {
      if(data.success) {
        this.thread.posts.push(data.post);
      } else {
        this.snackbar.create(data.msg);        
      }
    });
  }

  report(isThread, text) {
    this.api.post('issue', {
      mode: 'Report',
      category: isThread ? 'Thread' : 'Post',
      desc: "\"" + text + "\"",
      gameid: this.thread.gameid
    }).subscribe(data => {
      if(data.success) {
        this.snackbar.create('Report successfully received!');
      } else {
        this.snackbar.create(data.msg);
      }
    });
  }
}
